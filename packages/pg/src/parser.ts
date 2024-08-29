export class Parser {
  constructor(private tokens: any[]) { }

  parse() {
    let rules = [];
    let conditions = [];
    let currentRule = this.parseRule();

    while (this.tokens.length > 0) {
      const cond = this.parseConditional();

      if (cond.err) {
        rules.push(currentRule);
        break;
      }

      conditions.push(cond);
      const nextRule = this.parseRule();
      rules.push(currentRule);
      currentRule = nextRule;
    }

    rules.push(currentRule);

    return { conditions, rules };
  }

  parseRule() {
    const column = this.parseColumn()
    const op = this.parseOperation()
    const value = this.parseValue()
    return { field: column, operator: op, value }
  }

  parseColumn() {
    const t = this.tokens.shift()
    if (t.token !== 'COLUMN') {
      return { err: `expected COLUMN, got ${t.token}` }
    } else {
      return t.value
    }
  }

  parseOperation() {
    const t = this.tokens.shift()
    if (t.token !== 'OP') {
      return { err: `expected OP, got ${t.token}` }
    } else {
      return t.value
    }
  }

  parseValue() {
    const t = this.tokens.shift()
    if (t.token !== 'STRING' && t.token !== 'NUMBER') {
      return { err: `expected STRING or NUMBER, got ${t.token}` }
    } else {
      return t.value
    }
  }

  parseConditional() {
    const t = this.tokens.shift()
    if (t.token == "COND") {
      return t.value
    } else {
      return { err: `expected AND or OR, got ${t.token}` }
    }
  }
}
