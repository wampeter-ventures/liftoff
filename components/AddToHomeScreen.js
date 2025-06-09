import { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';

const AddToHomeScreen = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isStandalone || !isMobile || localStorage.getItem('a2hsInstalled')) {
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      localStorage.setItem('a2hsInstalled', 'true');
      setVisible(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    setVisible(true);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleAdd = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
          localStorage.setItem('a2hsInstalled', 'true');
        }
        setDeferredPrompt(null);
        setVisible(false);
      });
    }
  };

  const handleDismiss = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-lg bg-gray-900/90 px-4 py-3 text-white shadow-lg flex items-center justify-between backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Rocket size={20} className="text-purple-300" />
        <span className="text-sm">Add Liftoff to your home screen?</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={handleAdd} className="rounded bg-white px-3 py-1 text-sm font-medium text-gray-900">Add</button>
        <button onClick={handleDismiss} className="text-sm opacity-70 hover:opacity-100">Later</button>
      </div>
    </div>
  );
};

export default AddToHomeScreen;
