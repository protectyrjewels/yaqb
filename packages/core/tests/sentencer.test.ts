import { describe, expect, it } from "vitest"
import { Sentencer } from "../src/index"

describe("Sentencer", () => {
 it("should throw an error for invalid 'between' operator value", () => {
    const rule = { field: "age", operator: "between", value: "incorrect data type" };
    const execution = () => Sentencer.translateRuleToSentence(rule);

    expect(execution).toThrow("Invalid value for 'between' operator");
  });

  it("should throw an error for unsupported operator", () => {
    const rule = { field: "age", operator: "unknown", value: 45 };
    const action = () => Sentencer.translateRuleToSentence(rule);

    expect(action).toThrow("Unsupported operator");
  });
})
