import React, { useEffect, useRef, useState } from 'react';
import { Sword, Zap, FastForward, Heart, Crosshair, Copy, Play, RotateCcw, Magnet, Wind, Maximize, Target, Hammer, TrendingUp, CornerUpRight, Wand2, ArrowUp, Shield, Flame, Ghost, Droplet, Skull, Star, Ban, Terminal } from 'lucide-react';

type UpgradeChoice = { id: string; name: string; desc: string; icon: any; color: string; level: number };

const WEAPONS = {
  pistol: { name: 'ピストル', desc: 'バランスが良く、弱点がない標準的な武器', synergies: ['growth'], uniques: ['pistol_roulette', 'pistol_burst'] },
  shotgun: { name: 'ショットガン', desc: 'マルチショットと貫通に優れるが、移動速度が遅い', synergies: ['multi', 'pierce', 'knockback'], uniques: ['shotgun_blast', 'shotgun_slug'] },
  sniper: { name: 'スナイパー', desc: '高い威力と弾速を誇るが、連射速度が極端に遅い', synergies: ['dmg', 'crit'], uniques: ['sniper_assassin', 'sniper_pierce'] },
  machinegun: { name: 'マシンガン', desc: '圧倒的な連射速度だが、1発の威力が非常に低い', synergies: ['rate', 'bounce'], uniques: ['machinegun_minigun', 'machinegun_spread'] },
  laser: { name: 'レーザー', desc: '一瞬で画面端まで届くが、攻撃範囲が非常に狭く当てにくい', synergies: ['rate', 'pierce'], uniques: ['laser_orbital', 'laser_refract'] },
  sword: { name: '聖剣', desc: '自身の周囲を薙ぎ払うが、射程が極端に短く敵に接近する必要がある', synergies: ['dmg', 'knockback'], uniques: ['sword_blood', 'sword_wave'] },
  spear: { name: 'スピア', desc: '前方に素早く突き出すが、攻撃範囲が狭く側面や背後が完全に無防備', synergies: ['pierce', 'speed'], uniques: ['spear_dash', 'spear_flurry'] },
  magicwand: { name: '魔法の杖', desc: '自動追尾するが、弾速が遅く貫通力がないため群れに弱い', synergies: ['rate', 'bounce'], uniques: ['magicwand_blackhole', 'magicwand_chain'] },
  shuriken: { name: '手裏剣', desc: '手元に戻ってくるが、威力が低く敵を押し返せない', synergies: ['pierce', 'luck'], uniques: ['shuriken_orbit', 'shuriken_shadow'] },
  fireball: { name: 'ファイアボール', desc: '爆発で周囲を巻き込むが、弾速が非常に遅く連射も効かない', synergies: ['dmg', 'multi'], uniques: ['fireball_meteor', 'fireball_napalm'] },
  boomerang: { name: 'ブーメラン', desc: '弧を描いて飛び、手元に戻ってくる', synergies: ['speed', 'pierce'], uniques: ['boomerang_orbit', 'boomerang_split'] },
  lightning: { name: '雷撃の書', desc: 'ランダムな敵の頭上に雷を落とす必中攻撃', synergies: ['dmg', 'rate'], uniques: ['lightning_storm', 'lightning_chain'] },
  aura: { name: '聖なるオーラ', desc: '自身の周囲に持続ダメージを与える領域を展開する', synergies: ['regen', 'magnet'], uniques: ['aura_freeze', 'aura_heal'] },
  scythe: { name: '死神の大鎌', desc: '自身の周囲を回転しながら徐々に広がっていく', synergies: ['dmg', 'crit'], uniques: ['scythe_execution', 'scythe_vortex'] },
  rocket: { name: 'ロケット', desc: '着弾時に広範囲に爆発ダメージを与える', synergies: ['dmg', 'multi'], uniques: ['rocket_nuke', 'rocket_cluster'] },
  flamethrower: { name: '火炎放射器', desc: '前方に炎を放射し続ける。射程は短いが貫通する', synergies: ['rate', 'pierce'], uniques: ['flamethrower_blue', 'flamethrower_wall'] },
  whip: { name: '鞭', desc: '前方の広範囲を薙ぎ払う。ノックバック力が高い', synergies: ['dmg', 'knockback'], uniques: ['whip_vampire', 'whip_thunder'] },
  bow: { name: 'クロスボウ', desc: '高速で敵を貫通する矢を放つ', synergies: ['speed', 'pierce'], uniques: ['bow_multishot', 'bow_explosive'] },
  poison: { name: '毒フラスコ', desc: '着弾地点にダメージを与える毒沼を生成する', synergies: ['growth', 'magnet'], uniques: ['poison_cloud', 'poison_corrosion'] },
  chainsaw: { name: 'チェーンソー', desc: '自身の前方に常に判定を出し続ける', synergies: ['dmg', 'armor'], uniques: ['chainsaw_extend', 'chainsaw_bloodbath'] },
  yoyo: { name: 'ヨーヨー', desc: '自身の周囲を不規則に飛び回る', synergies: ['speed', 'bounce'], uniques: ['yoyo_orbit', 'yoyo_saw'] },
  mace: { name: 'メイス', desc: '自身の周囲をゆっくりと回転し、敵を大きく吹き飛ばす', synergies: ['knockback', 'dmg'], uniques: ['mace_stun', 'mace_quake'] },
  knife: { name: 'ナイフ', desc: '向いている方向に素早くナイフを投げる', synergies: ['rate', 'speed'], uniques: [] },
  axe: { name: '斧', desc: '放物線を描いて飛び、上から敵を叩き割る', synergies: ['dmg', 'knockback'], uniques: [] },
  plasma_rifle: { name: 'プラズマライフル', desc: '貫通する太いビームを撃つ', synergies: ['pierce', 'cooldown'], uniques: ['plasma_overcharge', 'plasma_split'] },
  drone: { name: '戦闘ドローン', desc: '周囲の敵を自動で狙い撃つ', synergies: ['rate', 'speed'], isSubOnly: true, uniques: ['drone_laser', 'drone_swarm'] },
  mine: { name: '地雷', desc: '移動中に足元に地雷を設置する', synergies: ['dmg', 'multi'], isSubOnly: true, uniques: ['mine_cluster', 'mine_emp'] },
  satellite: { name: 'サテライト', desc: '自身の周囲を回転する攻撃オーブを展開する', synergies: ['speed', 'dmg'], isSubOnly: true, uniques: ['satellite_shield', 'satellite_blade'] },
  missile: { name: '追尾ミサイル', desc: '上空から敵を追尾するミサイルを呼び出す', synergies: ['multi', 'dmg'], isSubOnly: true, uniques: ['missile_nuke', 'missile_swarm'] },
  chakram: { name: 'チャクラム', desc: '自身の周囲を大きく円を描いて飛ぶ', synergies: ['speed', 'pierce'], isSubOnly: true, uniques: ['chakram_split', 'chakram_flame'] },
  icicle: { name: 'アイシクル', desc: '全方位に氷のつぶてを放つ', synergies: ['multi', 'pierce'], isSubOnly: true, uniques: ['icicle_freeze', 'icicle_shatter'] },
  blackhole: { name: 'ブラックホール', desc: '敵を吸い寄せてダメージを与える空間を生成する', synergies: ['magnet', 'dmg'], isSubOnly: true, uniques: ['blackhole_supermassive', 'blackhole_quasar'] },
  turret: { name: 'タレット', desc: 'その場に設置され、近くの敵を自動で撃つ', synergies: ['rate', 'cooldown'], isSubOnly: true, uniques: ['turret_twin', 'turret_rocket'] },
  barrier: { name: 'バリア', desc: 'プレイヤーの周囲に展開され、敵を弾き飛ばす', synergies: ['regen', 'knockback'], isSubOnly: true, uniques: ['barrier_reflect', 'barrier_shock'] },
  
  // Explosive
  grenade: { name: '手榴弾', desc: '敵に当たると即座に大爆発を起こす手榴弾', synergies: ['growth', 'dmg'], uniques: ['grenade_cluster', 'grenade_napalm'] },
  mortar: { name: '迫撃砲', desc: '空高く撃ち上げ、敵の頭上に降り注ぐ', synergies: ['growth', 'cooldown'], uniques: ['mortar_nuke', 'mortar_rapid'] },
  c4: { name: 'C4爆弾', desc: '前方に投げつけ、一定時間後に広範囲を吹き飛ばす時限爆弾', synergies: ['dmg', 'growth'], uniques: ['c4_chain', 'c4_emp'] },
  cluster_bomb: { name: 'クラスター爆弾', desc: '爆発時に小さな爆弾を周囲にばらまく', synergies: ['multi', 'growth'], uniques: ['cluster_bounce', 'cluster_shrapnel'] },

  // Summon
  slime: { name: 'スライム', desc: 'プレイヤーの周囲を跳ね回り、触れた敵にダメージ', synergies: ['bounce', 'regen'], uniques: ['slime_split', 'slime_acid'] },
  skeleton: { name: 'スケルトン', desc: '敵に向かって歩き、近接攻撃を行う', synergies: ['dmg', 'armor'], uniques: ['skeleton_shield', 'skeleton_archer'] },
  bat: { name: 'コウモリ', desc: '高速で飛び回り、敵を自動で追尾する', synergies: ['speed', 'luck'], uniques: ['bat_vampire', 'bat_swarm'] },
  ghost: { name: 'ゴースト', desc: 'ゆっくりと直進し、触れた敵をすり抜けながら継続ダメージを与える', synergies: ['pierce', 'cooldown'], uniques: ['ghost_fear', 'ghost_drain'] },

  // Holy
  holy_cross: { name: '十字架', desc: '十字方向（4方向）に同時に貫通する十字架を放つ', synergies: ['dmg', 'pierce'], uniques: ['cross_orbit', 'cross_beam'] },
  smite: { name: '天罰', desc: '画面内にいるすべての敵に同時に裁きの光を下す', synergies: ['dmg', 'cooldown'], uniques: ['smite_chain', 'smite_stun'] },
  holy_water: { name: '聖水', desc: 'プレイヤーの歩いた軌跡に、ダメージを与える聖水の跡を残す', synergies: ['growth', 'regen'], uniques: ['water_heal', 'water_freeze'] },
  bible: { name: '聖書', desc: 'プレイヤーの周囲を回転しながら、徐々に外側へ広がっていく', synergies: ['speed', 'knockback'], uniques: ['bible_expand', 'bible_blood'] },
  
  // Forbidden
  demonic_sword: { name: '魔剣ダインスレイヴ', desc: '【禁忌】絶大な威力を誇るが、振るたびに自身の命を削る', synergies: [], uniques: [] },
  abyss_orb: { name: '深淵の宝珠', desc: '【禁忌】周囲の敵を吸い込み、消滅させる暗黒の球体', synergies: [], uniques: [] },
};

const SPECIAL_EVOLUTIONS = {
  magic_sword: { name: '魔法剣', desc: (lvl: number) => `【特殊進化: 聖剣＋チャクラム】剣を振るたびに${lvl * 4}本の魔法の矢が全方位に飛ぶ`, req: ['sword', 'chakram'], icon: Wand2, color: 'text-fuchsia-400' },
  hellfire: { name: 'ヘルファイア', desc: (lvl: number) => `【特殊進化: ファイアボール＋地雷】数秒ごとに画面全体を焼き尽くす業火を放つ（威力Lv.${lvl}）`, req: ['fireball', 'mine'], icon: Maximize, color: 'text-red-500' },
  thunder_storm: { name: 'サンダーストーム', desc: (lvl: number) => `【特殊進化: 雷撃の書＋戦闘ドローン】自身の周囲に常に雷が落ち続ける（頻度Lv.${lvl}）`, req: ['lightning', 'drone'], icon: Zap, color: 'text-yellow-300' },
  glacier_arrow: { name: '氷結の矢', desc: (lvl: number) => `【特殊進化: クロスボウ＋アイシクル】矢が敵に当たると${lvl * 2}個の氷片に分裂し、周囲を凍らせる`, req: ['bow', 'icicle'], icon: ArrowUp, color: 'text-cyan-200' },
  death_vortex: { name: '死の渦', desc: (lvl: number) => `【特殊進化: 死神の大鎌＋ブラックホール】プレイヤーの周囲に巨大なブラックホールを纏い、近づく敵のHPを割合で削る（威力Lv.${lvl}）`, req: ['scythe', 'blackhole'], icon: RotateCcw, color: 'text-purple-500' },
  orbital_strike: { name: 'オービタルストライク', desc: (lvl: number) => `【特殊進化: レーザー＋サテライト】サテライトから最も近い敵へ自動的にレーザーが発射される（威力Lv.${lvl}）`, req: ['laser', 'satellite'], icon: Target, color: 'text-blue-400' },
  biohazard: { name: 'バイオハザード', desc: (lvl: number) => `【特殊進化: 毒フラスコ＋追尾ミサイル】ミサイル着弾時に、広範囲の敵を猛毒で蝕む沼を生成する（範囲Lv.${lvl}）`, req: ['poison', 'missile'], icon: Maximize, color: 'text-green-500' },
  carnage_waltz: { name: '殺戮の円舞曲', desc: (lvl: number) => `【特殊進化: チェーンソー＋バリア】プレイヤーの周囲に巨大なチェーンソーの刃が回転し続ける（威力Lv.${lvl}）`, req: ['chainsaw', 'barrier'], icon: RotateCcw, color: 'text-red-600' },
  annihilation_cannon: { name: '殲滅砲', desc: (lvl: number) => `【特殊進化: プラズマライフル＋タレット】タレットが極太のプラズマビームを撃つようになる（威力Lv.${lvl}）`, req: ['plasma_rifle', 'turret'], icon: Zap, color: 'text-cyan-500' },
  gun_kata: { name: 'ガン・カタ', desc: (lvl: number) => `【特殊進化: ピストル＋オーラ】オーラ範囲内の敵に自動でピストルを乱射する（連射力Lv.${lvl}）`, req: ['pistol', 'aura'], icon: Target, color: 'text-yellow-500' },
  bullet_hell: { name: '弾幕地獄', desc: (lvl: number) => `【特殊進化: マシンガン＋手裏剣】マシンガンの弾が敵を貫通し、さらに近くの敵へ跳ね返る（跳弾数Lv.${lvl}）`, req: ['machinegun', 'shuriken'], icon: Copy, color: 'text-orange-400' },
  heavy_artillery: { name: '重砲撃', desc: (lvl: number) => `【特殊進化: ショットガン＋追尾ミサイル】ショットガンの弾が着弾時に爆発するようになる（爆発範囲Lv.${lvl}）`, req: ['shotgun', 'missile'], icon: Maximize, color: 'text-red-500' },
  phantom_sniper: { name: '幻影の狙撃手', desc: (lvl: number) => `【特殊進化: スナイパー＋ブーメラン】スナイパーの弾が敵を貫通した後、プレイヤーの元へ戻ってくる（威力Lv.${lvl}）`, req: ['sniper', 'boomerang'], icon: ArrowUp, color: 'text-blue-500' },
  divine_judgment: { name: '神の裁き', desc: (lvl: number) => `【隠し武器: 十字架＋天罰】巨大な十字架が空から降り注ぎ、広範囲の敵を浄化する（威力Lv.${lvl}）`, req: ['holy_cross', 'smite'], icon: Star, color: 'text-yellow-200' },
  star_fall: { name: 'スターフォール', desc: (lvl: number) => `【特殊進化: 魔法の杖＋サテライト】無数の星が降り注ぎ、敵を自動追尾して攻撃する（弾数Lv.${lvl}）`, req: ['magicwand', 'satellite'], icon: Wand2, color: 'text-blue-300' },
  assassin_drone: { name: 'アサシンドローン', desc: (lvl: number) => `【特殊進化: ナイフ＋ドローン】ドローンが高速でナイフを乱射しながら敵を追尾する（連射力Lv.${lvl}）`, req: ['knife', 'drone'], icon: Target, color: 'text-gray-400' },
  tornado_axe: { name: 'トルネードアックス', desc: (lvl: number) => `【特殊進化: 斧＋ブーメラン】巨大な斧が竜巻のように回転しながらプレイヤーの周囲を飛び回る（威力Lv.${lvl}）`, req: ['axe', 'boomerang'], icon: RotateCcw, color: 'text-orange-600' },
  napalm_bomb: { name: 'ナパームボム', desc: (lvl: number) => `【特殊進化: 火炎放射器＋地雷】地雷が爆発すると、広範囲に長時間残る炎の海を作り出す（範囲Lv.${lvl}）`, req: ['flamethrower', 'mine'], icon: Maximize, color: 'text-red-600' },
  rocket_turret: { name: 'ロケットタレット', desc: (lvl: number) => `【特殊進化: ロケットランチャー＋タレット】タレットが追尾ロケットを連射するようになる（連射力Lv.${lvl}）`, req: ['rocket', 'turret'], icon: Target, color: 'text-red-400' },
  vampire_whip: { name: 'ヴァンパイアウィップ', desc: (lvl: number) => `【特殊進化: 鞭＋オーラ】鞭でダメージを与えた敵のHPを吸収し、自身を回復する（回復量Lv.${lvl}）`, req: ['whip', 'aura'], icon: Heart, color: 'text-red-700' },
  excalibur: { name: 'エクスカリバー', desc: (lvl: number) => `【隠し武器: 聖剣＋十字架】巨大な光の剣を振り下ろし、画面を両断する（威力Lv.${lvl}）`, req: ['sword', 'holy_cross'], icon: Sword, color: 'text-yellow-400' },
  gungnir: { name: 'グングニル', desc: (lvl: number) => `【隠し武器: 槍＋雷撃の書】必中の雷槍を投擲し、軌道上の全ての敵を貫く（威力Lv.${lvl}）`, req: ['spear', 'lightning'], icon: Zap, color: 'text-yellow-300' },
  ragnarok: { name: 'ラグナロク', desc: (lvl: number) => `【隠し最強武器: ブラックホール＋天罰＋レーザー】全てを無に帰す終焉の光を放つ（威力Lv.${lvl}）`, req: ['blackhole', 'smite', 'laser'], icon: Star, color: 'text-red-600' },
};

const UNIQUE_UPGRADES = {
  pistol_roulette: { name: '魔弾の射手', desc: (lvl: number) => `【ピストル専用】${10 + 5 * lvl}%の確率で、ダメージ${5 + 5 * lvl}倍・貫通無限の巨大な弾を発射する`, icon: Target, color: 'text-emerald-300' },
  pistol_burst: { name: 'バーストファイア', desc: (lvl: number) => `【ピストル専用】発射数が${lvl * 2}増加し、連射速度が上がる`, icon: Zap, color: 'text-yellow-300' },
  shotgun_blast: { name: 'ゼロ距離射撃', desc: (lvl: number) => `【ショットガン専用】射程が短くなるが、ダメージとノックバックが${5 + 5 * lvl}倍になる`, icon: Zap, color: 'text-red-500' },
  shotgun_slug: { name: 'スラグ弾', desc: (lvl: number) => `【ショットガン専用】拡散しなくなり、貫通力が${5 * lvl}、ダメージが${2 * lvl}倍になる`, icon: Target, color: 'text-orange-500' },
  sniper_assassin: { name: '暗殺者の眼', desc: (lvl: number) => `【スナイパー専用】敵との距離が離れているほどダメージが上がる（最大${5 + 5 * lvl}倍）`, icon: Crosshair, color: 'text-orange-500' },
  sniper_pierce: { name: '貫く魔眼', desc: (lvl: number) => `【スナイパー専用】貫通するたびにダメージが${20 * lvl}%増加する`, icon: ArrowUp, color: 'text-red-400' },
  machinegun_minigun: { name: '固定砲台', desc: (lvl: number) => `【マシンガン専用】移動速度が低下するが、発射数が${2 + 3 * lvl}倍になる`, icon: Wind, color: 'text-yellow-300' },
  machinegun_spread: { name: '弾幕展開', desc: (lvl: number) => `【マシンガン専用】弾が扇状に広がり、発射数が${lvl * 3}増加する`, icon: Copy, color: 'text-orange-300' },
  laser_orbital: { name: 'サテライトレーザー', desc: (lvl: number) => `【レーザー専用】レーザーがプレイヤーの周囲を回転し続けるようになる（回転速度Lv.${lvl}）`, icon: RotateCcw, color: 'text-cyan-300' },
  laser_refract: { name: '屈折光線', desc: (lvl: number) => `【レーザー専用】敵に当たると${lvl}回屈折して別の敵に向かう`, icon: Zap, color: 'text-blue-300' },
  sword_blood: { name: '狂戦士の剣', desc: (lvl: number) => `【聖剣専用】攻撃範囲とダメージが${2 + lvl}倍になるが、振るたびにHPが1減る`, icon: Sword, color: 'text-red-600' },
  sword_wave: { name: '真空刃', desc: (lvl: number) => `【聖剣専用】剣を振ると前方に飛ぶ斬撃（ダメージ${lvl * 50}%）を放つ`, icon: Wind, color: 'text-teal-300' },
  spear_dash: { name: '竜騎士の跳躍', desc: (lvl: number) => `【スピア専用】攻撃時、向いている方向に自身が高速ダッシュする（距離Lv.${lvl}）`, icon: FastForward, color: 'text-teal-300' },
  spear_flurry: { name: '百裂突き', desc: (lvl: number) => `【スピア専用】攻撃時に${lvl * 2}回連続で突くようになる`, icon: Sword, color: 'text-gray-300' },
  magicwand_blackhole: { name: '重力崩壊', desc: (lvl: number) => `【魔法の杖専用】弾が当たった場所に、敵を吸い寄せる重力場を発生させる（範囲Lv.${lvl}）`, icon: Magnet, color: 'text-purple-300' },
  magicwand_chain: { name: '連鎖魔法', desc: (lvl: number) => `【魔法の杖専用】敵に当たると${lvl * 2}回まで別の敵に連鎖する`, icon: Zap, color: 'text-pink-300' },
  shuriken_orbit: { name: '乱れ桜', desc: (lvl: number) => `【手裏剣専用】手裏剣がプレイヤーの周囲に滞空し、近づいた敵を自動で攻撃する（滞空時間Lv.${lvl}）`, icon: Target, color: 'text-pink-300' },
  shuriken_shadow: { name: '影分身', desc: (lvl: number) => `【手裏剣専用】手裏剣が飛ぶ途中で${lvl}個に分裂する`, icon: Copy, color: 'text-gray-400' },
  fireball_meteor: { name: 'メテオストライク', desc: (lvl: number) => `【ファイアボール専用】弾速が極端に落ちるが、画面を覆う超巨大な爆発を起こす（爆発範囲Lv.${lvl}）`, icon: Maximize, color: 'text-red-400' },
  fireball_napalm: { name: 'ナパーム弾', desc: (lvl: number) => `【ファイアボール専用】爆発後に${lvl * 2}秒間ダメージを与える炎が残る`, icon: Heart, color: 'text-orange-500' },
  boomerang_orbit: { name: '永劫の円月', desc: (lvl: number) => `【ブーメラン専用】手元に戻らず、プレイヤーの周囲を永遠に回り続ける（回転半径Lv.${lvl}）`, icon: RotateCcw, color: 'text-emerald-300' },
  boomerang_split: { name: '双月', desc: (lvl: number) => `【ブーメラン専用】戻ってくる時に${lvl + 1}個に分裂して飛ぶ`, icon: Copy, color: 'text-teal-400' },
  lightning_storm: { name: '裁きの雷', desc: (lvl: number) => `【雷撃の書専用】画面内のすべての敵に同時に雷が落ちるようになる（ダメージ倍率Lv.${lvl}）`, icon: Zap, color: 'text-yellow-300' },
  lightning_chain: { name: '連鎖雷', desc: (lvl: number) => `【雷撃の書専用】雷が落ちた後、周囲の敵${lvl * 3}体に連鎖する`, icon: Zap, color: 'text-blue-400' },
  aura_freeze: { name: '絶対零度', desc: (lvl: number) => `【聖なるオーラ専用】オーラ内の敵の移動速度を極端に遅くする（減速効果Lv.${lvl}）`, icon: Wind, color: 'text-blue-200' },
  aura_heal: { name: '癒しの光', desc: (lvl: number) => `【聖なるオーラ専用】オーラ内にいると毎秒HPが${lvl}回復する`, icon: Heart, color: 'text-green-300' },
  scythe_execution: { name: '魂の収穫', desc: (lvl: number) => `【死神の大鎌専用】大鎌で敵を倒すたびに、最大HPが永続的に+${lvl}され、同量回復する`, icon: Sword, color: 'text-purple-500' },
  scythe_vortex: { name: '死の旋風', desc: (lvl: number) => `【死神の大鎌専用】大鎌が回転しながら敵を少し吸い寄せる（吸引力Lv.${lvl}）`, icon: Magnet, color: 'text-gray-500' },
  rocket_nuke: { name: 'ニューク', desc: (lvl: number) => `【ロケット専用】爆発範囲とダメージが劇的に増加する（倍率Lv.${lvl}）`, icon: Target, color: 'text-red-500' },
  rocket_cluster: { name: 'クラスター爆弾', desc: (lvl: number) => `【ロケット専用】爆発時に${lvl * 3}個の小型爆弾をばらまく`, icon: Copy, color: 'text-orange-400' },
  flamethrower_blue: { name: '蒼い炎', desc: (lvl: number) => `【火炎放射器専用】炎が青くなり、ダメージが${lvl * 2}倍増する`, icon: Zap, color: 'text-blue-500' },
  flamethrower_wall: { name: '炎の壁', desc: (lvl: number) => `【火炎放射器専用】炎が通った跡に${lvl * 2}秒間ダメージを与える壁が残る`, icon: Wind, color: 'text-red-400' },
  whip_vampire: { name: '吸血の鞭', desc: (lvl: number) => `【鞭専用】敵にダメージを与えると${5 * lvl}%の確率でHPが回復する`, icon: Heart, color: 'text-red-600' },
  whip_thunder: { name: '雷鳴の鞭', desc: (lvl: number) => `【鞭専用】鞭の先端に当たった敵に雷が落ちる（ダメージLv.${lvl}）`, icon: Zap, color: 'text-yellow-400' },
  bow_multishot: { name: '五月雨撃ち', desc: (lvl: number) => `【クロスボウ専用】発射数が大幅に増加する（+${lvl * 3}）`, icon: Copy, color: 'text-green-500' },
  bow_explosive: { name: '爆裂矢', desc: (lvl: number) => `【クロスボウ専用】矢が敵に当たると爆発する（爆発範囲Lv.${lvl}）`, icon: Target, color: 'text-red-400' },
  poison_cloud: { name: '猛毒の霧', desc: (lvl: number) => `【毒フラスコ専用】毒沼の範囲が広がり、ダメージ間隔が短くなる（効果Lv.${lvl}）`, icon: Wind, color: 'text-purple-500' },
  poison_corrosion: { name: '腐食毒', desc: (lvl: number) => `【毒フラスコ専用】毒を受けた敵の防御力が下がり、受けるダメージが${lvl * 20}%増加する`, icon: ArrowUp, color: 'text-green-400' },
  drone_laser: { name: 'レーザードローン', desc: (lvl: number) => `【ドローン専用】ドローンの攻撃が貫通するレーザーになる（ダメージLv.${lvl}）`, icon: Zap, color: 'text-cyan-400' },
  drone_swarm: { name: 'ドローンスウォーム', desc: (lvl: number) => `【ドローン専用】ドローンの数が${lvl}体増える`, icon: Copy, color: 'text-gray-300' },
  mine_cluster: { name: 'クラスター地雷', desc: (lvl: number) => `【地雷専用】爆発時に${lvl * 2}個の小型地雷をばらまく`, icon: Target, color: 'text-orange-400' },
  mine_emp: { name: 'EMP地雷', desc: (lvl: number) => `【地雷専用】爆発時に敵を${lvl}秒間スタンさせる`, icon: Zap, color: 'text-blue-300' },
  satellite_shield: { name: 'シールドサテライト', desc: (lvl: number) => `【サテライト専用】サテライトが敵を大きくノックバックさせる（力Lv.${lvl}）`, icon: Shield, color: 'text-teal-300' },
  satellite_blade: { name: 'ブレードサテライト', desc: (lvl: number) => `【サテライト専用】サテライトのダメージが${lvl * 2}倍になり、出血効果を与える`, icon: Sword, color: 'text-red-400' },
  missile_nuke: { name: '核ミサイル', desc: (lvl: number) => `【ミサイル専用】爆発範囲が画面全体になり、ダメージが${lvl * 3}倍になる`, icon: Maximize, color: 'text-red-500' },
  missile_swarm: { name: 'ミサイルスウォーム', desc: (lvl: number) => `【ミサイル専用】ミサイルの発射数が${lvl * 2}増える`, icon: Copy, color: 'text-gray-400' },
  chakram_split: { name: '双刃チャクラム', desc: (lvl: number) => `【チャクラム専用】チャクラムが${lvl + 1}個に分裂して飛ぶ`, icon: Copy, color: 'text-teal-400' },
  chakram_flame: { name: '炎のチャクラム', desc: (lvl: number) => `【チャクラム専用】チャクラムが通った跡に炎が残る（ダメージLv.${lvl}）`, icon: Heart, color: 'text-orange-500' },
  icicle_freeze: { name: '氷結', desc: (lvl: number) => `【アイシクル専用】当たった敵を${lvl}秒間凍結させる`, icon: Wind, color: 'text-blue-200' },
  icicle_shatter: { name: '破片', desc: (lvl: number) => `【アイシクル専用】敵に当たると${lvl * 2}個の破片に分裂する`, icon: Copy, color: 'text-cyan-300' },
  blackhole_supermassive: { name: '超大質量ブラックホール', desc: (lvl: number) => `【ブラックホール専用】吸引範囲とダメージが${lvl * 2}倍になる`, icon: Maximize, color: 'text-purple-500' },
  blackhole_quasar: { name: 'クエーサー', desc: (lvl: number) => `【ブラックホール専用】ブラックホールからレーザーが全方位に発射される（数Lv.${lvl}）`, icon: Zap, color: 'text-yellow-300' },
  chainsaw_extend: { name: '延長刃', desc: (lvl: number) => `【チェーンソー専用】チェーンソーのリーチが${lvl * 20}%伸びる`, icon: ArrowUp, color: 'text-gray-400' },
  chainsaw_bloodbath: { name: '血の宴', desc: (lvl: number) => `【チェーンソー専用】敵を倒すたびに一時的に攻撃速度が上がる（効果Lv.${lvl}）`, icon: Zap, color: 'text-red-500' },
  yoyo_orbit: { name: '大車輪', desc: (lvl: number) => `【ヨーヨー専用】ヨーヨーの飛距離が${lvl * 30}%伸びる`, icon: Maximize, color: 'text-pink-400' },
  yoyo_saw: { name: 'ノコギリ刃', desc: (lvl: number) => `【ヨーヨー専用】ヨーヨーが敵を貫通するようになる（貫通数Lv.${lvl}）`, icon: ArrowUp, color: 'text-red-400' },
  mace_stun: { name: '脳震盪', desc: (lvl: number) => `【メイス専用】ヒットした敵を${lvl}秒間スタンさせる`, icon: Zap, color: 'text-yellow-400' },
  mace_quake: { name: '地裂斬', desc: (lvl: number) => `【メイス専用】メイスのサイズが${lvl * 30}%大きくなる`, icon: Maximize, color: 'text-orange-500' },
  plasma_overcharge: { name: 'オーバーチャージ', desc: (lvl: number) => `【プラズマ専用】ビームが太くなり、ダメージが${lvl * 50}%増加する`, icon: Maximize, color: 'text-cyan-400' },
  plasma_split: { name: 'スプリットビーム', desc: (lvl: number) => `【プラズマ専用】ビームが敵を貫通するたびに${lvl}本に枝分かれする`, icon: Copy, color: 'text-blue-300' },
  turret_twin: { name: 'ツインタレット', desc: (lvl: number) => `【タレット専用】タレットが2連装になり、発射数が${lvl}増える`, icon: Copy, color: 'text-gray-400' },
  turret_rocket: { name: 'ロケットポッド', desc: (lvl: number) => `【タレット専用】タレットが爆発するロケットを撃つようになる（爆発範囲Lv.${lvl}）`, icon: Target, color: 'text-red-500' },
  barrier_reflect: { name: '反射装甲', desc: (lvl: number) => `【バリア専用】バリアに触れた敵に、プレイヤーの受けるはずだったダメージの${lvl * 2}倍を跳ね返す`, icon: Shield, color: 'text-blue-300' },
  barrier_shock: { name: 'ショックウェーブ', desc: (lvl: number) => `【バリア専用】バリアが敵を弾き飛ばす際、周囲の敵にもダメージを与える（威力Lv.${lvl}）`, icon: Zap, color: 'text-yellow-300' },
  
  grenade_cluster: { name: 'クラスター化', desc: (lvl: number) => `【手榴弾専用】爆発時に${lvl * 3}個の小爆弾をばらまく`, icon: Maximize, color: 'text-orange-400' },
  grenade_napalm: { name: 'ナパーム', desc: (lvl: number) => `【手榴弾専用】爆発跡に${lvl * 2}秒間炎が残る`, icon: Flame, color: 'text-red-500' },
  mortar_nuke: { name: '戦術核', desc: (lvl: number) => `【迫撃砲専用】爆発範囲が${lvl * 2}倍になり、ダメージが${lvl * 3}倍になる`, icon: Maximize, color: 'text-red-600' },
  mortar_rapid: { name: '連射機構', desc: (lvl: number) => `【迫撃砲専用】連射速度が${lvl * 2}倍になる`, icon: Zap, color: 'text-yellow-400' },
  c4_chain: { name: '誘爆', desc: (lvl: number) => `【C4爆弾専用】爆発が他のC4を誘爆させ、連鎖するごとにダメージが${lvl * 50}%上昇`, icon: Copy, color: 'text-orange-500' },
  c4_emp: { name: 'EMP爆発', desc: (lvl: number) => `【C4爆弾専用】爆発に巻き込まれた敵を${lvl * 2}秒間スタンさせる`, icon: Zap, color: 'text-blue-400' },
  cluster_bounce: { name: 'バウンドボム', desc: (lvl: number) => `【クラスター爆弾専用】子爆弾が${lvl * 2}回バウンドするようになる`, icon: ArrowUp, color: 'text-green-400' },
  cluster_shrapnel: { name: 'シュラプネル', desc: (lvl: number) => `【クラスター爆弾専用】子爆弾の数が${lvl * 5}個増える`, icon: Copy, color: 'text-gray-400' },

  slime_split: { name: '分裂', desc: (lvl: number) => `【スライム専用】スライムが${lvl * 2}匹に分裂する`, icon: Copy, color: 'text-green-400' },
  slime_acid: { name: '強酸', desc: (lvl: number) => `【スライム専用】触れた敵の防御力を${lvl * 10}%下げる`, icon: Droplet, color: 'text-green-600' },
  skeleton_shield: { name: '骨の盾', desc: (lvl: number) => `【スケルトン専用】スケルトンがプレイヤーのダメージを${lvl * 10}%肩代わりする`, icon: Shield, color: 'text-gray-300' },
  skeleton_archer: { name: 'スケルトンアーチャー', desc: (lvl: number) => `【スケルトン専用】遠距離攻撃を行うスケルトンが${lvl}体追加される`, icon: Crosshair, color: 'text-gray-400' },
  bat_vampire: { name: '吸血', desc: (lvl: number) => `【コウモリ専用】コウモリが与えたダメージの${lvl * 5}%を回復する`, icon: Heart, color: 'text-red-500' },
  bat_swarm: { name: '大群', desc: (lvl: number) => `【コウモリ専用】コウモリの数が${lvl * 3}匹増える`, icon: Copy, color: 'text-purple-400' },
  ghost_fear: { name: '恐怖', desc: (lvl: number) => `【ゴースト専用】触れた敵が${lvl}秒間逃げ出す`, icon: Wind, color: 'text-blue-300' },
  ghost_drain: { name: 'エナジードレイン', desc: (lvl: number) => `【ゴースト専用】触れた敵の移動速度を${lvl * 10}%奪う`, icon: ArrowUp, color: 'text-purple-500' },

  cross_orbit: { name: '八方十字', desc: (lvl: number) => `【十字架専用】斜め方向（X字）にも十字架が追加発射される（計8方向）`, icon: RotateCcw, color: 'text-yellow-400' },
  cross_beam: { name: '裁きの光', desc: (lvl: number) => `【十字架専用】十字架から${lvl}本の光のビームが発射される`, icon: Zap, color: 'text-yellow-200' },
  smite_chain: { name: '連鎖する天罰', desc: (lvl: number) => `【天罰専用】天罰が${lvl}回連鎖して近くの敵に落ちる`, icon: Copy, color: 'text-yellow-500' },
  smite_stun: { name: '神の威光', desc: (lvl: number) => `【天罰専用】天罰を受けた敵が${lvl * 2}秒間スタンする`, icon: Zap, color: 'text-yellow-300' },
  water_heal: { name: '癒やしの水', desc: (lvl: number) => `【聖水専用】聖水エリアにいるとHPが毎秒${lvl * 5}回復する`, icon: Heart, color: 'text-blue-400' },
  water_freeze: { name: '氷結水', desc: (lvl: number) => `【聖水専用】聖水エリアの敵が${lvl * 20}%の確率で凍結する`, icon: Wind, color: 'text-cyan-300' },
  bible_expand: { name: '教典拡大', desc: (lvl: number) => `【聖書専用】聖書の広がる速度が${lvl * 50}%上昇する`, icon: Maximize, color: 'text-purple-400' },
  bible_blood: { name: '血の契約', desc: (lvl: number) => `【聖書専用】聖書が敵を倒すたびにダメージが${lvl}%上昇する`, icon: ArrowUp, color: 'text-red-500' },
};

const PIXEL_ART = {
  player: [
    "  bbbb  ",
    " bwewwb ",
    " bwwwwb ",
    "  bbbb  ",
    "  bblb  ",
    " bbbbdb ",
    " bbbbbb ",
    "  b  b  "
  ],
  bat: [
    "b      b",
    "bb    bb",
    "bbbbbbbb",
    " bbrrbb ",
    "  bbbb  ",
    "   bb   "
  ],
  slime: [
    "        ",
    "        ",
    "  gggg  ",
    " gggggg ",
    "gggwgwgg",
    "gggggggg",
    " gggggg "
  ],
  skeleton: [
    "  wwww  ",
    " wkwwkw ",
    "  wwww  ",
    "   ww   ",
    " wwww w ",
    " w ww w ",
    " w ww w ",
    "   ww   ",
    "  w  w  "
  ],
  ghost: [
    "  wwww  ",
    " wkwwkw ",
    " wwwwww ",
    " wwwwww ",
    " wwwwww ",
    " w w w  "
  ],
  boss: [
    "   bbbb   ",
    "  bbrrbb  ",
    " bbrrrrbb ",
    " bbrrrrbb ",
    " bbbbbbbb ",
    "  bbbbbb  ",
    "  bb  bb  "
  ],
  gem: [
    "  ww  ",
    " wccw ",
    "wccccw",
    " wccw ",
    "  ww  "
  ],
  sword: [
    "    w",
    "   ww",
    "  ww ",
    " ww  ",
    "yw   "
  ],
  fireball: [
    "  rr  ",
    " ryor ",
    "ryyyor",
    " ryor ",
    "  rr  "
  ],
  knife: [
    "   w",
    "  ww",
    " dw ",
    "bd  "
  ],
  axe: [
    "  dd ",
    " dwwd",
    " dwbd",
    "  bb ",
    "  b  ",
    "  b  "
  ],
  cross: [
    "  y  ",
    " yyy ",
    "  y  ",
    "  y  ",
    "  y  "
  ]
};

const PALETTE: Record<string, string> = {
  'b': '#1e293b',
  'w': '#f8fafc',
  'e': '#38bdf8',
  'l': '#fca5a5',
  'd': '#94a3b8',
  'r': '#ef4444',
  'g': '#22c55e',
  'k': '#0f172a',
  'c': '#22d3ee',
  'y': '#facc15',
  'o': '#f97316',
  'p': '#a855f7',
};

const generateSprite = (art: string[], scale: number = 4, colorOverride?: string) => {
  const canvas = document.createElement('canvas');
  const h = art.length;
  const w = Math.max(...art.map(row => row.length));
  canvas.width = w * scale;
  canvas.height = h * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  for (let r = 0; r < h; r++) {
    for (let c = 0; c < art[r].length; c++) {
      const char = art[r][c];
      if (char && char !== ' ') {
        ctx.fillStyle = colorOverride && char !== 'k' && char !== 'w' && char !== 'e' ? colorOverride : (PALETTE[char] || '#fff');
        ctx.fillRect(c * scale, r * scale, scale, scale);
      }
    }
  }
  return canvas;
};

const WEAPON_CATEGORIES = {
  firearm: { name: '銃器', desc: '遠距離から敵を撃ち抜く近代兵器', weapons: ['pistol', 'shotgun', 'sniper', 'machinegun', 'laser', 'rocket', 'flamethrower', 'plasma_rifle'], icon: Crosshair },
  melee: { name: '近接', desc: '近づく敵を薙ぎ払う強力な武器', weapons: ['sword', 'spear', 'scythe', 'whip', 'chainsaw', 'axe', 'knife', 'yoyo', 'mace'], icon: Sword },
  magic: { name: '魔法・特殊', desc: '特殊な軌道や効果を持つ異端の武器', weapons: ['magicwand', 'shuriken', 'fireball', 'boomerang', 'lightning', 'aura', 'bow', 'poison'], icon: Wand2 },
  explosive: { name: '爆発物', desc: '広範囲を吹き飛ばす強力な兵器', weapons: ['grenade', 'mortar', 'c4', 'cluster_bomb'], icon: Flame },
  summon: { name: '召喚', desc: '自律して戦う使い魔を呼び出す', weapons: ['slime', 'skeleton', 'bat', 'ghost'], icon: Ghost },
  holy: { name: '神聖', desc: '神聖な力で敵を浄化する', weapons: ['holy_cross', 'smite', 'holy_water', 'bible'], icon: Star },
  forbidden: { name: '禁忌', desc: '神すら恐れる禁忌の兵装', weapons: ['demonic_sword', 'abyss_orb'], icon: Skull },
  sub: { name: '支援兵装', desc: 'レベルアップでのみ取得可能なサブ武器', weapons: ['drone', 'mine', 'satellite', 'missile', 'chakram', 'icicle', 'blackhole', 'turret', 'barrier'], icon: Shield }
};

const STAGES = [
  { id: 'normal', name: '通常ステージ', desc: '標準的な難易度' },
  { id: 'abyss', name: '深淵ステージ', desc: '高難易度・15分経過状態' },
  { id: 'slime', name: 'スライムの巣', desc: '大量の弱い敵が出現' },
  { id: 'giant', name: '巨人の谷', desc: '少数の強力な敵が出現' }
];

const DIFFICULTIES = [
  { id: 'easy', name: 'Easy', desc: '敵が弱く、出現数も少ない' },
  { id: 'normal', name: 'Normal', desc: '標準的な難易度' },
  { id: 'hard', name: 'Hard', desc: '敵が強く、出現数が多い' }
];

const getUpgradeInfo = (id: string, currentLevel: number, weapon: string) => {
  if (id in SPECIAL_EVOLUTIONS) {
    const info = SPECIAL_EVOLUTIONS[id as keyof typeof SPECIAL_EVOLUTIONS];
    return { ...info, desc: typeof info.desc === 'function' ? info.desc(currentLevel + 1) : info.desc };
  }
  if (id in UNIQUE_UPGRADES) {
    const info = UNIQUE_UPGRADES[id as keyof typeof UNIQUE_UPGRADES];
    return { ...info, desc: typeof info.desc === 'function' ? info.desc(currentLevel + 1) : info.desc };
  }
  if (id in WEAPONS) {
    const w = WEAPONS[id as keyof typeof WEAPONS];
    const cat = Object.values(WEAPON_CATEGORIES).find(c => c.weapons.includes(id));
    const isSub = (w as any).isSubOnly;
    return { name: `${isSub ? 'サブ武器' : 'メイン武器'}: ${w.name}`, desc: w.desc, icon: cat?.icon || Sword, color: isSub ? 'text-cyan-300' : 'text-blue-300' };
  }
  const nextLevel = currentLevel + 1;
  const isSyn = WEAPONS[weapon as keyof typeof WEAPONS].synergies.includes(id);
  switch(id) {
    case 'dmg': return { name: '破壊のルーン', desc: `ダメージ +${(isSyn ? 3 : 1) * nextLevel}%`, icon: Sword, color: 'text-red-400' };
    case 'rate': return { name: '連射の指輪', desc: `連射速度 +${(isSyn ? 1 : 0.5) * nextLevel}%`, icon: FastForward, color: 'text-yellow-400' };
    case 'speed': return { name: '韋駄天の靴', desc: `移動速度 +${((isSyn ? 0.03 : 0.01) * nextLevel).toFixed(2)}`, icon: Wind, color: 'text-blue-400' };
    case 'hp': return { name: '巨人の心臓', desc: `最大HP＆回復 +${(isSyn ? 3 : 1) * nextLevel}`, icon: Heart, color: 'text-green-400' };
    case 'pierce': return { name: '貫く者の矢尻', desc: `貫通数 +${isSyn ? Math.ceil(nextLevel / 3) : Math.ceil(nextLevel / 5)}`, icon: ArrowUp, color: 'text-purple-400' };
    case 'multi': return { name: '多重の鏡', desc: `発射数 +${isSyn ? Math.ceil(nextLevel / 2) : Math.ceil(nextLevel / 3)}`, icon: Copy, color: 'text-orange-400' };
    case 'magnet': return { name: '強欲の磁石', desc: `回収範囲 +${(isSyn ? 30 : 15) * nextLevel}`, icon: Magnet, color: 'text-indigo-400' };
    case 'knockback': return { name: '衝撃のガントレット', desc: `ノックバック +${(isSyn ? 3 : 1) * nextLevel}`, icon: Hammer, color: 'text-stone-400' };
    case 'crit': return { name: '死神の瞳', desc: `クリティカル率 +${(isSyn ? 3 : 1) * nextLevel}%`, icon: Target, color: 'text-amber-400' };
    case 'bounce': return { name: '反射の盾', desc: `跳弾回数 +${isSyn ? Math.ceil(nextLevel / 2) : Math.ceil(nextLevel / 3)}`, icon: CornerUpRight, color: 'text-teal-400' };
    case 'growth': return { name: '賢者の石', desc: `取得経験値 +${(isSyn ? 5 : 2) * nextLevel}%`, icon: TrendingUp, color: 'text-lime-400' };
    case 'regen': return { name: '生命の雫', desc: `毎秒HP回復 +${(isSyn ? 2 : 1) * nextLevel}`, icon: Heart, color: 'text-pink-400' };
    case 'armor': return { name: '鋼の装甲', desc: `被ダメージ軽減 +${(isSyn ? 2 : 1) * nextLevel}`, icon: Shield, color: 'text-slate-400' };
    case 'cooldown': return { name: '時の砂時計', desc: `クールダウン短縮 +${(isSyn ? 5 : 3) * nextLevel}%`, icon: RotateCcw, color: 'text-cyan-400' };
    case 'luck': return { name: '幸運のクローバー', desc: `幸運 +${(isSyn ? 10 : 5) * nextLevel}%`, icon: Target, color: 'text-emerald-400' };
    default: return { name: '未知の遺物', desc: '', icon: Sword, color: 'text-white' };
  }
};

type GameState = {
  weapon: string;
  weapons: string[];
  status: 'menu' | 'playing' | 'levelup' | 'gameover' | 'paused';
  player: { x: number; y: number; hp: number; maxHp: number; speed: number; radius: number; xp: number; level: number; nextXp: number; invuln: number; magnet: number; angle: number };
  stats: { damage: number; fireRate: number; pierce: number; multiShot: number; projSpeed: number; projSize: number; lastShot: number; knockback: number; crit: number; bounce: number; xpBonus: number; scytheBonusDamage: number };
  enemies: { x: number; y: number; hp: number; maxHp: number; speed: number; radius: number; damage: number; isBoss?: boolean; type: string; color: string; buffs?: string[]; stunned?: number; bleed?: number; chargeTimer?: number; chargeAngle?: number; }[];
  projectiles: { x: number; y: number; vx: number; vy: number; damage: number; life: number; pierce: number; hit: Set<any>; radius: number; bounce: number; type?: string; angle?: number; distance?: number; target?: any; knockback?: number; delay?: number; source?: string }[];
  gems: { x: number; y: number; value: number; radius: number; color?: string }[];
  damageTexts: { x: number; y: number; text: string; life: number; color: string }[];
  keys: { [key: string]: boolean };
  joystick: { active: boolean; originX: number; originY: number; currentX: number; currentY: number };
  upgradeLevels: Record<string, number>;
  frameCount: number;
  score: number;
  time: number;
  hardcoreMode?: boolean;
  clones?: number;
  timeAccumulator?: number;
  bannedUpgrades: string[];
  stageId?: string;
  difficulty?: string;
};

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spriteCache = useRef<Record<string, HTMLCanvasElement>>({});

  useEffect(() => {
    const cache: Record<string, HTMLCanvasElement> = {};
    cache.player = generateSprite(PIXEL_ART.player, 4);
    cache.bat = generateSprite(PIXEL_ART.bat, 4);
    cache.slime = generateSprite(PIXEL_ART.slime, 4);
    cache.skeleton = generateSprite(PIXEL_ART.skeleton, 4);
    cache.ghost = generateSprite(PIXEL_ART.ghost, 4);
    cache.boss = generateSprite(PIXEL_ART.boss, 8);
    cache.gem_blue = generateSprite(PIXEL_ART.gem, 3, '#38bdf8');
    cache.gem_green = generateSprite(PIXEL_ART.gem, 3, '#22c55e');
    cache.gem_yellow = generateSprite(PIXEL_ART.gem, 3, '#facc15');
    cache.gem_red = generateSprite(PIXEL_ART.gem, 3, '#ef4444');
    cache.sword = generateSprite(PIXEL_ART.sword, 4);
    cache.fireball = generateSprite(PIXEL_ART.fireball, 4);
    cache.knife = generateSprite(PIXEL_ART.knife, 4);
    cache.axe = generateSprite(PIXEL_ART.axe, 4);
    cache.cross = generateSprite(PIXEL_ART.cross, 4);
    spriteCache.current = cache;
  }, []);

  const [uiState, setUiState] = useState({ status: 'menu', level: 1, score: 0, time: 0, choices: [] as UpgradeChoice[], selectedWeapon: 'pistol', selectedCategory: null as string | null, showDamageNumbers: true, superhotMode: false, cheatsUnlocked: false, pixelMode: false, forbiddenUnlocked: false, lightweightMode: false, selectedStage: 'normal', difficulty: 'normal' });
  const uiStateRef = useRef(uiState);
  useEffect(() => { uiStateRef.current = uiState; }, [uiState]);
  const commandHistory = useRef<string[]>([]);
  
  const state = useRef<GameState>({
    weapon: 'pistol',
    weapons: ['pistol'],
    status: 'menu',
    player: { x: 0, y: 0, hp: 100, maxHp: 100, speed: 3, radius: 15, xp: 0, level: 1, nextXp: 5, invuln: 0, magnet: 50, angle: -Math.PI / 2 },
    stats: { damage: 10, fireRate: 30, pierce: 1, multiShot: 1, projSpeed: 8, projSize: 4, lastShot: 0, knockback: 0, crit: 0, bounce: 0, xpBonus: 0, regen: 0, armor: 0, cooldown: 1, luck: 1 },
    enemies: [], projectiles: [], gems: [], damageTexts: [], keys: {}, joystick: { active: false, originX: 0, originY: 0, currentX: 0, currentY: 0 }, upgradeLevels: {},
    frameCount: 0, score: 0, time: 0, hardcoreMode: false, bannedUpgrades: [], stageId: 'normal', difficulty: 'normal'
  });

  const getInitialStats = (weapon: string) => {
    const base = { damage: 10, fireRate: 30, pierce: 1, multiShot: 1, projSpeed: 8, projSize: 4, lastShot: 0, knockback: 0, crit: 0, bounce: 0, xpBonus: 0, scytheBonusDamage: 0, regen: 0, armor: 0, cooldown: 1, luck: 1 };
    if (weapon === 'shotgun') return { ...base, damage: 12, multiShot: 5, fireRate: 35, projSpeed: 6, pierce: 2 };
    if (weapon === 'sniper') return { ...base, damage: 80, fireRate: 80, projSpeed: 20, pierce: 5 };
    if (weapon === 'machinegun') return { ...base, damage: 7, fireRate: 6, projSpeed: 12 };
    if (weapon === 'laser') return { ...base, damage: 15, fireRate: 30, projSpeed: 8, projSize: 3, pierce: 999 };
    if (weapon === 'sword') return { ...base, damage: 35, fireRate: 40, projSpeed: 8, projSize: 45, pierce: 999, knockback: 8 };
    if (weapon === 'spear') return { ...base, damage: 28, fireRate: 35, projSpeed: 8, projSize: 15, pierce: 999, knockback: 4 };
    if (weapon === 'magicwand') return { ...base, damage: 25, fireRate: 25, projSpeed: 9, projSize: 6, bounce: 1 };
    if (weapon === 'shuriken') return { ...base, damage: 12, fireRate: 20, projSpeed: 15, projSize: 8, pierce: 5 };
    if (weapon === 'fireball') return { ...base, damage: 50, fireRate: 55, projSpeed: 5, projSize: 20, pierce: 1 };
    if (weapon === 'boomerang') return { ...base, damage: 22, fireRate: 30, projSpeed: 12, projSize: 12, pierce: 999 };
    if (weapon === 'lightning') return { ...base, damage: 60, fireRate: 45, projSpeed: 8, projSize: 30, pierce: 1 };
    if (weapon === 'aura') return { ...base, damage: 10, fireRate: 8, projSpeed: 8, projSize: 100, pierce: 999 };
    if (weapon === 'scythe') return { ...base, damage: 30, fireRate: 90, projSpeed: 5, projSize: 25, pierce: 999 };
    if (weapon === 'rocket') return { ...base, damage: 60, fireRate: 60, projSpeed: 5, projSize: 15, pierce: 0 };
    if (weapon === 'flamethrower') return { ...base, damage: 6, fireRate: 5, projSpeed: 4, projSize: 12, pierce: 999 };
    if (weapon === 'whip') return { ...base, damage: 18, fireRate: 35, projSpeed: 12, projSize: 20, pierce: 999, knockback: 3 };
    if (weapon === 'bow') return { ...base, damage: 15, fireRate: 20, projSpeed: 16, projSize: 4, pierce: 3 };
    if (weapon === 'poison') return { ...base, damage: 10, fireRate: 60, projSpeed: 3, projSize: 20, pierce: 0 };
    if (weapon === 'drone') return { ...base, damage: 8, fireRate: 15, projSpeed: 12, projSize: 4, pierce: 0 };
    if (weapon === 'mine') return { ...base, damage: 60, fireRate: 60, projSpeed: 0, projSize: 15, pierce: 0 };
    if (weapon === 'satellite') return { ...base, damage: 10, fireRate: 150, projSpeed: 16, projSize: 6, pierce: 999 };
    if (weapon === 'missile') return { ...base, damage: 30, fireRate: 60, projSpeed: 6, projSize: 8, pierce: 0 };
    if (weapon === 'chakram') return { ...base, damage: 18, fireRate: 100, projSpeed: 10, projSize: 12, pierce: 999 };
    if (weapon === 'icicle') return { ...base, damage: 15, fireRate: 60, projSpeed: 10, projSize: 6, pierce: 2 };
    if (weapon === 'blackhole') return { ...base, damage: 8, fireRate: 300, projSpeed: 2, projSize: 40, pierce: 999, knockback: 0 };
    if (weapon === 'chainsaw') return { ...base, damage: 12, fireRate: 5, projSpeed: 8, projSize: 20, pierce: 999 };
    if (weapon === 'yoyo') return { ...base, damage: 18, fireRate: 40, projSpeed: 10, projSize: 12, pierce: 1, bounce: 3 };
    if (weapon === 'mace') return { ...base, damage: 40, fireRate: 80, projSpeed: 3, projSize: 30, pierce: 999, knockback: 15 };
    if (weapon === 'knife') return { ...base, damage: 15, fireRate: 20, projSpeed: 15, projSize: 6, pierce: 1 };
    if (weapon === 'axe') return { ...base, damage: 50, fireRate: 60, projSpeed: 12, projSize: 15, pierce: 3, knockback: 10 };
    if (weapon === 'plasma_rifle') return { ...base, damage: 30, fireRate: 40, projSpeed: 15, projSize: 8, pierce: 999 };
    if (weapon === 'turret') return { ...base, damage: 18, fireRate: 30, projSpeed: 10, projSize: 5, pierce: 1 };
    if (weapon === 'barrier') return { ...base, damage: 0, fireRate: 10, projSpeed: 8, projSize: 60, pierce: 999, knockback: 10 };

    // Explosive
    if (weapon === 'grenade') return { ...base, damage: 30, fireRate: 60, projSpeed: 8, projSize: 15, pierce: 0, knockback: 5 };
    if (weapon === 'mortar') return { ...base, damage: 50, fireRate: 90, projSpeed: 10, projSize: 40, pierce: 0, knockback: 10 };
    if (weapon === 'c4') return { ...base, damage: 100, fireRate: 120, projSpeed: 0, projSize: 50, pierce: 0, knockback: 15 };
    if (weapon === 'cluster_bomb') return { ...base, damage: 40, fireRate: 120, projSpeed: 6, projSize: 20, pierce: 0, knockback: 5 };
    
    // Summon
    if (weapon === 'slime') return { ...base, damage: 10, fireRate: 60, projSpeed: 3, projSize: 12, pierce: 999, knockback: 2 };
    if (weapon === 'skeleton') return { ...base, damage: 15, fireRate: 90, projSpeed: 2, projSize: 15, pierce: 999, knockback: 3 };
    if (weapon === 'bat') return { ...base, damage: 8, fireRate: 45, projSpeed: 6, projSize: 8, pierce: 999, knockback: 1 };
    if (weapon === 'ghost') return { ...base, damage: 5, fireRate: 60, projSpeed: 4, projSize: 15, pierce: 999, knockback: 0 };
    
    // Holy
    if (weapon === 'holy_cross') return { ...base, damage: 30, fireRate: 40, projSpeed: 7, projSize: 15, pierce: 2, knockback: 4 };
    if (weapon === 'smite') return { ...base, damage: 80, fireRate: 60, projSpeed: 0, projSize: 30, pierce: 999, knockback: 0 };
    if (weapon === 'holy_water') return { ...base, damage: 10, fireRate: 60, projSpeed: 5, projSize: 40, pierce: 999, knockback: 0 };
    if (weapon === 'bible') return { ...base, damage: 20, fireRate: 120, projSpeed: 5, projSize: 15, pierce: 999, knockback: 8 };
    
    // Forbidden
    if (weapon === 'demonic_sword') return { ...base, damage: 300, fireRate: 60, projSpeed: 0, projSize: 100, pierce: 999, knockback: 20 };
    if (weapon === 'abyss_orb') return { ...base, damage: 100, fireRate: 120, projSpeed: 3, projSize: 80, pierce: 999, knockback: -10 };
    return base;
  };

  const startGame = () => {
    let baseSpeed = 3;
    if (uiState.selectedWeapon === 'shotgun') baseSpeed = 2;
    
    state.current = {
      weapon: uiState.selectedWeapon,
      weapons: [uiState.selectedWeapon],
      status: 'playing',
      player: { x: 0, y: 0, hp: 100, maxHp: 100, speed: baseSpeed, radius: 15, xp: 0, level: 1, nextXp: 5, invuln: 0, magnet: 50, angle: -Math.PI / 2 },
      stats: getInitialStats(uiState.selectedWeapon),
      enemies: [], projectiles: [], gems: [], damageTexts: [], keys: state.current.keys, joystick: { active: false, originX: 0, originY: 0, currentX: 0, currentY: 0 }, upgradeLevels: {},
      frameCount: 0, score: 0, time: uiState.selectedStage === 'abyss' ? 900 : 0, hardcoreMode: state.current.hardcoreMode, clones: 0, timeAccumulator: 0, bannedUpgrades: [], stageId: uiState.selectedStage, difficulty: uiState.difficulty
    };
    setUiState(s => ({ ...s, status: 'playing', level: 1, score: 0, time: uiState.selectedStage === 'abyss' ? 900 : 0 }));
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
    if (id === 'magnet') s.player.magnet += ((isSyn ? 30 : 15) * level);
    if (id === 'knockback') s.stats.knockback += (isSyn ? 3 : 1) * level;
    if (id === 'crit') s.stats.crit += (isSyn ? 0.03 : 0.01) * level;
    if (id === 'bounce') s.stats.bounce += (isSyn ? Math.ceil(level / 2) : Math.ceil(level / 3));
    if (id === 'growth') s.stats.xpBonus += (isSyn ? 0.05 : 0.02) * level;
    if (id === 'regen') s.stats.regen += (isSyn ? 2 : 1) * level;
    if (id === 'armor') s.stats.armor += (isSyn ? 2 : 1) * level;
    if (id === 'cooldown') s.stats.cooldown *= (1 - ((isSyn ? 0.05 : 0.03) * level));
    if (id === 'luck') s.stats.luck += (isSyn ? 0.1 : 0.05) * level;
    
    s.status = 'playing';
    setUiState(prev => ({ ...prev, status: 'playing' }));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { 
      state.current.keys[e.key.toLowerCase()] = true; 
      commandHistory.current.push(e.key.toLowerCase());
      if (commandHistory.current.length > 20) commandHistory.current.shift();
      const cmd = commandHistory.current.join('');
      
      if (state.current.status === 'menu' && cmd.includes('chibikero') && !uiStateRef.current.cheatsUnlocked) {
        setUiState(prev => ({ ...prev, cheatsUnlocked: true }));
        commandHistory.current = [];
        alert('チートモードが解放されました！');
      }

      if (state.current.status === 'menu' && cmd.includes('forbidden') && !uiStateRef.current.forbiddenUnlocked) {
        setUiState(prev => ({ ...prev, forbiddenUnlocked: true }));
        commandHistory.current = [];
        alert('禁忌の兵装が解放されました！');
      }

      if (uiStateRef.current.cheatsUnlocked) {
        if (cmd.includes('ragnarok')) {
        const s = state.current;
        if (!s.weapons.includes('blackhole')) s.weapons.push('blackhole');
        if (!s.weapons.includes('smite')) s.weapons.push('smite');
        if (!s.weapons.includes('laser')) s.weapons.push('laser');
        s.upgradeLevels['ragnarok'] = (s.upgradeLevels['ragnarok'] || 0) + 1;
        commandHistory.current = [];
        s.damageTexts.push({ x: s.player.x, y: s.player.y - 50, text: 'RAGNAROK UNLEASHED!', life: 60, color: '#ef4444' });
      } else if (cmd.includes('godmode')) {
        const s = state.current;
        Object.keys(WEAPONS).forEach(w => {
          const isForbidden = WEAPON_CATEGORIES.forbidden.weapons.includes(w);
          if (!isForbidden && !s.weapons.includes(w)) s.weapons.push(w);
        });
        commandHistory.current = [];
        s.damageTexts.push({ x: s.player.x, y: s.player.y - 50, text: 'GOD MODE ACTIVATED!', life: 60, color: '#eab308' });
      } else if (cmd.includes('hardcore')) {
        const s = state.current;
        s.hardcoreMode = true;
        s.enemies.forEach(e => {
          e.maxHp *= 5;
          e.hp *= 5;
          e.speed *= 1.5;
        });
        commandHistory.current = [];
        s.damageTexts.push({ x: s.player.x, y: s.player.y - 50, text: 'HARDCORE MODE!', life: 60, color: '#9333ea' });
      } else if (cmd.includes('booststats')) {
        const s = state.current;
        s.stats.damage *= 2;
        s.stats.fireRate *= 0.5;
        s.stats.projSpeed *= 1.5;
        s.stats.projSize *= 1.5;
        s.player.maxHp *= 2;
        s.player.hp = s.player.maxHp;
        s.player.speed *= 1.5;
        commandHistory.current = [];
        s.damageTexts.push({ x: s.player.x, y: s.player.y - 50, text: 'STATS BOOSTED!', life: 60, color: '#10b981' });
      } else if (cmd.includes('summonboss')) {
        const s = state.current;
        const angle = Math.random() * Math.PI * 2;
        s.enemies.push({
          x: s.player.x + Math.cos(angle) * 500,
          y: s.player.y + Math.sin(angle) * 500,
          hp: 5000 * s.player.level, maxHp: 5000 * s.player.level, speed: 2, radius: 40, damage: 30, isBoss: true, type: 'boss', color: '#ff00ff', buffs: ['tank', 'haste']
        });
        commandHistory.current = [];
        s.damageTexts.push({ x: s.player.x, y: s.player.y - 50, text: 'BOSS SUMMONED!', life: 60, color: '#ef4444' });
      } else if (cmd.includes('nerfme')) {
        const s = state.current;
        s.stats.damage *= 0.5;
        s.stats.fireRate *= 2;
        s.player.hp = 1;
        s.player.speed *= 0.5;
        commandHistory.current = [];
        s.damageTexts.push({ x: s.player.x, y: s.player.y - 50, text: 'NERFED...', life: 60, color: '#64748b' });
      } else if (cmd.includes('shadowclone')) {
        const s = state.current;
        s.clones = (s.clones || 0) + 1;
        commandHistory.current = [];
        s.damageTexts.push({ x: s.player.x, y: s.player.y - 50, text: 'CLONE SUMMONED!', life: 60, color: '#8b5cf6' });
      } else if (cmd.includes('nextstage')) {
        const s = state.current;
        s.time += 300;
        commandHistory.current = [];
        s.damageTexts.push({ x: s.player.x, y: s.player.y - 50, text: 'STAGE ADVANCED!', life: 60, color: '#f59e0b' });
      } else if (cmd.includes('superhot')) {
        setUiState(prev => ({ ...prev, superhotMode: !prev.superhotMode }));
        commandHistory.current = [];
        state.current.damageTexts.push({ x: state.current.player.x, y: state.current.player.y - 50, text: uiStateRef.current.superhotMode ? 'SUPERHOT OFF' : 'SUPERHOT ON!', life: 60, color: '#ef4444' });
      } else if (cmd.includes('pixelmode')) {
        setUiState(prev => ({ ...prev, pixelMode: !prev.pixelMode }));
        commandHistory.current = [];
        state.current.damageTexts.push({ x: state.current.player.x, y: state.current.player.y - 50, text: uiStateRef.current.pixelMode ? 'PIXEL MODE OFF' : 'PIXEL MODE ON!', life: 60, color: '#10b981' });
      } else if (cmd.includes('resetgame')) {
        const s = state.current;
        s.time = 0;
        s.score = 0;
        s.player.level = 1;
        s.player.xp = 0;
        s.player.nextXp = 5;
        s.weapons = [s.weapon];
        s.enemies = [];
        s.projectiles = [];
        s.gems = [];
        s.clones = 0;
        s.hardcoreMode = false;
        s.upgradeLevels = {};
        s.stats = getInitialStats(s.weapon);
        s.player.hp = s.player.maxHp;
        commandHistory.current = [];
        s.damageTexts.push({ x: s.player.x, y: s.player.y - 50, text: 'GAME RESET!', life: 60, color: '#ffffff' });
      } else if (cmd.includes('excalibur')) {
        const s = state.current;
        if (!s.weapons.includes('sword')) s.weapons.push('sword');
        if (!s.weapons.includes('holy_cross')) s.weapons.push('holy_cross');
        s.upgradeLevels['excalibur'] = (s.upgradeLevels['excalibur'] || 0) + 1;
        commandHistory.current = [];
        s.damageTexts.push({ x: s.player.x, y: s.player.y - 50, text: 'EXCALIBUR DRAWN!', life: 60, color: '#3b82f6' });
      } else if (cmd.includes('gungnir')) {
        const s = state.current;
        if (!s.weapons.includes('spear')) s.weapons.push('spear');
        if (!s.weapons.includes('lightning')) s.weapons.push('lightning');
        s.upgradeLevels['gungnir'] = (s.upgradeLevels['gungnir'] || 0) + 1;
        commandHistory.current = [];
        s.damageTexts.push({ x: s.player.x, y: s.player.y - 50, text: 'GUNGNIR ACQUIRED!', life: 60, color: '#f59e0b' });
      }
      
      Object.keys(WEAPONS).forEach(w => {
        if (cmd.includes(`give${w.replace(/_/g, '')}`)) {
          const s = state.current;
          if (!s.weapons.includes(w)) {
            s.weapons.push(w);
            s.damageTexts.push({ x: s.player.x, y: s.player.y - 50, text: `ACQUIRED ${WEAPONS[w as keyof typeof WEAPONS].name}!`, life: 60, color: '#3b82f6' });
          }
          commandHistory.current = [];
        }
      });
      } // End of cheatsUnlocked block

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
      if (uiStateRef.current.pixelMode) {
        canvas.width = window.innerWidth / 4;
        canvas.height = window.innerHeight / 4;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', resize);
    resize();

    const updatePhysics = () => {
      const s = state.current;
      const { player, stats, enemies, projectiles, gems, keys } = s;
      
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

      const isMoving = dx !== 0 || dy !== 0;

      if (uiStateRef.current.superhotMode) {
        if (!isMoving) {
          s.timeAccumulator = (s.timeAccumulator || 0) + 0.05;
          if (s.timeAccumulator < 1) return;
          s.timeAccumulator -= 1;
        } else {
          s.timeAccumulator = 0;
        }
      }

      s.frameCount++;
      if (s.frameCount % 60 === 0) s.time++;

      // Player Movement
      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy);
        dx /= len; dy /= len;
        player.angle = Math.atan2(dy, dx);
      }
      let currentSpeed = player.speed;
      if (s.upgradeLevels['machinegun_minigun']) {
        currentSpeed *= Math.pow(0.8, s.upgradeLevels['machinegun_minigun']);
      }
      player.x += dx * currentSpeed;
      player.y += dy * currentSpeed;

      if (player.invuln > 0) player.invuln--;

      if (s.upgradeLevels['aura_heal'] && s.frameCount % 60 === 0) {
        if (s.weapons.includes('aura')) {
          player.hp = Math.min(player.maxHp, player.hp + s.upgradeLevels['aura_heal']);
        }
      }

      // Enemy Spawning
      const stage = Math.floor(s.time / 180) + 1;
      const stageMulti = Math.pow(1.5, stage - 1);
      
      let spawnRate = Math.max(15, 90 - Math.floor(s.time / 3));
      if (s.stageId === 'slime') spawnRate = Math.max(5, spawnRate * 0.5);
      if (s.stageId === 'giant') spawnRate = Math.max(30, spawnRate * 2);
      if (s.difficulty === 'easy') spawnRate = Math.floor(spawnRate * 1.5);
      if (s.difficulty === 'hard') spawnRate = Math.max(5, Math.floor(spawnRate * 0.5));

      if (s.frameCount % spawnRate === 0) {
        let spawnCount = 1 + Math.floor(s.time / 40);
        if (player.level > 200) {
          spawnCount *= 2;
        }
        if (s.stageId === 'slime') spawnCount *= 3;
        if (s.stageId === 'giant') spawnCount = Math.max(1, Math.floor(spawnCount / 3));
        if (s.difficulty === 'easy') spawnCount = Math.max(1, Math.floor(spawnCount * 0.5));
        if (s.difficulty === 'hard') spawnCount = Math.floor(spawnCount * 1.5);

        // Cap enemies to prevent freezing
        spawnCount = Math.min(spawnCount, Math.max(0, 400 - enemies.length));

        for (let i = 0; i < spawnCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.max(canvas.width, canvas.height) / 2 + 100 + Math.random() * 50;
          let baseHp = (10 + Math.floor(s.time / 30) * 10) * stageMulti;
          
          let hp = baseHp, speed = (1.5 + Math.random()) * Math.pow(1.1, stage - 1), radius = 12, color = '#e94560', damage = 10 * stageMulti;
          
          if (player.level > 200) {
            hp *= 10;
            speed *= 1.5;
            damage *= 5;
            color = '#ff0000';
          }

          if (s.difficulty === 'easy') {
            hp *= 0.5;
            damage *= 0.5;
            speed *= 0.8;
          } else if (s.difficulty === 'hard') {
            hp *= 1.5;
            damage *= 1.5;
            speed *= 1.2;
          }
          
          const rand = Math.random();
          let type = 'standard';
          
          if (s.stageId === 'slime') {
            type = 'fast'; hp = hp * 0.3; speed = speed * 1.2; radius = 10; color = '#22c55e'; damage = damage * 0.5;
            if (rand < 0.1) { type = 'tank'; hp = hp * 5; speed = speed * 0.5; radius = 30; color = '#16a34a'; damage = damage * 2; }
          } else if (s.stageId === 'bullet') {
            type = 'shooter'; hp = hp * 0.8; speed = speed * 0.8; radius = 12; color = '#14b8a6'; damage = damage * 1.5;
            if (rand < 0.2) { type = 'standard'; hp = hp * 1.2; speed = speed * 1.1; radius = 14; color = '#0ea5e9'; }
          } else if (s.stageId === 'giant') {
            type = 'tank'; hp = hp * 4; speed = speed * 0.6; radius = 25; color = '#8800ff'; damage = damage * 3;
            if (rand < 0.2) { type = 'charger'; hp = hp * 3; speed = speed * 0.8; radius = 20; color = '#d946ef'; damage = damage * 4; }
          } else if (s.stageId === 'abyss' || stage >= 6) {
            // Extra Stage Content
            if (rand < 0.3) {
              type = 'fast'; hp = hp * 2; speed = speed * 2; radius = 10; color = '#f43f5e'; damage = damage * 1.5;
            } else if (rand < 0.5) {
              type = 'tank'; hp = hp * 5; speed = speed * 0.8; radius = 25; color = '#8b5cf6'; damage = damage * 3;
            } else if (rand < 0.7) {
              type = 'shooter'; hp = hp * 1.5; speed = speed * 1.2; radius = 14; color = '#06b6d4'; damage = damage * 2;
            } else if (rand < 0.85) {
              type = 'jumper'; hp = hp * 2; speed = speed * 0.5; radius = 16; color = '#f59e0b'; damage = damage * 2.5;
            } else {
              type = 'necromancer'; hp = hp * 4; speed = speed * 0.4; radius = 18; color = '#d946ef'; damage = damage * 2;
            }
          } else {
            // Normal Stages
            if (rand < 0.25) {
              type = 'fast'; hp = hp * 0.5; speed = speed * 1.5; radius = 8; color = player.level > 200 ? '#ff5500' : '#ffb400'; damage = damage * 0.5;
            } else if (rand < 0.45) {
              type = 'tank'; hp = hp * 3; speed = speed * 0.5; radius = 20; color = player.level > 200 ? '#8800ff' : '#4a00e0'; damage = damage * 2;
            } else if (rand < 0.55 && s.time > 60) {
              type = 'shooter'; hp = hp * 0.8; speed = speed * 0.8; radius = 12; color = '#14b8a6'; damage = damage * 1.5;
            } else if (rand < 0.65 && s.time > 120) {
              type = 'charger'; hp = hp * 1.5; speed = speed * 0.6; radius = 15; color = '#f43f5e'; damage = damage * 2;
            } else if (rand < 0.7 && s.time > 180) {
              type = 'summoner'; hp = hp * 2; speed = speed * 0.4; radius = 18; color = '#d946ef'; damage = damage * 0.5;
            } else if (rand < 0.8 && s.time > 240) {
              type = 'jumper'; hp = hp * 1.2; speed = speed * 0.3; radius = 14; color = '#eab308'; damage = damage * 1.5;
            } else if (rand < 0.85 && s.time > 300) {
              type = 'necromancer'; hp = hp * 3; speed = speed * 0.3; radius = 16; color = '#4c1d95'; damage = damage * 1.2;
            }
          }

          if (s.hardcoreMode) {
            hp *= 5;
            speed *= 1.5;
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
        let bossHp = (1000 + s.time * 50) * stageMulti;
        let bossSpeed = 1.2 * Math.pow(1.1, stage - 1);
        let bossRadius = 45;
        let bossDamage = 30 * stageMulti;
        
        const possibleBuffs = ['haste', 'tank', 'sniper', 'summoner', 'vampire', 'multishot'];
        const numBuffs = Math.min(4, Math.floor(s.time / 120) + 1);
        const buffs: string[] = [];
        for (let i = 0; i < numBuffs; i++) {
          const b = possibleBuffs[Math.floor(Math.random() * possibleBuffs.length)];
          if (!buffs.includes(b)) buffs.push(b);
        }
        
        if (buffs.includes('haste')) bossSpeed *= 1.5;
        if (buffs.includes('tank')) { bossHp *= 2; bossRadius *= 1.2; }
        
        if (s.hardcoreMode) {
          bossHp *= 5;
          bossSpeed *= 1.5;
        }

        if (s.difficulty === 'easy') {
          bossHp *= 0.5;
          bossDamage *= 0.5;
          bossSpeed *= 0.8;
        } else if (s.difficulty === 'hard') {
          bossHp *= 2;
          bossDamage *= 1.5;
          bossSpeed *= 1.2;
        }

        enemies.push({
          x: player.x + Math.cos(angle) * dist,
          y: player.y + Math.sin(angle) * dist,
          hp: bossHp, maxHp: bossHp, speed: bossSpeed, radius: bossRadius, damage: bossDamage, isBoss: true, type: 'boss', color: '#ff00ff', buffs
        });
      }

      // Shooting
      let closest = null, minDist = Infinity;
      for (const e of enemies) {
        const dist = Math.hypot(e.x - player.x, e.y - player.y);
        if (dist < minDist) { minDist = dist; closest = e; }
      }
      
      if (closest) {
        const angle = Math.atan2(closest.y - player.y, closest.x - player.x);
        
        const realX = player.x;
        const realY = player.y;
        const numShooters = 1 + (s.clones || 0);

        for (let c = 0; c < numShooters; c++) {
          if (c > 0) {
            const radius = 40 + Math.sqrt(c) * 30;
            const angleOffset = c * 2.39996 + s.frameCount * 0.05;
            player.x = realX + Math.cos(angleOffset) * radius;
            player.y = realY + Math.sin(angleOffset) * radius;
          }

          for (const w of s.weapons) {
          let wMultiShot = stats.multiShot;
          let wDamage = stats.damage;
          let wSpeed = stats.projSpeed;
          let wPierce = stats.pierce;
          let wSize = getInitialStats(w).projSize * (stats.projSize / getInitialStats(s.weapon).projSize);
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
          if (w === 'chainsaw') wFireRateMulti = 4.0;
          if (w === 'yoyo') wFireRateMulti = 0.8;
          if (w === 'mace') wFireRateMulti = 1.5;
          if (w === 'knife') wFireRateMulti = 0.5;
          if (w === 'axe') wFireRateMulti = 1.5;
          if (w === 'plasma_rifle') wFireRateMulti = 0.8;
          if (w === 'turret') wFireRateMulti = 0.2;
          if (w === 'barrier') wFireRateMulti = 0.1;
          
          if (w === 'grenade') wFireRateMulti = 0.5;
          if (w === 'mortar') wFireRateMulti = 0.3;
          if (w === 'c4') wFireRateMulti = 0.2;
          if (w === 'cluster_bomb') wFireRateMulti = 0.2;
          if (w === 'slime') wFireRateMulti = 0.5;
          if (w === 'skeleton') wFireRateMulti = 0.3;
          if (w === 'bat') wFireRateMulti = 0.8;
          if (w === 'ghost') wFireRateMulti = 0.4;
          if (w === 'holy_cross') wFireRateMulti = 1.2;
          if (w === 'smite') wFireRateMulti = 0.4;
          if (w === 'holy_water') wFireRateMulti = 0.5;
          if (w === 'bible') wFireRateMulti = 0.5;
          if (w === 'demonic_sword') wFireRateMulti = 2.0;
          if (w === 'abyss_orb') wFireRateMulti = 4.0;

          const wFireRate = Math.max(5, Math.floor((stats.fireRate * stats.cooldown) / wFireRateMulti));
          
          // Use a hash of the weapon name to offset the firing frame, so they don't all fire at once
          const wOffset = w.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % wFireRate;

          if ((s.frameCount + wOffset) % wFireRate === 0) {
            if (w === 'pistol') {
              if (s.upgradeLevels['pistol_roulette']) {
                if (Math.random() < (10 + 5 * s.upgradeLevels['pistol_roulette']) / 100) {
                  wDamage *= (5 + 5 * s.upgradeLevels['pistol_roulette']);
                  wSize *= 4;
                  wPierce = 999;
                }
              }
              if (s.upgradeLevels['pistol_burst']) {
                wMultiShot += s.upgradeLevels['pistol_burst'] * 2;
                wFireRateMulti *= 1.5;
              }
            }
            if (w === 'shotgun') { 
              wSpeed *= 0.8; wPierce += 1; wSpread = 0.4;
              if (s.upgradeLevels['shotgun_blast']) {
                wDamage *= (5 + 5 * s.upgradeLevels['shotgun_blast']); 
                wKnockback *= (5 + 5 * s.upgradeLevels['shotgun_blast']);
                wSpeed *= 0.5;
              }
              if (s.upgradeLevels['shotgun_slug']) {
                wSpread = 0;
                wPierce += 5 * s.upgradeLevels['shotgun_slug'];
                wDamage *= 2 * s.upgradeLevels['shotgun_slug'];
              }
            }
            if (w === 'sniper') { 
              wDamage *= 4; wSpeed *= 2; wPierce += 4; 
              if (s.upgradeLevels['sniper_assassin']) {
                const dist = Math.hypot(player.x - closest.x, player.y - closest.y);
                wDamage *= Math.min(5 + 5 * s.upgradeLevels['sniper_assassin'], 1 + dist / 100);
              }
            }
            if (w === 'machinegun') { 
              wDamage *= 0.2; wSpeed *= 1.2;
              if (s.upgradeLevels['machinegun_minigun']) {
                wMultiShot *= (2 + 3 * s.upgradeLevels['machinegun_minigun']); wSpread = 0.8;
              }
              if (s.upgradeLevels['machinegun_spread']) {
                wSpread = 1.5;
                wMultiShot += s.upgradeLevels['machinegun_spread'] * 3;
              }
              if (s.upgradeLevels['bullet_hell']) {
                wPierce += 999;
                wBounce += s.upgradeLevels['bullet_hell'];
              }
            }
            if (w === 'laser') {
              if (s.upgradeLevels['laser_refract']) wBounce += s.upgradeLevels['laser_refract'];
            }
            if (w === 'spear') {
              // spear_dash is handled in the shooting logic below
            }
            if (w === 'magicwand') { 
              wSpeed *= 0.9; wSize *= 1.2;
              if (s.upgradeLevels['magicwand_chain']) wBounce += s.upgradeLevels['magicwand_chain'] * 2;
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
              // scythe_execution is handled on enemy death
            }
            
            if (w === 'rocket') { wSpeed *= 0.6; wPierce = 0; }
            if (w === 'flamethrower') { 
              wSpeed *= 0.5; wPierce = 999; wSpread = 0.5; wSize *= 2; 
              if (s.upgradeLevels['flamethrower_blue']) wDamage *= s.upgradeLevels['flamethrower_blue'] * 2;
            }
            if (w === 'whip') { wSpeed *= 1.5; wPierce = 999; wSize *= 3; }
            if (w === 'bow') { 
              wSpeed *= 2; wPierce += 2; wSpread = 0.05; 
              if (s.upgradeLevels['bow_multishot']) wMultiShot += s.upgradeLevels['bow_multishot'] * 3;
            }
            if (w === 'poison') { wSpeed *= 0.4; wPierce = 0; }
            
            if (w === 'drone') { 
              wSpeed *= 1.5; wPierce = 0; wSize *= 0.5; 
              if (s.upgradeLevels['drone_swarm']) wMultiShot += s.upgradeLevels['drone_swarm'];
            }
            if (w === 'mine') { wSpeed = 0; wPierce = 0; wSize *= 1.5; }
            if (w === 'satellite') { wSpeed *= 2; wPierce = 999; }
            if (w === 'missile') { 
              wSpeed *= 0.8; wPierce = 0; wSize *= 1.2; 
              if (s.upgradeLevels['missile_swarm']) wMultiShot += s.upgradeLevels['missile_swarm'] * 2;
            }
            if (w === 'chakram') { 
              wSpeed *= 1.2; wPierce = 999; wSize *= 1.5; 
            }
            if (w === 'icicle') { wSpeed *= 1.2; wPierce += 1; wMultiShot += 4; wSpread = Math.PI * 2; }
            if (w === 'blackhole') { wSpeed *= 0.2; wPierce = 999; wSize *= 4; wKnockback = 0; }
            if (w === 'chainsaw') { wSpeed = 0; wPierce = 999; wSize *= 2; }
            if (w === 'yoyo') { 
              if (s.upgradeLevels['yoyo_orbit']) wSpeed *= (1 + 0.3 * s.upgradeLevels['yoyo_orbit']);
              if (s.upgradeLevels['yoyo_saw']) wPierce += s.upgradeLevels['yoyo_saw'];
            }
            if (w === 'mace') {
              if (s.upgradeLevels['mace_quake']) wSize *= (1 + 0.3 * s.upgradeLevels['mace_quake']);
            }
            if (w === 'knife') { wSpeed *= 1.5; wPierce += 1; }
            if (w === 'axe') { wSpeed *= 1.2; wPierce += 2; wSize *= 1.5; wKnockback *= 1.5; }
            if (w === 'plasma_rifle') { wSpeed *= 1.5; wPierce += 3; wSize *= 1.5; }
            if (w === 'turret') { wSpeed = 0; wPierce = 999; wSize *= 1.5; }
            if (w === 'barrier') { wSpeed = 0; wPierce = 999; wSize *= 3; wKnockback *= 2; }

            const startProjLen = projectiles.length;

            if (w === 'sword') {
              if (s.upgradeLevels['sword_blood']) {
                wSize *= (2 + s.upgradeLevels['sword_blood']); wDamage *= (2 + s.upgradeLevels['sword_blood']);
                player.hp -= 1;
              }
              for (let i = 0; i < wMultiShot; i++) {
                const offset = angle + (i - (wMultiShot - 1) / 2) * 0.5;
                projectiles.push({
                  x: player.x, y: player.y,
                  vx: 0, vy: 0,
                  damage: wDamage * 2.5, life: 15, pierce: 999, hit: new Set(), radius: Math.max(40, wSize * 2), bounce: wBounce,
                  type: 'sword', angle: offset, distance: 40
                });
                if (s.upgradeLevels['sword_wave']) {
                  projectiles.push({
                    x: player.x, y: player.y,
                    vx: Math.cos(offset) * wSpeed * 2, vy: Math.sin(offset) * wSpeed * 2,
                    damage: wDamage * 0.5 * s.upgradeLevels['sword_wave'], life: 30, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce,
                    type: 'sword_wave', angle: offset
                  });
                }
              }
              if (s.upgradeLevels['magic_sword']) {
                const numArrows = s.upgradeLevels['magic_sword'] * 4;
                for (let j = 0; j < numArrows; j++) {
                  const arrowAngle = (Math.PI * 2 / numArrows) * j;
                  projectiles.push({
                    x: player.x, y: player.y,
                    vx: Math.cos(arrowAngle) * wSpeed * 1.5, vy: Math.sin(arrowAngle) * wSpeed * 1.5,
                    damage: wDamage, life: 60, pierce: wPierce, hit: new Set(), radius: 5, bounce: wBounce,
                    type: 'magicwand', target: null
                  });
                }
              }
            } else if (w === 'spear') {
              if (s.upgradeLevels['spear_dash']) {
                player.x += Math.cos(angle) * (50 + 50 * s.upgradeLevels['spear_dash']);
                player.y += Math.sin(angle) * (50 + 50 * s.upgradeLevels['spear_dash']);
                player.invuln = 10;
              }
              const flurry = s.upgradeLevels['spear_flurry'] ? s.upgradeLevels['spear_flurry'] * 2 : 0;
              for (let i = 0; i < wMultiShot; i++) {
                const offset = angle + (i - (wMultiShot - 1) / 2) * wSpread;
                projectiles.push({
                  x: player.x, y: player.y,
                  vx: 0, vy: 0,
                  damage: wDamage * 1.5, life: 20, pierce: 999, hit: new Set(), radius: wSize, bounce: wBounce,
                  type: 'spear', angle: offset, distance: 0
                });
                for (let f = 1; f <= flurry; f++) {
                  projectiles.push({
                    x: player.x, y: player.y,
                    vx: 0, vy: 0,
                    damage: wDamage * 1.5, life: 20, pierce: 999, hit: new Set(), radius: wSize, bounce: wBounce,
                    type: 'spear', angle: offset, distance: 0, delay: f * 5
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
              }
              for (let i = 0; i < wMultiShot; i++) {
                const offset = angle + (i - (wMultiShot - 1) / 2) * wSpread;
                projectiles.push({
                  x: player.x, y: player.y,
                  vx: 0, vy: 0,
                  damage: wDamage * 0.8, life: 10, pierce: 999, hit: new Set(), radius: wSize, bounce: 0,
                  type: 'laser', angle: offset, distance: 1000
                });
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
            } else if (w === 'shuriken') {
              if (s.upgradeLevels['shuriken_orbit']) {
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
              } else {
                for (let i = 0; i < wMultiShot; i++) {
                  const offset = angle + (i - (wMultiShot - 1) / 2) * wSpread;
                  projectiles.push({
                    x: player.x, y: player.y,
                    vx: Math.cos(offset) * wSpeed, vy: Math.sin(offset) * wSpeed,
                    damage: wDamage, life: 60, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce,
                    type: 'shuriken'
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
                if (s.upgradeLevels['drone_laser']) {
                  projectiles.push({ x: player.x + Math.cos(a) * 30, y: player.y + Math.sin(a) * 30, vx: 0, vy: 0, damage: wDamage * 1.5 * s.upgradeLevels['drone_laser'], life: 15, pierce: 999, hit: new Set(), radius: wSize * 2, bounce: 0, type: 'drone_laser', angle: angle, distance: 400 });
                } else {
                  projectiles.push({ x: player.x + Math.cos(a) * 30, y: player.y + Math.sin(a) * 30, vx: Math.cos(angle) * wSpeed, vy: Math.sin(angle) * wSpeed, damage: wDamage * 0.8, life: 30, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: 'drone_shot' });
                }
              }
            } else if (w === 'mine') {
              for (let i = 0; i < wMultiShot; i++) {
                projectiles.push({ x: player.x + (Math.random()-0.5)*20, y: player.y + (Math.random()-0.5)*20, vx: 0, vy: 0, damage: wDamage * 3, life: 300, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: 'mine' });
              }
            } else if (w === 'satellite') {
              for (let i = 0; i < wMultiShot; i++) {
                const a = (Math.PI * 2 / wMultiShot) * i;
                const damageMult = s.upgradeLevels['satellite_blade'] ? s.upgradeLevels['satellite_blade'] * 2 : 1;
                const kb = s.upgradeLevels['satellite_shield'] ? s.upgradeLevels['satellite_shield'] * 10 : 0;
                projectiles.push({ x: player.x, y: player.y, vx: 0, vy: 0, damage: wDamage * damageMult, life: 60, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: 'satellite', angle: a, distance: 60, knockback: kb });
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
                const a = angle + (Math.PI * 2 / wMultiShot) * i;
                const dist = 150;
                projectiles.push({ x: player.x + Math.cos(a) * dist, y: player.y + Math.sin(a) * dist, vx: Math.cos(a) * wSpeed, vy: Math.sin(a) * wSpeed, damage: wDamage * 0.5, life: 150, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: 'blackhole' });
              }
            } else if (w === 'chainsaw') {
              let reach = 60;
              if (s.upgradeLevels['chainsaw_extend']) reach *= (1 + 0.2 * s.upgradeLevels['chainsaw_extend']);
              projectiles.push({ x: player.x, y: player.y, vx: 0, vy: 0, damage: wDamage * 0.5, life: 5, pierce: wPierce, hit: new Set(), radius: wSize * 1.5, bounce: wBounce, type: 'chainsaw', angle: angle, distance: reach });
            } else if (w === 'yoyo') {
              for (let i = 0; i < wMultiShot; i++) {
                const offset = angle + (i - (wMultiShot - 1) / 2) * wSpread;
                projectiles.push({ x: player.x, y: player.y, vx: Math.cos(offset) * wSpeed, vy: Math.sin(offset) * wSpeed, damage: wDamage, life: 120, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: 'yoyo', distance: 0 });
              }
            } else if (w === 'mace') {
              for (let i = 0; i < wMultiShot; i++) {
                const offset = angle + (i - (wMultiShot - 1) / 2) * wSpread;
                projectiles.push({ x: player.x, y: player.y, vx: 0, vy: 0, damage: wDamage, life: 60, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: 'mace', angle: offset, distance: 50 });
              }
            } else if (w === 'knife') {
              for (let i = 0; i < wMultiShot; i++) {
                const offset = angle + (i - (wMultiShot - 1) / 2) * wSpread;
                projectiles.push({ x: player.x, y: player.y, vx: Math.cos(offset) * wSpeed, vy: Math.sin(offset) * wSpeed, damage: wDamage, life: 60, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: 'knife' });
              }
            } else if (w === 'axe') {
              for (let i = 0; i < wMultiShot; i++) {
                const offset = angle + (i - (wMultiShot - 1) / 2) * wSpread;
                projectiles.push({ x: player.x, y: player.y, vx: Math.cos(offset) * wSpeed, vy: Math.sin(offset) * wSpeed - 5, damage: wDamage, life: 90, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: 'axe' });
              }
            } else if (w === 'plasma_rifle') {
              for (let i = 0; i < wMultiShot; i++) {
                const offset = angle + (i - (wMultiShot - 1) / 2) * wSpread;
                let plasmaDamage = wDamage * 1.5;
                let plasmaSize = wSize;
                if (s.upgradeLevels['plasma_overcharge']) {
                  plasmaDamage *= (1 + 0.5 * s.upgradeLevels['plasma_overcharge']);
                  plasmaSize *= 1.5;
                }
                projectiles.push({ x: player.x, y: player.y, vx: Math.cos(offset) * wSpeed, vy: Math.sin(offset) * wSpeed, damage: plasmaDamage, life: 60, pierce: wPierce, hit: new Set(), radius: plasmaSize, bounce: wBounce, type: 'plasma_rifle' });
              }
            } else if (w === 'turret') {
              let turretCount = 1;
              if (s.upgradeLevels['turret_twin']) turretCount += s.upgradeLevels['turret_twin'];
              for (let i = 0; i < turretCount; i++) {
                const a = angle + (Math.PI * 2 / turretCount) * i;
                const dist = 50;
                projectiles.push({ x: player.x + Math.cos(a) * dist, y: player.y + Math.sin(a) * dist, vx: 0, vy: 0, damage: wDamage, life: 300, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: 'turret', fireTimer: 0 });
              }
            } else if (w === 'barrier') {
              projectiles.push({ x: player.x, y: player.y, vx: 0, vy: 0, damage: wDamage, life: 10, pierce: wPierce, hit: new Set(), radius: wSize * 2, bounce: wBounce, type: 'barrier' });
            } else if (w === 'grenade' || w === 'cluster_bomb') {
              for (let i = 0; i < wMultiShot; i++) {
                let offset = angle + (i - (wMultiShot - 1) / 2) * wSpread;
                projectiles.push({
                  x: player.x, y: player.y, vx: Math.cos(offset) * wSpeed, vy: Math.sin(offset) * wSpeed,
                  damage: wDamage, life: 45, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: w
                });
              }
            } else if (w === 'mortar') {
              for (let i = 0; i < wMultiShot; i++) {
                if (enemies.length > 0) {
                  const target = enemies[Math.floor(Math.random() * enemies.length)];
                  projectiles.push({
                    x: target.x, y: target.y, vx: 0, vy: 0, damage: wDamage, life: 60, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: w, delay: 30
                  });
                }
              }
            } else if (w === 'c4') {
              for (let i = 0; i < wMultiShot; i++) {
                let offset = angle + (i - (wMultiShot - 1) / 2) * wSpread;
                projectiles.push({ x: player.x, y: player.y, vx: Math.cos(offset) * 10, vy: Math.sin(offset) * 10, damage: wDamage, life: 60, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: w });
              }
            } else if (w === 'slime' || w === 'skeleton' || w === 'bat') {
              for (let i = 0; i < wMultiShot; i++) {
                projectiles.push({ x: player.x, y: player.y, vx: (Math.random()-0.5)*wSpeed, vy: (Math.random()-0.5)*wSpeed, damage: wDamage, life: 300, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: w });
              }
            } else if (w === 'ghost') {
              for (let i = 0; i < wMultiShot; i++) {
                let offset = angle + (i - (wMultiShot - 1) / 2) * wSpread;
                projectiles.push({ x: player.x, y: player.y, vx: Math.cos(offset) * wSpeed, vy: Math.sin(offset) * wSpeed, damage: wDamage, life: 300, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: w });
              }
            } else if (w === 'holy_cross') {
              const directions = s.upgradeLevels['cross_orbit'] ? 8 : 4;
              for (let i = 0; i < directions; i++) {
                let dirAngle = angle + (Math.PI * 2 / directions) * i;
                projectiles.push({ x: player.x, y: player.y, vx: Math.cos(dirAngle) * wSpeed, vy: Math.sin(dirAngle) * wSpeed, damage: wDamage, life: 100, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: w });
              }
            } else if (w === 'smite') {
              for (const e of enemies) {
                projectiles.push({ x: e.x, y: e.y, vx: 0, vy: 0, damage: wDamage, life: 15, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: w });
              }
            } else if (w === 'holy_water') {
              projectiles.push({ x: player.x, y: player.y, vx: 0, vy: 0, damage: wDamage, life: 180, pierce: wPierce, hit: new Set(), radius: wSize * 2, bounce: wBounce, type: 'holy_water_pool' });
            } else if (w === 'bible') {
              for (let i = 0; i < wMultiShot; i++) {
                projectiles.push({ x: player.x, y: player.y, vx: 0, vy: 0, damage: wDamage, life: 180, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: w, angle: (Math.PI * 2 / wMultiShot) * i, distance: 40 });
              }
            } else if (w === 'demonic_sword') {
              player.hp -= 2;
              projectiles.push({ x: player.x, y: player.y, vx: 0, vy: 0, damage: wDamage, life: 15, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: 'sword', angle: angle, distance: 120 });
            } else if (w === 'abyss_orb') {
              projectiles.push({ x: player.x, y: player.y, vx: Math.cos(angle) * wSpeed, vy: Math.sin(angle) * wSpeed, damage: wDamage, life: 300, pierce: wPierce, hit: new Set(), radius: wSize, bounce: wBounce, type: 'blackhole' });
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
        } // End of numShooters loop
        player.x = realX;
        player.y = realY;
        
        // Special Evolutions independent firing
        if (s.upgradeLevels['hellfire']) {
          const lvl = s.upgradeLevels['hellfire'];
          if (s.frameCount % 180 === 0) { // Every 3 seconds
            projectiles.push({
              x: player.x, y: player.y,
              vx: 0, vy: 0,
              damage: stats.damage * 5 * lvl, life: 30, pierce: 999, hit: new Set(), radius: 1000, bounce: 0,
              type: 'explosion'
            });
          }
        }
        if (s.upgradeLevels['thunder_storm']) {
          const lvl = s.upgradeLevels['thunder_storm'];
          if (s.frameCount % Math.max(5, 30 - lvl * 5) === 0) {
            const tx = player.x + (Math.random() - 0.5) * 600;
            const ty = player.y + (Math.random() - 0.5) * 600;
            projectiles.push({
              x: tx, y: ty,
              vx: 0, vy: 0,
              damage: stats.damage * 2, life: 15, pierce: 999, hit: new Set(), radius: 40, bounce: 0,
              type: 'lightning'
            });
          }
        }
        if (s.upgradeLevels['death_vortex']) {
          const lvl = s.upgradeLevels['death_vortex'];
          if (s.frameCount % 240 === 0) {
            projectiles.push({
              x: player.x, y: player.y, vx: 0, vy: 0, damage: stats.damage * 2, life: 120 + lvl * 30, pierce: 999, hit: new Set(), radius: 200, bounce: 0, type: 'death_vortex', knockback: 0
            });
          }
        }
        if (s.upgradeLevels['divine_judgment']) {
          const lvl = s.upgradeLevels['divine_judgment'];
          if (s.frameCount % 180 === 0) {
            projectiles.push({
              x: player.x, y: player.y, vx: 0, vy: 0, damage: stats.damage * 3 * lvl, life: 60, pierce: 999, hit: new Set(), radius: 300, bounce: 0, type: 'holy_cross', knockback: 10
            });
          }
        }
        if (s.upgradeLevels['star_fall']) {
          const lvl = s.upgradeLevels['star_fall'];
          if (s.frameCount % Math.max(10, 30 - lvl * 5) === 0) {
            const tx = player.x + (Math.random() - 0.5) * 800;
            const ty = player.y - 400;
            projectiles.push({
              x: tx, y: ty, vx: 0, vy: 10, damage: stats.damage * 1.5, life: 60, pierce: 1, hit: new Set(), radius: 15, bounce: 0, type: 'magicwand', target: null
            });
          }
        }
        if (s.upgradeLevels['assassin_drone']) {
          const lvl = s.upgradeLevels['assassin_drone'];
          if (s.frameCount % Math.max(5, 20 - lvl * 3) === 0) {
            const drones = projectiles.filter(p => p.type === 'drone');
            for (const drone of drones) {
              const angle = Math.random() * Math.PI * 2;
              projectiles.push({
                x: drone.x, y: drone.y, vx: Math.cos(angle) * 15, vy: Math.sin(angle) * 15, damage: stats.damage * 0.8, life: 30, pierce: 1, hit: new Set(), radius: 10, bounce: 0, type: 'knife'
              });
            }
          }
        }
        if (s.upgradeLevels['tornado_axe']) {
          const lvl = s.upgradeLevels['tornado_axe'];
          if (s.frameCount % 120 === 0) {
            for (let i = 0; i < 4; i++) {
              const angle = (Math.PI * 2 / 4) * i;
              projectiles.push({
                x: player.x, y: player.y, vx: Math.cos(angle) * 8, vy: Math.sin(angle) * 8, damage: stats.damage * 2 * lvl, life: 120, pierce: 999, hit: new Set(), radius: 40, bounce: 0, type: 'axe', angle: angle
              });
            }
          }
        }
        if (s.upgradeLevels['rocket_turret']) {
          const lvl = s.upgradeLevels['rocket_turret'];
          if (s.frameCount % Math.max(30, 90 - lvl * 10) === 0) {
            const turrets = projectiles.filter(p => p.type === 'turret');
            for (const turret of turrets) {
              let closest = null, minDist = Infinity;
              for (const e of enemies) {
                const dist = Math.hypot(e.x - turret.x, e.y - turret.y);
                if (dist < minDist) { minDist = dist; closest = e; }
              }
              if (closest) {
                const angle = Math.atan2(closest.y - turret.y, closest.x - turret.x);
                projectiles.push({
                  x: turret.x, y: turret.y, vx: Math.cos(angle) * 10, vy: Math.sin(angle) * 10, damage: stats.damage * 3, life: 60, pierce: 1, hit: new Set(), radius: 15, bounce: 0, type: 'rocket', target: closest
                });
              }
            }
          }
        }
        if (s.upgradeLevels['excalibur']) {
          const lvl = s.upgradeLevels['excalibur'];
          if (s.frameCount % 150 === 0) {
            const angle = Math.random() * Math.PI * 2;
            projectiles.push({
              x: player.x, y: player.y, vx: 0, vy: 0, damage: stats.damage * 5 * lvl, life: 30, pierce: 999, hit: new Set(), radius: 400, bounce: 0, type: 'sword_wave', knockback: 20, angle: angle
            });
          }
        }
        if (s.upgradeLevels['gungnir']) {
          const lvl = s.upgradeLevels['gungnir'];
          if (s.frameCount % 120 === 0) {
            let closest = null, minDist = Infinity;
            for (const e of enemies) {
              const dist = Math.hypot(e.x - player.x, e.y - player.y);
              if (dist < minDist) { minDist = dist; closest = e; }
            }
            if (closest) {
              const angle = Math.atan2(closest.y - player.y, closest.x - player.x);
              projectiles.push({
                x: player.x, y: player.y, vx: Math.cos(angle) * 30, vy: Math.sin(angle) * 30, damage: stats.damage * 4 * lvl, life: 60, pierce: 999, hit: new Set(), radius: 20, bounce: 0, type: 'thrown_spear', angle: angle
              });
            }
          }
        }
        if (s.upgradeLevels['ragnarok']) {
          const lvl = s.upgradeLevels['ragnarok'];
          if (s.frameCount % 300 === 0) {
            projectiles.push({
              x: player.x, y: player.y, vx: 0, vy: 0, damage: stats.damage * 100 * lvl, life: 60, pierce: 999, hit: new Set(), radius: 2000, bounce: 0, type: 'smite', knockback: 0
            });
          }
        }
        if (s.upgradeLevels['orbital_strike']) {
          const lvl = s.upgradeLevels['orbital_strike'];
          if (s.frameCount % 60 === 0) {
            const sats = projectiles.filter(p => p.type === 'satellite');
            for (const sat of sats) {
              let closest = null, minDist = Infinity;
              for (const e of enemies) {
                const dist = Math.hypot(e.x - sat.x, e.y - sat.y);
                if (dist < minDist) { minDist = dist; closest = e; }
              }
              if (closest) {
                const angle = Math.atan2(closest.y - sat.y, closest.x - sat.x);
                projectiles.push({
                  x: sat.x, y: sat.y, vx: 0, vy: 0, damage: stats.damage * lvl, life: 15, pierce: 999, hit: new Set(), radius: 4, bounce: 0, type: 'laser', angle: angle, distance: 800
                });
              }
            }
          }
        }
      }

      // Update Projectiles
      for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        if (p.delay && p.delay > 0) {
          p.delay--;
          continue;
        }
        
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
        } else if (p.type === 'drone_shot') {
          if (enemies.length > 0) {
            let closest = enemies[0];
            let minDist = Math.hypot(closest.x - p.x, closest.y - p.y);
            for (let i = 1; i < enemies.length; i++) {
              const dist = Math.hypot(enemies[i].x - p.x, enemies[i].y - p.y);
              if (dist < minDist) {
                minDist = dist;
                closest = enemies[i];
              }
            }
            const angle = Math.atan2(closest.y - p.y, closest.x - p.x);
            const speed = Math.hypot(p.vx, p.vy);
            const currentAngle = Math.atan2(p.vy, p.vx);
            let diff = angle - currentAngle;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            const newAngle = currentAngle + Math.sign(diff) * Math.min(Math.abs(diff), 0.1);
            p.vx = Math.cos(newAngle) * speed;
            p.vy = Math.sin(newAngle) * speed;
          }
          p.x += p.vx; p.y += p.vy;
        } else if (p.type === 'drone_laser') {
          p.x = player.x + Math.cos(p.angle!) * 30;
          p.y = player.y + Math.sin(p.angle!) * 30;
        } else if (p.type === 'shuriken') {
          if (p.life === 45 && s.upgradeLevels['shuriken_shadow'] && p.source !== 'shadow') {
            const splitCount = s.upgradeLevels['shuriken_shadow'];
            for (let k = 0; k < splitCount; k++) {
              const a = (Math.PI * 2 / splitCount) * k;
              const speed = Math.hypot(p.vx, p.vy);
              projectiles.push({
                x: p.x, y: p.y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, damage: p.damage * 0.5, life: p.life, pierce: p.pierce, hit: new Set(), radius: p.radius, bounce: p.bounce, type: 'shuriken', source: 'shadow'
              });
            }
          }
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
          p.angle! += 0.05 + 0.01 * (s.upgradeLevels['laser_orbital'] || 1);
          p.x = player.x;
          p.y = player.y;
          p.hit.clear();
        } else if (p.type === 'boomerang_orbit') {
          p.angle! += 0.03;
          p.distance! += 0.1 * (s.upgradeLevels['boomerang_orbit'] || 1);
          p.x = player.x + Math.cos(p.angle!) * p.distance!;
          p.y = player.y + Math.sin(p.angle!) * p.distance!;
          p.hit.clear();
        } else if (p.type === 'shuriken_orbit') {
          p.angle! += 0.05;
          p.x = player.x + Math.cos(p.angle!) * p.distance!;
          p.y = player.y + Math.sin(p.angle!) * p.distance!;
          p.hit.clear();
        } else if (p.type === 'poison_pool') {
          if (s.frameCount % (s.upgradeLevels['poison_cloud'] ? Math.max(5, 30 - 5 * s.upgradeLevels['poison_cloud']) : 30) === 0) p.hit.clear();
        } else if (p.type === 'fire_wall') {
          if (s.frameCount % 10 === 0) p.hit.clear();
        } else if (p.type === 'aura') {
          if (s.frameCount % 30 === 0) p.hit.clear();
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
          p.x += p.vx; p.y += p.vy;
          
          if (p.life === 60 && s.upgradeLevels['chakram_split'] && p.source !== 'split') {
            const splitCount = s.upgradeLevels['chakram_split'];
            for (let k = 0; k < splitCount; k++) {
              const newAngle = p.angle + (Math.PI * 2 / splitCount) * k;
              projectiles.push({
                x: p.x, y: p.y, vx: Math.cos(newAngle) * speed, vy: Math.sin(newAngle) * speed, damage: p.damage, life: p.life, pierce: p.pierce, hit: new Set(), radius: p.radius, bounce: p.bounce, type: 'chakram', angle: newAngle, source: 'split'
              });
            }
          }
          
          if (s.upgradeLevels['chakram_flame'] && s.frameCount % 5 === 0) {
            projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: p.damage * 0.2 * s.upgradeLevels['chakram_flame'], life: s.upgradeLevels['chakram_flame'] * 120, pierce: 999, hit: new Set(), radius: p.radius, bounce: 0, type: 'fire_wall', source: 'chakram' });
          }
        } else if (p.type === 'blackhole') {
          for (const e of enemies) {
            const dist = Math.hypot(e.x - p.x, e.y - p.y);
            const radius = p.radius * 5 * (s.upgradeLevels['blackhole_supermassive'] ? s.upgradeLevels['blackhole_supermassive'] * 2 : 1);
            if (dist < radius) {
              const angle = Math.atan2(p.y - e.y, p.x - e.x);
              // Pull enemies towards the blackhole, overcoming their movement speed with strong suction
              e.x += Math.cos(angle) * (e.speed + 10);
              e.y += Math.sin(angle) * (e.speed + 10);
              e.stunned = 5;
              e.inBlackhole = true;
            }
          }
          if (s.upgradeLevels['blackhole_quasar'] && s.frameCount % 30 === 0) {
            for (let i = 0; i < s.upgradeLevels['blackhole_quasar']; i++) {
              const a = Math.random() * Math.PI * 2;
              projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: p.damage * 0.5, life: 30, pierce: 999, hit: new Set(), radius: 10, bounce: 0, type: 'quasar_laser', angle: a, distance: 1000 });
            }
          }
          if (p.life % 10 === 0) p.hit.clear();
          p.x += p.vx; p.y += p.vy;
        } else if (p.type === 'death_vortex') {
          p.x = player.x;
          p.y = player.y;
          for (const e of enemies) {
            if (Math.hypot(e.x - p.x, e.y - p.y) < p.radius) {
              e.inBlackhole = true;
            }
          }
          if (s.frameCount % 30 === 0) {
            p.hit.clear();
            for (const e of enemies) {
              if (Math.hypot(e.x - p.x, e.y - p.y) < p.radius) {
                e.hp -= e.maxHp * 0.05 * s.upgradeLevels['death_vortex'];
                s.damageTexts.push({ x: e.x, y: e.y - 20, text: Math.floor(e.maxHp * 0.05 * s.upgradeLevels['death_vortex']).toString(), life: 30, color: '#a855f7' });
              }
            }
          }
        } else if (p.type === 'chainsaw') {
          p.x = player.x + Math.cos(p.angle!) * p.distance!;
          p.y = player.y + Math.sin(p.angle!) * p.distance!;
          p.hit.clear();
          if (s.upgradeLevels['carnage_waltz']) {
            const a = p.angle! + s.frameCount * 0.1;
            const dist = 100;
            projectiles.push({ x: player.x + Math.cos(a) * dist, y: player.y + Math.sin(a) * dist, vx: 0, vy: 0, damage: p.damage * 2, life: 5, pierce: 999, hit: new Set(), radius: p.radius * 2, bounce: 0, type: 'chainsaw', angle: a + Math.PI/2, distance: p.distance });
          }
        } else if (p.type === 'yoyo') {
          p.distance = (p.distance || 0) + 1;
          const maxDist = 150 + (s.upgradeLevels['yoyo_orbit'] ? s.upgradeLevels['yoyo_orbit'] * 45 : 0);
          if (p.distance < 30) {
            p.x += p.vx; p.y += p.vy;
          } else if (p.distance < 90) {
            const orbitAngle = s.frameCount * 0.2 + (p.angle || 0);
            const targetX = player.x + Math.cos(orbitAngle) * maxDist;
            const targetY = player.y + Math.sin(orbitAngle) * maxDist;
            p.x += (targetX - p.x) * 0.1;
            p.y += (targetY - p.y) * 0.1;
          } else {
            p.x += (player.x - p.x) * 0.1;
            p.y += (player.y - p.y) * 0.1;
          }
        } else if (p.type === 'mace') {
          p.angle = (p.angle || 0) + 0.1;
          p.x = player.x + Math.cos(p.angle) * p.distance!;
          p.y = player.y + Math.sin(p.angle) * p.distance!;
          if (s.frameCount % 15 === 0) p.hit.clear();
        } else if (p.type === 'plasma_rifle') {
          p.x += p.vx; p.y += p.vy;
        } else if (p.type === 'turret') {
          p.fireTimer = (p.fireTimer || 0) + 1;
          if (p.fireTimer >= 30) {
            p.fireTimer = 0;
            const target = enemies.find(e => Math.hypot(e.x - p.x, e.y - p.y) < 400);
            if (target) {
              const a = Math.atan2(target.y - p.y, target.x - p.x);
              if (s.upgradeLevels['annihilation_cannon']) {
                projectiles.push({ x: p.x, y: p.y, vx: Math.cos(a) * 20, vy: Math.sin(a) * 20, damage: p.damage * 5, life: 60, pierce: 999, hit: new Set(), radius: 20, bounce: 0, type: 'plasma_rifle' });
              } else if (s.upgradeLevels['turret_rocket']) {
                projectiles.push({ x: p.x, y: p.y, vx: Math.cos(a) * 8, vy: Math.sin(a) * 8, damage: p.damage * 2, life: 60, pierce: 0, hit: new Set(), radius: 10, bounce: 0, type: 'rocket' });
              } else {
                projectiles.push({ x: p.x, y: p.y, vx: Math.cos(a) * 12, vy: Math.sin(a) * 12, damage: p.damage, life: 30, pierce: 1, hit: new Set(), radius: 5, bounce: 0, type: 'pistol' });
              }
            }
          }
        } else if (p.type === 'barrier') {
          p.x = player.x;
          p.y = player.y;
          p.hit.clear();
        } else if (p.type === 'grenade') {
          p.x += p.vx; p.y += p.vy;
          p.vx *= 0.95; p.vy *= 0.95;
          const closeEnemy = enemies.find(e => Math.hypot(e.x - p.x, e.y - p.y) < p.radius + e.radius);
          if (closeEnemy || p.life === 1) {
            projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: p.damage, life: 10, pierce: 999, hit: new Set(), radius: p.radius * 3, bounce: 0, type: 'explosion' });
            p.life = 0;
          }
        } else if (p.type === 'cluster_bomb') {
          p.x += p.vx; p.y += p.vy;
          p.vx *= 0.95; p.vy *= 0.95;
          if (p.life === 1) {
            projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: p.damage, life: 10, pierce: 999, hit: new Set(), radius: p.radius * 3, bounce: 0, type: 'explosion' });
            for (let k = 0; k < 5; k++) {
              const a = Math.random() * Math.PI * 2;
              projectiles.push({ x: p.x, y: p.y, vx: Math.cos(a)*3, vy: Math.sin(a)*3, damage: p.damage*0.5, life: 20, pierce: 999, hit: new Set(), radius: p.radius, bounce: 0, type: 'grenade' });
            }
          }
        } else if (p.type === 'mortar') {
          if (p.life === 1) {
            projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: p.damage, life: 15, pierce: 999, hit: new Set(), radius: p.radius, bounce: 0, type: 'explosion' });
          }
        } else if (p.type === 'c4') {
          p.x += p.vx; p.y += p.vy;
          p.vx *= 0.9; p.vy *= 0.9;
          if (p.life === 1) {
            projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: p.damage, life: 15, pierce: 999, hit: new Set(), radius: p.radius * 4, bounce: 0, type: 'explosion' });
          }
        } else if (p.type === 'slime') {
          if (s.frameCount % 30 === 0) {
            const a = Math.random() * Math.PI * 2;
            p.vx = Math.cos(a) * 3; p.vy = Math.sin(a) * 3;
          }
          p.x += p.vx; p.y += p.vy;
          if (s.frameCount % 10 === 0) p.hit.clear();
        } else if (p.type === 'skeleton') {
          let closest = null, minDist = Infinity;
          for (const e of enemies) {
            const dist = Math.hypot(e.x - p.x, e.y - p.y);
            if (dist < minDist) { minDist = dist; closest = e; }
          }
          if (closest) {
            const a = Math.atan2(closest.y - p.y, closest.x - p.x);
            p.vx = Math.cos(a) * 2; p.vy = Math.sin(a) * 2;
          }
          p.x += p.vx; p.y += p.vy;
          if (s.frameCount % 20 === 0) p.hit.clear();
        } else if (p.type === 'bat') {
          let closest = null, minDist = Infinity;
          for (const e of enemies) {
            const dist = Math.hypot(e.x - p.x, e.y - p.y);
            if (dist < minDist) { minDist = dist; closest = e; }
          }
          if (closest) {
            const a = Math.atan2(closest.y - p.y, closest.x - p.x);
            p.vx += Math.cos(a) * 0.5; p.vy += Math.sin(a) * 0.5;
            const speed = Math.hypot(p.vx, p.vy);
            if (speed > 6) { p.vx = (p.vx/speed)*6; p.vy = (p.vy/speed)*6; }
          }
          p.x += p.vx; p.y += p.vy;
          if (s.frameCount % 10 === 0) p.hit.clear();
        } else if (p.type === 'ghost') {
          p.x += p.vx; p.y += p.vy;
          if (s.frameCount % 15 === 0) p.hit.clear();
        } else if (p.type === 'holy_cross') {
          p.x += p.vx; p.y += p.vy;
        } else if (p.type === 'smite') {
          // doesn't move
        } else if (p.type === 'holy_water_bottle') {
          p.x += p.vx; p.y += p.vy;
          p.vx *= 0.95; p.vy *= 0.95;
          if (p.life === 1) {
            projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: p.damage * 0.2, life: 180, pierce: 999, hit: new Set(), radius: p.radius * 2, bounce: 0, type: 'holy_water_pool' });
          }
        } else if (p.type === 'holy_water_pool') {
          if (s.frameCount % 15 === 0) p.hit.clear();
        } else if (p.type === 'bible') {
          p.angle = (p.angle || 0) + 0.05;
          const expandSpeed = 1 * (1 + (s.upgradeLevels['bible_expand'] || 0) * 0.5);
          p.distance = (p.distance || 40) + expandSpeed;
          p.x = player.x + Math.cos(p.angle) * p.distance;
          p.y = player.y + Math.sin(p.angle) * p.distance;
          p.hit.clear();
        } else if (p.type === 'enemy_bullet') {
          p.x += p.vx;
          p.y += p.vy;
          if (Math.hypot(p.x - player.x, p.y - player.y) < p.radius + player.radius) {
            if (player.invuln <= 0) {
              player.hp -= Math.max(1, p.damage - stats.armor);
              player.invuln = 30;
              if (player.hp <= 0) {
                s.status = 'gameover';
                setUiState(prev => ({ ...prev, status: 'gameover', score: s.score, time: s.time }));
              }
            }
            p.life = 0;
          }
        } else if (p.type === 'aura') {
          p.x = player.x;
          p.y = player.y;
          if (s.upgradeLevels['aura_freeze']) {
            for (const e of enemies) {
              if (Math.hypot(e.x - p.x, e.y - p.y) < p.radius) {
                const slowFactor = Math.max(0.1, 1 - 0.2 * s.upgradeLevels['aura_freeze']);
                e.x += Math.cos(Math.atan2(e.y - player.y, e.x - player.x)) * e.speed * (1 - slowFactor);
                e.y += Math.sin(Math.atan2(e.y - player.y, e.x - player.x)) * e.speed * (1 - slowFactor);
              }
            }
          }
          if (s.upgradeLevels['gun_kata'] && s.frameCount % Math.max(5, 30 - s.upgradeLevels['gun_kata'] * 5) === 0) {
            const targets = enemies.filter(e => Math.hypot(e.x - p.x, e.y - p.y) < p.radius);
            if (targets.length > 0) {
              const target = targets[Math.floor(Math.random() * targets.length)];
              const angle = Math.atan2(target.y - p.y, target.x - p.x);
              projectiles.push({ x: p.x, y: p.y, vx: Math.cos(angle) * 15, vy: Math.sin(angle) * 15, damage: stats.damage * 2, life: 30, pierce: 1, hit: new Set(), radius: 5, bounce: 0, type: 'pistol' });
            }
          }
        } else if (p.type === 'lightning') {
          p.x += p.vx; p.y += p.vy;
        } else if (p.type === 'scythe') {
          p.angle! += 0.04 * p.speed!;
          p.distance! += 2;
          p.x = player.x + Math.cos(p.angle!) * p.distance!;
          p.y = player.y + Math.sin(p.angle!) * p.distance!;
          if (s.upgradeLevels['scythe_vortex']) {
            for (const e of enemies) {
              if (Math.hypot(e.x - p.x, e.y - p.y) < p.radius * 3) {
                const angle = Math.atan2(p.y - e.y, p.x - e.x);
                e.x += Math.cos(angle) * s.upgradeLevels['scythe_vortex'];
                e.y += Math.sin(angle) * s.upgradeLevels['scythe_vortex'];
              }
            }
          }
        } else if (p.type === 'boomerang') {
          const progress = p.life / 60;
          if (progress > 0.5) {
            p.x += p.vx; p.y += p.vy;
            p.vx *= 0.95; p.vy *= 0.95;
          } else {
            if (p.life === 30 && s.upgradeLevels['boomerang_split'] && p.source !== 'split') {
              const splitCount = s.upgradeLevels['boomerang_split'];
              for (let k = 0; k < splitCount; k++) {
                const a = (Math.PI * 2 / splitCount) * k;
                const speed = Math.hypot(p.vx, p.vy);
                projectiles.push({
                  x: p.x, y: p.y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, damage: p.damage, life: p.life, pierce: p.pierce, hit: new Set(), radius: p.radius, bounce: p.bounce, type: 'boomerang', source: 'split'
                });
              }
            }
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
        } else if (p.type === 'flame') {
          p.x += p.vx; p.y += p.vy;
          if (s.upgradeLevels['flamethrower_wall'] && s.frameCount % 5 === 0) {
            projectiles.push({
              x: p.x, y: p.y, vx: 0, vy: 0,
              damage: p.damage * 0.5, life: s.upgradeLevels['flamethrower_wall'] * 120, pierce: 999, hit: new Set(), radius: p.radius, bounce: 0,
              type: 'fire_wall', source: 'flamethrower'
            });
          }
        } else if (p.type === 'axe') {
          p.vy += 0.3; // gravity
          p.x += p.vx; p.y += p.vy;
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
            if (s.upgradeLevels['fireball_napalm']) {
              projectiles.push({
                x: p.x, y: p.y, vx: 0, vy: 0,
                damage: p.damage * 0.2, life: s.upgradeLevels['fireball_napalm'] * 120, pierce: 999, hit: new Set(), radius: expRadius * 0.8, bounce: 0,
                type: 'fire_wall', source: 'fireball'
              });
            }
          } else if (p.type === 'rocket') {
            let expRadius = s.upgradeLevels['rocket_nuke'] ? p.radius * 6 : p.radius * 3;
            let expDamage = s.upgradeLevels['rocket_nuke'] ? p.damage * 3 : p.damage;
            projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: expDamage, life: 5, pierce: 999, hit: new Set(), radius: expRadius, bounce: 0, type: 'explosion' });
            if (s.upgradeLevels['rocket_cluster'] && p.source !== 'cluster') {
              const splitCount = s.upgradeLevels['rocket_cluster'] * 3;
              for (let k = 0; k < splitCount; k++) {
                const a = (Math.PI * 2 / splitCount) * k;
                projectiles.push({ x: p.x, y: p.y, vx: Math.cos(a) * 5, vy: Math.sin(a) * 5, damage: p.damage * 0.5, life: 20, pierce: 0, hit: new Set(), radius: p.radius * 0.5, bounce: 0, type: 'rocket', source: 'cluster' });
              }
            }
          } else if (p.type === 'missile') {
            let expRadius = s.upgradeLevels['missile_nuke'] ? 800 : p.radius * 4;
            let expDamage = s.upgradeLevels['missile_nuke'] ? p.damage * 3 : p.damage;
            projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: expDamage, life: 10, pierce: 999, hit: new Set(), radius: expRadius, bounce: 0, type: 'explosion' });
            if (s.upgradeLevels['biohazard']) {
              const lvl = s.upgradeLevels['biohazard'];
              projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: p.damage * 0.5, life: 180, pierce: 999, hit: new Set(), radius: expRadius * (1 + lvl * 0.2), bounce: 0, type: 'poison_pool' });
            }
          } else if (p.type === 'poison_flask') {
            let poolRadius = s.upgradeLevels['poison_cloud'] ? p.radius * 4 : p.radius * 2;
            let poolDamage = s.upgradeLevels['poison_cloud'] ? p.damage * 0.4 : p.damage * 0.2;
            projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: poolDamage, life: 120, pierce: 999, hit: new Set(), radius: poolRadius, bounce: 0, type: 'poison_pool' });
          } else if (p.type === 'mine') {
            projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: p.damage * 2, life: 5, pierce: 999, hit: new Set(), radius: p.radius * 3, bounce: 0, type: 'explosion', source: 'mine' });
            if (s.upgradeLevels['mine_cluster'] && p.source !== 'cluster') {
              const splitCount = s.upgradeLevels['mine_cluster'] * 2;
              for (let k = 0; k < splitCount; k++) {
                const a = (Math.PI * 2 / splitCount) * k;
                projectiles.push({ x: p.x + Math.cos(a)*50, y: p.y + Math.sin(a)*50, vx: 0, vy: 0, damage: p.damage, life: 150, pierce: 999, hit: new Set(), radius: p.radius * 0.5, bounce: 0, type: 'mine', source: 'cluster' });
              }
            }
            if (s.upgradeLevels['napalm_bomb']) {
              projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: p.damage * 0.5, life: 180, pierce: 999, hit: new Set(), radius: p.radius * 4 * s.upgradeLevels['napalm_bomb'], bounce: 0, type: 'fire_wall' });
            }
          }
          projectiles.splice(i, 1); 
          continue; 
        }

        if (p.type === 'enemy_bullet') {
          continue;
        }

        for (let j = enemies.length - 1; j >= 0; j--) {
          const e = enemies[j];
          let isHit = false;
          
          if (p.type === 'laser' || p.type === 'laser_orbital' || p.type === 'quasar_laser' || p.type === 'laser_refract_beam' || p.type === 'drone_laser') {
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
            if (e.type === 'charger' && (!e.chargeTimer || e.chargeTimer < 60)) {
              if (Math.random() < 0.2) {
                const dodgeAngle = Math.atan2(e.y - p.y, e.x - p.x) + (Math.random() > 0.5 ? Math.PI / 2 : -Math.PI / 2);
                e.x += Math.cos(dodgeAngle) * 50;
                e.y += Math.sin(dodgeAngle) * 50;
                s.damageTexts.push({ x: e.x, y: e.y - 20, text: 'DODGE!', life: 30, color: '#94a3b8' });
                continue;
              }
            }
            if (p.type === 'rocket' || p.type === 'poison_flask' || p.type === 'mine' || p.type === 'missile') {
              p.life = 0;
            }
            if (p.type === 'sniper' && s.upgradeLevels['sniper_pierce']) {
              p.damage *= (1 + 0.2 * s.upgradeLevels['sniper_pierce']);
            }
            if (p.type === 'lightning' && s.upgradeLevels['lightning_chain'] && p.source !== 'chain') {
              let chainCount = s.upgradeLevels['lightning_chain'] * 3;
              const nearby = enemies.filter(e2 => e2 !== e && Math.hypot(e2.x - e.x, e2.y - e.y) < 300).slice(0, chainCount);
              for (const nextTarget of nearby) {
                projectiles.push({
                  x: nextTarget.x, y: nextTarget.y - 100,
                  vx: 0, vy: 20,
                  damage: p.damage * 0.5, life: 5, pierce: 1, hit: new Set(), radius: p.radius, bounce: 0,
                  type: 'lightning', target: nextTarget, source: 'chain'
                });
              }
            }
            if (p.type === 'whip' && s.upgradeLevels['whip_vampire'] && Math.random() < 0.1 * s.upgradeLevels['whip_vampire']) {
              player.hp = Math.min(player.maxHp, player.hp + 1);
            }
            if (p.type === 'whip' && s.upgradeLevels['vampire_whip'] && Math.random() < 0.3) {
              player.hp = Math.min(player.maxHp, player.hp + s.upgradeLevels['vampire_whip']);
            }
            if (p.type === 'arrow' && s.upgradeLevels['glacier_arrow']) {
              const splitCount = s.upgradeLevels['glacier_arrow'] * 2;
              for (let k = 0; k < splitCount; k++) {
                const a = (Math.PI * 2 / splitCount) * k;
                projectiles.push({
                  x: e.x, y: e.y, vx: Math.cos(a) * 5, vy: Math.sin(a) * 5, damage: p.damage * 0.5, life: 20, pierce: 1, hit: new Set(), radius: p.radius * 0.5, bounce: 0, type: 'icicle_shard', source: 'shatter'
                });
              }
              e.stunned = Math.max(e.stunned || 0, 60);
            }
            if (p.type === 'whip' && s.upgradeLevels['whip_thunder']) {
              projectiles.push({
                x: e.x, y: e.y - 200,
                vx: 0, vy: 20,
                damage: p.damage * 0.5 * s.upgradeLevels['whip_thunder'], life: 10, pierce: 999, hit: new Set(), radius: 30, bounce: 0,
                type: 'lightning', target: e
              });
            }
            if (p.type === 'arrow' && s.upgradeLevels['bow_explosive']) {
              projectiles.push({
                x: e.x, y: e.y, vx: 0, vy: 0,
                damage: p.damage * 0.5, life: 5, pierce: 999, hit: new Set(), radius: 40 + 20 * s.upgradeLevels['bow_explosive'], bounce: 0,
                type: 'explosion'
              });
            }
            if (p.type === 'poison_pool' && s.upgradeLevels['poison_corrosion']) {
              e.corrosion = s.upgradeLevels['poison_corrosion'];
            }
            if (p.type === 'icicle' && s.upgradeLevels['icicle_shatter'] && p.source !== 'shatter') {
              const splitCount = s.upgradeLevels['icicle_shatter'] * 2;
              for (let k = 0; k < splitCount; k++) {
                const a = (Math.PI * 2 / splitCount) * k;
                projectiles.push({
                  x: e.x, y: e.y, vx: Math.cos(a) * 5, vy: Math.sin(a) * 5, damage: p.damage * 0.3, life: 20, pierce: 1, hit: new Set(), radius: p.radius * 0.5, bounce: 0, type: 'icicle_shard', source: 'shatter'
                });
              }
            }
            if ((p.type === 'laser' || p.type === 'laser_refract_beam') && s.upgradeLevels['laser_refract'] && p.bounce > 0) {
              p.bounce--;
              let closest = null;
              let minDist = Infinity;
              for (const other of enemies) {
                if (other === e) continue;
                const dist = Math.hypot(other.x - e.x, other.y - e.y);
                if (dist < minDist) {
                  minDist = dist;
                  closest = other;
                }
              }
              if (closest) {
                const angle = Math.atan2(closest.y - e.y, closest.x - e.x);
                projectiles.push({
                  x: e.x, y: e.y, vx: 0, vy: 0, damage: p.damage, life: p.life, pierce: p.pierce, hit: new Set([e]), radius: p.radius, bounce: p.bounce, type: 'laser_refract_beam', angle: angle, distance: 1000
                });
              }
            }
            if ((p.type === 'icicle' || p.type === 'icicle_shard') && s.upgradeLevels['icicle_freeze']) {
              e.stunned = Math.max(e.stunned || 0, s.upgradeLevels['icicle_freeze'] * 60);
            }
            if (p.type === 'explosion' && p.source === 'mine' && s.upgradeLevels['mine_emp']) {
              e.stunned = Math.max(e.stunned || 0, s.upgradeLevels['mine_emp'] * 60);
            }
            if (p.type === 'satellite' && s.upgradeLevels['satellite_blade']) {
              e.bleed = Math.max(e.bleed || 0, s.upgradeLevels['satellite_blade'] * 60);
            }
            
            p.hit.add(e);
            
            // Crit
            let dmg = p.damage;
            if (e.corrosion) {
              dmg *= (1 + 0.2 * e.corrosion);
            }
            let isCrit = false;
            if (Math.random() < stats.crit * stats.luck) {
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
                player.maxHp += s.upgradeLevels['scythe_execution'];
                player.hp += s.upgradeLevels['scythe_execution'];
              }
              if (p.type === 'magicwand' && s.upgradeLevels['magicwand_blackhole']) {
                const hasNearby = projectiles.some(proj => proj.type === 'blackhole' && Math.hypot(proj.x - e.x, proj.y - e.y) < 100);
                if (!hasNearby) {
                  projectiles.push({
                    x: e.x, y: e.y, vx: 0, vy: 0, damage: p.damage * 0.1, life: 60, pierce: 999, hit: new Set(), radius: 150, bounce: 0, type: 'blackhole', knockback: 0
                  });
                }
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
                  if (s.upgradeLevels['fireball_napalm']) {
                    projectiles.push({
                      x: p.x, y: p.y, vx: 0, vy: 0,
                      damage: p.damage * 0.2, life: s.upgradeLevels['fireball_napalm'] * 120, pierce: 999, hit: new Set(), radius: expRadius * 0.8, bounce: 0,
                      type: 'fire_wall', source: 'fireball'
                    });
                  }
                } else if (p.type === 'rocket') {
                  let expRadius = s.upgradeLevels['rocket_nuke'] ? p.radius * 6 : p.radius * 3;
                  let expDamage = s.upgradeLevels['rocket_nuke'] ? p.damage * 3 : p.damage;
                  projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: expDamage, life: 5, pierce: 999, hit: new Set(), radius: expRadius, bounce: 0, type: 'explosion' });
                  if (s.upgradeLevels['rocket_cluster'] && p.source !== 'cluster') {
                    const splitCount = s.upgradeLevels['rocket_cluster'] * 3;
                    for (let k = 0; k < splitCount; k++) {
                      const a = (Math.PI * 2 / splitCount) * k;
                      projectiles.push({ x: p.x, y: p.y, vx: Math.cos(a) * 5, vy: Math.sin(a) * 5, damage: p.damage * 0.5, life: 20, pierce: 0, hit: new Set(), radius: p.radius * 0.5, bounce: 0, type: 'rocket', source: 'cluster' });
                    }
                  }
                } else if (p.type === 'missile') {
                  let expRadius = s.upgradeLevels['missile_nuke'] ? 800 : p.radius * 4;
                  let expDamage = s.upgradeLevels['missile_nuke'] ? p.damage * 3 : p.damage;
                  projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: expDamage, life: 10, pierce: 999, hit: new Set(), radius: expRadius, bounce: 0, type: 'explosion' });
                  if (s.upgradeLevels['biohazard']) {
                    const lvl = s.upgradeLevels['biohazard'];
                    projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: p.damage * 0.5, life: 180, pierce: 999, hit: new Set(), radius: expRadius * (1 + lvl * 0.2), bounce: 0, type: 'poison_pool' });
                  }
                } else if (p.type === 'poison_flask') {
                  let poolRadius = s.upgradeLevels['poison_cloud'] ? p.radius * 4 : p.radius * 2;
                  let poolDamage = s.upgradeLevels['poison_cloud'] ? p.damage * 0.4 : p.damage * 0.2;
                  projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: poolDamage, life: 120, pierce: 999, hit: new Set(), radius: poolRadius, bounce: 0, type: 'poison_pool' });
                } else if (p.type === 'mine') {
                  projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: p.damage * 2, life: 5, pierce: 999, hit: new Set(), radius: p.radius * 3, bounce: 0, type: 'explosion', source: 'mine' });
                  if (s.upgradeLevels['mine_cluster'] && p.source !== 'cluster') {
                    const splitCount = s.upgradeLevels['mine_cluster'] * 2;
                    for (let k = 0; k < splitCount; k++) {
                      const a = (Math.PI * 2 / splitCount) * k;
                      projectiles.push({ x: p.x + Math.cos(a)*50, y: p.y + Math.sin(a)*50, vx: 0, vy: 0, damage: p.damage, life: 150, pierce: 999, hit: new Set(), radius: p.radius * 0.5, bounce: 0, type: 'mine', source: 'cluster' });
                    }
                  }
                  if (s.upgradeLevels['napalm_bomb']) {
                    projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: p.damage * 0.5, life: 180, pierce: 999, hit: new Set(), radius: p.radius * 4 * s.upgradeLevels['napalm_bomb'], bounce: 0, type: 'fire_wall' });
                  }
                } else if (p.type === 'shotgun' && s.upgradeLevels['heavy_artillery']) {
                  projectiles.push({ x: p.x, y: p.y, vx: 0, vy: 0, damage: p.damage * 2, life: 10, pierce: 999, hit: new Set(), radius: p.radius * 5 * s.upgradeLevels['heavy_artillery'], bounce: 0, type: 'explosion' });
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
        
        if (e.stunned > 0) {
          e.stunned--;
        } else {
          const angle = Math.atan2(player.y - e.y, player.x - e.x);
          const distToPlayer = Math.hypot(player.x - e.x, player.y - e.y);
          
          if (e.type === 'shooter') {
            if (distToPlayer > 300) {
              e.x += Math.cos(angle) * e.speed;
              e.y += Math.sin(angle) * e.speed;
            } else if (distToPlayer < 200) {
              e.x -= Math.cos(angle) * e.speed;
              e.y -= Math.sin(angle) * e.speed;
            }
            if (s.frameCount % 120 === 0) {
              projectiles.push({ x: e.x, y: e.y, vx: Math.cos(angle) * 5, vy: Math.sin(angle) * 5, damage: e.damage, life: 100, pierce: 0, hit: new Set(), radius: 5, bounce: 0, type: 'enemy_bullet' });
            }
          } else if (e.type === 'charger') {
            e.chargeTimer = (e.chargeTimer || 0) + 1;
            if (e.chargeTimer < 60) {
              e.x += Math.cos(angle) * (e.speed * 0.5);
              e.y += Math.sin(angle) * (e.speed * 0.5);
              e.chargeAngle = angle;
            } else if (e.chargeTimer < 90) {
              e.x += Math.cos(e.chargeAngle) * (e.speed * 4);
              e.y += Math.sin(e.chargeAngle) * (e.speed * 4);
            } else {
              e.chargeTimer = 0;
            }
          } else if (e.type === 'summoner') {
            if (distToPlayer > 400) {
              e.x += Math.cos(angle) * e.speed;
              e.y += Math.sin(angle) * e.speed;
            } else if (distToPlayer < 300) {
              e.x -= Math.cos(angle) * e.speed;
              e.y -= Math.sin(angle) * e.speed;
            }
            if (s.frameCount % 180 === 0) {
              for (let k = 0; k < 3; k++) {
                const spawnAngle = Math.random() * Math.PI * 2;
                let spawnHp = e.maxHp * 0.2;
                let spawnSpeed = e.speed * 1.5;
                if (s.hardcoreMode) {
                  spawnHp *= 5;
                  spawnSpeed *= 1.5;
                }
                enemies.push({ x: e.x + Math.cos(spawnAngle) * 50, y: e.y + Math.sin(spawnAngle) * 50, hp: spawnHp, maxHp: spawnHp, speed: spawnSpeed, radius: 10, damage: e.damage * 0.5, type: 'fast', color: '#ffb400' });
              }
            }
          } else if (e.type === 'jumper') {
            e.chargeTimer = (e.chargeTimer || 0) + 1;
            if (e.chargeTimer < 90) {
              // Wait
            } else if (e.chargeTimer < 110) {
              e.x += Math.cos(angle) * (e.speed * 8);
              e.y += Math.sin(angle) * (e.speed * 8);
            } else {
              e.chargeTimer = 0;
            }
          } else if (e.type === 'necromancer') {
            if (distToPlayer > 300) {
              e.x += Math.cos(angle) * e.speed;
              e.y += Math.sin(angle) * e.speed;
            } else {
              e.x -= Math.cos(angle) * e.speed * 0.5;
              e.y -= Math.sin(angle) * e.speed * 0.5;
            }
            if (s.frameCount % 120 === 0 && enemies.length < 400) {
              const spawnAngle = Math.random() * Math.PI * 2;
              enemies.push({ x: e.x + Math.cos(spawnAngle) * 30, y: e.y + Math.sin(spawnAngle) * 30, hp: e.maxHp * 0.1, maxHp: e.maxHp * 0.1, speed: e.speed * 2, radius: 8, damage: e.damage * 0.5, type: 'fast', color: '#a78bfa' });
            }
          } else if (e.type === 'boss') {
            e.x += Math.cos(angle) * e.speed;
            e.y += Math.sin(angle) * e.speed;
            
            if (e.buffs) {
              if (e.buffs.includes('sniper') && s.frameCount % 90 === 0) {
                const shots = e.buffs.includes('multishot') ? 3 : 1;
                for (let k = 0; k < shots; k++) {
                  const offset = (k - (shots - 1) / 2) * 0.2;
                  projectiles.push({ x: e.x, y: e.y, vx: Math.cos(angle + offset) * 8, vy: Math.sin(angle + offset) * 8, damage: e.damage, life: 150, pierce: 0, hit: new Set(), radius: 8, bounce: 0, type: 'enemy_bullet' });
                }
              }
              if (e.buffs.includes('summoner') && s.frameCount % 180 === 0 && enemies.length < 400) {
                for (let k = 0; k < 3; k++) {
                  const spawnAngle = Math.random() * Math.PI * 2;
                let spawnHp = e.maxHp * 0.1;
                let spawnSpeed = e.speed * 1.5;
                if (s.hardcoreMode) {
                  spawnHp *= 5;
                  spawnSpeed *= 1.5;
                }
                enemies.push({ x: e.x + Math.cos(spawnAngle) * 50, y: e.y + Math.sin(spawnAngle) * 50, hp: spawnHp, maxHp: spawnHp, speed: spawnSpeed, radius: 10, damage: e.damage * 0.5, type: 'fast', color: '#ffb400' });
                }
              }
            }
          } else {
            e.x += Math.cos(angle) * e.speed;
            e.y += Math.sin(angle) * e.speed;
          }
        }
        
        if (e.bleed > 0) {
          e.bleed--;
          if (s.frameCount % 30 === 0) {
            e.hp -= 5;
            s.damageTexts.push({
              x: e.x + (Math.random() - 0.5) * 20,
              y: e.y - e.radius - 10 + (Math.random() - 0.5) * 20,
              text: '5',
              life: 30,
              color: '#ef4444'
            });
            if (e.hp <= 0) {
              if (e.isBoss) {
                for (let k = 0; k < 30; k++) {
                  gems.push({ x: e.x + (Math.random() - 0.5) * 80, y: e.y + (Math.random() - 0.5) * 80, value: e.maxHp / 10, radius: 10, color: '#ffd700' });
                }
              } else {
                gems.push({ x: e.x, y: e.y, value: e.maxHp, radius: 4 });
              }
              enemies.splice(i, 1);
              s.score += e.maxHp;
              continue;
            }
          }
        }
        
        const wasInBlackhole = e.inBlackhole;
        e.inBlackhole = false;

        if (!wasInBlackhole && player.invuln <= 0 && Math.hypot(e.x - player.x, e.y - player.y) < e.radius + player.radius) {
          const dmgTaken = Math.max(1, e.damage - stats.armor);
          player.hp -= dmgTaken;
          player.invuln = 30;
          if (e.buffs && e.buffs.includes('vampire')) {
            e.hp = Math.min(e.maxHp, e.hp + dmgTaken * 5);
          }
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

      // Regen
      if (s.frameCount % 60 === 0 && stats.regen > 0) {
        player.hp = Math.min(player.maxHp, player.hp + stats.regen);
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
              let availableIds = ['dmg', 'rate', 'speed', 'hp', 'pierce', 'multi', 'magnet', 'regen', 'armor', 'cooldown', 'luck'];
              
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
              if (s.weapons.includes('chainsaw')) availableIds.push('armor');
              if (s.weapons.includes('yoyo')) availableIds.push('speed');
              if (s.weapons.includes('mace')) availableIds.push('knockback');
              if (s.weapons.includes('knife')) availableIds.push('rate');
              if (s.weapons.includes('axe')) availableIds.push('dmg');
              if (s.weapons.includes('plasma_rifle')) availableIds.push('cooldown');
              
              if (s.weapons.includes('drone')) availableIds.push('speed');
              if (s.weapons.includes('mine')) availableIds.push('multi');
              if (s.weapons.includes('satellite')) availableIds.push('dmg');
              if (s.weapons.includes('missile')) availableIds.push('multi');
              if (s.weapons.includes('chakram')) availableIds.push('speed');
              if (s.weapons.includes('icicle')) availableIds.push('pierce');
              if (s.weapons.includes('blackhole')) availableIds.push('magnet');
              if (s.weapons.includes('turret')) availableIds.push('cooldown');
              if (s.weapons.includes('barrier')) availableIds.push('regen');
              
              availableIds = Array.from(new Set(availableIds));

              // Filter out banned upgrades
              availableIds = availableIds.filter(id => !s.bannedUpgrades.includes(id));

              // Add unowned weapons to the pool
              const unownedMainWeapons = Object.keys(WEAPONS).filter(w => !s.weapons.includes(w) && !(WEAPONS[w as keyof typeof WEAPONS] as any).isSubOnly);
              const unownedSubWeapons = Object.keys(WEAPONS).filter(w => !s.weapons.includes(w) && (WEAPONS[w as keyof typeof WEAPONS] as any).isSubOnly);
              
              const subWeaponCount = s.weapons.filter(w => (WEAPONS[w as keyof typeof WEAPONS] as any).isSubOnly).length;
              
              if (subWeaponCount < 8) {
                for (const w of unownedSubWeapons) {
                  availableIds.push(w);
                  availableIds.push(w); // Increase chance
                }
              }

              if (player.level % 100 === 0) {
                for (const w of unownedMainWeapons) {
                  // Increase chance significantly so they appear
                  for (let i = 0; i < 20; i++) availableIds.push(w);
                }
              }

              // Add unique upgrades
              for (const w of s.weapons) {
                const uniques = (WEAPONS[w as keyof typeof WEAPONS] as any).uniques;
                if (uniques) {
                  for (const uniqueId of uniques) {
                    // Allow leveling up unique upgrades
                    availableIds.push(uniqueId);
                    availableIds.push(uniqueId); // Increase chance
                  }
                }
              }

              // Add special evolutions
              for (const [evoId, evo] of Object.entries(SPECIAL_EVOLUTIONS)) {
                if (evo.req.every(reqId => s.weapons.includes(reqId))) {
                  let totalUniqueLevel = 0;
                  for (const reqId of evo.req) {
                    const uniques = (WEAPONS[reqId as keyof typeof WEAPONS] as any).uniques;
                    if (uniques) {
                      for (const u of uniques) {
                        totalUniqueLevel += (s.upgradeLevels[u] || 0);
                      }
                    }
                  }
                  if (totalUniqueLevel >= 10) {
                    availableIds.push(evoId);
                    availableIds.push(evoId);
                    availableIds.push(evoId); // High chance
                  }
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

      ctx.imageSmoothingEnabled = false;

      // Handle pixel mode resize on toggle
      if (uiStateRef.current.pixelMode && canvas.width === window.innerWidth) {
        resize();
      } else if (!uiStateRef.current.pixelMode && canvas.width !== window.innerWidth) {
        resize();
      }

      // Background
      const stage = Math.floor(s.time / 180) + 1;
      let bgColors = ['#0f172a', '#1e1b4b', '#064e3b', '#451a03', '#2e1065', '#450a0a', '#000000'];
      let gridColors = ['#1e293b', '#312e81', '#065f46', '#78350f', '#4c1d95', '#7f1d1d', '#1c1917'];
      
      if (s.stageId === 'slime') { bgColors = ['#064e3b']; gridColors = ['#065f46']; }
      if (s.stageId === 'bullet') { bgColors = ['#082f49']; gridColors = ['#0c4a6e']; }
      if (s.stageId === 'giant') { bgColors = ['#3b0764']; gridColors = ['#581c87']; }
      if (s.stageId === 'abyss') { bgColors = ['#450a0a', '#000000']; gridColors = ['#7f1d1d', '#1c1917']; }

      ctx.fillStyle = bgColors[Math.min(stage - 1, bgColors.length - 1)];
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      
      let scale = 1;
      if (uiStateRef.current.pixelMode) {
        scale = 0.25;
      }
      
      ctx.translate(canvas.width / 2, canvas.height / 2);
      if (uiStateRef.current.pixelMode) {
        ctx.scale(scale, scale);
      }
      ctx.translate(-player.x, -player.y);

      // Grid (Neon style)
      ctx.strokeStyle = gridColors[(stage - 1) % gridColors.length];
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
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
      ctx.globalAlpha = 1.0;

      // Gems
      for (const g of gems) {
        let gSprite = spriteCache.current.gem_blue;
        if (g.value >= 50) gSprite = spriteCache.current.gem_red;
        else if (g.value >= 10) gSprite = spriteCache.current.gem_yellow;
        else if (g.value >= 5) gSprite = spriteCache.current.gem_green;

        if (gSprite) {
          const bounce = Math.sin(s.frameCount * 0.1 + g.x) * 2;
          ctx.drawImage(gSprite, g.x - gSprite.width / 2, g.y - gSprite.height / 2 + bounce);
        } else {
          const color = g.color || '#38bdf8';
          ctx.fillStyle = color;
          ctx.fillRect(g.x - g.radius, g.y - g.radius, g.radius * 2, g.radius * 2);
        }
      }

      // Enemies
      for (const e of enemies) {
        ctx.save();
        ctx.translate(e.x, e.y);
        
        let sprite = spriteCache.current.slime;
        if (e.type === 'fast') sprite = spriteCache.current.bat;
        else if (e.type === 'tank' || e.type === 'charger') sprite = spriteCache.current.skeleton;
        else if (e.type === 'summoner' || e.type === 'necromancer' || e.type === 'shooter') sprite = spriteCache.current.ghost;
        else if (e.isBoss) sprite = spriteCache.current.boss;

        if (sprite) {
          if (e.x < player.x) {
            ctx.scale(-1, 1);
          }
          const bounce = Math.sin(s.frameCount * 0.1 + e.x) * 2;
          ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2 + bounce);
          
          if (e.isBoss) {
            // HP Bar
            ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
            ctx.fillRect(-30, -e.radius - 20, 60, 6);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(-30, -e.radius - 20, 60 * (e.hp / e.maxHp), 6);
            
            if (e.buffs && e.buffs.length > 0) {
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 10px "Inter", sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText(e.buffs.join(' '), 0, -e.radius - 25);
            }
          }
        } else {
          // Fallback to original drawing if sprite is missing
          ctx.fillStyle = e.color;

          if (e.isBoss) {
            const pulse = Math.sin(s.frameCount * 0.1) * 5;
            const r = e.radius + pulse;
            
            ctx.rotate(s.frameCount * 0.02);
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
              ctx.lineTo(Math.cos(i * Math.PI / 4) * r, Math.sin(i * Math.PI / 4) * r);
            }
            ctx.closePath();
            ctx.fill();
            
            ctx.rotate(-s.frameCount * 0.02);
            
            // HP Bar
            ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
            ctx.fillRect(-30, -e.radius - 20, 60, 6);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(-30, -e.radius - 20, 60 * (e.hp / e.maxHp), 6);
            
            if (e.buffs && e.buffs.length > 0) {
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 10px "Inter", sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText(e.buffs.join(' '), 0, -e.radius - 25);
            }
          } else {
            if (e.type === 'fast') {
              const angle = Math.atan2(player.y - e.y, player.x - e.x);
              ctx.rotate(angle);
              ctx.beginPath();
              ctx.moveTo(e.radius * 1.5, 0);
              ctx.lineTo(-e.radius, e.radius);
              ctx.lineTo(-e.radius * 0.5, 0);
              ctx.lineTo(-e.radius, -e.radius);
              ctx.closePath();
              ctx.fill();
            } else if (e.type === 'tank') {
              ctx.beginPath();
              ctx.rect(-e.radius, -e.radius, e.radius * 2, e.radius * 2);
              ctx.fill();
            } else if (e.type === 'shooter') {
              const angle = Math.atan2(player.y - e.y, player.x - e.x);
              ctx.rotate(angle);
              ctx.beginPath();
              ctx.moveTo(e.radius * 1.2, 0);
              ctx.lineTo(0, e.radius * 0.8);
              ctx.lineTo(-e.radius * 0.8, 0);
              ctx.lineTo(0, -e.radius * 0.8);
              ctx.closePath();
              ctx.fill();
            } else if (e.type === 'charger') {
              const angle = e.chargeTimer && e.chargeTimer > 0 ? e.chargeAngle : Math.atan2(player.y - e.y, player.x - e.x);
              ctx.rotate(angle);
              ctx.beginPath();
              ctx.moveTo(e.radius * 1.5, 0);
              ctx.lineTo(-e.radius, -e.radius);
              ctx.lineTo(-e.radius * 0.2, 0);
              ctx.lineTo(-e.radius, e.radius);
              ctx.closePath();
              ctx.fill();
            } else if (e.type === 'summoner') {
              ctx.rotate(s.frameCount * 0.05);
              ctx.beginPath();
              for (let i = 0; i < 5; i++) {
                ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * e.radius, -Math.sin((18 + i * 72) / 180 * Math.PI) * e.radius);
                ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * (e.radius / 2), -Math.sin((54 + i * 72) / 180 * Math.PI) * (e.radius / 2));
              }
              ctx.closePath();
              ctx.fill();
            } else if (e.type === 'jumper') {
              const angle = Math.atan2(player.y - e.y, player.x - e.x);
              ctx.rotate(angle);
              ctx.beginPath();
              ctx.moveTo(e.radius, 0);
              ctx.lineTo(-e.radius, -e.radius * 0.8);
              ctx.lineTo(-e.radius * 0.5, 0);
              ctx.lineTo(-e.radius, e.radius * 0.8);
              ctx.closePath();
              ctx.fill();
            } else if (e.type === 'necromancer') {
              ctx.beginPath();
              ctx.arc(0, 0, e.radius, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#a78bfa';
              ctx.beginPath();
              ctx.arc(0, 0, e.radius * 0.5, 0, Math.PI * 2);
              ctx.fill();
              // Floating orbs
              const orbAngle = s.frameCount * 0.05;
              ctx.fillStyle = '#c084fc';
              ctx.beginPath();
              ctx.arc(Math.cos(orbAngle) * e.radius * 1.5, Math.sin(orbAngle) * e.radius * 1.5, 4, 0, Math.PI * 2);
              ctx.fill();
              ctx.beginPath();
              ctx.arc(Math.cos(orbAngle + Math.PI) * e.radius * 1.5, Math.sin(orbAngle + Math.PI) * e.radius * 1.5, 4, 0, Math.PI * 2);
              ctx.fill();
            } else {
              // Standard
              const angle = Math.atan2(player.y - e.y, player.x - e.x);
              ctx.rotate(angle);
              ctx.beginPath();
              for (let i = 0; i < 6; i++) {
                ctx.lineTo(Math.cos(i * Math.PI / 3) * e.radius, Math.sin(i * Math.PI / 3) * e.radius);
              }
              ctx.closePath();
              ctx.fill();
            }
          }
        }
        ctx.restore();
      }

      // Projectiles
      for (const p of projectiles) {
        if (p.delay && p.delay > 0) continue;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        const angle = p.angle !== undefined ? p.angle : Math.atan2(p.vy, p.vx);
        ctx.rotate(angle);

        let sprite = null;
        if (p.type === 'sword') sprite = spriteCache.current.sword;
        else if (p.type === 'fireball') sprite = spriteCache.current.fireball;
        else if (p.type === 'knife') sprite = spriteCache.current.knife;
        else if (p.type === 'axe') sprite = spriteCache.current.axe;
        else if (p.type === 'holy_cross') sprite = spriteCache.current.cross;

        if (sprite) {
          if (p.type === 'axe') ctx.rotate(s.frameCount * 0.3);
          ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
        } else {
          // Fallback to original drawing
          if (p.type === 'sword_wave') {
            ctx.fillStyle = '#7dd3fc';
            ctx.beginPath();
            ctx.ellipse(0, 0, p.radius, p.radius / 3, 0, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'spear') {
            // Shaft
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = p.radius * 0.4;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(-Math.hypot(p.x - player.x, p.y - player.y), 0);
            ctx.lineTo(0, 0);
            ctx.stroke();
            // Spear tip
            ctx.fillStyle = '#cbd5e1';
            ctx.beginPath();
            ctx.moveTo(p.radius * 1.5, 0);
            ctx.lineTo(-p.radius * 0.5, p.radius * 0.6);
            ctx.lineTo(-p.radius * 0.5, -p.radius * 0.6);
            ctx.closePath();
            ctx.fill();
          } else if (p.type === 'thrown_spear') {
            // Shaft
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = p.radius * 0.4;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(-p.radius * 3, 0);
            ctx.lineTo(0, 0);
            ctx.stroke();
            // Spear tip
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.moveTo(p.radius * 1.5, 0);
            ctx.lineTo(-p.radius * 0.5, p.radius * 0.6);
            ctx.lineTo(-p.radius * 0.5, -p.radius * 0.6);
            ctx.closePath();
            ctx.fill();
          } else if (p.type === 'laser' || p.type === 'quasar_laser' || p.type === 'laser_refract_beam' || p.type === 'drone_laser') {
            let color = '#38bdf8';
            if (p.type === 'quasar_laser') color = '#fde047';
            else if (p.type === 'laser_refract_beam') color = '#a78bfa';
            else if (p.type === 'drone_laser') color = '#eab308';
            
            ctx.strokeStyle = color;
            ctx.globalAlpha = p.life / 10;
            ctx.lineWidth = p.radius * 2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(p.distance!, 0);
            ctx.stroke();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = p.radius;
            ctx.stroke();
          } else if (p.type === 'laser_orbital') {
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = p.radius * 2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(p.distance!, 0);
            ctx.stroke();
          } else if (p.type === 'magicwand') {
            // Wand stick
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = p.radius * 0.4;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(-p.radius * 1.5, 0);
            ctx.lineTo(p.radius * 0.5, 0);
            ctx.stroke();
            // Star at tip
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
              ctx.lineTo(p.radius * 0.5 + Math.cos(i * Math.PI * 0.4) * p.radius, Math.sin(i * Math.PI * 0.4) * p.radius);
              ctx.lineTo(p.radius * 0.5 + Math.cos(i * Math.PI * 0.4 + Math.PI * 0.2) * p.radius * 0.4, Math.sin(i * Math.PI * 0.4 + Math.PI * 0.2) * p.radius * 0.4);
            }
            ctx.closePath();
            ctx.fill();
          } else if (p.type === 'shuriken' || p.type === 'shuriken_orbit') {
            ctx.fillStyle = p.type === 'shuriken' ? '#94a3b8' : '#f472b6';
            ctx.rotate(s.frameCount * 0.5);
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
              ctx.lineTo(p.radius, 0);
              ctx.lineTo(p.radius * 0.2, p.radius * 0.2);
              ctx.rotate(Math.PI / 2);
            }
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#334155';
            ctx.beginPath();
            ctx.arc(0, 0, p.radius * 0.2, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'death_vortex') {
            ctx.strokeStyle = '#a855f7';
            ctx.globalAlpha = Math.min(1, p.life / 60);
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.arc(0, 0, p.radius * 0.8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
          } else if (p.type === 'chainsaw') {
            ctx.fillStyle = '#94a3b8';
            ctx.beginPath();
            ctx.roundRect(0, -p.radius/2, p.distance!, p.radius, p.radius/2);
            ctx.fill();
            // Chainsaw teeth
            ctx.fillStyle = '#334155';
            const teethCount = Math.floor(p.distance! / 10);
            const offset = (s.frameCount * 5) % 10;
            for(let i=0; i<teethCount; i++) {
              ctx.beginPath();
              ctx.moveTo(i * 10 + offset, -p.radius/2);
              ctx.lineTo(i * 10 + offset + 4, -p.radius/2 - 4);
              ctx.lineTo(i * 10 + offset + 8, -p.radius/2);
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(i * 10 + offset, p.radius/2);
              ctx.lineTo(i * 10 + offset + 4, p.radius/2 + 4);
              ctx.lineTo(i * 10 + offset + 8, p.radius/2);
              ctx.fill();
            }
          } else if (p.type === 'yoyo') {
            ctx.fillStyle = '#ec4899';
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#fbcfe8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius * 0.6, 0, Math.PI * 2);
            ctx.stroke();
            // String
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(player.x - p.x, player.y - p.y);
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1;
            ctx.stroke();
          } else if (p.type === 'mace') {
            ctx.fillStyle = '#78350f';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(player.x - p.x, player.y - p.y);
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#78350f';
            ctx.stroke();
            ctx.fillStyle = '#94a3b8';
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#cbd5e1';
            for(let i=0; i<8; i++) {
              const a = (i / 8) * Math.PI * 2;
              ctx.beginPath();
              ctx.arc(Math.cos(a) * p.radius, Math.sin(a) * p.radius, 4, 0, Math.PI * 2);
              ctx.fill();
            }
          } else if (p.type === 'plasma_rifle') {
            ctx.fillStyle = '#22d3ee';
            ctx.beginPath();
            ctx.ellipse(0, 0, p.radius * 2, p.radius, 0, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'turret') {
            // Base
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill();
            // Barrel
            ctx.fillStyle = '#334155';
            ctx.fillRect(0, -p.radius * 0.3, p.radius * 1.5, p.radius * 0.6);
          } else if (p.type === 'barrier') {
            ctx.strokeStyle = '#38bdf8';
            ctx.globalAlpha = 0.5;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.stroke();
          } else if (p.type === 'grenade' || p.type === 'cluster_bomb') {
            ctx.fillStyle = '#4d7c0f';
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill();
            // Pin
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(p.radius * 0.8, -p.radius * 0.8, p.radius * 0.3, 0, Math.PI * 2);
            ctx.stroke();
          } else if (p.type === 'mortar') {
            if (p.delay && p.delay > 0) {
              ctx.strokeStyle = '#ef4444';
              ctx.globalAlpha = 0.5;
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(-p.radius, 0);
              ctx.lineTo(p.radius, 0);
              ctx.moveTo(0, -p.radius);
              ctx.lineTo(0, p.radius);
              ctx.stroke();
            }
          } else if (p.type === 'c4') {
            ctx.fillStyle = '#b91c1c';
            ctx.fillRect(-p.radius, -p.radius * 0.6, p.radius * 2, p.radius * 1.2);
            // Wires
            ctx.strokeStyle = '#eab308';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-p.radius * 0.5, -p.radius * 0.6);
            ctx.lineTo(0, -p.radius * 0.8);
            ctx.lineTo(p.radius * 0.5, -p.radius * 0.6);
            ctx.stroke();
            if (s.frameCount % 10 < 5) {
              ctx.fillStyle = '#ef4444';
              ctx.beginPath();
              ctx.arc(0, 0, p.radius * 0.3, 0, Math.PI * 2);
              ctx.fill();
            }
          } else if (p.type === 'slime') {
            ctx.fillStyle = '#4ade80';
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.radius, p.radius * 0.8, 0, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'skeleton') {
            // Skull
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.arc(0, -p.radius * 0.5, p.radius * 0.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(-p.radius * 0.4, 0, p.radius * 0.8, p.radius);
            // Eyes
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(-p.radius * 0.3, -p.radius * 0.5, p.radius * 0.2, 0, Math.PI * 2);
            ctx.arc(p.radius * 0.3, -p.radius * 0.5, p.radius * 0.2, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'bat') {
            ctx.fillStyle = '#334155';
            ctx.beginPath();
            // Body
            ctx.ellipse(0, 0, p.radius * 0.4, p.radius * 0.8, 0, 0, Math.PI * 2);
            ctx.fill();
            // Wings
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(p.radius, -p.radius, p.radius * 1.5, -p.radius * 0.5);
            ctx.quadraticCurveTo(p.radius, 0, 0, p.radius * 0.5);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(-p.radius, -p.radius, -p.radius * 1.5, -p.radius * 0.5);
            ctx.quadraticCurveTo(-p.radius, 0, 0, p.radius * 0.5);
            ctx.fill();
          } else if (p.type === 'ghost') {
            ctx.fillStyle = '#f1f5f9';
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, Math.PI, 0);
            ctx.lineTo(p.radius, p.radius);
            ctx.lineTo(p.radius * 0.5, p.radius * 0.8);
            ctx.lineTo(0, p.radius);
            ctx.lineTo(-p.radius * 0.5, p.radius * 0.8);
            ctx.lineTo(-p.radius, p.radius);
            ctx.fill();
            // Eyes
            ctx.fillStyle = '#0f172a';
            ctx.globalAlpha = 1.0;
            ctx.beginPath();
            ctx.arc(-p.radius * 0.3, -p.radius * 0.2, p.radius * 0.15, 0, Math.PI * 2);
            ctx.arc(p.radius * 0.3, -p.radius * 0.2, p.radius * 0.15, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'smite') {
            ctx.fillStyle = '#fde047';
            ctx.globalAlpha = 0.8;
            ctx.fillRect(-p.radius, -500, p.radius*2, 500);
          } else if (p.type === 'holy_water_bottle') {
            // Bottle body
            ctx.fillStyle = '#0ea5e9';
            ctx.beginPath();
            ctx.moveTo(-p.radius * 0.4, -p.radius * 0.5);
            ctx.lineTo(p.radius * 0.4, -p.radius * 0.5);
            ctx.lineTo(p.radius * 0.6, p.radius);
            ctx.lineTo(-p.radius * 0.6, p.radius);
            ctx.closePath();
            ctx.fill();
            // Cork
            ctx.fillStyle = '#d97706';
            ctx.fillRect(-p.radius * 0.2, -p.radius * 0.8, p.radius * 0.4, p.radius * 0.3);
          } else if (p.type === 'holy_water_pool') {
            ctx.fillStyle = '#38bdf8';
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'bible') {
            // Cover
            ctx.fillStyle = '#7e22ce';
            ctx.beginPath();
            ctx.roundRect(-p.radius, -p.radius * 0.6, p.radius * 2, p.radius * 1.2, 4);
            ctx.fill();
            // Pages
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(p.radius * 0.8, -p.radius * 0.5, p.radius * 0.2, p.radius);
            // Cross on cover
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(-p.radius * 0.2, -p.radius * 0.4, p.radius * 0.4, p.radius * 0.8);
            ctx.fillRect(-p.radius * 0.4, -p.radius * 0.2, p.radius * 0.8, p.radius * 0.4);
          } else if (p.type === 'enemy_bullet') {
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fca5a5';
            ctx.beginPath();
            ctx.arc(-p.radius * 0.2, -p.radius * 0.2, p.radius * 0.3, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'aura') {
            ctx.fillStyle = '#facc15';
            ctx.globalAlpha = 0.2;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 0.5;
            ctx.lineWidth = 2;
            ctx.stroke();
          } else if (p.type === 'lightning') {
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = p.radius;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(0, -100);
            ctx.lineTo(0, 100);
            ctx.stroke();
          } else if (p.type === 'scythe') {
            ctx.rotate(s.frameCount * 0.2);
            // Handle
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = p.radius * 0.2;
            ctx.beginPath();
            ctx.moveTo(0, -p.radius);
            ctx.lineTo(0, p.radius);
            ctx.stroke();
            // Blade
            ctx.fillStyle = '#cbd5e1';
            ctx.beginPath();
            ctx.moveTo(0, -p.radius * 0.8);
            ctx.quadraticCurveTo(p.radius * 1.5, -p.radius, p.radius * 1.5, p.radius * 0.5);
            ctx.quadraticCurveTo(p.radius * 0.8, -p.radius * 0.2, 0, -p.radius * 0.4);
            ctx.fill();
          } else if (p.type === 'boomerang' || p.type === 'boomerang_orbit') {
            ctx.fillStyle = '#b45309';
            ctx.rotate(s.frameCount * 0.4);
            ctx.beginPath();
            ctx.moveTo(p.radius, 0);
            ctx.quadraticCurveTo(0, -p.radius * 0.5, -p.radius, 0);
            ctx.quadraticCurveTo(0, -p.radius * 0.8, p.radius, 0);
            ctx.fill();
          } else if (p.type === 'explosion') {
            let color = '#ef4444';
            if (p.source === 'mine') color = '#ef4444';
            else if (p.source === 'blackhole') color = '#a855f7';
            ctx.fillStyle = color;
            ctx.globalAlpha = p.life / 15;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'blackhole') {
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#a855f7';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius + Math.sin(s.frameCount * 0.1) * 5, 0, Math.PI * 2);
            ctx.stroke();
          } else if (p.type === 'rocket') {
            // Body
            ctx.fillStyle = '#e2e8f0';
            ctx.beginPath();
            ctx.moveTo(p.radius * 2, 0);
            ctx.lineTo(-p.radius, p.radius * 0.5);
            ctx.lineTo(-p.radius, -p.radius * 0.5);
            ctx.closePath();
            ctx.fill();
            // Nose cone
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(p.radius * 2, 0);
            ctx.lineTo(p.radius, p.radius * 0.25);
            ctx.lineTo(p.radius, -p.radius * 0.25);
            ctx.closePath();
            ctx.fill();
            // Fins
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(-p.radius, p.radius * 0.5);
            ctx.lineTo(-p.radius * 1.5, p.radius);
            ctx.lineTo(-p.radius * 0.5, p.radius * 0.5);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-p.radius, -p.radius * 0.5);
            ctx.lineTo(-p.radius * 1.5, -p.radius);
            ctx.lineTo(-p.radius * 0.5, -p.radius * 0.5);
            ctx.fill();
          } else if (p.type === 'flame' || p.type === 'fire_wall') {
            const isBlue = s.upgradeLevels['flamethrower_blue'];
            ctx.fillStyle = isBlue ? '#38bdf8' : '#f97316';
            ctx.globalAlpha = p.type === 'flame' ? p.life / 20 : Math.min(1, p.life / 60) * 0.5;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'whip') {
            ctx.strokeStyle = '#a855f7';
            ctx.globalAlpha = p.life / 10;
            ctx.lineWidth = p.radius;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(p.distance!/2, Math.sin(s.frameCount * 0.5) * 50, p.distance!, 0);
            ctx.stroke();
          } else if (p.type === 'arrow' || p.type === 'icicle_shard') {
            ctx.fillStyle = p.type === 'arrow' ? '#cbd5e1' : '#7dd3fc';
            ctx.beginPath();
            ctx.moveTo(p.radius * 2, 0);
            ctx.lineTo(-p.radius, p.radius * 0.5);
            ctx.lineTo(-p.radius, -p.radius * 0.5);
            ctx.closePath();
            ctx.fill();
          } else if (p.type === 'poison_flask') {
            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            ctx.moveTo(-p.radius * 0.4, -p.radius * 0.5);
            ctx.lineTo(p.radius * 0.4, -p.radius * 0.5);
            ctx.lineTo(p.radius * 0.8, p.radius);
            ctx.lineTo(-p.radius * 0.8, p.radius);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#d97706';
            ctx.fillRect(-p.radius * 0.2, -p.radius * 0.8, p.radius * 0.4, p.radius * 0.3);
          } else if (p.type === 'poison_pool') {
            ctx.fillStyle = '#4ade80';
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'drone_shot') {
            ctx.fillStyle = '#3b82f6';
            ctx.beginPath();
            ctx.ellipse(0, 0, p.radius, p.radius * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'satellite') {
            ctx.rotate(s.frameCount * 0.1);
            ctx.fillStyle = '#94a3b8';
            ctx.beginPath();
            ctx.arc(0, 0, p.radius * 0.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(-p.radius, -p.radius * 0.2, p.radius * 0.4, p.radius * 0.4);
            ctx.fillRect(p.radius * 0.6, -p.radius * 0.2, p.radius * 0.4, p.radius * 0.4);
          } else if (p.type === 'missile') {
            ctx.fillStyle = '#cbd5e1';
            ctx.beginPath();
            ctx.moveTo(p.radius * 1.5, 0);
            ctx.lineTo(-p.radius, p.radius * 0.5);
            ctx.lineTo(-p.radius, -p.radius * 0.5);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(p.radius * 1.5, 0);
            ctx.lineTo(p.radius * 0.8, p.radius * 0.2);
            ctx.lineTo(p.radius * 0.8, -p.radius * 0.2);
            ctx.closePath();
            ctx.fill();
          } else if (p.type === 'chakram') {
            ctx.rotate(s.frameCount * 0.5);
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = p.radius * 0.4;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius * 0.8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = '#cbd5e1';
            for (let i = 0; i < 4; i++) {
              ctx.rotate(Math.PI / 2);
              ctx.beginPath();
              ctx.moveTo(p.radius * 0.8, -p.radius * 0.2);
              ctx.lineTo(p.radius * 1.2, 0);
              ctx.lineTo(p.radius * 0.8, p.radius * 0.2);
              ctx.fill();
            }
          } else {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        ctx.restore();
      }
      ctx.globalCompositeOperation = 'source-over';

      // Player
      ctx.save();
      ctx.translate(player.x, player.y);
      
      const pSprite = spriteCache.current.player;
      if (pSprite) {
        if (Math.cos(player.angle) < 0) {
          ctx.scale(-1, 1);
        }
        const isMoving = s.keys['w'] || s.keys['a'] || s.keys['s'] || s.keys['d'] || s.keys['arrowup'] || s.keys['arrowleft'] || s.keys['arrowdown'] || s.keys['arrowright'] || (s.joystick.active && (s.joystick.currentX !== s.joystick.originX || s.joystick.currentY !== s.joystick.originY));
        const bounce = isMoving ? Math.sin(s.frameCount * 0.2) * 2 : 0;
        ctx.drawImage(pSprite, -pSprite.width / 2, -pSprite.height / 2 + bounce);
      } else {
        // Player Outer Glow
        ctx.fillStyle = '#3b82f6';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(0, 0, player.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Player Ship Shape
        ctx.rotate(player.angle);
        
        ctx.fillStyle = '#38bdf8';
        
        ctx.beginPath();
        ctx.moveTo(player.radius * 1.2, 0);
        ctx.lineTo(-player.radius, player.radius * 0.8);
        ctx.lineTo(-player.radius * 0.5, 0);
        ctx.lineTo(-player.radius, -player.radius * 0.8);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();

      // Draw Clones
      if (s.clones && s.clones > 0) {
        for (let c = 1; c <= s.clones; c++) {
          const radius = 40 + Math.sqrt(c) * 30;
          const angleOffset = c * 2.39996 + s.frameCount * 0.05;
          const cx = player.x + Math.cos(angleOffset) * radius;
          const cy = player.y + Math.sin(angleOffset) * radius;
          ctx.save();
          ctx.translate(cx, cy);
          
          if (pSprite) {
            ctx.globalAlpha = 0.5;
            if (Math.cos(player.angle) < 0) {
              ctx.scale(-1, 1);
            }
            const isMoving = s.keys['w'] || s.keys['a'] || s.keys['s'] || s.keys['d'] || s.keys['arrowup'] || s.keys['arrowleft'] || s.keys['arrowdown'] || s.keys['arrowright'] || (s.joystick.active && (s.joystick.currentX !== s.joystick.originX || s.joystick.currentY !== s.joystick.originY));
            const bounce = isMoving ? Math.sin(s.frameCount * 0.2) * 2 : 0;
            ctx.drawImage(pSprite, -pSprite.width / 2, -pSprite.height / 2 + bounce);
          } else {
            ctx.rotate(player.angle);
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#a855f7';
            ctx.beginPath();
            ctx.moveTo(player.radius * 1.2, 0);
            ctx.lineTo(-player.radius, player.radius * 0.8);
            ctx.lineTo(-player.radius * 0.5, 0);
            ctx.lineTo(-player.radius, -player.radius * 0.8);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
        }
      }

      if (player.invuln > 0) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${player.invuln / 30})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius + 10, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Damage Texts
      if (uiState.showDamageNumbers && !uiState.lightweightMode) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (const dt of s.damageTexts) {
          const baseSize = 14 + (dt.life / 30) * 10;
          const fontSize = uiStateRef.current.pixelMode ? baseSize / 4 : baseSize;
          ctx.font = `900 ${fontSize}px 'Inter', sans-serif`;
          ctx.globalAlpha = dt.life / 30;
          
          // Glow effect
          
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = uiStateRef.current.pixelMode ? 1 : 3;
          ctx.strokeText(dt.text, dt.x, dt.y);
          
          ctx.fillStyle = dt.color;
          ctx.fillText(dt.text, dt.x, dt.y);
          
          // Reset shadow
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
        ctx.save();
        if (uiStateRef.current.pixelMode) {
          ctx.scale(0.25, 0.25);
        }

        const uiWidth = uiStateRef.current.pixelMode ? canvas.width * 4 : canvas.width;

        // HP Bar
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.beginPath();
        ctx.roundRect(20, 20, 200, 24, 12);
        ctx.fill();
        
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.roundRect(22, 22, Math.max(0, 196 * (player.hp / player.maxHp)), 20, 10);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(20, 20, 200, 24, 12);
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.ceil(player.hp)} / ${player.maxHp}`, 120, 32);

        // XP Bar
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.beginPath();
        ctx.roundRect(20, 54, uiWidth - 40, 12, 6);
        ctx.fill();
        
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.roundRect(22, 56, Math.max(0, (uiWidth - 44) * (player.xp / player.nextXp)), 8, 4);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(20, 54, uiWidth - 40, 12, 6);
        ctx.stroke();
        
        // Stats text
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 24px "Inter", sans-serif';
        ctx.fillText(`Lv. ${player.level}`, uiWidth - 20, 32);
        
        ctx.textAlign = 'center';
        const currentStage = Math.floor(s.time / 180) + 1;
        ctx.font = '900 20px "Inter", sans-serif';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(`STAGE ${currentStage}  -  ${Math.floor(s.time / 60)}:${(s.time % 60).toString().padStart(2, '0')}`, uiWidth / 2, 32);
        
        ctx.restore();
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
    <div className="relative w-full h-[100dvh] overflow-hidden bg-black font-sans select-none">
      <canvas ref={canvasRef} className={`absolute inset-0 block w-full h-full touch-none ${uiState.pixelMode ? '[image-rendering:pixelated]' : ''}`} />

      {/* Pause Button for Touch/Mouse */}
      {uiState.status === 'playing' && (
        <>
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

          {/* HUD Overlay for Acquired Items */}
          <div className="absolute top-20 left-4 flex flex-col gap-2 pointer-events-none z-30">
            {/* Weapons */}
            <div className="flex gap-1 flex-wrap max-w-[200px]">
              {state.current.weapons.map(w => {
                const info = getUpgradeInfo(w, 1, state.current.weapon);
                const Icon = info.icon;
                return (
                  <div key={w} className="bg-slate-800/80 border border-slate-600 p-1 rounded">
                    <Icon className={info.color} size={20} />
                  </div>
                );
              })}
            </div>
            {/* Upgrades */}
            <div className="flex gap-1 flex-wrap max-w-[200px]">
              {Object.entries(state.current.upgradeLevels).map(([id, level]) => {
                const info = getUpgradeInfo(id, level as number, state.current.weapon);
                const Icon = info.icon;
                return (
                  <div key={id} className="bg-slate-800/80 border border-slate-600 p-1 rounded relative">
                    <Icon className={info.color} size={20} />
                    <div className="absolute -bottom-1 -right-1 bg-black text-white text-[10px] font-bold px-1 rounded-sm">
                      {level as number}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Recipe Menu */}
      {uiState.status === 'recipe' && (
        <div className="absolute inset-0 flex flex-col items-center justify-start bg-black/90 backdrop-blur-sm z-50 overflow-y-auto py-10 px-4">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-8 tracking-tighter shrink-0 mt-10 md:mt-0">
            進化レシピ
          </h1>
          <button 
            onClick={() => setUiState(s => ({ ...s, status: 'menu' }))}
            className="mb-8 px-8 py-3 rounded-full bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors border border-slate-600"
          >
            ← 戻る
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl">
            {Object.entries(SPECIAL_EVOLUTIONS).filter(([id, evo]) => {
              const desc = typeof evo.desc === 'function' ? evo.desc(1) : evo.desc;
              return !desc.includes('隠し');
            }).map(([id, evo]) => {
              const Icon = evo.icon;
              return (
                <div key={id} className="p-4 rounded-xl border border-slate-700 bg-slate-800/50 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className={evo.color} size={24} />
                    <span className={`text-xl font-bold ${evo.color}`}>{evo.name}</span>
                  </div>
                  <div className="text-sm text-slate-300">
                    {typeof evo.desc === 'function' ? evo.desc(1) : evo.desc}
                  </div>
                  <div className="mt-auto pt-2 border-t border-slate-700 text-xs text-slate-400">
                    必要武器: {evo.req.map(r => WEAPONS[r as keyof typeof WEAPONS]?.name || r).join(' + ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Menu */}
      {uiState.status === 'menu' && (
        <div className="absolute inset-0 flex flex-col items-center justify-start bg-black/80 backdrop-blur-sm z-50 overflow-y-auto py-10">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-8 tracking-tighter shrink-0 mt-10 md:mt-0 text-center">
            ROGUE SURVIVOR
          </h1>
          
          <div className="mb-8 flex flex-wrap justify-center items-center gap-4 bg-slate-800/50 px-6 py-4 rounded-2xl border border-slate-700 max-w-4xl w-full mx-4">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="showDamage" 
                checked={uiState.showDamageNumbers}
                onChange={(e) => setUiState(s => ({ ...s, showDamageNumbers: e.target.checked }))}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
              />
              <label htmlFor="showDamage" className="text-white font-medium cursor-pointer select-none">
                ダメージ表示
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="lightweightMode" 
                checked={uiState.lightweightMode}
                onChange={(e) => setUiState(s => ({ ...s, lightweightMode: e.target.checked }))}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
              />
              <label htmlFor="lightweightMode" className="text-white font-medium cursor-pointer select-none">
                軽量化モード
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="pixelModeToggle"
                checked={uiState.pixelMode}
                onChange={(e) => setUiState(s => ({ ...s, pixelMode: e.target.checked }))}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
              />
              <label htmlFor="pixelModeToggle" className="text-white font-medium cursor-pointer select-none">
                ドット絵モード
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="superhotModeToggle"
                checked={uiState.superhotMode}
                onChange={(e) => setUiState(s => ({ ...s, superhotMode: e.target.checked }))}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
              />
              <label htmlFor="superhotModeToggle" className="text-white font-medium cursor-pointer select-none" title="自分が動いた時だけ時間が進むモード">
                スーパーホットモード
              </label>
            </div>
          </div>

          {uiState.cheatsUnlocked && (
            <div className="mb-8 p-4 bg-slate-800/80 border border-emerald-500/50 rounded-xl max-w-2xl w-full mx-4 text-sm">
              <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2"><Terminal size={16} /> コマンドリスト</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-slate-300">
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">godmode</code> 無敵</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">booststats</code> ステータス強化</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">summonboss</code> ボス召喚</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">nerfme</code> 弱体化</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">shadowclone</code> 分身召喚</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">nextstage</code> 次のステージ</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">superhot</code> 動く時だけ時間進行</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">pixelmode</code> ドット絵切替</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">resetgame</code> リセット</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">excalibur</code> 聖剣取得</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">gungnir</code> 槍取得</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">ragnarok</code> 魔法取得</div>
              </div>
            </div>
          )}

          {!uiState.selectedCategory ? (
            <>
              <div className="mb-8 flex flex-col items-center gap-4 bg-slate-800/50 px-6 py-4 rounded-2xl border border-slate-700 w-full max-w-4xl">
                <h2 className="text-xl font-bold text-white mb-2">難易度選択</h2>
                <div className="flex flex-wrap justify-center gap-4 mb-4">
                  {DIFFICULTIES.map(diff => (
                    <button 
                      key={diff.id}
                      onClick={() => setUiState(s => ({ ...s, difficulty: diff.id }))}
                      className={`px-4 py-3 rounded-xl transition-all flex flex-col items-center w-32 ${uiState.difficulty === diff.id ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                    >
                      <span className="font-bold mb-1">{diff.name}</span>
                      <span className="text-xs opacity-80 text-center">{diff.desc}</span>
                    </button>
                  ))}
                </div>

                <h2 className="text-xl font-bold text-white mb-2">ステージ選択</h2>
                <div className="flex flex-wrap justify-center gap-4">
                  {STAGES.map(stg => (
                    <button 
                      key={stg.id}
                      onClick={() => setUiState(s => ({ ...s, selectedStage: stg.id }))}
                      className={`px-4 py-3 rounded-xl transition-all flex flex-col items-center w-40 ${uiState.selectedStage === stg.id ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                    >
                      <span className="font-bold mb-1">{stg.name}</span>
                      <span className="text-xs opacity-80 text-center">{stg.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-6">武器の系統を選択</h2>
              <div className="flex flex-wrap justify-center gap-4 mb-12 max-w-5xl px-4 shrink-0">
                {Object.entries(WEAPON_CATEGORIES).filter(([key]) => key !== 'sub' && (key !== 'forbidden' || uiState.forbiddenUnlocked)).map(([key, cat]) => {
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
              <button 
                onClick={() => setUiState(s => ({ ...s, status: 'recipe' }))}
                className="mb-8 px-8 py-3 rounded-full bg-slate-800 text-white font-bold text-xl hover:bg-slate-700 transition-colors border border-slate-600"
              >
                進化レシピを見る
              </button>
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
        <div className="absolute inset-0 flex flex-col items-center justify-start md:justify-center bg-black/70 backdrop-blur-md z-50 overflow-y-auto py-10">
          <h2 className="text-4xl md:text-5xl font-black text-emerald-400 mb-2 drop-shadow-lg shrink-0 mt-10 md:mt-0">レベルアップ！</h2>
          <p className="text-lg md:text-xl text-white mb-6 font-medium shrink-0">レベル {uiState.level} に到達しました</p>
          
          <div className="bg-slate-800/80 border border-slate-600 p-4 rounded-xl mb-8 flex flex-wrap justify-center gap-x-4 gap-y-2 max-w-4xl text-xs md:text-sm shrink-0 mx-4">
            <div className="text-white"><span className="text-slate-400">HP:</span> {Math.ceil(state.current.player.hp)}/{state.current.player.maxHp}</div>
            <div className="text-white"><span className="text-slate-400">ダメージ:</span> {state.current.stats.damage.toFixed(1)}</div>
            <div className="text-white"><span className="text-slate-400">連射速度:</span> {state.current.stats.fireRate.toFixed(1)}</div>
            <div className="text-white"><span className="text-slate-400">弾速:</span> {state.current.stats.projSpeed.toFixed(1)}</div>
            <div className="text-white"><span className="text-slate-400">貫通:</span> {state.current.stats.pierce}</div>
            <div className="text-white"><span className="text-slate-400">発射数:</span> {state.current.stats.multiShot}</div>
            <div className="text-white"><span className="text-slate-400">クリティカル:</span> {(state.current.stats.crit * 100).toFixed(0)}%</div>
            <div className="text-white"><span className="text-slate-400">移動速度:</span> {state.current.player.speed.toFixed(1)}</div>
            <div className="text-white"><span className="text-slate-400">回収範囲:</span> {state.current.player.magnet.toFixed(0)}</div>
            <div className="text-white"><span className="text-slate-400">跳弾:</span> {state.current.stats.bounce}</div>
            <div className="text-white"><span className="text-slate-400">ノックバック:</span> {state.current.stats.knockback.toFixed(1)}</div>
            <div className="text-white"><span className="text-slate-400">HP回復:</span> {state.current.stats.regen.toFixed(1)}/s</div>
            <div className="text-white"><span className="text-slate-400">装甲:</span> {state.current.stats.armor.toFixed(1)}</div>
            <div className="text-white"><span className="text-slate-400">クールダウン:</span> {((1 - state.current.stats.cooldown) * 100).toFixed(0)}%短縮</div>
            <div className="text-white"><span className="text-slate-400">幸運:</span> {((state.current.stats.luck - 1) * 100).toFixed(0)}%</div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 shrink-0 mb-10 md:mb-0 px-4">
            {uiState.choices.map((choice, i) => {
              const Icon = choice.icon;
              return (
                <div key={i} className="flex flex-col gap-2">
                  <button
                    onClick={() => applyUpgrade(choice.id)}
                    className="group relative bg-slate-800 border-2 border-slate-600 hover:border-emerald-400 p-6 rounded-2xl w-64 text-left transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(16,185,129,0.3)] overflow-hidden flex-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Icon size={48} className={`mb-4 ${choice.color}`} />
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-between">
                      {choice.name}
                      <span className="text-emerald-400 text-lg">Lv.{choice.level}</span>
                    </h3>
                    <p className="text-slate-400 font-medium">{choice.desc}</p>
                  </button>
                  <button
                    onClick={() => {
                      state.current.bannedUpgrades.push(choice.id);
                      state.current.player.hp = Math.min(state.current.player.maxHp, state.current.player.hp + state.current.player.maxHp * 0.1);
                      state.current.status = 'playing';
                      setUiState(prev => ({ ...prev, status: 'playing', choices: [] }));
                    }}
                    className="bg-red-950/50 border border-red-900 hover:bg-red-900/50 text-red-400 p-2 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    title="このアイテムを今後出現させない (HP10%回復)"
                  >
                    <Ban size={16} />
                    <span className="text-sm font-bold">封印</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Game Over Overlay */}
      {uiState.status === 'gameover' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/80 backdrop-blur-md z-50">
          <h2 className="text-5xl md:text-7xl font-black text-red-500 mb-4 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">ゲームオーバー</h2>
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
        <div className="absolute inset-0 flex flex-col items-center justify-start bg-black/80 backdrop-blur-md z-50 overflow-y-auto py-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-widest mt-10">PAUSED</h2>
          
          {uiState.cheatsUnlocked && (
            <div className="mb-8 p-4 bg-slate-800/80 border border-emerald-500/50 rounded-xl max-w-2xl w-full mx-4 text-sm shrink-0">
              <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2"><Terminal size={16} /> コマンドリスト</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-slate-300">
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">godmode</code> 無敵</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">booststats</code> ステータス強化</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">summonboss</code> ボス召喚</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">nerfme</code> 弱体化</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">shadowclone</code> 分身召喚</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">nextstage</code> 次のステージ</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">superhot</code> 動く時だけ時間進行</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">pixelmode</code> ドット絵切替</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">resetgame</code> リセット</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">excalibur</code> 聖剣取得</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">gungnir</code> 槍取得</div>
                <div><code className="text-emerald-300 bg-black/50 px-1 rounded">ragnarok</code> 魔法取得</div>
              </div>
            </div>
          )}

          <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-600 w-full max-w-3xl flex flex-col shrink-0 mb-8 mx-4">
            <h3 className="text-2xl font-bold text-emerald-400 mb-4 border-b border-slate-600 pb-2 shrink-0">現在のステータス</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm md:text-base shrink-0">
              <div className="text-white"><span className="text-slate-400 block text-xs">HP</span>{Math.ceil(state.current.player.hp)} / {state.current.player.maxHp}</div>
              <div className="text-white"><span className="text-slate-400 block text-xs">ダメージ</span>{state.current.stats.damage.toFixed(1)}</div>
              <div className="text-white"><span className="text-slate-400 block text-xs">連射速度</span>{state.current.stats.fireRate.toFixed(1)}</div>
              <div className="text-white"><span className="text-slate-400 block text-xs">弾速</span>{state.current.stats.projSpeed.toFixed(1)}</div>
              <div className="text-white"><span className="text-slate-400 block text-xs">貫通</span>{state.current.stats.pierce}</div>
              <div className="text-white"><span className="text-slate-400 block text-xs">発射数</span>{state.current.stats.multiShot}</div>
              <div className="text-white"><span className="text-slate-400 block text-xs">クリティカル</span>{(state.current.stats.crit * 100).toFixed(0)}%</div>
              <div className="text-white"><span className="text-slate-400 block text-xs">移動速度</span>{state.current.player.speed.toFixed(1)}</div>
              <div className="text-white"><span className="text-slate-400 block text-xs">回収範囲</span>{state.current.player.magnet.toFixed(0)}</div>
              <div className="text-white"><span className="text-slate-400 block text-xs">跳弾</span>{state.current.stats.bounce}</div>
              <div className="text-white"><span className="text-slate-400 block text-xs">ノックバック</span>{state.current.stats.knockback.toFixed(1)}</div>
              <div className="text-white"><span className="text-slate-400 block text-xs">取得経験値ボーナス</span>{(state.current.stats.xpBonus * 100).toFixed(0)}%</div>
              <div className="text-white"><span className="text-slate-400 block text-xs">HP回復</span>{state.current.stats.regen.toFixed(1)}/s</div>
              <div className="text-white"><span className="text-slate-400 block text-xs">装甲</span>{state.current.stats.armor.toFixed(1)}</div>
              <div className="text-white"><span className="text-slate-400 block text-xs">クールダウン</span>{((1 - state.current.stats.cooldown) * 100).toFixed(0)}%短縮</div>
              <div className="text-white"><span className="text-slate-400 block text-xs">幸運</span>{((state.current.stats.luck - 1) * 100).toFixed(0)}%</div>
            </div>

            <h3 className="text-2xl font-bold text-emerald-400 mb-4 border-b border-slate-600 pb-2 shrink-0">現在の装備</h3>
            <div className="text-xl text-white mb-8 shrink-0">
              武器: <span className="font-bold text-emerald-300">{state.current.weapons.map(w => WEAPONS[w as keyof typeof WEAPONS].name).join(', ')}</span>
            </div>
            
            <h3 className="text-2xl font-bold text-emerald-400 mb-4 border-b border-slate-600 pb-2 shrink-0">取得アイテム</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1 min-h-0">
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
            className="mt-8 bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-4 rounded-full font-bold text-xl transition-transform hover:scale-105 active:scale-95 shrink-0"
          >
            ゲーム再開
          </button>
        </div>
      )}
    </div>
  );
}
