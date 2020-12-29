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

        if (this.game.getCurrentNum() === this.game.getLevel() ** 2) {
          clearTimeout(this.game.timeoutId);
          this.game.start.classList.remove("active");
          this.game.partComment();
        }
        this.game.addCurrentNum();
      }
    }
  }

  class Board {
    constructor(game) {
      this.game = game;
      this.panels = [];
      for (let i = 1; i <= this.game.getLevel() ** 2; i++) {
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
      const nums = [];
      for (let i = 1; i <= this.game.getLevel() ** 2; i++) {
        nums.push(i);
      }
      this.panels.forEach((panel) => {
        const num = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];
        panel.active(num);
      });
    }
  }

  class Game {
    constructor(level) {
      this.level = level;
      this.board = new Board(this);

      this.currentNum;
      this.timeoutId;
      this.startTime;
      this.start = document.getElementById("js-start");
      this.change = document.getElementById("js-change");
      this.timer = document.getElementById("js-timer");
      this.comment = document.getElementById("js-comment");

      this.commentList = [
        "Bad...",
        "No Good",
        "Good!",
        "Excellent!!",
        "Perfect!!",
      ];

      this.setUp();

      this.start.addEventListener("click", () => {
        this.gameStart();
      });

      this.change.addEventListener("click", () => {
        this.changeLevel();
      });
    }

    setUp() {
      const container = document.getElementById("js-container");
      const BOARD_PADDING = 10;
      const PANEL_WIDTH = 50;
      container.style.width =
        PANEL_WIDTH * this.getLevel() + BOARD_PADDING * 2 + "px";
    }

    gameStart() {
      if (this.start.classList.contains("active")) {
        return;
      }

      this.currentNum = 1;
      this.start.classList.add("active");

      this.board.active();
      this.comment.textContent = "";

      this.startTime = Date.now();
      this.runTimer();
    }

    runTimer() {
      this.timer.textContent = ((Date.now() - this.startTime) / 1000).toFixed(
        2
      );

      this.timeoutId = setTimeout(() => {
        this.runTimer();
      }, 10);
    }

    changeLevel() {
      confirm(
        "ゲームのレベルを変更しますか？\n変更すると現在のゲームはリセットされます"
      );
      if (confirm) {
        location.reload();
      }
    }

    partComment() {
      switch (this.getLevel()) {
        case 3:
          this.easyLevelComment();
          break;
        case 4:
          this.normalLevelComment();
          break;
        case 5:
          this.hardLevelComment();
          break;
      }
    }

    easyLevelComment() {
      if (this.timer.textContent <= 6.5) {
        this.comment.textContent = this.commentList[4];
      } else if (this.timer.textContent <= 8) {
        this.comment.textContent = this.commentList[3];
      } else if (this.timer.textContent <= 10) {
        this.comment.textContent = this.commentList[2];
      } else if (this.timer.textContent <= 12) {
        this.comment.textContent = this.commentList[1];
      } else {
        this.comment.textContent = this.commentList[0];
      }
    }

    normalLevelComment() {
      if (this.timer.textContent <= 12) {
        this.comment.textContent = this.commentList[4];
      } else if (this.timer.textContent <= 14) {
        this.comment.textContent = this.commentList[3];
      } else if (this.timer.textContent <= 16) {
        this.comment.textContent = this.commentList[2];
      } else if (this.timer.textContent <= 18) {
        this.comment.textContent = this.commentList[1];
      } else {
        this.comment.textContent = this.commentList[0];
      }
    }

    hardLevelComment() {
      if (this.timer.textContent <= 22) {
        this.comment.textContent = this.commentList[4];
      } else if (this.timer.textContent <= 24) {
        this.comment.textContent = this.commentList[3];
      } else if (this.timer.textContent <= 26) {
        this.comment.textContent = this.commentList[2];
      } else if (this.timer.textContent <= 28) {
        this.comment.textContent = this.commentList[1];
      } else {
        this.comment.textContent = this.commentList[0];
      }
    }

    getLevel() {
      return this.level;
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

  const easy = document.getElementById("js-easy");
  const normal = document.getElementById("js-normal");
  const hard = document.getElementById("js-hard");
  const mask = document.getElementById("js-mask");
  const select = document.getElementById("js-select");

  const backgroundImages = [
    "url('img/number-game-easy.jpg') no-repeat center/cover",
    "url('img/number-game-normal.jpg') no-repeat center/cover",
    "url('img/number-game-hard.jpg') no-repeat center/cover",
  ];

  function changeBg(backgroundImageUrl) {
    document.body.style.background = backgroundImageUrl;
  }

  function hideSelect() {
    mask.classList.add("hide");
    select.classList.add("hide");
  }

  easy.addEventListener("click", () => {
    hideSelect();
    changeBg(backgroundImages[0]);
    new Game(3);
  });

  normal.addEventListener("click", () => {
    hideSelect();
    changeBg(backgroundImages[1]);
    new Game(4);
  });

  hard.addEventListener("click", () => {
    hideSelect();
    changeBg(backgroundImages[2]);
    new Game(5);
  });
}
