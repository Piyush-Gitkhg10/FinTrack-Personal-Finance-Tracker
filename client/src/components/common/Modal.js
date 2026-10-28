import React from "react";
import ReactDOM from "react-dom";
import { ICONS } from "../../assets/icons";

const Modal = ({ isVisible, onClose, title, children }) => {
    if (!isVisible) return null;

    return ReactDOM.createPortal(
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button onClick={onClose} className="modal-close-btn">
                        <ICONS.Close />
                    </button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>,
        document.getElementById("root") // Appending to root
    );
};

export default Modal;
