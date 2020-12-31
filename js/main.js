"use strict";

{
  // パネルに関する処理を管理する
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

    // ゲームスタート時のパネルの状態
    active(num) {
      this.el.classList.remove("pressed");
      this.changePanelColor();
      this.el.textContent = num;
    }

    // 難易度によってパネルの色を変える
    changePanelColor() {
      switch (this.game.getLevel()) {
        case 3:
          this.el.classList.add("easy-color");
          break;
        case 4:
          this.el.classList.add("normal-color");
          break;
        case 5:
          this.el.classList.add("hard-color");
          break;
      }
    }

    // パネルが数字の小さい順から押されているか判断する/全てのパネルが押し終わった時の処理
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

  // ボードに関する処理を管理する
  class Board {
    constructor(game) {
      this.game = game;
      this.panels = [];
      for (let i = 1; i <= this.game.getLevel() ** 2; i++) {
        this.panels.push(new Panel(this.game));
      }
      this.setUp();
    }

    // パネル(li要素)を生成する
    setUp() {
      const board = document.getElementById("js-board");
      this.panels.forEach((panel) => {
        board.appendChild(panel.getEl());
      });
    }

    // パネルにランダムに数字を降る
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

  // ゲーム全体の処理を管理する
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

      this.commentList = {
        bad: "Bad...",
        noGod: "No Good",
        good: "Good!",
        excellent: "Excellent!!",
        perfect: "Perfect!!",
      };

      this.setUp();

      this.start.addEventListener("click", () => {
        this.gameStart();
      });

      this.change.addEventListener("click", () => {
        this.changeLevel();
      });
    }

    // 難易度に応じてcontainerの幅を可変させる
    setUp() {
      const container = document.getElementById("js-container");
      const BOARD_PADDING = 10;
      const PANEL_WIDTH = 50;
      container.style.width =
        PANEL_WIDTH * this.getLevel() + BOARD_PADDING * 2 + "px";
    }

    // ゲームスタートボタンを押した時の処理
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

    // タイマーを走らせる
    runTimer() {
      this.timer.textContent = ((Date.now() - this.startTime) / 1000).toFixed(
        2
      );

      this.timeoutId = setTimeout(() => {
        this.runTimer();
      }, 10);
    }

    // レベルチェンジボタンを押した時に確認する
    changeLevel() {
      confirm(
        "ゲームのレベルを変更しますか？\n変更すると現在のゲームはリセットされます"
      );
      if (confirm) {
        location.reload();
      }
    }

    // 難易度によってコメントを分岐
    partComment() {
      const level = { easy: 3, normal: 4, hard: 5 };

      switch (this.getLevel()) {
        case level.easy:
          this.easyLevelComment();
          break;
        case level.normal:
          this.normalLevelComment();
          break;
        case level.hard:
          this.hardLevelComment();
          break;
        default:
          this.comment.textContent = "error";
          break;
      }
    }

    // 難易度Easyの時のコメント
    easyLevelComment() {
      if (this.timer.textContent <= 6.5) {
        this.comment.textContent = this.commentList.perfect;
      } else if (this.timer.textContent <= 8) {
        this.comment.textContent = this.commentList.excellent;
      } else if (this.timer.textContent <= 10) {
        this.comment.textContent = this.commentList.good;
      } else if (this.timer.textContent <= 12) {
        this.comment.textContent = this.commentList.noGod;
      } else {
        this.comment.textContent = this.commentList.bad;
      }
    }

    // 難易度Normalの時のコメント
    normalLevelComment() {
      if (this.timer.textContent <= 12) {
        this.comment.textContent = this.commentList.perfect;
      } else if (this.timer.textContent <= 14) {
        this.comment.textContent = this.commentList.excellent;
      } else if (this.timer.textContent <= 16) {
        this.comment.textContent = this.commentList.good;
      } else if (this.timer.textContent <= 18) {
        this.comment.textContent = this.commentList.noGod;
      } else {
        this.comment.textContent = this.commentList.bad;
      }
    }

    // 難易度Hardの時のコメント
    hardLevelComment() {
      if (this.timer.textContent <= 22) {
        this.comment.textContent = this.commentList.perfect;
      } else if (this.timer.textContent <= 24) {
        this.comment.textContent = this.commentList.excellent;
      } else if (this.timer.textContent <= 26) {
        this.comment.textContent = this.commentList.good;
      } else if (this.timer.textContent <= 28) {
        this.comment.textContent = this.commentList.noGod;
      } else {
        this.comment.textContent = this.commentList.bad;
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
  const levelText = document.getElementById("js-level-text");

  const backgroundImages = [
    "url('img/number-game-easy.jpg') no-repeat center/cover",
    "url('img/number-game-normal.jpg') no-repeat center/cover",
    "url('img/number-game-hard.jpg') no-repeat center/cover",
  ];

  // 難易度によって背景画像を変える
  function changeBg(backgroundImageUrl) {
    document.body.style.background = backgroundImageUrl;
  }

  // セレクトボックスを隠す
  function hideSelect() {
    mask.classList.add("hide");
    select.classList.add("hide");
  }

  // 難易度Easy
  easy.addEventListener("click", () => {
    hideSelect();
    changeBg(backgroundImages[0]);
    levelText.textContent = "Easy";
    levelText.classList.add("easy-text");
    new Game(3);
  });

  // 難易度Normal
  normal.addEventListener("click", () => {
    hideSelect();
    changeBg(backgroundImages[1]);
    levelText.textContent = "Normal";
    levelText.classList.add("normal-text");
    new Game(4);
  });

  // 難易度Hard
  hard.addEventListener("click", () => {
    hideSelect();
    changeBg(backgroundImages[2]);
    levelText.textContent = "Hard";
    levelText.classList.add("hard-text");
    new Game(5);
  });
}
