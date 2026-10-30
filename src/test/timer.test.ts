import { describe, it, expect } from "vitest";
import { STEP_TIME_LIMITS, TOTAL_TIME } from "@/hooks/useActivityTimer";

describe("activity timing (60-min session, 10-min reading outside the app)", () => {
  it("in-app time totals 50 minutes", () => {
    const sum = Object.values(STEP_TIME_LIMITS).reduce((a, b) => a + b, 0);
    expect(sum).toBe(50 * 60);
    expect(TOTAL_TIME).toBe(50 * 60);
  });

  it("case video gets 5 minutes", () => {
    expect(STEP_TIME_LIMITS[1]).toBe(5 * 60);
  });

  it("interactive case study (concept check + steps 2-6) gets 45 minutes", () => {
    const caseTime = [0, 2, 3, 4, 5, 6].reduce((a, s) => a + STEP_TIME_LIMITS[s], 0);
    expect(caseTime).toBe(45 * 60);
  });
});
