import React, { useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";

function Projetos() {
  const [openDialog, setOpenDialog] = useState(false);

  const handleCancelClick = () => {
    setOpenDialog(true);
  };

  const handleConfirmCancel = () => {
    setOpenDialog(false);
    // Aqui vai a lógica real de cancelar a inscrição
    console.log("Inscrição cancelada!");
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <h2>Meus Projetos</h2>

      <button className="cancel-btn" onClick={handleCancelClick}>
        Cancelar inscrição
      </button>

      {openDialog && (
        <ConfirmDialog
          message="Tem certeza que deseja cancelar sua inscrição?"
          onConfirm={handleConfirmCancel}
          onCancel={handleCloseDialog}
        />
      )}
    </div>
  );
}

export default Projetos;
