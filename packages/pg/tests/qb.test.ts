import { describe, expect, it } from "vitest"
import { QueryBuilder } from "../src/index"
import { rules, rules2, fields, rules3 } from "./fixtures"

describe("QueryBuilder", () => {
  describe("toQuery", () => {
    it("should convert to a postgres query", () => {
      const qb = new QueryBuilder(rules, fields);

      expect(qb.toQuery("pg", { parameterized: false })).toEqual(
        `"name" LIKE 'John' AND "age" >= 0 AND "age" <= 120`
      );
    });

    it("should convert to a postgres query with groups", () => {
      const qb = new QueryBuilder(rules2, fields);

      expect(qb.toQuery("pg")).toEqual(
        `"name" LIKE 'John' AND "age" >= 0 AND "age" <= 120 AND ("gender" LIKE 'Female' OR "gender" LIKE 'Male')`
      );
    });

    it('should convert to a postgres query with "gt" operator', () => {
      const qb = new QueryBuilder(rules3, fields);

      expect(qb.toQuery("pg")).toEqual(
        `"name" LIKE 'John' AND "age" > 45`
      );
    });

    it("should convert to a parameterized postgres query", () => {
      const qb = new QueryBuilder(rules, fields);

      expect(qb.toQuery("pg", { parameterized: true })).toEqual({
        query: `"name" LIKE %L AND "age" >= %L AND "age" <= %L`,
        params: ["John", 0, 120],
      });
    });
  });

  describe("fromQuery", () => {
    it("should convert from a postgres query", () => {
      const qb = new QueryBuilder(rules, fields);

      expect(
        qb.fromQuery("pg", `"name" LIKE 'John' AND "age" >= 0 AND "age" <= 120`)
      ).toEqual({
        conditions: ['AND', 'AND'],
        rules: [
          { field: 'name', operator: 'LIKE', value: 'John' },
          { field: 'age', operator: 'GTE', value: 0 },
          { field: 'age', operator: 'LTE', value: 120 },
        ]
      })
    });
  });
});
