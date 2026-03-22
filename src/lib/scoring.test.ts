import { describe, it, expect } from "vitest"
import { calcLoad, calcReadiness, DEFAULT_LOAD_CONFIG, DEFAULT_READINESS_CONFIG } from "./scoring"

describe("calcLoad", () => {
  it("sparring is good", () => {
    expect(calcLoad(60, 5, "sparring")).toBe(450) 
  })

  it("unknown type uses default multiplier", () => {
    expect(calcLoad(80, 6, "defaultMultiplier")).toBe(480) 
  })

  it("zero intensity should be 0", () => {
    expect(calcLoad(60, 0, "drilling")).toBe(0) 
  })

})

describe("calcReadiness", () => {
  it("perfect inputs", () => {
    expect(calcReadiness(10, 1, 1, false)).toBe(99.5) 
  })

  it("terrible inputs", () => {
    expect(calcReadiness(0, 100, 100, false)).toBe(40) 
  })

  it("injury check", () => {
    expect(calcReadiness(10, 10, 13, true)).toBe(64.4) 
  })
})
