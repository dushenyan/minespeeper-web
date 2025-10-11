import type { Ref } from 'vue'
import { ref } from 'vue'

export interface BlockState {
  x: number
  y: number
  revealed: boolean
  mine?: boolean
  flagged?: boolean
  adjacentMines: number
}

// 定义难度级别
export interface GameDifficulty {
  name: string
  width: number
  height: number
  mineDensity: number // 地雷密度 (0-1)
}

export const difficultyLevels: GameDifficulty[] = [
  { name: '简单', width: 8, height: 8, mineDensity: 0.1 },
  { name: '中等', width: 10, height: 10, mineDensity: 0.15 },
  { name: '困难', width: 12, height: 12, mineDensity: 0.2 },
  { name: '专家', width: 16, height: 16, mineDensity: 0.25 },
]

export function useGame(initialWidth = 10, initialHeight = 10, initialMineDensity = 0.15) {
  const store = ref<BlockState[][]>([])
  const gameOver = ref(false)
  const gameWon = ref(false)
  const mineCount = ref(0)
  const width = ref(initialWidth)
  const height = ref(initialHeight)
  const mineDensity = ref(initialMineDensity)

  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ]

  function initializeBoard() {
    store.value = Array.from({ length: height.value }, (_, y) =>
      Array.from({ length: width.value }, (_, x): BlockState => ({
        x,
        y,
        adjacentMines: 0,
        revealed: false,
        flagged: false,
      })),
    )
    gameOver.value = false
    gameWon.value = false
  }

  function generateMines(firstClickX: number, firstClickY: number) {
    initializeBoard()

    const totalCells = width.value * height.value
    mineCount.value = Math.floor(totalCells * mineDensity.value)
    let minesPlaced = 0

    // 确保第一次点击不会是地雷
    const safeArea = new Set<string>()
    for (const [dx, dy] of directions) {
      const x = firstClickX + dx
      const y = firstClickY + dy
      if (x >= 0 && x < width.value && y >= 0 && y < height.value)
        safeArea.add(`${x},${y}`)
    }
    safeArea.add(`${firstClickX},${firstClickY}`)

    while (minesPlaced < mineCount.value) {
      const x = Math.floor(Math.random() * width.value)
      const y = Math.floor(Math.random() * height.value)

      // 确保不会在安全区域或已放置地雷的位置放置地雷
      if (!safeArea.has(`${x},${y}`) && !store.value[y][x].mine) {
        store.value[y][x].mine = true
        minesPlaced++
      }
    }
  }

  function updateNumbers() {
    for (let y = 0; y < height.value; y++) {
      for (let x = 0; x < width.value; x++) {
        store.value[y][x].adjacentMines = 0

        if (!store.value[y][x].mine) {
          for (const [dx, dy] of directions) {
            const newX = x + dx
            const newY = y + dy

            if (newX >= 0 && newX < width.value && newY >= 0 && newY < height.value) {
              // eslint-disable-next-line curly
              if (store.value[newY][newX].mine) {
                store.value[y][x].adjacentMines++
              }
            }
          }
        }
      }
    }
  }

  function revealAdjacentEmpty(x: number, y: number) {
    const stack: [number, number][] = [[x, y]]
    const visited = new Set<string>()

    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!
      const key = `${cx},${cy}`

      if (visited.has(key))
        continue
      visited.add(key)

      const block = store.value[cy][cx]
      if (!block || block.revealed || block.flagged)
        continue

      block.revealed = true

      // 如果相邻地雷数为0，继续展开相邻区域
      if (block.adjacentMines === 0) {
        for (const [dx, dy] of directions) {
          const nx = cx + dx
          const ny = cy + dy

          if (nx >= 0 && nx < width.value && ny >= 0 && ny < height.value)
            stack.push([nx, ny])
        }
      }
    }
  }

  function checkWin() {
    let unrevealedCount = 0
    for (let y = 0; y < height.value; y++) {
      for (let x = 0; x < width.value; x++) {
        // eslint-disable-next-line curly
        if (!store.value[y][x].revealed && !store.value[y][x].mine) {
          unrevealedCount++
        }
      }
    }

    if (unrevealedCount === 0)
      gameWon.value = true
  }

  function newGame() {
    initializeBoard()
  }

  function handleClick(x: number, y: number, isFirstClick = false) {
    const block = store.value[y][x]

    // 如果已经翻开或已标记，不处理
    if (block.revealed || block.flagged)
      return

    // 第一次点击时生成地雷并确保不会点到地雷
    if (isFirstClick) {
      generateMines(x, y)
      updateNumbers()
    }

    block.revealed = true

    // 如果点击到地雷，游戏结束
    if (block.mine) {
      gameOver.value = true
      return
    }

    // 如果是空白区域，自动展开相邻区域
    if (block.adjacentMines === 0)
      revealAdjacentEmpty(x, y)

    // 检查是否获胜
    checkWin()
  }

  function toggleFlag(x: number, y: number) {
    const block = store.value[y][x]
    if (!block.revealed)
      block.flagged = !block.flagged
  }

  // 设置游戏难度
  function setDifficulty(difficulty: GameDifficulty) {
    width.value = difficulty.width
    height.value = difficulty.height
    mineDensity.value = difficulty.mineDensity
    newGame()
  }

  // 自定义游戏设置
  function setCustomGame(customWidth: number, customHeight: number, customMineCount: number) {
    width.value = customWidth
    height.value = customHeight
    mineDensity.value = customMineCount / (customWidth * customHeight)
    newGame()
  }

  return {
    store: store as Ref<BlockState[][]>,
    gameOver,
    gameWon,
    mineCount,
    width,
    height,
    mineDensity,
    newGame,
    handleClick,
    toggleFlag,
    setDifficulty,
    setCustomGame,
  }
}
