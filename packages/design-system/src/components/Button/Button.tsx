/**
 * Button Component
 * 
 * Componente de botão reutilizável com múltiplas variantes.
 */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import clsx from 'clsx'
import './Button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visual do botão */
  variant?: ButtonVariant
  /** Tamanho do botão */
  size?: ButtonSize
  /** Ícone à esquerda */
  leftIcon?: ReactNode
  /** Ícone à direita */
  rightIcon?: ReactNode
  /** Estado de loading */
  isLoading?: boolean
  /** Ocupar largura total */
  fullWidth?: boolean
  /** Desabilitado */
  disabled?: boolean
  children?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      isLoading = false,
      fullWidth = false,
      disabled = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        className={clsx(
          'ds-button',
          `ds-button--${variant}`,
          `ds-button--${size}`,
          fullWidth && 'ds-button--full',
          isLoading && 'ds-button--loading',
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <span className="ds-button__spinner" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" className="ds-button__spinner-svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        )}
        
        {!isLoading && leftIcon && (
          <span className="ds-button__icon ds-button__icon--left">{leftIcon}</span>
        )}
        
        <span className="ds-button__text">{children}</span>
        
        {!isLoading && rightIcon && (
          <span className="ds-button__icon ds-button__icon--right">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
