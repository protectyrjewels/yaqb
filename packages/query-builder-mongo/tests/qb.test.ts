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
  });
});
