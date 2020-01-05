<template>
  <div id="app">
    <!-- <h2 class="title">TicTacToe</h2> -->
    <Board v-bind:board="game.board" v-on:click-cell="clickCell($event)"/>
    <div v-show="this.game.gameEnd" class="winning-msg">
      <h1>{{ this.game.winner }} has won the game!</h1>
      <button v-on:click="restartGame">
        Restart Game
      </button>
    </div>
  </div>
</template>

<script>
import Board from './components/Board';
import * as arrayFunctions from './mixins/arrayFunctions';

export default {
  name: 'app',
  components: {
    Board
  },
  data() {
    return {
      game: {
        board: [],
        playersTurn: true,
        gameEnd: false,
        winner: '',
        filledCellsArray: [],
        winningCombinations: [ [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [2, 4, 6] ],
        checkWinner() {
          for (let i = 0; i <= 1; i++) {

            let user;
            i === 1 ? user = 'Player' : user = 'Bot';

            let arr = [];
            
            for (let i = 0; i < this.board.length; i++) {
                const obj = this.board[i];

                if (obj[`filledBy${user}`] === true) {
                    arr.push(i);
                }
            }

            window.console.log(user, arr);

            for (let i = 0; i < this.winningCombinations.length; i++) {
              const winningCombination = this.winningCombinations[i];
              let matches = 0

              for (let i = 0; i < arr.length; i++) {
                  const playerNum = arr[i];
                  
                  for (let i = 0; i < 3; i++) {
                      const num = winningCombination[i];
                  
                      if (num === playerNum) {
                          matches++;
                      }
                  }
              }
              this.filledCellsArray.push(matches);
            }

            window.console.log(this.filledCellsArray)

            for (let i = 0; i < this.filledCellsArray.length; i++) {
              const num = this.filledCellsArray[i];

                if (num === 3) {
                    this.gameEnd = true;
                    this.winner = user;
                    window.console.log('winner found')
                    this.filledCellsArray = [];
                    return;
                }
            }

            this.filledCellsArray = [];
          }

          let filledCounter = 0;
          this.board.forEach(obj => obj.filledByPlayer || obj.filledByBot ? filledCounter++ : null);

          if (filledCounter === 9) {
            this.gameEnd = true;
            this.winner = 'No one';
            return;
          }
        },
        nextTurn: () => {
          this.game.checkWinner()  
          if (!this.game.gameEnd) {
            this.game.playersTurn = !this.game.playersTurn;
            if (!this.game.playersTurn) {
              this.bot.play()
            }
          }
        }
      },
      bot: {
        play: () => {
          let arr = [];
          let chanceArray = [];
          let indexOfMaxMatch;
          let mostLikelyWinningCombination;
          let playablePositions = [];
          let playPosition;

          // Getting all positions that the player has placed on
          for (let i = 0; i < this.game.board.length; i++) {
              const obj = this.game.board[i];

              if (obj.filledByPlayer === true) {
                  arr.push(i);
              }
          }

          // Get the odds for each winning combination so we can check what one the player will most likely go for
          for (let i = 0; i < this.game.winningCombinations.length; i++) {
              const winningCombination = this.game.winningCombinations[i];
              let matches = 0

              for (let i = 0; i < winningCombination.length; i++) {
                  const playerNum = arr[i];
                  
                  for (let i = 0; i < 3; i++) {
                      const num = winningCombination[i];
                  
                      if (num === playerNum) {
                          matches++;
                      }
                  }
              }
              chanceArray.push(matches);
          }

          // get the most likely winning combination
          indexOfMaxMatch = arrayFunctions.arrayMax(chanceArray)[1];

          mostLikelyWinningCombination = this.game.winningCombinations[indexOfMaxMatch];

          for (let i = 0; i < 3; i++) {
              const obj = this.game.board[mostLikelyWinningCombination[i]];

              if (obj.filledByPlayer === false && obj.filledByBot === false) {
                  playablePositions.push(mostLikelyWinningCombination[i])
              } 
          }

          let randomIndex = Math.floor(Math.random() * playablePositions.length);

          if (playablePositions.length > 0) {
            playPosition = playablePositions[randomIndex];
            this.game.board[playPosition].filledByBot = true;
          }

          if (playPosition == undefined) {
            window.console.log('------------------- random placement')
              playablePositions = [];
              for (let i = 0; i < this.game.board.length; i++) {
                  const obj = this.game.board[i];
                  if (!obj.filledByPlayer && !obj.filledByBot) {
                      playablePositions.push(i);
                  }
                  
              }
              playPosition = playablePositions[randomIndex];
              this.game.board[playPosition].filledByBot = true;
          }

          this.game.nextTurn()
        }
      }
    }
  },
  methods: {
    createBoard() {
      this.game.board = [];

      for (let i = 0; i < 9; i++) {
        this.game.board.push({ filledByPlayer: false, filledByBot: false }) 
      }
    },
    clickCell(index) {
      if (this.game.board[index].filledByPlayer || this.game.board[index].filledByBot) {
        return;
      } else {
        this.game.board[index].filledByPlayer = true;
        window.console.log('called clickcell')
        this.game.nextTurn()
      }
    },
    restartGame() {
      this.game.winner = '';
      this.game.gameEnd = false;
      this.createBoard()
    }
  },
  created() {
    this.createBoard()
  }
}
</script>

<style lang="scss">
$bg-color: #f5eded;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
}

body {
  width: 100%;
  height: 100vh;
  background-color: $bg-color;
}

#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
}

.title {
  font-size: 4rem;
  margin: 0 auto;
  color: #3e3636;
  padding-top: 40px;
}

.winning-msg {
  position: absolute;
  display: flex;
  flex-direction: column;
  animation: winning-msg-anim 1s ease;
  z-index: 2;
  width: 100%;
  height: 100%;
  background: black;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 2rem;
  text-align: center;

  button {
    display: block;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    margin-top: 10px;
    background-color: white;
    transition: all .5s ease;
    color: black;
    height: 50px;
    width: 150px;
    outline: none !important;
    cursor: pointer;

    &:hover {
      background-color: rgb(221, 221, 221);
    }
  }
}

@keyframes winning-msg-anim {
  from {
    opacity: .5;
    transform: translateY(-100%);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
