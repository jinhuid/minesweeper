<script lang="ts" setup>
import type { State } from "@/game"
defineProps<{
  state: State
}>()
</script>

<template>
  <div class="game-info">
    <span>剩余旗帜:{{ state.flag }}</span>
    <span>时间:{{ state.time }}s</span>
  </div>
</template>

<style>
.game-info {
  height: 40px;
  width: 100%;
  background-color: rgb(203, 230, 255);
  display: flex;
  justify-content: space-around;
  line-height: 40px;
}
</style>
