//attacks from osrs
const attacks = Object.freeze([
  { id: "wind_strike", name: "Wind Strike", energy: 4, damage: 4, icon: "⚪" },
  { id: "water_bolt", name: "Water Bolt", energy: 8, damage: 11, icon: "💧" },
  { id: "fire_wave", name: "Fire Wave", energy: 13, damage: 21, icon: "💢" }
]);


//Monsters from osrs
const monsters = Object.freeze([
  { id: "zombie", name: "Zombie", baseHp: 22, icon: "🧟", counterMinDamage: 1, counterMaxDamage: 5 },
  { id: "ghost", name: "Ghost", baseHp: 25, icon: "👻", counterMinDamage: 3, counterMaxDamage: 7 },
  { id: "vampyre", name: "Vampyre", baseHp: 40, icon: "🧛", counterMinDamage: 5, counterMaxDamage: 10 },
  { id: "pumpkin", name: "Pumpkin", baseHp: 1, icon: "🎃", counterMinDamage: 0, counterMaxDamage: 5 }
]);

const hero = Object.freeze({
  hp: 50,
  maxHp: 50,
  energy: 75
});

function selectOne(selector, root = document) {
  return root.querySelector(selector);
}

function selectAll(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function shuffleCopy(array) {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function randomizedHp(baseHp) {
  const min = 0.8;
  const max = 1.2;
  const randomPercent = Math.random() * (max - min) + min;
  const newHp = baseHp * randomPercent;
  return Math.max(1, Math.round(newHp));
}


function battleLog(text) {
  const logBox = selectOne(".log-box");
  if (!logBox) return;
  const line = document.createElement("div");
  line.className = "log-line";
  line.textContent = text;
  logBox.appendChild(line);
  logBox.scrollTop = logBox.scrollHeight;
}

const state = {
  hero: {
    hp: hero.hp,
    maxHp: hero.maxHp,
    energy: hero.energy
  },
  monsters: [],
  currentMonsterIndex: 0,
  goal: "min_energy"
};

function setMonsterList() {
  let listContainer = selectOne("#monsterList");
  if (!listContainer) {
    const container = document.createElement("div");
    container.id = "monsterList";
    container.className = "monster-list";
    const cards = selectOne(".cards");
    if (cards && cards.parentNode) cards.parentNode.insertBefore(container, cards);
    listContainer = container;
  }
  monsterLineup();
}

function monsterLineup() {
  const listContainer = selectOne("#monsterList");
  if (!listContainer) return;
  listContainer.innerHTML = "<h3>👹Monsters!!👹</h3>";
  const row = document.createElement("div");
  row.className = "monster-row";
  state.monsters.forEach((monster, index) => {
    const status = monster.hp > 0 ? "Alive" : "Defeated";
    const pointer = index === state.currentMonsterIndex ? "=> " : "";
    const item = document.createElement("div");
    item.className = "monster-icon";
    item.textContent = `${pointer}${monster.icon} ${monster.name} - ${status}`;
    row.appendChild(item);
  });
  listContainer.appendChild(row);
}

function heroCard() {
  const heroCard = selectOne(".cards .card:nth-child(1)");
  if (!heroCard) return;
  heroCard.innerHTML = `
    <h2>⚜️ Hero</h2>
    <p><strong>HP ❤️:</strong> <span id="heroHp">${state.hero.hp}</span> /
       <span id="heroMax">${state.hero.maxHp}</span></p>
    <p><strong>Energy ⚡:</strong> <span id="heroEnergy">${state.hero.energy}</span></p>
  `;
}

function monsterCard() {
  const currentMonster = state.monsters[state.currentMonsterIndex];
  const monsterCard = selectOne(".cards .card:nth-child(2)");
  if (!monsterCard || !currentMonster) return;
  monsterCard.innerHTML = `
    <h2><strong>${currentMonster.icon} ${currentMonster.name}</strong></h2>
    <p><strong>HP ❤️:</strong> <span id="monsterHp">${currentMonster.hp}</span> /
       <span id="monsterMax">${currentMonster.maxHp}</span></p>
  `;
}

function updateHero() {
  const heroHp = selectOne("#heroHp");
  const heroEnergy = selectOne("#heroEnergy");
  if (heroHp) heroHp.textContent = state.hero.hp;
  if (heroEnergy) heroEnergy.textContent = state.hero.energy;
}

function updateMonster() {
  const currentMonster = state.monsters[state.currentMonsterIndex];
  if (currentMonster) {
    const monsterHp = selectOne("#monsterHp");
    const monsterMax = selectOne("#monsterMax");
    if (monsterHp) monsterHp.textContent = currentMonster.hp;
    if (monsterMax) monsterMax.textContent = currentMonster.maxHp;
  }
  monsterLineup();
}

function attackButtons() {
  const buttons = selectAll(".attack-buttons .button");
  buttons.forEach((button, index) => {
    const move = attacks[index];
    if (!move) return;
    button.dataset.moveId = move.id;
    button.textContent = `${move.icon} ${move.name} (${move.energy}⚡ | Dmg ${move.damage})`;
    button.onclick = () => onAttack(move.id);
  });
}

function goal() {
  const goalSelect = selectOne("#goalSelect");
  if (goalSelect) {
    state.goal = goalSelect.value || "min_energy";
    goalSelect.addEventListener("change", () => {
      state.goal = goalSelect.value || "min_energy";
      battleLog(`Goal set: ${state.goal}`);
    });
  }
  const planButton = selectOne("#btnPlan");
  if (planButton) {
    planButton.addEventListener("click", () => {
      computePlanAndShow();
      monsterLineup();
    });
  }
}

function newRun() {
  state.monsters = shuffleCopy(monsters)
    .map(monsterType => ({
      id: monsterType.id,
      name: monsterType.name,
      icon: monsterType.icon,
      counterMinDamage: monsterType.counterMinDamage,
      counterMaxDamage: monsterType.counterMaxDamage,
      maxHp: randomizedHp(monsterType.baseHp),
      hp: 0
    }))
    .map(monster => ({ ...monster, hp: monster.maxHp }));
  state.currentMonsterIndex = 0;
  heroCard();
  monsterCard();
  setMonsterList();
  attackButtons();
}

function getCurrentMonster() {
  return state.monsters[state.currentMonsterIndex];
}

function nextMonster() {
  while (
    state.currentMonsterIndex < state.monsters.length &&
    state.monsters[state.currentMonsterIndex].hp <= 0
  ) {
    state.currentMonsterIndex++;
  }

  return state.currentMonsterIndex < state.monsters.length;
}

function randCounterDmg(monster) {
  const min = Math.max(0, Number(monster.counterMinDamage) || 0);
  const max = Math.max(min, Number(monster.counterMaxDamage) || 0);

  if (max <= min) return min;

  return min + ((Math.random() * (max - min + 1)) | 0);
}

function onAttack(moveId) {
  const move = attacks.find(move => move.id === moveId);
  if (!move) return;

  const currentMonster = getCurrentMonster();
  if (!currentMonster) { battleLog("There are no monsters left."); return; }
  if (state.hero.hp <= 0) { battleLog("You are defeated!"); return; }
  if (state.hero.energy < move.energy) { battleLog(`Not enough energy for ${move.name}.`); return; }

  state.hero.energy -= move.energy;
  currentMonster.hp = Math.max(0, currentMonster.hp - move.damage);
  battleLog(`Used ${move.name}: dealt ${move.damage} to ${currentMonster.name}.`);
  updateHero();
  updateMonster();

  if (currentMonster.hp > 0) {
    const counterDamage = randCounterDmg(currentMonster);
    if (counterDamage > 0) {
      state.hero.hp = Math.max(0, state.hero.hp - counterDamage);
      battleLog(`${currentMonster.name} hits you back for ${counterDamage} damage!`);
      updateHero();
    }
  }

  if (state.hero.energy < 3) {
    battleLog("You have run out of usable energy!");
    battleLog("You were defeated due to tiredness.");
    state.hero.hp = 0;
    updateHero();
    return;
  }

  if (currentMonster.hp <= 0) {
    battleLog(`${currentMonster.name} is defeated!`);
    const moreRemain = nextMonster();
    updateMonster();
    if (!moreRemain) { battleLog(`You defeated all monsters with ${state.hero.energy} energy left!`); return; }
    monsterCard();
    updateMonster();
  }

  if (state.hero.hp <= 0) battleLog("You were defeated!");
}

function dpMinEnergyForHp(targetHp) {
  const maxHp = targetHp;
  const dp = Array(maxHp + 1).fill(Infinity);
  const choice = Array(maxHp + 1).fill(-1);

  dp[0] = 0;

  for (let hp = 1; hp <= maxHp; hp++) {
    for (let i = 0; i < attacks.length; i++) {
      const a = attacks[i];
      const prev = Math.max(0, hp - a.damage);
      const cost = dp[prev] + a.energy;

      if (
        cost < dp[hp] ||
        (cost === dp[hp] && (choice[hp] < 0 || a.energy < attacks[choice[hp]].energy))
      ) {
        dp[hp] = cost;
        choice[hp] = i;
      }
    }
  }

  const seq = [];
  let hp = maxHp;

  while (hp > 0 && choice[hp] >= 0) {
    const i = choice[hp];
    seq.push(attacks[i]);
    hp = Math.max(0, hp - attacks[i].damage);
  }

  return {
    energy: dp[maxHp],
    sequence: seq.reverse(),
    table: dp
  };
}

function buildPlanMinEnergy() {
  const steps = [];
  let totalEnergy = 0;

  for (let k = 0; k < state.monsters.length; k++) {
    const monster = state.monsters[k];
    const result = dpMinEnergyForHp(monster.hp);

    totalEnergy += result.energy;

    steps.push({
      monsterIndex: k,
      monsterName: monster.name,
      sequence: result.sequence,
      energy: result.energy
    });
  }

  return {
    totalEnergy,
    steps
  };
}

function dpMaxDamageGivenEnergy(energyBudget) {
  const dp = Array(energyBudget + 1).fill(0);
  const choice = Array(energyBudget + 1).fill(-1);
  for (let e = 1; e <= energyBudget; e++) {
    for (let i = 0; i < attacks.length; i++) {
      const a = attacks[i];
      if (a.energy <= e) {
        const cand = dp[e - a.energy] + a.damage;
        if (cand > dp[e] || (cand === dp[e] && (choice[e] < 0 || a.energy < attacks[choice[e]].energy))) {
          dp[e] = cand;
          choice[e] = i;
        }
      }
    }
  }
  const seq = [];
  let e = energyBudget;
  while (e > 0 && choice[e] >= 0) {
    const i = choice[e];
    seq.push(attacks[i]);
    e -= attacks[i].energy;
  }
  return { damage: dp[energyBudget], sequence: seq.reverse(), table: dp };
}

function computePlanAndShow() {
  if (state.goal === "min_energy") {
    const plan = buildPlanMinEnergy();

    battleLog("Plan: minimize total energy");

    for (let s = 0; s < plan.steps.length; s++) {
      const step = plan.steps[s];
      const monster = state.monsters[step.monsterIndex];
      const names = step.sequence.map(mv => mv.name).join(", ");

      battleLog(
        `${s + 1}. ${monster.icon} ${monster.name} — HP: ${monster.hp}/${monster.maxHp} → ${names} (Energy ${step.energy})`
      );
    }

    battleLog(`Total energy: ${plan.totalEnergy}`);
  } else {
    const plan = dpMaxDamageGivenEnergy(state.hero.energy);
    const names = plan.sequence.map(mv => mv.name).join(", ");

    battleLog("Plan: maximize damage within energy");
    battleLog(`Moves: ${names}`);
    battleLog(`Total damage: ${plan.damage}`);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  goal();
  newRun();
});