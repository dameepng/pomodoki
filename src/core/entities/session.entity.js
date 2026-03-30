/**
 * @typedef {Object} PomodoroSession
 * @property {string} id
 * @property {string} userId
 * @property {string|null} taskId
 * @property {number} duration
 * @property {string} type
 * @property {Date} completedAt
 */

export const SESSION_TYPES = {
  FOCUS: "focus",
  SHORT_BREAK: "short_break",
  LONG_BREAK: "long_break",
};
