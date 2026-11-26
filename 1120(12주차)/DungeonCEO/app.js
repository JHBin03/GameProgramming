const ROOMS_PER_FLOOR = 3;
const MONSTER_SLOTS = 2;
const TRAP_SLOTS = 1;
const STEP_MS = 650;
const HERO_ENTRY_MS = 700;
const ATTACK_TURN_MS = 600;
const HEALTH_MULTIPLIER = 2;
const WALK_FRAME_MS = 80;
const WALK_POSES = ["walk-1", "walk-2", "walk-1", "walk-2"];
const REVIVE_MS = 8000;
const ESCAPE_SEGMENTS = 3;
const ESCAPE_HIT_CHANCE = 0.5;
const STARTING_RAID_SIZE = 2;
const STANDARD_RAID_SIZE = 4;
const MAX_RAID_SIZE = 12;
const STANDARD_HERO_STATS_LEVEL = 6;
const PROMOTION_DAYS = 3;
const PROMOTION_RATE = 0.20;
const SAVE_KEY = "dungeon-ceo.save";
const SAVE_VERSION = 15;
const DELIVERY_RESOURCES = { stone: { quantity: 6, price: 12 }, iron: { quantity: 2, price: 30 } };
const RESEARCHES = [
  { id: "revival", name: "부활 의식", cost: 5, reduction: 0.25 },
  { id: "mining", name: "채굴 도구", cost: 5, bonus: 0.50 },
];
const DEFENSE_ORDERS = { all: "전원 교전", honor: "명예 용사 대비" };
const BANKRUPTCY_LIMIT = 3;
const NAME_LIMIT = 24;
const HERO_TOLL = 20;
const MAX_THRONE_REWARD = 10000;
const DEFAULT_THRONE_REWARD = 0;
const BREAKDOWN_RATE = 0.20;
const COLLAPSE_RATE = 0.08;
const REPAIR_COST = 25;
const SUPPORT_IRON_COST = 4;
const FIRST_EXPANSION_STONE = 6;
const OPENING_REWARD_GOLD = 200;
const MANAGEMENT_GOALS = ["첫 정산", "2층 증축", "3층 운영"];
const RESOURCES = { gold: "골드", stone: "석재", iron: "철", darkMatter: "암흑물질" };
const SAVE_NUMBERS = {
  floors: 1, level: 1, gold: 0, stone: 0, iron: 0, darkMatter: 0, day: 1, debt: 0, relics: 0,
  infamy: 0, popularity: 0, promotionDays: 0, lastPromotionDay: 0, throneReward: 0, debtDays: 0,
};
const HERO_CLASSES = [
  { name: "전사" },
  { name: "궁수", dodgeChance: 0.25 },
  { name: "암살자", criticalChance: 0.25, criticalMultiplier: 2 },
  { name: "마법사", teleportChance: 0.25 },
].map((hero, index) => ({ ...hero, sprite: `hero-${index + 1}` }));
const MONSTERS = [
  { name: "슬라임",       hp: 36,  attack: 12, hire: 35,  upkeep: 2,  resource: "stone",      output: 12 },
  { name: "스켈레톤",     hp: 46,  attack: 15, hire: 70,  upkeep: 4,  resource: "iron",       output: 8 },
  { name: "좀비",         hp: 58,  attack: 18, hire: 100, upkeep: 7,  resource: "darkMatter", output: 4 },
  { name: "동굴 고블린",  hp: 62,  attack: 17, hire: 150, upkeep: 12, resource: "gold",       output: 45 },
  { name: "그림자 늑대",  hp: 82,  attack: 26, hire: 190, upkeep: 12, resource: "stone",      output: 24 },
  { name: "오크 광전사",  hp: 100, attack: 30, hire: 260, upkeep: 16, resource: "iron",       output: 18 },
  { name: "흑철 골렘",    hp: 130, attack: 38, hire: 340, upkeep: 22, resource: "darkMatter", output: 14 },
  { name: "미노타우로스", hp: 155, attack: 46, hire: 440, upkeep: 28, resource: "stone",      output: 42 },
  { name: "심연의 리치",  hp: 180, attack: 58, hire: 560, upkeep: 35, resource: "iron",       output: 34 },
  { name: "와이번",       hp: 220, attack: 72, hire: 700, upkeep: 44, resource: "darkMatter", output: 28 },
].map((monster, index) => ({
  ...monster, hp: monster.hp * HEALTH_MULTIPLIER, level: index + 1, sprite: `monster-${index + 1}`,
}));

const TRAPS = [
  { id: "spikes", name: "가시 바닥", level: 1, cost: 70, damage: 10, effect: "입장한 용사에게 피해 10" },
  { id: "mist", name: "쇠약 안개", level: 2, cost: 110, weaken: 0.25, effect: "이 방에서 용사의 공격력 25% 감소" },
  { id: "banner", name: "광란의 깃발", level: 3, cost: 150, boost: 0.20, effect: "이 방 몬스터의 공격력 20% 증가" },
  { id: "bounty", name: "현상금 인장", level: 4, minFloors: 3, cost: 200, hitRate: 0.12, hitGold: 40, effect: "몬스터가 용사의 체력을 깎을 때 12% 확률로 골드 +40 · 침입당 용사별 1회 발동" },
  { id: "relic", name: "수집가의 제단", level: 5, minFloors: 3, cost: 240, hitRate: 0.08, hitRelics: 1, effect: "몬스터가 용사의 체력을 깎을 때 8% 확률로 고대 유물 +1 · 침입당 용사별 1회 발동" },
  { id: "crypt", name: "부활의 관", level: 6, cost: 290, reviveMs: 4000, effect: "이 방 몬스터의 부활 대기 시간 50% 감소" },
  { id: "gate", name: "역행의 문", level: 8, cost: 360, chance: 0.30, effect: "용사를 30% 확률로 직전 방으로 돌려보냄 · 방마다 침입당 1회 판정" },
  { id: "verdict", name: "종말의 각인", level: 10, cost: 450, threshold: 0.15, effect: "입장한 용사의 남은 체력이 15% 이하면 체력을 0으로 만듦" },
  { id: "recovery", name: "강제 회복진", level: 7, cost: 320, recoveryChance: 0.25, recoveryRatio: 0.40, sprite: "trap-6", effect: "도망 중인 용사를 25% 확률로 최대 체력의 40%까지 회복시켜 탐색 재개 · 방마다 용사당 1회 판정" },
].map((trap, index) => ({ sprite: `trap-${index + 1}`, ...trap })).sort((a, b) => a.level - b.level);

const SPIKE_MODIFICATIONS = [
  { id: "deep", name: "깊은 가시", iron: 4, damage: 20, effect: "입장한 용사에게 피해 20",
    change: "입장 피해 10 → 20" },
  { id: "sticky", name: "끈끈한 가시", iron: 4, damage: 10, slowMs: 800,
    effect: "입장한 용사에게 피해 10 · 다음 이동 0.8초 지연 (침입당 용사별 같은 방 1회)",
    change: "입장 피해 10 유지 · 다음 이동 0.8초 지연 추가 (침입당 용사별 같은 방 1회)" },
];

function modifiedSpikes(trap, modification) {
  return { ...trap, name: modification.name, damage: modification.damage, slowMs: modification.slowMs,
    effect: modification.effect, modification: modification.id };
}

const state = {
  demonName: "마왕", dungeonName: "이름 없는 던전",
  floors: 1, level: 1, gold: 1250, stone: 0, iron: 0, darkMatter: 0,
  running: false, day: 1, debt: 0, debtDays: 0,
  openingRewardClaimed: false,
  managementGoalStage: 0,
  firstDayGuide: { dismissed: false, slimeHired: false, settlementSeen: false },
  deliveryContract: null,
  ledger: [],
  royalHistory: [],
  endingSeen: false,
  placements: new Map(), selectedRoom: "floor-1-room-1", selectedSlot: 0,
  traps: new Map(), selectedTrapRoom: "floor-1-room-1", relics: 0,
  workshops: new Map(),
  research: { revival: false, mining: false },
  defenseOrders: new Map(),
  infamy: 0, popularity: 0, escapeProgress: 0,
  promotionDays: 0, lastPromotionDay: 0, throneReward: DEFAULT_THRONE_REWARD,
};
let selectedLedgerDay = null;
let selectedScoutOrder = 1;
let royalSelected = false;
let throneRewardDraft = null;
let raidClock = null;
let raidSpeed = 1;

// One alarm dispatches one game-time event. Promise continuations finish before
// the next alarm, including when a slow browser has several overdue events.
class RaidClock {
  constructor() {
    this.now = 0;
    this.time = 0;
    this.realTime = performance.now();
    this.speed = 1;
    this.sequence = 0;
    this.generation = 0;
    this.tasks = [];
    this.alarm = null;
  }

  get elapsed() {
    return this.time + (performance.now() - this.realTime) * this.speed;
  }

  schedule(callback, delay) {
    const task = { at: this.now + delay, order: this.sequence++, callback };
    this.tasks.push(task);
    this.tasks.sort((a, b) => a.at - b.at || a.order - b.order);
    this.arm();
    return task;
  }

  cancel(task) {
    this.tasks = this.tasks.filter((entry) => entry !== task);
    this.arm();
  }

  setSpeed(speed) {
    const realTime = performance.now();
    this.time += (realTime - this.realTime) * this.speed;
    this.realTime = realTime;
    this.speed = speed;
    this.arm();
  }

  arm() {
    clearTimeout(this.alarm);
    const generation = ++this.generation;
    if (!this.speed || !this.tasks.length) return;
    const delay = Math.max(0, Math.ceil((this.tasks[0].at - this.elapsed) / this.speed));
    this.alarm = setTimeout(() => {
      if (generation !== this.generation) return;
      const task = this.tasks.shift();
      this.now = task.at;
      task.callback();
      this.arm();
    }, delay);
  }

  stop() {
    clearTimeout(this.alarm);
    this.generation++;
    this.tasks = [];
  }
}

function gameTimer(callback, delay) {
  const clock = raidClock;
  return clock ? { clock, task: clock.schedule(callback, delay) } : { timer: setTimeout(callback, delay) };
}

function cancelGameTimer(handle) {
  if (handle?.clock) handle.clock.cancel(handle.task);
  else clearTimeout(handle?.timer);
}

function renderRaidControls() {
  const active = state.running && Boolean(raidClock);
  const paused = active && raidClock.speed === 0;
  byId("start-route").hidden = active;
  byId("pause-raid").parentElement?.toggleAttribute?.("hidden", !active);
  const pause = byId("pause-raid");
  pause.disabled = !active;
  pause.textContent = paused ? "계속하기" : "일시정지";
  pause.setAttribute("aria-pressed", String(paused));
  for (const speed of [1, 2]) {
    const button = byId(`raid-speed-${speed}`);
    button.disabled = !active;
    button.setAttribute("aria-pressed", String(raidSpeed === speed));
  }
  byId("raid-time-status").textContent = !active ? "침입 중 시간 조절 가능"
    : paused ? `일시정지 · 재개 시 ${raidSpeed}배속` : `${raidSpeed}배속 진행 중`;
}

function toggleRaidPause() {
  if (!state.running || isBankrupt() || !raidClock) return;
  raidClock.setSpeed(raidClock.speed === 0 ? raidSpeed : 0);
  renderRaidControls();
}

function setRaidSpeed(speed) {
  if (!state.running || isBankrupt() || !raidClock || ![1, 2].includes(speed)) return;
  raidSpeed = speed;
  if (raidClock.speed !== 0) raidClock.setSpeed(speed);
  renderRaidControls();
}

const byId = (id) => document.getElementById(id);
const count = (value) => value.toLocaleString("ko-KR");
const roomId = (floor, room) => `floor-${floor}-room-${room}`;
const roomLabel = (id) => {
  const [, floor, , room] = id.split("-");
  return `${floor}층 ${room}번 방`;
};
const COMBAT_LEVEL_CAP = 12;
const demonMaxHp = () => 240 + (Math.min(state.level, COMBAT_LEVEL_CAP) - 1) * 30;
const demonAttack = () => 54 + (Math.min(state.level, COMBAT_LEVEL_CAP) - 1) * 5;
const rewardPopularity = () => Math.floor(state.throneReward / 50);
const isBankrupt = () => state.debtDays >= BANKRUPTCY_LIMIT;
const loanLimit = () => 2 * MONSTERS[Math.min(state.level, MONSTERS.length) - 1].hire + REPAIR_COST;
const maxLoanAmount = () => Math.max(0, Math.min(loanLimit() - state.debt, Number.MAX_SAFE_INTEGER - state.gold));
const trapFloorUnlocked = (trap) => state.floors >= (trap.minFloors ?? 1);

function revivalDelay(trap, researched = state.research.revival) {
  return (trap?.reviveMs ?? REVIVE_MS) * (researched ? 1 - RESEARCHES[0].reduction : 1);
}

function trapEffect(trap) {
  return trap.id === "crypt"
    ? `이 방 몬스터의 부활 대기 시간 ${revivalDelay(null) / 1000}초 → ${revivalDelay(trap) / 1000}초${state.research.revival ? " · 부활 의식 적용" : ""}`
    : trap.effect;
}

function monsterProduction(monster, broken = false, researched = state.research.mining) {
  const bonus = researched && ["stone", "iron"].includes(monster.resource) ? RESEARCHES[1].bonus : 0;
  const normal = Math.floor(monster.output * (1 + bonus));
  return broken ? Math.floor(normal / 2) : normal;
}

function researchBlocker(research) {
  if (state.research[research.id]) return "연구 완료";
  if (isBankrupt()) return "운영 종료";
  if (state.running) return "침입 중";
  if (state.relics < research.cost) return "고대 유물 부족";
  return "";
}

function buyResearch(id) {
  const research = RESEARCHES.find((item) => item.id === id);
  if (!research || researchBlocker(research)) return;
  recordTransaction("research", `${research.name} 연구`, 0, 0, { relics: -research.cost });
  state.relics -= research.cost;
  state.research[id] = true;
  log("연구 완료", `${research.name} · 고대 유물 ${research.cost}개 지불 · 영구 효과 적용`);
  renderManagement();
}

function buildResearchCatalog() {
  for (const research of RESEARCHES) {
    const card = element("li", "research-card");
    const button = element("button", "action");
    button.type = "button";
    button.addEventListener("click", () => buyResearch(research.id));
    card.append(element("h3", "", research.name),
      element("p", "panel-description", `비용 · 고대 유물 ${research.cost}개 · 1회 구매`),
      element("p", "research-effect"));
    if (research.id === "mining") {
      const table = element("table");
      const caption = element("caption", "", "몬스터별 하루 생산 · 연구 전 → 연구 후");
      const head = element("thead");
      const row = element("tr");
      for (const label of ["몬스터 · 자원", "정상", "고장"]) {
        const cell = element("th", "", label);
        cell.scope = "col";
        row.append(cell);
      }
      head.append(row);
      const body = element("tbody");
      for (const monster of MONSTERS.filter((item) => ["stone", "iron"].includes(item.resource))) {
        const line = element("tr");
        const name = element("th", "", `${monster.name} · ${RESOURCES[monster.resource]}`);
        name.scope = "row";
        line.append(name, ...[false, true].map((broken) => element("td", "",
          `${monsterProduction(monster, broken, false)} → ${monsterProduction(monster, broken, true)}`)));
        body.append(line);
      }
      table.append(caption, head, body);
      card.append(table);
    }
    card.append(button);
    byId("research-catalog").append(card);
  }
}

function renderResearch() {
  byId("research-balance").textContent = `보유 고대 유물 ${count(state.relics)}개`;
  for (const [index, research] of RESEARCHES.entries()) {
    const card = byId("research-catalog").children[index];
    const completed = state.research[research.id];
    const crypt = TRAPS.find((trap) => trap.id === "crypt");
    const effect = research.id === "revival"
      ? `수비 몬스터 부활 시간 ${research.reduction * 100}% 감소 · 기본 ${revivalDelay(null, false) / 1000}초 → ${revivalDelay(null, true) / 1000}초 · 부활의 관 ${revivalDelay(crypt, false) / 1000}초 → ${revivalDelay(crypt, true) / 1000}초. 앞으로 쓰러지는 몬스터부터 적용합니다.`
      : `작업장 석재·철 생산량 ${research.bonus * 100}% 증가. 골드·암흑물질 생산은 유지됩니다. 고장 시 연구 적용 생산량의 절반이며, 몬스터별로 소수점을 버립니다.`;
    card.querySelector(".research-effect").textContent = `${completed ? "연구 완료 · 현재 적용 중. " : "연구 전 → 연구 후 · "}${effect}`;
    const button = card.querySelector("button");
    const blocker = researchBlocker(research);
    button.disabled = Boolean(blocker);
    button.textContent = blocker || `연구하기 · 고대 유물 ${research.cost}개`;
    button.setAttribute("aria-label", `${research.name} · ${button.textContent}`);
  }
}

const LEDGER_CATEGORIES = {
  toll: "통행료", production: "작업장 생산", contract: "계약금", upkeep: "유지비",
  throne: "마왕 처치 보상", hire: "고용", build: "건설·개조", repair: "수리",
  promotion: "홍보", reward: "첫 정산 보상", bounty: "현상금", research: "연구",
  loan: "대출", repayment: "상환",
};

function currentLedger() {
  let day = state.ledger.at(-1);
  if (!day || day.day !== state.day) {
    day = { day: state.day, opening: state.gold, closing: state.gold,
      openingDebt: state.debt, closingDebt: state.debt, closed: false, transactions: [], rooms: [] };
    state.ledger.push(day);
  }
  return day;
}

// Called before changing cash/debt; only money actually paid changes cash.
function recordTransaction(category, label, gold = 0, debt = 0, resources = {}) {
  const day = currentLedger();
  day.transactions.push({ category, label, gold, debt, resources });
  day.closing += gold;
  day.closingDebt += debt;
}

function restoreLedger(value, progress, valid) {
  valid(Array.isArray(value) && value.length > 0);
  let previous = null;
  const integer = (n) => Number.isSafeInteger(n) && n >= 0;
  const restored = value.map((entry, index) => {
    valid(entry && integer(entry.day) && entry.day >= 1 && entry.day <= progress.day
      && [entry.opening, entry.closing, entry.openingDebt, entry.closingDebt].every(integer)
      && typeof entry.closed === "boolean" && Array.isArray(entry.transactions) && Array.isArray(entry.rooms));
    valid(entry.closed === (entry.day < progress.day));
    if (previous) valid(entry.day === previous.day + 1 && entry.opening === previous.closing
      && entry.openingDebt === previous.closingDebt);
    let cash = entry.opening, debt = entry.openingDebt;
    const transactions = entry.transactions.map((t) => {
      valid(t && Object.hasOwn(LEDGER_CATEGORIES, t.category) && typeof t.label === "string"
        && t.label.length > 0 && t.label.length <= 200 && Number.isSafeInteger(t.gold)
        && Number.isSafeInteger(t.debt) && t.resources && typeof t.resources === "object" && !Array.isArray(t.resources));
      valid(Object.entries(t.resources).every(([key, amount]) =>
        ["stone", "iron", "darkMatter", "relics"].includes(key) && Number.isSafeInteger(amount)));
      cash += t.gold; debt += t.debt;
      valid(integer(cash) && integer(debt));
      return { category: t.category, label: t.label, gold: t.gold, debt: t.debt, resources: { ...t.resources } };
    });
    valid(cash === entry.closing && debt === entry.closingDebt);
    const labels = new Set();
    const rooms = entry.rooms.map((r) => {
      valid(r && typeof r.label === "string" && /^\d+층 \d+번 방$/.test(r.label)
        && !labels.has(r.label) && integer(r.repelled) && integer(r.passed));
      labels.add(r.label);
      return { label: r.label, repelled: r.repelled, passed: r.passed };
    });
    valid(rooms.length <= progress.floors * ROOMS_PER_FLOOR);
    previous = { day: entry.day, opening: entry.opening, closing: entry.closing,
      openingDebt: entry.openingDebt, closingDebt: entry.closingDebt, closed: entry.closed, transactions, rooms };
    if (index === value.length - 1) valid(entry.day === progress.day && cash === progress.gold && debt === progress.debt);
    return previous;
  });
  return restored;
}

const signedGold = (n) => `${n > 0 ? "+" : ""}${count(n)}`;
function ledgerResources(transactions) {
  const totals = {};
  for (const t of transactions) for (const [key, amount] of Object.entries(t.resources)) {
    totals[key] = (totals[key] || 0) + amount;
  }
  return Object.entries(totals).filter(([, amount]) => amount)
    .map(([key, amount]) => `${RESOURCES[key] || "고대 유물"} ${signedGold(amount)}`).join(" · ");
}

function renderLedger() {
  currentLedger();
  const host = byId("daily-ledger");
  if (!host) return;
  const recent = state.ledger.filter((d) => d.closed).slice(-3).reverse();
  // Before the first settlement, compare the open day instead.
  const comparison = recent.length ? recent : [currentLedger()];
  const head = byId("ledger-head");
  const heading = element("tr");
  heading.append(element("th", "", "항목"));
  for (const day of comparison) {
    const cell = element("th");
    const button = element("button", "action", `${day.day}일차${day.closed ? "" : " · 진행 중"}`);
    button.type = "button";
    button.setAttribute("aria-pressed", String(day.day === (selectedLedgerDay ?? comparison[0].day)));
    button.addEventListener("click", () => { selectedLedgerDay = day.day; renderLedger(); });
    cell.append(button); heading.append(cell);
  }
  head.replaceChildren(heading);
  const body = byId("ledger-comparison");
  body.replaceChildren();
  const row = (label, values) => {
    const tr = element("tr");
    const th = element("th", "", label); th.scope = "row"; tr.append(th);
    for (const value of values) tr.append(element("td", "", value));
    body.append(tr);
  };
  row("시작 잔액", comparison.map((d) => `${count(d.opening)}G`));
  for (const category of ["toll", "production", "contract", "upkeep", "throne", "hire", "build", "repair", "promotion", "reward", "bounty", "research"]) {
    row(LEDGER_CATEGORIES[category], comparison.map((d) => {
      const entries = d.transactions.filter((t) => t.category === category);
      const resources = ledgerResources(entries);
      const unpaid = entries.reduce((n, t) => n + t.debt, 0);
      return `${signedGold(entries.reduce((n, t) => n + t.gold, 0))}G${resources ? ` · ${resources}` : ""}${unpaid ? ` · 미납 +${count(unpaid)}G` : ""}`;
    }));
  }
  row("영업 현금 증감", comparison.map((d) => `${signedGold(d.transactions.filter((t) => !["loan", "repayment"].includes(t.category)).reduce((n, t) => n + t.gold, 0))}G`));
  for (const category of ["loan", "repayment"]) row(`${LEDGER_CATEGORIES[category]} (금융)`, comparison.map((d) =>
    `${signedGold(d.transactions.filter((t) => t.category === category).reduce((n, t) => n + t.gold, 0))}G`));
  row("마감 잔액", comparison.map((d) => `${count(d.closing)}G`));
  row("미납금 (시작 → 마감)", comparison.map((d) => `${count(d.openingDebt)} → ${count(d.closingDebt)}G`));
  const selected = state.ledger.find((d) => d.day === selectedLedgerDay) || comparison[0];
  const picker = byId("ledger-day");
  picker.replaceChildren();
  for (const day of [...state.ledger].reverse()) {
    const option = element("option", "", `${day.day}일차${day.closed ? " · 마감" : " · 진행 중"}`);
    option.value = String(day.day); option.selected = day === selected; picker.append(option);
  }
  byId("ledger-detail-title").textContent = `${selected.day}일차 거래와 전투`;
  const sum = selected.transactions.reduce((n, t) => n + t.gold, 0);
  byId("ledger-balance").textContent = `시작 ${count(selected.opening)}G + 거래 합계 (${signedGold(sum)}G) = ${selected.closed ? "마감" : "현재"} ${count(selected.closing)}G · ${selected.opening + sum === selected.closing ? "일치" : "불일치"}`;
  const expenses = selected.transactions.filter((t) => t.gold < 0 && t.category !== "repayment");
  const largest = expenses.reduce((best, t) => !best || t.gold < best.gold ? t : best, null);
  byId("ledger-largest").textContent = largest ? `가장 큰 지출 · ${largest.label} · ${count(-largest.gold)}G (실제 지급액 기준, 상환 별도)` : "영업 지출 없음 · 상환은 별도 표시";
  const transactions = byId("ledger-transactions"); transactions.replaceChildren();
  for (const t of selected.transactions) {
    const li = element("li", "", `${["loan", "repayment"].includes(t.category) ? "[금융] " : ""}${t.label} · ${signedGold(t.gold)}G${t.debt ? ` · 미납금 ${signedGold(t.debt)}G` : ""}${ledgerResources([t]) ? ` · ${ledgerResources([t])}` : ""}`);
    transactions.append(li);
  }
  if (!selected.transactions.length) transactions.append(element("li", "", "아직 거래가 없습니다."));
  const rooms = byId("ledger-rooms"); rooms.replaceChildren();
  for (const room of selected.rooms) {
    const tr = element("tr"); tr.append(element("th", "", room.label), element("td", "", `${room.repelled}명`), element("td", "", `${room.passed}명`)); rooms.append(tr);
  }
  byId("ledger-no-battle").hidden = selected.rooms.length > 0;
}

function readNames(demonName, dungeonName) {
  const names = [demonName, dungeonName].map((name) => typeof name === "string" ? name.trim() : "");
  if (!names.every((name) => name.length && name.length <= NAME_LIMIT)) return null;
  return { demonName: names[0], dungeonName: names[1] };
}

function makeSave() {
  ensureDeliveryContract();
  currentLedger();
  const progress = Object.fromEntries(Object.keys(SAVE_NUMBERS).map((key) => [key, state[key]]));
  return {
    endingSeen: state.endingSeen,
    royalHistory: JSON.parse(JSON.stringify(state.royalHistory)),
    ledger: JSON.parse(JSON.stringify(state.ledger)),
    version: SAVE_VERSION, savedAt: Date.now(), ...progress,
    openingRewardClaimed: state.openingRewardClaimed,
    managementGoalStage: state.managementGoalStage,
    firstDayGuide: { ...state.firstDayGuide },
    deliveryContract: state.deliveryContract ? { ...state.deliveryContract } : null,
    research: { ...state.research },
    demonName: state.demonName, dungeonName: state.dungeonName, escapeProgress: state.escapeProgress,
    placements: [...state.placements].map(([id, slots]) => [id, Array.from(
      { length: MONSTER_SLOTS }, (_, index) => {
        const unit = slots[index];
        return unit ? { sprite: unit.monster.sprite, hp: unit.hp, reviveAt: unit.reviveAt } : null;
      },
    )]),
    traps: [...state.traps].map(([room, trap]) => [room, { id: trap.id, modification: trap.modification ?? null }]),
    workshops: [...state.workshops].map(([room, workshop]) => [room, {
      broken: workshop.broken, supported: Boolean(workshop.supported),
    }]),
    defenseOrders: [...state.defenseOrders],
  };
}

function decodeSave(raw) {
  const save = JSON.parse(raw);
  if (!save || ![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, SAVE_VERSION].includes(save.version)) throw new Error("지원하지 않는 저장 형식입니다.");
  const names = readNames(save.demonName, save.dungeonName);
  const valid = (condition) => { if (!condition) throw new Error("저장 데이터가 올바르지 않습니다."); };
  valid(names && Number.isSafeInteger(save.savedAt) && save.savedAt > 0 && save.savedAt <= 8.64e15);
  const progress = { ...names };
  progress.endingSeen = save.version >= 15 ? save.endingSeen : false;
  valid(typeof progress.endingSeen === "boolean");
  const history = save.version >= 14 ? save.royalHistory : [];
  valid(Array.isArray(history));
  progress.royalHistory = history.map((entry) => {
    valid(entry && Number.isSafeInteger(entry.day) && entry.day > 0
      && ["사망", "탈출", "통행료 귀환", "마왕방 생존 귀환"].includes(entry.outcome)
      && typeof entry.shieldUsed === "boolean" && typeof entry.demonDefeated === "boolean");
    return { day: entry.day, outcome: entry.outcome, shieldUsed: entry.shieldUsed,
      demonDefeated: entry.demonDefeated };
  });
  if (save.version >= 10) {
    valid(save.research && typeof save.research === "object" && !Array.isArray(save.research)
      && RESEARCHES.every(({ id }) => typeof save.research[id] === "boolean"));
  }
  progress.research = Object.fromEntries(RESEARCHES.map(({ id }) => [id, save.version >= 10 ? save.research[id] : false]));
  for (const [key, minimum] of Object.entries(SAVE_NUMBERS)) {
    if (key === "throneReward" && save.version < 3) {
      progress[key] = DEFAULT_THRONE_REWARD;
      continue;
    }
    const addedLater = (key === "debtDays" && save.version < 4)
      || (save.version === 1 && (key === "iron" || key === "darkMatter"));
    const value = addedLater ? 0 : save[key];
    valid(Number.isSafeInteger(value) && value >= minimum);
    progress[key] = value;
  }
  valid(progress.throneReward <= MAX_THRONE_REWARD);
  progress.openingRewardClaimed = save.version < 5 ? save.floors > 1 : save.openingRewardClaimed;
  valid(typeof progress.openingRewardClaimed === "boolean");
  if (save.version >= 6) {
    valid(Number.isInteger(save.managementGoalStage) && save.managementGoalStage >= 0
      && save.managementGoalStage <= MANAGEMENT_GOALS.length);
  }
  // Loading only restores milestones; it must never grant a past reward again.
  progress.managementGoalStage = Math.max(save.version >= 6 ? save.managementGoalStage : 0,
    inferredGoalStage(progress));
  if (progress.managementGoalStage > 0) progress.openingRewardClaimed = true;
  valid(progress.debtDays <= BANKRUPTCY_LIMIT && (progress.debt > 0 || progress.debtDays === 0));
  valid(save.floors <= save.level && save.promotionDays <= PROMOTION_DAYS && save.lastPromotionDay <= save.day);
  if (save.version >= 11) {
    const contract = save.deliveryContract;
    if (progress.floors < 2) valid(contract === null);
    else {
      valid(contract && typeof contract === "object" && !Array.isArray(contract));
      valid(contract.day === progress.day && Object.hasOwn(DELIVERY_RESOURCES, contract.resource)
        && Number.isSafeInteger(contract.quantity) && contract.quantity > 0
        && Number.isSafeInteger(contract.gold) && contract.gold > 0
        && ["pending", "fulfilled", "declined"].includes(contract.status));
    }
    progress.deliveryContract = contract ? { day: contract.day, resource: contract.resource,
      quantity: contract.quantity, gold: contract.gold, status: contract.status } : null;
  } else {
    progress.deliveryContract = progress.floors >= 2 ? createDeliveryContract(progress.day) : null;
  }
  valid(Number.isFinite(save.escapeProgress) && save.escapeProgress >= 0 && save.escapeProgress < 1);
  progress.escapeProgress = save.escapeProgress;
  function restoreRooms(entries, restoreValue) {
    valid(Array.isArray(entries));
    const rooms = new Map();
    for (const entry of entries) {
      valid(Array.isArray(entry) && entry.length === 2 && typeof entry[0] === "string");
      const [id, value] = entry;
      const match = /^floor-([1-9]\d*)-room-([1-9]\d*)$/.exec(id);
      valid(match && +match[1] <= save.floors && +match[2] <= ROOMS_PER_FLOOR && !rooms.has(id));
      rooms.set(id, restoreValue(value));
    }
    return rooms;
  }
  progress.placements = restoreRooms(save.placements, (slots) => {
    valid(Array.isArray(slots) && slots.length === MONSTER_SLOTS && slots.some(Boolean));
    return slots.map((unit) => {
      if (unit === null) return null;
      const monster = MONSTERS.find((item) => item.sprite === unit?.sprite);
      valid(monster && monster.level <= save.level && Number.isFinite(unit.hp)
        && unit.hp >= 0 && unit.hp <= monster.hp && Number.isSafeInteger(unit.reviveAt)
        && unit.reviveAt >= 0 && unit.reviveAt <= save.savedAt + REVIVE_MS);
      if (unit.reviveAt && unit.reviveAt <= Date.now()) return { monster, hp: monster.hp, reviveAt: 0 };
      return { monster, hp: unit.hp, reviveAt: unit.reviveAt };
    });
  });
  progress.traps = restoreRooms(save.traps, (value) => {
    if (save.version >= 9) {
      valid(value && typeof value === "object" && !Array.isArray(value));
    }
    const id = save.version < 9 ? value : value.id;
    const trap = TRAPS.find((item) => item.id === id);
    valid(trap && trap.level <= save.level);
    if (save.version >= 9 && value.modification !== null) {
      const modification = SPIKE_MODIFICATIONS.find((item) => item.id === value.modification);
      valid(trap.id === "spikes" && modification);
      return modifiedSpikes(trap, modification);
    }
    return trap;
  });
  progress.workshops = restoreRooms(save.version === 1 ? [] : save.workshops, (value) => {
    if (save.version < 12) {
      valid(typeof value === "boolean");
      return { broken: value, collapsed: false, supported: false };
    }
    valid(value && typeof value === "object" && !Array.isArray(value)
      && typeof value.broken === "boolean" && typeof value.supported === "boolean");
    return { broken: value.broken, collapsed: false, supported: value.supported };
  });
  progress.defenseOrders = restoreRooms(save.version < 8 ? [] : save.defenseOrders, (order) => {
    valid(typeof order === "string" && Object.hasOwn(DEFENSE_ORDERS, order));
    return order;
  });
  for (const id of progress.workshops.keys()) valid(!progress.traps.has(id));
  if (save.version >= 7) {
    valid(save.firstDayGuide && ["dismissed", "slimeHired", "settlementSeen"]
      .every((key) => typeof save.firstDayGuide[key] === "boolean"));
  }
  progress.firstDayGuide = save.version >= 7 ? {
    dismissed: save.firstDayGuide.dismissed,
    slimeHired: save.firstDayGuide.slimeHired,
    settlementSeen: save.firstDayGuide.settlementSeen,
  } : { dismissed: false, slimeHired: false, settlementSeen: progress.day > 1 };
  progress.firstDayGuide.slimeHired ||= [...progress.placements.values()]
    .some((slots) => slots.some((unit) => unit?.monster === MONSTERS[0]));
  progress.ledger = save.version >= 13 ? restoreLedger(save.ledger, progress, valid) : [];
  return { progress, savedAt: save.savedAt };
}

function renderSaveControls() {
  const message = byId("save-slot");
  let canLoad = false;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw === null) {
      message.textContent = "이 브라우저에 저장된 게임이 없습니다.";
    } else {
      const { progress, savedAt } = decodeSave(raw);
      canLoad = true;
      message.textContent = `${progress.dungeonName} · ${progress.day}일차 · ${new Date(savedAt).toLocaleString("ko-KR")}`;
    }
  } catch {
    message.textContent = "저장 데이터를 읽을 수 없습니다.";
  }
  byId("save-game").disabled = state.running;
  byId("load-game").disabled = state.running || !canLoad;
  byId("apply-names").disabled = state.running;
  byId("demon-name").disabled = state.running;
  byId("dungeon-name").disabled = state.running;
}

function openGameSettings() {
  byId("demon-name").value = state.demonName;
  byId("dungeon-name").value = state.dungeonName;
  byId("save-status").textContent = state.running ? "침입이 끝나면 이름 변경, 저장 및 불러오기가 가능합니다." : "";
  renderSaveControls();
  openDialog(byId("game-settings"));
  renderFirstDayGuide();
}

function applyNames() {
  const names = readNames(byId("demon-name").value, byId("dungeon-name").value);
  if (!names) {
    byId("save-status").textContent = "두 이름을 모두 1~24자로 입력하세요.";
    return false;
  }
  Object.assign(state, names);
  byId("demon-name").value = names.demonName;
  byId("dungeon-name").value = names.dungeonName;
  renderIdentity();
  return true;
}

function saveGame() {
  if (state.running) return;
  try {
    if (localStorage.getItem(SAVE_KEY) !== null && !window.confirm("기존 저장을 덮어쓸까요?")) return;
    if (!applyNames()) return;
    localStorage.setItem(SAVE_KEY, JSON.stringify(makeSave()));
    byId("save-status").textContent = "이름을 적용하고 게임을 저장했습니다.";
    renderSaveControls();
  } catch {
    byId("save-status").textContent = "게임을 저장하지 못했습니다. 브라우저의 저장 공간 설정을 확인하세요.";
  }
}

function loadGame() {
  if (state.running) return;
  let saved;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw === null) {
      renderSaveControls();
      byId("save-status").textContent = "저장된 게임이 없습니다.";
      return;
    }
    saved = decodeSave(raw);
  } catch {
    byId("save-status").textContent = "저장 데이터를 불러올 수 없습니다.";
    return;
  }
  if (!window.confirm("저장한 게임을 불러올까요? 저장하지 않은 진행은 사라집니다.")) return;
  const firstRoom = roomId(1, 1);
  Object.assign(state, saved.progress, { selectedRoom: firstRoom, selectedSlot: 0, selectedTrapRoom: firstRoom });
  throneRewardDraft = null;
  royalSelected = false;
  byId("victory-screen").hidden = true;
  selectedLedgerDay = null;
  byId("logs").replaceChildren();
  byId("raid-result").hidden = true;
  for (const unit of deployed()) {
    if (!unit.reviveAt) continue;
    const remaining = unit.reviveAt - Date.now();
    if (remaining > 0) startRevival(unit, remaining);
    else {
      unit.reviveAt = 0;
      unit.hp = unit.monster.hp;
    }
  }
  renderMap();
  byId("game-settings").close();
  renderManagement();
  byId("route-status").textContent = isBankrupt() ? "파산으로 운영이 종료되었습니다."
    : `저장한 게임을 불러왔습니다. · ${state.day}일차`;
  log("불러오기", `${state.dungeonName}의 ${state.day}일차 진행을 복원했습니다.`);
}

function renderIdentity() {
  byId("dungeon-title").textContent = state.dungeonName;
  const throne = byId("demon-health");
  throne.closest(".room").querySelector(".room-title").textContent = `${state.demonName}의 마왕방`;
  throne.setAttribute("aria-label", `${state.demonName} 체력`);
  throne.title = `${state.demonName} 체력 ${throne.value}/${throne.max}`;
}

function buildRoute(floors) {
  const route = [{ id: "start", label: "시작방" }];
  for (let floor = 1; floor <= floors; floor++) {
    for (let room = 1; room <= ROOMS_PER_FLOOR; room++) {
      route.push({ id: roomId(floor, room), label: `${floor}층 ${room}번 방` });
    }
  }
  return [...route, { id: "throne", label: `${floors}층 마왕방` }];
}

function expansionCost(floors) {
  return {
    gold: 200 * floors,
    stone: FIRST_EXPANSION_STONE * floors,
    iron: 2 * (floors - 1) ** 2,
    darkMatter: Math.ceil(Math.max(0, floors - 2) ** 3 / 2),
  };
}

function inferredGoalStage(progress) {
  if (progress.floors >= 3) return 3;
  if (progress.floors >= 2) return 2;
  return progress.day > 1 || progress.openingRewardClaimed ? 1 : 0;
}

function advanceManagementGoals() {
  const nextStage = inferredGoalStage(state);
  while (state.managementGoalStage < nextStage) {
    const title = MANAGEMENT_GOALS[state.managementGoalStage++];
    log("경영 목표 달성", title);
    if (state.managementGoalStage === MANAGEMENT_GOALS.length) {
      log("최종 목표 예고", "왕실 원정대 격퇴 · 왕실의 원정에 대비해 던전의 방어를 강화하세요.");
    }
  }
}

function renderManagementGoals() {
  const stage = state.managementGoalStage;
  byId("management-goal-progress").textContent = `${stage} / ${MANAGEMENT_GOALS.length} 달성`;
  const steps = byId("management-goal-steps");
  steps.replaceChildren();
  MANAGEMENT_GOALS.forEach((title, index) => {
    const status = index < stage ? "완료" : index === stage ? "진행 중" : "예정";
    const step = element("li", index < stage ? "goal-complete" : "", `${title} · ${status}`);
    if (index === stage) step.setAttribute("aria-current", "step");
    steps.append(step);
  });
  const title = byId("management-goal-current");
  const condition = byId("management-goal-condition");
  const detail = byId("management-goal-detail");
  if (stage === MANAGEMENT_GOALS.length) {
    title.textContent = "최종 목표 예고 · 왕실 원정대 격퇴";
    condition.textContent = "3층 운영 달성! 왕실의 원정에 대비해 던전의 방어를 강화하세요.";
    detail.textContent = "침입 사이 ‘왕실 원정대 도전’을 선택하세요. 원정대장 사망 시 격퇴 성공. 일반 침입으로 준비를 계속할 수 있습니다.";
  } else if (stage === 0) {
    title.textContent = "현재 목표 · 첫 정산";
    condition.textContent = "달성 조건 · 용사 침입을 한 번 마치고 일일 정산 완료";
    detail.textContent = `보상 · 골드 ${OPENING_REWARD_GOLD} + 석재 ${FIRST_EXPANSION_STONE}개 (최초 1회 자동 지급)${state.running ? " · 침입 진행 중" : " · ‘용사 침입 시작’을 눌러 도전하세요."}`;
  } else {
    const target = stage + 1;
    const cost = expansionCost(target - 1);
    title.textContent = `현재 목표 · ${MANAGEMENT_GOALS[stage]}`;
    condition.textContent = `달성 조건 · ${target}층으로 증축 (침입 종료 후 · 마왕 Lv. ${target} 이상 · ${resourceList(cost)})`;
    const resources = Object.entries(cost).filter(([, amount]) => amount > 0)
      .map(([key, amount]) => `${RESOURCES[key]} ${count(state[key])}/${count(amount)}`).join(" · ");
    detail.textContent = `현재 · ${state.floors}/${target}층 · 마왕 Lv. ${state.level}/${target} · ${resources}. 운영 관리의 ‘층 증축하기’를 사용하세요.${stage === 2 ? " 석재와 철은 작업장에서 슬라임과 스켈레톤으로 생산할 수 있습니다." : ""}`;
  }
  byId("hud-day").textContent = `${state.day}일차 · 마왕 Lv. ${state.level}`;
  byId("hud-goal").textContent = title.textContent;
  byId("hud-goal").title = `${condition.textContent} · ${detail.textContent}`;
}

// Follow actual game progress so playing ahead never requires replaying an action.
function firstDayGuideStep() {
  if (state.floors >= 2) return "complete";
  if (isBankrupt()) return "bankrupt";
  if (state.running) return "waiting";
  if (inferredGoalStage(state) >= 1) return state.firstDayGuide.settlementSeen ? "expand" : "settlement";
  if (state.firstDayGuide.slimeHired || deployed().some((unit) => unit.monster === MONSTERS[0])) return "raid";
  return "hire";
}

function renderFirstDayGuide() {
  const guide = byId("first-day-guide");
  const previousTarget = document.querySelector(".guide-target");
  previousTarget?.classList.remove("guide-target");
  guide.hidden = state.firstDayGuide.dismissed;
  byId("open-first-day-guide").setAttribute("aria-expanded", String(!guide.hidden));
  if (guide.hidden) return;

  const step = firstDayGuideStep();
  const dialog = topDialog();
  let host = byId("first-day-guide-home");
  let target = null;
  let heading = "";
  let text = "";
  const confirm = byId("confirm-first-settlement");
  confirm.hidden = true;
  if (step === "hire") {
    heading = "1 / 4 · 슬라임 고용";
    const emptySelection = !occupants(state.selectedRoom)[state.selectedSlot];
    if (dialog?.id === "monster-dialog" && emptySelection) {
      target = byId("monster-catalog").children[0].querySelector("button");
      text = target.disabled ? "슬라임 고용에는 35골드가 필요합니다. 운영 관리의 은행에서 자금을 마련할 수 있습니다."
        : "슬라임의 ‘고용’을 누르세요. 고용비는 35골드입니다.";
    } else {
      target = [...document.querySelectorAll(".slot-monster")].find((slot) =>
        !occupants(slot.closest(".room").dataset.room)[Number(slot.dataset.slot)]);
      text = "표시된 빈 몬스터 슬롯을 눌러 슬라임을 고용하세요.";
    }
  } else if (step === "raid") {
    heading = "2 / 4 · 용사 침입 시작";
    text = "‘용사 침입 시작’을 누르세요. 침입이 끝나면 자동으로 정산합니다.";
    target = byId("start-route");
    host = target.parentElement;
  } else if (step === "waiting") {
    heading = "2 / 4 · 침입 진행 중";
    text = "용사들이 탐색 중입니다. 침입이 끝나면 정산 결과를 안내합니다. 안내를 닫아도 침입은 계속됩니다.";
    host = byId("start-route").parentElement;
  } else if (step === "settlement") {
    heading = "3 / 4 · 첫 정산 확인";
    text = `첫 정산 보상 ${OPENING_REWARD_GOLD}골드와 석재 ${FIRST_EXPANSION_STONE}개가 자동 지급되었습니다. 결과를 확인하고 ‘정산 확인’을 누르세요. 이 재료로 2층을 증축할 수 있습니다.`;
    if (!byId("raid-result").hidden) host = byId("raid-result");
    confirm.hidden = false;
    target = confirm;
  } else if (step === "expand") {
    heading = "4 / 4 · 2층 증축";
    const blocker = expansionBlocker(expansionCost(state.floors));
    text = blocker ? `2층 증축에는 마왕 Lv. 2, 200골드와 석재 6개가 필요합니다. 현재 · ${blocker}`
      : "첫 정산에서 받은 재료를 사용해 ‘층 증축하기’를 누르세요. 200골드와 석재 6개를 사용합니다.";
    host = byId("expansion-guide-home");
    target = byId("expand-floor");
  } else if (step === "complete") {
    heading = "첫날 안내 완료 · 2층 증축 성공!";
    text = "이제 작업장과 방어실을 운영하며 던전을 키워 보세요. 운영 관리의 ‘첫날 안내’에서 언제든 다시 확인할 수 있습니다.";
    host = byId("expansion-guide-home");
  } else {
    heading = "운영 종료";
    text = "파산으로 운영이 종료되었습니다. ‘새 게임 시작’으로 다시 도전할 수 있습니다.";
    target = byId("restart-game");
  }
  // Keep the guide and its close control accessible inside native modal dialogs.
  if (dialog) {
    host = dialog;
    if (!dialog.contains(target)) {
      target = dialog.querySelector('form[method="dialog"] button');
      text = `이 창을 닫으면 다음 안내를 이어 볼 수 있습니다. ${text}`;
    }
  }
  if (guide.parentElement !== host) {
    if (dialog) dialog.querySelector(".dialog-heading").after(guide);
    else host.prepend(guide);
  }
  byId("first-day-guide-step").textContent = heading;
  byId("first-day-guide-text").textContent = text;
  if (target && !target.disabled) {
    target.classList.add("guide-target");
    if (target !== previousTarget && dialog) target.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
}

function closeFirstDayGuide() {
  state.firstDayGuide.dismissed = true;
  renderFirstDayGuide();
  const dialog = topDialog();
  (dialog?.querySelector('form[method="dialog"] button') || byId("open-operations")).focus();
}

function confirmFirstSettlement() {
  if (inferredGoalStage(state) < 1 || state.running) return;
  state.firstDayGuide.settlementSeen = true;
  if (byId("operations-dialog").showModal) openDialog(byId("operations-dialog"), byId("open-operations"));
  renderFirstDayGuide();
  document.querySelector(".guide-target")?.focus();
}

function element(tag, className, label) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (label) node.textContent = label;
  return node;
}

function makeHealthBar(name, max) {
  const bar = element("progress", "health-bar");
  bar.max = max;
  bar.value = max;
  bar.setAttribute("aria-label", `${name} 체력`);
  return bar;
}

function makeRoom(id, title, kind) {
  const room = element("div", `room room-${kind}`);
  room.dataset.room = id;
  room.append(element("strong", "room-title", title));
  if (kind === "normal") {
    const slots = element("div", "room-slots");
    for (let i = 0; i < MONSTER_SLOTS; i++) {
      const slot = element("button", "slot slot-monster");
      slot.type = "button";
      slot.dataset.slot = i;
      slot.setAttribute("aria-haspopup", "dialog");
      slot.addEventListener("click", () => {
        state.selectedRoom = id;
        state.selectedSlot = i;
        renderMonsters();
        openDialog(byId("monster-dialog"), slot);
        renderFirstDayGuide();
      });
      const pair = element("div", "monster-pair");
      pair.append(slot, element("div", "opponent-position"));
      slots.append(pair);
    }
    const trapSlot = element("button", "slot slot-trap");
    trapSlot.type = "button";
    trapSlot.dataset.trapSlot = "";
    trapSlot.setAttribute("aria-haspopup", "dialog");
    trapSlot.addEventListener("click", () => {
      state.selectedTrapRoom = id;
      renderTraps();
      openDialog(byId("trap-dialog"), trapSlot);
      renderFirstDayGuide();
    });
    slots.append(trapSlot);
    const workshopInfo = element("p", "workshop-info");
    const repair = element("button", "action workshop-repair", `장비 고치기 · ${REPAIR_COST}G`);
    repair.type = "button";
    repair.addEventListener("click", () => repairWorkshop(id));
    const safety = element("p", "workshop-safety");
    safety.id = `${id}-safety`;
    const support = element("button", "action workshop-support");
    support.type = "button";
    support.setAttribute("aria-describedby", safety.id);
    support.addEventListener("click", () => installWorkshopSupport(id));
    const conversionHelp = element("p", "workshop-conversion-help");
    conversionHelp.id = `${id}-conversion-help`;
    const convert = element("button", "action workshop-convert");
    convert.type = "button";
    convert.setAttribute("aria-describedby", conversionHelp.id);
    convert.addEventListener("click", () => convertRoom(id));
    const orders = element("label", "defense-order");
    orders.append(element("span", "", "전투 명령"));
    const select = element("select");
    select.setAttribute("aria-label", `${roomLabel(id)} 전투 명령`);
    const orderHelp = element("p", "defense-order-help");
    orderHelp.id = `${id}-order-help`;
    select.setAttribute("aria-describedby", orderHelp.id);
    for (const [value, name] of Object.entries(DEFENSE_ORDERS)) {
      const option = element("option", "", name);
      option.value = value;
      select.append(option);
    }
    select.addEventListener("change", () => setDefenseOrder(id, select.value));
    orders.append(select);
    const settings = element("details", "room-settings");
    settings.append(element("summary", "", "방 관리 · 전환 / 명령"), orders, orderHelp, safety, support, conversionHelp, convert);
    room.append(slots, workshopInfo, repair, settings);
  } else if (kind === "throne") {
    const portrait = element("img", "demon-lord");
    portrait.src = "assets/demon-lord.svg";
    portrait.alt = "뿔이 달린 투구와 망토를 두른 임시 마왕";
    const health = makeHealthBar("마왕", demonMaxHp());
    health.id = "demon-health";
    room.append(portrait, health);
  }
  room.append(element("div", "room-heroes"));
  return room;
}

function renderMap() {
  const map = byId("dungeon-map");
  const rows = [];
  for (let floor = state.floors; floor >= 1; floor--) {
    const row = element("section", "floor-grid");
    const title = element("h3", "floor-label", `${floor}층${floor === state.floors ? " · 꼭대기" : ""}`);
    row.append(title);
    if (floor === state.floors) {
      row.append(makeRoom("throne", "마왕방", "throne"));
    } else {
      row.append(element("p", "floor-transfer", `↗ ${floor + 1}층 오른쪽으로`));
    }
    for (let room = ROOMS_PER_FLOOR; room >= 1; room--) {
      row.append(makeRoom(roomId(floor, room), `${room}번 방`, "normal"));
    }
    rows.push(row);
  }
  const entry = element("div", "entry-grid");
  entry.append(makeRoom("start", "시작방 ↑", "start"));
  map.replaceChildren(...rows, entry);
  map.querySelector(`[data-room="${mapSelection.room}"]`)?.classList?.toggle("room-selected", true);
}

const occupants = (id) => state.placements.get(id) ?? [];
const defenseOrder = (id) => state.defenseOrders.get(id) ?? "all";
const slotCanEngage = (id, slot, hero) => defenseOrder(id) !== "honor" || slot !== 1 || Boolean(hero.honor);

function setDefenseOrder(id, order) {
  const match = /^floor-([1-9]\d*)-room-([1-9]\d*)$/.exec(id);
  if (state.running || isBankrupt() || state.workshops.has(id) || typeof order !== "string" || !Object.hasOwn(DEFENSE_ORDERS, order)
      || !match || +match[1] > state.floors || +match[2] > ROOMS_PER_FLOOR) return;
  if (order === "all") state.defenseOrders.delete(id);
  else state.defenseOrders.set(id, order);
  log("전투 명령", `${roomLabel(id)} · ${DEFENSE_ORDERS[order]}`);
  renderManagement();
}

const deployed = () => [...state.placements.values()].flat().filter(Boolean);
const dailyUpkeep = () => deployed().reduce((total, unit) => total + unit.monster.upkeep, 0);
const wait = (ms) => new Promise((resolve) => gameTimer(resolve, ms));

const spriteUrl = (sprite, pose) => `assets/sprites/${sprite}-${pose}.png`;

function setPose(image, pose) {
  if (image.dataset.pose === pose) return;
  image.dataset.pose = pose;
  image.src = spriteUrl(image.dataset.sprite, pose);
}

function makeSprite(sprite, pose = "idle") {
  const image = element("img", "sprite");
  image.alt = "";
  image.draggable = false;
  image.dataset.sprite = sprite;
  setPose(image, pose);
  return image;
}

function showSlotSprite(button, sprite, label, pose = "idle") {
  const image = button.querySelector(".sprite");
  if (!sprite) button.textContent = label;
  else if (image?.dataset.sprite === sprite) setPose(image, pose);
  else button.replaceChildren(makeSprite(sprite, pose));
  button.title = label;
}

const trapMotion = new Map();

function animateTrap(step) {
  const image = byId("dungeon-map").querySelector(`[data-room="${step.id}"] [data-trap-slot] .sprite`);
  if (!image) return;
  cancelGameTimer(trapMotion.get(image));
  setPose(image, "active");
  trapMotion.set(image, gameTimer(() => {
    setPose(image, "idle");
    trapMotion.delete(image);
  }, STEP_MS));
}

function refreshSlots() {
  for (const button of byId("dungeon-map").querySelectorAll("[data-slot]")) {
    const id = button.closest("[data-room]").dataset.room;
    const index = Number(button.dataset.slot);
    const unit = occupants(id)[index];
    const status = unit
      ? `${unit.monster.name}${unit.reviveAt ? " · 부활 중" : unit.opponent ? ` · ${unit.opponent.name} 상대 중`
        : !state.workshops.has(id) && index === 1 && defenseOrder(id) === "honor" ? " · 명예 용사 대기" : ""}`
      : `빈 슬롯 ${index + 1}`;
    showSlotSprite(button, unit?.monster.sprite, status, unit?.attacking ? "attack" : "idle");
    if (unit) {
      let health = button.querySelector(".health-bar");
      if (!health) {
        health = makeHealthBar(unit.monster.name, unit.monster.hp);
        button.append(health);
      }
      health.value = unit.hp;
      button.title = `${status} · 체력 ${unit.hp}/${unit.monster.hp}`;
    }
    button.dataset.downed = String(Boolean(unit?.reviveAt));
    button.closest("[data-room]").classList.toggle("room-combat", occupants(id).some((entry) => entry?.opponent));
    const [, floor, , room] = id.split("-");
    button.setAttribute("aria-label", `${floor}층 ${room}번 방, 슬롯 ${index + 1}: ${button.title}`);
  }
}

function resourceList(amounts) {
  return Object.entries(amounts).map(([resource, amount]) =>
    `${RESOURCES[resource]} ${count(amount)}`).join(" · ");
}

function workshopWorkers(id) {
  return occupants(id).filter((unit) => unit && !unit.reviveAt);
}

function workshopSupportBlocker(id) {
  const workshop = state.workshops.get(id);
  if (!workshop) return "작업장 필요";
  if (workshop.supported) return "이미 설치됨";
  if (isBankrupt()) return "운영 종료";
  if (state.running) return "침입 중 설치 불가";
  if (!occupants(id).some((unit) => unit && unit.monster.resource !== "gold")) return "채굴 몬스터 필요";
  if (state.iron < SUPPORT_IRON_COST) return "철 부족";
  return "";
}

function installWorkshopSupport(id) {
  if (workshopSupportBlocker(id)) return;
  recordTransaction("build", "작업장 지지대 설치", 0, 0, { iron: -SUPPORT_IRON_COST });
  state.iron -= SUPPORT_IRON_COST;
  state.workshops.get(id).supported = true;
  log("지지대 설치", `${roomLabel(id)} · 철 ${SUPPORT_IRON_COST}개 지불 · 붕괴 시 1회 소모하여 방 안의 몬스터 전원 보호`);
  renderManagement();
}

function workshopOutput(workers, broken = false) {
  const output = {};
  for (const { monster } of workers) {
    const amount = monsterProduction(monster, broken);
    output[monster.resource] = (output[monster.resource] ?? 0) + amount;
  }
  return output;
}

function renderWorkshops() {
  for (const room of byId("dungeon-map").querySelectorAll(".room-normal")) {
    const id = room.dataset.room;
    const workshop = state.workshops.get(id);
    const info = room.querySelector(".workshop-info");
    const repair = room.querySelector(".workshop-repair");
    const safety = room.querySelector(".workshop-safety");
    const support = room.querySelector(".workshop-support");
    const conversionHelp = room.querySelector(".workshop-conversion-help");
    const convert = room.querySelector(".workshop-convert");
    room.classList.toggle("room-workshop", Boolean(workshop));
    room.classList.toggle("room-broken", Boolean(workshop?.broken || workshop?.collapsed));
    room.dataset.condition = workshop?.collapsed ? "⚠ 갱도 붕괴 · 생산 중단" : workshop?.broken ? "⚠ 장비 고장" : "";
    room.querySelector(".room-title").textContent = `${id.split("-").at(-1)}번 방${workshop ? " · 작업장" : ""}`;
    room.querySelector("[data-trap-slot]").hidden = Boolean(workshop);
    const orders = room.querySelector(".defense-order");
    const select = orders.querySelector("select");
    orders.hidden = Boolean(workshop);
    select.value = defenseOrder(id);
    select.disabled = state.running || isBankrupt() || Boolean(workshop);
    const orderHelp = room.querySelector(".defense-order-help");
    orderHelp.hidden = Boolean(workshop);
    orderHelp.textContent = defenseOrder(id) === "honor"
      ? "2번 슬롯은 명예 용사만 상대합니다. 일반 용사를 막을 몬스터가 없으면 통과시킵니다."
      : "빈 수비 몬스터가 모든 용사를 상대합니다.";
    info.hidden = !workshop;
    repair.hidden = !workshop?.broken || workshop.collapsed;
    repair.disabled = isBankrupt() || state.gold < REPAIR_COST;
    safety.hidden = support.hidden = conversionHelp.hidden = !workshop;
    if (workshop) {
      safety.textContent = `지지대 ${workshop.supported ? "보유 · 붕괴 1회 보호" : "없음"} · 보유 철 ${count(state.iron)}개 · 설치 비용 철 ${SUPPORT_IRON_COST}개. 붕괴 시 몬스터 전원 생존, 당일 생산 중단 후 다음 날 복귀.`;
      support.disabled = Boolean(workshopSupportBlocker(id));
      support.textContent = workshop.supported ? "지지대 설치됨" : `지지대 설치 · 철 ${SUPPORT_IRON_COST}개`;
      support.title = workshopSupportBlocker(id);
      conversionHelp.textContent = workshop.supported
        ? "빈 방을 방어실로 전환하면 지지대가 철거되며, 철은 반환되지 않습니다."
        : "몬스터를 모두 해제하면 빈 방을 방어실로 전환할 수 있습니다.";
    }
    convert.textContent = workshop ? "방어실로 전환" : "작업장으로 전환";
    const occupied = occupants(id).some(Boolean) || state.traps.has(id);
    convert.disabled = state.running || isBankrupt() || occupied;
    convert.title = occupied ? "배치된 몬스터와 함정을 먼저 해제하세요." : "";
    if (!workshop) continue;

    const workers = occupants(id).filter(Boolean);
    const active = workshopWorkers(id);
    const names = workers.map((unit) => `${unit.monster.name}${unit.reviveAt ? " (부활 중)" : ""}`).join(", ");
    const output = resourceList(workshopOutput(active, workshop.broken));
    info.textContent = `${names || "배치된 몬스터 없음"} · ${workshop.collapsed ? "갱도 붕괴 · 오늘 생산 중단"
      : `하루 ${output || "생산 없음"}${state.research.mining ? " · 채굴 도구 적용 (석재·철 +50%)" : ""}${workshop.broken ? " · 장비 고장 (연구 적용량의 50%, 소수점 버림)" : ""}`}`;
  }
}

function convertRoom(id) {
  if (state.running || isBankrupt() || occupants(id).some(Boolean) || state.traps.has(id)) return;
  const workshop = state.workshops.get(id);
  if (workshop) {
    if (workshop.supported && !window.confirm(`${roomLabel(id)}을(를) 빈 방어실로 전환하면 지지대가 철거되고 철 ${SUPPORT_IRON_COST}개는 반환되지 않습니다. 전환할까요?`)) return;
    state.workshops.delete(id);
  } else {
    state.workshops.set(id, { broken: false, collapsed: false, supported: false });
  }
  log("방 전환", `${roomLabel(id)} · ${workshop ? "방어실" : "작업장"}로 전환`);
  renderManagement();
}

function repairWorkshop(id) {
  const workshop = state.workshops.get(id);
  if (isBankrupt() || !workshop?.broken || workshop.collapsed || state.gold < REPAIR_COST) return;
  recordTransaction("repair", `${roomLabel(id)} · 장비 수리`, -REPAIR_COST);
  state.gold -= REPAIR_COST;
  workshop.broken = false;
  log("장비 수리", `${roomLabel(id)} · ${REPAIR_COST}골드 지불 · 정상 생산 재개`);
  renderManagement();
}

function rollWorkshopAccidents() {
  for (const [id, workshop] of state.workshops) {
    const workers = workshopWorkers(id);
    if (!workers.length) continue;
    const roll = Math.random();
    const collapseRate = workers.some(({ monster }) => monster.resource !== "gold") ? COLLAPSE_RATE : 0;
    if (roll < collapseRate) {
      const lost = resourceList(workshopOutput(workers, workshop.broken));
      const names = occupants(id).filter(Boolean).map(({ monster }) => monster.name).join(", ");
      const protectedBySupport = workshop.supported;
      if (protectedBySupport) workshop.supported = false;
      else state.placements.delete(id);
      workshop.collapsed = true;
      workshop.broken = false;
      log("갱도 붕괴", `${roomLabel(id)} · 당일 생산 손실 ${lost} · ${protectedBySupport
        ? `지지대 1개 소모 · 생존 ${names} · 오늘 생산 중단, 다음 날 작업 복귀`
        : `사망 ${names} (부활 불가)`}`);
    } else if (!workshop.broken && roll < collapseRate + BREAKDOWN_RATE) {
      workshop.broken = true;
      log("장비 고장", `${roomLabel(id)} · 수리 전까지 생산량 50% 감소`);
    }
  }
}

function collectWorkshopProduction() {
  for (const [id, workshop] of state.workshops) {
    if (workshop.collapsed) {
      workshop.collapsed = false;
      continue;
    }
    const workers = workshopWorkers(id);
    if (!workers.length) continue;
    const output = workshopOutput(workers, workshop.broken);
    recordTransaction("production", `${roomLabel(id)} · 작업장 생산`, output.gold || 0, 0, Object.fromEntries(Object.entries(output).filter(([key]) => key !== "gold")));
    for (const [resource, amount] of Object.entries(output)) state[resource] += amount;
    const normal = workshop.broken ? workshopOutput(workers) : null;
    const loss = normal ? resourceList(Object.fromEntries(Object.entries(normal)
      .map(([resource, amount]) => [resource, amount - output[resource]]))) : "";
    log("작업장 생산", `${roomLabel(id)} · 획득 ${resourceList(output)}${loss ? ` · 고장으로 손실 ${loss}` : ""}`);
  }
}

function renderMonsters() {
  refreshSlots();
  const [, floor, , room] = state.selectedRoom.split("-");
  const unit = occupants(state.selectedRoom)[state.selectedSlot];
  const workshop = state.workshops.has(state.selectedRoom);
  byId("placement-title").textContent = `${floor}층 ${room}번 방 · ${workshop ? "작업장" : "방어실"} 슬롯 ${state.selectedSlot + 1}`;
  byId("monster-summary").textContent = `배치 ${deployed().length} / ${state.floors * ROOMS_PER_FLOOR * MONSTER_SLOTS} · 하루 유지비 ${count(dailyUpkeep())}골드`;
  byId("placement-status").textContent = state.running ? "침입이 끝나면 배치를 변경할 수 있습니다."
    : unit ? `${unit.monster.name} 배치됨${unit.reviveAt ? " · 부활 대기 중" : ""}`
    : "빈 슬롯입니다. 아래에서 몬스터를 고용하세요.";
  if (!workshop) byId("placement-status").textContent += ` · 수비 부활 ${revivalDelay(state.traps.get(state.selectedRoom)) / 1000}초${state.research.revival ? " (부활 의식 적용)" : ""} · 다음 처치부터 적용`;
  byId("dismiss-monster").disabled = state.running || isBankrupt() || !unit;
  byId("dismiss-monster").hidden = !unit;
  const moveForm = byId("monster-move-form");
  moveForm.hidden = !unit || state.running || isBankrupt();
  if (!moveForm.hidden) {
    const destination = byId("monster-move-target");
    const previous = destination.value;
    destination.replaceChildren(element("option", "", "이동할 빈 슬롯 선택"));
    destination.options[0].value = "";
    for (const step of buildRoute(state.floors).slice(1, -1)) {
      for (let slot = 0; slot < MONSTER_SLOTS; slot++) {
        if (occupants(step.id)[slot]) continue;
        const type = state.workshops.has(step.id) ? "작업장" : "방어실";
        const option = element("option", "", `${step.label} · ${type} 슬롯 ${slot + 1}`);
        option.value = `${step.id}:${slot}`;
        destination.append(option);
      }
    }
    if ([...destination.options].some((option) => option.value === previous)) destination.value = previous;
    destination.disabled = destination.options.length === 1;
    byId("move-monster").disabled = destination.disabled;
    if (destination.disabled) destination.options[0].textContent = "이동할 빈 슬롯이 없습니다.";
  }
  for (const [index, monster] of MONSTERS.entries()) {
    const card = byId("monster-catalog").children[index];
    card.hidden = Boolean(unit && unit.monster !== monster);
    const locked = state.level < monster.level;
    const broken = Boolean(workshop && state.workshops.get(state.selectedRoom).broken);
    card.querySelector(".production-meta").textContent = `작업장 생산 · ${RESOURCES[monster.resource]} ${monsterProduction(monster, broken)}/일${broken ? " (고장 적용)" : " (정상)"}${state.research.mining && ["stone", "iron"].includes(monster.resource) ? " · 채굴 도구 적용" : ""}`;
    const button = card.querySelector("button");
    button.disabled = locked || Boolean(unit) || state.running || isBankrupt() || state.gold < monster.hire;
    button.textContent = locked ? `Lv. ${monster.level} 해금`
      : state.gold < monster.hire ? "골드 부족" : "고용";
  }
}

function moveMonster(event) {
  event.preventDefault();
  const source = state.selectedRoom;
  const slots = occupants(source);
  const unit = slots[state.selectedSlot];
  if (state.running || isBankrupt() || !unit) return;
  const [target, slot] = byId("monster-move-target").value.split(":");
  const index = Number(slot);
  if (!Number.isInteger(index) || index < 0 || index >= MONSTER_SLOTS
      || !buildRoute(state.floors).slice(1, -1).some((step) => step.id === target)) return;
  const targetSlots = occupants(target);
  if (targetSlots[index]) return;
  slots[state.selectedSlot] = null;
  targetSlots[index] = unit;
  state.placements.set(target, targetSlots);
  if (!slots.some(Boolean)) state.placements.delete(source);
  state.selectedRoom = target;
  state.selectedSlot = index;
  log("몬스터 이동", `${unit.monster.name} · ${roomLabel(source)} → ${roomLabel(target)} 슬롯 ${index + 1}`);
  renderManagement();
}

function hireMonster(monster) {
  const slots = occupants(state.selectedRoom);
  if (state.running || isBankrupt() || state.level < monster.level || state.gold < monster.hire || slots[state.selectedSlot]) return;
  recordTransaction("hire", `${roomLabel(state.selectedRoom)} · ${monster.name} 고용`, -monster.hire);
  state.gold -= monster.hire;
  slots[state.selectedSlot] = { monster, hp: monster.hp, reviveAt: 0 };
  state.placements.set(state.selectedRoom, slots);
  if (monster === MONSTERS[0]) state.firstDayGuide.slimeHired = true;
  log("몬스터 고용", `${monster.name} 배치 · ${monster.hire}골드 지불`);
  renderManagement();
}

function dismissMonster() {
  const slots = occupants(state.selectedRoom);
  const unit = slots[state.selectedSlot];
  if (state.running || isBankrupt() || !unit) return;
  slots[state.selectedSlot] = null;
  if (!slots.some(Boolean)) state.placements.delete(state.selectedRoom);
  log("몬스터 해고", `${unit.monster.name}의 배치를 해제했습니다.`);
  renderManagement();
}

function buildMonsterCatalog() {
  for (const monster of MONSTERS) {
    const card = element("li", "monster-card");
    const hire = element("button", "action");
    hire.type = "button";
    hire.addEventListener("click", () => hireMonster(monster));
    card.append(makeSprite(monster.sprite), element("strong", "", monster.name),
      element("span", "monster-meta", `체력 ${monster.hp} · 공격 ${monster.attack}`),
      element("span", "monster-meta", `고용 ${monster.hire}G · 유지 ${monster.upkeep}G/일`),
      element("span", "monster-meta production-meta"), hire);
    byId("monster-catalog").append(card);
  }
}

function buildTrapCatalog() {
  for (const trap of TRAPS) {
    const card = element("li", "monster-card");
    const install = element("button", "action");
    install.type = "button";
    install.addEventListener("click", () => installTrap(trap));
    card.append(makeSprite(trap.sprite), element("strong", "", trap.name),
      element("span", "monster-meta", trapEffect(trap)),
      element("span", "monster-meta", `설치 ${trap.cost}G · 마왕 Lv. ${trap.level} 해금`), install);
    byId("trap-catalog").append(card);
  }
  for (const modification of SPIKE_MODIFICATIONS) {
    const card = element("li", "monster-card");
    const button = element("button", "action");
    button.type = "button";
    button.addEventListener("click", () => modifyTrap(modification.id));
    card.append(makeSprite("trap-1"), element("strong", "", modification.name),
      element("span", "monster-meta", modification.change),
      element("span", "monster-meta", `개조 비용 · 철 ${modification.iron}개`), button);
    byId("trap-modification-catalog").append(card);
  }
}

function renderTraps() {
  const room = state.selectedTrapRoom;
  const installed = state.traps.get(room);
  for (const button of byId("dungeon-map").querySelectorAll("[data-trap-slot]")) {
    const id = button.closest("[data-room]").dataset.room;
    const [, floor, , number] = id.split("-");
    const trap = state.traps.get(id);
    const label = trap?.name ?? "빈 함정";
    const image = button.querySelector(".sprite");
    showSlotSprite(button, trap?.sprite, label, trapMotion.has(image) ? "active" : "idle");
    if (trap) button.title = `${label} · ${trapEffect(trap)}`;
    button.setAttribute("aria-label", `${floor}층 ${number}번 방 함정: ${label}`);
  }
  const [, floor, , number] = room.split("-");
  byId("trap-placement-title").textContent = `${floor}층 ${number}번 방 · 함정 슬롯`;
  byId("trap-summary").textContent = `설치 ${state.traps.size} / ${state.floors * ROOMS_PER_FLOOR * TRAP_SLOTS} · 보유 철 ${count(state.iron)}개 · 철거 시 개조도 사라지며 비용은 반환되지 않습니다.`;
  byId("trap-placement-status").textContent = state.running ? "침입이 끝나면 함정을 변경할 수 있습니다."
    : installed && !trapFloorUnlocked(installed) ? "던전을 3층까지 증축하면 설치된 함정이 작동합니다."
    : installed ? `${installed.name} 설치됨 · ${trapEffect(installed)}${installed.modification ? " · 개조 완료 (변경 불가)" : ""}`
    : "빈 슬롯입니다. 아래에서 함정을 설치하세요.";
  byId("remove-trap").disabled = state.running || isBankrupt() || !installed;
  byId("remove-trap").hidden = !installed;
  for (const [index, trap] of TRAPS.entries()) {
    const card = byId("trap-catalog").children[index];
    card.hidden = Boolean(installed && installed.id !== trap.id);
    card.querySelector("strong").textContent = installed?.id === trap.id ? installed.name : trap.name;
    card.querySelector(".monster-meta").textContent = trapEffect(installed?.id === trap.id ? installed : trap);
    const button = card.querySelector("button");
    const locked = state.level < trap.level;
    const floorLocked = !trapFloorUnlocked(trap);
    button.disabled = locked || floorLocked || Boolean(installed) || state.running || isBankrupt() || state.gold < trap.cost;
    button.textContent = installed?.id === trap.id ? "설치됨" : floorLocked ? "던전 3층 필요" : locked ? `Lv. ${trap.level} 해금` : state.gold < trap.cost ? "골드 부족" : "설치";
  }
  byId("trap-modifications").hidden = installed?.id !== "spikes";
  byId("trap-modification-help").textContent = installed?.modification
    ? `${installed.name} 개조 완료 · 다른 개조로 변경할 수 없습니다.`
    : "설치된 가시 바닥을 한 번만 개조할 수 있습니다. 두 효과 중 하나를 선택하세요.";
  for (const [index, modification] of SPIKE_MODIFICATIONS.entries()) {
    const button = byId("trap-modification-catalog").children[index].querySelector("button");
    button.disabled = state.running || isBankrupt() || installed?.id !== "spikes" || Boolean(installed?.modification)
      || state.workshops.has(room) || state.iron < modification.iron;
    button.textContent = installed?.modification === modification.id ? "선택됨"
      : installed?.modification ? "변경 불가" : state.running ? "침입 중"
      : state.iron < modification.iron ? "철 부족" : "개조";
    button.setAttribute("aria-label", `${modification.name} 개조 · 철 ${modification.iron}개 · ${button.textContent}`);
  }
}

function modifyTrap(modificationId) {
  const room = state.selectedTrapRoom;
  const trap = state.traps.get(room);
  const modification = SPIKE_MODIFICATIONS.find((item) => item.id === modificationId);
  if (state.running || isBankrupt() || state.workshops.has(room) || trap?.id !== "spikes" || trap.modification
      || !modification || state.iron < modification.iron) return;
  recordTransaction("build", `${modification.name} 개조`, 0, 0, { iron: -modification.iron });
  state.iron -= modification.iron;
  state.traps.set(room, modifiedSpikes(trap, modification));
  log("함정 개조", `${roomLabel(room)} · ${modification.name} · 철 ${modification.iron}개 지불 · ${modification.change}`);
  renderManagement();
}

function installTrap(trap) {
  const room = state.selectedTrapRoom;
  if (state.running || isBankrupt() || state.workshops.has(room) || state.traps.has(room)
      || !trapFloorUnlocked(trap) || state.level < trap.level || state.gold < trap.cost) return;
  recordTransaction("build", `${roomLabel(state.selectedTrapRoom)} · ${trap.name} 설치`, -trap.cost);
  state.gold -= trap.cost;
  state.traps.set(room, trap);
  log("함정 설치", `${trap.name} 설치 · ${trap.cost}골드 지불`);
  renderManagement();
}

function removeTrap() {
  const room = state.selectedTrapRoom;
  const trap = state.traps.get(room);
  if (state.running || isBankrupt() || !trap) return;
  state.traps.delete(room);
  log("함정 철거", `${trap.name}을(를) 철거했습니다.`);
  renderManagement();
}

function renderPanel(target, title, description, entries) {
  const panel = byId("panel-template").content.cloneNode(true);
  panel.querySelector("h3").textContent = title;
  panel.querySelector("p").textContent = description;
  for (const [label, value] of entries) {
    const stat = byId("stat-template").content.cloneNode(true);
    stat.querySelector("dt").textContent = label;
    stat.querySelector("dd").textContent = value;
    panel.querySelector("dl").append(stat);
  }
  byId(target).replaceChildren(panel);
}

function log(category, message, kind = "management") {
  const time = new Date().toTimeString().slice(0, 5);
  const row = byId("log-template").content.cloneNode(true);
  row.querySelector("li").dataset.kind = kind;
  row.querySelector("time").dateTime = time;
  row.querySelector("time").textContent = time;
  row.querySelector(".log-category").textContent = category;
  row.querySelector(".log-message").textContent = message;
  byId("logs").prepend(row);
  if (/고장|붕괴|침입 종료|정산|목표 달성|수리|고용 완료|증축 완료|최종 방어/.test(category)) showMapNotice(category, message);
  while (byId("logs").children.length > 200) byId("logs").lastElementChild.remove();
}

function expansionBlocker(cost) {
  const blockers = [];
  if (isBankrupt()) blockers.push("운영 종료");
  if (state.running) blockers.push("침입 종료 후 증축 가능");
  if (state.level <= state.floors) blockers.push(`마왕 Lv. ${state.floors + 1} 필요`);
  const missing = Object.entries(cost).filter(([resource, amount]) => state[resource] < amount)
    .map(([resource, amount]) => [resource, amount - state[resource]]);
  if (missing.length) blockers.push(`부족 · ${resourceList(Object.fromEntries(missing))}`);
  return blockers.join(" / ");
}

function raidProfile(progress = state) {
  const baseSize = Math.min(STANDARD_RAID_SIZE, STARTING_RAID_SIZE + progress.level - 1);
  const size = Math.min(MAX_RAID_SIZE, baseSize + Math.floor((progress.popularity + Math.floor(progress.throneReward / 50)) / 2));
  const rewardTier = Math.floor(progress.throneReward / 250);
  const infamyHonor = Math.min(Math.ceil(progress.infamy / 4), Math.floor(size / 4));
  const honorCount = Math.min(infamyHonor + rewardTier, Math.floor(size / 2));
  const honorPower = Math.min(200, 140 + 10 * Math.floor(Math.max(0, progress.infamy - 1) / 4) + 5 * rewardTier);
  return { size, honorCount, honorPower };
}

function throneRewardEstimate(reward) {
  const { size, honorCount } = royalSelected && state.floors >= 3
    ? { size: royalRaidRoster().length, honorCount: royalRaidRoster().length }
    : raidProfile({ ...state, throneReward: reward });
  return { reward, size, honorCount, toll: size * HERO_TOLL, maximum: reward * size };
}

function validThroneReward() {
  const reward = byId("throne-reward").valueAsNumber;
  return Number.isInteger(reward) && reward >= 0 && reward <= MAX_THRONE_REWARD;
}

function renderThroneRewardPreview() {
  const current = throneRewardEstimate(state.throneReward);
  const proposed = validThroneReward() ? throneRewardEstimate(byId("throne-reward").valueAsNumber) : null;
  for (const [column, estimate] of [["current", current], ["proposed", proposed]]) {
    for (const [key, unit] of [["reward", "골드"], ["size", "명"], ["honorCount", "명"], ["toll", "골드"], ["maximum", "골드"]]) {
      byId(`reward-${column}-${key}`).textContent = estimate ? `${count(estimate[key])}${unit}` : "—";
    }
  }
  byId("apply-throne-reward").disabled = state.running || isBankrupt() || !proposed;
  const status = byId("throne-reward-status");
  if (!proposed) {
    status.textContent = `0~${count(MAX_THRONE_REWARD)} 사이의 정수 골드를 입력하세요. 실제 보상은 1인당 ${count(state.throneReward)}골드로 유지됩니다.`;
  } else if (proposed.reward === current.reward) {
    status.textContent = "현재 적용된 보상과 같습니다. 금액을 입력하면 적용 전 예상 변화를 비교할 수 있습니다.";
  } else {
    const delta = (value) => `${value > 0 ? "+" : ""}${count(value)}`;
    status.textContent = `적용 시 변화 · 용사 ${delta(proposed.size - current.size)}명 (명예 ${delta(proposed.honorCount - current.honorCount)}명) · 통행료 ${delta(proposed.toll - current.toll)}골드 · 최대 지급액 ${delta(proposed.maximum - current.maximum)}골드. 보상 적용 전까지 실제 보상과 정찰 보고는 유지됩니다.`;
  }
}

function renderThroneRewardControls() {
  const input = byId("throne-reward");
  input.value = throneRewardDraft ?? state.throneReward;
  input.max = MAX_THRONE_REWARD;
  input.disabled = state.running || isBankrupt();
  renderThroneRewardPreview();
}

function previewThroneReward() {
  throneRewardDraft = byId("throne-reward").value;
  renderThroneRewardPreview();
}

function applyThroneReward(event) {
  event.preventDefault();
  if (state.running || isBankrupt() || !validThroneReward()) return;
  state.throneReward = byId("throne-reward").valueAsNumber;
  throneRewardDraft = null;
  renderManagement();
}

// Saved progression fully determines the roster: viewing and loading never reroll it.
// Combat takes one snapshot before starting so mid-raid infamy cannot change entrants.
function nextRaidRoster(progress = state) {
  const { size, honorCount, honorPower } = raidProfile(progress);
  const combatLevel = Math.min(progress.level, COMBAT_LEVEL_CAP);
  const earlyLevels = Math.max(0, STANDARD_HERO_STATS_LEVEL - combatLevel);
  const baseHp = (70 + (combatLevel - 1) * 6 - earlyLevels * 4) * HEALTH_MULTIPLIER;
  const baseAttack = 14 + (combatLevel - 1) * 2 - earlyLevels;
  return Array.from({ length: size }, (_, index) => {
    const heroClass = HERO_CLASSES[(index + progress.day - 1) % HERO_CLASSES.length];
    const rotatedIndex = (index + progress.day) % size;
    const honor = Math.floor((rotatedIndex + 1) * honorCount / size) > Math.floor(rotatedIndex * honorCount / size);
    return {
      ...heroClass, order: index + 1, honor,
      name: honor ? `명예 용사 · ${heroClass.name}` : heroClass.name,
      maxHp: honor ? Math.ceil(baseHp * honorPower / 100) : baseHp,
      attack: honor ? Math.ceil(baseAttack * honorPower / 100) : baseAttack,
    };
  });
}

function royalRaidRoster() {
  if (!royalSelected || state.floors < 3) return nextRaidRoster();
  // Fixed endgame army: no day, level, reward, infamy or popularity scaling.
  const guards = Array.from({ length: 12 }, (_, index) => ({
    ...HERO_CLASSES[index % HERO_CLASSES.length], order: index + 1,
    name: `왕실 정예 · ${HERO_CLASSES[index % HERO_CLASSES.length].name}`,
    honor: true, maxHp: 200, attack: 24,
  }));
  return [...guards, { ...HERO_CLASSES[0], order: 13,
    name: "왕실 원정대장", captain: true, honor: true,
    maxHp: 600, attack: 40 }];
}

function damageHero(hero, damage) {
  if (hero.captain && hero.shieldReady && damage > 0) {
    damage = Math.ceil(damage / 2);
    hero.shieldReady = false;
    log("왕실 방패", `${hero.name} · 다음 피해 50% 감소`, "intrusion");
  }
  const before = hero.hp;
  hero.hp = Math.max(0, hero.hp - damage);
  if (hero.captain && !hero.shieldUsed && hero.hp <= hero.maxHp / 2) {
    hero.shieldUsed = true;
    hero.shieldReady = true;
    log("왕실 방패 준비", `${hero.name} · 체력 절반 이하 · 다음 피해 50% 감소 (1회)`, "intrusion");
  }
  return before - hero.hp;
}

function renderRoyalChallenge() {
  const choice = byId("royal-challenge-choice");
  choice.hidden = state.floors < 3;
  byId("royal-challenge").disabled = state.running || isBankrupt();
  byId("royal-challenge").checked = royalSelected && state.floors >= 3;
  byId("royal-history").textContent = state.royalHistory.map((entry) =>
    `${entry.day}일차 왕실 원정대 · ${entry.demonDefeated ? "방어 실패" : "마왕 생존"} · 원정대장 ${entry.outcome} · 방패 ${entry.shieldUsed ? "발동" : "미발동"}`).join(" / ");
}

function scoutAdvice(hero) {
  if (hero.captain) return "앞선 용사들 뒤에 입장. 체력이 처음 50% 이하가 되면 방패를 한 번 들어 다음 피해를 50% 줄입니다. 기존 이동·함정·교전·도망 규칙을 따릅니다.";
  const rooms = [];
  for (let floor = 1; floor <= state.floors; floor++) {
    for (let room = 1; room <= ROOMS_PER_FLOOR; room++) {
      const id = roomId(floor, room);
      const units = state.workshops.has(id) ? [] : occupants(id)
        .filter((unit, slot) => unit && slotCanEngage(id, slot, hero));
      rooms.push({ id, units, trap: state.traps.get(id) });
    }
  }
  const defended = rooms.filter((room) => room.units.length);
  const gap = rooms.find((room) => !room.units.length);
  let trait;
  let caution;
  if (hero.teleportChance) {
    trait = "일반방마다 25% 확률로 방 하나의 함정·전투를 순간이동으로 건너뜀";
    const focus = rooms.reduce((best, room) =>
      room.units.length + Number(Boolean(room.trap)) > best.units.length + Number(Boolean(best.trap)) ? room : best);
    caution = focus.units.length || focus.trap
      ? `${roomLabel(focus.id)}의 방어도 건너뛸 수 있으니 여러 방에 방어를 분산하세요`
      : "현재 일반방에 몬스터와 함정이 없어 마왕방까지 막을 방어가 없습니다";
  } else if (hero.dodgeChance) {
    trait = "몬스터 공격을 25% 확률로 회피";
    const spikes = rooms.find((room) => room.trap?.damage);
    caution = spikes ? `${roomLabel(spikes.id)}의 ${spikes.trap.name} 입장 피해는 회피하지 못합니다`
      : defended.length ? "현재 가시 바닥이 없어 몬스터 공격이 회피되면 격퇴가 늦어질 수 있습니다"
        : "현재 수비 몬스터와 가시 바닥이 없어 마왕방까지 압박이 적습니다";
  } else if (hero.criticalChance) {
    trait = "반격할 때 25% 확률로 두 배 피해";
    const vulnerable = defended.flatMap((room) => room.units.map((unit) => ({ room, unit })))
      .sort((a, b) => a.unit.monster.hp - b.unit.monster.hp)[0];
    caution = vulnerable
      ? `${roomLabel(vulnerable.room.id)}의 ${vulnerable.unit.monster.name}은 두 배 반격 피해 ${hero.attack * hero.criticalMultiplier}에 주의하세요`
      : "현재 수비 몬스터가 없어 함정과 마왕의 방어에 의존하며 마왕에게도 두 배 피해를 줄 수 있습니다";
  } else {
    trait = "특수 능력 없이 방 순서대로 이동하고 1대1로 교전";
    caution = gap ? `${roomLabel(gap.id)}에 수비 몬스터가 없어${gap.trap ? " 함정만으로 막아야 합니다" : " 전투 없이 통과합니다"}`
      : "모든 방에 수비가 있지만 몬스터가 모두 교전 중이면 후속 용사가 통과할 수 있습니다";
  }
  const reserved = !hero.honor && rooms.find((room) => defenseOrder(room.id) === "honor"
    && !state.workshops.has(room.id) && occupants(room.id)[1]);
  return `${trait} · ${caution}${reserved ? ` · ${roomLabel(reserved.id)}의 2번 슬롯은 명예 용사 대비로 일반 용사를 상대하지 않습니다` : ""}${hero.honor ? " · 명예 용사이므로 체력과 공격력이 더 높습니다" : ""}.`;
}

function renderScoutReport() {
  const button = byId("toggle-scout-report");
  const report = byId("scout-report");
  button.disabled = state.running || isBankrupt();
  if (button.disabled) {
    report.hidden = true;
    button.setAttribute("aria-expanded", "false");
  }
  button.textContent = report.hidden ? "침입 정찰 보고" : "정찰 보고 닫기";
  if (report.hidden) return;
  const roster = royalRaidRoster();
  selectedScoutOrder = Math.min(selectedScoutOrder, roster.length);
  byId("scout-summary").textContent = `${state.day}일차 · 총 ${roster.length}명 · 명예 용사 ${roster.filter((hero) => hero.honor).length}명 · 아래 순서로 0.7초 간격 입장`;
  const list = byId("scout-roster");
  list.replaceChildren();
  for (const hero of roster) {
    const row = element("li");
    const select = element("button", "scout-hero");
    select.type = "button";
    select.setAttribute("aria-pressed", String(hero.order === selectedScoutOrder));
    select.setAttribute("aria-controls", "scout-advice");
    select.append(element("span", "scout-order", `${hero.order}번째`),
      element("strong", "", HERO_CLASSES.find((item) => item.sprite === hero.sprite).name),
      element("span", hero.honor ? "honor-badge" : "scout-normal", hero.captain ? "왕실 원정대장" : hero.honor ? "명예 용사" : "일반 용사"));
    select.addEventListener("click", () => {
      selectedScoutOrder = hero.order;
      for (const [index, item] of [...list.children].entries()) {
        item.firstElementChild.setAttribute("aria-pressed", String(index + 1 === selectedScoutOrder));
      }
      renderScoutAdvice(hero);
    });
    row.append(select);
    list.append(row);
  }
  renderScoutAdvice(roster[selectedScoutOrder - 1]);
}

function renderScoutAdvice(hero) {
  byId("scout-advice").textContent = `${hero.order}번째 ${hero.name} — ${scoutAdvice(hero)}`;
}

function toggleScoutReport() {
  if (state.running || isBankrupt()) return;
  const report = byId("scout-report");
  report.hidden = !report.hidden;
  byId("toggle-scout-report").setAttribute("aria-expanded", String(!report.hidden));
  renderScoutReport();
}

function promotionGain(popularity) {
  return Math.max(1, Math.ceil(popularity * PROMOTION_RATE));
}

function createDeliveryContract(day) {
  // The calendar determines the offer, so legacy saves also get a stable proposal.
  const resource = day % 2 === 0 ? "stone" : "iron";
  const terms = DELIVERY_RESOURCES[resource];
  const quantity = terms.quantity + ((day - 1) % 3) * (resource === "stone" ? 3 : 1);
  return { day, resource, quantity, gold: quantity * terms.price, status: "pending" };
}

function ensureDeliveryContract() {
  if (state.floors < 2) return;
  if (!state.deliveryContract || state.deliveryContract.day !== state.day) {
    state.deliveryContract = createDeliveryContract(state.day);
  }
}

function deliveryBlocker() {
  const contract = state.deliveryContract;
  if (state.floors < 2 || !contract || contract.day !== state.day) return "2층부터 납품할 수 있습니다.";
  if (contract.status === "fulfilled") return "오늘 납품 완료";
  if (contract.status === "declined") return "오늘 제안 거절 · 벌금 없음";
  if (isBankrupt()) return "운영 종료";
  if (state.running) return "침입이 끝나면 선택할 수 있습니다.";
  if (state[contract.resource] < contract.quantity) return `${RESOURCES[contract.resource]} 재고 부족`;
  if (!Number.isSafeInteger(state.gold + contract.gold)) return "보유 골드 한도 초과";
  return "";
}

function resolveDeliveryContract(deliver) {
  const contract = state.deliveryContract;
  if (state.floors < 2 || !contract || contract.day !== state.day || contract.status !== "pending"
    || state.running || isBankrupt()) return;
  if (deliver) {
    if (deliveryBlocker()) return;
    state[contract.resource] -= contract.quantity;
    recordTransaction("contract", "상인 길드 납품 계약금", contract.gold, 0, { [contract.resource]: -contract.quantity });
    state.gold += contract.gold;
    contract.status = "fulfilled";
    log("납품 완료", `상인 길드 · ${RESOURCES[contract.resource]} ${count(contract.quantity)}개 납품 · 골드 +${count(contract.gold)} · 남은 재고 ${count(state[contract.resource])}개`);
  } else {
    contract.status = "declined";
    log("납품 거절", "상인 길드의 오늘 제안을 거절했습니다. 자원과 골드 변동 및 벌금은 없습니다.");
  }
  renderManagement();
}

function renderDeliveryContract() {
  ensureDeliveryContract();
  const contract = state.deliveryContract;
  const unlocked = state.floors >= 2 && Boolean(contract);
  byId("delivery-details").hidden = !unlocked;
  byId("delivery-status").textContent = unlocked
    ? (deliveryBlocker() || "납품하거나 자원을 증축용으로 남겨둘 수 있습니다.")
    : "던전을 2층으로 증축하면 상인 길드가 하루 한 번 석재 또는 철 납품을 제안합니다.";
  if (!unlocked) return;
  const resource = RESOURCES[contract.resource];
  const stock = state[contract.resource];
  const remaining = stock - contract.quantity;
  byId("delivery-offer").textContent = `${contract.day}일차 제안 · ${resource} ${count(contract.quantity)}개 → ${count(contract.gold)}골드`;
  byId("delivery-inventory").textContent = contract.status === "fulfilled"
    ? `납품 완료 · 받은 골드 ${count(contract.gold)} · 현재 ${resource} 재고 ${count(stock)}개`
    : `보유 ${resource} ${count(stock)}개 · 납품 후 남는 재고 ${remaining >= 0 ? `${count(remaining)}개` : `없음 (${count(-remaining)}개 부족)`}`;
  const needed = expansionCost(state.floors)[contract.resource];
  byId("delivery-expansion").textContent = `다음 ${state.floors + 1}층 증축에 ${resource} ${count(needed)}개 필요${contract.status === "pending" && remaining >= 0
    ? (remaining < needed ? ` · 납품하면 증축용 ${resource} ${count(needed - remaining)}개 부족` : " · 납품 후에도 이 자원은 충분합니다.") : ""}`;
  byId("deliver-contract").disabled = Boolean(deliveryBlocker());
  byId("decline-contract").disabled = contract.status !== "pending" || state.running || isBankrupt();
}

function promotionCost() {
  return 80 + 12 * state.popularity;
}

function promotionBlocker() {
  if (state.running) return "침입이 끝나면 홍보할 수 있습니다.";
  if (state.lastPromotionDay === state.day) return "오늘은 이미 홍보했습니다.";
  if (state.gold < promotionCost()) return "홍보에 필요한 골드가 부족합니다.";
  return "";
}

function renderActivities() {
  const blocker = promotionBlocker();
  byId("promotion-buy").disabled = Boolean(blocker);
  byId("promotion-buy").textContent = `홍보하기 · ${count(promotionCost())}골드`;
  byId("promotion-status").textContent = [
    state.promotionDays
      ? `홍보 진행 중 · 남은 효과 ${state.promotionDays}일 · 다음 정산에서 인기도 최소 +${promotionGain(state.popularity)}`
      : "진행 중인 홍보가 없습니다.",
    blocker,
  ].filter(Boolean).join(" · ");
}

function promoteDungeon() {
  if (promotionBlocker()) return;
  const cost = promotionCost();
  recordTransaction("promotion", "던전 홍보", -cost);
  state.gold -= cost;
  state.lastPromotionDay = state.day;
  state.promotionDays = PROMOTION_DAYS;
  log("던전 홍보", `${count(cost)}골드 지불 · 앞으로 3일간 일일 정산에 인기도 증가`);
  renderManagement();
}

function recordEscapes(escaped, total) {
  const previous = state.popularity;
  const progress = state.escapeProgress + escaped / total;
  const gain = Math.floor(progress + 1e-9);
  state.escapeProgress = Math.max(0, progress - gain);
  state.popularity += gain;
  if (escaped) {
    log("던전 인기도", `도주 성공 ${escaped}/${total}명 · 인기도 +${state.popularity - previous} · 다음 +1까지 ${escapePercent()}%`);
  }
}

function escapePercent() {
  return Math.min(99, Math.floor(state.escapeProgress * 100 + 1e-7));
}

function renderDungeonStats() {
  const { size, honorCount } = raidProfile();
  const bonus = rewardPopularity();
  renderPanel("dungeon-stats", "던전 현황", "마왕방은 던전의 가장 높은 층에 있습니다.", [
    ["현재 날짜", `${state.day}일차`],
    ["마왕 레벨", `Lv. ${state.level}`],
    ["마왕 능력치", `체력 ${count(demonMaxHp())} · 공격력 ${count(demonAttack())}`],
    ["던전 악명", count(state.infamy)],
    ["던전 인기도", `${count(state.popularity + bonus)} (보상 +${count(bonus)} · 도주 누적 ${escapePercent()}%)`],
    ["예상 침입 규모", `${size}명 (명예 용사 ${honorCount}명)`],
    ["보유 석재", `${count(state.stone)}개`],
    ["보유 철", `${count(state.iron)}개`],
    ["보유 암흑물질", `${count(state.darkMatter)}개`],
    ["보유 고대 유물", `${count(state.relics)}개`],
    ["미납금", `${count(state.debt)}골드`],
  ]);
}

function renderManagement() {
  renderRoyalChallenge();
  renderLedger();
  const rooms = state.floors * ROOMS_PER_FLOOR;
  byId("gold").textContent = count(state.gold);
  byId("floor-count").textContent = `총 ${state.floors}층 · 일반방 ${rooms}개`;
  const health = byId("demon-health");
  health.max = demonMaxHp();
  if (!state.running) health.value = health.max;
  renderIdentity();
  if (byId("game-settings").open) {
    renderSaveControls();
    if (!state.running) byId("save-status").textContent = "";
  }
  renderDungeonStats();
  renderManagementGoals();
  renderActivities();
  renderDeliveryContract();
  renderResearch();
  renderMonsters();
  renderTraps();
  renderWorkshops();
  const cost = expansionCost(state.floors);
  const blocker = expansionBlocker(cost);
  byId("expansion-cost").textContent = `${state.floors + 1}층 · Lv. ${state.floors + 1} · ${resourceList(cost)}`;
  byId("expand-floor").disabled = Boolean(blocker);
  byId("expansion-status").textContent = blocker || "증축할 수 있습니다.";
  byId("start-route").disabled = state.running || isBankrupt();
  renderRaidControls();
  renderThroneRewardControls();
  const size = royalRaidRoster().length;
  byId("raid-preview").hidden = state.running || isBankrupt();
  byId("raid-preview").textContent = `다음 침입 예상 · 용사 ${size}명 · 통행료 +${count(size * HERO_TOLL)}골드 · 유지비 ${count(dailyUpkeep())}골드 · 마왕 처치 보상 최대 ${count(state.throneReward * size)}골드`;
  renderScoutReport();
  renderDebt();
  renderFirstDayGuide();
}

function renderDebt() {
  const bankrupt = isBankrupt();
  const dungeon = byId("dungeon-section");
  dungeon.dataset.debtDays = state.debtDays;
  dungeon.querySelector(".map-scroll").inert = bankrupt;
  byId("management-section").inert = bankrupt;
  byId("game-over").hidden = !bankrupt;
  const warning = byId("bankruptcy-warning");
  warning.hidden = state.debtDays === 0 || bankrupt;
  warning.textContent = `파산 경고 ${state.debtDays}/${BANKRUPTCY_LIMIT}${state.debtDays === BANKRUPTCY_LIMIT - 1 ? " · 다음 정산까지 완납 필요" : ""}`;

  const maxPayment = Math.min(state.gold, state.debt);
  const amount = byId("debt-payment");
  amount.max = maxPayment;
  amount.disabled = state.running || isBankrupt() || bankrupt || maxPayment < 1;
  byId("pay-debt").disabled = amount.disabled;
  byId("debt-payment-form").hidden = state.debt === 0;
  byId("debt-payment-status").textContent = state.debt > 0
    ? `미납 ${count(state.debt)}골드 · 납부 가능 ${count(maxPayment)}골드`
    : "미납금이 없습니다.";

  const loan = byId("bank-loan");
  const maxLoan = maxLoanAmount();
  loan.max = maxLoan;
  loan.disabled = state.running || isBankrupt() || bankrupt || maxLoan < 1;
  renderLoanPreview();
}

function renderLoanPreview() {
  const input = byId("bank-loan");
  const amount = input.valueAsNumber;
  const valid = Number.isSafeInteger(amount) && amount >= 1 && amount <= maxLoanAmount();
  byId("take-loan").disabled = input.disabled || !valid;
  const remaining = BANKRUPTCY_LIMIT - state.debtDays;
  byId("bank-loan-guide").textContent = [
    `미납금 포함 한도 ${count(loanLimit())}골드 · 추가 대출 가능 ${count(maxLoanAmount())}골드`,
    valid ? `상환액 ${count(amount)}골드 (이자 없음) · 기존 미납금 포함 총 ${count(state.debt + amount)}골드` : "",
    `미납 지속 시 파산까지 ${remaining}회 정산`,
  ].filter(Boolean).join(" · ");
}

function takeLoan(event) {
  event.preventDefault();
  if (state.running || isBankrupt()) return;
  const input = byId("bank-loan");
  const amount = input.valueAsNumber;
  if (!Number.isSafeInteger(amount) || amount < 1 || amount > maxLoanAmount()) return;
  recordTransaction("loan", "은행 대출", amount, amount);
  state.gold += amount;
  state.debt += amount;
  input.value = "";
  log("은행 대출", `${count(amount)}골드 대출 · 현재 미납금 ${count(state.debt)}골드`);
  renderManagement();
}

function payDebt(event) {
  event.preventDefault();
  if (state.running || isBankrupt()) return;
  const input = byId("debt-payment");
  const amount = input.valueAsNumber;
  if (!Number.isSafeInteger(amount) || amount < 1 || amount > Math.min(state.gold, state.debt)) return;
  recordTransaction("repayment", "미납금 상환", -amount, -amount);
  state.gold -= amount;
  state.debt -= amount;
  if (state.debt === 0) state.debtDays = 0;
  input.value = "";
  log("미납금 납부", `${count(amount)}골드 납부 · 남은 미납금 ${count(state.debt)}골드`);
  renderManagement();
}

function visitRoom(step, hero) {
  const map = byId("dungeon-map");
  const room = map.querySelector(`[data-room="${step.id}"]`);
  updateHeroMarker(hero);
  room.querySelector(".room-heroes").append(hero.marker);
  if (hero.room && hero.room !== step.id) walkHero(hero);
  hero.room = step.id;
  if (hero !== hero.raid.active.values().next().value) return;
  const viewport = map.parentElement;
  const bounds = viewport.getBoundingClientRect();
  const tile = room.getBoundingClientRect();
  if (tile.left < bounds.left || tile.right > bounds.left + viewport.clientWidth) {
    viewport.scrollLeft += tile.left - bounds.left - (viewport.clientWidth - tile.width) / 2;
  }
}

function updateHeroMarker(hero, opponent = "") {
  const label = hero.retreating ? `${hero.name} 도망 ${hero.escape}/${ESCAPE_SEGMENTS}`
    : `${hero.name} 체력 ${hero.hp}/${hero.maxHp}`;
  hero.marker.title = opponent ? `${label} · ${opponent}` : label;
  hero.marker.toggleAttribute("data-retreating", Boolean(hero.retreating));
  hero.marker.setAttribute("aria-label", hero.marker.title);
  hero.health.value = hero.hp;
  hero.health.hidden = hero.retreating;
  hero.escapeBar.hidden = !hero.retreating;
  hero.escapeBar.setAttribute("aria-valuenow", hero.escape);
  for (const [index, segment] of [...hero.escapeBar.children].entries()) {
    segment.toggleAttribute("data-filled", index < hero.escape);
  }
}

function setHeroPose(hero, pose) {
  cancelGameTimer(hero.walkTimer);
  setPose(hero.image, pose);
}

function walkHero(hero) {
  cancelGameTimer(hero.walkTimer);
  let frame = 0;
  function advanceFrame() {
    setPose(hero.image, WALK_POSES[frame] ?? "idle");
    if (frame < WALK_POSES.length) {
      frame++;
      hero.walkTimer = gameTimer(advanceFrame, WALK_FRAME_MS);
    }
  }
  advanceFrame();
}

const revivalTimers = new WeakMap();

function startRevival(unit, delay) {
  cancelGameTimer(revivalTimers.get(unit)?.handle);
  const pending = {};
  revivalTimers.set(unit, pending);
  unit.reviveAt = Math.ceil((raidClock?.now ?? Date.now()) + delay);
  pending.handle = gameTimer(() => {
    if (revivalTimers.get(unit) !== pending) return;
    revivalTimers.delete(unit);
    if (isBankrupt() || !deployed().includes(unit)) return;
    unit.reviveAt = 0;
    unit.hp = unit.monster.hp;
    log("몬스터 부활", `${unit.monster.name}이(가) 다시 활동합니다.`);
    renderMonsters();
    renderWorkshops();
  }, delay);
}

function startRaidClock() {
  const pending = deployed().filter((unit) => unit.reviveAt)
    .map((unit) => [unit, Math.max(0, unit.reviveAt - Date.now())]);
  raidClock = new RaidClock();
  raidSpeed = 1;
  for (const [unit, remaining] of pending) startRevival(unit, remaining);
}

function finishRaidClock() {
  const pending = deployed().filter((unit) => unit.reviveAt)
    .map((unit) => [unit, Math.max(0, unit.reviveAt - raidClock.now)]);
  raidClock.stop();
  raidClock = null;
  raidSpeed = 1;
  for (const [image] of trapMotion) setPose(image, "idle");
  trapMotion.clear();
  for (const [unit, remaining] of pending) startRevival(unit, remaining);
}

function triggerEntryTrap(step, hero, trap) {
  let moveDelay = 0;
  if (trap?.damage) {
    animateTrap(step);
    damageHero(hero, trap.damage);
    log("함정 발동", `${step.label} · ${trap.name} · ${hero.name} 피해 ${trap.damage}`, "intrusion");
  }
  if (trap?.slowMs) {
    hero.checkedSlowRooms ??= new Set();
    if (!hero.checkedSlowRooms.has(step.id)) {
      hero.checkedSlowRooms.add(step.id);
      moveDelay = trap.slowMs;
      log("이동 지연", `${step.label} · ${trap.name} · ${hero.name} 다음 이동 ${moveDelay / 1000}초 지연`, "intrusion");
    }
  }
  if (trap?.threshold && hero.hp > 0 && hero.hp / hero.maxHp <= trap.threshold) {
    animateTrap(step);
    damageHero(hero, hero.hp);
    log("함정 발동", `${step.label} · ${trap.name} · ${hero.name} 체력 0`, "intrusion");
  }
  return moveDelay;
}

function startRetreat(step, hero) {
  hero.raid.rooms.get(step.id)?.repelled.add(hero);
  hero.retreating = true;
  hero.escape = ESCAPE_SEGMENTS;
  updateHeroMarker(hero);
  log("용사 도망", `${step.label} · ${hero.name} 체력 0 · 시작방으로 도망`, "intrusion");
}

function checkTollDecision(hero) {
  if (hero.checkedToll || hero.hp * 5 > hero.maxHp) return;
  hero.checkedToll = true;
  hero.paidToll = Math.random() < 0.20;
  if (!hero.paidToll) log("전투 지속", `${hero.name} · 전투 계속 선택`, "intrusion");
}

function triggerHitTrap(step, hero, trap) {
  if (!trap?.hitRate) return;
  const triggered = hero.raid.rooms.get(step.id).hitTrapTriggered;
  if (triggered.has(hero) || Math.random() >= trap.hitRate) return;
  triggered.add(hero);
  const gold = trap.hitGold ?? 0;
  const relics = trap.hitRelics ?? 0;
  if (gold) recordTransaction("bounty", `${step.label} · 현상금 인장`, gold);
  state.gold += gold;
  state.relics += relics;
  hero.raid.bountyGold += gold;
  hero.raid.relics += relics;
  if (gold) {
    byId("gold").textContent = count(state.gold);
    renderWorkshops();
  }
  if (relics) renderDungeonStats();
  animateTrap(step);
  log("함정 발동", `${step.label} · ${trap.name} · ${hero.name} 피격 · ${gold ? `골드 +${gold}` : `고대 유물 +${relics}`}`, "intrusion");
}

async function fightRoom(step, hero, unit, slot, trap) {
  const position = hero.marker.closest(".room").querySelector(`[data-slot="${slot}"] + .opponent-position`);
  position.append(hero.marker);
  unit.opponent = hero;
  refreshSlots();
  const { monster } = unit;
  const heroAttack = Math.max(1, Math.floor(hero.attack * (1 - (trap?.weaken ?? 0))));
  const boost = trap?.boost ?? 0;
  const attack = Math.round(monster.attack * (1 + boost));
  if (hero.image.dataset.pose.startsWith("walk-")) await wait(WALK_FRAME_MS * WALK_POSES.length);
  if (trap?.weaken || boost) {
    animateTrap(step);
    log("함정 발동", `${step.label} · ${trap.name} · ${trap.effect}`, "intrusion");
  }
  try {
    do {
      unit.attacking = true;
      refreshSlots();
      setHeroPose(hero, "idle");
      if (hero.dodgeChance && Math.random() < hero.dodgeChance) {
        log("공격 회피", `${step.label} · 궁수가 ${monster.name}의 공격을 피했습니다.`, "intrusion");
      } else {
        if (damageHero(hero, attack) > 0) {
          triggerHitTrap(step, hero, trap);
        }
      }
      checkTollDecision(hero);
      if (hero.paidToll) return;
      if (hero.hp === 0) startRetreat(step, hero);
      updateHeroMarker(hero, `${monster.name} ${unit.hp}/${monster.hp}`);
      await wait(ATTACK_TURN_MS);
      unit.attacking = false;
      refreshSlots();
      if (hero.hp > 0) {
        setHeroPose(hero, "attack");
        const critical = hero.criticalChance && Math.random() < hero.criticalChance;
        const damage = critical ? heroAttack * hero.criticalMultiplier : heroAttack;
        unit.hp = Math.max(0, unit.hp - damage);
        refreshSlots();
        if (critical) log("치명타", `${step.label} · 암살자가 ${monster.name}에게 피해 ${damage}`, "intrusion");
      }
      updateHeroMarker(hero, `${monster.name} ${unit.hp}/${monster.hp}`);
      await wait(ATTACK_TURN_MS);
    } while (hero.hp > 0 && unit.hp > 0);
    if (unit.hp === 0) {
      if (trap?.reviveMs) animateTrap(step);
      const delay = revivalDelay(trap);
      startRevival(unit, delay);
      log("몬스터 처치", `${step.label} · ${hero.name}가 ${monster.name} 처치 · ${delay / 1000}초 후 부활`, "intrusion");
    }
  } finally {
    unit.attacking = false;
    unit.opponent = null;
    refreshSlots();
    setHeroPose(hero, "idle");
    updateHeroMarker(hero);
    position.closest(".room").querySelector(".room-heroes").append(hero.marker);
  }
}

function advanceDay() {
  currentLedger();
  collectWorkshopProduction();
  if (state.promotionDays > 0) {
    const gain = promotionGain(state.popularity);
    state.popularity += gain;
    state.promotionDays--;
    log("홍보 효과", `${state.day}일차 · 인기도 +${gain} · ${state.promotionDays ? `남은 효과 ${state.promotionDays}일` : "홍보 종료"}`);
  }
  const bill = dailyUpkeep();
  const paid = Math.min(state.gold, bill);
  recordTransaction("upkeep", "일일 유지비", -paid, bill - paid);
  state.gold -= paid;
  state.debt += bill - paid;
  state.debtDays = state.debt > 0 ? state.debtDays + 1 : 0;
  log("일일 정산", `${state.day}일차 · 유지비 ${count(paid)}골드 지불${state.debt ? ` · 미납 ${count(state.debt)}골드` : ""}`);
  if (!state.openingRewardClaimed) {
    state.openingRewardClaimed = true;
    state.stone += FIRST_EXPANSION_STONE;
    recordTransaction("reward", "첫 정산 보상", OPENING_REWARD_GOLD, 0, { stone: FIRST_EXPANSION_STONE });
    state.gold += OPENING_REWARD_GOLD;
    log("첫 정산 보상", `침입 후 정산 완료 · 골드 +${OPENING_REWARD_GOLD} · 석재 +${FIRST_EXPANSION_STONE}개`);
  }
  currentLedger().closed = true;
  selectedLedgerDay = state.day;
  state.day++;
  ensureDeliveryContract();
  currentLedger();
  advanceManagementGoals();
  if (isBankrupt()) log("파산", "미납금이 3일 연속 남아 던전 운영이 종료되었습니다.");
}

function recoverFleeingHero(step, hero, trap) {
  if (!trap?.recoveryChance || hero.checkedRecoveryRooms.has(step.id)) return;
  hero.checkedRecoveryRooms.add(step.id);
  if (Math.random() >= trap.recoveryChance) return;
  animateTrap(step);
  hero.hp = Math.ceil(hero.maxHp * trap.recoveryRatio);
  hero.retreating = false;
  hero.escape = 0;
  updateHeroMarker(hero);
  log("함정 발동", `${step.label} · ${trap.name} · ${hero.name} 체력 ${hero.hp}/${hero.maxHp} 회복 · 탐색 재개`, "intrusion");
}

async function strikeFleeingHero(step, hero, unit) {
  if (!unit || hero.checkedPursuitRooms.has(step.id)) return;
  hero.checkedPursuitRooms.add(step.id);
  if (Math.random() >= ESCAPE_HIT_CHANCE) {
    log("도망 중 회피", `${step.label} · ${hero.name}가 ${unit.monster.name}의 추격을 피했습니다.`, "intrusion");
    return;
  }
  unit.opponent = hero;
  unit.attacking = true;
  hero.escape--;
  refreshSlots();
  updateHeroMarker(hero);
  log("도망 중 피격", `${step.label} · ${unit.monster.name} → ${hero.name} · 도망 게이지 ${hero.escape}/${ESCAPE_SEGMENTS}`, "intrusion");
  try {
    await wait(WALK_FRAME_MS * WALK_POSES.length);
  } finally {
    unit.attacking = false;
    unit.opponent = null;
    refreshSlots();
  }
}

async function exploreDungeon(route, hero, fromThrone = false) {
  if (!fromThrone) visitRoom(route[0], hero);
  await wait(STEP_MS);
  let index = fromThrone ? route.length - 2 : 1;
  while (index > 0 && index < route.length - 1) {
    const step = route[index];
    const installed = state.traps.get(step.id);
    const trap = installed && trapFloorUnlocked(installed) ? installed : undefined;
    const slots = state.workshops.has(step.id) ? [] : occupants(step.id);
    const defenderSlot = slots.findIndex((unit, slot) => unit && !unit.reviveAt && !unit.opponent
      && slotCanEngage(step.id, slot, hero));
    const defender = slots[defenderSlot];
    const activeDefenders = slots.filter((unit) => unit && !unit.reviveAt);
    const busy = activeDefenders.length > 0 && activeDefenders.every((unit) => unit.opponent);
    visitRoom(step, hero);
    if (hero.retreating) {
      recoverFleeingHero(step, hero, trap);
      if (hero.retreating) {
        await strikeFleeingHero(step, hero, defender);
        if (hero.escape === 0) {
          hero.raid.rooms.get(step.id).repelled.add(hero);
          state.infamy++;
          if (Math.random() < 0.20) {
            state.relics++;
            hero.raid.relics++;
          }
          renderDungeonStats();
          log("용사 사망", `${step.label} · ${hero.name} 사망 · 던전 악명 +1`, "intrusion");
          return { outcome: "사망" };
        }
        index--;
        await wait(STEP_MS);
        continue;
      }
      if (defender) await fightRoom(step, hero, defender, defenderSlot, trap);
      if (hero.paidToll) return { outcome: "통행료 귀환" };
      index += hero.retreating ? -1 : 1;
      await wait(STEP_MS);
      continue;
    }

    if (hero.teleportChance && Math.random() < hero.teleportChance) {
      log("순간이동", `${hero.name}가 ${step.label}을(를) 건너 ${route[index + 1].label}(으)로 이동합니다.`, "intrusion");
      index++;
      continue;
    }
    if (trap?.chance && !hero.raid.checkedGates.has(step.id)) {
      hero.raid.checkedGates.add(step.id);
      if (Math.random() < trap.chance) {
        animateTrap(step);
        log("함정 발동", `${step.label} · ${trap.name} · ${hero.name}가 ${route[index - 1].label}(으)로 밀려났습니다.`, "intrusion");
        index--;
        await wait(STEP_MS);
        if (index === 0) {
          visitRoom(route[0], hero);
          await wait(STEP_MS);
          index++;
        }
        continue;
      }
    }
    const moveDelay = triggerEntryTrap(step, hero, trap);
    checkTollDecision(hero);
    if (hero.paidToll) return { outcome: "통행료 귀환" };
    if (hero.hp === 0) {
      startRetreat(step, hero);
    } else {
      updateHeroMarker(hero);
      if (defender) await fightRoom(step, hero, defender, defenderSlot, trap);
      else if (busy) {
        hero.raid.rooms.get(step.id).passed.add(hero);
        log("방 통과", `${step.label} · ${hero.name} 통과 · 모든 수비 몬스터 교전 중`, "intrusion");
      } else if (defenseOrder(step.id) === "honor" && !hero.honor && slots[1]
          && !slots[1].reviveAt && !slots[1].opponent) {
        log("방 통과", `${step.label} · ${hero.name} 통과 · 2번 슬롯 명예 용사 대기`, "intrusion");
      }
    }
    if (hero.paidToll) return { outcome: "통행료 귀환" };
    index += hero.retreating ? -1 : 1;
    await wait(STEP_MS + moveDelay);
  }

  if (hero.retreating) {
    visitRoom(route[0], hero);
    await wait(STEP_MS);
    log("던전 탈출", `${hero.name}가 시작방을 통해 던전을 빠져나갔습니다.`, "intrusion");
    return { outcome: "탈출" };
  }

  visitRoom(route.at(-1), hero);
  log("마왕방 도착", `${hero.name}가 체력 ${hero.hp}을(를) 남기고 마왕방에 도착했습니다.`, "intrusion");
  await wait(STEP_MS);
  return { outcome: "마왕방 도착" };
}

async function retreatFromThrone(route, hero) {
  startRetreat(route.at(-1), hero);
  hero.raid.active.add(hero);
  const result = await exploreDungeon(route, hero, true);
  hero.raid.active.delete(hero);
  cancelGameTimer(hero.walkTimer);
  if (result.outcome !== "마왕방 도착") hero.marker.remove();
  if (hero.paidToll) {
    log("통행료 귀환", `${hero.name} · 마을로 순간이동`, "intrusion");
  }
  return result;
}

async function fightThrone(route, party, finalResults) {
  const health = byId("demon-health");
  const maxHp = demonMaxHp();
  let hp = maxHp;
  let fighters = party;
  let retreats = [];
  byId("route-status").textContent = `마왕방 레이드 · 용사 ${party.length}명 참전`;
  log("마왕방 레이드", `${state.demonName} vs 용사 ${party.length}명 · 체력 ${maxHp} · 공격력 ${demonAttack()}`, "intrusion");

  while (hp > 0 && (fighters.length || retreats.length)) {
    if (!fighters.length) {
      fighters = (await Promise.all(retreats)).filter((hero) => finalResults.get(hero).outcome === "마왕방 도착");
      retreats = [];
      continue;
    }
    let damage = 0;
    for (const hero of fighters) {
      setHeroPose(hero, "attack");
      const critical = hero.criticalChance && Math.random() < hero.criticalChance;
      damage += hero.attack * (critical ? hero.criticalMultiplier : 1);
    }
    hp = Math.max(0, hp - damage);
    health.value = hp;
    health.title = `${state.demonName} 체력 ${hp}/${maxHp}`;
    log("용사 합동 공격", `용사 ${fighters.length}명 · 피해 ${damage} · 마왕 체력 ${hp}/${maxHp}`, "intrusion");
    await wait(ATTACK_TURN_MS);
    for (const hero of fighters) setHeroPose(hero, "idle");
    if (hp === 0) break;

    const target = fighters[0];
    if (target.dodgeChance && Math.random() < target.dodgeChance) {
      log("마왕 공격 회피", `${target.name}가 공격을 피했습니다.`, "intrusion");
    } else {
      damageHero(target, demonAttack());
      updateHeroMarker(target, state.demonName);
      if (target.hp === 0) {
        fighters = fighters.slice(1);
        retreats.push(retreatFromThrone(route, target).then((result) => {
          finalResults.set(target, result);
          return target;
        }));
      }
    }
    await wait(ATTACK_TURN_MS);
  }

  await Promise.all(retreats);
  if (hp > 0) {
    log("마왕방 방어 성공", `${state.demonName} 생존 · 체력 ${hp}/${maxHp}`, "intrusion");
    return false;
  }

  const total = state.throneReward * party.length;
  const paid = Math.min(state.gold, total);
  const unpaid = total - paid;
  recordTransaction("throne", "마왕 처치 보상 지급", -paid, unpaid);
  state.gold -= paid;
  state.debt += unpaid;
  byId("gold").textContent = count(state.gold);
  log("마왕 처치 보상", `${count(state.throneReward)}골드 × ${party.length}명 = ${count(total)}골드 · 보유 골드 -${count(paid)}${unpaid ? ` · 미납금 +${count(unpaid)}골드` : ""}`, "intrusion");
  return true;
}

async function runRoute() {
  if (state.running || isBankrupt()) return;
  const roster = royalRaidRoster();
  const challengeDay = state.day;
  if (roster.some((hero) => hero.captain)) log("왕실 원정대 도전 시작", `${state.day}일차 · 원정대장 후발 입장`, "intrusion");
  state.running = true;
  startRaidClock();
  const openingBalance = state.gold - state.debt;
  const logs = byId("logs");
  while (logs.children.length > 80) logs.lastElementChild.remove();
  rollWorkshopAccidents();
  renderManagement();
  const route = buildRoute(state.floors);
  byId("pause-raid").focus?.();
  const rooms = route.slice(1, -1).map(({ id, label }) => [id, {
    label, repelled: new Set(), passed: new Set(), hitTrapTriggered: new Set(),
  }]);
  const raid = { active: new Set(), checkedGates: new Set(), rooms: new Map(rooms), bountyGold: 0, relics: 0 };
  const heroes = roster.map((entry) => {
    const { honor, name, maxHp } = entry;
    const marker = element("span", honor ? "hero-marker hero-honor" : "hero-marker");
    const image = makeSprite(entry.sprite);
    const health = makeHealthBar(name, maxHp);
    const escapeBar = element("span", "escape-bar");
    escapeBar.hidden = true;
    escapeBar.setAttribute("role", "progressbar");
    escapeBar.setAttribute("aria-label", `${name} 도망 게이지`);
    escapeBar.setAttribute("aria-valuemin", "0");
    escapeBar.setAttribute("aria-valuemax", ESCAPE_SEGMENTS);
    for (let segment = 0; segment < ESCAPE_SEGMENTS; segment++) {
      escapeBar.append(element("span"));
    }
    marker.setAttribute("role", "group");
    if (honor) marker.append(element("span", "honor-badge", "명예"));
    marker.append(image, health, escapeBar);
    return {
      ...entry, hp: maxHp, raid, marker, image, health, escapeBar,
      retreating: false, escape: 0, checkedRecoveryRooms: new Set(), checkedPursuitRooms: new Set(),
      checkedToll: false, paidToll: false,
    };
  });
  for (const unit of deployed()) {
    if (!unit.reviveAt) unit.hp = unit.monster.hp;
  }
  refreshSlots();
  let remaining = heroes.length;
  const showRaidStatus = () => {
    byId("route-status").textContent = `침입 진행 중 · 남은 용사 ${remaining}명`;
  };
  showRaidStatus();

  const results = await Promise.all(heroes.map(async (hero, index) => {
    if (index > 0) await wait(index * HERO_ENTRY_MS);
    raid.active.add(hero);
    log("용사 입장", `${hero.name} 입장 · 체력 ${hero.maxHp} · 공격 ${hero.attack}`, "intrusion");
    const result = await exploreDungeon(route, hero);
    recordTransaction("toll", `${hero.name} · 통행료`, HERO_TOLL);
    state.gold += HERO_TOLL;
    byId("gold").textContent = count(state.gold);
    renderWorkshops();
    if (hero.paidToll) {
      log("통행료 귀환", `${hero.name} · ${HERO_TOLL}골드 지불 · 마을로 순간이동`, "intrusion");
    }
    cancelGameTimer(hero.walkTimer);
    if (result.outcome !== "마왕방 도착") hero.marker.remove();
    raid.active.delete(hero);
    remaining--;
    showRaidStatus();
    return result;
  }));
  const party = heroes.filter((_, index) => results[index].outcome === "마왕방 도착");
  const throneRetreats = new Map();
  const demonDefeated = party.length > 0 && await fightThrone(route, party, throneRetreats);
  for (const hero of party) hero.marker.remove();
  const finalResults = results.map((result, index) => throneRetreats.get(heroes[index]) ?? result);
  const captainIndex = heroes.findIndex((hero) => hero.captain);
  if (captainIndex >= 0) {
    const captain = heroes[captainIndex];
    const result = finalResults[captainIndex];
    const outcome = result.outcome === "마왕방 도착" ? "마왕방 생존 귀환" : result.outcome;
    state.royalHistory.push({ day: challengeDay, outcome, shieldUsed: Boolean(captain.shieldUsed), demonDefeated: Boolean(demonDefeated) });
    log("왕실 원정대 도전 종료", `원정대장 ${outcome} · ${demonDefeated ? "방어 실패 · 다음 날 재도전" : "마왕 생존 · 정산 후 최종 판정"}`, "intrusion");
  }
  const { bountyGold, relics } = raid;
  const escaped = finalResults.filter((result) => result.outcome === "탈출").length;
  recordEscapes(escaped, heroes.length);
  const summary = ["사망", "탈출", "통행료 귀환"].map((outcome) =>
    `${outcome} ${finalResults.filter((result) => result.outcome === outcome).length}명`).join(" · ");
  state.level++;
  log("침입 종료", `마왕 Lv. ${state.level} · 통행료 ${heroes.length}명 × ${HERO_TOLL}골드 = ${heroes.length * HERO_TOLL}골드${bountyGold ? ` · 현상금 +${bountyGold}골드` : ""}${relics ? ` · 고대 유물 +${relics}` : ""}`);
  currentLedger().rooms = [...raid.rooms.values()].map(({ label, repelled, passed }) => ({ label, repelled: repelled.size, passed: passed.size }));
  advanceDay();
  renderRaidResult(raid, party.length, state.gold - state.debt - openingBalance);
  finishRaidClock();
  state.running = false;
  const throneResult = party.length ? (demonDefeated ? " · 마왕 처치" : " · 마왕방 방어 성공") : "";
  byId("route-status").textContent = `${summary} · 마왕방 도달 ${party.length}명${throneResult} · ${isBankrupt() ? "파산" : `${state.day}일차 시작`}`;
  renderManagement();
  completeFinalDefense(captainIndex >= 0, demonDefeated, challengeDay);
  if (!isBankrupt() && byId("victory-screen").hidden && !topDialog()) byId("raid-result").focus?.();
  if (isBankrupt()) byId("restart-game").focus();
}

function completeFinalDefense(royal, demonDefeated, day) {
  if (!royal || demonDefeated || isBankrupt() || state.endingSeen) return false;
  state.endingSeen = true;
  byId("victory-details").textContent = `${state.dungeonName} · 걸린 일수 ${day}일 · ${state.floors}층 · 최종 골드 ${count(state.gold)}G`;
  byId("victory-screen").hidden = false;
  byId("continue-operation").focus();
  log("최종 방어 성공", "왕실 원정대 침입 종료 · 마왕 생존 · 던전 운영 계속 가능");
  // Persist before offering continuation so loading never replays the ending.
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(makeSave()));
    byId("save-status").textContent = "최종 방어 성공과 엔딩 기록을 자동 저장했습니다.";
  } catch {
    byId("save-status").textContent = "엔딩 기록을 저장하지 못했습니다. 설정에서 다시 저장하세요.";
  }
  return true;
}

function startNewGame() {
  if (state.running) return;
  try { localStorage.removeItem(SAVE_KEY); }
  catch {
    byId("save-status").textContent = "기존 저장을 삭제하지 못했습니다. 저장 공간 설정을 확인하세요.";
    return;
  }
  window.location.reload();
}

function renderRaidResult(raid, reachedThrone, net) {
  const summary = byId("raid-result");
  summary.hidden = false;
  byId("raid-result-title").textContent = `${state.day - 1}일차 침입 및 정산 결과`;
  byId("raid-result-totals").textContent = `순손익 ${net > 0 ? "+" : ""}${count(net)}골드 · 마왕방 도달 ${reachedThrone}명`;
  const rows = byId("raid-result-rooms");
  rows.replaceChildren();
  for (const { label, repelled, passed } of raid.rooms.values()) {
    const row = element("tr");
    const heading = element("th", "", label);
    heading.scope = "row";
    row.append(heading, element("td", "", `${repelled.size}명`), element("td", "", `${passed.size}명`));
    rows.append(row);
  }
}

function expandFloor() {
  const cost = expansionCost(state.floors);
  if (expansionBlocker(cost)) return;
  recordTransaction("build", `${state.floors + 1}층 증축`, -cost.gold, 0, Object.fromEntries(Object.entries(cost).filter(([key]) => key !== "gold").map(([key, value]) => [key, -value])));
  for (const [resource, amount] of Object.entries(cost)) state[resource] -= amount;
  state.floors++;
  ensureDeliveryContract();
  advanceManagementGoals();
  renderMap();
  renderManagement();
  byId("route-status").textContent = "새 경로를 테스트할 수 있습니다.";
  log("증축 완료", `${state.floors}층을 열고 마왕방을 꼭대기로 옮겼습니다.`);
}


// Remember the actual opener, including its room/slot identity across map rebuilds.
const dialogOpeners = new WeakMap();
let activeDialogs = [];
let mapSelection = { room: "floor-1-room-1", slot: "0" };
let noticeTimer;

function topDialog() {
  return activeDialogs.filter((dialog) => dialog.open).at(-1) || document.querySelector?.("dialog[open]");
}

function openDialog(dialog, opener = document.activeElement) {
  if (dialog.open) return;
  dialogOpeners.set(dialog, opener);
  dialog.showModal();
  activeDialogs = activeDialogs.filter((entry) => entry.open && entry !== dialog);
  activeDialogs.push(dialog);
}

function selectedMapSlot() {
  const room = document.querySelector(`[data-room="${mapSelection.room}"]`);
  return room?.querySelector(mapSelection.slot === "trap" ? "[data-trap-slot]" : `[data-slot="${mapSelection.slot}"]`);
}

function focusMap() {
  const slot = selectedMapSlot() || document.querySelector(".slot-monster");
  slot?.focus({ preventScroll: true });
  slot?.scrollIntoView({ block: "nearest", inline: "nearest" });
}

function showMapNotice(category, message) {
  const notice = byId("map-notice");
  if (!notice) return;
  notice.textContent = `${category} · ${message}`;
  notice.hidden = false;
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => { notice.hidden = true; }, 6500);
}

function handleMapKeydown(event) {
  if (!event.target.matches("[data-slot], [data-trap-slot]")) return;
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
  const rooms = [...byId("dungeon-map").querySelectorAll(".room-normal")];
  const room = event.target.closest(".room-normal");
  const slots = [...room.querySelectorAll(".slot")].filter((slot) => !slot.hidden);
  let target;
  const index = slots.indexOf(event.target);
  if (event.key === "ArrowUp" || event.key === "ArrowDown") target = slots[(index + (event.key === "ArrowUp" ? -1 : 1) + slots.length) % slots.length];
  else if (event.key === "Home" || event.key === "End") target = rooms[event.key === "Home" ? 0 : rooms.length - 1].querySelector(".slot");
  else {
    const next = rooms[rooms.indexOf(room) + (event.key === "ArrowLeft" ? -1 : 1)];
    const selector = event.target.hasAttribute("data-trap-slot") ? "[data-trap-slot]:not([hidden])" : `[data-slot="${event.target.dataset.slot}"]`;
    target = next?.querySelector(selector) || next?.querySelector(".slot");
  }
  event.preventDefault();
  target?.focus({ preventScroll: true });
  target?.scrollIntoView({ block: "nearest", inline: "nearest" });
}

function restoreDialogFocus(dialog) {
  const opener = dialogOpeners.get(dialog);
  const target = opener?.isConnected ? opener : selectedMapSlot();
  target?.focus({ preventScroll: true });
  renderFirstDayGuide();
}

function handleDungeonShortcut(event) {
  if (event.ctrlKey || event.altKey || event.metaKey || event.repeat || topDialog() || event.target.matches("input, select, textarea, [contenteditable=true]")) return;
  const actions = { d: focusMap, o: () => byId("open-operations").click(), i: () => byId("start-route").click(), p: toggleRaidPause, "1": () => setRaidSpeed(1), "2": () => setRaidSpeed(2), r: () => { if (!byId("raid-result").hidden) byId("raid-result").focus(); } };
  const action = actions[event.key.toLowerCase()];
  if (action) { event.preventDefault(); action(); }
}

function initializeDungeonUI() {
  const dungeon = byId("dungeon-section");
  const operations = byId("operations-content");
  operations.append(document.querySelector(".management-goals"), byId("management-section"), byId("daily-ledger"));
  const layout = element("div", "dungeon-layout");
  const stage = element("div", "map-stage");
  const sidebar = element("aside", "map-sidebar");
  sidebar.setAttribute("aria-label", "선택 및 침입 결과");
  const selection = element("p", "selection-readout", "◇ 1층 1번 방 · 슬롯 1 선택");
  selection.id = "map-selection";
  const notice = element("p", "map-notice");
  notice.id = "map-notice";
  notice.hidden = true;
  notice.setAttribute("role", "status");
  const keys = element("p", "keyboard-help", "D 지도 · 방향키 슬롯 이동 · Enter 선택\nI 침입 · P 일시정지 · 1 / 2 배속\nO 운영 · R 정산 · Esc 창 닫기");
  sidebar.append(selection, notice, byId("first-day-guide-home"), byId("raid-result"), keys);
  for (const selector of [".map-scroll", ".route-controls", "#raid-preview", "#royal-challenge-choice", "#royal-history", "#scout-report"]) stage.append(dungeon.querySelector(selector));
  layout.append(stage, sidebar);
  dungeon.querySelector(".map-legend").after(layout);
  byId("map-guide").textContent = "방의 몬스터 슬롯에서 모집, 함정 슬롯에서 설치·개조를 진행하세요. 방향키로 슬롯을 고르고 Enter로 엽니다.";
  const help = element("details", "map-help");
  help.append(element("summary", "", "지도와 작업장 이용 안내"));
  for (const paragraph of [...dungeon.querySelectorAll(":scope > .map-guide")]) help.append(paragraph);
  dungeon.append(help);
  const map = byId("dungeon-map");
  const remember = (target) => {
    const room = target.closest("[data-room]");
    if (!room) return;
    for (const previous of map.querySelectorAll(".room-selected")) previous.classList.remove("room-selected");
    room.classList.add("room-selected");
    mapSelection.room = room.dataset.room;
    if (target.matches("[data-slot], [data-trap-slot]")) mapSelection.slot = target.hasAttribute("data-trap-slot") ? "trap" : target.dataset.slot;
    selection.textContent = `◇ ${roomLabel(mapSelection.room)} · ${mapSelection.slot === "trap" ? "함정" : `슬롯 ${Number(mapSelection.slot) + 1}`} 선택`;
  };
  map.addEventListener("focusin", (event) => remember(event.target));
  map.addEventListener("click", (event) => remember(event.target.closest("button, select, summary") || event.target));
  map.addEventListener("keydown", handleMapKeydown);
  for (const dialog of document.querySelectorAll("dialog")) {
    dialog.addEventListener("close", () => restoreDialogFocus(dialog));
  }
  byId("open-operations").addEventListener("click", () => openDialog(byId("operations-dialog")));
  byId("operations-research").addEventListener("click", () => byId("open-research").click());
  for (const button of document.querySelectorAll("[data-operation]")) button.addEventListener("click", () => {
    const target = byId(button.dataset.operation);
    target.tabIndex = -1;
    target.focus();
    target.scrollIntoView({ block: "start" });
  });
  byId("return-to-map").addEventListener("click", focusMap);
  byId("raid-result").tabIndex = -1;
  document.addEventListener("keydown", handleDungeonShortcut);
}

buildMonsterCatalog();
buildTrapCatalog();
buildResearchCatalog();
initializeDungeonUI();
renderMap();
renderManagement();
for (const [units, poses] of [
  [MONSTERS, ["attack"]],
  [HERO_CLASSES, ["idle", "walk-1", "walk-2", "attack"]],
  [TRAPS, ["active"]],
]) {
  for (const unit of units) {
    for (const pose of poses) new Image().src = spriteUrl(unit.sprite, pose);
  }
}
byId("royal-challenge").addEventListener("change", (event) => {
  if (state.running || isBankrupt()) return;
  royalSelected = state.floors >= 3 && event.target.checked;
  renderManagement();
});
byId("start-route").addEventListener("click", runRoute);
byId("pause-raid").addEventListener("click", toggleRaidPause);
byId("raid-speed-1").addEventListener("click", () => setRaidSpeed(1));
byId("raid-speed-2").addEventListener("click", () => setRaidSpeed(2));
byId("toggle-scout-report").addEventListener("click", toggleScoutReport);
byId("close-first-day-guide").addEventListener("click", closeFirstDayGuide);
byId("open-first-day-guide").addEventListener("click", () => {
  state.firstDayGuide.dismissed = false;
  renderFirstDayGuide();
  byId("close-first-day-guide").focus();
});
byId("confirm-first-settlement").addEventListener("click", confirmFirstSettlement);
for (const dialog of document.querySelectorAll("dialog")) {
  dialog.addEventListener("close", renderFirstDayGuide);
}
byId("debt-payment-form").addEventListener("submit", payDebt);
byId("bank-loan-form").addEventListener("submit", takeLoan);
byId("bank-loan").addEventListener("input", renderLoanPreview);
byId("restart-game").addEventListener("click", startNewGame);
byId("victory-new-game").addEventListener("click", startNewGame);
byId("continue-operation").addEventListener("click", () => {
  byId("victory-screen").hidden = true;
  byId("start-route").focus();
});
byId("throne-reward").addEventListener("input", previewThroneReward);
byId("throne-reward-form").addEventListener("submit", applyThroneReward);
byId("open-activities").addEventListener("click", () => {
  renderActivities();
  openDialog(byId("activities-dialog"));
  renderFirstDayGuide();
});
byId("promotion-buy").addEventListener("click", promoteDungeon);
byId("deliver-contract").addEventListener("click", () => resolveDeliveryContract(true));
byId("decline-contract").addEventListener("click", () => resolveDeliveryContract(false));
byId("open-research").addEventListener("click", () => {
  renderResearch();
  openDialog(byId("research-dialog"));
  renderFirstDayGuide();
});
byId("expand-floor").addEventListener("click", expandFloor);
byId("dismiss-monster").addEventListener("click", dismissMonster);
byId("monster-move-form").addEventListener("submit", moveMonster);
byId("remove-trap").addEventListener("click", removeTrap);
byId("open-game-settings").addEventListener("click", openGameSettings);
byId("name-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (state.running) return;
  if (applyNames()) byId("save-status").textContent = "이름을 적용했습니다. 다음에도 쓰려면 게임을 저장하세요.";
});
byId("save-game").addEventListener("click", saveGame);
byId("load-game").addEventListener("click", loadGame);
byId("route-status").textContent = "용사를 불러 던전 방어를 시작하세요.";
log("운영 시작", `1층에 일반방 ${ROOMS_PER_FLOOR}개와 마왕방이 열렸습니다.`);

byId("ledger-day").addEventListener("change", (event) => {
  selectedLedgerDay = Number(event.target.value);
  renderLedger();
});
