"use strict";

{
  class Panel {
    constructor(game) {
      this.game = game;
      this.el = document.createElement("li");
      this.el.classList.add("pressed");
      this.el.addEventListener("click", () => {
        this.check();
      });
    }

    getEl() {
      return this.el;
    }

    active(num) {
      this.el.classList.remove("pressed");
      this.el.textContent = num;
    }

    check() {
      if (this.game.getCurrentNum() === Number(this.el.textContent)) {
        this.el.classList.add("pressed");

        if (this.game.getCurrentNum() === 9) {
          clearTimeout(this.game.timeoutId);
          this.game.start.classList.remove("active");
        }
      }
      this.game.addCurrentNum();
    }
  }

  class Board {
    constructor(game) {
      this.game = game;
      this.panels = [];
      for (let i = 1; i <= 9; i++) {
        this.panels.push(new Panel(this.game));
      }
      console.log(this.panels);
      this.setUp();
    }

    setUp() {
      const board = document.getElementById("js-board");
      this.panels.forEach((panel) => {
        board.appendChild(panel.getEl());
      });
    }

    active() {
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      this.panels.forEach((panel) => {
        const num = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];
        panel.active(num);
      });
    }
  }

  class Game {
    constructor() {
      this.board = new Board(this);

      this.currentNum;
      this.timeoutId;
      this.startTime;
      this.start = document.getElementById("start");

      this.start.addEventListener("click", () => {
        this.gameStart();
      });
    }

    gameStart() {
      if (this.start.classList.contains("active")) {
        return;
      }

      this.currentNum = 1;
      this.start.classList.add("active");

      this.board.active();

      this.startTime = Date.now();
      this.runTimer();
    }

    runTimer() {
      const timer = document.getElementById("js-timer");
      timer.textContent = ((Date.now() - this.startTime) / 1000).toFixed(2);

      this.timeoutId = setTimeout(() => {
        this.runTimer();
      }, 10);
    }

    getCurrentNum() {
        return this.currentNum;
    }

    addCurrentNum() {
        this.currentNum++;
    }

    getTimeoutId() {
        return this.timeoutId;
    }

    getStart() {
        return this.start;
    }
  }

  new Game();
}
