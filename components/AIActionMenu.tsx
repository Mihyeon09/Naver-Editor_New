import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRightIcon } from './Icons';

interface AIActionMenuProps {
  position: { top: number; left: number };
  onClose: () => void;
  onSummarize: () => void;
  onCreateChecklist: () => void;
}

const AIActionMenu: React.FC<AIActionMenuProps> = ({ position, onClose, onSummarize, onCreateChecklist }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-50 bg-zinc-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-4 w-96 text-white border border-white/10"
      style={{ top: position.top, left: position.left }}
    >
      <div className="space-y-2 mb-4">
        <button 
          onClick={onSummarize}
          className="w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <span className="font-semibold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            핵심 내용 요약
          </span>
        </button>
        <button 
          onClick={onCreateChecklist}
          className="w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors text-zinc-300">
          후속 조치 체크리스트 만들기
        </button>
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="무엇이든 물어보거나, 쓰거나, 검색하세요..."
          className="w-full bg-black/20 border border-white/10 rounded-lg pl-3 pr-10 py-2 text-sm placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-zinc-900 w-7 h-7 rounded-full flex items-center justify-center hover:bg-black transition-colors">
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default AIActionMenu;
