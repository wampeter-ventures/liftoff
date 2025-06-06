import { useState, useEffect } from 'react';

const UpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const handleUpdate = (reg) => {
        setRegistration(reg);
        setShowUpdate(true);
      };

      // Listen for service worker updates
      navigator.serviceWorker.addEventListener('updatefound', () => {
        const reg = navigator.serviceWorker.controller?.registration;
        if (reg) {
          handleUpdate(reg);
        }
      });

      // Check for existing registration
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg && reg.waiting) {
          handleUpdate(reg);
        }
      });
    }
  }, []);

  const handleUpdateClick = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdate(false);
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <h3 className="font-semibold">Update Available!</h3>
          <p className="text-sm opacity-90">A new version of Liftoff is ready.</p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleUpdateClick}
            className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Update
          </button>
          <button
            onClick={handleDismiss}
            className="text-white text-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification; 