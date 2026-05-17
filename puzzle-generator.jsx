import React, { useState, useEffect } from 'react';

export default function PuzzleGenerator() {
  const [puzzleType, setPuzzleType] = useState('wordsearch');
  const [difficulty, setDifficulty]  = useState('easy');
  const [gridSize,   setGridSize]    = useState('8x8');
  const [theme,      setTheme]       = useState('seasonal');
  const [puzzle,     setPuzzle]      = useState(null);
  const [loading,    setLoading]     = useState(false);
  const [error,      setError]       = useState(null);
  const [stats,      setStats]       = useState({ total: 0, wordsearch: 0, sudoku: 0 });

  // Auto-reset grid size and clear puzzle when puzzle type changes
  useEffect(() => {
    setGridSize(puzzleType === 'wordsearch' ? '8x8' : '9x9');
    setPuzzle(null);
    setError(null);
  }, [puzzleType]);

  // ─── Word Lists ───────────────────────────────────────────────────────────────
  const WORD_BANKS = {
    animals:  ['CAT','DOG','COW','HEN','PIG','FOX','OWL','BEE','ANT','EMU','YAK','RAM','EWE',
                'LION','BEAR','FROG','DEER','WOLF','DUCK','FISH','CRAB','WORM','MOLE',
                'TIGER','HORSE','SHARK','EAGLE','SNAKE','MOUSE','SHEEP','RHINO','CAMEL','ZEBRA','PANDA','KOALA','OTTER'],
    colors:   ['RED','BLUE','PINK','GOLD','GREY','TEAL','CYAN','LIME','PLUM','NAVY','ROSE','JADE','RUBY',
                'AMBER','BLACK','WHITE','BROWN','CORAL','IVORY','LILAC','OLIVE','PEACH','CREAM',
                'VIOLET','ORANGE','YELLOW','PURPLE','SILVER','MAROON','CRIMSON'],
    food:     ['PIE','EGG','HAM','FIG','YAM','OAT','PEA',
                'RICE','CAKE','CORN','MILK','PEAR','PLUM','BEAN','TOFU','TACO','SOUP',
                'BREAD','APPLE','GRAPE','LEMON','MANGO','OLIVE','ONION','PASTA','PEACH','PIZZA','SALAD','TOAST','SUGAR','HONEY'],
    vehicles: ['CAR','BUS','VAN','JET',
                'BIKE','BOAT','TRAM','SHIP','TAXI','JEEP','SLED',
                'TRAIN','PLANE','TRUCK','YACHT','CANOE','BARGE','FERRY','ROCKET','SCOOTER'],
    nature:   ['SUN','SKY','SEA','ICE','MUD','DEW','FOG',
                'LAKE','RAIN','SNOW','WIND','LEAF','ROCK','SAND','TIDE','WAVE','TREE','BUSH','HILL','POND',
                'RIVER','CLOUD','STONE','STORM','SHORE','VALLEY','FOREST','DESERT'],
    sports:   ['RUN','SKI',
                'SWIM','GOLF','SURF','DIVE','BOWL','JUMP','KICK',
                'TENNIS','HOCKEY','SOCCER','BOXING','ROWING','CYCLING','CRICKET'],
    backToSchool:   ['PENCIL','RULER','BOOK','BAG','DESK','BELL','CLASS','LUNCH','CHALK','PAINT',
                      'LEARN','WRITE','READ','SHARE','STUDY','SPELL','DRAW','GRADE','SKIP','PLAY'],
    valentines:     ['HEART','LOVE','ROSE','CARD','GIFT','HUG','KISS','FRIEND','FLOWER','CANDY',
                      'CHARM','SWEET','KIND','CARE','HAPPY','SMILE','CUPID','DAISY','PINK','BOND'],
    harmonyWeek:    ['KIND','SHARE','FRIEND','PEACE','SMILE','CARE','HELP','TRUST','FAIR','EQUAL',
                      'UNITE','PROUD','SAFE','BELONG','WARM','HONOR','BRAVE','VOICE','LEARN','GROW'],
    easter:         ['EGG','BUNNY','BASKET','HOP','CHICK','POPPY','BRAVE','HONOR','NEST','HUNT',
                      'HIDE','FIND','SHELL','BLOOM','LAMB','HATCH','MARCH','DAWN','PEACE','RIBBON'],
    mothersDay:     ['MUM','ROSE','HUG','CAKE','LOVE','KIND','GIFT','WARM','FLOWER','COOK',
                      'CARE','SMILE','HEART','LUNCH','BAKE','KISS','SOFT','SWEET','PROUD','HOME'],
    winter:         ['COLD','FROST','COAT','SCARF','RAIN','CLOUD','COSY','FIRE','WOOL','BOOT',
                      'GLOVE','STORM','SLEET','GREY','DRIZZLE','FOGGY','BLANKET','SOUP','WARM','DAMP'],
    winterHolidays: ['SLEEP','MOVIE','COCOA','GAME','BOOK','REST','CAMP','BEACH','SWIM','HIKE',
                      'RELAX','SUNNY','SNACK','FAMILY','PICNIC','PARK','FUN','LAUGH','DREAM','PLAY'],
    bookWeek:       ['STORY','READ','HERO','MAGIC','QUEST','DRAGON','BRAVE','WITCH','PLOT','AUTHOR',
                      'CHAPTER','MYTH','FAIRY','KNIGHT','WAND','SPELL','SCROLL','PIRATE','GIANT','EXPLORE'],
    fathersDay:     ['DAD','TOOL','SPORT','FISH','GAME','LAUGH','PROUD','GRILL','GOLF','COACH',
                      'HIKE','CATCH','BUILD','FIX','TEACH','GUIDE','STRONG','SMART','KIND','HERO'],
    halloween:      ['GHOST','WITCH','BAT','MOON','DARK','TRICK','CANDY','MASK','PUMPKIN','SPIDER',
                      'HOWL','CAPE','CREEP','HAUNT','BROOM','SKULL','FANG','COBWEB','SHRIEK','NIGHT'],
    melbourneCup:   ['HORSE','RACE','HAT','CUP','JOCKEY','FIELD','SADDLE','GALLOP','TROPHY','TRACK',
                      'CROWD','STABLE','FINISH','CANTER','FORM','PARADE','RIBBON','CHEER','FENCE','TURF'],
    christmas:      ['STAR','BELL','GIFT','TREE','SNOW','CANDY','HOLLY','ANGEL','SANTA','REINDEER',
                      'SLEIGH','TINSEL','CAROL','FEAST','GIVING','WISH','LIGHTS','JOY','FAMILY','WRAP'],
  };

  const SEASONAL_LABELS = {
    backToSchool: 'Back to School', valentines: "Valentine's Day",
    harmonyWeek: 'Harmony Week', easter: 'Easter & ANZAC',
    mothersDay: "Mother's Day", winter: 'Winter',
    winterHolidays: 'Winter Holidays', bookWeek: 'Book Week',
    fathersDay: "Father's Day", halloween: 'Halloween',
    melbourneCup: 'Melbourne Cup', christmas: 'Christmas',
  };

  const getSeasonalTheme = () => {
    const month = new Date().getMonth() + 1;
    const map = {
      1: 'backToSchool', 2: 'valentines', 3: 'harmonyWeek',
      4: 'easter', 5: 'mothersDay', 6: 'winter',
      7: 'winterHolidays', 8: 'bookWeek', 9: 'fathersDay',
      10: 'halloween', 11: 'melbourneCup', 12: 'christmas',
    };
    return map[month] || 'animals';
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────────
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // ─── Word Search Generator ────────────────────────────────────────────────────
  const DIRECTIONS = {
    'horizontal':           [ 0,  1],
    'vertical':             [ 1,  0],
    'diagonal-down-right':  [ 1,  1],
    'diagonal-down-left':   [ 1, -1],
    'backwards-horizontal': [ 0, -1],
    'backwards-vertical':   [-1,  0],
    'diagonal-up-right':    [-1,  1],
    'diagonal-up-left':     [-1, -1],
  };

  const DIRS_EASY   = ['horizontal', 'vertical'];
  const DIRS_MEDIUM = ['horizontal', 'vertical', 'diagonal-down-right', 'diagonal-down-left'];
  const DIRS_HARD   = Object.keys(DIRECTIONS);
  const DIAG_DIRS   = ['diagonal-down-right', 'diagonal-down-left', 'diagonal-up-right', 'diagonal-up-left'];

  const canPlace = (grid, word, row, col, dr, dc, rows, cols) => {
    for (let k = 0; k < word.length; k++) {
      const r = row + k * dr;
      const c = col + k * dc;
      if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
      if (grid[r][c] !== '' && grid[r][c] !== word[k]) return false;
    }
    return true;
  };

  const doPlace = (grid, word, row, col, dr, dc) => {
    const positions = [];
    for (let k = 0; k < word.length; k++) {
      const r = row + k * dr;
      const c = col + k * dc;
      grid[r][c] = word[k];
      positions.push([r, c]);
    }
    return positions;
  };

  const generateWordSearch = () => {
    const [rows, cols] = gridSize.split('x').map(Number);
    const wordCount = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 9 : 12;
    const allDirs   = difficulty === 'easy' ? DIRS_EASY : difficulty === 'medium' ? DIRS_MEDIUM : DIRS_HARD;
    const availDiag = DIAG_DIRS.filter(d => allDirs.includes(d));
    const minDiag   = difficulty === 'medium' ? 3 : difficulty === 'hard' ? 4 : 0;

    const resolvedTheme = theme === 'seasonal' ? getSeasonalTheme() : theme;
    const bank = shuffle([...WORD_BANKS[resolvedTheme]]).filter(w => w.length <= Math.min(rows, cols));

    const grid      = Array.from({ length: rows }, () => Array(cols).fill(''));
    const solutions = [];
    const placed    = [];
    let diagPlaced  = 0;

    // Build all positions once, shuffle per attempt
    const allPos = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) allPos.push([r, c]);

    for (const word of bank) {
      if (placed.length >= wordCount) break;

      // Prioritise diagonal directions until quota is met
      let dirsToTry;
      if (diagPlaced < minDiag && availDiag.length > 0) {
        dirsToTry = [...shuffle(availDiag), ...shuffle(allDirs.filter(d => !availDiag.includes(d)))];
      } else {
        dirsToTry = shuffle([...allDirs]);
      }

      let success = false;
      for (const dir of dirsToTry) {
        if (success) break;
        const [dr, dc] = DIRECTIONS[dir];
        const positions = shuffle([...allPos]);
        for (const [r, c] of positions) {
          if (canPlace(grid, word, r, c, dr, dc, rows, cols)) {
            const wordPos = doPlace(grid, word, r, c, dr, dc);
            solutions.push({ word, direction: dir, positions: wordPos });
            placed.push(word);
            if (availDiag.includes(dir)) diagPlaced++;
            success = true;
            break;
          }
        }
      }
    }

    // Fill remaining cells with random letters
    const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if (grid[r][c] === '') grid[r][c] = alpha[Math.floor(Math.random() * 26)];

    const label = theme === 'seasonal'
      ? SEASONAL_LABELS[getSeasonalTheme()]
      : resolvedTheme.charAt(0).toUpperCase() + resolvedTheme.slice(1);
    return { type: 'wordsearch', title: `Word Search - ${label}`, difficulty, gridSize, grid, words: placed, solutions };
  };

  // ─── Sudoku Generator ─────────────────────────────────────────────────────────
  // Rectangular box dimensions per grid size: 4→2×2, 6→2×3, 9→3×3
  const BOX_DIMS = { 4: [2, 2], 6: [2, 3], 9: [3, 3] };

  const generateSudoku = () => {
    const size           = parseInt(gridSize.split('x')[0]);
    const [bRows, bCols] = BOX_DIMS[size] || [2, 2];

    const isValid = (g, row, col, num) => {
      if (g[row].includes(num)) return false;
      if (g.some(r => r[col] === num)) return false;
      const br = Math.floor(row / bRows) * bRows;
      const bc = Math.floor(col / bCols) * bCols;
      for (let r = br; r < br + bRows; r++)
        for (let c = bc; c < bc + bCols; c++)
          if (g[r][c] === num) return false;
      return true;
    };

    const solve = (g) => {
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if (g[row][col] === 0) {
            const nums = shuffle(Array.from({ length: size }, (_, i) => i + 1));
            for (const num of nums) {
              if (isValid(g, row, col, num)) {
                g[row][col] = num;
                if (solve(g)) return true;
                g[row][col] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    const solution = Array.from({ length: size }, () => Array(size).fill(0));
    solve(solution);

    const puzzleGrid = solution.map(row => [...row]);
    const removeCount = difficulty === 'easy'   ? Math.floor(size * size * 0.35) :
                        difficulty === 'medium' ? Math.floor(size * size * 0.50) :
                                                  Math.floor(size * size * 0.62);

    const allPos = shuffle(Array.from({ length: size * size }, (_, i) => i));
    for (let i = 0; i < removeCount; i++) {
      const row = Math.floor(allPos[i] / size);
      const col = allPos[i] % size;
      puzzleGrid[row][col] = 0;
    }

    return { type: 'sudoku', title: `Sudoku ${size}x${size}`, difficulty, gridSize: `${size}x${size}`, puzzle: puzzleGrid, solution };
  };

  // ─── Generate ─────────────────────────────────────────────────────────────────
  const generatePuzzle = () => {
    setLoading(true);
    setError(null);
    // setTimeout lets React flush the loading state before heavy JS runs
    setTimeout(() => {
      try {
        const data = puzzleType === 'wordsearch' ? generateWordSearch() : generateSudoku();
        setPuzzle(data);
        setStats(prev => ({
          total:       prev.total + 1,
          wordsearch:  puzzleType === 'wordsearch' ? prev.wordsearch + 1 : prev.wordsearch,
          sudoku:      puzzleType === 'sudoku'     ? prev.sudoku + 1     : prev.sudoku,
        }));
      } catch (err) {
        setError(`Failed to generate puzzle: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }, 50);
  };

  // ─── Printable HTML Download ──────────────────────────────────────────────────
  const buildCellsHTML = (grid, pType, highlightSet) => {
    const size           = grid.length;
    const [bRows, bCols] = BOX_DIMS[size] || [2, 2];
    return grid.map((row, i) =>
      row.map((cell, j) => {
        const rightBox    = pType === 'sudoku' && (j + 1) % bCols === 0 && j < size - 1;
        const bottomBox   = pType === 'sudoku' && (i + 1) % bRows === 0 && i < size - 1;
        const highlighted = highlightSet && highlightSet.has(`${i},${j}`);
        const cellClass   = pType === 'wordsearch' ? 'ws-cell' : 'cell';
        return `<div class="${cellClass}${highlighted ? ' hl' : ''}" style="${rightBox ? 'border-right:3px solid #000;' : ''}${bottomBox ? 'border-bottom:3px solid #000;' : ''}">${cell === 0 ? '' : cell}</div>`;
      }).join('')
    ).join('');
  };

  const handleDownloadPrintable = () => {
    if (!puzzle) return;

    const hlSet = new Set();
    if (puzzle.type === 'wordsearch' && puzzle.solutions)
      puzzle.solutions.forEach(sol => sol.positions.forEach(([r, c]) => hlSet.add(`${r},${c}`)));

    const pGrid   = puzzle.type === 'wordsearch' ? puzzle.grid   : puzzle.puzzle;
    const solGrid = puzzle.type === 'wordsearch' ? puzzle.grid   : puzzle.solution;
    const cols    = pGrid[0].length;

    const puzzleCells   = buildCellsHTML(pGrid,   puzzle.type, null);
    const solutionCells = buildCellsHTML(solGrid, puzzle.type, puzzle.type === 'wordsearch' ? hlSet : null);

    const wordListHTML = puzzle.type === 'wordsearch' ? `
      <div style="text-align:center;font-weight:bold;margin:15px 0">Find these words:</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;margin-top:15px">
        ${puzzle.words.map(w => `<div style="padding:8px 12px;background:#f0f0f0;border-radius:6px;text-align:center;font-weight:bold">${w}</div>`).join('')}
      </div>` : '';

    const html = `<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8">
  <title>${puzzle.title}</title>
  <style>
    body{font-family:Arial,sans-serif;margin:0;padding:20px;background:#f5f5f5}
    .tip{max-width:800px;margin:0 auto 20px;padding:15px;background:#fff3cd;border:2px solid #ffc107;border-radius:8px;text-align:center;color:#856404}
    .tip h2{margin:0 0 8px}
    .page{page-break-after:always;max-width:800px;margin:0 auto 40px;background:white;padding:30px;box-shadow:0 2px 8px rgba(0,0,0,.1)}
    .page:last-child{page-break-after:auto}
    h1{text-align:center;color:#333;margin-bottom:20px}
    .meta{display:flex;justify-content:space-around;padding:15px;border:2px solid #333;background:#f8f9ff;margin-bottom:20px;text-align:center}
    .grid{display:grid;gap:0;margin:20px auto;width:fit-content;font-family:'Courier New',monospace;font-weight:bold;font-size:16px}
    .sd-grid{border:3px solid #000}
    .ws-grid{gap:2px}
    .cell{width:35px;height:35px;display:flex;align-items:center;justify-content:center;border:1px solid #999;background:white}
    .ws-cell{width:35px;height:35px;display:flex;align-items:center;justify-content:center;background:transparent;border-radius:4px}
    .hl{background:#555!important;color:white!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
    @media print{body{margin:0;padding:10mm;background:white}.tip{display:none}.page{page-break-after:always;box-shadow:none;margin-bottom:0}.page:last-child{page-break-after:auto}}
  </style>
</head>
<body>
  <div class="tip">
    <h2>📋 Ready to Print!</h2>
    <p><strong>Press Ctrl+P (Windows) or Cmd+P (Mac)</strong> to print or save as PDF</p>
    <p>Page 1: Puzzle &nbsp;|&nbsp; Page 2: Answer Key</p>
    <p style="margin-top:8px;font-size:.9em">💾 Tip: <strong>File → Save As</strong> to keep this file on your computer</p>
  </div>

  <div class="page">
    <h1>📝 ${puzzle.title}</h1>
    <div class="meta">
      <span>Name: _______________</span>
      <span>Date: _______________</span>
      <span>Difficulty: ${puzzle.difficulty}</span>
    </div>
    <div class="grid ${puzzle.type === 'sudoku' ? 'sd-grid' : 'ws-grid'}" style="grid-template-columns:repeat(${cols},35px)">${puzzleCells}</div>
    ${wordListHTML}
  </div>

  <div class="page">
    <h1>✅ ${puzzle.title} — Answer Key</h1>
    <div class="grid ${puzzle.type === 'sudoku' ? 'sd-grid' : 'ws-grid'}" style="grid-template-columns:repeat(${cols},35px)">${solutionCells}</div>
  </div>
</body></html>`;

    // Download as a file — no popup needed
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${puzzle.title.replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ─── React Grid Renderers ─────────────────────────────────────────────────────
  const renderWordSearchGrid = (grid, showSolution = false) => {
    const hlPos = new Set();
    if (showSolution && puzzle.solutions)
      puzzle.solutions.forEach(sol => sol.positions.forEach(([r, c]) => hlPos.add(`${r},${c}`)));

    return (
      <div style={{ display:'grid', gridTemplateColumns:`repeat(${grid[0].length},35px)`, gap:'2px', margin:'20px auto', width:'fit-content', fontFamily:'Courier New,monospace', fontWeight:'bold' }}>
        {grid.map((row, i) => row.map((cell, j) => {
          const hl = hlPos.has(`${i},${j}`);
          return (
            <div key={`${i}-${j}`} style={{ width:'35px', height:'35px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', background: hl ? '#555' : 'transparent', color: hl ? 'white' : '#333', borderRadius: hl ? '4px' : '0' }}>
              {cell}
            </div>
          );
        }))}
      </div>
    );
  };

  const renderSudokuGrid = (grid) => {
    const size           = grid.length;
    const [bRows, bCols] = BOX_DIMS[size] || [2, 2];
    return (
      <div style={{ display:'grid', gridTemplateColumns:`repeat(${size},35px)`, gap:'0', margin:'20px auto', width:'fit-content', fontFamily:'Courier New,monospace', fontWeight:'bold', border:'3px solid #000' }}>
        {grid.map((row, i) => row.map((cell, j) => {
          const rBox = (j + 1) % bCols === 0 && j < size - 1;
          const bBox = (i + 1) % bRows === 0 && i < size - 1;
          return (
            <div key={`${i}-${j}`} style={{ width:'35px', height:'35px', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #999', borderRight:  rBox ? '3px solid #000' : '1px solid #999', borderBottom: bBox ? '3px solid #000' : '1px solid #999', fontSize:'16px', fontWeight: cell !== 0 ? 'bold' : 'normal', color: cell !== 0 ? '#000' : '#ccc', background:'white' }}>
              {cell !== 0 ? cell : ''}
            </div>
          );
        }))}
      </div>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @media print {
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          .no-print { display: none !important; }
          .print-section { page-break-after: always !important; page-break-inside: avoid !important; display: block !important; width: 100% !important; max-width: 100% !important; margin: 0 !important; padding: 20px !important; border: none !important; border-radius: 0 !important; }
          .print-section:last-child { page-break-after: auto !important; }
        }
      `}</style>

      <div style={{ maxWidth:'1200px', margin:'0 auto', background:'white', borderRadius:'20px', padding:'30px', fontFamily:'Comic Sans MS, Arial, sans-serif' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'30px', paddingBottom:'20px', borderBottom:'3px solid #667eea' }} className="no-print">
          <h1 style={{ color:'#667eea', fontSize:'2.5em', marginBottom:'10px' }}>🎮 Kids Puzzle Generator 🎮</h1>
          <p style={{ color:'#666', fontSize:'1.1em' }}>Create fun word searches and sudoku puzzles for your kids!</p>
        </div>

        {/* Stats */}
        <div style={{ background:'#e7f3ff', padding:'15px', borderRadius:'10px', marginBottom:'20px' }} className="no-print">
          <h3 style={{ color:'#667eea', marginBottom:'10px' }}>📊 Puzzles Generated</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:'10px' }}>
            {[['Total', stats.total], ['Word Search', stats.wordsearch], ['Sudoku', stats.sudoku]].map(([label, val]) => (
              <div key={label} style={{ background:'white', padding:'10px', borderRadius:'8px', textAlign:'center' }}>
                <div style={{ fontSize:'2em', fontWeight:'bold', color:'#667eea' }}>{val}</div>
                <div style={{ fontSize:'0.9em', color:'#666' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div style={{ background:'#f8f9ff', padding:'25px', borderRadius:'15px', marginBottom:'30px' }} className="no-print">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'15px', marginBottom:'15px' }}>

            <div>
              <label style={{ display:'block', fontWeight:'bold', color:'#333', marginBottom:'8px', fontSize:'1.1em' }}>Puzzle Type</label>
              <select value={puzzleType} onChange={e => setPuzzleType(e.target.value)}
                style={{ width:'100%', padding:'12px', border:'2px solid #ddd', borderRadius:'8px', fontSize:'1em', cursor:'pointer' }}>
                <option value="wordsearch">Word Search</option>
                <option value="sudoku">Sudoku</option>
              </select>
            </div>

            <div>
              <label style={{ display:'block', fontWeight:'bold', color:'#333', marginBottom:'8px', fontSize:'1.1em' }}>Difficulty</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
                style={{ width:'100%', padding:'12px', border:'2px solid #ddd', borderRadius:'8px', fontSize:'1em', cursor:'pointer' }}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label style={{ display:'block', fontWeight:'bold', color:'#333', marginBottom:'8px', fontSize:'1.1em' }}>Grid Size</label>
              <select value={gridSize} onChange={e => setGridSize(e.target.value)}
                style={{ width:'100%', padding:'12px', border:'2px solid #ddd', borderRadius:'8px', fontSize:'1em', cursor:'pointer' }}>
                {puzzleType === 'wordsearch' ? (
                  <>
                    <option value="8x8">8x8 (Small)</option>
                    <option value="10x10">10x10 (Medium)</option>
                    <option value="12x12">12x12 (Large)</option>
                    <option value="15x15">15x15 (Extra Large)</option>
                  </>
                ) : (
                  <>
                    <option value="4x4">4x4 (Beginner)</option>
                    <option value="6x6">6x6 (Intermediate)</option>
                    <option value="9x9">9x9 (Classic)</option>
                  </>
                )}
              </select>
            </div>

            {puzzleType === 'wordsearch' && (
              <div>
                <label style={{ display:'block', fontWeight:'bold', color:'#333', marginBottom:'8px', fontSize:'1.1em' }}>Theme</label>
                <select value={theme} onChange={e => setTheme(e.target.value)}
                  style={{ width:'100%', padding:'12px', border:'2px solid #ddd', borderRadius:'8px', fontSize:'1em', cursor:'pointer' }}>
                  <option value="seasonal">🗓️ Seasonal (auto)</option>
                  <option value="animals">Animals</option>
                  <option value="colors">Colors</option>
                  <option value="food">Food</option>
                  <option value="vehicles">Vehicles</option>
                  <option value="nature">Nature</option>
                  <option value="sports">Sports</option>
                </select>
              </div>
            )}
          </div>

          <button
            onClick={generatePuzzle}
            disabled={loading}
            style={{ width:'100%', padding:'18px', background: loading ? '#ccc' : 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)', color:'white', border:'none', borderRadius:'12px', fontSize:'1.3em', fontWeight:'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop:'10px' }}
          >
            {loading ? '⏳ Generating...' : '✨ Generate Puzzle'}
          </button>
        </div>

        {error && (
          <div style={{ background:'#f8d7da', color:'#721c24', padding:'15px', borderRadius:'10px', marginTop:'20px' }} className="no-print">
            {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign:'center', padding:'40px', fontSize:'1.3em', color:'#667eea' }} className="no-print">
            Creating your puzzle... 🎨
          </div>
        )}

        {puzzle && !loading && (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'30px', marginTop:'30px' }}>

              {/* Puzzle Panel */}
              <div style={{ background:'white', padding:'25px', borderRadius:'15px', border:'2px solid #e0e0e0' }} className="print-section">
                <h2 style={{ color:'#667eea', marginBottom:'15px', paddingBottom:'10px', borderBottom:'2px solid #f0f0f0' }}>📝 Puzzle</h2>
                <div style={{ textAlign:'center', marginBottom:'20px', padding:'15px', background:'#f8f9ff', borderRadius:'10px' }}>
                  <div style={{ fontSize:'1.5em', color:'#333', marginBottom:'10px' }}>{puzzle.title}</div>
                  <div style={{ display:'flex', justifyContent:'space-around', fontSize:'0.9em', color:'#666', marginTop:'10px' }}>
                    <span>Name: _______________</span>
                    <span>Date: _______________</span>
                    <span>Difficulty: {puzzle.difficulty}</span>
                  </div>
                </div>
                {puzzle.type === 'wordsearch' ? (
                  <>
                    {renderWordSearchGrid(puzzle.grid, false)}
                    <div style={{ textAlign:'center', marginTop:'15px', fontWeight:'bold' }}>Find these words:</div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(120px, 1fr))', gap:'10px', marginTop:'15px' }}>
                      {puzzle.words.map((word, i) => (
                        <div key={i} style={{ padding:'8px 12px', background:'#f0f0f0', borderRadius:'6px', textAlign:'center', fontWeight:'bold' }}>
                          {word}
                        </div>
                      ))}
                    </div>
                  </>
                ) : renderSudokuGrid(puzzle.puzzle)}
              </div>

              {/* Answer Key Panel */}
              <div style={{ background:'white', padding:'25px', borderRadius:'15px', border:'2px solid #e0e0e0' }} className="print-section">
                <h2 style={{ color:'#667eea', marginBottom:'15px', paddingBottom:'10px', borderBottom:'2px solid #f0f0f0' }}>✅ Answer Key</h2>
                <div style={{ textAlign:'center', marginBottom:'20px', padding:'15px', background:'#f8f9ff', borderRadius:'10px' }}>
                  <div style={{ fontSize:'1.5em', color:'#333' }}>{puzzle.title} — Solutions</div>
                </div>
                {puzzle.type === 'wordsearch'
                  ? renderWordSearchGrid(puzzle.grid, true)
                  : renderSudokuGrid(puzzle.solution)}
              </div>
            </div>

            <button
              onClick={handleDownloadPrintable}
              className="no-print"
              style={{ width:'100%', padding:'15px', background:'#28a745', color:'white', border:'none', borderRadius:'10px', fontSize:'1.2em', fontWeight:'bold', cursor:'pointer', marginTop:'20px' }}
            >
              🖨️ Download Printable Version
            </button>
            <div style={{ textAlign:'center', marginTop:'10px', color:'#666', fontSize:'0.9em' }}>
              Saves as HTML file → open it → press Ctrl+P to print or save as PDF
            </div>
          </>
        )}
      </div>
    </>
  );
}
