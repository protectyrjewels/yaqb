import { describe, expect, it } from "vitest";
import { QueryResolver } from "../src/index";

describe("Test", () => {
  it("should return empty array when input is null", () => {
    const qr = new QueryResolver();
    const result = qr._just_a_test({});

    expect(result).toEqual([]);
  });

  it("should return empty array when input is not complete", () => {
    const qr = new QueryResolver();
    const result = qr._just_a_test({ field_1: "rui" });

    expect(result).toEqual([]);
  });

  it("should return one where clause", () => {
    const qr = new QueryResolver();
    const result = qr._just_a_test({
      field_1: "Country",
      field_2: "Is not currently in",
      field_3: "USA",
    });

    expect(result).toEqual([
      { field: "Country", operator: "not_equal", value: "USA" },
    ]);
  });

  it("should return two where clause", () => {
    const qr = new QueryResolver();
    const result = qr._just_a_test({
      field_1: "Country",
      field_2: "Is currently in",
      field_3: "USA",
      field_4: "Random",
    });

    expect(result).toEqual([
      { field: "Country", operator: "equal", value: "USA" },
      { field: "region", operator: "equal", value: "Random" },
    ]);
  });
});
