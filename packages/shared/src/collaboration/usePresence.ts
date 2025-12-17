/**
 * React hooks for presence tracking
 */

import { useContext, useEffect, useCallback, useMemo } from 'react'
import { PresenceContext } from './presenceContext'
import type { UserPresence, PresenceStatus } from './types'

/**
 * Hook to access presence context
 */
export function usePresence() {
  return useContext(PresenceContext)
}

/**
 * Hook to get online users count
 */
export function useOnlineCount(): number {
  const { onlineUsers } = usePresence()
  return onlineUsers.length
}

/**
 * Hook to get users on the current page
 */
export function useUsersOnPage(): UserPresence[] {
  const { usersOnPage } = usePresence()
  return usersOnPage
}

/**
 * Hook to check if a specific user is online
 */
export function useIsUserOnline(userId: string): boolean {
  const { isUserOnline } = usePresence()
  return isUserOnline(userId)
}

/**
 * Hook to get a specific user's presence
 */
export function useUserPresence(userId: string): UserPresence | undefined {
  const { getUserPresence } = usePresence()
  return getUserPresence(userId)
}

/**
 * Hook to update location when route changes
 */
export function useLocationTracking(page: string, resourceId?: string, resourceType?: string) {
  const { updateLocation } = usePresence()

  useEffect(() => {
    updateLocation({
      page,
      resourceId,
      resourceType,
    })
  }, [page, resourceId, resourceType, updateLocation])
}

/**
 * Hook to manage my presence status
 */
export function useMyStatus() {
  const { myPresence, setStatus } = usePresence()

  const setOnline = useCallback(() => setStatus('online'), [setStatus])
  const setAway = useCallback(() => setStatus('away'), [setStatus])
  const setBusy = useCallback(() => setStatus('busy'), [setStatus])
  const setOffline = useCallback(() => setStatus('offline'), [setStatus])

  return {
    currentStatus: myPresence?.status || 'offline',
    setOnline,
    setAway,
    setBusy,
    setOffline,
    setStatus,
  }
}

/**
 * Hook to get presence avatars for a list of users
 */
export function usePresenceAvatars(userIds: string[]): (UserPresence | undefined)[] {
  const { getUserPresence } = usePresence()

  return useMemo(() => {
    return userIds.map(id => getUserPresence(id))
  }, [userIds, getUserPresence])
}

/**
 * Hook to filter users by status
 */
export function useUsersByStatus(status: PresenceStatus): UserPresence[] {
  const { onlineUsers } = usePresence()

  return useMemo(() => {
    return onlineUsers.filter(user => user.status === status)
  }, [onlineUsers, status])
}
