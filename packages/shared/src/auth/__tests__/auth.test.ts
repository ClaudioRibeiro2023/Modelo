import { describe, it, expect } from 'vitest'
import { ALL_ROLES, ROLE_ADMIN, ROLE_GESTOR, ROLE_OPERADOR, ROLE_VIEWER } from '../types'
import type { UserRole, AuthUser } from '../types'

describe('Auth Types', () => {
  describe('ALL_ROLES', () => {
    it('should contain all four roles', () => {
      expect(ALL_ROLES).toHaveLength(4)
      expect(ALL_ROLES).toContain('ADMIN')
      expect(ALL_ROLES).toContain('GESTOR')
      expect(ALL_ROLES).toContain('OPERADOR')
      expect(ALL_ROLES).toContain('VIEWER')
    })

    it('should be in correct order', () => {
      expect(ALL_ROLES).toEqual(['ADMIN', 'GESTOR', 'OPERADOR', 'VIEWER'])
    })
  })

  describe('Role Constants', () => {
    it('should have correct values', () => {
      expect(ROLE_ADMIN).toBe('ADMIN')
      expect(ROLE_GESTOR).toBe('GESTOR')
      expect(ROLE_OPERADOR).toBe('OPERADOR')
      expect(ROLE_VIEWER).toBe('VIEWER')
    })

    it('should be valid UserRole types', () => {
      const roles: UserRole[] = [ROLE_ADMIN, ROLE_GESTOR, ROLE_OPERADOR, ROLE_VIEWER]
      roles.forEach(role => {
        expect(ALL_ROLES).toContain(role)
      })
    })
  })

  describe('AuthUser interface', () => {
    it('should accept valid user object', () => {
      const user: AuthUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        roles: ['ADMIN', 'VIEWER'],
      }

      expect(user.id).toBe('user-123')
      expect(user.email).toBe('test@example.com')
      expect(user.name).toBe('Test User')
      expect(user.roles).toContain('ADMIN')
      expect(user.roles).toContain('VIEWER')
    })

    it('should accept optional avatar', () => {
      const userWithAvatar: AuthUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        roles: ['VIEWER'],
        avatar: 'https://example.com/avatar.png',
      }

      expect(userWithAvatar.avatar).toBe('https://example.com/avatar.png')
    })

    it('should work without avatar', () => {
      const userWithoutAvatar: AuthUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        roles: ['VIEWER'],
      }

      expect(userWithoutAvatar.avatar).toBeUndefined()
    })
  })
})

describe('Role Utilities', () => {
  // Helper functions to test role logic
  const hasRole = (userRoles: UserRole[], role: UserRole | UserRole[]): boolean => {
    const rolesToCheck = Array.isArray(role) ? role : [role]
    return rolesToCheck.every(r => userRoles.includes(r))
  }

  const hasAnyRole = (userRoles: UserRole[], roles: UserRole[]): boolean => {
    return roles.some(r => userRoles.includes(r))
  }

  describe('hasRole', () => {
    it('should return true when user has the role', () => {
      const userRoles: UserRole[] = ['ADMIN', 'GESTOR']
      expect(hasRole(userRoles, 'ADMIN')).toBe(true)
      expect(hasRole(userRoles, 'GESTOR')).toBe(true)
    })

    it('should return false when user does not have the role', () => {
      const userRoles: UserRole[] = ['VIEWER']
      expect(hasRole(userRoles, 'ADMIN')).toBe(false)
    })

    it('should return true when user has all roles (array input)', () => {
      const userRoles: UserRole[] = ['ADMIN', 'GESTOR', 'OPERADOR']
      expect(hasRole(userRoles, ['ADMIN', 'GESTOR'])).toBe(true)
    })

    it('should return false when user is missing one role (array input)', () => {
      const userRoles: UserRole[] = ['ADMIN']
      expect(hasRole(userRoles, ['ADMIN', 'GESTOR'])).toBe(false)
    })
  })

  describe('hasAnyRole', () => {
    it('should return true when user has at least one role', () => {
      const userRoles: UserRole[] = ['VIEWER']
      expect(hasAnyRole(userRoles, ['ADMIN', 'VIEWER'])).toBe(true)
    })

    it('should return false when user has none of the roles', () => {
      const userRoles: UserRole[] = ['VIEWER']
      expect(hasAnyRole(userRoles, ['ADMIN', 'GESTOR'])).toBe(false)
    })

    it('should return true when user has multiple matching roles', () => {
      const userRoles: UserRole[] = ['ADMIN', 'GESTOR', 'OPERADOR']
      expect(hasAnyRole(userRoles, ['ADMIN', 'VIEWER'])).toBe(true)
    })

    it('should return false for empty user roles', () => {
      const userRoles: UserRole[] = []
      expect(hasAnyRole(userRoles, ['ADMIN'])).toBe(false)
    })

    it('should return false for empty required roles', () => {
      const userRoles: UserRole[] = ['ADMIN']
      expect(hasAnyRole(userRoles, [])).toBe(false)
    })
  })
})
