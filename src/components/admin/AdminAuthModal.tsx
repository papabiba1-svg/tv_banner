import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  Key,
  GitBranch,
  FolderGit2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import type { GitHubSettings } from '../../services/githubApi';
import {
  saveStoredSettings,
  validateGitHubAccess,
} from '../../services/githubApi';

interface AdminAuthModalProps {
  initialSettings: GitHubSettings;
  onSuccess: (settings: GitHubSettings) => void;
  onCancel: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  initialSettings,
  onSuccess,
  onCancel,
}) => {
  const [pin, setPin] = useState(initialSettings.pin || '1234');
  const [enteredPin, setEnteredPin] = useState('');
  const [token, setToken] = useState(initialSettings.token || '');
  const [repo, setRepo] = useState(initialSettings.repo || '');
  const [branch, setBranch] = useState(initialSettings.branch || 'main');

  const [showToken, setShowToken] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // If PIN was already set in storage and matches entered pin or first setup
  const isPinConfigured = Boolean(initialSettings.token && initialSettings.repo);

  const handleTestConnection = async () => {
    if (!token.trim() || !repo.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Пожалуйста, укажите токен GitHub и репозиторий (owner/repo).',
      });
      return;
    }

    setIsTesting(true);
    setStatusMessage({ type: 'info', text: 'Проверка подключения к GitHub...' });

    const result = await validateGitHubAccess(token, repo);
    setIsTesting(false);

    if (result.valid) {
      if (result.defaultBranch && !branch) {
        setBranch(result.defaultBranch);
      }
      setStatusMessage({
        type: 'success',
        text: `Подключение успешно! Ветка по умолчанию: ${result.defaultBranch}`,
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || 'Ошибка подключения к репозиторию.',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verify PIN if already configured
    if (isPinConfigured && enteredPin.trim() !== initialSettings.pin) {
      setStatusMessage({
        type: 'error',
        text: 'Неверный PIN-код! Пожалуйста, введите правильный PIN.',
      });
      return;
    }

    if (!token.trim() || !repo.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Токен GitHub и репозиторий обязательны для публикации изменений.',
      });
      return;
    }

    setIsTesting(true);
    const check = await validateGitHubAccess(token, repo);
    setIsTesting(false);

    if (!check.valid) {
      setStatusMessage({
        type: 'error',
        text: `Проверка GitHub: ${check.error}. Всё равно продолжить сохранение?`,
      });
    }

    const newSettings: GitHubSettings = {
      token: token.trim(),
      repo: repo.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, ''),
      branch: (branch || check.defaultBranch || 'main').trim(),
      pin: pin.trim() || '1234',
    };

    saveStoredSettings(newSettings);
    onSuccess(newSettings);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-[#F9F6E8] border-2 border-[#005826] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
      >
        {/* Header Ribbon */}
        <div className="h-2.5 w-full mta-stripes" />

        <div className="p-6 md:p-8 space-y-5">
          {/* Title with icon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#005826] text-[#F4C414] flex items-center justify-center shadow-md">
                <ShieldCheck size={26} />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-[#005826] uppercase font-display leading-tight">
                  MTA Вход в админ-панель
                </h3>
                <p className="text-xs text-[#005826]/70 font-semibold">
                  Управление меню и синхронизация с GitHub Pages
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              title="Закрыть"
              className="text-[#005826]/50 hover:text-[#005826] font-bold text-lg p-1"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* PIN Check (if already set) */}
            {isPinConfigured ? (
              <div>
                <label className="block text-xs font-black uppercase text-[#005826] mb-1">
                  PIN-код администратора
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 text-[#005826]/50" size={18} />
                  <input
                    type="password"
                    placeholder="Введите PIN (по умолчанию: 1234)"
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#005826]/30 rounded-xl font-mono text-base font-bold text-[#005826] focus:outline-none focus:ring-2 focus:ring-[#005826]"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-black uppercase text-[#005826] mb-1">
                  Установите PIN-код администратора
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 text-[#005826]/50" size={18} />
                  <input
                    type="text"
                    placeholder="Например: 1234"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#005826]/30 rounded-xl font-mono text-base font-bold text-[#005826] focus:outline-none focus:ring-2 focus:ring-[#005826]"
                    required
                  />
                </div>
              </div>
            )}

            {/* GitHub Repo */}
            <div>
              <label className="block text-xs font-black uppercase text-[#005826] mb-1">
                Репозиторий GitHub (owner/repo)
              </label>
              <div className="relative">
                <FolderGit2 className="absolute left-3.5 top-3 text-[#005826]/50" size={18} />
                <input
                  type="text"
                  placeholder="Например: username/tv-banner"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#005826]/30 rounded-xl text-sm font-semibold text-[#005826] focus:outline-none focus:ring-2 focus:ring-[#005826]"
                  required
                />
              </div>
            </div>

            {/* GitHub Personal Access Token */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-black uppercase text-[#005826]">
                  Персональный токен GitHub (PAT)
                </label>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo&description=MTA+Menu+Board+Admin"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-[#005826] hover:underline flex items-center gap-1"
                >
                  <span>Создать токен</span>
                  <ExternalLink size={11} />
                </a>
              </div>
              <div className="relative">
                <Key className="absolute left-3.5 top-3 text-[#005826]/50" size={18} />
                <input
                  type={showToken ? 'text' : 'password'}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#005826]/30 rounded-xl text-sm font-mono text-[#005826] focus:outline-none focus:ring-2 focus:ring-[#005826]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-3 text-[#005826]/50 hover:text-[#005826]"
                >
                  {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-[#005826]/60 mt-1">
                Права токена: <code>repo</code> или <code>contents:write</code>. Сохраняется безопасно только локально в браузере (localStorage).
              </p>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-black uppercase text-[#005826] mb-1">
                Ветка (Branch)
              </label>
              <div className="relative">
                <GitBranch className="absolute left-3.5 top-3 text-[#005826]/50" size={18} />
                <input
                  type="text"
                  placeholder="main"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-[#005826]/30 rounded-xl text-sm font-semibold text-[#005826] focus:outline-none focus:ring-2 focus:ring-[#005826]"
                />
              </div>
            </div>

            {/* Status Message */}
            {statusMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : statusMessage.type === 'error'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="flex-1 py-2.5 px-4 bg-white border-2 border-[#005826] text-[#005826] hover:bg-[#005826]/10 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isTesting ? 'Проверка...' : 'Проверить соединение'}
              </button>

              <button
                type="submit"
                disabled={isTesting}
                className="flex-1 py-2.5 px-4 bg-[#005826] text-[#F4C414] hover:bg-[#00421C] rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                Войти и сохранить
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
