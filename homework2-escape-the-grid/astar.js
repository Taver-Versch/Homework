const gridElement = document.getElementById('grid');
const rows = 20, cols = 20;
let grid = [], startNode, goalNode, steps = 0;

// Obstacle density slider
const densitySlider = document.getElementById('density');
const densityValue = document.getElementById('densityValue');
densitySlider.addEventListener('input', () => {
  densityValue.textContent = parseFloat(densitySlider.value).toFixed(2);
});

// ------------------ Grid Creation ------------------
function createGrid() {
  const density = parseFloat(densitySlider.value);
  gridElement.innerHTML = '';
  grid = [];

  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';

      // Random obstacles based on density
      if (Math.random() < density) cell.classList.add('blocked');

      // Mouse interactions
      let mouseDown = false;
      cell.addEventListener('mousedown', () => { mouseDown = true; });
      cell.addEventListener('mouseup', () => { mouseDown = false; });
      cell.addEventListener('mouseenter', () => {
        if (mouseDown && !cell.classList.contains('start') && !cell.classList.contains('goal')) {
          cell.classList.toggle('blocked');
          grid[r][c].blocked = cell.classList.contains('blocked');
        }
      });
      cell.addEventListener('click', () => {
        if (!cell.classList.contains('start') && !cell.classList.contains('goal')) {
          cell.classList.toggle('blocked');
          grid[r][c].blocked = cell.classList.contains('blocked');
        }
      });

      gridElement.appendChild(cell);

      row.push({
        r,
        c,
        element: cell,
        blocked: cell.classList.contains('blocked'),
        g: Infinity,
        h: 0,
        f: Infinity,
        parent: null
      });
    }
    grid.push(row);
  }

  // Start & goal
  startNode = grid[0][0];
  goalNode = grid[rows - 1][cols - 1];
  startNode.blocked = false;
  goalNode.blocked = false;
  startNode.element.classList.add('start');
  goalNode.element.classList.add('goal');
}

// ------------------ Button Events ------------------
window.addEventListener('DOMContentLoaded', () => {
  createGrid(); // random grid on load

  document.getElementById('run').addEventListener('click', async () => {
    await runAStar();
  });

  document.getElementById('reset').addEventListener('click', () => {
    steps = 0;
    updateStats(0,0,0);
    createGrid(); // new random grid
  });
});

// ------------------ A* Algorithm ------------------
function heuristic(a,b){ return Math.abs(a.r-b.r)+Math.abs(a.c-b.c); }

async function runAStar() {
  steps = 0;

  for(const row of grid) for(const node of row){
    node.g = Infinity; node.f = Infinity; node.parent = null;
    node.element.classList.remove('open','closed','path');
  }

  const openSet = [startNode];
  startNode.g = 0;
  startNode.f = heuristic(startNode, goalNode);

  while(openSet.length > 0) {
    openSet.sort((a,b)=>a.f-b.f);
    const current = openSet.shift();

    if(current === goalNode){
      await reconstructPath(current);
      return;
    }

    current.element.classList.add('closed');
    steps++;
    updateStats(steps, openSet.length, 0);

    for(const neighbor of getNeighbors(current)){
      if(neighbor.blocked || neighbor.element.classList.contains('closed')) continue;
      const tentativeG = current.g + 1;
      if(tentativeG < neighbor.g){
        neighbor.g = tentativeG;
        neighbor.h = heuristic(neighbor, goalNode);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;
        if(!openSet.includes(neighbor)){
          openSet.push(neighbor);
          neighbor.element.classList.add('open');
        }
      }
    }
    await sleep(30);
  }

  alert("No path found!");
}

function getNeighbors(node){
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]]; // 4 directions
  const neighbors = [];
  for(const [dr,dc] of dirs){
    const r = node.r + dr, c = node.c + dc;
    if(r>=0 && r<rows && c>=0 && c<cols) neighbors.push(grid[r][c]);
  }
  return neighbors;
}

async function reconstructPath(node){
  let length = 0;
  let current = node.parent;
  while(current && current !== startNode){
    current.element.classList.remove('open','closed');
    current.element.classList.add('path');
    current = current.parent;
    length++;
    updateStats(steps,0,length);
    await sleep(50);
  }
}

// ------------------ Helpers ------------------
function sleep(ms){ return new Promise(resolve=>setTimeout(resolve,ms)); }

function updateStats(stepsVal, openSizeVal, pathLenVal){
  document.getElementById('steps').textContent = `Steps: ${stepsVal}`;
  document.getElementById('openSize').textContent = `Open Set: ${openSizeVal}`;
  document.getElementById('pathLength').textContent = `Path: ${pathLenVal}`;
}
