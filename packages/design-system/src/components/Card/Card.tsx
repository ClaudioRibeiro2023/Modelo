/**
 * Card Component
 * 
 * Container reutilizável com bordas e sombras.
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import clsx from 'clsx'
import './Card.css'

export type CardVariant = 'elevated' | 'outlined' | 'filled'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Variante visual */
  variant?: CardVariant
  /** Padding interno */
  padding?: CardPadding
  /** Interativo (hover effect) */
  interactive?: boolean
  /** Header do card */
  header?: ReactNode
  /** Footer do card */
  footer?: ReactNode
  children?: ReactNode
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'elevated',
      padding = 'md',
      interactive = false,
      header,
      footer,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'ds-card',
          `ds-card--${variant}`,
          `ds-card--padding-${padding}`,
          interactive && 'ds-card--interactive',
          className
        )}
        {...props}
      >
        {header && <div className="ds-card__header">{header}</div>}
        <div className="ds-card__body">{children}</div>
        {footer && <div className="ds-card__footer">{footer}</div>}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Sub-components
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  action?: ReactNode
}

export function CardHeader({ title, subtitle, action, className, children, ...props }: CardHeaderProps) {
  return (
    <div className={clsx('ds-card-header', className)} {...props}>
      <div className="ds-card-header__content">
        {title && <h3 className="ds-card-header__title">{title}</h3>}
        {subtitle && <p className="ds-card-header__subtitle">{subtitle}</p>}
        {children}
      </div>
      {action && <div className="ds-card-header__action">{action}</div>}
    </div>
  )
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={clsx('ds-card-footer', className)} {...props}>
      {children}
    </div>
  )
}

export default Card
