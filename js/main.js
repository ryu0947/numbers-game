"use strict";

{
  class Panel {
    constructor() {
      this.el = document.createElement("li");
      this.el.classList.add("pressed");
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
        board.appendChild(panel.el);
      });
    }
  }

  const board = new Board();
}
