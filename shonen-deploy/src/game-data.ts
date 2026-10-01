export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export type Character = {
  id: string;
  name: string;
  anime: string;
  rarity: Rarity;
  cost: number;
  attack: number;
  hax: number;
  speed: number;
  iq: number;
  defense: number;
  endurance: number;
  baseDamage: number;
  range: number;
  attackSpeed: number;
  color: string;
  abilities: string[];
};

export type Enemy = {
  id: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  reward: number;
  boss: boolean;
};

export type Unit = {
  card: Character;
  level: number;
  x: number;
  y: number;
  cooldown: number;
  damage: number;
  range: number;
  attackSpeed: number;
};

export type Pity = Record<Rarity, number>;

export type Save = {
  gems: number;
  waveBest: number;
  unlockedSlots: number;
  owned: string[];
  pity: Pity;
  squad: string[];
};

export const RARITIES: Rarity[] = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];

export const CHARACTERS: Character[] = [
  {
    id: 'ren-kai', name: 'Ren Kai', anime: 'Solar Ronin', rarity: 'Common', cost: 90,
    attack: 62, hax: 22, speed: 79, iq: 61, defense: 45, endurance: 52,
    baseDamage: 54, range: 18, attackSpeed: 1.05, color: '#ea6044',
    abilities: ['Sunstep', 'Heat Mark'],
  },
  {
    id: 'mira-volt', name: 'Mira Volt', anime: 'Neon Circuit', rarity: 'Common', cost: 110,
    attack: 48, hax: 71, speed: 88, iq: 76, defense: 34, endurance: 42,
    baseDamage: 39, range: 25, attackSpeed: .8, color: '#169eb2',
    abilities: ['Chain Spark', 'Overclock'],
  },
  {
    id: 'kaede', name: 'Kaede', anime: 'Moonblade', rarity: 'Rare', cost: 160,
    attack: 78, hax: 56, speed: 73, iq: 69, defense: 61, endurance: 68,
    baseDamage: 83, range: 20, attackSpeed: 1.18, color: '#7558bd',
    abilities: ['Lunar Cut', 'Glass Moon'],
  },
  {
    id: 'bramm', name: 'Bramm', anime: 'Iron Oath', rarity: 'Rare', cost: 140,
    attack: 57, hax: 30, speed: 40, iq: 52, defense: 91, endurance: 89,
    baseDamage: 76, range: 15, attackSpeed: 1.35, color: '#2f7f68',
    abilities: ['Anchor Roar', 'Fortify'],
  },
  {
    id: 'yume', name: 'Yume-9', anime: 'Dream Archive', rarity: 'Epic', cost: 240,
    attack: 70, hax: 94, speed: 68, iq: 98, defense: 43, endurance: 56,
    baseDamage: 125, range: 31, attackSpeed: 1.1, color: '#d34b82',
    abilities: ['Memory Leak', 'Soft Reset'],
  },
  {
    id: 'taro', name: 'Taro Quake', anime: 'Faultline', rarity: 'Epic', cost: 290,
    attack: 96, hax: 65, speed: 32, iq: 48, defense: 81, endurance: 95,
    baseDamage: 166, range: 17, attackSpeed: 1.65, color: '#c78127',
    abilities: ['Ground Zero', 'Aftershock'],
  },
  {
    id: 'sable', name: 'Sable', anime: 'Black Meridian', rarity: 'Legendary', cost: 390,
    attack: 92, hax: 99, speed: 85, iq: 88, defense: 63, endurance: 71,
    baseDamage: 244, range: 36, attackSpeed: .88, color: '#596c8d',
    abilities: ['Night Fold', 'Zero Hour'],
  },
  {
    id: 'orion', name: 'Orion', anime: 'Starfall Protocol', rarity: 'Mythic', cost: 520,
    attack: 99, hax: 100, speed: 92, iq: 97, defense: 87, endurance: 90,
    baseDamage: 410, range: 42, attackSpeed: .72, color: '#a94d3c',
    abilities: ['Event Horizon', 'Last Light'],
  },
];

export const STARTER_IDS = ['ren-kai', 'mira-volt', 'kaede', 'bramm'];

export const DEFAULT_SAVE: Save = {
  gems: 1450,
  waveBest: 7,
  unlockedSlots: 3,
  owned: [...STARTER_IDS],
  pity: { Common: 0, Rare: 0, Epic: 0, Legendary: 0, Mythic: 0 },
  squad: ['ren-kai', 'mira-volt', 'kaede'],
};

export const rarityColor = (rarity: Rarity) => ({
  Common: '#a3a198',
  Rare: '#169eb2',
  Epic: '#9b65cf',
  Legendary: '#e29a31',
  Mythic: '#ea6044',
}[rarity]);