import { getFirstGroup } from './utils'

export class Tokenizer {
  readonly conditions: string[] = ["AND", "OR"]
  readonly reserved: string[] = ["LIKE", "NOT"];

  readonly columnRe = /"([^"]*)"/g
  readonly valRe = /'([^']*)'/g
  readonly numberRe = /^-?\d*\.?\d*$/

  parse(query: string) {
    const parts = query.split(" ")
    if (!parts) { return null }
    return this.parseExpression(parts).filter(t => t)
  }

  parseExpression(parts: string[]) {
    const tokens = []
    for (const part of parts) {
      const c = this.lookup(part)
      switch (c) {
        case "\"": {
          tokens.push(this.parseColumn(part))
          break
        }
        case "'": {
          tokens.push(this.parseString(part))
          break
        }
        case ">": {
          if (this.lookup(part, 2) === "=") {
            tokens.push({ token: "OP", value: "GTE" })
          } else {
            tokens.push({ token: "OP", value: "GT" })
          }
          break
        }
        case "<": {
          if (this.lookup(part, 2) === "=") {
            tokens.push({ token: "OP", value: "LTE" })
          } else {
            tokens.push({ token: "OP", value: "LT" })
          }
          break
        }
        default: {
          const n = this.parseNumber(part)
          if (n) {
            tokens.push(n)
          } else {
            const t = this.parseReserved(part)
            if (t) {
              tokens.push(t)
            } else {
              const c = this.parseCondition(part)
              if (c) {
                tokens.push(c)
              }
            }
          }
        }
      }
    }
    return tokens
  }

  parseColumn(s: string) {
    const r = getFirstGroup(this.columnRe, s)
    if (!r) { return null }
    return { token: "COLUMN", value: r[0] }
  }

  parseString(s: string) {
    const r = getFirstGroup(this.valRe, s)
    if (!r) { return null }
    return { token: "STRING", value: r[0] }
  }

  parseCondition(s: string) {
    if (!this.conditions.includes(s)) return null
    return { token: "COND", value: s }
  }

  parseReserved(s: string) {
    if (!this.reserved.includes(s)) return null
    return { token: "OP", value: s }
  }

  parseNumber(s: string) {
    const r = this.numberRe.exec(s)
    if (!r) { return null }
    return { token: "NUMBER", value: Number(r[0]) }
  }

  private lookup(s: string, n: number = 1) {
    return s[n - 1]
  }
}
