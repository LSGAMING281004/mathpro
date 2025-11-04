// Simple audio manager using web-hosted sound effects (royalty-free Google Actions library)
// Note: Some browsers block autoplay; sounds will play after first user interaction.

type SoundKey = 'click' | 'correct' | 'wrong' | 'levelup' | 'tick';

const SOUND_URLS: Record<SoundKey, string> = {
  click: 'https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg',
  correct: 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg',
  wrong: 'https://actions.google.com/sounds/v1/cartoon/metal_twang.ogg',
  levelup: 'https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg',
  tick: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
};

const buffers = new Map<SoundKey, HTMLAudioElement>();

export function playSound(key: SoundKey, volume = 0.25) {
  const base = buffers.get(key) ?? new Audio(SOUND_URLS[key]);
  if (!buffers.has(key)) buffers.set(key, base);
  // Clone to allow overlapping plays
  const a = base.cloneNode(true) as HTMLAudioElement;
  a.volume = volume;
  // Fire and forget
  void a.play().catch(() => {});
}


