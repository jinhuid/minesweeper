<script setup lang="ts">
import { reactive, watch } from "vue"
import GameContent from "./components/GameContent.vue"
import GameControl from "./components/GameControl.vue"
import GameHeader from "./components/GameHeader.vue"
import { Game } from "./game"

const game = reactive(new Game())

watch(
  () => game.state.mineNum,
  newVal => {
    if (newVal === 0) {
      game.win()
    }
  }
)

watch(
  () => game.minefield.firstClick,
  newVal => {
    if (!newVal) {
      game.startTiming()
    }
  }
)
</script>

<template>
  <div class="container">
    <GameHeader :state="game.state"></GameHeader>
    <GameContent :game="game"></GameContent>
    <GameControl :difficulty="game.difficulty"></GameControl>
  </div>
</template>

<style scoped>
.container {
  width: min-content;
  margin: 0 auto;
}
</style>
