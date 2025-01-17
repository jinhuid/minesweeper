import type { Difficulty } from "./difficulty"

export const FLAG = "🚩"
export const MINE = "💣"
export const BLANK = ""

export enum BLockType {
  mine, // 地雷
  blank, // 空白
}

export type BlockContent =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | typeof BLANK
  | typeof FLAG
  | typeof MINE

export class Block {
  constructor(
    public type: BLockType,
    public content: BlockContent,
    public cleaned: boolean,
    public marked: boolean,
    public color: string,
    public distance: number
  ) {}
  get isMine() {
    return this.type === BLockType.mine
  }
  get hasContent() {
    return this.content !== BLANK
  }
}

class MineSetup {
  public blocks: Block[][]
  constructor(public difficulty: Difficulty) {
    let count = 0
    this.blocks = Array.from(Array(difficulty.size.row), () =>
      Array.from(
        Array(difficulty.size.column),
        () =>
          new Block(
            count++ < this.difficulty.size.mineNum
              ? BLockType.mine
              : BLockType.blank,
            BLANK,
            false,
            false,
            "",
            0
          )
      )
    )
  }
  getRandomBlock() {
    return this.blocks[Math.trunc(Math.random() * this.difficulty.size.row)][
      Math.trunc(Math.random() * this.difficulty.size.column)
    ]
  }
  disturbMine() {
    const rows = this.difficulty.size.row
    const cols = this.difficulty.size.column
    const total = rows * cols
    for (let i = total - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const row1 = Math.floor(i / cols)
      const col1 = i % cols
      const row2 = Math.floor(j / cols)
      const col2 = j % cols
      ;[this.blocks[row1][col1], this.blocks[row2][col2]] = [
        this.blocks[row2][col2],
        this.blocks[row1][col1],
      ]
    }
  }
}

const directions = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
  [-1, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
]

export class Minefield extends MineSetup {
  public firstClick: boolean = true
  constructor(difficulty: Difficulty) {
    super(difficulty)
  }
  passBoundCheck(x: number, y: number) {
    return (
      x >= 0 &&
      x < this.difficulty.size.row &&
      y >= 0 &&
      y < this.difficulty.size.column
    )
  }
  sweepOut(x: number, y: number) {
    const block = this.blocks[x][y]
    let loop_count = 0
    while (block.isMine || this.aroundMinesNum(x, y) > 0) {
      ;[...directions, [0, 0]]
        .filter(([dx, dy]) => this.passBoundCheck(dx + x, dy + y))
        .map(([dx, dy]) => this.blocks[dx + x][dy + y])
        .forEach(curBlock => {
          if (curBlock.isMine) {
            const block = this.getRandomBlock()
            ;[curBlock.type, block.type] = [block.type, curBlock.type]
          }
        })
      loop_count++
      if (loop_count === 99) {
        alert("炸弹太多了 请减少一些")
        break
      }
    }
  }
  expand(x: number, y: number, dis = 0) {
    if (
      !this.passBoundCheck(x, y) ||
      this.blocks[x][y].cleaned ||
      this.blocks[x][y].marked
    ) {
      return
    }
    const block = this.blocks[x][y]
    block.cleaned = true
    let num = this.aroundMinesNum(x, y)
    if (num) {
      block.content = String(num) as BlockContent
      block.color = `color${num}`
      block.distance = dis
    } else {
      directions.forEach(([dx, dy]) => {
        // let dis = Math.sqrt((x - dx) ** 2 + (y - dy) ** 2)
        this.expand(x + dx, y + dy, dis + 1)
      })
    }
  }
  aroundMinesNum(x: number, y: number) {
    return directions
      .filter(([dx, dy]) => this.passBoundCheck(dx + x, dy + y))
      .map(([dx, dy]) => [dx + x, dy + y])
      .filter(([x, y]) => this.blocks[x][y].isMine).length
  }
  isSafe(x: number, y: number) {
    return this.aroundMinesNum(x, y) === 0
  }
}
