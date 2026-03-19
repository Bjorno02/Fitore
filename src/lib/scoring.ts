export type LoadConfig = {
  typeMultipliers: Record<string, number>
  defaultMultiplier: number
}

export const DEFAULT_LOAD_CONFIG: LoadConfig = {
  typeMultipliers: {
    sparring: 1.5,
    drilling: 1.0,
    conditioning: 1.2,
    weights: 0.8,
  },
  defaultMultiplier: 1.0,
}

export type ReadinessConfig = {
  sleepWeight: number
  sorenessWeight: number
  stressWeight: number
  injuryPenalty: number
}

export const DEFAULT_READINESS_CONFIG: ReadinessConfig = {
  sleepWeight: 1.0,
  sorenessWeight: 1.0,
  stressWeight: 1.0,
  injuryPenalty: 30,
}

// TODO(human): implement calcLoad
export function calcLoad(
  duration: number,
  intensity: number,
  type: string,
  config: LoadConfig = DEFAULT_LOAD_CONFIG
): number {
  let multiplier = config.typeMultipliers[type] ?? config.defaultMultiplier

  return duration * intensity * multiplier
}

// TODO(human): implement calcReadiness
export function calcReadiness(
  sleep: number,
  soreness: number,
  stress: number,
  injury: boolean,
  config: ReadinessConfig = DEFAULT_READINESS_CONFIG
): number {
  throw new Error("Not implemented")
}
