import { describe, expect, it } from "vitest"
import { DialectManager, QueryBuilder } from "../src/index"
import { rules, rules2, fields } from "./fixtures"

describe("QueryBuilder", () => {
  describe("registerDialect", () => {
    it("should register a dialect successfully", () => {
      const mockDialect = { id: "testDialect", toQuery: () => {} };
      QueryBuilder.registerDialect(mockDialect);
      const registeredDialect = DialectManager.getDialect("testDialect");

      expect(registeredDialect).toBeDefined();
      expect(registeredDialect?.id).toBe("testDialect");
    });
  });

  describe("toQuery", () => {
    it("should throw an error when querying with an unknown dialect", () => {
      const requester = () => {
        new QueryBuilder(rules, fields).toQuery("nonexistentDialect");
      };

      expect(requester).toThrowError("Unknown dialect 'nonexistentDialect'");
    });

    it("should retrieve query correctly using a registered dialect", () => {
      const mockDialect = {
        id: "usableDialect",
        toQuery: (rules, options) => ({ rules, options })
      };
      QueryBuilder.registerDialect(mockDialect);
      const qb = new QueryBuilder(rules, fields);

      const result = qb.toQuery("usableDialect", { option1: "value1" });

      expect(result).toEqual({ rules, options: { option1: "value1" } });
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
