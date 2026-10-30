// ==================== 3D Room ====================
// The whole room is plain JSON (stored in themeConfig.room). Every model is
// drawn procedurally from its catalog type, so no 3D asset files are needed.

export type PageMode = '2d' | '3d';

export type FloorMaterial = 'wood' | 'tile' | 'carpet' | 'concrete';

export type DayNightMode =
  | 'auto' // follows the viewer's local clock
  | 'cycle' // custom loop, e.g. 1 minute day / 1 minute night
  | 'day' // always day
  | 'night'; // always night

export type WallSide = 'back' | 'left';

/** The scenery outside the room */
export type LandId = 'island' | 'mars' | 'sakura' | 'crimson' | 'winter' | 'city';

/** Visual style of the room shell */
export type RoomTheme = 'classic' | 'dungeon';

export interface RoomStyle {
  /** 'dungeon' builds stone walls and floor from the Modular Dungeon models */
  theme?: RoomTheme;
  floorColor: string;
  floorMaterial: FloorMaterial;
  wallColor: string;
  trimColor: string;
  /** Room footprint in meters (x = width, z = depth) and wall height */
  width: number;
  depth: number;
  height: number;
}

export interface RoomEnvironment {
  mode: DayNightMode;
  /** Length of the day phase in 'cycle' mode, in minutes */
  dayMinutes: number;
  /** Length of the night phase in 'cycle' mode, in minutes */
  nightMinutes: number;
}

export interface RoomObjectLink {
  label: string;
  url: string;
}

export interface RoomObject {
  id: string;
  /** Catalog type id, e.g. 'bed', 'floor-lamp' */
  type: string;
  /** World position in meters; y is the base of the object */
  position: [number, number, number];
  /** Rotation around the vertical axis, in degrees */
  rotation: number;
  scale: number;
  /** Main color; falls back to the catalog default */
  color?: string;
  /** Set for wall-mounted objects */
  wall?: WallSide;
  link?: RoomObjectLink;
  /** Uploaded photo shown in a picture frame; visitors click it to view it large */
  image?: string;
  /** Product stand: the product (from the site's products block) shown on it */
  productId?: string;
}

export interface RoomMusic {
  /** Track id from the music library; null = no music */
  trackId: string | null;
  /** 0-1 */
  volume: number;
  /** Start playing when the room opens (or on the visitor's first interaction if the browser blocks it) */
  autoplay?: boolean;
}

export interface RoomConfig {
  version: 1;
  style: RoomStyle;
  environment: RoomEnvironment;
  objects: RoomObject[];
  music?: RoomMusic;
  land?: LandId;
  /** Visitors can sign the guestbook and leave gifts; on unless set to false */
  guestbook?: boolean;
}

export const DEFAULT_ROOM_STYLE: RoomStyle = {
  floorColor: '#c8a27a',
  floorMaterial: 'wood',
  wallColor: '#f3ede4',
  trimColor: '#ffffff',
  width: 6,
  depth: 6,
  height: 3.2,
};

export const DEFAULT_ROOM_ENVIRONMENT: RoomEnvironment = {
  mode: 'auto',
  dayMinutes: 1,
  nightMinutes: 1,
};

export function createDefaultRoom(): RoomConfig {
  return {
    version: 1,
    style: { ...DEFAULT_ROOM_STYLE },
    environment: { ...DEFAULT_ROOM_ENVIRONMENT },
    objects: [
      { id: 'starter-window', type: 'window', position: [0.2, 1.1, -3], rotation: 0, scale: 1, wall: 'back' },
      { id: 'starter-bed', type: 'bed', position: [-1.6, 0, -1.7], rotation: 0, scale: 1 },
      { id: 'starter-desk', type: 'desk', position: [1.6, 0, -2.45], rotation: 0, scale: 1 },
      { id: 'starter-chair', type: 'chair', position: [1.6, 0, -1.6], rotation: 180, scale: 1 },
      { id: 'starter-lamp', type: 'desk-lamp', position: [2.2, 0.76, -2.55], rotation: 0, scale: 1 },
      { id: 'starter-plant', type: 'plant', position: [2.5, 0, 0.4], rotation: 0, scale: 1 },
      { id: 'starter-rug', type: 'rug', position: [0, 0, 0.3], rotation: 0, scale: 1 },
      { id: 'starter-floor-lamp', type: 'floor-lamp', position: [-2.5, 0, 0.2], rotation: 0, scale: 1 },
    ],
  };
}

/** Fill in any missing fields so older or partial JSON still renders */
export function normalizeRoom(room: Partial<RoomConfig> | null | undefined): RoomConfig {
  if (!room || !Array.isArray(room.objects)) return createDefaultRoom();
  return {
    version: 1,
    style: { ...DEFAULT_ROOM_STYLE, ...(room.style || {}) },
    environment: { ...DEFAULT_ROOM_ENVIRONMENT, ...(room.environment || {}) },
    music: { trackId: room.music?.trackId ?? null, volume: room.music?.volume ?? 0.5, autoplay: room.music?.autoplay ?? false },
    land: room.land ?? 'island',
    guestbook: room.guestbook !== false,
    objects: room.objects
      .filter(o => o && typeof o.type === 'string' && Array.isArray(o.position))
      .map(o => ({ ...o, rotation: o.rotation ?? 0, scale: o.scale ?? 1 })),
  };
}
