import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ContentSmallIcon, BookIcon, TicketIcon, VideoSmallIcon, TvIcon, ShoppingIcon, HeadphonesIcon, ImageSmallIcon, NewsIcon, FullscreenIcon } from './Icons';

interface BottomBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const options = [
  { icon: <ContentSmallIcon />, label: '글감', type: 'button', hasText: true },
  { type: 'separator' },
  { icon: <BookIcon />, label: '책', type: 'button' },
  { icon: <TicketIcon />, label: '티켓', type: 'button' },
  { icon: <VideoSmallIcon />, label: '영화', type: 'button' },
  { icon: <TvIcon />, label: 'TV', type: 'button' },
  { icon: <ShoppingIcon />, label: '쇼핑', type: 'button' },
  { icon: <HeadphonesIcon />, label: '음악 글감', type: 'button' },
  { icon: <ImageSmallIcon />, label: '이미지', type: 'button' },
  { icon: <NewsIcon />, label: '뉴스', type: 'button' },
  { type: 'separator' },
  { icon: <FullscreenIcon />, label: '확대/축소', type: 'button' },
];

const BottomBar: React.FC<BottomBarProps> = ({ activeTab, setActiveTab }) => {
  const [tooltip, setTooltip] = useState<{ visible: boolean; text: string; top: number; left: number } | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, text: string) => {
    const option = options.find(opt => opt.type === 'button' && opt.label === text);
    if (option && option.hasText) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      text: text,
      top: rect.top - 38, // Position tooltip above the button
      left: rect.left + rect.width / 2,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm border border-gray-200 dark:border-zinc-700 p-2 flex items-center shadow-lg rounded-xl box-border transition-colors z-40">
        <div className="flex items-center gap-1">
          {options.map((option, index) => {
            if (option.type === 'separator') {
              return <div key={`sep-${index}`} className="w-px h-5 bg-gray-200 dark:bg-zinc-600 mx-1" />;
            }

            const isActive = activeTab === option.label;
            return (
              <button
                key={option.label}
                onClick={() => setActiveTab(option.label)}
                onMouseEnter={(e) => handleMouseEnter(e, option.label)}
                onMouseLeave={handleMouseLeave}
                aria-label={option.label}
                className={`flex items-center justify-center p-2 rounded-lg transition-colors
                  ${isActive ? 'text-[#03c75a]' : 'text-gray-600 dark:text-gray-300'}
                  ${option.hasText ? 'pr-3' : 'hover:bg-gray-100 dark:hover:bg-zinc-700'}
                `}
              >
                <div className="w-6 h-6">{option.icon}</div>
                {option.hasText && <span className="ml-1 text-sm font-medium">{option.label}</span>}
              </button>
            );
          })}
        </div>
      </div>
      {tooltip && tooltip.visible && createPortal(
        <div
          className="fixed bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-[100] pointer-events-none"
          style={{
            top: `${tooltip.top}px`,
            left: `${tooltip.left}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {tooltip.text}
        </div>,
        document.body
      )}
    </>
  );
};

export default BottomBar;