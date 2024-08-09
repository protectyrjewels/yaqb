import { assert, describe, expect, it } from "vitest"
import { QueryBuilder } from "../src/index"
import { rules, rules2, fields } from "./fixtures"

describe("QueryBuilder", () => {
  describe("toQuery", () => {
    it("should convert to a mongo query", () => {
      const qb = new QueryBuilder(rules, fields);

      expect(qb.toQuery("mongo")).toEqual({
        $and: [{ name: { $eq: "John" } }, { age: { $gte: 0, $lte: 120 } }],
      });
    });

    it("should convert to a mongo query with groups", () => {
      const qb = new QueryBuilder(rules2, fields);

      const expected = {
        $and: [
          { name: { $eq: "John" } },
          { age: { $gte: 0, $lte: 120 } },
          { $or: [{ gender: { $eq: "Female" } }, { gender: { $eq: "Male" } }] },
        ],
      };
      expect(qb.toQuery("mongo")).toEqual(expected);
    });

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

    it("should convert to a parameterized postgres query", () => {
      const qb = new QueryBuilder(rules, fields);

      expect(qb.toQuery("pg", { parameterized: true })).toEqual({
        query: `"name" LIKE %L AND "age" >= %L AND "age" <= %L`,
        params: ["John", 0, 120],
      });
    });
  });

  describe("fromQuery", () => {
    it("should convert from a mongo query", () => {
      const qb = new QueryBuilder(rules, fields);

      expect(
        qb.fromQuery("mongo", {
          $and: [{ name: { $eq: "John" } }, { age: { $gte: 0, $lte: 120 } }],
        })
      ).toEqual(rules);
    });

    it("should convert from a postgres query", () => {
      const qb = new QueryBuilder(rules, fields);

      expect(
        qb.fromQuery("pg", `"name" LIKE 'John' AND "age" >= 0 AND "age" <= 120`)
      ).toEqual(rules);
    });
  });

  describe("toSentence", () => {
    it("should convert to a natural language statement", () => {
      const qb = new QueryBuilder(rules, fields);

      expect(qb.toSentence()).toEqual(
        'with name equal to "John" and with age between 0 and 120'
      );
    });

    it("should convert a grouped example to a natural language statement", () => {
      const qb = new QueryBuilder(rules2, fields);

      expect(qb.toSentence()).toEqual(
        'with name equal to "John" and with age between 0 and 120 and (with gender equal to "Female" or with gender equal to "Male")'
      );
    });
  });
});
