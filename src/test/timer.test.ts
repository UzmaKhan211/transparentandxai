import { describe, it, expect } from "vitest";
import * as timer from "@/hooks/useActivityTimer";

describe("activity timing (one shared clock, no per-step limits)", () => {
  it("the whole in-app case study gets 45 minutes", () => {
    expect(timer.TOTAL_TIME).toBe(45 * 60);
  });

  it("has no per-step time limits", () => {
    expect((timer as Record<string, unknown>).STEP_TIME_LIMITS).toBeUndefined();
  });
});
