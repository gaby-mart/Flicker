import { useEffect } from "react";
import "../css/ToastNotification.css";

import checkImg from "../../assets/images/check.svg"
import alertImg from "../../assets/images/alert.svg"

export default function ToastNotification({
  message,
  isOpen,
  onClose,
  duration = 3000,
  type = "success" // 'success' ou 'warning'
}) {
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`toast-notification ${type}`}>
      <div className="toast-icon">
        {type === "warning" ? (
          // Ícone de Alerta (Triângulo com exclamação)
          <img src={alertImg} alt="Algo deu errado"/>
        ) : (
          // Ícone de Sucesso (Check)
          <img src={checkImg} alt="Ação feita com sucesso"/>
        )}
      </div>

      <span className="toast-message">{message}</span>

      <button type="button" className="toast-close" onClick={onClose} aria-label="Fechar">
        &times;
      </button>
    </div>
  );
}