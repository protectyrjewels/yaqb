import { describe, expect, it } from "vitest"
import { Sentencer } from "../src/index"

describe("Sentencer", () => {
  it("should translate a rule to a sentence", () => {
    const rule = { field: "age", operator: "between", value: [20] };
    const result = Sentencer.translateRuleToSentence(rule);

    expect(result).toEqual("with age between 20");
  });

  it("should throw an error for unsupported operator", () => {
    const rule = { field: "age", operator: "unknown", value: [45] };
    const action = () => Sentencer.translateRuleToSentence(rule);

    expect(action).toThrow("Unsupported operator");
  });
})
