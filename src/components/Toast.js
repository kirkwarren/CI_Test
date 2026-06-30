import React from 'react';
import { useGame } from '../context/GameContext';

const Toast = () => {
  const { toast } = useGame();
  if (!toast) return null;
  return (
    <div className="pointer-events-none fixed left-1/2 -translate-x-1/2 top-4 z-[60] w-[88%] max-w-[400px]">
      <div className="glass rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-soft animate-slideUp">
        <span className="text-lg">{toast.icon}</span>
        <span className="text-white/90 text-sm font-semibold">{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;
