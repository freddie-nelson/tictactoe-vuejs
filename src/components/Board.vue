<template>
  <div class="board">
      <div v-for="(cell, index) in board" v-bind:key="index" v-on:click="$emit('click-cell', index)" class="board__cell">
          <span v-if="cell.filledByPlayer">X</span>
          <span v-if="cell.filledByBot">O</span>
      </div>
  </div>
</template>

<script>
export default {
    name: 'Board',
    props: {
        board: Array
    }
}
</script>

<style lang="scss">
    .board {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        width: 500px;
        height: 500px;

        &__cell {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 3rem;
            border: 1px solid black;
        }
    }
</style>