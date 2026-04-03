export const AMBIENT_SOUNDS = [
  { id: "rain", label: "Rain", emoji: "🌧️" },
  { id: "brown_noise", label: "Brown Noise", emoji: "🟤" },
  { id: "coffee_shop", label: "Coffee Shop", emoji: "☕" },
  { id: "forest", label: "Forest", emoji: "🌿" },
  { id: "ocean", label: "Ocean", emoji: "🌊" },
  { id: "fireplace", label: "Fireplace", emoji: "🔥" },
  { id: "mozart", label: "Mozart", emoji: "🎼" },
  { id: "none", label: "None", emoji: "🔇" },
];

export function getAmbientById(id) {
  return AMBIENT_SOUNDS.find((sound) => sound.id === id) ?? null;
}

export function getAudioPath(soundId) {
  if (soundId === "none" || soundId == null) {
    return null;
  }

  return `/sounds/${soundId}.mp3`;
}
