export class Parser {
  constructor(private tokens: any[]) { }

  parse() {
    let rules = [];
    let conditions = [];
    let currentRule = this.parseRule(this.tokens);

    while (this.tokens.length > 0) {
      const cond = this.parseConditional(this.tokens);

      if (cond.err) {
        rules.push(currentRule);
        break;
      }

      conditions.push(cond);
      const nextRule = this.parseRule(this.tokens);
      rules.push(currentRule);
      currentRule = nextRule;
    }

    rules.push(currentRule);

    return { conditions, rules };
  }

  parseRule(tokens: any[]) {
    const column = this.parseColumn(tokens)
    const op = this.parseOperation(tokens)
    const value = this.parseValue(tokens)
    return { field: column, operator: op, value }
  }

  parseColumn(tokens: any[]) {
    const t = this.tokens.shift()
    if (t.token !== 'COLUMN') {
      return { err: `expected COLUMN, got ${t.token}` }
    } else {
      return t.value
    }
  }

  parseOperation(tokens: any[]) {
    const t = this.tokens.shift()
    if (t.token !== 'OP') {
      return { err: `expected OP, got ${t.token}` }
    } else {
      return t.value
    }
  }

  parseValue(tokens: any[]) {
    const t = this.tokens.shift()
    if (t.token !== 'STRING' && t.token !== 'NUMBER') {
      return { err: `expected STRING or NUMBER, got ${t.token}` }
    } else {
      return t.value
    }
  }

  parseConditional(tokens: any[]) {
    const t = this.tokens.shift()
    if (t.token == "COND") {
      return t.value
    } else {
      return { err: `expected AND or OR, got ${t.token}` }
    }
  }
}
