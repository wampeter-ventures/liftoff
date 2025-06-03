import { useState, useCallback } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = "default", icon, duration = 5000 }) => {
    const id = Date.now();
    const newToast = { id, title, description, variant, icon, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto dismiss
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
    
    // For now, we'll use console.log to show toasts
    // In a full implementation, you'd render these as actual toast components
    console.log(`Toast: ${title}${description ? ' - ' + description : ''}`);
    
    return {
      id,
      dismiss: () => setToasts(prev => prev.filter(t => t.id !== id))
    };
  }, []);

  return {
    toast,
    toasts,
    dismiss: (toastId) => setToasts(prev => prev.filter(t => t.id !== toastId))
  };
} 