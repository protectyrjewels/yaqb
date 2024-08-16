import { describe, expect, it } from "vitest";
import { QueryResolver } from "../src/index";

describe("Test", () => {
  describe("Where Clauses", () => {
    it("It should return empty array when input is null", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({});

      expect(result.whereParts).toEqual([]);
    });

    it("It should return empty array when input is not complete", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({ field_1: "rui" });

      expect(result.whereParts).toEqual([]);
    });

    it("It should return one where clause", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_1: "Country",
        field_2: "Is not currently in",
        field_3: "USA",
      });

      expect(result.whereParts).toEqual([
        { field: "Country", operator: "not_equal", value: "USA" },
      ]);
    });

    it("It should return two where clause", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_1: "Country",
        field_2: "Is currently in",
        field_3: "USA",
        field_4: "Random",
      });

      expect(result.whereParts).toEqual([
        { field: "Country", operator: "equal", value: "USA" },
        { field: "region", operator: "equal", value: "Random" },
      ]);
    });
  });

  describe("Joins", () => {
    it("It should return one join", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({});

      expect(result.joinParts).toEqual([
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
      ]);
    });

    it("It should return two joins if the value of field_5 is orders", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_5: "orders",
      });

      expect(result.joinParts).toEqual([
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
      ]);
    });

    it("It should return one join if field_7 is set up but field_6 is not", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_7: "random",
      });

      expect(result.joinParts).toEqual([
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
      ]);
    });

    it("It should return two joins if field_6 and field_7 are set up and have the same value", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_6: "same_value",
        field_7: "same_value",
      });

      expect(result.joinParts).toEqual([
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "same_value",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
      ]);
    });

    it("It should return one join if field_8 and field_10 are set up but field_9 is not", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_8: "random 1",
        field_10: "random 1",
      });

      expect(result.joinParts).toEqual([
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
      ]);
    });

    it("It should return one join if field_9 and field_10 are set up but field_8 is not", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_9: "random 1",
        field_10: "random 2",
      });

      expect(result.joinParts).toEqual([
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
      ]);
    });

    it("It should return two joins if field_8, field_9, field_10 are set up and field_8 and field_10 have the same value", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_8: "orders",
        field_9: "random 2",
        field_10: "orders",
      });

      expect(result.joinParts).toEqual([
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "random 2", operator: "equals" },
          ],
        },
      ]);
    });

    it("It should return one join if field_8, field_9, field_10 are set up and field_8 and field_10 have the different values", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_8: "random 1",
        field_9: "random 2",
        field_10: "random 3",
      });

      expect(result.joinParts).toEqual([
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
      ]);
    });

    it("It should return one join because we didn't set up field_11 and field_15", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_11: "random 1",
        field_13: "random 2",
        field_14: "random 3",
      });

      expect(result.joinParts).toEqual([
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
      ]);
    });

    it("It should return two joins because all fields are set up and field_14 and field_15 have the same value", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_11: "random 1",
        field_12: "random 2",
        field_13: "random 3",
        field_14: "same_value",
        field_15: "same_value",
      });

      expect(result.joinParts).toEqual([
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "random 1",
          conditions: [
            {
              sourceField: "random 2",
              targetField: "random 3",
              operator: "equals",
            },
          ],
        },
      ]);
    });
  });
});

describe("US 1", () => {});

describe("US 2", () => {});

describe("US 3", () => {});

describe("US 4", () => {});
