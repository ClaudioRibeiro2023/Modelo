/**
 * Types for collaborative features
 */

export interface UserPresence {
  /** User ID */
  userId: string
  /** User display name */
  name: string
  /** User avatar URL */
  avatar?: string
  /** User color for cursors/indicators */
  color: string
  /** Current status */
  status: PresenceStatus
  /** Current location in the app */
  location?: UserLocation
  /** Last activity timestamp */
  lastActive: number
  /** Custom metadata */
  metadata?: Record<string, unknown>
}

export type PresenceStatus = 'online' | 'away' | 'busy' | 'offline'

export interface UserLocation {
  /** Current page/route */
  page: string
  /** Current resource being viewed (e.g., document ID) */
  resourceId?: string
  /** Current resource type */
  resourceType?: string
  /** Cursor position (for text editing) */
  cursor?: CursorPosition
  /** Selection range (for text editing) */
  selection?: SelectionRange
}

export interface CursorPosition {
  /** Line number (for code/text) */
  line?: number
  /** Column number (for code/text) */
  column?: number
  /** X coordinate (for canvas/visual editors) */
  x?: number
  /** Y coordinate (for canvas/visual editors) */
  y?: number
}

export interface SelectionRange {
  start: CursorPosition
  end: CursorPosition
}

export interface EditingIndicator {
  /** User who is editing */
  user: UserPresence
  /** Resource being edited */
  resourceId: string
  /** Resource type */
  resourceType: string
  /** Field being edited (optional) */
  field?: string
  /** Started editing timestamp */
  startedAt: number
  /** Last update timestamp */
  updatedAt: number
}

export interface CollaborationRoom {
  /** Room ID (usually resource ID) */
  roomId: string
  /** Room type (document, form, etc.) */
  roomType: string
  /** Users currently in the room */
  users: UserPresence[]
  /** Active editing indicators */
  editingIndicators: EditingIndicator[]
}

export interface PresenceMessage {
  type: 'presence_update' | 'presence_leave' | 'editing_start' | 'editing_end' | 'cursor_move'
  userId: string
  payload: unknown
  timestamp: number
}

export interface PresenceContextType {
  /** Current user's presence */
  myPresence: UserPresence | null
  /** All users' presence (keyed by userId) */
  presences: Map<string, UserPresence>
  /** Users currently online */
  onlineUsers: UserPresence[]
  /** Users currently on the same page */
  usersOnPage: UserPresence[]
  /** Update my presence */
  updatePresence: (updates: Partial<UserPresence>) => void
  /** Update my location */
  updateLocation: (location: UserLocation) => void
  /** Set my status */
  setStatus: (status: PresenceStatus) => void
  /** Check if user is online */
  isUserOnline: (userId: string) => boolean
  /** Get user presence */
  getUserPresence: (userId: string) => UserPresence | undefined
}

export interface CollaborationContextType extends PresenceContextType {
  /** Current room */
  currentRoom: CollaborationRoom | null
  /** Join a collaboration room */
  joinRoom: (roomId: string, roomType: string) => void
  /** Leave current room */
  leaveRoom: () => void
  /** Start editing a resource */
  startEditing: (resourceId: string, resourceType: string, field?: string) => void
  /** Stop editing */
  stopEditing: () => void
  /** Update cursor position */
  updateCursor: (position: CursorPosition) => void
  /** Get users editing a specific resource */
  getUsersEditing: (resourceId: string) => EditingIndicator[]
  /** Check if someone else is editing a resource */
  isResourceBeingEdited: (resourceId: string, excludeMe?: boolean) => boolean
}

/** Generate a random color for user cursors */
export function generateUserColor(userId: string): string {
  const colors = [
    '#EF4444', // red
    '#F59E0B', // amber
    '#10B981', // emerald
    '#3B82F6', // blue
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#F97316', // orange
  ]

  // Simple hash function to get consistent color for user
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i)
    hash = hash & hash
  }

  return colors[Math.abs(hash) % colors.length]
}

/** Format "last active" time */
export function formatLastActive(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp

  if (diff < 60000) return 'agora'
  if (diff < 3600000) return `há ${Math.floor(diff / 60000)} min`
  if (diff < 86400000) return `há ${Math.floor(diff / 3600000)} h`
  return `há ${Math.floor(diff / 86400000)} dias`
}
