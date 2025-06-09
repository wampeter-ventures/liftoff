import { useState, useEffect } from 'react';
import { Rocket, Download } from 'lucide-react';

const AddToHomeScreen = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ua = navigator.userAgent;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const android = /Android/i.test(ua);
    const safari = /Safari/i.test(ua) && /iPhone|iPad|iPod/i.test(ua) && !/CriOS/i.test(ua) && !/FxiOS/i.test(ua);

    setIsAndroid(android);
    setIsSafari(safari);

    if (isStandalone || localStorage.getItem('a2hsInstalled') || !(android || safari)) {
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
    if (isAndroid) return;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
          localStorage.setItem('a2hsInstalled', 'true');
        }
        setDeferredPrompt(null);
        setVisible(false);
      });
    } else if (isSafari) {
      alert('Tap the share icon and "Add to Home Screen"');
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-4 bottom-4 mx-auto max-w-md rounded-lg bg-gray-900/90 px-4 py-3 text-white shadow-lg flex items-center justify-between backdrop-blur-sm"
      style={{ zIndex: 1101 }}
    >
      <div className="flex items-center gap-2">
        <Rocket size={20} className="text-purple-300" />
        <span className="text-sm">Liftoff is better as an app</span>
      </div>
      <button
        onClick={handleAdd}
        disabled={isAndroid}
        className="a2hs-button relative rounded bg-white px-3 py-1 text-sm font-medium text-gray-900 flex items-center gap-1 disabled:opacity-50"
      >
        <Download size={16} />
        Install
      </button>
    </div>
  );
};

export default AddToHomeScreen;
