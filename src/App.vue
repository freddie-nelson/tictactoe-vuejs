<template>
  <div id="app">
    <!-- <h2 class="title">TicTacToe</h2> -->
    <Board
      :board="game.board"
      :line="line"
      :ended="this.game.gameEnd"
      @click-cell="clickCell($event)"
      ref="board"
    />
    <transition name="fade">
      <div v-if="this.showWinningMsg" class="winning-msg">
        <div>
          <h1>{{ this.game.winner }}</h1>
          <h2>Current Rankings: Bot - {{ botWinCount }} You - {{ playerWinCount }}</h2>
          <button @click="restartGame">Restart Game</button>
        </div>
      </div>
    </transition>
    <p class="google-analytics-para">
      Click
      <a href="#" @click.prevent="disableTracking">here</a>,
      to disable tracking through Google Analytics.
    </p>
  </div>
</template>

<script>
import Board from "./components/Board";
import * as arrayFunctions from "./mixins/arrayFunctions";

export default {
  name: "app",
  components: {
    Board
  },
  computed: {
    playerFilled() {
      const board = [...this.game.board];
      let filled = [];

      board.forEach((obj, i) => {
        if (obj.filledByPlayer) {
          filled.push(i);
        }
      });

      return filled;
    },
    botFilled() {
      const board = [...this.game.board];
      let filled = [];

      board.forEach((obj, i) => {
        if (obj.filledByBot) {
          filled.push(i);
        }
      });

      return filled;
    },
    emptySpaces() {
      const board = [...this.game.board];
      let empty = [];

      board.forEach((obj, i) => {
        if (!obj.filledByBot && !obj.filledByPlayer) {
          empty.push(i);
        }
      });

      return empty;
    }
  },
  data() {
    return {
      line: "",
      showWinningMsg: false,
      botWinCount: 0,
      playerWinCount: 0,
      game: {
        board: [],
        playersTurn: true,
        gameEnd: false,
        winner: "",
        winningCombinations: [
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 4, 8],
          [2, 4, 6]
        ], // Set the values that we can check against for a winner
        checkWinner: () => {
          // use a loop to check for a winner from the Player and the Bot
          const users = ["player", "bot"];

          users.forEach((user, i) => {
            let filled = i === 0 ? this.playerFilled : this.botFilled;

            // window.console.log(user, arr);

            // check against the winning combinations to see if a user has placed in matching cells
            let matchFound;

            this.game.winningCombinations.forEach(combo => {
              let match = [];

              combo.forEach(index => {
                filled.forEach(filledIndex => {
                  if (filledIndex === index) {
                    match.push(index);
                  }
                });
              });

              if (match.length === 3) {
                matchFound = combo;
              }
            });

            // check to see if someone has won
            if (matchFound) {
              this.endGame(user, matchFound);
              return;
            }

            // check for a draw by seeing if all squares are filled by either player
            if (this.emptySpaces.length === 0) {
              this.endGame("draw");
              return;
            }
          });
        },
        nextTurn: () => {
          this.game.checkWinner(); // after every turn check for a winner again
          if (!this.game.gameEnd) {
            this.game.playersTurn = !this.game.playersTurn; // if the game hasn't ended switch whos turn it is
            if (!this.game.playersTurn) {
              this.bot.play(); // if it's the bot's turn make him play
            }
          }
        }
      },
      bot: {
        getChanceArray: arr => {
          // Get the odds for each winning combination so we can check what one the player will most likely go for
          // we then use the matches variable to keep track of how likely the player is to go for each combonation and we push them into an array
          let chanceArray = [];

          for (let i = 0; i < this.game.winningCombinations.length; i++) {
            const winningCombination = this.game.winningCombinations[i];
            let matches = 0;

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

          return chanceArray;
        },
        play: () => {
          let indexOfMaxMatch;
          let mostLikelyWinningCombination;
          let playablePositions = [];
          let playPosition;

          const chanceArray = this.bot.getChanceArray(this.playerFilled);
          const winIndex = this.bot.tryToWin();
          window.console.log(winIndex);

          if (typeof winIndex === "number") {
            this.game.board[winIndex].filledByBot = true;
            this.game.nextTurn();
            return;
          }

          // window.console.log('chanceArray: ' + chanceArray)

          // get the most likely winning combination
          indexOfMaxMatch = arrayFunctions.arrayMax(
            chanceArray,
            this.game.board
          )[1];

          // window.console.log('indexOfMaxMatch: ' + indexOfMaxMatch)

          let mostLikelyWinningCombinations = [];

          for (let i = 0; i < indexOfMaxMatch.length; i++) {
            const index = indexOfMaxMatch[i];
            let blockedSpaces = 0;

            for (
              let i = 0;
              i < this.game.winningCombinations[index].length;
              i++
            ) {
              let cellIndex;

              if (this.game.winningCombinations[index][i] !== undefined) {
                cellIndex = this.game.winningCombinations[index][i];
              } else {
                return undefined;
              }

              if (
                this.game.board[cellIndex].filledByPlayer ||
                this.game.board[cellIndex].filledByBot
              ) {
                blockedSpaces++;
              }
            }

            if (blockedSpaces !== 3) {
              mostLikelyWinningCombinations.push(
                this.game.winningCombinations[index]
              );
            }
          }

          mostLikelyWinningCombination =
            mostLikelyWinningCombinations[
              arrayFunctions.randomIndex(mostLikelyWinningCombinations)
            ];

          // window.console.log('mostLikelyWinningCombination: ' + mostLikelyWinningCombination)
          // window.console.log('this.game.board[mostLikelyWinningCombination] = ' + this.game.board[mostLikelyWinningCombination])

          if (!mostLikelyWinningCombination) {
            // window.console.log('mostLikey... === undefined')

            indexOfMaxMatch = arrayFunctions.getNextBestArr(chanceArray);

            mostLikelyWinningCombinations = [];

            for (let i = 0; i < indexOfMaxMatch.length; i++) {
              const index = indexOfMaxMatch[i];
              let blockedSpaces = [];

              for (
                let i = 0;
                i < this.game.winningCombinations[index].length;
                i++
              ) {
                let cellIndex;

                if (this.game.winningCombinations[index][i] !== undefined) {
                  cellIndex = this.game.winningCombinations[index][i];
                } else {
                  return undefined;
                }

                if (
                  this.game.board[cellIndex].filledByPlayer ||
                  this.game.board[cellIndex].filledByBot
                ) {
                  blockedSpaces.push(i);
                }
              }

              if (blockedSpaces.length !== 3) {
                mostLikelyWinningCombinations.push(
                  this.game.winningCombinations[index]
                );
              }
            }

            mostLikelyWinningCombination =
              mostLikelyWinningCombinations[
                arrayFunctions.randomIndex(mostLikelyWinningCombinations)
              ];

            window.console.log(
              "fixed mostLikelyWinningCombination = " +
                mostLikelyWinningCombination
            );
          }

          for (let i = 0; i < 3; i++) {
            const obj = this.game.board[mostLikelyWinningCombination[i]];

            if (obj.filledByPlayer === false && obj.filledByBot === false) {
              playablePositions.push(mostLikelyWinningCombination[i]);
            }
          }

          let randomPlayPosIndex = arrayFunctions.randomIndex(
            playablePositions
          );

          if (playablePositions.length > 0) {
            playPosition = playablePositions[randomPlayPosIndex];
            this.game.board[playPosition].filledByBot = true;
          }

          if (playPosition == undefined) {
            window.console.log("------------------- random placement");
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
          this.game.nextTurn();
        },
        tryToWin: () => {
          if (this.botFilled.length >= 1) {
            const winners = this.bot
              .getChanceArray(this.botFilled)
              .map((num, i) => {
                if (num === 2) {
                  return i;
                }
              })
              .filter(num => num !== undefined);

            let availableWinningSpaces = [];
            // window.console.log(winners)

            winners.forEach(winningCombinationIndex => {
              let combo = [
                ...this.game.winningCombinations[winningCombinationIndex]
              ];
              let spaces = [];

              combo.forEach(index => {
                this.emptySpaces.forEach(emptyIndex => {
                  // window.console.log(emptyIndex, index);
                  if (emptyIndex === index) {
                    spaces.push(index);
                  }
                });
              });

              window.console.log("spaces: " + spaces);
              availableWinningSpaces.push(...spaces);
            });

            availableWinningSpaces = [...new Set(availableWinningSpaces)];
            // window.console.log(availableWinningSpaces);

            if (availableWinningSpaces) {
              return availableWinningSpaces[0];
            } else {
              return false;
            }
          }
        }
      }
    };
  },
  methods: {
    createBoard() {
      this.game.board = [];

      for (let i = 0; i < 9; i++) {
        this.game.board.push({ filledByPlayer: false, filledByBot: false });
      }
    },
    clickCell(index) {
      if (
        this.game.board[index].filledByPlayer ||
        this.game.board[index].filledByBot
      ) {
        return;
      } else {
        this.game.board[index].filledByPlayer = true;
        this.game.nextTurn();
      }
    },
    restartGame() {
      this.game.gameEnd = false;
      this.showWinningMsg = false;
      this.game.playersTurn = true;
      this.line = "";
      this.createBoard();
    },
    disableTracking() {
      this.$ga.disable();
      alert("Tracking disabled");
    },
    endGame(user, combo) {
      const storage = window.localStorage;

      if (user === "player") {
        this.game.winner = "Well done, you win!";
        this.playerWinCount++;
        storage.setItem("playerWinCount", this.playerWinCount);
      } else if (user === "bot") {
        this.game.winner = "Oh no, the bot has won!";
        this.botWinCount++;
        storage.setItem("botWinCount", this.botWinCount);
      } else {
        this.game.winner = "There has been a draw!";
      }

      setTimeout(() => {
        this.showWinningMsg = true;
      }, 1000);

      window.console.log("winner found");
      this.game.filledCellsArray = [];

      const winLineHorizontal = document.getElementById("win-line-horizontal");
      const winLineVertical = document.getElementById("win-line-vertical");
      const winLineDiagonal = document.getElementById("win-line-diagonal");
      const spacing = this.$refs.board.$el.children[0].clientWidth / 2 - 13;

      this.game.gameEnd = true;

      if (!combo) return;
      switch (combo.toString()) {
        case "0,1,2":
          winLineHorizontal.style.cssText += `top: ${spacing}px;`;
          this.line = "horizontal";
          break;
        case "3,4,5":
          this.line = "horizontal";
          break;
        case "6,7,8":
          winLineHorizontal.style.cssText += `bottom: ${spacing}px; top: auto;`;
          this.line = "horizontal";
          break;
        case "0,3,6":
          winLineVertical.style.cssText += `left: ${spacing}px;`;
          this.line = "vertical";
          break;
        case "1,4,7":
          this.line = "vertical";
          break;
        case "2,5,8":
          winLineVertical.style.cssText += `right: ${spacing}px; left: auto;`;
          this.line = "vertical";
          break;
        case "0,4,8":
          winLineDiagonal.style.cssText += `transform: scaleY(1) rotate(-45deg); left: ${spacing -
            64}px; top: ${spacing - 53}px;`;
          this.line = "diagonal";
          break;
        case "2,4,6":
          winLineDiagonal.style.cssText += `transform: scaleY(1) rotate(45deg); left: auto; right: ${spacing -
            64}px; top: ${spacing - 53}px;`;
          this.line = "diagonal";
          break;
        default:
          break;
      }
    }
  },
  mounted() {
    this.createBoard();
    this.$ga.page("/");

    const storage = window.localStorage;
    if (!storage.getItem("botWinCount")) {
      storage.setItem("botWinCount", 0);
      storage.setItem("playerWinCount", 0);
    }

    this.botWinCount = storage.getItem("botWinCount");
    this.playerWinCount = storage.getItem("playerWinCount");
  }
};
</script>

<style lang="scss">
$bg-color: #f5eded;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

body {
  width: 100%;
  height: 100vh;
  background-color: $bg-color;
  overflow: hidden;
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
  z-index: 2;
  width: 100%;
  height: 150%;
  margin-top: -14.5%;
  background: #beb7b76e;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  font-size: 1.5rem;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    background-color: #ecd6c3;
    border-radius: 20px;
  }

  button {
    display: block;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    margin-top: 10px;
    background-color: white;
    transition: all 0.5s ease;
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
  font-size: 0.8rem;
  bottom: 10px;
  right: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s, transform 2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-20%);
}
</style>
