<template>
  <div class="board">
    <div
      v-for="(cell, index) in board"
      :key="index"
      @click="!ended && !disabled ? $emit('click-cell', index) : null"
      class="board__cell"
    >
      <span class="board__cell-X" v-if="cell.filledByPlayer"></span>
      <span
        class="board__cell-O"
        @animationstart="disabled = true"
        @animationend="disabled = false"
        v-if="cell.filledByBot"
      ></span>
    </div>
    <div class="win-line" id="win-line-horizontal" v-show="line === 'horizontal'"></div>
    <div class="win-line" id="win-line-vertical" v-show="line === 'vertical'"></div>
    <div class="win-line" id="win-line-diagonal" v-show="line === 'diagonal'"></div>
  </div>
</template>

<script>
export default {
  name: "Board",
  data() {
    return {
      disabled: false
    };
  },
  props: {
    board: Array,
    line: String,
    ended: Boolean
  }
};
</script>

<style lang="scss">
$bg-color: #f5eded;
$border-color: #3e3636;
$knots-crosses-color: #927070;

.win-line {
  position: absolute;
  top: calc(50% - 11px);
  transform-origin: center;
  transform: scaleX(0.93);
  background-color: #684e4e;
  width: 100%;
  height: 26px;
  border-radius: 20px;
  animation-fill-mode: forwards;
  animation: grow-line 1s ease-out;

  &#win-line-vertical {
    height: 100%;
    width: 26px;
    transform: scaleY(0.93);
    animation: none;
    top: 0;
    left: calc(50% - 11px);
    animation: grow-line-height 1s ease-out;

    @keyframes grow-line-height {
      from {
        height: 0;
      }

      to {
        height: 100%;
      }
    }
  }

  &#win-line-diagonal {
    @extend #win-line-vertical;
    transform-origin: top;
    box-sizing: content-box;
    animation: grow-line-vertical 1s ease-out;
    animation-fill-mode: forwards;

    @keyframes grow-line-vertical {
      from {
        height: 0;
      }

      to {
        height: 130.5%;
      }
    }
  }

  @keyframes grow-line {
    from {
      width: 0;
    }

    to {
      width: 100%;
    }
  }
}

.board {
  display: grid;
  margin: auto;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  max-width: 600px;
  max-height: 600px;
  width: 80vw;
  height: 80vw;
  margin: auto;
  border: 20px solid $border-color;
  border-radius: 20px;
  grid-gap: 20px;
  background-color: $border-color;
  position: relative;

  &__cell {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
    background-color: $bg-color;
    border-radius: 3px;

    &-X {
      width: 100%;
      height: 100%;
      margin: auto;
      position: relative;

      &::before,
      &::after {
        content: "";
        animation: cross-anim 1s ease;
        animation-fill-mode: forwards;
        position: absolute;
        width: 13%;
        height: 0px;
        background-color: $knots-crosses-color;
        border-radius: 30px;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        transform: rotate(-45deg);
      }

      &::after {
        transform: rotate(45deg);
      }
    }

    &-O {
      width: 100%;
      height: 100%;
      margin: auto;
      position: relative;

      &::before {
        box-sizing: border-box;
        content: "";
        animation: knots-anim 1s ease;
        animation-fill-mode: forwards;
        position: absolute;
        width: 65%;
        height: 65%;
        background-color: $bg-color;
        border: 20px solid $knots-crosses-color;
        border-radius: 50%;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        transform-origin: center;
        transform: scale(0);

        @media (max-width: 768px) {
          border: 8px solid $knots-crosses-color;
        }
      }
    }
  }
}

@keyframes cross-anim {
  from {
    height: 0px;
  }

  to {
    height: 68%;
  }
}

@keyframes knots-anim {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(0);
  }

  to {
    transform: scale(1);
  }
}
</style>