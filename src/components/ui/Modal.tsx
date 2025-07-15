/* eslint-disable react-hooks/exhaustive-deps */
// src/components/ui/Modal.tsx
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { CloseSquare } from "iconsax-react";
import Button from "../Button";
// import Button from './Button';

export interface ModalRef {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

interface ModalProps {
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

const Modal = forwardRef<ModalRef, ModalProps>(
  (
    {
      title,
      children,
      size = "md",
      onClose,
      closeOnOverlayClick = true,
      closeOnEsc = true,
      showCloseButton = true,
      footer,
      className = "",
      overlayClassName = "",
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    // Expose modal control methods
    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      isOpen,
    }));

    // Handle ESC key
    useEffect(() => {
      if (!closeOnEsc || !isOpen) return;

      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          handleClose();
        }
      };

      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }, [closeOnEsc, isOpen]);

    // Prevent body scroll when modal is open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }

      return () => {
        document.body.style.overflow = "";
      };
    }, [isOpen]);

    const handleClose = () => {
      setIsOpen(false);
      onClose?.();
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        handleClose();
      }
    };

    const sizeClasses = {
      sm: "max-w-md",
      md: "max-w-lg",
      lg: "max-w-2xl",
      xl: "max-w-4xl",
      full: "max-w-7xl mx-4",
    };

    if (!isOpen) return null;

    return (
      <>
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${overlayClassName}`}
          onClick={handleOverlayClick}
        />

        {/* Modal Container */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className={`
              bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden
              ${sizeClasses[size]}
              ${className}
              animate-in fade-in-0 zoom-in-95 duration-200
            `}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                {title && (
                  <h2 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h2>
                )}

                {showCloseButton && (
                  <Button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100"
                    aria-label="Fermer"
                  >
                    <CloseSquare size={20} color="#6B7280" />
                  </Button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="max-h-[70vh] overflow-y-auto">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                {footer}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
);

Modal.displayName = "Modal";

export { Modal };
export default Modal;
