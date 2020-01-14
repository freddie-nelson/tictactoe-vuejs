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
    <p class="google-analytics-para">
      Click <a href="#" v-on:click.prevent="disableTracking">here</a>,
      to disable tracking through Google Analytics.
    </p>
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
        winningCombinations: [ [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [2, 4, 6] ], // Set the values that we can check against for a winner
        checkWinner() {
          // use a loop to check for a winner from the Player and the Bot
          for (let i = 0; i <= 1; i++) {

            let user;
            i === 1 ? user = 'Player' : user = 'Bot'; // decide what user we are checking from the loops index

            let arr = [];
            
            // loop through every cell in the board and check if it is filled by the user we are currently checking
            for (let i = 0; i < this.board.length; i++) {
                const obj = this.board[i];

                if (obj[`filledBy${user}`] === true) {
                    arr.push(i); // push the cell into the array if it is filled by the user
                }
            }

            // window.console.log(user, arr);

            // check against the winning combinations to see if a user has placed in matching cells
            for (let i = 0; i < this.winningCombinations.length; i++) {
              const winningCombination = this.winningCombinations[i];
              let matches = 0

              for (let i = 0; i < arr.length; i++) {
                  const playerNum = arr[i];
                  
                  for (let i = 0; i < 3; i++) {
                      const num = winningCombination[i];
                  
                      if (num === playerNum) {
                          matches++; // if an index in a winning combination matches an index that the user has placed on add one to the matches counter
                      }
                  }
              }
              this.filledCellsArray.push(matches);
            }

            // window.console.log(this.filledCellsArray)

            // check to see if a player has won (if they have they will have a match equal to 3)
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

            this.filledCellsArray = []; // reset the filledCellsArray for the next time we check for a winner
          }

          // check for a draw by seeing if all squares are filled by either player
          let filledCounter = 0;
          this.board.forEach(obj => obj.filledByPlayer || obj.filledByBot ? filledCounter++ : null);

          if (filledCounter === 9) {
            this.gameEnd = true;
            this.winner = 'No one';
            return;
          }
        },
        nextTurn: () => {
          this.game.checkWinner() // after every turn check for a winner again 
          if (!this.game.gameEnd) {
            this.game.playersTurn = !this.game.playersTurn; // if the game hasn't ended sqitch whos turn it is
            if (!this.game.playersTurn) {
              this.bot.play() // if it's the bot's turn make him play
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
          // we then use the matches variable to keep track of how likely the player is to go for each combonation and we push them into an array
          for (let i = 0; i < this.game.winningCombinations.length; i++) {
              const winningCombination = this.game.winningCombinations[i];
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
              chanceArray.push(matches);
          }

          // window.console.log('chanceArray: ' + chanceArray)

          // get the most likely winning combination
          indexOfMaxMatch = arrayFunctions.arrayMax(chanceArray, this.game.board)[1];

          // window.console.log('indexOfMaxMatch: ' + indexOfMaxMatch)

          let mostLikelyWinningCombinations = [];

          for (let i = 0; i < indexOfMaxMatch.length; i++) {
              const index = indexOfMaxMatch[i];
              let blockedSpaces = 0

              for (let i = 0; i < this.game.winningCombinations[index].length; i++) {
                  let cellIndex;

                  if (this.game.winningCombinations[index][i] !== undefined) {
                      cellIndex = this.game.winningCombinations[index][i];
                  } else {
                      return undefined
                  }

                  if (this.game.board[cellIndex].filledByPlayer || this.game.board[cellIndex].filledByBot) {
                      blockedSpaces++
                  }
              }

              if (blockedSpaces !== 3) {
                  mostLikelyWinningCombinations.push(this.game.winningCombinations[index])
              }
          }

          mostLikelyWinningCombination = mostLikelyWinningCombinations[arrayFunctions.randomIndex(mostLikelyWinningCombinations)]
          
          // window.console.log('mostLikelyWinningCombination: ' + mostLikelyWinningCombination)
          // window.console.log('this.game.board[mostLikelyWinningCombination] = ' + this.game.board[mostLikelyWinningCombination])

          if (!mostLikelyWinningCombination) {
            // window.console.log('mostLikey... === undefined')

            indexOfMaxMatch = arrayFunctions.getNextBestArr(chanceArray);

            mostLikelyWinningCombinations = [];

            for (let i = 0; i < indexOfMaxMatch.length; i++) {
              const index = indexOfMaxMatch[i];
              let blockedSpaces = []

              for (let i = 0; i < this.game.winningCombinations[index].length; i++) {
                  let cellIndex;

                  if (this.game.winningCombinations[index][i] !== undefined) {
                      cellIndex = this.game.winningCombinations[index][i];
                  } else {
                      return undefined
                  }

                  if (this.game.board[cellIndex].filledByPlayer || this.game.board[cellIndex].filledByBot) {
                      blockedSpaces.push(i)
                  }
              }

              if (blockedSpaces.length !== 3) {
                  mostLikelyWinningCombinations.push(this.game.winningCombinations[index])
              }
            }

            mostLikelyWinningCombination = mostLikelyWinningCombinations[arrayFunctions.randomIndex(mostLikelyWinningCombinations)]

            // window.console.log('fixed mostLikelyWinningCombination = ' + mostLikelyWinningCombination)

          }

          for (let i = 0; i < 3; i++) {
              const obj = this.game.board[mostLikelyWinningCombination[i]];

              if (obj.filledByPlayer === false && obj.filledByBot === false) {
                  playablePositions.push(mostLikelyWinningCombination[i])
              } 
          }

          let randomPlayPosIndex = arrayFunctions.randomIndex(playablePositions);

          if (playablePositions.length > 0) {
            playPosition = playablePositions[randomPlayPosIndex];
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
              playPosition = playablePositions[randomPlayPosIndex];
              this.game.board[playPosition].filledByBot = true;
          }
          // window.console.log(playPosition)
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
        this.game.nextTurn()
      }
    },
    restartGame() {
      this.game.winner = '';
      this.game.gameEnd = false;
      this.game.playersTurn = true;
      this.createBoard()
    },
    disableTracking() {
      this.$ga.disable();
      alert('Tracking disabled');
    }
  },
  created() {
    this.createBoard()
  },
  mounted() {
    this.$ga.page('/');
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
  animation: winning-msg-anim 2.5s ease;
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

.google-analytics-para {
  position: absolute;
  font-size: .8rem;
  bottom: 10px;
  right: 10px;
}

@keyframes winning-msg-anim {
  0% {
    opacity: .5;
    transform: translateY(-100%);
  }

  50% {
    opacity: .5;
    transform: translateY(-100%);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
