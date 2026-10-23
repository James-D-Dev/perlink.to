import type { RoomEnvironment } from '~/types/room'

export interface DaylightState {
  /** 0 = full night, 1 = full day */
  daylight: number
  /** True while the sun is up (decides sun vs moon) */
  isDay: boolean
  /** Progress of the sun (day) or moon (night) across the sky, 0..1 */
  arc: number
}

const SUNRISE = 6
const SUNSET = 18

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1)
  return t * t * (3 - 2 * t)
}

/** Daylight from the viewer's local clock: dawn ~5:30-7:00, dusk ~17:30-19:00 */
function fromClock(now: Date): DaylightState {
  const h = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600
  const daylight = smoothstep(SUNRISE - 0.5, SUNRISE + 1, h) * (1 - smoothstep(SUNSET - 0.5, SUNSET + 1, h))
  const isDay = h >= SUNRISE && h < SUNSET
  const arc = isDay
    ? (h - SUNRISE) / (SUNSET - SUNRISE)
    : ((h - SUNSET + 24) % 24) / (24 - (SUNSET - SUNRISE))
  return { daylight, isDay, arc }
}

/** Daylight for a custom loop, e.g. 1 minute day then 1 minute night */
function fromCycle(env: RoomEnvironment, now: Date): DaylightState {
  const day = Math.max(env.dayMinutes, 0.1) * 60
  const night = Math.max(env.nightMinutes, 0.1) * 60
  const period = day + night
  const t = (now.getTime() / 1000) % period
  // Cross-fade around each boundary so sunrise/sunset is gradual
  const fade = Math.min(day, night) * 0.2
  let daylight: number
  if (t < day) {
    daylight = Math.min(smoothstep(-fade, fade, t), smoothstep(-fade, fade, day - t))
  } else {
    const intoNight = t - day
    daylight = Math.max(1 - smoothstep(-fade, fade, intoNight), 1 - smoothstep(-fade, fade, night - intoNight))
  }
  const isDay = t < day
  const arc = isDay ? t / day : (t - day) / night
  return { daylight, isDay, arc }
}

export function getDaylight(env: RoomEnvironment, now: Date = new Date()): DaylightState {
  switch (env.mode) {
    case 'day':
      return { daylight: 1, isDay: true, arc: 0.45 }
    case 'night':
      return { daylight: 0, isDay: false, arc: 0.45 }
    case 'cycle':
      return fromCycle(env, now)
    default:
      return fromClock(now)
  }
}

/** Fixed state for the editor's time-of-day preview slider (hour 0-24) */
export function daylightAtHour(hour: number): DaylightState {
  const d = new Date()
  d.setHours(Math.floor(hour), Math.round((hour % 1) * 60), 0, 0)
  return fromClock(d)
}
