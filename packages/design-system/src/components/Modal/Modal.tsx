/**
 * Modal Component
 * 
 * Dialog modal com overlay, suporte a tamanhos e fechar com ESC/click outside.
 */

import { useEffect, useRef, type ReactNode, type HTMLAttributes } from 'react'
import { X } from 'lucide-react'
import clsx from 'clsx'
import './Modal.css'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Controle de visibilidade */
  isOpen: boolean
  /** Callback ao fechar */
  onClose: () => void
  /** Título do modal */
  title?: ReactNode
  /** Descrição/subtítulo */
  description?: string
  /** Tamanho do modal */
  size?: ModalSize
  /** Mostrar botão de fechar */
  showCloseButton?: boolean
  /** Fechar ao clicar no overlay */
  closeOnOverlayClick?: boolean
  /** Fechar ao pressionar ESC */
  closeOnEsc?: boolean
  /** Footer do modal */
  footer?: ReactNode
  children?: ReactNode
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  footer,
  className,
  children,
  ...props
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle ESC key
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeOnEsc, onClose])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="ds-modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        className={clsx('ds-modal', `ds-modal--${size}`, className)}
        tabIndex={-1}
        {...props}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="ds-modal__header">
            <div className="ds-modal__header-content">
              {title && (
                <h2 id="modal-title" className="ds-modal__title">{title}</h2>
              )}
              {description && (
                <p className="ds-modal__description">{description}</p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="ds-modal__close"
                aria-label="Fechar modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="ds-modal__body">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="ds-modal__footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
