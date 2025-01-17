import { Minefield } from "./mine"
import { Difficulty } from "./difficulty"
import { isProxy, toRaw } from "vue"

export class State {
  constructor(
    public flag: number,
    public mineNum: number,
    public time: number
  ) {}
}

export class Game {
  public state: State
  public minefield: Minefield
  public difficulty: Difficulty
  public timerId = 0
  constructor() {
    this.difficulty = new Difficulty(this)
    this.state = new State(
      this.difficulty.size.mineNum,
      this.difficulty.size.mineNum,
      0
    )
    this.minefield = new Minefield(this.difficulty)
  }
  initState() {
    clearInterval(this.timerId)
    Object.assign(
      this.state,
      new State(this.difficulty.size.mineNum, this.difficulty.size.mineNum, 0)
    )
  }
  initMinefield() {
    Object.assign(this.minefield, new Minefield(this.difficulty))
  }
  reStart() {
    this.initState()
    this.initMinefield()
    if (isProxy(this.minefield)) toRaw(this.minefield).disturbMine()
    else this.minefield.disturbMine()
  }
  startTiming() {
    this.timerId = setInterval(() => {
      this.state.time++
    }, 1000)
  }
  win() {
    setTimeout(() => {
      alert(`游戏胜利，用时${this.state.time}秒`)
      this.reStart()
    }, 10)
  }
  fail() {
    setTimeout(() => {
      alert("游戏结束")
      this.reStart()
    }, 10)
  }
}
