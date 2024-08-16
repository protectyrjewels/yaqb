import type { RuleGroup } from './rules'

export interface IDialect {
  readonly id: string;
  toQuery(rules: RuleGroup, options?: any): any;
}

export class DialectManager {
  private static dialects: Map<string, IDialect> = new Map();

  static registerDialect(name: string, dialect: IDialect) {
    DialectManager.dialects.set(name, dialect);
  }

  static getDialect(name: string): IDialect | undefined {
    return DialectManager.dialects.get(name);
  }
}
