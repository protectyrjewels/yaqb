import { describe, expect, it } from "vitest"
import { QueryBuilder } from "../src/index"
import { rules, rules2, fields } from "./fixtures"

describe("QueryBuilder", () => {
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
