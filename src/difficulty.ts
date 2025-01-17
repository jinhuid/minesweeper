import type { Game } from "./game"

export const difficulty_level = {
  easy: { row: 9, column: 9, mineNum: 10 },
  middle: { row: 16, column: 16, mineNum: 40 },
  hard: { row: 16, column: 30, mineNum: 99 },
  extreme: { row: 24, column: 45, mineNum: 230 },
  nightmare: { row: 50, column: 50, mineNum: 580 },
  legend: { row: 100, column: 100, mineNum: 2200 },
} as const

const CUSTOM = "custom" as const
export type Custom = typeof CUSTOM

export type Custom_Difficulty = { row: number; column: number; mineNum: number }

export type DifficultyLevel = typeof difficulty_level
export type DifficultyKey = keyof DifficultyLevel
export type DifficultyList<T extends DifficultyKey> = {
  [K in T]: DifficultyLevel[K]
}[T]

export class Difficulty<T extends DifficultyKey = DifficultyKey> {
  static defaultDifficulty = "easy" as const
  public size: DifficultyLevel[DifficultyKey] | Custom_Difficulty
  public difficultyList = new Set(Object.keys(difficulty_level))
  public difficultyName: T | Custom
  public custom_difficulty!: Custom_Difficulty
  public Storage = new Storage()
  constructor(public game: Game) {
    this.difficultyName = this.Storage.get_difficultyName() as T | Custom
    this.difficultyList.add(this.difficultyName)
    if (this.difficultyName === CUSTOM) {
      this.custom_difficulty = this.Storage.get_size() as Custom_Difficulty
    }
    this.size = this.Storage.get_size() as
      | DifficultyLevel[DifficultyKey]
      | Custom_Difficulty
  }
  setDifficulty(difficultyName: T | Custom) {
    if (difficultyName === CUSTOM) {
      if (this.custom_difficulty) {
        Object.assign(this.size, {
          row: this.custom_difficulty.row,
          column: this.custom_difficulty.column,
          mineNum: this.custom_difficulty.mineNum,
        })
      }
    } else {
      Object.assign(this.size, { ...difficulty_level[difficultyName] })
    }
    this.difficultyName = difficultyName
    this.Storage.save(this.size, this.difficultyName)
    this.game.reStart()
  }
  customDifficulty(difficulty: Custom_Difficulty) {
    this.custom_difficulty = difficulty
    this.difficultyList.add(CUSTOM)
    this.setDifficulty(CUSTOM)
  }
}

class Storage {
  get_difficultyName() {
    if (localStorage.getItem("minesweeper")) {
      return Object.keys(
        JSON.parse(localStorage.getItem("minesweeper")!)
      )[0] as "custom"
    }
    return Difficulty.defaultDifficulty
  }
  get_size() {
    if (localStorage.getItem("minesweeper")) {
      return Object.values(
        JSON.parse(localStorage.getItem("minesweeper")!)
      )[0] as DifficultyLevel[DifficultyKey] | Custom_Difficulty
    }
    return { ...difficulty_level[this.get_difficultyName() as DifficultyKey] }
  }
  save(size: Custom_Difficulty, difficultyName: DifficultyKey | Custom) {
    localStorage.setItem(
      "minesweeper",
      JSON.stringify({ [difficultyName]: size })
    )
  }
}
