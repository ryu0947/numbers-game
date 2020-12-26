"use strict";

{
  class Panel {
    constructor() {
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
      if (currentNum === Number(this.el.textContent)) {
        this.el.classList.add("pressed");

        if (currentNum === 9) {
          clearTimeout(timeoutId);
        }
      }
      currentNum++;
    }
  }

  class Board {
    constructor() {
      this.panels = [];
      for (let i = 1; i <= 9; i++) {
        this.panels.push(new Panel());
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

  const board = new Board();

  let currentNum;
  let timeoutId;
  let startTime;

  function runTimer() {
    const timer = document.getElementById("js-timer");
    timer.textContent = ((Date.now() - startTime) / 1000).toFixed(2);

    timeoutId = setTimeout(() => {
      runTimer();
    }, 10);
  }

  const start = document.getElementById("start");

  start.addEventListener("click", () => {
    board.active();
    currentNum = 1;
    startTime = Date.now();
    runTimer();
  });
}
