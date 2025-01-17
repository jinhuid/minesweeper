<template>
  <div class="content" @contextmenu.prevent>
    <div style="display: flex" v-for="(row, x) in minefield.blocks" :key="x">
      <GameContentRow :row :x :onClick :onRightClick />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Game } from "@/game"
import { onBeforeMount, toRaw } from "vue"
import GameContentRow from "./GameContentRow.vue"
import { MINE, FLAG, BLANK, type BlockContent } from "@/mine"

const { game } = defineProps<{
  game: Game
}>()

const minefield = game.minefield
const state = game.state

onBeforeMount(() => {
  toRaw(minefield).disturbMine()
})

function onClick(x: number, y: number) {
  const block = minefield.blocks[x][y]
  if (block.content === FLAG) {
    if (block.isMine) {
      state.mineNum++
    }
    block.marked = false
    block.content = BLANK
    state.flag++
    return
  }
  if (block.hasContent || block.cleaned) return
  if (minefield.firstClick) {
    minefield.sweepOut(x, y)
    minefield.firstClick = false
  }
  if (block.isMine) {
    block.cleaned = true
    block.content = MINE
    game.fail()
    return
  }
  if (minefield.isSafe(x, y)) {
    toRaw(minefield).expand(x, y)
    // 更改引用 手动触发组件更新
    minefield.blocks = minefield.blocks.map((row, index) => [...row])
  }
  const num = minefield.aroundMinesNum(x, y)
  if (num !== 0) block.content = String(num) as BlockContent
  block.color = `color${num}`
  block.cleaned = true
}

function onRightClick(x: number, y: number) {
  const block = minefield.blocks[x][y]
  if (block.cleaned) return
  if (block.content === FLAG) {
    if (block.isMine) {
      state.mineNum++
    }
    block.marked = false
    block.content = BLANK
    state.flag++
    return
  }
  if (state.flag <= 0) return
  minefield.blocks[x][y].marked = true
  minefield.blocks[x][y].content = FLAG
  state.flag--
  if (minefield.blocks[x][y].isMine) {
    state.mineNum--
  }
}
</script>

<style>
.content {
  padding: 4px;
  border-radius: 4px;
  background-image: linear-gradient(
    to top left,
    rgb(111 127 225),
    rgb(6 29 251 / 62%) 50%,
    rgb(39 217 255 / 55%)
  );
}
</style>
