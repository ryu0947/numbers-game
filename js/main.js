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
    panelActive(num) {
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
      if (this.game.getPanelCurrentNum() === Number(this.el.textContent)) {
        this.el.classList.add("pressed");

        if (this.game.getPanelCurrentNum() === this.game.getLevel() ** 2) {
          clearTimeout(this.game.timeoutId);
          this.game.getStartElem().classList.remove("active");
          this.game.partComment();
        }
        this.game.addPanelCurrentNum();
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
      this.setUpPanel();
    }

    // パネル(li要素)を生成する
    setUpPanel() {
      const board = document.getElementById("js-board");
      this.panels.forEach((panel) => {
        board.appendChild(panel.getEl());
      });
    }

    // パネルにランダムに数字を振る
    assignNumber() {
      const nums = [];
      for (let i = 1; i <= this.game.getLevel() ** 2; i++) {
        nums.push(i);
      }
      this.panels.forEach((panel) => {
        const num = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];
        panel.panelActive(num);
      });
    }
  }

  // ゲーム全体の処理を管理する
  class Game {
    constructor(level) {
      this.level = level;
      this.board = new Board(this);

      this.panelCurrentNum;
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

      this.setUpContainer();

      this.start.addEventListener("click", () => {
        this.gameStart();
      });

      this.change.addEventListener("click", () => {
        this.resetGame();
      });
    }

    // 難易度に応じてcontainerの幅を可変させる
    setUpContainer() {
      const container = document.getElementById("js-container");
      const BOARD_PADDING = 10;
      const PANEL_WIDTH = 50;
      container.style.width =
        PANEL_WIDTH * this.getLevel() + BOARD_PADDING * 2 + "px";
    }

    // ゲームスタートボタンを押した時の処理
    gameStart() {
      if (this.getStartElem().classList.contains("active")) {
        return;
      }

      this.panelCurrentNum = 1;
      this.getStartElem().classList.add("active");

      this.board.assignNumber();

      if (this.comment.textContent) {
        this.comment.textContent = "";
      }

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
    resetGame() {
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
          throw new Error(`${this.getLevel()} is not provided.`);
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
      if (this.timer.textContent <= 13) {
        this.comment.textContent = this.commentList.perfect;
      } else if (this.timer.textContent <= 15) {
        this.comment.textContent = this.commentList.excellent;
      } else if (this.timer.textContent <= 17) {
        this.comment.textContent = this.commentList.good;
      } else if (this.timer.textContent <= 19) {
        this.comment.textContent = this.commentList.noGod;
      } else {
        this.comment.textContent = this.commentList.bad;
      }
    }

    // 難易度Hardの時のコメント
    hardLevelComment() {
      if (this.timer.textContent <= 23) {
        this.comment.textContent = this.commentList.perfect;
      } else if (this.timer.textContent <= 25) {
        this.comment.textContent = this.commentList.excellent;
      } else if (this.timer.textContent <= 27) {
        this.comment.textContent = this.commentList.good;
      } else if (this.timer.textContent <= 29) {
        this.comment.textContent = this.commentList.noGod;
      } else {
        this.comment.textContent = this.commentList.bad;
      }
    }

    getLevel() {
      return this.level;
    }

    getPanelCurrentNum() {
      return this.panelCurrentNum;
    }

    addPanelCurrentNum() {
      this.panelCurrentNum++;
    }

    getTimeoutId() {
      return this.timeoutId;
    }

    getStartElem() {
      return this.start;
    }
  }

  const easyElem = document.getElementById("js-easy");
  const normalElem = document.getElementById("js-normal");
  const hardElem = document.getElementById("js-hard");
  const maskElem = document.getElementById("js-mask");
  const selectElem = document.getElementById("js-select");
  const levelTextElem = document.getElementById("js-level-text");

  const backgroundImages = {
    Easy: "url('img/number-game-easy.jpg') no-repeat center/cover",
    Normal: "url('img/number-game-normal.jpg') no-repeat center/cover",
    Hard: "url('img/number-game-hard.jpg') no-repeat center/cover",
  };

  // 難易度によって背景画像を変える
  function setBackgroundImage(level) {
    document.body.style.background = level;
  }

  // セレクトボックスを隠す
  function hideSelect() {
    maskElem.classList.add("hide");
    selectElem.classList.add("hide");
  }

  // 難易度Easy
  easyElem.addEventListener("click", () => {
    const Easy = 3;
    hideSelect();
    setBackgroundImage(backgroundImages.Easy);
    levelTextElem.textContent = "Easy";
    levelTextElem.classList.add("easy-text");
    new Game(Easy);
  });

  // 難易度Normal
  normalElem.addEventListener("click", () => {
    const Normal = 4;
    hideSelect();
    setBackgroundImage(backgroundImages.Normal);
    levelTextElem.textContent = "Normal";
    levelTextElem.classList.add("normal-text");
    new Game(Normal);
  });

  // 難易度Hard
  hardElem.addEventListener("click", () => {
    const Hard = 5;
    hideSelect();
    setBackgroundImage(backgroundImages.Hard);
    levelTextElem.textContent = "Hard";
    levelTextElem.classList.add("hard-text");
    new Game(Hard);
  });
}
