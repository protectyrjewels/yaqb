import { describe, expect, it } from "vitest"
import { complexFields } from "./fixtures"
import { determineVisibleFields } from "../src/fields";

const determineVisibleFieldNames = (fields: any, selections: any) => {
  return determineVisibleFields(fields, selections).map(field => field.field);
}

describe("Fields", () => {
  describe('determineVisibleFields', () => {
    it('should return all fields if no conditions are present', () => {
      const fields = [
        { field: "name", label: "Name", type: "string" },
        { field: "age", label: "Age", type: "number" },
      ];
      const selections = {};
      const visibleFields = determineVisibleFieldNames(fields, selections);
      expect(visibleFields).toEqual(["name", "age"]);
    });

    it('should return only fields that match conditions', () => {
      const selections = { action: "Total Purchased Value" };
      const visibleFields = determineVisibleFieldNames(complexFields, selections);
      expect(visibleFields).toEqual(["did", "action", "operation"]);
    });

    it('should return only fields that match multiple conditions', () => {
      const selections = { action: "Total Purchased Value", operation: "Greater than" };
      const visibleFields = determineVisibleFieldNames(complexFields, selections);
      expect(visibleFields).toEqual(["did", "action", "operation", "amount", "currency"]);
    });
  });
});