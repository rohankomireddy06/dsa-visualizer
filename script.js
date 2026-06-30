// ============================================================
//  UTILITIES
// ============================================================
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function getSpeed() {
  const v = +document.getElementById('speed-slider').value;
  return [200, 80, 35, 12, 4][v - 1];
}
function setStatus(id, state, msg) {
  const dot  = document.getElementById(id + '-dot');
  const text = document.getElementById(id + '-status');
  if (dot)  dot.className  = 'status-dot ' + state;
  if (text) text.textContent = msg;
}

// ============================================================
//  TAB NAVIGATION
// ============================================================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.section).classList.add('active');
  });
});

// ============================================================
//  CODE TEMPLATES
// ============================================================
const codeTemplates = {
  bubble: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap if out of order
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
    // arr[n-i-1] is now sorted
  }
  return arr;
}`,
  selection: `function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    // Find minimum in remaining array
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    // Swap minimum with current position
    let temp = arr[minIdx];
    arr[minIdx] = arr[i];
    arr[i] = temp;
  }
  return arr;
}`,
  insertion: `function insertionSort(arr) {
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    // Pick element to insert
    let key = arr[i];
    let j = i - 1;
    // Shift elements greater than key
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    // Place key in correct position
    arr[j + 1] = key;
  }
  return arr;
}`,
  merge: `function mergeSort(arr, l, r) {
  if (l >= r) return;
  // Find midpoint
  let mid = Math.floor((l + r) / 2);
  // Sort left half
  mergeSort(arr, l, mid);
  // Sort right half
  mergeSort(arr, mid + 1, r);
  // Merge sorted halves
  merge(arr, l, mid, r);
}

function merge(arr, l, mid, r) {
  let left  = arr.slice(l, mid + 1);
  let right = arr.slice(mid + 1, r + 1);
  let i = 0, j = 0, k = l;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) arr[k++] = left[i++];
    else arr[k++] = right[j++];
  }
  while (i < left.length)  arr[k++] = left[i++];
  while (j < right.length) arr[k++] = right[j++];
}`,
  quick: `function quickSort(arr, low, high) {
  if (low >= high) return;
  // Partition around pivot
  let pi = partition(arr, low, high);
  // Sort left of pivot
  quickSort(arr, low, pi - 1);
  // Sort right of pivot
  quickSort(arr, pi + 1, high);
}

function partition(arr, low, high) {
  // Choose rightmost as pivot
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      // Swap arr[i] and arr[j]
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  // Place pivot in correct spot
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`
};

const pathCodeTemplates = {
  bfs: `function bfs(grid, start, end) {
  // Initialize queue with start node
  let queue = [start];
  start.visited = true;

  while (queue.length > 0) {
    // Dequeue front node
    let current = queue.shift();

    // Check if we reached the end
    if (current === end) return true;

    // Visit all unvisited neighbors
    let neighbors = getNeighbors(current);
    for (let neighbor of neighbors) {
      neighbor.visited = true;
      neighbor.parent  = current;
      queue.push(neighbor);
    }
  }
  // No path found
  return false;
}`,
  dfs: `function dfs(grid, start, end) {
  // Initialize stack with start node
  let stack = [start];

  while (stack.length > 0) {
    // Pop top node
    let current = stack.pop();
    if (current.visited) continue;
    current.visited = true;

    // Check if we reached the end
    if (current === end) return true;

    // Push all unvisited neighbors
    let neighbors = getNeighbors(current);
    for (let neighbor of neighbors) {
      neighbor.parent = current;
      stack.push(neighbor);
    }
  }
  // No path found
  return false;
}`,
  dijkstra: `function dijkstra(grid, start, end) {
  // Set all distances to infinity
  let dist = new Map();
  for (let cell of allCells) dist.set(cell, Infinity);
  dist.set(start, 0);

  let pq = [start];
  start.visited = true;

  while (pq.length > 0) {
    // Get node with smallest distance
    pq.sort((a,b) => dist.get(a) - dist.get(b));
    let current = pq.shift();

    if (current === end) return true;

    // Relax neighbors
    for (let nb of getNeighbors(current)) {
      let newDist = dist.get(current) + 1;
      if (newDist < dist.get(nb)) {
        dist.set(nb, newDist);
        nb.parent  = current;
        nb.visited = true;
        pq.push(nb);
      }
    }
  }
  return false;
}`
};

const bstCodeTemplate = `class BSTNode {
  constructor(val) {
    this.val   = val;
    this.left  = null;
    this.right = null;
  }
}

function insert(root, val) {
  // Base case: create new node
  if (!root) return new BSTNode(val);
  // Go left if smaller
  if (val < root.val)
    root.left  = insert(root.left,  val);
  // Go right if larger
  else if (val > root.val)
    root.right = insert(root.right, val);
  return root;
}

function search(root, val) {
  // Not found
  if (!root) return false;
  // Found it
  if (root.val === val) return true;
  // Search left or right
  if (val < root.val)
    return search(root.left,  val);
  return search(root.right, val);
}

function inorder(root, result = []) {
  if (!root) return result;
  inorder(root.left,  result);
  result.push(root.val);
  inorder(root.right, result);
  return result;
}`;

// ============================================================
//  PSEUDOCODE DEFINITIONS
// ============================================================
const pseudoCodes = {
  bubble: [
    'for i = 0 to n-1:',
    '  for j = 0 to n-i-2:',
    '    if arr[j] > arr[j+1]:',
    '      swap(arr[j], arr[j+1])',
    '  mark arr[n-i-1] sorted',
  ],
  selection: [
    'for i = 0 to n-1:',
    '  minIdx = i',
    '  for j = i+1 to n:',
    '    if arr[j] < arr[minIdx]:',
    '      minIdx = j',
    '  swap(arr[i], arr[minIdx])',
  ],
  insertion: [
    'for i = 1 to n:',
    '  key = arr[i]; j = i-1',
    '  while j>=0 and arr[j]>key:',
    '    arr[j+1] = arr[j]; j--',
    '  arr[j+1] = key',
  ],
  merge: [
    'mergeSort(arr, l, r):',
    '  if l >= r: return',
    '  mid = (l+r)/2',
    '  mergeSort(arr, l, mid)',
    '  mergeSort(arr, mid+1, r)',
    '  merge(arr, l, mid, r)',
  ],
  quick: [
    'quickSort(arr, low, high):',
    '  if low >= high: return',
    '  pivot = arr[high]',
    '  i = low - 1',
    '  for j = low to high-1:',
    '    if arr[j] <= pivot:',
    '      i++; swap(i,j)',
    '  swap(i+1, high)',
  ],
};

const complexityData = {
  bubble:    { time:'O(n²)',        best:'O(n)',        space:'O(1)' },
  selection: { time:'O(n²)',        best:'O(n²)',       space:'O(1)' },
  insertion: { time:'O(n²)',        best:'O(n)',        space:'O(1)' },
  merge:     { time:'O(n log n)',   best:'O(n log n)', space:'O(n)' },
  quick:     { time:'O(n log n)',   best:'O(n log n)', space:'O(log n)' },
};

// ============================================================
//  SORTING VISUALIZER
// ============================================================
let sortArray = [];
let isSorting = false;
let stopFlag  = false;
let currentEditorLines = [];
let activeEditorLine   = -1;

function highlightEditorLine(lineIndex) {
  activeEditorLine = lineIndex;
  renderEditorHighlight();
}

function renderEditorHighlight() {
  const editor = document.getElementById('code-editor');
  const lines  = editor.value.split('\n');
  currentEditorLines = lines;
  // We scroll to the active line
  if (activeEditorLine >= 0 && activeEditorLine < lines.length) {
    const lineHeight = 21.6; // approx px per line at font-size 12 line-height 1.8
    editor.scrollTop = Math.max(0, (activeEditorLine - 3) * lineHeight);
  }
}

// Overlay canvas approach for line highlighting
function setupEditorOverlay(editorId, overlayId) {
  // We'll just use background-image linear-gradient trick via JS
}

function highlightEditorLineVisual(editorId, lineNum) {
  const el = document.getElementById(editorId);
  if (!el) return;
  const lines = el.value.split('\n');
  const lineH = el.scrollHeight / lines.length;
  el.style.backgroundImage = lineNum >= 0
    ? `linear-gradient(transparent ${lineNum * lineH}px, rgba(124,106,247,0.18) ${lineNum * lineH}px, rgba(124,106,247,0.18) ${(lineNum + 1) * lineH}px, transparent ${(lineNum + 1) * lineH}px)`
    : 'none';
  if (lineNum >= 0) {
    el.scrollTop = Math.max(0, lineNum * lineH - el.clientHeight / 2);
  }
}

function renderBars(arr, colors) {
  const canvas = document.getElementById('sort-canvas');
  canvas.innerHTML = '';
  const maxVal = Math.max(...arr, 1);
  arr.forEach((v, i) => {
    const bar = document.createElement('div');
    bar.className = 'bar ' + (colors[i] || '');
    bar.style.height = ((v / maxVal) * 280) + 'px';
    canvas.appendChild(bar);
  });
}

function renderPseudo(algo, activeLine) {
  const lines = pseudoCodes[algo] || [];
  document.getElementById('pseudo-code').innerHTML = lines.map((l, i) =>
    `<div class="pseudo-line ${i === activeLine ? 'active' : ''}">${l}</div>`
  ).join('');
}

function updateComplexity() {
  const algo = document.getElementById('algo-select').value;
  const d = complexityData[algo];
  document.getElementById('complexity-display').innerHTML = `
    <div class="badge badge-time">Worst: ${d.time}</div>
    <div class="badge badge-time">Best: ${d.best}</div>
    <div class="badge badge-space">Space: ${d.space}</div>
  `;
}

function generateArray() {
  if (isSorting) return;
  const size = +document.getElementById('size-slider').value;
  sortArray = Array.from({length: size}, () => Math.floor(Math.random() * 280) + 20);
  renderBars(sortArray, []);
  updateComplexity();
  const algo = document.getElementById('algo-select').value;
  renderPseudo(algo, -1);
  setStatus('sort', 'idle', 'Ready — press Sort.');
  document.getElementById('step-info').textContent = 'Press Sort to begin.';
  highlightEditorLineVisual('code-editor', -1);
}

function loadEditorTemplate() {
  const algo = document.getElementById('algo-select').value;
  document.getElementById('code-editor').value = codeTemplates[algo] || '';
  highlightEditorLineVisual('code-editor', -1);
}

document.getElementById('algo-select').addEventListener('change', () => {
  loadEditorTemplate();
  generateArray();
});
document.getElementById('size-slider').addEventListener('input', e => {
  document.getElementById('size-val').textContent = e.target.value;
  generateArray();
});
document.getElementById('speed-slider').addEventListener('input', e => {
  const labels = ['Very Slow','Slow','Medium','Fast','Very Fast'];
  document.getElementById('speed-val').textContent = labels[e.target.value - 1];
});
document.getElementById('gen-btn').addEventListener('click', generateArray);
document.getElementById('sort-btn').addEventListener('click', startSort);
document.getElementById('stop-btn').addEventListener('click', () => { stopFlag = true; setStatus('sort','idle','Stopped.'); });

// Map algorithm steps to editor line numbers (approximate)
const editorLineMap = {
  bubble:    { outer:0, inner:1, compare:2, swap:3 },
  selection: { outer:0, minInit:1, inner:2, minCheck:3, minUpdate:4, swapLine:6 },
  insertion: { outer:0, keyLine:1, shiftLoop:2, shiftBody:3, place:4 },
  merge:     { check:1, midLine:2, leftCall:3, rightCall:4, mergeCall:5 },
  quick:     { check:1, pivotLine:2, iLine:3, loop:4, cmp:5, swapBody:6, pivotPlace:7 },
};

async function startSort() {
  if (isSorting || sortArray.length === 0) return;
  stopFlag = false; isSorting = true;
  document.getElementById('sort-btn').disabled  = true;
  document.getElementById('stop-btn').disabled  = false;
  document.getElementById('gen-btn').disabled   = true;
  document.getElementById('algo-select').disabled = true;
  setStatus('sort','running','Sorting…');

  const algo = document.getElementById('algo-select').value;
  const arr  = [...sortArray];
  try {
    if (algo === 'bubble')    await bubbleSort(arr);
    if (algo === 'selection') await selectionSort(arr);
    if (algo === 'insertion') await insertionSort(arr);
    if (algo === 'merge')     await mergeSort(arr, 0, arr.length - 1);
    if (algo === 'quick')     await quickSort(arr, 0, arr.length - 1);
    if (!stopFlag) {
      renderBars(arr, arr.map(() => 'sorted'));
      setStatus('sort','done','✓ Sorted!');
      document.getElementById('step-info').innerHTML = '<strong>Done!</strong> All elements sorted.';
      renderPseudo(algo, -1);
      highlightEditorLineVisual('code-editor', -1);
    }
  } catch(e) {}

  isSorting = false;
  document.getElementById('sort-btn').disabled  = false;
  document.getElementById('stop-btn').disabled  = true;
  document.getElementById('gen-btn').disabled   = false;
  document.getElementById('algo-select').disabled = false;
}

function setStepInfo(msg) { document.getElementById('step-info').innerHTML = msg; }

// --- BUBBLE SORT ---
async function bubbleSort(arr) {
  const n = arr.length;
  const map = editorLineMap.bubble;
  for (let i = 0; i < n - 1; i++) {
    renderPseudo('bubble', 0); highlightEditorLineVisual('code-editor', 1);
    for (let j = 0; j < n - i - 1; j++) {
      if (stopFlag) return;
      renderPseudo('bubble', 1); highlightEditorLineVisual('code-editor', 2);
      const colors = arr.map((_,k) => k > n-i-2 ? 'sorted' : k===j||k===j+1 ? 'comparing' : '');
      renderBars(arr, colors);
      setStepInfo(`Comparing <strong>${arr[j]}</strong> and <strong>${arr[j+1]}</strong>`);
      renderPseudo('bubble', 2); highlightEditorLineVisual('code-editor', 3);
      await sleep(getSpeed());
      if (arr[j] > arr[j+1]) {
        colors[j] = 'swapping'; colors[j+1] = 'swapping';
        renderBars(arr, colors);
        renderPseudo('bubble', 3); highlightEditorLineVisual('code-editor', 5);
        setStepInfo(`Swapping <strong>${arr[j]}</strong> ↔ <strong>${arr[j+1]}</strong>`);
        await sleep(getSpeed());
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
      }
    }
  }
}

// --- SELECTION SORT ---
async function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    renderPseudo('selection', 1); highlightEditorLineVisual('code-editor', 2);
    for (let j = i + 1; j < n; j++) {
      if (stopFlag) return;
      renderPseudo('selection', 2); highlightEditorLineVisual('code-editor', 3);
      const colors = arr.map((_,k) => k < i ? 'sorted' : k===minIdx ? 'pivot' : k===j ? 'comparing' : '');
      renderBars(arr, colors);
      setStepInfo(`Min so far: <strong>${arr[minIdx]}</strong> at [${minIdx}], checking <strong>${arr[j]}</strong>`);
      await sleep(getSpeed());
      if (arr[j] < arr[minIdx]) { renderPseudo('selection',4); highlightEditorLineVisual('code-editor',5); minIdx = j; }
    }
    if (minIdx !== i) {
      renderPseudo('selection', 5); highlightEditorLineVisual('code-editor', 8);
      const colors = arr.map((_,k) => k < i ? 'sorted' : k===i||k===minIdx ? 'swapping' : '');
      renderBars(arr, colors);
      setStepInfo(`Swapping <strong>${arr[i]}</strong> ↔ min <strong>${arr[minIdx]}</strong>`);
      await sleep(getSpeed());
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
}

// --- INSERTION SORT ---
async function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    renderPseudo('insertion', 0); highlightEditorLineVisual('code-editor', 1);
    let key = arr[i], j = i - 1;
    renderPseudo('insertion', 1); highlightEditorLineVisual('code-editor', 2);
    setStepInfo(`Inserting key = <strong>${key}</strong>`);
    while (j >= 0 && arr[j] > key) {
      if (stopFlag) return;
      renderPseudo('insertion', 2); highlightEditorLineVisual('code-editor', 3);
      arr[j + 1] = arr[j];
      const colors = arr.map((_,k) => k <= i ? 'comparing' : '');
      renderBars(arr, colors);
      setStepInfo(`Shifting <strong>${arr[j]}</strong> right`);
      await sleep(getSpeed());
      renderPseudo('insertion', 3); highlightEditorLineVisual('code-editor', 4);
      j--;
    }
    arr[j + 1] = key;
    renderPseudo('insertion', 4); highlightEditorLineVisual('code-editor', 6);
    await sleep(getSpeed());
  }
}

// --- MERGE SORT ---
async function mergeSort(arr, l, r) {
  if (stopFlag || l >= r) return;
  renderPseudo('merge', 1); highlightEditorLineVisual('code-editor', 1);
  const mid = Math.floor((l + r) / 2);
  renderPseudo('merge', 2); highlightEditorLineVisual('code-editor', 2);
  await mergeSort(arr, l, mid);
  renderPseudo('merge', 3); highlightEditorLineVisual('code-editor', 3);
  await mergeSort(arr, mid + 1, r);
  renderPseudo('merge', 4); highlightEditorLineVisual('code-editor', 4);
  await mergeParts(arr, l, mid, r);
}
async function mergeParts(arr, l, mid, r) {
  const left = arr.slice(l, mid+1), right = arr.slice(mid+1, r+1);
  let i=0,j=0,k=l;
  renderPseudo('merge',5); highlightEditorLineVisual('code-editor', 5);
  while (i < left.length && j < right.length) {
    if (stopFlag) return;
    if (left[i] <= right[j]) arr[k++] = left[i++];
    else arr[k++] = right[j++];
    const colors = arr.map((_,idx) => idx>=l&&idx<=r ? 'comparing' : idx<l ? 'sorted' : '');
    renderBars(arr, colors);
    setStepInfo(`Merging range [${l}…${r}]`);
    await sleep(getSpeed());
  }
  while (i < left.length)  arr[k++] = left[i++];
  while (j < right.length) arr[k++] = right[j++];
}

// --- QUICK SORT ---
async function quickSort(arr, low, high) {
  if (stopFlag || low >= high) return;
  renderPseudo('quick',1); highlightEditorLineVisual('code-editor',1);
  const pi = await qPartition(arr, low, high);
  await quickSort(arr, low, pi - 1);
  await quickSort(arr, pi + 1, high);
}
async function qPartition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  renderPseudo('quick',2); highlightEditorLineVisual('code-editor',2);
  for (let j = low; j < high; j++) {
    if (stopFlag) return i+1;
    renderPseudo('quick',4); highlightEditorLineVisual('code-editor',4);
    const colors = arr.map((_,k) => k===high?'pivot':k===j?'comparing':k<=i?'sorted':'');
    renderBars(arr, colors);
    setStepInfo(`Pivot=<strong>${pivot}</strong>, arr[${j}]=<strong>${arr[j]}</strong>`);
    await sleep(getSpeed());
    if (arr[j] <= pivot) {
      i++;
      renderPseudo('quick',6); highlightEditorLineVisual('code-editor',6);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i+1], arr[high]] = [arr[high], arr[i+1]];
  renderPseudo('quick',7); highlightEditorLineVisual('code-editor',7);
  return i+1;
}

// ============================================================
//  PATHFINDING
// ============================================================
const ROWS = 17, COLS = 36;
let grid = [], startCell = null, endCell = null;
let isMouseDown = false, pathRunning = false;

function initGrid() {
  grid = Array.from({length:ROWS}, (_,r) =>
    Array.from({length:COLS}, (_,c) => ({r,c,wall:false,visited:false,path:false,parent:null,dist:Infinity}))
  );
  startCell = grid[8][3];
  endCell   = grid[8][32];
  renderGrid();
}

function renderGrid() {
  const g = document.getElementById('grid');
  g.style.gridTemplateColumns = `repeat(${COLS}, 26px)`;
  g.innerHTML = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = grid[r][c];
      const div  = document.createElement('div');
      div.className = 'cell';
      div.dataset.r = r; div.dataset.c = c;
      if      (cell === startCell) { div.classList.add('start'); div.textContent='S'; }
      else if (cell === endCell)   { div.classList.add('end');   div.textContent='E'; }
      else if (cell.wall)    div.classList.add('wall');
      else if (cell.path)    div.classList.add('path');
      else if (cell.visited) div.classList.add('visited');
      div.addEventListener('mousedown', e => { isMouseDown=true; handleCell(r,c); e.preventDefault(); });
      div.addEventListener('mouseenter', () => { if(isMouseDown) handleCell(r,c); });
      g.appendChild(div);
    }
  }
}
document.addEventListener('mouseup', () => isMouseDown = false);

function handleCell(r,c) {
  if (pathRunning) return;
  const mode = document.getElementById('draw-mode').value;
  const cell = grid[r][c];
  if (mode==='wall')  { if (cell!==startCell&&cell!==endCell) { cell.wall=!cell.wall; } }
  if (mode==='start') { startCell=cell; cell.wall=false; }
  if (mode==='end')   { endCell=cell;   cell.wall=false; }
  renderGrid();
}

function clearPath() {
  grid.forEach(row=>row.forEach(cell=>{cell.visited=false;cell.path=false;cell.parent=null;cell.dist=Infinity;}));
  renderGrid(); setStatus('path','idle','Path cleared.');
}
function clearGrid() {
  grid.forEach(row=>row.forEach(cell=>{cell.wall=false;cell.visited=false;cell.path=false;cell.parent=null;cell.dist=Infinity;}));
  renderGrid(); setStatus('path','idle','Grid cleared.');
}
function generateMaze() {
  if (pathRunning) return;
  clearGrid();
  grid.forEach(row=>row.forEach(cell=>{
    if (cell!==startCell&&cell!==endCell) cell.wall=Math.random()<0.3;
  }));
  renderGrid();
}

function loadPathEditor() {
  const algo = document.getElementById('path-algo').value;
  document.getElementById('path-code-editor').value = pathCodeTemplates[algo] || '';
  highlightEditorLineVisual('path-code-editor', -1);
}

document.getElementById('path-algo').addEventListener('change', loadPathEditor);
document.getElementById('path-btn').addEventListener('click', runPathfinding);
document.getElementById('clear-path-btn').addEventListener('click', clearPath);
document.getElementById('clear-grid-btn').addEventListener('click', clearGrid);
document.getElementById('maze-btn').addEventListener('click', generateMaze);

function getNeighbors(cell) {
  return [[-1,0],[1,0],[0,-1],[0,1]]
    .map(([dr,dc])=>grid[cell.r+dr]?.[cell.c+dc])
    .filter(n=>n&&!n.wall&&!n.visited);
}

function animCell(cell) {
  if (cell===startCell||cell===endCell) return;
  const div = document.querySelector(`[data-r="${cell.r}"][data-c="${cell.c}"]`);
  if (div) { div.classList.remove('wall'); div.classList.add('visited'); }
}

async function runPathfinding() {
  if (pathRunning) return;
  clearPath(); pathRunning=true;
  document.getElementById('path-btn').disabled=true;
  setStatus('path','running','Searching…');
  const algo = document.getElementById('path-algo').value;
  let found=false;
  if      (algo==='bfs')      found=await bfs();
  else if (algo==='dfs')      found=await dfs();
  else if (algo==='dijkstra') found=await dijkstra();
  if (found) { await animatePath(); setStatus('path','done','✓ Path found!'); }
  else       { setStatus('path','idle','No path found — clear some walls.'); }
  pathRunning=false;
  document.getElementById('path-btn').disabled=false;
  highlightEditorLineVisual('path-code-editor',-1);
}

async function bfs() {
  const queue=[startCell]; startCell.visited=true;
  while(queue.length) {
    highlightEditorLineVisual('path-code-editor',2);
    const curr=queue.shift();
    highlightEditorLineVisual('path-code-editor',5);
    if(curr===endCell) return true;
    animCell(curr);
    await sleep(18);
    highlightEditorLineVisual('path-code-editor',8);
    for(const nb of getNeighbors(curr)) { nb.visited=true; nb.parent=curr; queue.push(nb); }
  }
  return false;
}
async function dfs() {
  const stack=[startCell];
  while(stack.length) {
    highlightEditorLineVisual('path-code-editor',2);
    const curr=stack.pop();
    if(curr.visited) continue;
    curr.visited=true;
    highlightEditorLineVisual('path-code-editor',5);
    if(curr===endCell) return true;
    animCell(curr);
    await sleep(18);
    highlightEditorLineVisual('path-code-editor',9);
    for(const nb of getNeighbors(curr)) { nb.parent=curr; stack.push(nb); }
  }
  return false;
}
async function dijkstra() {
  startCell.dist=0;
  const pq=[startCell];
  while(pq.length) {
    highlightEditorLineVisual('path-code-editor',9);
    pq.sort((a,b)=>a.dist-b.dist);
    const curr=pq.shift();
    if(curr.visited) continue;
    curr.visited=true;
    highlightEditorLineVisual('path-code-editor',12);
    if(curr===endCell) return true;
    animCell(curr);
    await sleep(18);
    highlightEditorLineVisual('path-code-editor',15);
    for(const nb of getNeighbors(curr)) {
      const d=curr.dist+1;
      if(d<nb.dist) { nb.dist=d; nb.parent=curr; pq.push(nb); }
    }
  }
  return false;
}
async function animatePath() {
  let curr=endCell, path=[];
  while(curr&&curr!==startCell) { path.unshift(curr); curr=curr.parent; }
  for(const cell of path) {
    if(cell===endCell) continue;
    const div=document.querySelector(`[data-r="${cell.r}"][data-c="${cell.c}"]`);
    if(div){ div.classList.remove('visited'); div.classList.add('path'); }
    await sleep(30);
  }
}

// ============================================================
//  BST VISUALIZER
// ============================================================
class BSTNode { constructor(v){ this.val=v; this.left=null; this.right=null; } }
let bstRoot=null, bstHighlights=new Set();

function bstInsertNode(root,val) {
  if(!root) return new BSTNode(val);
  if(val<root.val)  root.left =bstInsertNode(root.left,val);
  else if(val>root.val) root.right=bstInsertNode(root.right,val);
  return root;
}
function bstDeleteNode(root,val) {
  if(!root) return null;
  if(val<root.val)       root.left =bstDeleteNode(root.left,val);
  else if(val>root.val)  root.right=bstDeleteNode(root.right,val);
  else {
    if(!root.left)  return root.right;
    if(!root.right) return root.left;
    let succ=root.right;
    while(succ.left) succ=succ.left;
    root.val=succ.val;
    root.right=bstDeleteNode(root.right,succ.val);
  }
  return root;
}

document.getElementById('bst-insert-btn').addEventListener('click', async () => {
  const v=parseInt(document.getElementById('bst-input').value);
  if(isNaN(v)) return;
  highlightEditorLineVisual('bst-code-editor', 8);
  await sleep(300);
  highlightEditorLineVisual('bst-code-editor', 9);
  await sleep(300);
  bstRoot=bstInsertNode(bstRoot,v);
  bstHighlights=new Set([v]);
  drawBST();
  setStatus('bst','done',`Inserted ${v}`);
  document.getElementById('bst-input').value='';
  await sleep(300);
  highlightEditorLineVisual('bst-code-editor', 12);
  await sleep(600);
  bstHighlights.clear(); drawBST();
  highlightEditorLineVisual('bst-code-editor',-1);
});

document.getElementById('bst-delete-btn').addEventListener('click', () => {
  const v=parseInt(document.getElementById('bst-input').value);
  if(isNaN(v)) return;
  bstRoot=bstDeleteNode(bstRoot,v);
  drawBST(); setStatus('bst','done',`Deleted ${v}`);
  document.getElementById('bst-input').value='';
});

document.getElementById('bst-search-btn').addEventListener('click', async () => {
  const v=parseInt(document.getElementById('bst-input').value);
  if(isNaN(v)) return;
  let curr=bstRoot, found=false;
  while(curr) {
    bstHighlights=new Set([curr.val]);
    highlightEditorLineVisual('bst-code-editor',19);
    drawBST(); await sleep(500);
    if(curr.val===v){ found=true; break; }
    highlightEditorLineVisual('bst-code-editor', curr.val>v ? 23 : 25);
    curr=v<curr.val?curr.left:curr.right;
  }
  setStatus('bst', found?'done':'idle', found?`✓ Found ${v}!`:`✗ ${v} not in tree`);
  await sleep(1200);
  bstHighlights.clear(); drawBST();
  highlightEditorLineVisual('bst-code-editor',-1);
});

document.getElementById('bst-inorder-btn').addEventListener('click',   ()=>bstTraverse('inorder'));
document.getElementById('bst-preorder-btn').addEventListener('click',  ()=>bstTraverse('preorder'));
document.getElementById('bst-postorder-btn').addEventListener('click', ()=>bstTraverse('postorder'));
document.getElementById('bst-clear-btn').addEventListener('click', () => {
  bstRoot=null; bstHighlights.clear(); drawBST();
  document.getElementById('traversal-output').textContent='Traversal result will appear here.';
  setStatus('bst','idle','Tree cleared.');
  highlightEditorLineVisual('bst-code-editor',-1);
});

async function bstTraverse(type) {
  const result=[];
  function inorder(n)   { if(!n) return; inorder(n.left); result.push(n.val); inorder(n.right); }
  function preorder(n)  { if(!n) return; result.push(n.val); preorder(n.left); preorder(n.right); }
  function postorder(n) { if(!n) return; postorder(n.left); postorder(n.right); result.push(n.val); }
  if(type==='inorder')   inorder(bstRoot);
  if(type==='preorder')  preorder(bstRoot);
  if(type==='postorder') postorder(bstRoot);

  const visited=[];
  document.getElementById('traversal-output').textContent='';
  setStatus('bst','running',`${type} traversal…`);
  const lineMap={inorder:28,preorder:32,postorder:36};
  for(const v of result) {
    visited.push(v);
    bstHighlights=new Set([v]);
    highlightEditorLineVisual('bst-code-editor', lineMap[type]||28);
    drawBST();
    document.getElementById('traversal-output').textContent=type+': '+visited.join(' → ');
    await sleep(500);
  }
  bstHighlights.clear(); drawBST();
  setStatus('bst','done',`${type} complete`);
  highlightEditorLineVisual('bst-code-editor',-1);
}

function drawBST() {
  const svg=document.getElementById('bst-svg');
  svg.innerHTML='';
  if(!bstRoot) return;
  const W=Math.max(svg.clientWidth||900,900);
  const nodeR=22, levelH=72;
  const pos=new Map();
  function assign(node,depth,left,right) {
    if(!node) return;
    pos.set(node,{x:(left+right)/2, y:depth*levelH+50});
    assign(node.left,depth+1,left,(left+right)/2);
    assign(node.right,depth+1,(left+right)/2,right);
  }
  assign(bstRoot,0,0,W);

  // edges
  pos.forEach((p,node)=>{
    [node.left,node.right].forEach(child=>{
      if(!child||!pos.has(child)) return;
      const c=pos.get(child);
      const line=document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1',p.x); line.setAttribute('y1',p.y);
      line.setAttribute('x2',c.x); line.setAttribute('y2',c.y);
      line.setAttribute('class','bst-edge');
      svg.appendChild(line);
    });
  });

  // nodes
  pos.forEach((p,node)=>{
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','bst-node'+(bstHighlights.has(node.val)?' highlight':''));
    g.setAttribute('transform',`translate(${p.x},${p.y})`);
    const circle=document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.setAttribute('r',nodeR);
    const text=document.createElementNS('http://www.w3.org/2000/svg','text');
    text.textContent=node.val;
    g.appendChild(circle); g.appendChild(text);
    svg.appendChild(g);
  });

  let maxY=0; pos.forEach(p=>{if(p.y>maxY)maxY=p.y;});
  svg.setAttribute('height',maxY+70);
}

// ============================================================
//  INIT
// ============================================================
loadEditorTemplate();
generateArray();
initGrid();
loadPathEditor();
document.getElementById('bst-code-editor').value = bstCodeTemplate;

// Pre-load BST with sample values
[50,30,70,20,40,60,80,10,25].forEach(v=>{ bstRoot=bstInsertNode(bstRoot,v); });
drawBST();
setStatus('bst','idle','Tree ready — insert, delete, or traverse!');
