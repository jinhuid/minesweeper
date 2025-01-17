<template>
  <div>
    难度：
    <select
      @change="e => difficulty.setDifficulty((e.target as HTMLSelectElement).value as DifficultyKey)">
      <option
        v-for="item in difficulty.difficultyList"
        :selected="difficulty.difficultyName === item">
        {{ item }}
      </option>
    </select>
    <br />
    <button @click="difficulty.setDifficulty(difficulty.difficultyName)">
      重新开始
    </button>
    <button @click="customMode" ref="btn">自定义</button>
    <button
      v-show="showCustom"
      @click="
        () => {
          showCustom = !showCustom
          btn!.textContent = '自定义'
        }
      ">
      取消
    </button>
    <div v-show="showCustom">
      行：
      <input type="number" min="9" max="100" v-model="customRow" />
      列：
      <input type="number" min="9" max="100" v-model="customColumn" />
      地雷数量：
      <input type="number" min="9" max="10000" v-model="customMine" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Difficulty, type DifficultyKey } from "@/difficulty"
import { ref, useTemplateRef, watch } from "vue"

const btn = useTemplateRef("btn")

const { difficulty } = defineProps<{
  difficulty: Difficulty
}>()

const showCustom = ref(false)

const customRow = ref(difficulty.size.row)
const customColumn = ref(difficulty.size.column)
const customMine = ref(difficulty.size.mineNum)

watch(
  () => difficulty.size,
  () => {
    customRow.value = difficulty.size.row
    customColumn.value = difficulty.size.column
    customMine.value = difficulty.size.mineNum
  },
  { deep: true }
)

const customMode = () => {
  if (btn.value!.textContent === "确认") {
    const yes = confirm(
      `将创建${customRow.value}行,${customColumn.value}列,${customMine.value}个炸弹的难度`
    )
    if (yes) {
      difficulty.customDifficulty({
        row: Number(customRow.value),
        column: Number(customColumn.value),
        mineNum: Number(customMine.value),
      })
    }
    showCustom.value = false
    btn.value!.textContent = "自定义"
  } else {
    showCustom.value = true
    btn.value!.textContent = "确认"
  }
}
</script>

<style scoped></style>
