import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Rocket, Flame } from 'lucide-react';
import Die from './Die';

function GameModal({ isOpen, onClose, type = 'info', title, message, children, showOkButton = true }) {
    const [isRolling, setIsRolling] = useState(false);
    const [animatedRolls, setAnimatedRolls] = useState([]);
    const [showFinalRolls, setShowFinalRolls] = useState(false);

    // Animate the booster rolls when modal opens
    useEffect(() => {
        if (isOpen && type === 'launch' && children?.props?.boosterRolls) {
            const rolls = children.props.boosterRolls;
            setIsRolling(true);
            setShowFinalRolls(false);
            setAnimatedRolls(rolls.map(() => Math.floor(Math.random() * 6) + 1));

            // Dramatic rolling animation
            const intervals = [];

            // Fast initial rolling (100ms intervals)
            const fastRoll = setInterval(() => {
                setAnimatedRolls(rolls.map(() => Math.floor(Math.random() * 6) + 1));
            }, 100);
            intervals.push(fastRoll);

            // Slow down after 1 second
            setTimeout(() => {
                clearInterval(fastRoll);
                const slowRoll = setInterval(() => {
                    setAnimatedRolls(rolls.map(() => Math.floor(Math.random() * 6) + 1));
                }, 200);
                intervals.push(slowRoll);

                // Final settle after another 1.5 seconds
                setTimeout(() => {
                    clearInterval(slowRoll);
                    setIsRolling(false);
                    setAnimatedRolls(rolls);
                    setShowFinalRolls(true);
                }, 1500);
            }, 1000);

            return () => intervals.forEach(clearInterval);
        }
    }, [isOpen, type, children]);

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

    const overlayClass = type === 'launch' ? 'modal-overlay launch-overlay' : 'modal-overlay';

    return (

        <div className={overlayClass} onClick={onClose}>
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