/**
 * React hooks for collaboration features
 */

import { useContext, useEffect, useCallback, useMemo, useState } from 'react'
import { CollaborationContext } from './presenceContext'
import type { UserPresence, CursorPosition } from './types'

/**
 * Hook to access full collaboration context
 */
export function useCollaboration() {
  return useContext(CollaborationContext)
}

/**
 * Hook to join a collaboration room
 */
export function useCollaborationRoom(roomId: string, roomType: string) {
  const { currentRoom, joinRoom, leaveRoom } = useCollaboration()

  useEffect(() => {
    joinRoom(roomId, roomType)
    return () => {
      leaveRoom()
    }
  }, [roomId, roomType, joinRoom, leaveRoom])

  return currentRoom
}

/**
 * Hook for editing indicators on a resource
 */
export function useEditingIndicators(resourceId: string) {
  const { getUsersEditing, isResourceBeingEdited, startEditing, stopEditing } = useCollaboration()

  const editors = useMemo(() => getUsersEditing(resourceId), [resourceId, getUsersEditing])
  const isBeingEdited = isResourceBeingEdited(resourceId, true)

  const beginEditing = useCallback(
    (field?: string) => {
      startEditing(resourceId, 'document', field)
    },
    [resourceId, startEditing]
  )

  return {
    editors,
    isBeingEdited,
    editorCount: editors.length,
    beginEditing,
    stopEditing,
  }
}

/**
 * Hook to show "X is editing..." indicator
 */
export function useIsEditing(resourceId: string): { isEditing: boolean; editors: UserPresence[] } {
  const { getUsersEditing } = useCollaboration()

  const indicators = useMemo(() => getUsersEditing(resourceId), [resourceId, getUsersEditing])

  return {
    isEditing: indicators.length > 0,
    editors: indicators.map(i => i.user),
  }
}

/**
 * Hook for field-level editing locks
 */
export function useFieldEditing(resourceId: string, fieldName: string) {
  const { getUsersEditing, startEditing, stopEditing, myPresence } = useCollaboration()
  const [isEditingField, setIsEditingField] = useState(false)

  const editors = useMemo(() => {
    return getUsersEditing(resourceId).filter(e => e.field === fieldName)
  }, [resourceId, fieldName, getUsersEditing])

  const otherEditors = useMemo(() => {
    return editors.filter(e => e.user.userId !== myPresence?.userId)
  }, [editors, myPresence])

  const isLocked = otherEditors.length > 0

  const startFieldEditing = useCallback(() => {
    if (!isLocked) {
      startEditing(resourceId, 'field', fieldName)
      setIsEditingField(true)
    }
  }, [isLocked, resourceId, fieldName, startEditing])

  const stopFieldEditing = useCallback(() => {
    stopEditing()
    setIsEditingField(false)
  }, [stopEditing])

  return {
    isLocked,
    lockedBy: otherEditors[0]?.user,
    isEditingField,
    startFieldEditing,
    stopFieldEditing,
  }
}

/**
 * Hook for cursor tracking
 */
export function useCursorTracking() {
  const { updateCursor, currentRoom } = useCollaboration()

  const cursors = useMemo(() => {
    if (!currentRoom) return []
    return currentRoom.users
      .filter(u => u.location?.cursor)
      .map(u => ({
        userId: u.userId,
        name: u.name,
        color: u.color,
        cursor: u.location!.cursor!,
      }))
  }, [currentRoom])

  const moveCursor = useCallback(
    (position: CursorPosition) => {
      updateCursor(position)
    },
    [updateCursor]
  )

  return {
    cursors,
    moveCursor,
  }
}

/**
 * Hook to get collaborators in current room
 */
export function useRoomCollaborators(): UserPresence[] {
  const { currentRoom, myPresence } = useCollaboration()

  return useMemo(() => {
    if (!currentRoom) return []
    return currentRoom.users.filter(u => u.userId !== myPresence?.userId)
  }, [currentRoom, myPresence])
}

/**
 * Hook to format editor names for display
 * Returns: "João está editando" or "João e Maria estão editando" or "3 pessoas estão editando"
 */
export function useEditingMessage(resourceId: string): string | null {
  const { editors } = useIsEditing(resourceId)

  return useMemo(() => {
    if (editors.length === 0) return null
    if (editors.length === 1) {
      return `${editors[0].name} está editando`
    }
    if (editors.length === 2) {
      return `${editors[0].name} e ${editors[1].name} estão editando`
    }
    return `${editors.length} pessoas estão editando`
  }, [editors])
}

/**
 * Hook to show typing indicator
 */
export function useTypingIndicator(_roomId: string) {
  const [typingUsers] = useState<Map<string, UserPresence>>(new Map())

  // In a real implementation, this would listen to WebSocket events
  // For now, we just provide the interface

  const setTyping = useCallback((_isTyping: boolean) => {
    // Would send WebSocket message - implement with WebSocket integration
  }, [])

  const typingMessage = useMemo(() => {
    const users = Array.from(typingUsers.values())
    if (users.length === 0) return null
    if (users.length === 1) return `${users[0].name} está digitando...`
    if (users.length === 2) return `${users[0].name} e ${users[1].name} estão digitando...`
    return `${users.length} pessoas estão digitando...`
  }, [typingUsers])

  return {
    typingUsers: Array.from(typingUsers.values()),
    typingMessage,
    setTyping,
  }
}
