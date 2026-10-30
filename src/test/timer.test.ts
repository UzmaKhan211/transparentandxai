import { describe, it, expect } from "vitest";
import { STEP_TIME_LIMITS, TOTAL_TIME } from "@/hooks/useActivityTimer";

describe("activity timing (60-min session; 10-min reading + 5-min video outside the app)", () => {
  it("in-app case study totals 45 minutes", () => {
    const sum = Object.values(STEP_TIME_LIMITS).reduce((a, b) => a + b, 0);
    expect(sum).toBe(45 * 60);
    expect(TOTAL_TIME).toBe(45 * 60);
  });

  it("has no concept check or video step in the app", () => {
    expect(STEP_TIME_LIMITS[0]).toBeUndefined();
    expect(STEP_TIME_LIMITS[1]).toBeUndefined();
  });

  it("build and test get the most time", () => {
    const others = [2, 3, 4].map(s => STEP_TIME_LIMITS[s]);
    expect(STEP_TIME_LIMITS[5]).toBeGreaterThanOrEqual(Math.max(...others));
    expect(STEP_TIME_LIMITS[6]).toBeGreaterThanOrEqual(Math.max(...others));
  });
});
