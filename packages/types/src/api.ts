// ============================================================================
// API Types
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

/**
 * Error response from API
 */
export interface ApiError {
  message: string
  code?: string
  status: number
  details?: Record<string, unknown>
}

/**
 * Pagination parameters for list requests
 */
export interface PaginationParams {
  page: number
  limit: number
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc'

/**
 * Sort parameters
 */
export interface SortParams {
  field: string
  direction: SortDirection
}

/**
 * Common filter parameters
 */
export interface FilterParams {
  search?: string
  sortBy?: string
  sortDirection?: SortDirection
  page?: number
  limit?: number
}

/**
 * Base entity with common fields
 */
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

/**
 * Entity with soft delete support
 */
export interface SoftDeletableEntity extends BaseEntity {
  deletedAt?: string | null
}
