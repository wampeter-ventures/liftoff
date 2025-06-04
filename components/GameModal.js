import React from 'react';
import { X, CheckCircle, AlertTriangle, Rocket, Flame } from 'lucide-react';

function GameModal({ isOpen, onClose, type = 'info', title, message, children, showOkButton = true }) {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={24} className="text-green-400" />;
            case 'warning': return <AlertTriangle size={24} className="text-yellow-400" />;
            case 'error': return <Flame size={24} className="text-red-400" />;
            case 'launch': return <Rocket size={24} className="text-blue-400" />;
            default: return <Rocket size={24} className="text-blue-400" />;
        }
    };

    const getModalClass = () => {
        switch (type) {
            case 'success': return 'modal-success';
            case 'warning': return 'modal-warning';
            case 'error': return 'modal-error';
            case 'launch': return 'modal-launch';
            default: return 'modal-info';
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div 
                className={`modal-content ${getModalClass()}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <div className="modal-icon">
                        {getIcon()}
                    </div>
                    <h3 className="modal-title">{title}</h3>
                    <button className="modal-close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                
                <div className="modal-body">
                    {message && <p className="modal-message">{message}</p>}
                    {children}
                </div>
                
                {showOkButton && (
                    <div className="modal-footer">
                        <button 
                            className="btn btn-primary modal-ok-btn"
                            onClick={onClose}
                        >
                            OK
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GameModal; 