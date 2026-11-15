import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Generate MTA Food House Round Logo
async function generateLogo() {
  const size = 600;
  const svg = `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Gradients -->
      <radialGradient id="greenBg" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stop-color="#006b30"/>
        <stop offset="70%" stop-color="#005826"/>
        <stop offset="100%" stop-color="#003e1b"/>
      </radialGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFE066"/>
        <stop offset="45%" stop-color="#F4C414"/>
        <stop offset="100%" stop-color="#D9AB07"/>
      </linearGradient>
      <linearGradient id="creamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#F9F6E8"/>
      </linearGradient>
      <!-- Shadow -->
      <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#00220c" flood-opacity="0.45"/>
      </filter>
      <!-- Diagonal Stripes Pattern for Ring -->
      <pattern id="diagonalStripes" width="30" height="30" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <rect width="10" height="30" fill="#005826"/>
        <rect x="10" width="5" height="30" fill="#FFFFFF"/>
        <rect x="15" width="10" height="30" fill="#F4C414"/>
        <rect x="25" width="5" height="30" fill="#FFFFFF"/>
      </pattern>
    </defs>

    <!-- Outer Glow / Shadow Base -->
    <circle cx="300" cy="300" r="280" fill="url(#goldGrad)" filter="url(#logoShadow)"/>

    <!-- Striped Outer Ring -->
    <circle cx="300" cy="300" r="270" fill="url(#diagonalStripes)"/>

    <!-- Gold Accent Ring -->
    <circle cx="300" cy="300" r="240" fill="none" stroke="url(#goldGrad)" stroke-width="6"/>
    <circle cx="300" cy="300" r="232" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="6,4"/>

    <!-- Inner Dark Green Shield -->
    <circle cx="300" cy="300" r="226" fill="url(#greenBg)"/>

    <!-- Circular Decorative Ribbons / Text Paths -->
    <path id="textArcTop" d="M 120 300 A 180 180 0 0 1 480 300" fill="none"/>
    <path id="textArcBottom" d="M 465 300 A 165 165 0 0 1 135 300" fill="none"/>

    <!-- Stars & Olive Branch Accents -->
    <g fill="#F4C414">
      <polygon points="300,105 304,115 315,115 306,122 310,132 300,126 290,132 294,122 285,115 296,115" />
      <polygon points="265,115 268,122 276,122 270,127 272,135 265,130 258,135 260,127 254,122 262,122" />
      <polygon points="335,115 338,122 346,122 340,127 342,135 335,130 328,135 330,127 324,122 332,122" />
    </g>

    <!-- Chef Hat / Cloche Icon Top -->
    <g transform="translate(265, 140) scale(0.7)" fill="url(#goldGrad)">
      <path d="M50 8 C30 8 18 24 22 42 C12 46 8 58 14 68 C8 76 12 88 24 90 L76 90 C88 88 92 76 86 68 C92 58 88 46 78 42 C82 24 70 8 50 8 Z" fill="#F4C414" opacity="0.95"/>
      <rect x="22" y="93" width="56" height="10" rx="4" fill="#FFFFFF"/>
      <rect x="25" y="96" width="50" height="4" rx="2" fill="#005826"/>
    </g>

    <!-- Central "MTA" Brand Typography -->
    <text x="300" y="295" font-family="'Montserrat', 'Arial Black', sans-serif" font-weight="900" font-size="94" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">
      MTA
    </text>

    <!-- Yellow Underline Ribbon -->
    <rect x="180" y="312" width="240" height="8" rx="4" fill="url(#goldGrad)"/>

    <!-- "FOOD HOUSE" Banner -->
    <rect x="150" y="330" width="300" height="46" rx="23" fill="#F4C414"/>
    <text x="300" y="362" font-family="'Montserrat', sans-serif" font-weight="900" font-size="28" fill="#00421C" text-anchor="middle" letter-spacing="5">
      FOOD HOUSE
    </text>

    <!-- Bottom Slogan -->
    <text x="300" y="420" font-family="'Montserrat', sans-serif" font-weight="700" font-size="19" fill="#F9F6E8" text-anchor="middle" letter-spacing="3" opacity="0.9">
      AUTHENTIC TASTE • EST. 2024
    </text>

    <!-- Fork & Knife crossed below -->
    <g transform="translate(275, 435) scale(0.5)" stroke="#F4C414" stroke-width="4" stroke-linecap="round" fill="none">
      <line x1="20" y1="20" x2="80" y2="80"/>
      <line x1="80" y1="20" x2="20" y2="80"/>
      <circle cx="50" cy="50" r="10" fill="#F4C414"/>
    </g>
  </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.resolve('public/logo.png'));
  console.log('✓ Generated public/logo.png');
}

// Helper to create a realistic transparent PNG food plate
async function generatePlatePNG(filename, dishRenderer) {
  const width = 800;
  const height = 800;
  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Plate realistic drop shadow -->
      <radialGradient id="plateShadow" cx="50%" cy="55%" r="48%">
        <stop offset="60%" stop-color="#00180a" stop-opacity="0.38"/>
        <stop offset="85%" stop-color="#00180a" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#00180a" stop-opacity="0"/>
      </radialGradient>

      <!-- Ceramic plate gradients -->
      <radialGradient id="rimGrad" cx="38%" cy="32%" r="65%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="75%" stop-color="#F2EFE6"/>
        <stop offset="95%" stop-color="#DDD8CB"/>
        <stop offset="100%" stop-color="#C2BCAC"/>
      </radialGradient>

      <radialGradient id="innerPlateGrad" cx="42%" cy="38%" r="58%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="65%" stop-color="#FAF8F2"/>
        <stop offset="90%" stop-color="#E8E4D7"/>
        <stop offset="100%" stop-color="#D5CFBE"/>
      </radialGradient>

      <!-- Golden edge trim -->
      <linearGradient id="plateGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFE885"/>
        <stop offset="50%" stop-color="#F4C414"/>
        <stop offset="100%" stop-color="#C79900"/>
      </linearGradient>

      <!-- Food specific filters & gradients -->
      <filter id="foodDrop" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="3" dy="8" stdDeviation="7" flood-color="#2a1f0a" flood-opacity="0.35"/>
      </filter>
      <radialGradient id="doughGrad" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stop-color="#FFF5D6"/>
        <stop offset="60%" stop-color="#F8E5A7"/>
        <stop offset="90%" stop-color="#E5C77A"/>
        <stop offset="100%" stop-color="#CFA854"/>
      </radialGradient>
      <radialGradient id="friedDoughGrad" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stop-color="#FFE9B3"/>
        <stop offset="45%" stop-color="#F3BD68"/>
        <stop offset="80%" stop-color="#D78627"/>
        <stop offset="100%" stop-color="#9E4E09"/>
      </radialGradient>
      <radialGradient id="sourCreamGrad" cx="40%" cy="35%" r="55%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="75%" stop-color="#F4F4EE"/>
        <stop offset="100%" stop-color="#DCDCD2"/>
      </radialGradient>
      <linearGradient id="onionGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#C97A1E"/>
        <stop offset="50%" stop-color="#8F4809"/>
        <stop offset="100%" stop-color="#5E2C03"/>
      </linearGradient>
      <linearGradient id="herbGreen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4E9E2C"/>
        <stop offset="100%" stop-color="#1B5907"/>
      </linearGradient>
      <radialGradient id="berryRed" cx="35%" cy="35%" r="60%">
        <stop offset="0%" stop-color="#FF385C"/>
        <stop offset="60%" stop-color="#B80C28"/>
        <stop offset="100%" stop-color="#6E0013"/>
      </radialGradient>
    </defs>

    <!-- 1. Ambient Drop Shadow on Table/Background -->
    <ellipse cx="400" cy="445" rx="350" ry="260" fill="url(#plateShadow)"/>

    <!-- 2. Ceramic Plate Outer Rim -->
    <circle cx="400" cy="400" r="330" fill="url(#rimGrad)"/>
    <circle cx="400" cy="400" r="330" fill="none" stroke="url(#plateGoldRim)" stroke-width="4" opacity="0.85"/>
    <circle cx="400" cy="400" r="318" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.9"/>

    <!-- 3. Inner Plate Basin (depressed well) -->
    <circle cx="400" cy="400" r="245" fill="url(#innerPlateGrad)"/>
    <circle cx="400" cy="400" r="245" fill="none" stroke="#D3CCA8" stroke-width="3" opacity="0.6"/>

    <!-- 4. Dish Content Inside Plate (Food Graphics) -->
    <g id="dish-elements" filter="url(#foodDrop)">
      ${dishRenderer}
    </g>

    <!-- 5. Fresh Herbs Garnish & Gloss on Plate Rim -->
    <path d="M 180 200 A 310 310 0 0 1 450 95" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.45"/>
  </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.resolve(`public/dishes/${filename}`));
  console.log(`✓ Generated public/dishes/${filename}`);
}

// 1. Wareniki mit Kartoffel
function renderWarenikiKartoffel() {
  return `
    <!-- Dumplings arranged neatly -->
    <!-- Dumpling 1 -->
    <g transform="translate(240, 260) rotate(-20)">
      <path d="M 0 50 C 0 10, 80 0, 140 30 C 180 50, 190 90, 150 110 C 90 120, 20 100, 0 50 Z" fill="url(#doughGrad)"/>
      <path d="M 15 45 Q 40 20 70 30 T 130 45" fill="none" stroke="#D5B064" stroke-width="4" stroke-dasharray="8,6"/>
      <!-- Fried Onion on top -->
      <path d="M 50 40 Q 80 30 110 50" stroke="url(#onionGold)" stroke-width="6" stroke-linecap="round"/>
    </g>

    <!-- Dumpling 2 -->
    <g transform="translate(360, 240) rotate(15)">
      <path d="M 0 50 C 0 10, 80 0, 140 30 C 180 50, 190 90, 150 110 C 90 120, 20 100, 0 50 Z" fill="url(#doughGrad)"/>
      <path d="M 15 45 Q 40 20 70 30 T 130 45" fill="none" stroke="#D5B064" stroke-width="4" stroke-dasharray="8,6"/>
      <path d="M 40 45 Q 70 35 100 55" stroke="url(#onionGold)" stroke-width="7" stroke-linecap="round"/>
    </g>

    <!-- Dumpling 3 -->
    <g transform="translate(220, 360) rotate(-45)">
      <path d="M 0 50 C 0 10, 80 0, 140 30 C 180 50, 190 90, 150 110 C 90 120, 20 100, 0 50 Z" fill="url(#doughGrad)"/>
      <path d="M 15 45 Q 40 20 70 30 T 130 45" fill="none" stroke="#D5B064" stroke-width="4" stroke-dasharray="8,6"/>
      <path d="M 60 40 Q 90 25 120 50" stroke="url(#onionGold)" stroke-width="6" stroke-linecap="round"/>
    </g>

    <!-- Dumpling 4 -->
    <g transform="translate(340, 370) rotate(5)">
      <path d="M 0 50 C 0 10, 80 0, 140 30 C 180 50, 190 90, 150 110 C 90 120, 20 100, 0 50 Z" fill="url(#doughGrad)"/>
      <path d="M 15 45 Q 40 20 70 30 T 130 45" fill="none" stroke="#D5B064" stroke-width="4" stroke-dasharray="8,6"/>
      <path d="M 45 42 Q 75 30 115 48" stroke="url(#onionGold)" stroke-width="6" stroke-linecap="round"/>
    </g>

    <!-- Dumpling 5 Center -->
    <g transform="translate(290, 310) rotate(-5)">
      <path d="M 0 50 C 0 10, 80 0, 140 30 C 180 50, 190 90, 150 110 C 90 120, 20 100, 0 50 Z" fill="url(#doughGrad)"/>
      <path d="M 15 45 Q 40 20 70 30 T 130 45" fill="none" stroke="#D5B064" stroke-width="4" stroke-dasharray="8,6"/>
      <path d="M 50 35 Q 85 22 120 45" stroke="url(#onionGold)" stroke-width="8" stroke-linecap="round"/>
    </g>

    <!-- Sour Cream Ceramic Dip Bowl Center-Right -->
    <g transform="translate(450, 320)">
      <circle cx="50" cy="50" r="58" fill="#D3CCA8" opacity="0.4"/>
      <circle cx="48" cy="48" r="54" fill="#FFFFFF" stroke="#D9D4C3" stroke-width="3"/>
      <circle cx="48" cy="48" r="44" fill="url(#sourCreamGrad)"/>
      <!-- Fresh Dill on Dip -->
      <path d="M 40 40 Q 48 30 56 46" stroke="#2B7812" stroke-width="3" stroke-linecap="round"/>
      <path d="M 44 48 Q 50 56 48 42" stroke="#2B7812" stroke-width="3" stroke-linecap="round"/>
    </g>

    <!-- Caramelized Onions Scattered -->
    <g stroke="url(#onionGold)" stroke-width="5" stroke-linecap="round">
      <path d="M 280 290 Q 310 270 330 295"/>
      <path d="M 330 360 Q 360 340 390 355"/>
      <path d="M 260 410 Q 290 390 310 420"/>
      <path d="M 390 290 Q 420 275 435 300"/>
    </g>

    <!-- Fresh Dill / Herb Flecks -->
    <g fill="#2B7812">
      <circle cx="280" cy="270" r="3"/>
      <circle cx="320" cy="250" r="2.5"/>
      <circle cx="370" cy="310" r="3"/>
      <circle cx="300" cy="350" r="3"/>
      <circle cx="340" cy="410" r="2.5"/>
      <circle cx="250" cy="380" r="3"/>
      <circle cx="420" cy="380" r="2.5"/>
    </g>
  `;
}

// 2. Pelmeni Sibirisch
function renderPelmeniSibirisch() {
  const pelmeniPositions = [
    [260, 260, -15], [330, 230, 20], [420, 250, 45],
    [230, 330, -35], [310, 310, 5],  [400, 320, -10], [470, 340, 25],
    [270, 410, 15],  [360, 400, -25], [440, 420, 10], [330, 470, 30]
  ];

  let items = pelmeniPositions.map(([x, y, r]) => `
    <g transform="translate(${x}, ${y}) rotate(${r})">
      <!-- Dumpling Ring / Round Pelmen fold -->
      <ellipse cx="40" cy="35" rx="38" ry="32" fill="url(#doughGrad)"/>
      <!-- Fold crease -->
      <path d="M 12 35 Q 40 15 68 35" fill="none" stroke="#D3B068" stroke-width="3"/>
      <!-- Ear pinch joining -->
      <circle cx="40" cy="50" r="8" fill="#F0DC9B" stroke="#C49F50" stroke-width="2"/>
      <!-- Cracked Black Pepper speck -->
      <circle cx="35" cy="28" r="1.5" fill="#222"/>
      <circle cx="48" cy="32" r="1.2" fill="#222"/>
    </g>
  `).join('');

  return `
    ${items}
    <!-- Melting Butter Glaze -->
    <path d="M 320 320 Q 370 300 400 340 Q 370 380 320 350 Z" fill="#FFEAA0" opacity="0.6"/>

    <!-- Sour Cream Center Dish -->
    <g transform="translate(350, 330)">
      <circle cx="40" cy="40" r="46" fill="#D3CCA8" opacity="0.3"/>
      <circle cx="38" cy="38" r="42" fill="#FFFFFF" stroke="#D9D4C3" stroke-width="2.5"/>
      <circle cx="38" cy="38" r="34" fill="url(#sourCreamGrad)"/>
      <path d="M 30 34 Q 38 26 44 38" stroke="#1B5907" stroke-width="3" stroke-linecap="round"/>
    </g>

    <!-- Lots of Fresh Herbs & Ground Pepper -->
    <g fill="#1B5907">
      <circle cx="280" cy="240" r="2.5"/>
      <circle cx="350" cy="270" r="3"/>
      <circle cx="410" cy="290" r="2.5"/>
      <circle cx="290" cy="360" r="3"/>
      <circle cx="440" cy="380" r="3"/>
      <circle cx="360" cy="440" r="2.5"/>
    </g>
    <!-- Bay leaf garnish -->
    <path d="M 480 270 Q 510 260 520 290 Q 500 310 470 290 Z" fill="#3D6E18" stroke="#254B0B" stroke-width="1.5"/>
  `;
}

// 3. Wareniki mit Sauerkirschen
function renderWarenikiKirsche() {
  return `
    <!-- Dumplings with red blush inside -->
    <g transform="translate(250, 260) rotate(-15)">
      <path d="M 0 50 C 0 10, 80 0, 140 30 C 180 50, 190 90, 150 110 C 90 120, 20 100, 0 50 Z" fill="url(#doughGrad)"/>
      <!-- Juicy cherry glow inside translucent dough -->
      <ellipse cx="80" cy="60" rx="35" ry="25" fill="#B80C28" opacity="0.35"/>
      <path d="M 15 45 Q 40 20 70 30 T 130 45" fill="none" stroke="#D5B064" stroke-width="4" stroke-dasharray="8,6"/>
    </g>

    <g transform="translate(370, 270) rotate(20)">
      <path d="M 0 50 C 0 10, 80 0, 140 30 C 180 50, 190 90, 150 110 C 90 120, 20 100, 0 50 Z" fill="url(#doughGrad)"/>
      <ellipse cx="80" cy="60" rx="35" ry="25" fill="#B80C28" opacity="0.35"/>
      <path d="M 15 45 Q 40 20 70 30 T 130 45" fill="none" stroke="#D5B064" stroke-width="4" stroke-dasharray="8,6"/>
    </g>

    <g transform="translate(280, 360) rotate(-5)">
      <path d="M 0 50 C 0 10, 80 0, 140 30 C 180 50, 190 90, 150 110 C 90 120, 20 100, 0 50 Z" fill="url(#doughGrad)"/>
      <ellipse cx="80" cy="60" rx="35" ry="25" fill="#B80C28" opacity="0.4"/>
      <path d="M 15 45 Q 40 20 70 30 T 130 45" fill="none" stroke="#D5B064" stroke-width="4" stroke-dasharray="8,6"/>
    </g>

    <!-- Cherry Sauce Coulis Swirls -->
    <path d="M 220 330 Q 300 290 380 340 Q 450 380 480 320" fill="none" stroke="url(#berryRed)" stroke-width="12" stroke-linecap="round" opacity="0.85"/>
    <path d="M 260 410 Q 340 450 430 410" fill="none" stroke="url(#berryRed)" stroke-width="8" stroke-linecap="round" opacity="0.85"/>

    <!-- Fresh Cherries with Stems -->
    <g transform="translate(440, 250)">
      <circle cx="30" cy="40" r="22" fill="url(#berryRed)"/>
      <circle cx="56" cy="48" r="20" fill="url(#berryRed)"/>
      <!-- Stems joined -->
      <path d="M 30 20 Q 40 5 55 2" stroke="#486B1A" stroke-width="3" fill="none"/>
      <path d="M 56 28 Q 50 12 55 2" stroke="#486B1A" stroke-width="3" fill="none"/>
    </g>

    <!-- Mint Leaves -->
    <path d="M 420 230 Q 400 215 410 200 Q 430 205 435 225 Z" fill="#3D991C"/>
    <path d="M 430 225 Q 445 205 460 215 Q 450 235 430 225 Z" fill="#4FB326"/>

    <!-- Powdered Sugar Dusting -->
    <g fill="#FFFFFF" opacity="0.85">
      <circle cx="320" cy="290" r="1.5"/><circle cx="330" cy="285" r="1.2"/>
      <circle cx="350" cy="300" r="1.8"/><circle cx="310" cy="320" r="1.4"/>
      <circle cx="380" cy="310" r="1.5"/><circle cx="410" cy="330" r="1.6"/>
      <circle cx="340" cy="390" r="1.7"/><circle cx="360" cy="380" r="1.3"/>
    </g>
  `;
}

// 4. MTA House Burger
function renderHouseBurger() {
  return `
    <!-- Side of Golden Crispy French Fries -->
    <g transform="translate(210, 270) rotate(-15)">
      <rect x="0" y="0" width="12" height="110" rx="3" fill="#F4C414" stroke="#D19E05" stroke-width="2"/>
      <rect x="18" y="10" width="12" height="105" rx="3" fill="#FFDA47" stroke="#D19E05" stroke-width="2"/>
      <rect x="35" y="5" width="12" height="115" rx="3" fill="#F4C414" stroke="#D19E05" stroke-width="2"/>
      <rect x="52" y="15" width="12" height="100" rx="3" fill="#E6B104" stroke="#B88A00" stroke-width="2"/>
      <rect x="10" y="30" width="105" height="12" rx="3" transform="rotate(25)" fill="#FFDA47" stroke="#D19E05" stroke-width="2"/>
    </g>

    <!-- Gourmet Burger in Center -->
    <g transform="translate(360, 240)">
      <!-- Bottom Brioche Bun -->
      <ellipse cx="140" cy="210" rx="125" ry="42" fill="#E89B35" stroke="#BF7617" stroke-width="3"/>

      <!-- Burger Sauce Layer -->
      <path d="M 30 195 Q 140 215 250 195" stroke="#E65100" stroke-width="12" stroke-linecap="round"/>

      <!-- Juicy Angus Beef Patty -->
      <rect x="20" y="155" width="240" height="42" rx="18" fill="#4E2711" stroke="#331707" stroke-width="2"/>
      <!-- Patty grill marks -->
      <line x1="60" y1="160" x2="80" y2="195" stroke="#261003" stroke-width="4"/>
      <line x1="120" y1="160" x2="140" y2="195" stroke="#261003" stroke-width="4"/>
      <line x1="180" y1="160" x2="200" y2="195" stroke="#261003" stroke-width="4"/>

      <!-- Melted Cheddar Drip -->
      <path d="M 25 155 Q 70 175 110 150 Q 150 185 200 155 Q 240 170 255 155 L 245 145 L 35 145 Z" fill="#FFA000"/>
      <path d="M 90 160 C 95 190, 115 190, 120 160" fill="#FFB300"/>
      <path d="M 180 160 C 185 195, 205 195, 210 160" fill="#FFB300"/>

      <!-- Crispy Bacon Strip -->
      <path d="M 35 140 Q 80 130 140 145 Q 200 130 245 140" stroke="#8A1C14" stroke-width="10" stroke-linecap="round"/>

      <!-- Sliced Pickles & Red Onion -->
      <ellipse cx="75" cy="132" rx="28" ry="12" fill="#689F38" stroke="#33691E" stroke-width="2"/>
      <ellipse cx="140" cy="130" rx="30" ry="12" fill="#689F38" stroke="#33691E" stroke-width="2"/>
      <path d="M 170 130 Q 210 120 230 135" stroke="#8E24AA" stroke-width="5" stroke-linecap="round"/>

      <!-- Ripe Red Tomatoes -->
      <ellipse cx="90" cy="118" rx="65" ry="16" fill="#D32F2F"/>
      <ellipse cx="180" cy="116" rx="65" ry="16" fill="#E53935"/>

      <!-- Ruffled Green Lettuce -->
      <path d="M 15 115 C 30 100, 60 130, 90 108 C 120 130, 160 100, 190 125 C 220 100, 255 125, 270 110 L 260 95 L 25 95 Z" fill="#4CAF50"/>

      <!-- Glossy Brioche Top Bun -->
      <path d="M 25 95 C 25 20, 140 5, 255 95 Z" fill="#F2A641" stroke="#C47915" stroke-width="3"/>
      <!-- Bun Highlight -->
      <path d="M 65 55 Q 140 25 210 50" stroke="#FFE082" stroke-width="8" stroke-linecap="round" opacity="0.6"/>

      <!-- Sesame Seeds -->
      <g fill="#FFF9C4">
        <ellipse cx="80" cy="65" rx="3" ry="5" transform="rotate(-30 80 65)"/>
        <ellipse cx="120" cy="45" rx="3" ry="5" transform="rotate(10 120 45)"/>
        <ellipse cx="160" cy="40" rx="3" ry="5" transform="rotate(-15 160 40)"/>
        <ellipse cx="200" cy="60" rx="3" ry="5" transform="rotate(25 200 60)"/>
        <ellipse cx="100" cy="75" rx="3" ry="5" transform="rotate(5 100 75)"/>
        <ellipse cx="150" cy="65" rx="3" ry="5" transform="rotate(-20 150 65)"/>
        <ellipse cx="185" cy="75" rx="3" ry="5" transform="rotate(15 185 75)"/>
      </g>
    </g>
  `;
}

// 5. Crispy Chicken Burger
function renderCrispyChickenBurger() {
  return `
    <g transform="translate(290, 240)">
      <!-- Bottom Bun -->
      <ellipse cx="130" cy="210" rx="125" ry="40" fill="#E89B35" stroke="#BF7617" stroke-width="3"/>

      <!-- Creamy Garlic Dip Base -->
      <path d="M 30 198 Q 130 215 230 198" stroke="#FFF9C4" stroke-width="12" stroke-linecap="round"/>

      <!-- Golden Crispy Fried Chicken Breast -->
      <path d="M 15 170 Q 60 145 120 175 Q 190 145 250 170 Q 235 205 130 205 Q 25 205 15 170 Z" fill="url(#friedDoughGrad)" stroke="#A05206" stroke-width="3"/>
      <!-- Crunchy Flakes / Texture -->
      <circle cx="50" cy="175" r="4" fill="#6B3300"/>
      <circle cx="110" cy="180" r="5" fill="#6B3300"/>
      <circle cx="180" cy="175" r="4.5" fill="#6B3300"/>
      <circle cx="220" cy="175" r="4" fill="#6B3300"/>

      <!-- Melted White Cheddar -->
      <path d="M 35 155 Q 130 170 230 155" stroke="#FFF59D" stroke-width="10" stroke-linecap="round"/>

      <!-- Tangy Red Cabbage / Coleslaw Slaw -->
      <path d="M 30 140 Q 80 120 140 145 Q 200 120 240 140" stroke="#7B1FA2" stroke-width="10" stroke-linecap="round"/>
      <path d="M 50 135 Q 120 115 210 135" stroke="#81C784" stroke-width="8" stroke-linecap="round"/>

      <!-- Sweet Honey Mustard Swirl -->
      <path d="M 40 125 Q 130 140 220 125" stroke="#FBC02D" stroke-width="8" stroke-linecap="round"/>

      <!-- Fresh Crunchy Lettuce -->
      <path d="M 20 120 C 40 100, 70 125, 110 105 C 150 125, 190 100, 230 120 L 220 95 L 30 95 Z" fill="#66BB6A"/>

      <!-- Golden Brioche Top Bun -->
      <path d="M 25 95 C 25 20, 130 5, 235 95 Z" fill="#F2A641" stroke="#C47915" stroke-width="3"/>
      <path d="M 55 55 Q 130 25 195 50" stroke="#FFE082" stroke-width="8" stroke-linecap="round" opacity="0.6"/>

      <!-- Black & White Sesame -->
      <g fill="#FFF9C4">
        <ellipse cx="70" cy="65" rx="3" ry="5"/>
        <ellipse cx="110" cy="45" rx="3" ry="5"/>
        <ellipse cx="150" cy="40" rx="3" ry="5"/>
        <ellipse cx="190" cy="60" rx="3" ry="5"/>
      </g>
      <g fill="#212121">
        <ellipse cx="90" cy="55" rx="2.5" ry="4"/>
        <ellipse cx="130" cy="60" rx="2.5" ry="4"/>
        <ellipse cx="170" cy="50" rx="2.5" ry="4"/>
      </g>
    </g>
  `;
}

// 6. Gebratene Pelmeni (Pan-fried crispy)
function renderGebratenePelmeni() {
  const positions = [
    [260, 270, -10], [350, 250, 15], [440, 270, 40],
    [230, 350, -30], [320, 340, 5],  [410, 350, -5],
    [280, 430, 20],  [370, 420, -15], [450, 430, 25]
  ];

  let items = positions.map(([x, y, r]) => `
    <g transform="translate(${x}, ${y}) rotate(${r})">
      <ellipse cx="40" cy="35" rx="38" ry="32" fill="url(#friedDoughGrad)"/>
      <path d="M 12 35 Q 40 15 68 35" fill="none" stroke="#8C4207" stroke-width="3"/>
      <circle cx="40" cy="50" r="8" fill="#E89B35" stroke="#7A3500" stroke-width="2"/>
      <!-- Crispy bottom crust edge -->
      <path d="M 15 48 Q 40 60 65 48" stroke="#4A1E02" stroke-width="4"/>
      <!-- Sesame seeds on dumplings -->
      <ellipse cx="32" cy="26" rx="2" ry="3.5" fill="#FFF9C4"/>
      <ellipse cx="46" cy="30" rx="2" ry="3.5" fill="#FFF9C4"/>
    </g>
  `).join('');

  return `
    ${items}
    <!-- Dipping Sauce (Spicy Garlic Chili Dip) -->
    <g transform="translate(450, 320)">
      <circle cx="45" cy="45" r="50" fill="#D3CCA8" opacity="0.3"/>
      <circle cx="42" cy="42" r="46" fill="#FFFFFF" stroke="#D9D4C3" stroke-width="2.5"/>
      <circle cx="42" cy="42" r="38" fill="#C62828"/>
      <!-- Chili oil & herbs in dip -->
      <circle cx="36" cy="36" r="6" fill="#FF8A80" opacity="0.7"/>
      <circle cx="50" cy="46" r="3" fill="#2E7D32"/>
    </g>

    <!-- Sliced Scallions / Green Onions -->
    <g stroke="#2E7D32" stroke-width="4" stroke-linecap="round">
      <line x1="280" y1="310" x2="300" y2="305"/>
      <line x1="360" y1="310" x2="385" y2="315"/>
      <line x1="330" y1="390" x2="350" y2="385"/>
      <line x1="410" y1="400" x2="430" y2="405"/>
    </g>
  `;
}

// 7. Borsch Traditionell (Rich soup bowl)
function renderBorsch() {
  return `
    <!-- Porcelain Soup Bowl -->
    <g transform="translate(240, 210)">
      <!-- Bowl shadow -->
      <ellipse cx="160" cy="180" rx="160" ry="120" fill="#D0CAB7" opacity="0.5"/>
      <!-- Bowl body -->
      <circle cx="160" cy="160" r="145" fill="#FAF7F0" stroke="#DDD7C5" stroke-width="4"/>
      <circle cx="160" cy="160" r="145" fill="none" stroke="url(#plateGoldRim)" stroke-width="3" opacity="0.8"/>

      <!-- Rich Ruby Borscht Broth -->
      <circle cx="160" cy="160" r="128" fill="#8B0018"/>
      <radialGradient id="borschBroth" cx="45%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#C21832"/>
        <stop offset="60%" stop-color="#99001A"/>
        <stop offset="100%" stop-color="#5E000F"/>
      </radialGradient>
      <circle cx="160" cy="160" r="128" fill="url(#borschBroth)"/>

      <!-- Braised Beef & Vegetable Chunks inside soup -->
      <ellipse cx="130" cy="140" rx="22" ry="15" fill="#42140A" stroke="#5E1D0E" stroke-width="2"/>
      <ellipse cx="190" cy="180" rx="18" ry="12" fill="#E65100" stroke="#BF360C" stroke-width="1.5"/>
      <path d="M 110 170 Q 140 190 170 170" stroke="#FF5722" stroke-width="4" stroke-linecap="round"/>

      <!-- Swirl of Fresh Sour Cream (Smetana) -->
      <path d="M 135 155 C 130 135, 175 130, 180 155 C 185 175, 145 175, 160 150" fill="#FFFFFF" stroke="#F5F5ED" stroke-width="12" stroke-linecap="round"/>
      <circle cx="160" cy="150" r="8" fill="#FFFFFF"/>

      <!-- Fresh Dill sprig on sour cream -->
      <path d="M 152 145 Q 160 135 168 148" stroke="#1B5907" stroke-width="3" stroke-linecap="round"/>
      <path d="M 156 150 Q 160 158 164 146" stroke="#1B5907" stroke-width="3" stroke-linecap="round"/>
    </g>

    <!-- Side Garlic Pampushka (Traditional yeast bread roll) -->
    <g transform="translate(480, 240)">
      <ellipse cx="45" cy="50" rx="42" ry="38" fill="url(#doughGrad)" stroke="#C49F50" stroke-width="2.5"/>
      <!-- Garlic herb oil glaze on pampushka -->
      <path d="M 25 35 Q 45 25 65 38" stroke="#8F4809" stroke-width="5" stroke-linecap="round"/>
      <circle cx="45" cy="45" r="3" fill="#2E7D32"/>
      <circle cx="35" cy="55" r="2.5" fill="#2E7D32"/>
      <circle cx="55" cy="50" r="2.5" fill="#2E7D32"/>
    </g>
  `;
}

// 8. Hausgemachte Limonade (Fresh Citrus Mint Drink)
function renderLimonade() {
  return `
    <g transform="translate(290, 200)">
      <!-- Tall Highball Crystal Glass -->
      <path d="M 50 40 L 70 330 Q 110 345 150 330 L 170 40 Z" fill="#E0F7FA" opacity="0.35" stroke="#B2EBF2" stroke-width="3"/>

      <!-- Vibrant Citrus Lemonade Liquid -->
      <path d="M 54 80 L 71 325 Q 110 340 149 325 L 166 80 Z" fill="url(#goldGrad)" opacity="0.85"/>

      <!-- Ice Cubes inside glass -->
      <rect x="80" y="110" width="45" height="40" rx="8" fill="#FFFFFF" opacity="0.7" stroke="#E0F7FA" stroke-width="2"/>
      <rect x="100" y="180" width="45" height="42" rx="8" fill="#FFFFFF" opacity="0.65" stroke="#E0F7FA" stroke-width="2"/>
      <rect x="75" y="240" width="45" height="40" rx="8" fill="#FFFFFF" opacity="0.65" stroke="#E0F7FA" stroke-width="2"/>

      <!-- Fresh Lemon Wheel Slices -->
      <g transform="translate(110, 140) rotate(25)">
        <circle cx="0" cy="0" r="32" fill="#FFEE58" stroke="#F57F17" stroke-width="3"/>
        <circle cx="0" cy="0" r="24" fill="#FFF9C4" stroke="#FFF" stroke-width="2"/>
        <line x1="-20" y1="0" x2="20" y2="0" stroke="#F57F17" stroke-width="2"/>
        <line x1="0" y1="-20" x2="0" y2="20" stroke="#F57F17" stroke-width="2"/>
      </g>

      <!-- Glass Rim Lemon Wedge Garnish -->
      <g transform="translate(50, 40) rotate(-35)">
        <path d="M 0 0 A 30 30 0 0 1 30 30 Z" fill="#FFEE58" stroke="#F57F17" stroke-width="3"/>
      </g>

      <!-- Fresh Spearmint Leaves protruding top -->
      <path d="M 120 40 Q 100 10 115 -10 Q 140 0 135 30 Z" fill="#43A047"/>
      <path d="M 135 35 Q 155 10 175 15 Q 165 40 140 40 Z" fill="#66BB6A"/>

      <!-- Bamboo / Glass Drinking Straw (Eco-friendly) -->
      <line x1="100" y1="-30" x2="140" y2="300" stroke="#D7CCC8" stroke-width="8" stroke-linecap="round"/>
      <line x1="98" y1="-30" x2="138" y2="300" stroke="#8D6E63" stroke-width="2"/>
    </g>
  `;
}

async function main() {
  console.log('Generating Digital Menu Board assets...');
  await generateLogo();

  await generatePlatePNG('wareniki-kartoffel.png', renderWarenikiKartoffel());
  await generatePlatePNG('pelmeni-sibirisch.png', renderPelmeniSibirisch());
  await generatePlatePNG('wareniki-kirsche.png', renderWarenikiKirsche());
  await generatePlatePNG('burger-house.png', renderHouseBurger());
  await generatePlatePNG('burger-crispy-chicken.png', renderCrispyChickenBurger());
  await generatePlatePNG('pelmeni-gebraten.png', renderGebratenePelmeni());
  await generatePlatePNG('borsch-traditionell.png', renderBorsch());
  await generatePlatePNG('hausgemachte-limonade.png', renderLimonade());

  console.log('All menu assets generated successfully!');
}

main().catch(err => {
  console.error('Asset generation error:', err);
  process.exit(1);
});

