<script setup lang="ts">
import type { BlockState, GameDifficulty } from '~/composables/useGame'
import { ref } from 'vue'
import { difficultyLevels, useGame } from '~/composables/useGame'

const {
  store,
  gameOver,
  gameWon,
  mineCount,
  width,
  height,
  newGame,
  handleClick,
  toggleFlag,
  setDifficulty,
  setCustomGame,
} = useGame(10, 10, 0.15)

let isFirstClick = true

// 难度选择相关
const showDifficultyMenu = ref(false)
const showCustomMenu = ref(false)
const customWidth = ref(10)
const customHeight = ref(10)
const customMineCount = ref(15)

function onBlockClick(x: number, y: number) {
  handleClick(x, y, isFirstClick)
  if (isFirstClick)
    isFirstClick = false
}

function onBlockRightClick(x: number, y: number) {
  toggleFlag(x, y)
}

function restartGame() {
  newGame()
  isFirstClick = true
}

function selectDifficulty(difficulty: GameDifficulty) {
  setDifficulty(difficulty)
  showDifficultyMenu.value = false
  isFirstClick = true
}

function applyCustomGame() {
  // 确保地雷数量不超过总格子数
  const maxMines = customWidth.value * customHeight.value - 1
  if (customMineCount.value > maxMines)
    customMineCount.value = maxMines

  setCustomGame(customWidth.value, customHeight.value, customMineCount.value)
  showCustomMenu.value = false
  isFirstClick = true
}

function getBlockClass(block: BlockState) {
  if (!block.revealed) {
    return block.flagged
      ? 'bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 shadow-inner'
      : 'bg-gradient-to-br from-gray-300 to-gray-400 hover:from-gray-350 hover:to-gray-450 dark:from-gray-600 dark:to-gray-700 dark:hover:from-gray-550 dark:hover:to-gray-650 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105'
  }
  return block.mine
    ? 'bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 animate-pulse'
    : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-inner'
}

function getNumberColor(num: number) {
  const colors = [
    'text-transparent', // 0 - 无颜色
    'text-blue-600 dark:text-blue-400 font-bold',
    'text-green-600 dark:text-green-400 font-bold',
    'text-red-600 dark:text-red-400 font-bold',
    'text-purple-600 dark:text-purple-400 font-bold',
    'text-yellow-600 dark:text-yellow-400 font-bold',
    'text-cyan-600 dark:text-cyan-400 font-bold',
    'text-black dark:text-white font-bold',
    'text-gray-600 dark:text-gray-400 font-bold',
  ]
  return colors[num] || 'text-black dark:text-white font-bold'
}

onMounted(() => {
  newGame()
})
</script>

<template>
  <div class="flex flex-col items-center justify-center pt-10">
    <h1 class="text-4xl font-bold mb-6 text-gray-800 dark:text-white drop-shadow-lg">
      扫雷游戏
    </h1>

    <div class="mb-6 flex flex-wrap items-center justify-center gap-4">
      <div class="relative">
        <button
          class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 flex items-center"
          @click="showDifficultyMenu = !showDifficultyMenu"
        >
          <i i-mdi:tune class="mr-2" />
          难度设置
        </button>

        <!-- 难度选择菜单 -->
        <div v-if="showDifficultyMenu" class="absolute z-10 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl py-2">
          <div
            v-for="difficulty in difficultyLevels"
            :key="difficulty.name"
            class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex justify-between"
            @click="selectDifficulty(difficulty)"
          >
            <span>{{ difficulty.name }}</span>
            <span class="text-gray-500 dark:text-gray-300 text-sm">{{ difficulty.width }}×{{ difficulty.height }}</span>
          </div>
          <div class="border-t border-gray-200 dark:border-gray-600 my-1" />
          <div
            class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
            @click="showCustomMenu = true; showDifficultyMenu = false"
          >
            自定义
          </div>
        </div>

        <!-- 自定义设置菜单 -->
        <div v-if="showCustomMenu" class="absolute z-10 mt-2 w-64 bg-white dark:bg-gray-700 rounded-lg shadow-xl p-4">
          <h3 class="font-bold mb-2">
            自定义游戏
          </h3>
          <div class="mb-3">
            <label class="block text-sm mb-1">宽度: {{ customWidth }}</label>
            <input
              v-model="customWidth"
              type="range"
              min="5"
              max="20"
              class="w-full"
            >
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">高度: {{ customHeight }}</label>
            <input
              v-model="customHeight"
              type="range"
              min="5"
              max="20"
              class="w-full"
            >
          </div>
          <div class="mb-4">
            <label class="block text-sm mb-1">地雷数: {{ customMineCount }}</label>
            <input
              v-model="customMineCount"
              type="range"
              :min="1"
              :max="customWidth * customHeight - 1"
              class="w-full"
            >
          </div>
          <div class="flex justify-between">
            <button
              class="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
              @click="showCustomMenu = false"
            >
              取消
            </button>
            <button
              class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              @click="applyCustomGame"
            >
              应用
            </button>
          </div>
        </div>
      </div>

      <button
        class="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 flex items-center"
        @click="restartGame"
      >
        <i i-mdi:refresh class="mr-2" />
        重新开始
      </button>

      <div class="px-4 py-2 bg-white dark:bg-gray-700 rounded-lg shadow-md flex items-center">
        <i i-mdi:mine class="text-red-500 mr-2" />
        <span class="text-lg font-semibold text-gray-700 dark:text-gray-300">
          {{ mineCount }} / {{ width * height }}
        </span>
      </div>
    </div>

    <div v-if="gameOver" class="mb-6 p-4 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 text-red-700 dark:text-red-200 rounded-xl shadow-lg animate-bounce">
      <div class="flex items-center">
        <i i-mdi:emoticon-sad class="text-2xl mr-2" />
        <span class="font-bold text-lg">游戏结束！你踩到地雷了。</span>
      </div>
    </div>

    <div v-if="gameWon" class="mb-6 p-4 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 text-green-700 dark:text-green-200 rounded-xl shadow-lg animate-bounce">
      <div class="flex items-center">
        <i i-mdi:emoticon-happy class="text-2xl mr-2" />
        <span class="font-bold text-lg">恭喜！你赢了！</span>
      </div>
    </div>

    <div
      class="gap-1.5 bg-gray-200 dark:bg-gray-700 p-3 rounded-2xl shadow-inner"
      :class="`grid-cols-${width}`"
    >
      <div
        v-for="(row, y) in store"
        :key="y"
        class="flex"
      >
        <div
          v-for="(block, x) in row"
          :key="x"
          :class="getBlockClass(block)"
          class="w-8 h-8 border-2 border-gray-400 dark:border-gray-500 flex items-center justify-center cursor-pointer select-none text-sm font-bold rounded-lg transition-all duration-200 md:w-10 md:h-10"
          @click="onBlockClick(block.x, block.y)"
          @contextmenu.prevent="onBlockRightClick(block.x, block.y)"
        >
          <template v-if="block.revealed">
            <div v-if="block.mine" i-mdi:mine class="text-white text-lg md:text-xl animate-pulse" />
            <div v-else-if="block.adjacentMines > 0" :class="getNumberColor(block.adjacentMines)">
              {{ block.adjacentMines }}
            </div>
          </template>
          <div v-else-if="block.flagged" i-mdi:flag class="text-white text-lg md:text-xl" />
        </div>
      </div>
    </div>

    <div class="mt-8 text-gray-600 dark:text-gray-400 text-sm">
      <p class="flex items-center">
        <i i-mdi:mouse class="mr-2" />左键点击翻开方块
      </p>
      <p class="flex items-center">
        <i i-mdi:mouse-right-click class="mr-2" />右键点击标记地雷
      </p>
    </div>
  </div>
</template>

<style scoped>
.w-8 {
  width: 2rem;
}
.h-8 {
  height: 2rem;
}
@media (min-width: 768px) {
  .w-8 {
    width: 2.5rem;
  }
  .h-8 {
    height: 2.5rem;
  }
}
</style>
