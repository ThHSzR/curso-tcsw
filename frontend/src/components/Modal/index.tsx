import { ReactNode } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  confirmClass?: string;
  children: ReactNode;
}

export function Modal({ title, onClose, onConfirm, confirmLabel = 'Salvar', confirmClass = 'btn btn-primary', children }: ModalProps) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}><i className="bi bi-x"></i></button>
        </div>
        <div className="modal-body">{children}</div>
        {onConfirm && (
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button className={confirmClass} onClick={onConfirm}>{confirmLabel}</button>
          </div>
        )}
      </div>
    </div>
  );
}
