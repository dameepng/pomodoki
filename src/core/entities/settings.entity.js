/**
 * @typedef {Object} UserSettings
 * @property {string} userId
 * @property {number} focusDuration
 * @property {number} shortBreakDuration
 * @property {number} longBreakDuration
 * @property {string} petType
 * @property {string} ambientSound
 */

export const DEFAULT_SETTINGS = {
  focusDuration: 1500,
  shortBreakDuration: 300,
  longBreakDuration: 900,
  petType: "cat",
  ambientSound: "rain",
};
