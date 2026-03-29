import React, { useEffect, useRef, useState } from 'react';
import { Sword, Zap, FastForward, Heart, Crosshair, Copy, Play, RotateCcw, Magnet, Wind, Maximize, Target, Hammer, TrendingUp, CornerUpRight, Wand2, ArrowUp, Shield } from 'lucide-react';

type UpgradeChoice = { id: string; name: string; desc: string; icon: any; color: string; level: number };

const WEAPONS = {
  pistol: { name: 'ピストル', desc: 'バランスが良く、弱点がない標準的な武器', synergies: ['growth'], unique: 'pistol_roulette' },
  shotgun: { name: 'ショットガン', desc: 'マルチショットと貫通に優れるが、移動速度が遅い', synergies: ['multi', 'pierce', 'knockback'], unique: 'shotgun_blast' },
  sniper: { name: 'スナイパー', desc: '高い威力と弾速を誇るが、連射速度が極端に遅い', synergies: ['dmg', 'crit'], unique: 'sniper_assassin' },
  machinegun: { name: 'マシンガン', desc: '圧倒的な連射速度だが、1発の威力が非常に低い', synergies: ['rate', 'bounce'], unique: 'machinegun_minigun' },
  laser: { name: 'レーザー', desc: '一瞬で画面端まで届くが、攻撃範囲が非常に狭く当てにくい', synergies: ['rate', 'pierce'], unique: 'laser_orbital' },
  sword: { name: '聖剣', desc: '自身の周囲を薙ぎ払うが、射程が極端に短く敵に接近する必要がある', synergies: ['dmg', 'knockback'], unique: 'sword_blood' },
  spear: { name: 'スピア', desc: '前方に素早く突き出すが、攻撃範囲が狭く側面や背後が完全に無防備', synergies: ['pierce', 'speed'], unique: 'spear_dash' },
  magicwand: { name: '魔法の杖', desc: '自動追尾するが、弾速が遅く貫通力がないため群れに弱い', synergies: ['rate', 'bounce'], unique: 'magicwand_blackhole' },
  shuriken: { name: '手裏剣', desc: '手元に戻ってくるが、威力が低く敵を押し返せない', synergies: ['pierce', 'crit'], unique: 'shuriken_orbit' },
  fireball: { name: 'ファイアボール', desc: '爆発で周囲を巻き込むが、弾速が非常に遅く連射も効かない', synergies: ['dmg', 'multi'], unique: 'fireball_meteor' },
  boomerang: { name: 'ブーメラン', desc: '弧を描いて飛び、手元に戻ってくる', synergies: ['speed', 'pierce'], unique: 'boomerang_orbit' },
  lightning: { name: '雷撃の書', desc: 'ランダムな敵の頭上に雷を落とす必中攻撃', synergies: ['dmg', 'rate'], unique: 'lightning_storm' },
  aura: { name: '聖なるオーラ', desc: '自身の周囲に持続ダメージを与える領域を展開する', synergies: ['growth', 'magnet'], unique: 'aura_freeze' },
  scythe: { name: '死神の大鎌', desc: '自身の周囲を回転しながら徐々に広がっていく', synergies: ['dmg', 'crit'], unique: 'scythe_execution' },
  rocket: { name: 'ロケット', desc: '着弾時に広範囲に爆発ダメージを与える', synergies: ['dmg', 'multi'], unique: 'rocket_nuke' },
  flamethrower: { name: '火炎放射器', desc: '前方に炎を放射し続ける。射程は短いが貫通する', synergies: ['rate', 'pierce'], unique: 'flamethrower_blue' },
  whip: { name: '鞭', desc: '前方の広範囲を薙ぎ払う。ノックバック力が高い', synergies: ['dmg', 'knockback'], unique: 'whip_vampire' },
  bow: { name: 'クロスボウ', desc: '高速で敵を貫通する矢を放つ', synergies: ['speed', 'pierce'], unique: 'bow_multishot' },
  poison: { name: '毒フラスコ', desc: '着弾地点にダメージを与える毒沼を生成する', synergies: ['growth', 'magnet'], unique: 'poison_cloud' },
  drone: { name: '戦闘ドローン', desc: '周囲の敵を自動で狙い撃つ', synergies: ['rate', 'speed'], isSubOnly: true },
  mine: { name: '地雷', desc: '移動中に足元に地雷を設置する', synergies: ['dmg', 'multi'], isSubOnly: true },
  satellite: { name: 'サテライト', desc: '自身の周囲を回転する攻撃オーブを展開する', synergies: ['speed', 'dmg'], isSubOnly: true },
  missile: { name: '追尾ミサイル', desc: '上空から敵を追尾するミサイルを呼び出す', synergies: ['multi', 'dmg'], isSubOnly: true },
  chakram: { name: 'チャクラム', desc: '自身の周囲を大きく円を描いて飛ぶ', synergies: ['speed', 'pierce'], isSubOnly: true },
  icicle: { name: 'アイシクル', desc: '全方位に氷のつぶてを放つ', synergies: ['multi', 'pierce'], isSubOnly: true },
  blackhole: { name: 'ブラックホール', desc: '敵を吸い寄せてダメージを与える空間を生成する', synergies: ['magnet', 'dmg'], isSubOnly: true },
};

const UNIQUE_UPGRADES = {
  pistol_roulette: { name: '魔弾の射手', desc: '【ピストル専用】10%の確率で、ダメージ10倍・貫通無限の巨大な弾を発射する', icon: Target, color: 'text-emerald-300' },
  shotgun_blast: { name: 'ゼロ距離射撃', desc: '【ショットガン専用】射程が極端に短くなるが、ダメージとノックバックが10倍になる', icon: Zap, color: 'text-red-500' },
  sniper_assassin: { name: '暗殺者の眼', desc: '【スナイパー専用】敵との距離が離れているほどダメージが上がる（最大10倍）', icon: Crosshair, color: 'text-orange-500' },
  machinegun_minigun: { name: '固定砲台', desc: '【マシンガン専用】移動速度が半減するが、発射数が5倍になる', icon: Wind, color: 'text-yellow-300' },
  laser_orbital: { name: 'サテライトレーザー', desc: '【レーザー専用】レーザーがプレイヤーの周囲を回転し続けるようになる', icon: RotateCcw, color: 'text-cyan-300' },
  sword_blood: { name: '狂戦士の剣', desc: '【聖剣専用】攻撃範囲とダメージが3倍になるが、振るたびにHPが1減る', icon: Sword, color: 'text-red-600' },
  spear_dash: { name: '竜騎士の跳躍', desc: '【スピア専用】攻撃時、向いている方向に自身が高速ダッシュする', icon: FastForward, color: 'text-teal-300' },
  magicwand_blackhole: { name: '重力崩壊', desc: '【魔法の杖専用】弾が当たった場所に、敵を吸い寄せる重力場を発生させる', icon: Magnet, color: 'text-purple-300' },
  shuriken_orbit: { name: '乱れ桜', desc: '【手裏剣専用】手裏剣がプレイヤーの周囲に滞空し、近づいた敵を自動で攻撃する', icon: Target, color: 'text-pink-300' },
  fireball_meteor: { name: 'メテオストライク', desc: '【ファイアボール専用】弾速が極端に落ちるが、画面を覆う超巨大な爆発を起こす', icon: Maximize, color: 'text-red-400' },
  boomerang_orbit: { name: '永劫の円月', desc: '【ブーメラン専用】手元に戻らず、プレイヤーの周囲を永遠に回り続ける', icon: RotateCcw, color: 'text-emerald-300' },
  lightning_storm: { name: '裁きの雷', desc: '【雷撃の書専用】画面内のすべての敵に同時に雷が落ちるようになる', icon: Zap, color: 'text-yellow-300' },
  aura_freeze: { name: '絶対零度', desc: '【聖なるオーラ専用】オーラ内の敵の移動速度を極端に遅くする', icon: Wind, color: 'text-blue-200' },
  scythe_execution: { name: '魂の収穫', desc: '【死神の大鎌専用】大鎌で敵を倒すたびに、大鎌の基礎ダメージが永続的に+1される', icon: Sword, color: 'text-purple-500' },
  rocket_nuke: { name: 'ニューク', desc: '【ロケット専用】爆発範囲とダメージが劇的に増加する', icon: Target, color: 'text-red-500' },
  flamethrower_blue: { name: '蒼い炎', desc: '【火炎放射器専用】炎が青くなり、ダメージが倍増する', icon: Zap, color: 'text-blue-500' },
  whip_vampire: { name: '吸血の鞭', desc: '【鞭専用】敵にダメージを与えると確率でHPが回復する', icon: Heart, color: 'text-red-600' },
  bow_multishot: { name: '五月雨撃ち', desc: '【クロスボウ専用】発射数が大幅に増加する', icon: Copy, color: 'text-green-500' },
  poison_cloud: { name: '猛毒の霧', desc: '【毒フラスコ専用】毒沼の範囲が広がり、ダメージ間隔が短くなる', icon: Wind, color: 'text-purple-500' },
};

const WEAPON_CATEGORIES = {
  firearm: { name: '銃器', desc: '遠距離から敵を撃ち抜く近代兵器', weapons: ['pistol', 'shotgun', 'sniper', 'machinegun', 'laser', 'rocket', 'flamethrower'], icon: Crosshair },
  melee: { name: '近接', desc: '近づく敵を薙ぎ払う強力な武器', weapons: ['sword', 'spear', 'scythe', 'whip'], icon: Sword },
  magic: { name: '魔法・特殊', desc: '特殊な軌道や効果を持つ異端の武器', weapons: ['magicwand', 'shuriken', 'fireball', 'boomerang', 'lightning', 'aura', 'bow', 'poison'], icon: Wand2 },
  sub: { name: '支援兵装', desc: 'レベルアップでのみ取得可能なサブ武器', weapons: ['drone', 'mine', 'satellite', 'missile', 'chakram', 'icicle', 'blackhole'], icon: Shield }
};

const getUpgradeInfo = (id: string, currentLevel: number, weapon: string) => {
  if (id in UNIQUE_UPGRADES) {
    return UNIQUE_UPGRADES[id as keyof typeof UNIQUE_UPGRADES];
  }
  if (id in WEAPONS) {
    const w = WEAPONS[id as keyof typeof WEAPONS];
    const cat = Object.values(WEAPON_CATEGORIES).find(c => c.weapons.includes(id));
    const isSub = (w as any).isSubOnly;
    return { name: `${isSub ? 'サブ専用' : 'サブ武器'}: ${w.name}`, desc: w.desc, icon: cat?.icon || Sword, color: isSub ? 'text-cyan-300' : 'text-blue-300' };
  }
  const nextLevel = currentLevel + 1;
  const isSyn = WEAPONS[weapon as keyof typeof WEAPONS].synergies.includes(id);
  switch(id) {
    case 'dmg': return { name: '破壊のルーン', desc: `ダメージ +${(isSyn ? 3 : 1) * nextLevel}%`, icon: Sword, color: 'text-red-400' };
    case 'rate': return { name: '疾風の時計', desc: `連射速度 +${(isSyn ? 1 : 0.5) * nextLevel}%`, icon: Zap, color: 'text-yellow-400' };
    case 'speed': return { name: '韋駄天の靴', desc: `移動速度 +${((isSyn ? 0.03 : 0.01) * nextLevel).toFixed(2)}`, icon: Wind, color: 'text-blue-400' };
    case 'hp': return { name: '巨人の心臓', desc: `最大HP＆回復 +${(isSyn ? 3 : 1) * nextLevel}`, icon: Heart, color: 'text-green-400' };
    case 'pierce': return { name: '貫く者の矢尻', desc: `貫通数 +${isSyn ? Math.ceil(nextLevel / 3) : Math.ceil(nextLevel / 5)}`, icon: ArrowUp, color: 'text-purple-400' };
    case 'multi': return { name: '多重の鏡', desc: `発射数 +${isSyn ? Math.ceil(nextLevel / 2) : Math.ceil(nextLevel / 3)}`, icon: Copy, color: 'text-orange-400' };
    case 'magnet': return { name: '強欲の磁石', desc: `回収範囲 +${(isSyn ? 5 : 2) * nextLevel}`, icon: Magnet, color: 'text-indigo-400' };
    case 'knockback': return { name: '衝撃のガントレット', desc: `ノックバック +${(isSyn ? 3 : 1) * nextLevel}`, icon: Hammer, color: 'text-stone-400' };
    case 'crit': return { name: '死神の瞳', desc: `クリティカル率 +${(isSyn ? 3 : 1) * nextLevel}%`, icon: Target, color: 'text-amber-400' };
    case 'bounce': return { name: '反射の盾', desc: `跳弾回数 +${isSyn ? Math.ceil(nextLevel / 2) : Math.ceil(nextLevel / 3)}`, icon: CornerUpRight, color: 'text-teal-400' };
    case 'growth': return { name: '賢者の石', desc: `取得経験値 +${(isSyn ? 5 : 2) * nextLevel}%`, icon: TrendingUp, color: 'text-lime-400' };
    default: return { name: '未知の遺物', desc: '', icon: Sword, color: 'text-white' };
  }
};

type GameState = {
  weapon: string;
  weapons: string[];
  status: 'menu' | 'playing' | 'levelup' | 'gameover' | 'paused';
  player: { x: number; y: number; hp: number; maxHp: number; speed: number; radius: number; xp: number; level: number; nextXp: number; invuln: number; magnet: number };
  stats: { damage: number; fireRate: number; pierce: number; multiShot: number; projSpeed: number; projSize: number; lastShot: number; knockback: number; crit: number; bounce: number; xpBonus: number; scytheBonusDamage: number };
  enemies: { x: number; y: number; hp: number; maxHp: number; speed: number; radius: number; damage: number; isBoss?: boolean; type: string; color: string }[];
  projectiles: { x: number; y: number; vx: number; vy: number; damage: number; life: number; pierce: number; hit: Set<any>; radius: number; bounce: number; type?: string; angle?: number; distance?: number; target?: any; knockback?: number }[];
  gems: { x: number; y: number; value: number; radius: number; color?: string }[];
  damageTexts: { x: number; y: number; text: string; life: number; color: string }[];
  keys: { [key: string]: boolean };
  joystick: { active: boolean; originX: number; originY: number; currentX: number; currentY: number };
  upgradeLevels: Record<string, number>;
  frameCount: number;
  score: number;
  time: number;
};

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [uiState, setUiState] = useState({ status: 'menu', level: 1, score: 0, time: 0, choices: [] as UpgradeChoice[], selectedWeapon: 'pistol', selectedCategory: null as string | null, showDamageNumbers: true });
  
  const state = useRef<GameState>({
    weapon: 'pistol',
    weapons: ['pistol'],
    status: 'menu',
    player: { x: 0, y: 0, hp: 100, maxHp: 100, speed: 3, radius: 15, xp: 0, level: 1, nextXp: 5, invuln: 0, magnet: 50 },
    stats: { damage: 10, fireRate: 30, pierce: 1, multiShot: 1, projSpeed: 8, projSize: 4, lastShot: 0, knockback: 0, crit: 0, bounce: 0, xpBonus: 0 },
    enemies: [], projectiles: [], gems: [], damageTexts: [], keys: {}, joystick: { active: false, originX: 0, originY: 0, currentX: 0, currentY: 0 }, upgradeLevels: {},
    frameCount: 0, score: 0, time: 0,
  });

  const getInitialStats = (weapon: string) => {
    const base = { damage: 10, fireRate: 30, pierce: 1, multiShot: 1, projSpeed: 8, projSize: 4, lastShot: 0, knockback: 0, crit: 0, bounce: 0, xpBonus: 0, scytheBonusDamage: 0 };
    if (weapon === 'shotgun') return { ...base, damage: 15, multiShot: 4, fireRate: 35, projSpeed: 6, pierce: 2 };
    if (weapon === 'sniper') return { ...base, damage: 60, fireRate: 70, projSpeed: 20, pierce: 5 };
    if (weapon === 'machinegun') return { ...base, damage: 4, fireRate: 8, projSpeed: 10 };
    if (weapon === 'laser') return { ...base, damage: 12, fireRate: 30, projSpeed: 0, projSize: 3, pierce: 999 };
    if (weapon === 'sword') return { ...base, damage: 25, fireRate: 40, projSpeed: 0, projSize: 35, pierce: 999, knockback: 5 };
    if (weapon === 'spear') return { ...base, damage: 25, fireRate: 35, projSpeed: 0, projSize: 15, pierce: 999, knockback: 4 };
    if (weapon === 'magicwand') return { ...base, damage: 18, fireRate: 25, projSpeed: 7, projSize: 5, bounce: 0 };
    if (weapon === 'shuriken') return { ...base, damage: 10, fireRate: 20, projSpeed: 15, projSize: 8, pierce: 5 };
    if (weapon === 'fireball') return { ...base, damage: 35, fireRate: 50, projSpeed: 4, projSize: 15, pierce: 1 };
    if (weapon === 'boomerang') return { ...base, damage: 18, fireRate: 30, projSpeed: 12, projSize: 12, pierce: 999 };
    if (weapon === 'lightning') return { ...base, damage: 50, fireRate: 45, projSpeed: 0, projSize: 30, pierce: 1 };
    if (weapon === 'aura') return { ...base, damage: 8, fireRate: 8, projSpeed: 0, projSize: 100, pierce: 999 };
    if (weapon === 'scythe') return { ...base, damage: 20, fireRate: 90, projSpeed: 5, projSize: 25, pierce: 999 };
    return base;
  };

  const startGame = () => {
    let baseSpeed = 3;
    if (uiState.selectedWeapon === 'shotgun') baseSpeed = 2;
    
    state.current = {
      weapon: uiState.selectedWeapon,
      weapons: [uiState.selectedWeapon],
      status: 'playing',
      player: { x: 0, y: 0, hp: 100, maxHp: 100, speed: baseSpeed, radius: 15, xp: 0, level: 1, nextXp: 5, invuln: 0, magnet: 50 },
      stats: getInitialStats(uiState.selectedWeapon),
      enemies: [], projectiles: [], gems: [], damageTexts: [], keys: state.current.keys, joystick: { active: false, originX: 0, originY: 0, currentX: 0, currentY: 0 }, upgradeLevels: {},
      frameCount: 0, score: 0, time: 0,
    };
    setUiState(s => ({ ...s, status: 'playing', level: 1, score: 0, time: 0 }));
  };

  const applyUpgrade = (id: string) => {
    const s = state.current;
    
    if (id in WEAPONS) {
      if (!s.weapons.includes(id)) {
        s.weapons.push(id);
      }
      s.status = 'playing';
      setUiState(prev => ({ ...prev, status: 'playing' }));
      return;
    }

    const level = (s.upgradeLevels[id] || 0) + 1;
    s.upgradeLevels[id] = level;
    const isSyn = WEAPONS[s.weapon as keyof typeof WEAPONS].synergies.includes(id);

    if (id === 'dmg') s.stats.damage *= (1 + ((isSyn ? 0.03 : 0.01) * level));
    if (id === 'rate') s.stats.fireRate = Math.max(5, s.stats.fireRate * (1 - ((isSyn ? 0.01 : 0.005) * level)));
    if (id === 'speed') s.player.speed += ((isSyn ? 0.03 : 0.01) * level);
    if (id === 'hp') { const boost = (isSyn ? 3 : 1) * level; s.player.maxHp += boost; s.player.hp += boost; }
    if (id === 'pierce') s.stats.pierce += (isSyn ? Math.ceil(level / 3) : Math.ceil(level / 5));
    if (id === 'multi') s.stats.multiShot = Math.min(31, s.stats.multiShot + (isSyn ? Math.ceil(level / 2) : Math.ceil(level / 3)));
    if (id === 'magnet') s.player.magnet += ((isSyn ? 5 : 2) * level);
    if (id === 'knockback') s.stats.knockback += (isSyn ? 3 : 1) * level;
    if (id === 'crit') s.stats.crit += (isSyn ? 0.03 : 0.01) * level;
    if (id === 'bounce') s.stats.bounce += (isSyn ? Math.ceil(level / 2) : Math.ceil(level / 3));
    if (id === 'growth') s.stats.xpBonus += (isSyn ? 0.05 : 0.02) * level;
    
    s.status = 'playing';
    setUiState(prev => ({ ...prev, status: 'playing' }));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { 
      state.current.keys[e.key.toLowerCase()] = true; 
      if (e.key === 'Escape') {
        if (state.current.status === 'playing') {
          state.current.status = 'paused';
          setUiState(prev => ({ ...prev, status: 'paused' }));
        } else if (state.current.status === 'paused') {
          state.current.status = 'playing';
          setUiState(prev => ({ ...prev, status: 'playing' }));
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => { state.current.keys[e.key.toLowerCase()] = false; };
    
    const handleTouchStart = (e: TouchEvent) => {
      if (state.current.status !== 'playing') return;
      const t = e.touches[0];
      state.current.joystick = { active: true, originX: t.clientX, originY: t.clientY, currentX: t.clientX, currentY: t.clientY };
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (state.current.status === 'playing') e.preventDefault();
      if (!state.current.joystick.active) return;
      const t = e.touches[0];
      state.current.joystick.currentX = t.clientX;
      state.current.joystick.currentY = t.clientY;
    };
    const handleTouchEnd = () => { state.current.joystick.active = false; };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);
    
    return () => { 
      window.removeEventListener('keydown', handleKeyDown); 
      window.removeEventListener('keyup', handleKeyUp); 
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const updatePhysics = () => {
      const s = state.current;
      const { player, stats, enemies, projectiles, gems, keys } = s;
      
      s.frameCount++;
      if (s.frameCount % 60 === 0) s.time++;

      // Player Movement
      let dx = 0, dy = 0;
      if (keys['w'] || keys['arrowup']) dy -= 1;
      if (keys['s'] || keys['arrowdown']) dy += 1;
      if (keys['a'] || keys['arrowleft']) dx -= 1;
      if (keys['d'] || keys['arrowright']) dx += 1;
      
      if (s.joystick.active) {
        const jx = s.joystick.currentX - s.joystick.originX;
        const jy = s.joystick.currentY - s.joystick.originY;
        const dist = Math.hypot(jx, jy);
        if (dist > 10) {
          dx += jx / dist;
          dy += jy / dist;
        }
      }
      
      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy);
        dx /= len; dy /= len;
      }
      player.x += dx * player.speed;
      player.y += dy * player.speed;

      if (player.invuln > 0) player.invuln--;

      // Enemy Spawning
      const spawnRate = Math.max(15, 90 - Math.floor(s.time / 3));
      if (s.frameCount % spawnRate === 0) {
        let spawnCount = 1 + Math.floor(s.time / 40);
        if (player.level > 200) {
          spawnCount *= 2;
        }
        for (let i = 0; i < spawnCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.max(canvas.width, canvas.height) / 2 + 100 + Math.random() * 50;
          let baseHp = 10 + Math.floor(s.time / 30) * 10;
          
          let hp = baseHp, speed = 1.5 + Math.random(), radius = 12, color = '#e94560', damage = 10;
          
          if (player.level > 200) {
            hp *= 10;
            speed *= 1.5;
            damage *= 5;
            color = '#ff0000';
          }
          
          const rand = Math.random();
          let type = 'standard';
          
          if (rand < 0.25) {
            type = 'fast'; hp = hp * 0.5; speed = speed * 1.5; radius = 8; color = player.level > 200 ? '#ff5500' : '#ffb400'; damage = damage * 0.5;
          } else if (rand < 0.45) {
            type = 'tank'; hp = hp * 3; speed = speed * 0.5; radius = 20; color = player.level > 200 ? '#8800ff' : '#4a00e0'; damage = damage * 2;
          }

          enemies.push({
            x: player.x + Math.cos(angle) * dist,
            y: player.y + Math.sin(angle) * dist,
            hp, maxHp: hp, speed, radius, damage, type, color
          });
        }
      }

      // Boss Spawning
      if (s.time > 0 && s.time % 60 === 0 && s.frameCount % 60 === 0) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.max(canvas.width, canvas.height) / 2 + 100;
        const hp = 1000 + s.time * 50;
        enemies.push({
          x: player.x + Math.cos(angle) * dist,
          y: player.y + Math.sin(angle) * dist,
          hp, maxHp: hp, speed: 1.2, radius: 45, damage: 30, isBoss: true, type: 'boss', color: '#ff00ff'
        });
      }

      // Shooting
      let closest = null, minDist = Infinity;
      for (const e of enemies) {
        const dist = Math.hypot(e.x - player.x, e.y - player.y);
        if (dist < minDist) { minDist = dist; closest = e; }
      }
      
      if (closest && minDist < 600) {
        const angle = Math.atan2(closest.y - player.y, closest.x - player.x);
        
        for (const w of s.weapons) {
          let wMultiShot = stats.multiShot;
          let wDamage = stats.damage;
          let wSpeed = stats.projSpeed;
          let wPierce = stats.pierce;
          let wSize = stats.projSize;
          let wBounce = stats.bounce;
          let wSpread = 0.2;
          let wKnockback = stats.knockback;

          let wFireRateMulti = 1;
          if (w === 'sniper') wFireRateMulti = 0.2;
          if (w === 'machinegun') wFireRateMulti = 4;
          if (w === 'laser') wFireRateMulti = 0.5;
          if (w === 'fireball') wFireRateMulti = 0.3;
          if (w === 'lightning') {
            wFireRateMulti = 0.5;
            if (s.upgradeLevels['lightning_storm']) wFireRateMulti = 0.1;
          }
          if (w === 'aura') wFireRateMulti = 2;
          if (w === 'rocket') wFireRateMulti = 0.4;
          if (w === 'flamethrower') wFireRateMulti = 5;
          if (w === 'whip') wFireRateMulti = 0.8;
          if (w === 'bow') wFireRateMulti = 1.5;
          if (w === 'poison') wFireRateMulti = 0.5;
          
          if (w === 'drone') wFireRateMulti = 2;
          if (w === 'mine') wFireRateMulti = 0.5;
          if (w === 'satellite') wFireRateMulti = 0.2;
          if (w === 'missile') wFireRateMulti = 0.5;
          if (w === 'chakram') wFireRateMulti = 0.3;
          if (w === 'icicle') wFireRateMulti = 0.5;
          if (w === 'blackhole') wFireRateMulti = 0.1;

          const wFireRate = Math.max(5, Math.floor(stats.fireRate / wFireRateMulti));
          
          // Use a hash of the weapon name to offset the firing frame, so they don't all fire at once
          const wOffset = w.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % wFireRate;

          if ((s.frameCount + wOffset) % wFireRate === 0) {
            if (w === 'pistol' && s.upgradeLevels['pistol_roulette']) {
              if (Math.random() < 0.2) {
                wDamage *= 20;
                wSize *= 4;
                wPierce = 999;
              }
            }
            if (w === 'shotgun') { 
              wSpeed *= 0.8; wPierce += 1; wSpread = 0.4;
              if (s.upgradeLevels['shotgun_blast']) {
                wDamage *= 10; wKnockback *= 10;
              }
            }
            if (w === 'sniper') { 
              wDamage *= 4; wSpeed *= 2; wPierce += 4; 
              if (s.upgradeLevels['sniper_assassin']) {
                const dist = Math.hypot(player.x - closest.x, player.y - closest.y);
                wDamage *= Math.min(10, 1 + dist / 100);
              }
            }
            if (w === 'machinegun') { 
              wDamage *= 0.2; wSpeed *= 1.2;
              if (s.upgradeLevels['machinegun_minigun']) {
                wMultiShot *= 10; wSpread = 0.8;
              }
            }
            if (w === 'laser') {
              // laser_orbital is handled in the shooting logic below
            }
            if (w === 'spear') {
              // spear_dash is handled in the shooting logic below
            }
            if (w === 'magicwand') { 
              wSpeed *= 0.9; wSize *= 1.2;
            }
            if (w === 'shuriken') { 
              wPierce += 4; wSize *= 2;
            }
            if (w === 'fireball') {
              wDamage *= 2; wSize *= 1.5;
              if (s.upgradeLevels['fireball_meteor']) {
                wDamage *= 10; wSize *= 5; wSpeed *= 0.5;
              }
            }
            if (w === 'boomerang') {
              // boomerang_orbit is handled in the shooting logic below
            }
            if (w === 'lightning') {
              // lightning_storm is handled in the shooting logic below
            }
            if (w === 'aura') {
              // aura_freeze is handled in the update logic
            }
            if (w === 'scythe') {
              if (s.upgradeLevels['scythe_execution']) {
                wDamage += stats.scytheBonusDamage;
              }
            }
            
            if (w === 'rocket') { wSpeed *= 0.6; wPierce = 0; }
            if (w === 'flamethrower') { 
              wSpeed *= 0.5; wPierce = 999; wSpread = 0.5; wSize *= 2; 
              if (s.upgradeLevels['flamethrower_blue']) wDamage *= 2;
            }
            if (w === 'whip') { wSpeed *= 1.5; wPierce = 999; wSize *= 3; }
            if (w === 'bow') { 
              wSpeed *= 2; wPierce += 2; wSpread = 0.05; 
              if (s.upgradeLevels['bow_multishot']) wMultiShot += 5;
            }
            if (w === 'poison') { wSpeed *= 0.4; wPierce = 0; }
            
            if (w === 'drone') { wSpeed *= 1.5; wPierce = 0; wSize *= 0.5; }
            if (w === 'mine') { wSpeed = 0; wPierce = 0; wSize *= 1.5; }
            if (w === 'satellite') { wSpeed *= 2; wPierce = 999; }
            if (w === 'missile') { wSpeed *= 0.8; wPierce = 0; wSize *= 1.2; }
            if (w === 'chakram') { wSpeed *= 1.2; wPierce = 999; wSize *= 1.5; }
            if (w === 'icicle') { wSpeed *= 1.2; wPierce += 1; wMultiShot += 4; wSpread = Math.PI * 2; }
            if (w === 'blackhole') { wSpeed *= 0.2; wPierce = 999; wSize *= 4; }

            const startProjLen = projectiles.length;

            if (w === 'sword') {
              if (s.upgradeLevels['sword_blood']) {
                wSize *= 5; wDamage *= 5;
                player.hp -= 1;
              }
              if (minDist < 200 * (s.upgradeLevels['sword_blood'] ? 3 : 1)) {
                for (let i = 0; i < wMultiShot; i++) {
                  const offset = angle + (i - (wMultiShot - 1) / 2) * 0.5;
                  projectiles.push({
                    x: player.x, y: player.y,
                    vx: 0, vy: 0,
                    damage: wDamage * 2.5, life: 15, pierce: 999, hit: new Set(), radius: Math.max(40, wSize * 2), bounce: wBounce,
                    type: 'sword', angle: offset, distance: 40
                  });
                }
              }
            } else if (w === 'spear') {
              if (minDist < 300) {
                if (s.upgradeLevels['spear_dash']) {
                  player.x += Math.cos(angle) * 100;
                  player.y += Math.sin(angle) * 100;
                  player.invuln = 10;
                }
                for (let i = 0; i < wMultiShot; i++) {
                  const offset = angle + (i - (wMultiShot - 1) / 2) * wSpread;
                  projectiles.push({
                    x: player.x, y: player.y,
                    vx: 0, vy: 0,
                    damage: wDamage * 1.5, life: 20, pierce: 999, hit: new Set(), radius: wSize, bounce: wBounce,
                    type: 'spear', angle: offset, distance: 0
                  });
                }
              }
            } else if (w === 'laser') {
              if (s.upgradeLevels['laser_orbital']) {
                const currentOrbits = projectiles.filter(p => p.type === 'laser_orbital');
                if (currentOrbits.length !== wMultiShot) {
                  for (let i = projectiles.length - 1; i >= 0; i--) {
                    if (projectiles[i].type === 'laser_orbital') projectiles.splice(i, 1);
                  }
                  for (let i = 0; i < wMultiShot; i++) {
                    const offset = (Math.PI * 2 / wMultiShot) * i;
                    projectiles.push({
                      x: player.x, y: player.y,
                      vx: 0, vy: 0,
                      damage: wDamage * 0.5, life: 999999, pierce: 999, hit: new Set(), radius: wSize * 2, bounce: 0,
                      type: 'laser_orbital', angle: offset, distance: 150
                    });
                  }
                }
              } else {
                for (let i = 0; i < wMultiShot; i++) {
                  const offset = angle + (i - (wMultiShot - 1) / 2) * wSpread;
                  projectiles.push({
                    x: player.x, y: player.y,
                    vx: 0, vy: 0,
                    damage: wDamage * 0.8, life: 10, pierce: 999, hit: new Set(), radius: wSize, bounce: 0,
                    type: 'laser', angle: offset, distance: 1000
                  });
                }
              }
            } else if (w === 'aura') {
              projectiles.push({
                x: player.x, y: player.y,
                vx: 0, vy: 0,
                damage: wDamage, life: 15, pierce: 999, hit: new Set(), radius: wSize, bounce: 0,
                type: 'aura'
              });
            } else if (w === 'lightning') {
              if (s.upgradeLevels['lightning_storm']) {
                for (const target of enemies) {
                  if (Math.abs(target.x - player.x) < 800 && Math.abs(target.y - player.y) < 600) {
                    projectiles.push({
                      x: target.x, y: target.y - 200,
                      vx: 0, vy: 20,
                      damage: wDamage, life: 10, pierce: wPierce, hit: new Set(), radius: wSize, bounce: 0,
                      type: 'lightning', target: target
                    });
                  }
                }
              } else {
                for (let i = 0; i < wMultiShot; i++) {
                  if (enemies.length > 0) {
                    const target = enemies[Math.floor(Math.random() * enemies.length)];
                    projectiles.push({
                      x: target.x, y: target.y - 200,
                      vx: 0, vy: 20,
                      damage: wDamage, life: 10, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce,
                      type: 'lightning', target: target
                    });
                  }
                }
              }
            } else if (w === 'scythe') {
              for (let i = 0; i < wMultiShot; i++) {
                const offset = angle + (i / wMultiShot) * Math.PI * 2;
                projectiles.push({
                  x: player.x, y: player.y,
                  vx: 0, vy: 0,
                  damage: wDamage, life: 120, pierce: 999, hit: new Set(), radius: wSize, bounce: 0,
                  type: 'scythe', angle: offset, distance: 0, speed: wSpeed
                });
              }
            } else if (w === 'boomerang') {
              if (s.upgradeLevels['boomerang_orbit']) {
                const currentOrbits = projectiles.filter(p => p.type === 'boomerang_orbit');
                if (currentOrbits.length !== wMultiShot) {
                  for (let i = projectiles.length - 1; i >= 0; i--) {
                    if (projectiles[i].type === 'boomerang_orbit') projectiles.splice(i, 1);
                  }
                  for (let i = 0; i < wMultiShot; i++) {
                    const offset = (Math.PI * 2 / wMultiShot) * i;
                    projectiles.push({
                      x: player.x, y: player.y,
                      vx: 0, vy: 0,
                      damage: wDamage, life: 999999, pierce: 999, hit: new Set(), radius: wSize, bounce: 0,
                      type: 'boomerang_orbit', angle: offset, distance: 100
                    });
                  }
                }
              } else {
                for (let i = 0; i < wMultiShot; i++) {
                  let offset = angle + (i - (wMultiShot - 1) / 2) * wSpread;
                  projectiles.push({
                    x: player.x, y: player.y,
                    vx: Math.cos(offset) * wSpeed,
                    vy: Math.sin(offset) * wSpeed,
                    damage: wDamage, life: 60, pierce: 999, hit: new Set(), radius: wSize, bounce: wBounce,
                    type: 'boomerang', angle: offset, distance: wSpeed
                  });
                }
              }
            } else if (w === 'shuriken' && s.upgradeLevels['shuriken_orbit']) {
              const currentOrbits = projectiles.filter(p => p.type === 'shuriken_orbit');
              if (currentOrbits.length !== wMultiShot) {
                for (let i = projectiles.length - 1; i >= 0; i--) {
                  if (projectiles[i].type === 'shuriken_orbit') projectiles.splice(i, 1);
                }
                for (let i = 0; i < wMultiShot; i++) {
                  const offset = (Math.PI * 2 / wMultiShot) * i;
                  projectiles.push({
                    x: player.x, y: player.y,
                    vx: 0, vy: 0,
                    damage: wDamage, life: 999999, pierce: 999, hit: new Set(), radius: wSize, bounce: 0,
                    type: 'shuriken_orbit', angle: offset, distance: 80
                  });
                }
              }
            } else if (w === 'rocket') {
              for (let i = 0; i < wMultiShot; i++) {
                const a = angle + (Math.random() - 0.5) * wSpread;
                projectiles.push({ x: player.x, y: player.y, vx: Math.cos(a) * wSpeed, vy: Math.sin(a) * wSpeed, damage: wDamage * 2, life: 60, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: 'rocket' });
              }
            } else if (w === 'flamethrower') {
              for (let i = 0; i < wMultiShot; i++) {
                const a = angle + (Math.random() - 0.5) * wSpread;
                projectiles.push({ x: player.x, y: player.y, vx: Math.cos(a) * wSpeed, vy: Math.sin(a) * wSpeed, damage: wDamage * 0.3, life: 20, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: 'flame' });
              }
            } else if (w === 'whip') {
              for (let i = 0; i < wMultiShot; i++) {
                const a = angle + (Math.random() - 0.5) * wSpread;
                projectiles.push({ x: player.x + Math.cos(a) * 40, y: player.y + Math.sin(a) * 40, vx: Math.cos(a) * wSpeed * 0.1, vy: Math.sin(a) * wSpeed * 0.1, damage: wDamage * 1.5, life: 10, pierce: wPierce, hit: new Set(), radius: wSize * 2, bounce: wBounce, type: 'whip' });
              }
            } else if (w === 'bow') {
              for (let i = 0; i < wMultiShot; i++) {
                const a = angle + (Math.random() - 0.5) * wSpread;
                projectiles.push({ x: player.x, y: player.y, vx: Math.cos(a) * wSpeed, vy: Math.sin(a) * wSpeed, damage: wDamage * 1.2, life: 40, pierce: wPierce, hit: new Set(), radius: wSize * 0.5, bounce: wBounce, type: 'arrow' });
              }
            } else if (w === 'poison') {
              for (let i = 0; i < wMultiShot; i++) {
                const a = angle + (Math.random() - 0.5) * wSpread;
                projectiles.push({ x: player.x, y: player.y, vx: Math.cos(a) * wSpeed, vy: Math.sin(a) * wSpeed, damage: wDamage, life: 40, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: 'poison_flask' });
              }
            } else if (w === 'drone') {
              for (let i = 0; i < wMultiShot; i++) {
                const a = Math.random() * Math.PI * 2;
                projectiles.push({ x: player.x + Math.cos(a) * 30, y: player.y + Math.sin(a) * 30, vx: Math.cos(angle) * wSpeed, vy: Math.sin(angle) * wSpeed, damage: wDamage * 0.8, life: 30, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: 'drone_shot' });
              }
            } else if (w === 'mine') {
              for (let i = 0; i < wMultiShot; i++) {
                projectiles.push({ x: player.x + (Math.random()-0.5)*20, y: player.y + (Math.random()-0.5)*20, vx: 0, vy: 0, damage: wDamage * 3, life: 300, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: 'mine' });
              }
            } else if (w === 'satellite') {
              for (let i = 0; i < wMultiShot; i++) {
                const a = (Math.PI * 2 / wMultiShot) * i;
                projectiles.push({ x: player.x, y: player.y, vx: 0, vy: 0, damage: wDamage, life: 60, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: 'satellite', angle: a, distance: 60 });
              }
            } else if (w === 'missile') {
              for (let i = 0; i < wMultiShot; i++) {
                const target = enemies[Math.floor(Math.random() * enemies.length)];
                if (target) {
                  const startX = target.x + (Math.random() - 0.5) * 200;
                  const startY = target.y - 400;
                  const a = Math.atan2(target.y - startY, target.x - startX);
                  projectiles.push({ x: startX, y: startY, vx: Math.cos(a) * wSpeed, vy: Math.sin(a) * wSpeed, damage: wDamage * 2, life: 100, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: 'missile' });
                }
              }
            } else if (w === 'chakram') {
              for (let i = 0; i < wMultiShot; i++) {
                const a = angle + (Math.PI * 2 / wMultiShot) * i;
                projectiles.push({ x: player.x, y: player.y, vx: Math.cos(a) * wSpeed, vy: Math.sin(a) * wSpeed, damage: wDamage, life: 90, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: 'chakram', angle: a });
              }
            } else if (w === 'icicle') {
              for (let i = 0; i < wMultiShot; i++) {
                const a = angle + (Math.PI * 2 / wMultiShot) * i;
                projectiles.push({ x: player.x, y: player.y, vx: Math.cos(a) * wSpeed, vy: Math.sin(a) * wSpeed, damage: wDamage * 0.7, life: 40, pierce: wPierce, hit: new Set(), radius: wSize * 0.8, bounce: wBounce, type: 'icicle' });
              }
            } else if (w === 'blackhole') {
              for (let i = 0; i < wMultiShot; i++) {
                const a = angle + (Math.random() - 0.5) * wSpread;
                projectiles.push({ x: player.x, y: player.y, vx: Math.cos(a) * wSpeed, vy: Math.sin(a) * wSpeed, damage: wDamage * 0.5, life: 150, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: 'blackhole' });
              }
            } else {
              for (let i = 0; i < wMultiShot; i++) {
                let offset = angle + (i - (wMultiShot - 1) / 2) * wSpread;
                if (w === 'machinegun') {
                  offset += (Math.random() - 0.5) * wSpread;
                }
                let pLife = w === 'shuriken' ? 80 : 100;
                if (w === 'shotgun' && s.upgradeLevels['shotgun_blast']) pLife = 10;
                projectiles.push({
                  x: player.x, y: player.y,
                  vx: Math.cos(offset) * wSpeed,
                  vy: Math.sin(offset) * wSpeed,
                  damage: wDamage, life: pLife, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce,
                  type: w, target: w === 'magicwand' ? closest : undefined
                });
              }
            }

            for (let i = startProjLen; i < projectiles.length; i++) {
              projectiles[i].knockback = wKnockback;
            }
          }
        }
      }

      // Update Projectiles
      for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        
        if (p.type === 'sword') {
          const progress = 1 - (p.life / 15);
          const sweepAngle = p.angle! - Math.PI/2 + Math.PI * progress;
          p.x = player.x + Math.cos(sweepAngle) * p.distance!;
          p.y = player.y + Math.sin(sweepAngle) * p.distance!;
        } else if (p.type === 'spear') {
          const progress = p.life / 20;
          const extend = 1 - Math.abs(progress - 0.5) * 2;
          p.distance = extend * 150;
          p.x = player.x + Math.cos(p.angle!) * p.distance;
          p.y = player.y + Math.sin(p.angle!) * p.distance;
        } else if (p.type === 'laser') {
          p.x = player.x;
          p.y = player.y;
        } else if (p.type === 'magicwand') {
          if (p.target && p.target.hp > 0) {
            const angle = Math.atan2(p.target.y - p.y, p.target.x - p.x);
            const speed = Math.hypot(p.vx, p.vy);
            const currentAngle = Math.atan2(p.vy, p.vx);
            let diff = angle - currentAngle;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            const newAngle = currentAngle + diff * 0.08;
            p.vx = Math.cos(newAngle) * speed;
            p.vy = Math.sin(newAngle) * speed;
          } else {
            let closest = null, minDist = Infinity;
            for (const e of enemies) {
              const dist = Math.hypot(e.x - p.x, e.y - p.y);
              if (dist < minDist) { minDist = dist; closest = e; }
            }
            p.target = closest;
          }
          p.x += p.vx; p.y += p.vy;
        } else if (p.type === 'shuriken') {
          if (p.life < 40) {
            if (p.life === 39) p.hit.clear();
            const angle = Math.atan2(player.y - p.y, player.x - p.x);
            const speed = Math.min(15, Math.hypot(p.vx, p.vy) + 0.3);
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed;
            if (Math.hypot(player.x - p.x, player.y - p.y) < player.radius + p.radius) {
              p.life = 0;
            }
          }
          p.x += p.vx; p.y += p.vy;
        } else if (p.type === 'laser_orbital') {
          p.angle! += 0.05;
          p.x = player.x;
          p.y = player.y;
          p.hit.clear();
        } else if (p.type === 'boomerang_orbit') {
          p.angle! += 0.03;
          p.distance! += 0.1;
          p.x = player.x + Math.cos(p.angle!) * p.distance!;
          p.y = player.y + Math.sin(p.angle!) * p.distance!;
          p.hit.clear();
        } else if (p.type === 'shuriken_orbit') {
          p.angle! += 0.05;
          p.x = player.x + Math.cos(p.angle!) * p.distance!;
          p.y = player.y + Math.sin(p.angle!) * p.distance!;
          p.hit.clear();
        } else if (p.type === 'poison_pool') {
          if (s.frameCount % (s.upgradeLevels['poison_cloud'] ? 15 : 30) === 0) p.hit.clear();
        } else if (p.type === 'mine') {
          const closeEnemy = enemies.find(e => Math.hypot(e.x - p.x, e.y - p.y) < p.radius + e.radius + 20);
          if (closeEnemy) {
            p.life = 0;
          }
        } else if (p.type === 'satellite') {
          p.angle = (p.angle || 0) + 0.1;
          p.x = player.x + Math.cos(p.angle) * (p.distance || 60);
          p.y = player.y + Math.sin(p.angle) * (p.distance || 60);
          p.hit.clear();
        } else if (p.type === 'chakram') {
          p.angle = (p.angle || 0) + 0.05;
          const speed = Math.hypot(p.vx, p.vy);
          p.vx = Math.cos(p.angle) * speed;
          p.vy = Math.sin(p.angle) * speed;
        } else if (p.type === 'blackhole') {
          for (const e of enemies) {
            const dist = Math.hypot(e.x - p.x, e.y - p.y);
            if (dist < p.radius) {
              const angle = Math.atan2(p.y - e.y, p.x - e.x);
              e.x += Math.cos(angle) * 3;
              e.y += Math.sin(angle) * 3;
            }
          }
          p.hit.clear();
        } else if (p.type === 'aura') {
          p.x = player.x;
          p.y = player.y;
          p.hit.clear();
          if (s.upgradeLevels['aura_freeze']) {
            for (const e of enemies) {
              if (Math.hypot(e.x - p.x, e.y - p.y) < p.radius) {
                e.x += Math.cos(Math.atan2(e.y - player.y, e.x - player.x)) * e.speed * 0.75;
                e.y += Math.sin(Math.atan2(e.y - player.y, e.x - player.x)) * e.speed * 0.75;
              }
            }
          }
        } else if (p.type === 'lightning') {
          p.x += p.vx; p.y += p.vy;
        } else if (p.type === 'scythe') {
          p.angle! += 0.04 * p.speed!;
          p.distance! += 2;
          p.x = player.x + Math.cos(p.angle!) * p.distance!;
          p.y = player.y + Math.sin(p.angle!) * p.distance!;
        } else if (p.type === 'boomerang') {
          const progress = p.life / 60;
          if (progress > 0.5) {
            p.x += p.vx; p.y += p.vy;
            p.vx *= 0.95; p.vy *= 0.95;
          } else {
            const angle = Math.atan2(player.y - p.y, player.x - p.x);
            p.vx += Math.cos(angle) * 1;
            p.vy += Math.sin(angle) * 1;
            p.x += p.vx; p.y += p.vy;
            if (Math.hypot(player.x - p.x, player.y - p.y) < player.radius + p.radius) {
              p.life = 0;
            }
          }
        } else if (p.type === 'explosion') {
          // Explosion doesn't move
        } else {
          p.x += p.vx; p.y += p.vy;
        }
        
        p.life--;
        if (p.life <= 0) { 
          if (p.type === 'fireball') {
            let expRadius = s.upgradeLevels['fireball_meteor'] ? 400 : 80;
            let expDamage = p.damage;
            projectiles.push({
              x: p.x, y: p.y, vx: 0, vy: 0,
              damage: expDamage, life: 10, pierce: 999, hit: new Set(), radius: expRadius, bounce: 0,
              type: 'explosion'
            });
          } else if (p.type === 'rocket') {
            let expRadius = s.upgradeLevels['rocket_nuke'] ? p.radius * 6 : p.radius * 3;
            let expDamage = s.upgradeLevels['rocket_nuke'] ? p.damage * 3 : p.damage;
            projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: expDamage, life: 5, pierce: 999, hit: new Set(), radius: expRadius, bounce: 0, type: 'explosion' });
          } else if (p.type === 'poison_flask') {
            let poolRadius = s.upgradeLevels['poison_cloud'] ? p.radius * 4 : p.radius * 2;
            let poolDamage = s.upgradeLevels['poison_cloud'] ? p.damage * 0.4 : p.damage * 0.2;
            projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: poolDamage, life: 120, pierce: 999, hit: new Set(), radius: poolRadius, bounce: 0, type: 'poison_pool' });
          } else if (p.type === 'mine') {
            projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: p.damage * 2, life: 5, pierce: 999, hit: new Set(), radius: p.radius * 3, bounce: 0, type: 'explosion' });
          }
          projectiles.splice(i, 1); 
          continue; 
        }

        for (let j = enemies.length - 1; j >= 0; j--) {
          const e = enemies[j];
          let isHit = false;
          
          if (p.type === 'laser' || p.type === 'laser_orbital') {
            const dx = e.x - p.x;
            const dy = e.y - p.y;
            const localX = dx * Math.cos(p.angle!) + dy * Math.sin(p.angle!);
            const localY = -dx * Math.sin(p.angle!) + dy * Math.cos(p.angle!);
            if (localX > 0 && localX < p.distance! && Math.abs(localY) < p.radius + e.radius) {
              isHit = true;
            }
          } else {
            if (Math.hypot(p.x - e.x, p.y - e.y) < p.radius + e.radius) {
              isHit = true;
            }
          }

          if (!p.hit.has(e) && isHit) {
            if (p.type === 'rocket' || p.type === 'poison_flask' || p.type === 'mine') {
              p.life = 0;
            }
            if (p.type === 'whip' && s.upgradeLevels['whip_vampire'] && Math.random() < 0.2) {
              player.hp = Math.min(player.maxHp, player.hp + 1);
            }
            
            p.hit.add(e);
            
            // Crit
            let dmg = p.damage;
            let isCrit = false;
            if (Math.random() < stats.crit) {
              dmg *= 2;
              isCrit = true;
            }
            e.hp -= dmg;
            
            s.damageTexts.push({
              x: e.x + (Math.random() - 0.5) * 20,
              y: e.y - e.radius - 10 + (Math.random() - 0.5) * 20,
              text: Math.floor(dmg).toString(),
              life: 30,
              color: isCrit ? '#fbbf24' : '#ffffff'
            });
            
            // Knockback
            const kb = p.knockback ?? stats.knockback;
            if (kb > 0 && !e.isBoss) {
              const angle = Math.atan2(e.y - player.y, e.x - player.x);
              e.x += Math.cos(angle) * kb;
              e.y += Math.sin(angle) * kb;
            }

            if (e.hp <= 0) {
              if (p.type === 'scythe' && s.upgradeLevels['scythe_execution']) {
                stats.scytheBonusDamage += 1;
              }
              if (p.type === 'magicwand' && s.upgradeLevels['magicwand_blackhole']) {
                projectiles.push({
                  x: e.x, y: e.y, vx: 0, vy: 0, damage: p.damage * 0.1, life: 60, pierce: 999, hit: new Set(), radius: 150, bounce: 0, type: 'blackhole'
                });
              }
              if (e.isBoss) {
                for (let k = 0; k < 30; k++) {
                  gems.push({ x: e.x + (Math.random() - 0.5) * 80, y: e.y + (Math.random() - 0.5) * 80, value: e.maxHp / 10, radius: 10, color: '#ffd700' });
                }
              } else {
                gems.push({ x: e.x, y: e.y, value: e.maxHp, radius: 4 });
              }
              enemies.splice(j, 1);
              s.score += e.maxHp;
            }
            
            // Bounce
            let bounced = false;
            if (p.bounce > 0) {
              let closest = null, minDist = Infinity;
              for (const e2 of enemies) {
                if (e2 !== e && !p.hit.has(e2)) {
                  const dist = Math.hypot(e2.x - e.x, e2.y - e.y);
                  if (dist < minDist && dist < 400) { minDist = dist; closest = e2; }
                }
              }
              if (closest) {
                p.bounce--;
                bounced = true;
                const angle = Math.atan2(closest.y - e.y, closest.x - e.x);
                const speed = Math.hypot(p.vx, p.vy);
                p.vx = Math.cos(angle) * speed;
                p.vy = Math.sin(angle) * speed;
                p.x = e.x; p.y = e.y;
              }
            }

            if (!bounced) {
              p.pierce--;
              if (p.pierce <= 0) { 
                if (p.type === 'fireball') {
                  let expRadius = s.upgradeLevels['fireball_meteor'] ? 400 : 80;
                  let expDamage = p.damage;
                  projectiles.push({
                    x: p.x, y: p.y, vx: 0, vy: 0,
                    damage: expDamage, life: 10, pierce: 999, hit: new Set(), radius: expRadius, bounce: 0,
                    type: 'explosion'
                  });
                } else if (p.type === 'rocket') {
                  let expRadius = s.upgradeLevels['rocket_nuke'] ? p.radius * 6 : p.radius * 3;
                  let expDamage = s.upgradeLevels['rocket_nuke'] ? p.damage * 3 : p.damage;
                  projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: expDamage, life: 5, pierce: 999, hit: new Set(), radius: expRadius, bounce: 0, type: 'explosion' });
                } else if (p.type === 'poison_flask') {
                  let poolRadius = s.upgradeLevels['poison_cloud'] ? p.radius * 4 : p.radius * 2;
                  let poolDamage = s.upgradeLevels['poison_cloud'] ? p.damage * 0.4 : p.damage * 0.2;
                  projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: poolDamage, life: 120, pierce: 999, hit: new Set(), radius: poolRadius, bounce: 0, type: 'poison_pool' });
                } else if (p.type === 'mine') {
                  projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: p.damage * 2, life: 5, pierce: 999, hit: new Set(), radius: p.radius * 3, bounce: 0, type: 'explosion' });
                }
                projectiles.splice(i, 1); 
                break; 
              }
            }
          }
        }
      }

      // Update Enemies
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        const angle = Math.atan2(player.y - e.y, player.x - e.x);
        e.x += Math.cos(angle) * e.speed;
        e.y += Math.sin(angle) * e.speed;

        if (player.invuln <= 0 && Math.hypot(e.x - player.x, e.y - player.y) < e.radius + player.radius) {
          player.hp -= e.damage;
          player.invuln = 30;
          if (player.hp <= 0) {
            s.status = 'gameover';
            setUiState(prev => ({ ...prev, status: 'gameover', score: s.score, time: s.time }));
          }
        }
      }

      // Update Damage Texts
      for (let i = s.damageTexts.length - 1; i >= 0; i--) {
        const dt = s.damageTexts[i];
        dt.y -= 1;
        dt.life--;
        if (dt.life <= 0) {
          s.damageTexts.splice(i, 1);
        }
      }

      // Update Gems
      for (let i = gems.length - 1; i >= 0; i--) {
        const g = gems[i];
        const dist = Math.hypot(g.x - player.x, g.y - player.y);
        if (dist < player.magnet) { // Magnet radius
          const angle = Math.atan2(player.y - g.y, player.x - g.x);
          g.x += Math.cos(angle) * 8;
          g.y += Math.sin(angle) * 8;
          if (Math.hypot(g.x - player.x, g.y - player.y) < player.radius + g.radius) {
            player.xp += g.value * (1 + stats.xpBonus);
            gems.splice(i, 1);
            if (player.xp >= player.nextXp) {
              player.xp -= player.nextXp;
              player.level++;
              player.nextXp = Math.floor(player.nextXp * 1.1) + 2;
              
              s.status = 'levelup';
              
              // Pick 3 random upgrades
              let availableIds = ['dmg', 'rate', 'speed', 'hp', 'pierce', 'multi', 'magnet'];
              
              // Add weapon-specific synergy items ONLY if using that weapon
              if (s.weapons.includes('pistol')) availableIds.push('growth');
              if (s.weapons.includes('shotgun')) availableIds.push('knockback');
              if (s.weapons.includes('sniper')) availableIds.push('crit');
              if (s.weapons.includes('machinegun')) availableIds.push('bounce');
              if (s.weapons.includes('laser')) availableIds.push('pierce');
              if (s.weapons.includes('sword')) availableIds.push('knockback');
              if (s.weapons.includes('spear')) availableIds.push('speed');
              if (s.weapons.includes('magicwand')) availableIds.push('bounce');
              if (s.weapons.includes('shuriken')) availableIds.push('crit');
              if (s.weapons.includes('fireball')) availableIds.push('multi');
              if (s.weapons.includes('boomerang')) availableIds.push('speed');
              if (s.weapons.includes('lightning')) availableIds.push('rate');
              if (s.weapons.includes('aura')) availableIds.push('magnet');
              if (s.weapons.includes('scythe')) availableIds.push('crit');
              if (s.weapons.includes('rocket')) availableIds.push('multi');
              if (s.weapons.includes('flamethrower')) availableIds.push('pierce');
              if (s.weapons.includes('whip')) availableIds.push('knockback');
              if (s.weapons.includes('bow')) availableIds.push('speed');
              if (s.weapons.includes('poison')) availableIds.push('magnet');
              
              if (s.weapons.includes('drone')) availableIds.push('speed');
              if (s.weapons.includes('mine')) availableIds.push('multi');
              if (s.weapons.includes('satellite')) availableIds.push('dmg');
              if (s.weapons.includes('missile')) availableIds.push('multi');
              if (s.weapons.includes('chakram')) availableIds.push('speed');
              if (s.weapons.includes('icicle')) availableIds.push('pierce');
              if (s.weapons.includes('blackhole')) availableIds.push('magnet');
              
              availableIds = Array.from(new Set(availableIds));

              // Add unowned weapons to the pool
              if (s.weapons.length < 8) {
                const unownedWeapons = Object.keys(WEAPONS).filter(w => !s.weapons.includes(w));
                for (const w of unownedWeapons) {
                  availableIds.push(w);
                  availableIds.push(w); // Increase chance
                }
              }

              // Add unique upgrades
              for (const w of s.weapons) {
                const uniqueId = (WEAPONS[w as keyof typeof WEAPONS] as any).unique;
                if (uniqueId && !s.upgradeLevels[uniqueId]) {
                  availableIds.push(uniqueId);
                  availableIds.push(uniqueId); // Increase chance
                }
              }

              if (s.stats.multiShot >= 31) {
                availableIds = availableIds.filter(id => id !== 'multi');
              }
              const shuffled = availableIds.sort(() => 0.5 - Math.random());
              const choicesIds = Array.from(new Set(shuffled)).slice(0, 3);
              const choices = choicesIds.map(id => {
                const currentLevel = s.upgradeLevels[id] || 0;
                const info = getUpgradeInfo(id, currentLevel, s.weapon);
                return { id, level: currentLevel + 1, ...info };
              });
              
              setUiState(prev => ({ ...prev, status: 'levelup', level: player.level, choices }));
            }
          }
        }
      }
    };

    const draw = () => {
      const s = state.current;
      const { player, enemies, projectiles, gems } = s;

      // Background
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2 - player.x, canvas.height / 2 - player.y);

      // Grid
      ctx.strokeStyle = '#16213e';
      ctx.lineWidth = 2;
      const gridSize = 100;
      const startX = Math.floor((player.x - canvas.width / 2) / gridSize) * gridSize;
      const startY = Math.floor((player.y - canvas.height / 2) / gridSize) * gridSize;
      ctx.beginPath();
      for (let x = startX; x < player.x + canvas.width / 2; x += gridSize) {
        ctx.moveTo(x, player.y - canvas.height / 2);
        ctx.lineTo(x, player.y + canvas.height / 2);
      }
      for (let y = startY; y < player.y + canvas.height / 2; y += gridSize) {
        ctx.moveTo(player.x - canvas.width / 2, y);
        ctx.lineTo(player.x + canvas.width / 2, y);
      }
      ctx.stroke();

      // Gems
      for (const g of gems) {
        ctx.fillStyle = g.color || '#00ff88';
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Enemies
      for (const e of enemies) {
        if (e.isBoss) {
          const pulse = Math.sin(s.frameCount * 0.1) * 5;
          ctx.fillStyle = e.color;
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.radius + pulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 4;
          ctx.stroke();
          
          ctx.fillStyle = '#333';
          ctx.fillRect(e.x - 30, e.y - e.radius - 20, 60, 8);
          ctx.fillStyle = '#ff0000';
          ctx.fillRect(e.x - 30, e.y - e.radius - 20, 60 * (e.hp / e.maxHp), 8);
        } else {
          ctx.fillStyle = e.color;
          if (e.type === 'fast') {
            ctx.beginPath();
            ctx.moveTo(e.x, e.y - e.radius);
            ctx.lineTo(e.x + e.radius, e.y + e.radius);
            ctx.lineTo(e.x - e.radius, e.y + e.radius);
            ctx.fill();
          } else if (e.type === 'tank') {
            ctx.fillRect(e.x - e.radius, e.y - e.radius, e.radius * 2, e.radius * 2);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(e.x - e.radius, e.y - e.radius, e.radius * 2, e.radius * 2);
          } else {
            ctx.fillRect(e.x - e.radius, e.y - e.radius, e.radius * 2, e.radius * 2);
          }
        }
      }

      // Projectiles
      for (const p of projectiles) {
        if (p.type === 'sword') {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'sword_wave') {
          ctx.fillStyle = 'rgba(125, 211, 252, 0.8)';
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle!);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius, p.radius / 3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'spear') {
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = p.radius;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(player.x, player.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        } else if (p.type === 'laser') {
          ctx.strokeStyle = `rgba(56, 189, 248, ${p.life / 10})`;
          ctx.lineWidth = p.radius * 2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + Math.cos(p.angle!) * p.distance!, p.y + Math.sin(p.angle!) * p.distance!);
          ctx.stroke();
          ctx.strokeStyle = `rgba(255, 255, 255, ${p.life / 10})`;
          ctx.lineWidth = p.radius;
          ctx.stroke();
        } else if (p.type === 'laser_orbital') {
          ctx.strokeStyle = `rgba(56, 189, 248, 0.8)`;
          ctx.lineWidth = p.radius * 2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + Math.cos(p.angle!) * p.distance!, p.y + Math.sin(p.angle!) * p.distance!);
          ctx.stroke();
        } else if (p.type === 'magicwand') {
          ctx.fillStyle = '#a855f7';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius + 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'shuriken') {
          ctx.fillStyle = '#94a3b8';
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(s.frameCount * 0.5);
          ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
          ctx.restore();
        } else if (p.type === 'shuriken_orbit') {
          ctx.fillStyle = '#f472b6';
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(s.frameCount * 0.5);
          ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
          ctx.restore();
        } else if (p.type === 'fireball') {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'aura') {
          ctx.fillStyle = 'rgba(250, 204, 21, 0.2)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(250, 204, 21, 0.5)';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (p.type === 'lightning') {
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = p.radius;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - 100);
          ctx.lineTo(p.x, p.y + 100);
          ctx.stroke();
        } else if (p.type === 'scythe') {
          ctx.fillStyle = '#94a3b8';
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle! + Math.PI/4);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(p.radius, -p.radius, p.radius * 2, 0);
          ctx.quadraticCurveTo(p.radius, -p.radius/2, 0, 0);
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'boomerang') {
          ctx.fillStyle = '#38bdf8';
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(s.frameCount * 0.3);
          ctx.beginPath();
          ctx.moveTo(-p.radius, -p.radius/2);
          ctx.lineTo(p.radius, 0);
          ctx.lineTo(-p.radius, p.radius/2);
          ctx.lineTo(-p.radius/2, 0);
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'boomerang_orbit') {
          ctx.fillStyle = '#10b981';
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(s.frameCount * 0.3);
          ctx.beginPath();
          ctx.moveTo(-p.radius, -p.radius/2);
          ctx.lineTo(p.radius, 0);
          ctx.lineTo(-p.radius, p.radius/2);
          ctx.lineTo(-p.radius/2, 0);
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'explosion') {
          ctx.fillStyle = `rgba(249, 115, 22, ${p.life / 20})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'blackhole') {
          ctx.fillStyle = `rgba(0, 0, 0, ${p.life / 60})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = `rgba(168, 85, 247, ${p.life / 60})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (p.type === 'rocket') {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'flame') {
          const isBlue = s.upgradeLevels['flamethrower_blue'];
          ctx.fillStyle = isBlue ? `rgba(56, 182, 255, ${p.life / 20})` : `rgba(249, 115, 22, ${p.life / 20})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'whip') {
          ctx.fillStyle = `rgba(168, 85, 247, ${p.life / 10})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'arrow') {
          ctx.fillStyle = '#cbd5e1';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'poison_flask') {
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'poison_pool') {
          ctx.fillStyle = `rgba(34, 197, 94, ${p.life / 120 * 0.5})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'drone_shot') {
          ctx.fillStyle = '#eab308';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'mine') {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'satellite') {
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'missile') {
          ctx.fillStyle = '#d946ef';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'chakram') {
          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'icicle') {
          ctx.fillStyle = '#67e8f9';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#f9a826';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Player
      ctx.fillStyle = '#4ecca3';
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (player.invuln > 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Damage Texts
      if (uiState.showDamageNumbers) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (const dt of s.damageTexts) {
          ctx.font = `bold ${12 + (dt.life / 30) * 8}px sans-serif`;
          ctx.globalAlpha = dt.life / 30;
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.strokeText(dt.text, dt.x, dt.y);
          ctx.fillStyle = dt.color;
          ctx.fillText(dt.text, dt.x, dt.y);
          ctx.globalAlpha = 1.0;
        }
      }

      ctx.restore();

      // Joystick
      if (s.joystick.active) {
        const { originX, originY, currentX, currentY } = s.joystick;
        const maxDist = 50;
        const dist = Math.hypot(currentX - originX, currentY - originY);
        const angle = Math.atan2(currentY - originY, currentX - originX);
        
        const knobX = originX + Math.cos(angle) * Math.min(dist, maxDist);
        const knobY = originY + Math.sin(angle) * Math.min(dist, maxDist);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.arc(originX, originY, maxDist, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(knobX, knobY, 20, 0, Math.PI * 2);
        ctx.fill();
      }

      // UI (Drawn on canvas for performance)
      if (s.status === 'playing') {
        // HP Bar
        ctx.fillStyle = '#333';
        ctx.fillRect(20, 20, 200, 20);
        ctx.fillStyle = '#e94560';
        ctx.fillRect(20, 20, 200 * Math.max(0, player.hp / player.maxHp), 20);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(20, 20, 200, 20);
        ctx.fillStyle = '#fff';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.ceil(player.hp)} / ${player.maxHp}`, 120, 35);

        // XP Bar
        ctx.fillStyle = '#333';
        ctx.fillRect(20, 50, canvas.width - 40, 10);
        ctx.fillStyle = '#00ff88';
        ctx.fillRect(20, 50, (canvas.width - 40) * (player.xp / player.nextXp), 10);
        
        // Stats text
        ctx.textAlign = 'right';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`レベル ${player.level}`, canvas.width - 20, 40);
        
        ctx.textAlign = 'center';
        ctx.fillText(`時間: ${Math.floor(s.time / 60)}:${(s.time % 60).toString().padStart(2, '0')}`, canvas.width / 2, 40);
      }
    };

    const loop = () => {
      if (state.current.status === 'playing') {
        updatePhysics();
      }
      draw();
      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans select-none touch-none">
      <canvas ref={canvasRef} className="absolute inset-0 block" />

      {/* Pause Button for Touch/Mouse */}
      {uiState.status === 'playing' && (
        <button 
          onClick={() => {
            state.current.status = 'paused';
            setUiState(prev => ({ ...prev, status: 'paused' }));
          }}
          className="absolute top-4 right-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 p-3 rounded-full text-white z-40 backdrop-blur-sm"
        >
          <div className="w-4 h-4 flex gap-1 justify-center">
            <div className="w-1.5 bg-white rounded-full h-full"></div>
            <div className="w-1.5 bg-white rounded-full h-full"></div>
          </div>
        </button>
      )}

      {/* Main Menu */}
      {uiState.status === 'menu' && (
        <div className="absolute inset-0 flex flex-col items-center justify-start md:justify-center bg-black/80 backdrop-blur-sm z-50 overflow-y-auto py-10">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-8 tracking-tighter shrink-0 mt-10 md:mt-0">
            ROGUE SURVIVOR
          </h1>
          
          <div className="mb-8 flex items-center gap-3 bg-slate-800/50 px-6 py-3 rounded-full border border-slate-700">
            <input 
              type="checkbox" 
              id="showDamage" 
              checked={uiState.showDamageNumbers}
              onChange={(e) => setUiState(s => ({ ...s, showDamageNumbers: e.target.checked }))}
              className="w-5 h-5 accent-emerald-500 cursor-pointer"
            />
            <label htmlFor="showDamage" className="text-white font-medium cursor-pointer select-none">
              ダメージ数値を表示する
            </label>
          </div>

          {!uiState.selectedCategory ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-6">武器の系統を選択</h2>
              <div className="flex flex-wrap justify-center gap-4 mb-12 max-w-5xl px-4 shrink-0">
                {Object.entries(WEAPON_CATEGORIES).filter(([key]) => key !== 'sub').map(([key, cat]) => {
                  const Icon = cat.icon;
                  return (
                    <button 
                      key={key}
                      onClick={() => setUiState(s => ({ ...s, selectedCategory: key, selectedWeapon: cat.weapons[0] }))}
                      className="p-6 rounded-2xl border-2 border-slate-700 bg-slate-800/50 hover:border-emerald-500 hover:bg-emerald-500/10 text-left transition-all w-64"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="text-emerald-400" size={28} />
                        <div className="text-2xl font-bold text-white">{cat.name}</div>
                      </div>
                      <div className="text-sm text-slate-300 h-10">{cat.desc}</div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-6">
                <button 
                  onClick={() => setUiState(s => ({ ...s, selectedCategory: null }))}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 bg-slate-800 px-4 py-2 rounded-full"
                >
                  ← 系統選択に戻る
                </button>
                <h2 className="text-2xl font-bold text-white">
                  {WEAPON_CATEGORIES[uiState.selectedCategory as keyof typeof WEAPON_CATEGORIES].name}を選択中
                </h2>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 mb-12 max-w-5xl px-4 shrink-0">
                {WEAPON_CATEGORIES[uiState.selectedCategory as keyof typeof WEAPON_CATEGORIES].weapons.map(key => {
                  const w = WEAPONS[key as keyof typeof WEAPONS];
                  return (
                    <button 
                      key={key}
                      onClick={() => setUiState(s => ({ ...s, selectedWeapon: key }))}
                      className={`p-6 rounded-2xl border-2 text-left transition-all w-64 ${uiState.selectedWeapon === key ? 'border-emerald-500 bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'}`}
                    >
                      <div className="text-2xl font-bold text-white mb-2">{w.name}</div>
                      <div className="text-sm text-slate-300 mb-4 h-10">{w.desc}</div>
                      {w.synergies.length > 0 && (
                        <div className="text-xs font-bold text-emerald-400 bg-emerald-400/10 p-2 rounded">
                          シナジー: {w.synergies.map(s => getUpgradeInfo(s, 0, key).name).join(', ')}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={startGame}
                className="flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-5 rounded-full font-bold text-2xl transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.5)] shrink-0 mb-10"
              >
                <Play size={32} fill="currentColor" />
                ゲームスタート
              </button>
            </>
          )}
        </div>
      )}

      {/* Level Up Overlay */}
      {uiState.status === 'levelup' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md z-50">
          <h2 className="text-5xl font-black text-emerald-400 mb-2 drop-shadow-lg">レベルアップ！</h2>
          <p className="text-xl text-white mb-10 font-medium">レベル {uiState.level} に到達しました</p>
          
          <div className="flex flex-col md:flex-row gap-6">
            {uiState.choices.map((choice, i) => {
              const Icon = choice.icon;
              return (
                <button
                  key={i}
                  onClick={() => applyUpgrade(choice.id)}
                  className="group relative bg-slate-800 border-2 border-slate-600 hover:border-emerald-400 p-6 rounded-2xl w-64 text-left transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(16,185,129,0.3)] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Icon size={48} className={`mb-4 ${choice.color}`} />
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-between">
                    {choice.name}
                    <span className="text-emerald-400 text-lg">Lv.{choice.level}</span>
                  </h3>
                  <p className="text-slate-400 font-medium">{choice.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Game Over Overlay */}
      {uiState.status === 'gameover' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/80 backdrop-blur-md z-50">
          <h2 className="text-7xl font-black text-red-500 mb-4 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">ゲームオーバー</h2>
          <div className="bg-black/50 p-8 rounded-3xl border border-red-900/50 mb-10 text-center min-w-[300px]">
            <p className="text-gray-400 text-lg mb-1">生存時間</p>
            <p className="text-4xl font-bold text-white mb-6">
              {Math.floor(uiState.time / 60)}:{(uiState.time % 60).toString().padStart(2, '0')}
            </p>
            <p className="text-gray-400 text-lg mb-1">スコア</p>
            <p className="text-4xl font-bold text-emerald-400">{uiState.score}</p>
          </div>
          <button 
            onClick={startGame}
            className="flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white px-10 py-5 rounded-full font-bold text-2xl transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(220,38,38,0.5)]"
          >
            <RotateCcw size={32} />
            もう一度プレイ
          </button>
        </div>
      )}

      {/* Pause Overlay */}
      {uiState.status === 'paused' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-50">
          <h2 className="text-5xl font-black text-white mb-8 tracking-widest">PAUSED</h2>
          
          <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-600 w-full max-w-2xl max-h-[60vh] overflow-y-auto flex flex-col">
            <h3 className="text-2xl font-bold text-emerald-400 mb-4 border-b border-slate-600 pb-2 shrink-0">現在の装備</h3>
            <div className="text-xl text-white mb-6 shrink-0">
              武器: <span className="font-bold text-emerald-300">{state.current.weapons.map(w => WEAPONS[w as keyof typeof WEAPONS].name).join(', ')}</span>
            </div>
            
            <h3 className="text-2xl font-bold text-emerald-400 mb-4 border-b border-slate-600 pb-2 shrink-0">取得アイテム</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-2 custom-scrollbar">
              {Object.entries(state.current.upgradeLevels).map(([id, level]) => {
                const info = getUpgradeInfo(id, (level as number) - 1, state.current.weapon);
                const Icon = info.icon;
                return (
                  <div key={id} className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                    <Icon className={info.color} size={24} />
                    <div>
                      <div className="text-white font-bold text-sm">{info.name}</div>
                      <div className="text-emerald-400 text-xs font-bold">Lv.{level}</div>
                    </div>
                  </div>
                );
              })}
              {Object.keys(state.current.upgradeLevels).length === 0 && (
                <div className="text-slate-400 col-span-full">まだアイテムを取得していません</div>
              )}
            </div>
          </div>
          
          <button 
            onClick={() => {
              state.current.status = 'playing';
              setUiState(prev => ({ ...prev, status: 'playing' }));
            }}
            className="mt-10 bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-4 rounded-full font-bold text-xl transition-transform hover:scale-105 active:scale-95"
          >
            ゲーム再開
          </button>
        </div>
      )}
    </div>
  );
}
