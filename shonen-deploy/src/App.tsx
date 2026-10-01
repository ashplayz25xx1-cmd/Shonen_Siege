import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { Link, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import {
  ArrowRight, ArrowUpRight, ChevronRight, CircleHelp, Crosshair, Gem, Hexagon, Home as HomeIcon,
  Layers3, LockKeyhole, Pause, Play, RotateCcw, Shield, Sparkles, Swords, Target, Trophy, Zap,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  CHARACTERS, DEFAULT_SAVE, RARITIES, rarityColor,
  type Character, type Enemy, type Pity, type Rarity, type Save, type Unit,
} from './game-data';

const queryClient = new QueryClient();
const SAVE_KEY = 'shonen-siege-save-v1';
const rarityThreshold: Record<Rarity, number> = { Common: 0, Rare: 10, Epic: 25, Legendary: 50, Mythic: 100 };
const rarityWeight: Record<Rarity, number> = { Common: 50, Rare: 30, Epic: 14, Legendary: 5, Mythic: 1 };

function loadSave(): Save {
  try {
    const saved = window.localStorage.getItem(SAVE_KEY);
    if (!saved) return DEFAULT_SAVE;
    const parsed = JSON.parse(saved) as Partial<Save>;
    return {
      ...DEFAULT_SAVE,
      ...parsed,
      pity: { ...DEFAULT_SAVE.pity, ...(parsed.pity ?? {}) },
      owned: Array.isArray(parsed.owned) ? parsed.owned : DEFAULT_SAVE.owned,
      squad: Array.isArray(parsed.squad) ? parsed.squad : DEFAULT_SAVE.squad,
    };
  } catch {
    return DEFAULT_SAVE;
  }
}

function saveGame(save: Save) {
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

function initials(name: string) {
  return name.replace(/[^A-Za-z0-9 ]/g, '').split(' ').map((part) => part[0]).join('').slice(0, 2);
}

function character(id: string) {
  return CHARACTERS.find((card) => card.id === id);
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return <div className="stat-line"><span>{label}</span><i style={{ '--stat': `${value}%`, '--hero-color': color } as CSSProperties} /></div>;
}

function HeroCard({ card, inSquad, onSelect, index }: { card: Character; inSquad: boolean; onSelect: () => void; index: number }) {
  return (
    <button className={`hero-card ${inSquad ? 'in-squad' : ''}`} style={{ animationDelay: `${index * 55}ms` }} onClick={onSelect} data-testid={`button-select-hero-${card.id}`} aria-pressed={inSquad}>
      <div className="hero-portrait" style={{ '--hero-color': card.color } as CSSProperties}>
        <span className="portrait-initial">{initials(card.name)}</span>
        <span className="rarity" style={{ color: rarityColor(card.rarity) }}>{card.rarity}</span>
      </div>
      <h4>{card.name}</h4>
      <p className="anime">{card.anime} / {card.abilities[0]}</p>
      <StatBar label="ATK" value={card.attack} color={card.color} />
      <StatBar label="HAX" value={card.hax} color={card.color} />
      <StatBar label="SPD" value={card.speed} color={card.color} />
    </button>
  );
}

function Shell({ save, children }: { save: Save; children: ReactNode }) {
  const [location] = useLocation();
  const links = [
    { href: '/', label: 'Command', icon: HomeIcon },
    { href: '/collection', label: 'Collection', icon: Layers3 },
    { href: '/summon', label: 'Summon Lab', icon: Sparkles },
    { href: '/infinite', label: 'Infinite Run', icon: Swords },
  ];
  return (
    <div className="app-shell">
      <aside className="rail">
        <div className="brand">
          <div className="brand-mark"><Hexagon size={23} strokeWidth={2.6} /></div>
          <div className="brand-name">SHONEN<span>SIEGE // COMMAND</span></div>
        </div>
        <div className="rail-label eyebrow">Operations</div>
        <nav className="nav-list" aria-label="Main navigation">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`nav-link ${location === href ? 'active' : ''}`} data-testid={`link-nav-${label.toLowerCase().replace(' ', '-')}`}>
              <Icon /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="rail-bottom">
          <div className="eyebrow muted">Session status</div>
          <div className="protocol eyebrow"><i /> LIVE / LOCAL SAVE</div>
        </div>
      </aside>
      <main className="content">
        <header className="topbar">
          <div className="mobile-brand eyebrow"><span className="cyan">S/S</span> COMMAND DECK</div>
          <div className="resource-bar">
            <div className="resource gems" data-testid="text-gems"><Gem size={16} /> <span>GEMS</span> {save.gems.toLocaleString()}</div>
            <div className="resource" data-testid="text-best-wave"><Trophy size={16} /> <span>BEST</span> W{save.waveBest}</div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

function Home({ save }: { save: Save }) {
  const [, navigate] = useLocation();
  const squad = save.squad.map(character).filter(Boolean) as Character[];
  return (
    <div className="page">
      <div className="page-heading">
        <div><div className="eyebrow orange">Command deck / 001</div><h1>Ready room</h1><p>Build the line. Break the limit. Your next record is waiting at the edge of the siege.</p></div>
      </div>
      <section className="hero">
        <div className="hero-main shine">
          <div className="hero-kicker eyebrow">Infinite battle protocol</div>
          <h2>The breach<br />starts <em>here.</em></h2>
          <p className="hero-copy">Every wave rewrites the rules. Deploy your chosen fighters, cash in pressure, and keep the core alive long enough to see what comes after impossible.</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => navigate('/infinite')} data-testid="button-launch-infinite"><Play size={17} fill="currentColor" /> Launch infinite</button>
            <button className="btn btn-outline" onClick={() => navigate('/collection')} data-testid="button-tune-squad">Tune squad <ArrowRight size={16} /></button>
          </div>
          <div className="hero-stamp eyebrow"><div><strong>∞</strong>WAVE<br />PROTOCOL</div></div>
        </div>
        <div className="launch-panel">
          <div><div className="eyebrow">Current operation</div><h3>Hold the line.</h3></div>
          <div className="launch-meta"><div><strong>W{String(save.waveBest + 1).padStart(2, '0')}</strong><small>NEXT THREAT</small></div><ArrowUpRight size={28} /></div>
        </div>
      </section>
      <div className="section-row"><h3>Signal report</h3><Link href="/infinite" data-testid="link-open-run-report">Open run report <ChevronRight size={14} /></Link></div>
      <section className="summary-grid">
        <div className="panel stat-card"><div className="stat-icon"><Trophy size={18} /></div><strong>W{save.waveBest}</strong><small>Best wave survived</small></div>
        <div className="panel stat-card accent"><div className="stat-icon"><Layers3 size={18} /></div><strong>{save.owned.length}<small> / {CHARACTERS.length}</small></strong><small>Heroes in archive</small></div>
        <div className="panel squad-strip"><div className="strip-label"><strong>Active squad</strong><small>{save.squad.length} / {save.unlockedSlots} slots online</small></div><div className="avatar-row">{squad.map((card) => <div key={card.id} className="mini-avatar" style={{ background: card.color }} title={card.name} data-testid={`avatar-squad-${card.id}`}>{initials(card.name)}</div>)}{Array.from({ length: Math.max(0, save.unlockedSlots - squad.length) }).map((_, i) => <div className="mini-avatar empty" key={`empty-${i}`}><Crosshair size={16} /></div>)}</div></div>
      </section>
      <div className="section-row"><h3>Operator notes</h3></div>
      <section className="panel operator-notes" style={{ padding: '20px 22px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          ['01', 'Spend with intent', 'Summon packs turn spare gems into new attack patterns. Your pity counters never reset between sessions.'],
          ['02', 'Place with purpose', 'A unit is only as sharp as its angle. Cover the full lane, then upgrade the fighter doing the most work.'],
          ['03', 'Chase the signal', 'Every five waves the pressure changes. A new best writes itself into the archive when the core falls.'],
        ].map(([number, title, text]) => <div key={number}><div className="eyebrow orange">{number}</div><h4 className="display" style={{ fontSize: 23, margin: '9px 0 6px' }}>{title}</h4><p className="muted" style={{ fontSize: 11, lineHeight: 1.5, margin: 0 }}>{text}</p></div>)}
      </section>
    </div>
  );
}

function Collection({ save, setSave, notify }: { save: Save; setSave: (save: Save) => void; notify: (message: string) => void }) {
  const [filter, setFilter] = useState<'All' | Rarity>('All');
  const ownedCards = CHARACTERS.filter((card) => save.owned.includes(card.id));
  const filtered = filter === 'All' ? ownedCards : ownedCards.filter((card) => card.rarity === filter);
  const toggleSquad = (id: string) => {
    if (save.squad.includes(id)) {
      setSave({ ...save, squad: save.squad.filter((squadId) => squadId !== id) });
      notify(`${character(id)?.name} removed from active squad`);
    } else if (save.squad.length < save.unlockedSlots) {
      setSave({ ...save, squad: [...save.squad, id] });
      notify(`${character(id)?.name} joined the line`);
    } else notify('Unlock another slot before adding another signal');
  };
  const unlockSlot = () => {
    const requirements = [{ wave: 5, gems: 250 }, { wave: 10, gems: 450 }, { wave: 18, gems: 800 }];
    const req = requirements[save.unlockedSlots - 3];
    if (!req) return;
    if (save.waveBest < req.wave) return notify(`Reach wave ${req.wave} to unlock this slot`);
    if (save.gems < req.gems) return notify(`Need ${req.gems} gems to unlock this slot`);
    setSave({ ...save, gems: save.gems - req.gems, unlockedSlots: save.unlockedSlots + 1 });
    notify('Squad slot unlocked');
  };
  return (
    <div className="page">
      <div className="page-heading"><div><div className="eyebrow orange">Archive / 002</div><h1>Collection</h1><p>Know the roster. Pick the pressure points. Your active squad is the only roster that enters the breach.</p></div><div className="eyebrow mono muted">{save.owned.length} / {CHARACTERS.length} archived</div></div>
      <div className="collection-layout">
        <section className="panel roster-panel">
          <div className="roster-tools"><div className="eyebrow muted">Owned fighters</div><div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>{(['All', ...RARITIES] as const).map((item) => <button key={item} className={`filter-chip ${filter === item ? 'selected' : ''}`} onClick={() => setFilter(item)} data-testid={`button-filter-${item.toLowerCase()}`}>{item}</button>)}</div></div>
          <div className="hero-grid">{filtered.map((card, index) => <HeroCard key={card.id} card={card} index={index} inSquad={save.squad.includes(card.id)} onSelect={() => toggleSquad(card.id)} />)}</div>
          {filtered.length === 0 && <div className="panel" style={{ padding: 30, textAlign: 'center' }}><CircleHelp size={28} className="orange" /><p className="muted">No fighters match this filter yet.</p></div>}
        </section>
        <aside className="panel squad-panel">
          <div className="eyebrow orange">Deployment roster</div><h3>Active squad</h3><p>Tap an owned fighter to rotate them into the line. Order sets your deployment hand.</p>
          <div className="squad-slots">{Array.from({ length: Math.max(6, save.unlockedSlots) }).map((_, index) => {
            const card = save.squad[index] ? character(save.squad[index]) : undefined;
            const locked = index >= save.unlockedSlots;
            return <div className={`squad-slot ${locked ? 'locked-slot' : ''}`} key={index}><span className="slot-num">0{index + 1}</span><div className={`slot-avatar ${card ? 'filled' : ''}`} style={card ? { '--hero-color': card.color } as CSSProperties : undefined}>{locked ? <LockKeyhole size={15} /> : card ? initials(card.name) : <Crosshair size={16} />}</div><div className="slot-info">{locked ? <><strong>Locked</strong><small>Expand command</small></> : card ? <><strong>{card.name}</strong><small>{card.rarity} / {card.cost} cash</small></> : <><strong>Open slot</strong><small>Select from archive</small></>}</div></div>;
          })}</div>
          {save.unlockedSlots < 6 && <><div className="lock-note"><LockKeyhole /><span>Next slot: wave {[5, 10, 18][save.unlockedSlots - 3] ?? 18} + {[250, 450, 800][save.unlockedSlots - 3] ?? 800} gems.</span></div><button className="btn btn-dark" style={{ width: '100%', marginTop: 13 }} onClick={unlockSlot} data-testid="button-unlock-slot"><LockKeyhole size={15} /> Unlock slot</button></>}
        </aside>
      </div>
    </div>
  );
}

function rollRarity(pity: Pity): Rarity {
  const guarantee = [...RARITIES].reverse().find((rarity) => rarityThreshold[rarity] > 0 && pity[rarity] + 1 >= rarityThreshold[rarity]);
  if (guarantee) return guarantee;
  const total = RARITIES.reduce((sum, rarity) => sum + rarityWeight[rarity], 0);
  let cursor = Math.random() * total;
  return RARITIES.find((rarity) => (cursor -= rarityWeight[rarity]) <= 0) ?? 'Common';
}

function makePack(pity: Pity) {
  const nextPity = { ...pity };
  const cards: Character[] = [];
  for (let index = 0; index < 5; index += 1) {
    const rarity = rollRarity(nextPity);
    const pool = CHARACTERS.filter((card) => card.rarity === rarity);
    cards.push(pool[Math.floor(Math.random() * pool.length)] ?? CHARACTERS[0]);
    RARITIES.forEach((item) => { nextPity[item] += 1; });
    nextPity[rarity] = 0;
  }
  return { cards, pity: nextPity };
}

function Summon({ save, setSave, notify }: { save: Save; setSave: (save: Save) => void; notify: (message: string) => void }) {
  const [pack, setPack] = useState<Character[] | null>(null);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [opening, setOpening] = useState(false);
  const openPack = () => {
    if (save.gems < 400 || opening) return;
    setOpening(true);
    window.setTimeout(() => {
      const result = makePack(save.pity);
      setPack(result.cards); setRevealed([]);
      setSave({ ...save, gems: save.gems - 400, pity: result.pity, owned: Array.from(new Set([...save.owned, ...result.cards.map((card) => card.id)])) });
      setOpening(false);
      notify('Pack secured. Reveal your signals.');
    }, 450);
  };
  const reveal = (index: number) => setRevealed((current) => current.includes(index) ? current : [...current, index]);
  return (
    <div className="page">
      <div className="page-heading"><div><div className="eyebrow orange">Acquisition / 003</div><h1>Summon lab</h1><p>Five signals per pack. Rarity is weighted, but the archive remembers every miss.</p></div><div className="resource gems"><Gem size={16} /> {save.gems.toLocaleString()} available</div></div>
      <div className="summon-layout">
        <section className="panel summon-stage shine">
          <div className="eyebrow cyan">Signal capsule // 05 cards</div><h2>Open<br />the gate.</h2><p>Each pack pulls five fighters from the live archive. Duplicate pulls strengthen your future choices; pity counters keep the ceiling honest.</p>
          <div className="pack-orbit" aria-label="Five card summon pack">{[0, 1, 2, 3, 4].map((item) => <div className="pack-card" key={item} style={{ '--rotate': `${(item - 2) * 8}deg`, '--offset': `${Math.abs(item - 2) * 7}px` } as CSSProperties}><Sparkles /><span>SS-{String(item + 1).padStart(2, '0')}</span></div>)}</div>
          <div className="summon-actions"><button className="btn btn-primary" onClick={openPack} disabled={save.gems < 400 || opening} data-testid="button-open-pack"><Gem size={16} /> {opening ? 'Calibrating...' : 'Open pack / 400'}</button><span className="eyebrow" style={{ alignSelf: 'center', color: 'hsl(39 38% 97% / .45)' }}>Guaranteed rare at 10</span></div>
          {pack && <div className="reveal-stage"><div className="reveal-heading"><div className="eyebrow orange">Pack recovered</div><button className="filter-chip" onClick={() => setRevealed([0, 1, 2, 3, 4])} data-testid="button-reveal-all">Reveal all</button></div><div className="reveal-grid">{pack.map((card, index) => <button key={`${card.id}-${index}`} className={`reveal-card ${revealed.includes(index) ? 'revealed' : ''}`} style={{ '--revealed-color': card.color } as CSSProperties} onClick={() => reveal(index)} data-testid={`button-reveal-card-${index}`}>{revealed.includes(index) ? <><div className="eyebrow" style={{ color: rarityColor(card.rarity) }}>{card.rarity}</div><strong>{card.name}</strong><small>{card.anime}</small></> : <span className="question">?</span>}</button>)}</div></div>}
        </section>
        <aside className="panel pity-panel"><div className="eyebrow orange">Archive memory</div><h3>Pity counters</h3>{(['Rare', 'Epic', 'Legendary', 'Mythic'] as Rarity[]).map((rarity) => <div className="pity-row" key={rarity}><div className="pity-head"><span style={{ color: rarityColor(rarity) }}>{rarity}</span><span>{save.pity[rarity]} / {rarityThreshold[rarity]}</span></div><div className="progress"><i style={{ '--pity-color': rarityColor(rarity), '--pity': `${Math.min(100, save.pity[rarity] / rarityThreshold[rarity] * 100)}%` } as CSSProperties} /></div></div>)}<div className="drop-rates"><div className="eyebrow muted">Base distribution</div>{RARITIES.map((rarity) => <div className="drop-rate" key={rarity} style={{ '--rarity-color': rarityColor(rarity) } as CSSProperties}><i />{rarity}<span style={{ marginLeft: 'auto' }}>{rarityWeight[rarity]}%</span></div>)}</div></aside>
      </div>
    </div>
  );
}

type RunState = { wave: number; cash: number; health: number; enemies: Enemy[]; units: Unit[]; phase: 'idle' | 'active' | 'complete' | 'gameover'; rewardClaimed: boolean };
const createRun = (): RunState => ({ wave: 0, cash: 650, health: 100, enemies: [], units: [], phase: 'idle', rewardClaimed: false });

function Infinite({ save, setSave, notify }: { save: Save; setSave: (save: Save) => void; notify: (message: string) => void }) {
  const [run, setRun] = useState<RunState>(createRun);
  const runRef = useRef(run);
  runRef.current = run;
  const [deployId, setDeployId] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const deployCards = save.squad.map(character).filter(Boolean) as Character[];

  const spawnWave = () => {
    if (run.phase === 'active' || run.phase === 'gameover') return;
    const wave = run.wave + 1;
    const count = 3 + wave * 2;
    const enemies: Enemy[] = Array.from({ length: count }).map((_, index) => {
      const boss = wave % 5 === 0 && index === count - 1;
      const hp = (80 + wave * 35) * (boss ? 4.5 : 1);
      return { id: `${wave}-${index}-${Date.now()}`, x: -2 - index * 3.4, y: [36, 50, 64][index % 3], hp, maxHp: hp, speed: (0.72 + wave * .035) * (boss ? .55 : 1), reward: boss ? 130 + wave * 8 : 20 + wave * 3, boss };
    });
    setRun((current) => ({ ...current, wave, enemies, phase: 'active', rewardClaimed: false }));
    notify(`Wave ${wave} inbound`);
  };

  useEffect(() => {
    if (run.phase !== 'active') return undefined;
    const timer = window.setInterval(() => {
      setRun((current) => {
        if (current.phase !== 'active') return current;
        const enemies = current.enemies.map((enemy) => ({ ...enemy, x: enemy.x + enemy.speed }));
        let health = current.health;
        let cash = current.cash;
        const escaped = enemies.filter((enemy) => enemy.x >= 95);
        health -= escaped.length * 7;
        let remaining = enemies.filter((enemy) => enemy.x < 95);
        const units = current.units.map((unit) => ({ ...unit, cooldown: Math.max(0, unit.cooldown - .42) }));
        units.forEach((unit) => {
          if (unit.cooldown > 0) return;
          const target = remaining.filter((enemy) => enemy.hp > 0).sort((a, b) => a.x - b.x).find((enemy) => Math.hypot((enemy.x - unit.x) * .8, enemy.y - unit.y) <= unit.range);
          if (!target) return;
          target.hp -= unit.damage;
          unit.cooldown = unit.attackSpeed;
          if (target.hp <= 0) cash += target.reward;
        });
        remaining = remaining.filter((enemy) => enemy.hp > 0);
        if (health <= 0) return { ...current, health: 0, enemies: remaining, units, cash, phase: 'gameover' };
        if (remaining.length === 0) return { ...current, enemies: [], units, cash, phase: 'complete' };
        return { ...current, health, enemies: remaining, units, cash };
      });
    }, 420);
    return () => window.clearInterval(timer);
  }, [run.phase]);

  useEffect(() => {
    if (run.phase === 'complete' && run.wave > save.waveBest) {
      setSave({ ...save, waveBest: run.wave });
      notify(`New record: wave ${run.wave}`);
    }
  }, [run.phase, run.wave]);

  useEffect(() => {
    if (run.phase === 'gameover' && !run.rewardClaimed) {
      const reward = 100 + Math.max(0, run.wave - 1) * 18;
      setSave({ ...save, gems: save.gems + reward, waveBest: Math.max(save.waveBest, run.wave) });
      setRun((current) => ({ ...current, rewardClaimed: true }));
      notify(`Core lost. ${reward} gems recovered from the run.`);
    }
  }, [run.phase]);

  const deployAt = (event: MouseEvent<HTMLDivElement>) => {
    if (!deployId || run.phase === 'gameover') return;
    const card = character(deployId);
    if (!card) return notify('Select a valid fighter');
    if (run.cash < card.cost) return notify(`Need ${card.cost} cash to deploy ${card.name}`);
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(17, Math.min(83, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.max(18, Math.min(82, ((event.clientY - bounds.top) / bounds.height) * 100));
    setRun((current) => ({ ...current, cash: current.cash - card.cost, units: [...current.units, { card, level: 1, x, y, cooldown: .2, damage: card.baseDamage, range: card.range, attackSpeed: card.attackSpeed }] }));
    setDeployId(null);
    notify(`${card.name} deployed`);
  };
  const upgrade = () => {
    if (selectedUnit === null) return;
    const unit = run.units[selectedUnit];
    if (!unit) return;
    const cost = 120 + unit.level * 85;
    if (run.cash < cost) return notify('Not enough cash for this upgrade');
    setRun((current) => ({ ...current, cash: current.cash - cost, units: current.units.map((item, index) => index === selectedUnit ? { ...item, level: item.level + 1, damage: Math.round(item.damage * 1.34), range: item.range + 2 } : item) }));
    notify(`${unit.card.name} upgraded to level ${unit.level + 1}`);
  };
  const reset = () => { setRun(createRun()); setDeployId(null); setSelectedUnit(null); notify('Run reset. The core is ready.'); };
  const reward = 100 + Math.max(0, run.wave - 1) * 18;
  return (
    <div className="page run-page">
      <div className="page-heading"><div><div className="eyebrow orange">Live operation / 004</div><h1>Infinite run</h1><p>Deploy on the field, then call the next wave when the line is ready. No ceiling. No rehearsal.</p></div><div className="run-header-actions"><button className="icon-button" onClick={reset} aria-label="Reset run" data-testid="button-reset-run"><RotateCcw size={17} /></button></div></div>
      <div className="run-layout">
        <section className="battle-panel panel">
          <div className="battle-stats"><div className="battle-stat"><span>Wave</span><strong className="orange" data-testid="text-run-wave">{String(run.wave).padStart(2, '0')}</strong></div><div className="battle-stat"><span>Cash</span><strong data-testid="text-run-cash">{run.cash}</strong></div><div className="battle-stat"><span>Core</span><strong className={run.health < 35 ? 'orange' : 'cyan'} data-testid="text-run-health">{run.health}%</strong></div><div className="battle-stat"><span>Hostiles</span><strong data-testid="text-enemy-count">{run.enemies.length}</strong></div></div>
          <div className="battlefield" onClick={deployAt} data-testid="battlefield">
            <span className="battle-hint">{deployId ? 'SELECT A DROP POINT' : run.phase === 'idle' ? 'AWAITING DEPLOYMENT' : run.phase === 'complete' ? 'SECTOR CLEAR' : 'CORE INTEGRITY MONITOR'}</span><span className="spawn-gate" /><span className="core" />
            {run.units.map((unit, index) => <span key={`${unit.card.id}-${index}`} className={`deployed-unit ${selectedUnit === index ? 'selected' : ''}`} style={{ left: `${unit.x}%`, top: `${unit.y}%`, '--unit-color': unit.card.color } as CSSProperties} onClick={(event) => { event.stopPropagation(); setSelectedUnit(index); }} title={`${unit.card.name} level ${unit.level}`} data-testid={`unit-${index}`}>{initials(unit.card.name).slice(0, 1)}</span>)}
            {run.enemies.map((enemy) => <span key={enemy.id} className={`enemy ${enemy.boss ? 'boss' : ''}`} style={{ left: `${enemy.x}%`, top: `${enemy.y}%` }} data-testid={`enemy-${enemy.id}`}><span className="enemy-hp"><i style={{ width: `${Math.max(0, enemy.hp / enemy.maxHp * 100)}%` }} /></span><Target size={enemy.boss ? 17 : 12} /></span>)}
            {run.units[selectedUnit ?? -1] && <span className="range-ring" style={{ left: `${run.units[selectedUnit ?? -1].x}%`, top: `${run.units[selectedUnit ?? -1].y}%`, width: `${run.units[selectedUnit ?? -1].range * 5}px`, height: `${run.units[selectedUnit ?? -1].range * 5}px` }} />}
            {run.phase === 'idle' && <div className="empty-battle"><div><Crosshair size={34} /><strong>Build the first line</strong><p>Select a fighter on the right, place them on the field, then call wave one.</p></div></div>}
            {run.phase === 'complete' && <div className="empty-battle"><div><Shield size={34} /><strong>Sector cleared</strong><p>Cash has been counted. Reset the formation or push into the next wave.</p></div></div>}
            {run.phase === 'gameover' && <div className="run-over"><div className="run-over-card"><Zap size={30} /><h3>Core breach</h3><p>Wave {run.wave} ended the operation.</p><div className="run-over-reward">RUN RECOVERY +{reward} GEMS</div><button className="btn btn-primary" onClick={reset} data-testid="button-restart-run"><RotateCcw size={16} /> Restart operation</button></div></div>}
          </div>
          <div className="run-controls"><button className="btn btn-primary" onClick={spawnWave} disabled={run.phase === 'active' || run.phase === 'gameover'} data-testid="button-next-wave">{run.phase === 'complete' ? <><ArrowRight size={16} /> Next wave</> : <><Play size={16} fill="currentColor" /> {run.wave === 0 ? 'Start wave one' : 'Call next wave'}</>}</button>{run.phase === 'active' && <span className="eyebrow cyan"><Pause size={13} /> Live combat</span>}<span className="wave-note">Reach W{save.waveBest + 1} to set a new record</span></div>
        </section>
        <aside className="panel deploy-panel"><div className="eyebrow orange">Deployment hand</div><h3>Place a fighter</h3><p>Choose a card, then tap an open sector. Placement costs cash; every unit can be upgraded mid-wave.</p><div className="deploy-list">{deployCards.length === 0 && <p className="muted">Set your active squad in Collection first.</p>}{deployCards.map((card) => <button key={card.id} className={`deploy-card ${deployId === card.id ? 'active' : ''}`} onClick={() => setDeployId(deployId === card.id ? null : card.id)} disabled={run.cash < card.cost || run.phase === 'gameover'} data-testid={`button-deploy-${card.id}`}><span className="mini-avatar" style={{ background: card.color }}>{initials(card.name)}</span><span className="deploy-card-info"><strong>{card.name}</strong><small>{card.rarity} / {card.baseDamage} DMG</small></span><span className="cost">{card.cost}</span></button>)}</div>{selectedUnit !== null && run.units[selectedUnit] && <div className="upgrade-box"><div className="eyebrow orange">Selected unit</div><h4>{run.units[selectedUnit].card.name} / LVL {run.units[selectedUnit].level}</h4><p>Damage {run.units[selectedUnit].damage} / Range {run.units[selectedUnit].range}</p><button className="btn btn-dark" style={{ width: '100%' }} onClick={upgrade} disabled={run.cash < 120 + run.units[selectedUnit].level * 85} data-testid="button-upgrade-unit"><ArrowUpRight size={16} /> Upgrade / {120 + run.units[selectedUnit].level * 85}</button></div>}</aside>
      </div>
    </div>
  );
}

function Router() {
  const [save, setSaveState] = useState<Save>(loadSave);
  const [toast, setToast] = useState('');
  const saveRef = useRef(save);
  saveRef.current = save;
  const setSave = (next: Save) => { setSaveState(next); saveGame(next); };
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2800); };
  useEffect(() => { saveGame(saveRef.current); }, []);
  return <Shell save={save}><Switch>
    <Route path="/"><Home save={save} /></Route>
    <Route path="/collection"><Collection save={save} setSave={setSave} notify={notify} /></Route>
    <Route path="/summon"><Summon save={save} setSave={setSave} notify={notify} /></Route>
    <Route path="/infinite"><Infinite save={save} setSave={setSave} notify={notify} /></Route>
    <Route component={NotFound} />
  </Switch>{toast && <div className="toast" role="status" data-testid="status-toast"><strong>SYNC // </strong>{toast}</div>}</Shell>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><ErrorBoundary><Router /></ErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;