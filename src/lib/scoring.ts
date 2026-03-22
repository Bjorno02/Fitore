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
  sorenessWeight: .3,
  stressWeight: .2,
  injuryPenalty: 30,
}


export function calcLoad(
  duration: number,
  intensity: number,
  type: string,
  config: LoadConfig = DEFAULT_LOAD_CONFIG
): number {
  let multiplier = config.typeMultipliers[type] ?? config.defaultMultiplier

  return duration * intensity * multiplier
}

export function calcReadiness(
  sleep: number,
  soreness: number,
  stress: number,
  injury: boolean,
  config: ReadinessConfig = DEFAULT_READINESS_CONFIG
): number {
  const sleepScore = (10 - sleep) * config.sleepWeight
  const sorenessScore = soreness * config.sorenessWeight
  const stressScore = stress * config.stressWeight
  const injuryScore = injury ? config.injuryPenalty: 0

  return Math.max(0, Math.min(100, 100 - sleepScore - sorenessScore - stressScore - injuryScore))

}
