/**
 * React Context for presence and collaboration
 */

import { createContext } from 'react'
import type { PresenceContextType, CollaborationContextType } from './types'

const noop = () => {}

/**
 * Default presence context value
 */
const defaultPresenceContext: PresenceContextType = {
  myPresence: null,
  presences: new Map(),
  onlineUsers: [],
  usersOnPage: [],
  updatePresence: noop,
  updateLocation: noop,
  setStatus: noop,
  isUserOnline: () => false,
  getUserPresence: () => undefined,
}

/**
 * Default collaboration context value
 */
const defaultCollaborationContext: CollaborationContextType = {
  ...defaultPresenceContext,
  currentRoom: null,
  joinRoom: noop,
  leaveRoom: noop,
  startEditing: noop,
  stopEditing: noop,
  updateCursor: noop,
  getUsersEditing: () => [],
  isResourceBeingEdited: () => false,
}

/**
 * Presence Context (simpler, just presence tracking)
 */
export const PresenceContext = createContext<PresenceContextType>(defaultPresenceContext)

/**
 * Collaboration Context (full collaboration features)
 */
export const CollaborationContext = createContext<CollaborationContextType>(
  defaultCollaborationContext
)

/**
 * WebSocket message types for collaboration
 */
export const WS_MESSAGE_TYPES = {
  // Presence
  PRESENCE_JOIN: 'presence:join',
  PRESENCE_LEAVE: 'presence:leave',
  PRESENCE_UPDATE: 'presence:update',
  PRESENCE_SYNC: 'presence:sync',

  // Location
  LOCATION_UPDATE: 'location:update',

  // Editing
  EDITING_START: 'editing:start',
  EDITING_END: 'editing:end',
  EDITING_SYNC: 'editing:sync',

  // Cursor
  CURSOR_MOVE: 'cursor:move',

  // Room
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  ROOM_SYNC: 'room:sync',
} as const

export type WSMessageType = (typeof WS_MESSAGE_TYPES)[keyof typeof WS_MESSAGE_TYPES]

/**
 * Create a WebSocket message for collaboration
 */
export function createWSMessage(type: WSMessageType, payload: unknown): string {
  return JSON.stringify({
    type,
    payload,
    timestamp: Date.now(),
  })
}

/**
 * Parse a WebSocket message
 */
export function parseWSMessage(
  data: string
): { type: WSMessageType; payload: unknown; timestamp: number } | null {
  try {
    const parsed = JSON.parse(data)
    if (parsed && typeof parsed.type === 'string') {
      return parsed
    }
  } catch {
    // Invalid JSON
  }
  return null
}

/**
 * Idle detection - mark user as away after inactivity
 */
export class IdleDetector {
  private timeout: ReturnType<typeof setTimeout> | null = null
  private readonly idleTime: number
  private readonly onIdle: () => void
  private readonly onActive: () => void

  constructor(options: { idleTime?: number; onIdle: () => void; onActive: () => void }) {
    this.idleTime = options.idleTime || 5 * 60 * 1000 // 5 minutes default
    this.onIdle = options.onIdle
    this.onActive = options.onActive
  }

  start(): void {
    if (typeof window === 'undefined') return

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart']

    const resetTimer = () => {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.onActive()
      this.timeout = setTimeout(() => {
        this.onIdle()
      }, this.idleTime)
    }

    events.forEach(event => {
      document.addEventListener(event, resetTimer, { passive: true })
    })

    // Start the timer
    resetTimer()
  }

  stop(): void {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }
}

/**
 * Throttle function for cursor updates
 * Named differently to avoid conflict with utils/helpers throttle
 */
export function throttleCursor<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    const now = Date.now()
    const timeSinceLastCall = now - lastCall

    if (timeSinceLastCall >= delay) {
      lastCall = now
      fn(...args)
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now()
        timeoutId = null
        fn(...args)
      }, delay - timeSinceLastCall)
    }
  }
}
