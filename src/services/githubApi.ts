export interface GitHubSettings {
  token: string;
  repo: string; // "owner/repo"
  branch: string; // "main"
  pin: string;
}

export const STORAGE_KEY_SETTINGS = 'mta_admin_gh_settings';
export const STORAGE_KEY_AUTH = 'mta_admin_auth_timestamp';
export const DEFAULT_PIN = '1234';

export function getStoredSettings(): GitHubSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Не удалось прочитать настройки GitHub:', e);
  }
  return {
    token: '',
    repo: 'papabiba1-svg/tv_banner',
    branch: 'main',
    pin: DEFAULT_PIN,
  };
}

export function saveStoredSettings(settings: GitHubSettings): void {
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
}

export function utf8ToBase64(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

export function base64ToUtf8(str: string): string {
  const clean = str.replace(/\s/g, '');
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(clean), (c: string) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
}

/**
 * Validates token and repo access via GitHub API
 */
export async function validateGitHubAccess(
  token: string,
  repo: string
): Promise<{ valid: boolean; defaultBranch: string; error?: string }> {
  const cleanRepo = repo.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
  if (!cleanRepo || !cleanRepo.includes('/')) {
    return { valid: false, defaultBranch: 'main', error: 'Репозиторий должен быть в формате "пользователь/репозиторий" (owner/repo).' };
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${cleanRepo}`, {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        return { valid: false, defaultBranch: 'main', error: 'Неверный токен GitHub (401 Unauthorized).' };
      }
      if (res.status === 404) {
        return { valid: false, defaultBranch: 'main', error: `Репозиторий "${cleanRepo}" не найден или у токена нет доступа к нему.` };
      }
      return { valid: false, defaultBranch: 'main', error: `Ошибка GitHub API: ${res.statusText}` };
    }

    const data = await res.json();
    return { valid: true, defaultBranch: data.default_branch || 'main' };
  } catch (err: any) {
    return { valid: false, defaultBranch: 'main', error: err.message || 'Ошибка сети' };
  }
}

/**
 * Fetch a file from GitHub repository
 */
export async function getGitHubFile(
  repo: string,
  path: string,
  branch: string,
  token: string
): Promise<{ sha: string | null; content: string | null; error?: string }> {
  const cleanRepo = repo.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
  try {
    const res = await fetch(
      `https://api.github.com/repos/${cleanRepo}/contents/${path}?ref=${branch}&_t=${Date.now()}`,
      {
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (res.status === 404) {
      return { sha: null, content: null };
    }

    if (!res.ok) {
      return { sha: null, content: null, error: `Ошибка получения ${path}: ${res.statusText}` };
    }

    const data = await res.json();
    const content = base64ToUtf8(data.content);
    return { sha: data.sha, content };
  } catch (err: any) {
    return { sha: null, content: null, error: err.message };
  }
}

/**
 * Create or update a file in GitHub repository
 */
export async function uploadOrUpdateGitHubFile(
  repo: string,
  path: string,
  contentBase64: string,
  commitMessage: string,
  branch: string,
  token: string,
  providedSha?: string
): Promise<{ success: boolean; commitUrl?: string; error?: string }> {
  const cleanRepo = repo.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
  let sha = providedSha;

  // If SHA was not provided, look up the existing file to get its SHA
  if (!sha) {
    const existing = await getGitHubFile(cleanRepo, path, branch, token);
    if (existing.sha) {
      sha = existing.sha;
    }
  }

  const payload: any = {
    message: commitMessage,
    content: contentBase64,
    branch: branch,
  };
  if (sha) {
    payload.sha = sha;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${cleanRepo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || `HTTP ${res.status}` };
    }

    return {
      success: true,
      commitUrl: data.commit?.html_url || `https://github.com/${cleanRepo}`,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Ошибка соединения' };
  }
}

/**
 * Client-side image compressor:
 * Resizes image to maximum dimensions while preserving aspect ratio & PNG transparency.
 * Returns raw base64 string (without "data:image/png;base64," prefix) ready for GitHub API.
 */
export function compressImageForMenu(
  file: File,
  maxDimension = 800
): Promise<{ base64: string; dataUrl: string; filename: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Не удалось инициализировать Canvas'));
        }

        // Draw transparent PNG
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Export as PNG to preserve transparent plate background
        const dataUrl = canvas.toDataURL('image/png', 0.92);
        const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');

        // Generate sanitized filename
        const safeName = file.name
          .toLowerCase()
          .replace(/[^a-z0-9.]/g, '-')
          .replace(/-+/g, '-');
        const filename = safeName.endsWith('.png') ? safeName : `${safeName}.png`;

        resolve({ base64, dataUrl, filename });
      };
      img.onerror = () => reject(new Error('Не удалось загрузить изображение'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
    reader.readAsDataURL(file);
  });
}
