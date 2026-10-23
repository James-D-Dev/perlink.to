// Background music for 3D rooms. Tracks are from Pixabay (Pixabay Content
// License) and are served from /public/music; they stream only, no downloads.

export interface RoomMusicTrack {
  id: string
  title: string
  artist: string
  duration: string
  /** File under /public/music */
  src: string
  /** Original Pixabay page, used for credits */
  sourceUrl: string
  mood: string
  /** Registered with YouTube Content ID by the artist */
  contentId?: boolean
}

export const ROOM_MUSIC: RoomMusicTrack[] = [
  { id: 'fun-game', title: 'Fun Game', artist: 'Cyberwave-Orchestra', duration: '1:02', mood: 'Upbeat', src: '/music/fun-game.mp3', sourceUrl: 'https://pixabay.com/music/upbeat-fun-game-upbeat-happy-video-game-music-249646/', contentId: true },
  { id: 'happy-runner', title: 'Happy Runner', artist: 'Cyberwave-Orchestra', duration: '1:13', mood: 'Energetic', src: '/music/happy-runner.mp3', sourceUrl: 'https://pixabay.com/music/happy-childrens-tunes-happy-runner-fast-paced-kids-game-music-loop-248099/' },
  { id: 'puzzle-casual', title: 'Puzzle & Casual', artist: 'SounovaMusic', duration: '1:28', mood: 'Light', src: '/music/puzzle-casual.mp3', sourceUrl: 'https://pixabay.com/music/happy-childrens-tunes-puzzle-amp-casual-game-music-460543/' },
  { id: 'pixel-plains', title: 'Pixel Plains', artist: 'Junipersona', duration: '2:29', mood: 'Chiptune', src: '/music/pixel-plains.mp3', sourceUrl: 'https://pixabay.com/music/video-games-pixel-plains-158773/' },
  { id: 'happy-8bit', title: 'So Happy With My 8-bit Game', artist: 'DJARTMUSIC', duration: '1:15', mood: '8-bit', src: '/music/happy-8bit.mp3', sourceUrl: 'https://pixabay.com/music/video-games-so-happy-with-my-8-bit-game-301275/' },
  { id: 'marimba-travel', title: 'Marimba Travel', artist: 'Denis-Pavlov-Music', duration: '1:27', mood: 'Tropical', src: '/music/marimba-travel.mp3', sourceUrl: 'https://pixabay.com/music/video-games-marimba-tropical-african-travel-game-197517/' },
  { id: 'fairytale-quest', title: 'Fairytale Quest', artist: 'Good_B_Music', duration: '2:21', mood: 'Dreamy', src: '/music/fairytale-quest.mp3', sourceUrl: 'https://pixabay.com/music/fantasy-dreamy-childrens-fairytail-quest-for-game-394561/' },
  { id: 'playful-kids', title: 'Playful & Carefree', artist: 'REDproductions', duration: '2:11', mood: 'Playful', src: '/music/playful-kids.mp3', sourceUrl: 'https://pixabay.com/music/upbeat-fun-kids-playful-comic-carefree-game-happy-positive-music-57026/' },
  { id: 'game-background', title: 'Game Background', artist: 'MaksymMalko', duration: '3:11', mood: 'Chill', src: '/music/game-background.mp3', sourceUrl: 'https://pixabay.com/music/video-games-game-gaming-background-music-385611/' },
]

/** Turn on once the mp3 files are in /public/music */
export const ROOM_MUSIC_ENABLED = false

export const MUSIC_BY_ID: Record<string, RoomMusicTrack> = Object.fromEntries(ROOM_MUSIC.map(t => [t.id, t]))
