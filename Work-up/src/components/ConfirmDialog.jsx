import React from 'react';
import '../css/Toast.css';

const ConfirmDialog = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  message = "Tem certeza que deseja cancelar sua inscrição neste projeto?",
  title = "Confirmar Cancelamento"
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="cancelar-btn" onClick={onCancel}>
            Não, manter inscrição
          </button>
          <button className="salvar-btn" onClick={onConfirm}>
            Sim, cancelar inscrição
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
