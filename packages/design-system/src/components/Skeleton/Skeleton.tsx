/**
 * Skeleton Component
 * 
 * Placeholder de loading para conteúdo.
 */

import { type HTMLAttributes } from 'react'
import clsx from 'clsx'
import './Skeleton.css'

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Variante do skeleton */
  variant?: SkeletonVariant
  /** Largura (CSS value) */
  width?: string | number
  /** Altura (CSS value) */
  height?: string | number
  /** Animação de pulse */
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className,
  style,
  ...props
}: SkeletonProps) {
  const styles = {
    ...style,
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  return (
    <div
      className={clsx(
        'ds-skeleton',
        `ds-skeleton--${variant}`,
        animation !== 'none' && `ds-skeleton--${animation}`,
        className
      )}
      style={styles}
      aria-hidden="true"
      {...props}
    />
  )
}

// Presets
export function SkeletonText({ lines = 3, className, ...props }: SkeletonProps & { lines?: number }) {
  return (
    <div className={clsx('ds-skeleton-text', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '60%' : '100%'}
          {...props}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar({ size = 40, ...props }: SkeletonProps & { size?: number }) {
  return <Skeleton variant="circular" width={size} height={size} {...props} />
}

export function SkeletonCard({ className, ...props }: SkeletonProps) {
  return (
    <div className={clsx('ds-skeleton-card', className)} {...props}>
      <Skeleton variant="rectangular" height={200} />
      <div className="ds-skeleton-card__content">
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
        <SkeletonText lines={2} />
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5, columns = 4, className, ...props }: SkeletonProps & { rows?: number; columns?: number }) {
  return (
    <div className={clsx('ds-skeleton-table', className)} {...props}>
      {/* Header */}
      <div className="ds-skeleton-table__row ds-skeleton-table__header">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" height={20} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="ds-skeleton-table__row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" height={16} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Skeleton
