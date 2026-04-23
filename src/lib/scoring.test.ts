import { describe, it, expect } from "vitest"
import {
  calcLoad,
  calcReadiness,
  gymSettingsToConfig,
  DEFAULT_LOAD_CONFIG,
  DEFAULT_READINESS_CONFIG,
} from "./scoring"

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

describe("gymSettingsToConfig", () => {
  it("returns code defaults when passed null", () => {
    const { loadConfig, readinessConfig } = gymSettingsToConfig(null)
    expect(loadConfig).toEqual(DEFAULT_LOAD_CONFIG)
    expect(readinessConfig).toEqual(DEFAULT_READINESS_CONFIG)
  })

  it("maps a settings row to the correct config shapes", () => {
    const row = {
      multiplierSparring: 2.0,
      multiplierDrilling: 1.5,
      multiplierConditioning: 1.1,
      multiplierWeights: 0.6,
      sleepWeight: 1.5,
      sorenessWeight: 0.5,
      stressWeight: 0.4,
      injuryPenalty: 40,
    }
    const { loadConfig, readinessConfig } = gymSettingsToConfig(row)
    expect(loadConfig.typeMultipliers.sparring).toBe(2.0)
    expect(loadConfig.typeMultipliers.drilling).toBe(1.5)
    expect(loadConfig.typeMultipliers.conditioning).toBe(1.1)
    expect(loadConfig.typeMultipliers.weights).toBe(0.6)
    expect(loadConfig.defaultMultiplier).toBe(DEFAULT_LOAD_CONFIG.defaultMultiplier)
    expect(readinessConfig.sleepWeight).toBe(1.5)
    expect(readinessConfig.sorenessWeight).toBe(0.5)
    expect(readinessConfig.stressWeight).toBe(0.4)
    expect(readinessConfig.injuryPenalty).toBe(40)
  })

  it("custom config actually changes calcLoad output", () => {
    const row = {
      multiplierSparring: 3.0,
      multiplierDrilling: 1.0,
      multiplierConditioning: 1.2,
      multiplierWeights: 0.8,
      sleepWeight: 1.0,
      sorenessWeight: 0.3,
      stressWeight: 0.2,
      injuryPenalty: 30,
    }
    const { loadConfig } = gymSettingsToConfig(row)
    expect(calcLoad(60, 5, "sparring", loadConfig)).toBe(900)
  })
})
