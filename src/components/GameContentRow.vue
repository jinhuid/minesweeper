<template>
  <b
    v-for="(block, y) in row"
    class="mine"
    :class="{
      cleaned: block.cleaned,
      marked: block.marked,
      [block.color]: true,
    }"
    :style="{
      transition: `background-color ${Math.min(block.distance / 50, 1)}s`,
    }"
    @mousedown.left="onClick(x, y)"
    @contextmenu.prevent="onRightClick(x, y)"
    :key="y">
    {{ block && block.content }}
  </b>
</template>
<script lang="ts" setup>
import type { Block } from "@/mine"

defineProps<{
  row: Block[]
  x: number
  onClick: (x: number, y: number) => void
  onRightClick: (x: number, y: number) => void
}>()
</script>
<style>
.mine {
  --size: 24px;
  --border-width: 1px;
  margin: 1px;
  height: var(--size);
  width: var(--size);
  box-sizing: border-box;
  line-height: calc((var(--size) - var(--border-width) * 2));
  font-size: calc((var(--size) - var(--border-width) * 2));
  text-align: center;
  border: var(--border-width) solid;
  border-radius: 4px;
  box-shadow: 2px 2px 2px rgb(63, 72, 130);
  cursor: pointer;
  user-select: none;
}

.mine:hover {
  background-color: rgb(201, 201, 202);
}

.mine.cleaned {
  background-color: rgb(203, 230, 255);
  mix-blend-mode: normal;
}

.mine.marked {
  background-color: rgb(255 232 16 / 84%);
  mix-blend-mode: normal;
  background-image: none;
}

input[type="number"] {
  width: 50px;
}

.color1 {
  color: rgb(0, 0, 255);
}

.color2 {
  color: rgb(0, 128, 0);
}

.color3 {
  color: rgb(255, 0, 0);
}

.color4 {
  color: rgb(128, 0, 128);
}

.color5 {
  color: rgb(128, 0, 0);
}

.color6 {
  color: rgb(165, 42, 42);
}

.color7 {
  color: rgb(0, 255, 255);
}

.color8 {
  color: rgb(0, 0, 0);
}
</style>
