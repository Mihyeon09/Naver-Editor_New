import React from 'react';
import { 
    PhotoIcon, MyboxIcon, VideoIcon, StickerIcon, QuoteIcon, DividerIcon, LinkIcon, FileIcon, 
    CalendarIcon, CodeIcon, TableIcon, EquationIcon, LocationIcon, WonIcon, BookSearchIcon
} from './Icons';

interface BottomBarProps {
  onOpenImageUploadMenu: () => void;
}

const TooltipButton: React.FC<{ label: string; onClick?: () => void; children: React.ReactNode }> = ({ label, onClick, children }) => (
  <div className="relative group">
    <button
      onClick={onClick}
      className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
    >
      {children}
    </button>
    <div className="absolute bottom-full mb-2 px-2 py-1 bg-black text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
      {label}
    </div>
  </div>
);

// FIX: Added an interface for menu items to make the 'action' property optional, fixing the type error.
interface MenuItem {
  label: string;
  icon: React.ReactNode;
  action?: () => void;
}

const BottomBar: React.FC<BottomBarProps> = ({ onOpenImageUploadMenu }) => {
  const menuItems: MenuItem[] = [
    { label: '사진', icon: <PhotoIcon className="w-5 h-5" />, action: onOpenImageUploadMenu },
    { label: 'MYBOX', icon: <MyboxIcon className="w-5 h-5" /> },
    { label: '동영상', icon: <VideoIcon className="w-5 h-5" /> },
    { label: '스티커', icon: <StickerIcon className="w-5 h-5" /> },
    { label: '인용구', icon: <QuoteIcon className="w-5 h-5" /> },
    { label: '구분선', icon: <DividerIcon className="w-5 h-5" /> },
    { label: '링크', icon: <LinkIcon className="w-5 h-5" /> },
    { label: '파일', icon: <FileIcon className="w-5 h-5" /> },
    { label: '일정', icon: <CalendarIcon className="w-5 h-5" /> },
    { label: '소스코드', icon: <CodeIcon className="w-5 h-5" /> },
    { label: '표', icon: <TableIcon className="w-5 h-5" /> },
    { label: '수식', icon: <EquationIcon className="w-5 h-5" /> },
  ];

  const extraItems: MenuItem[] = [
    { label: '장소', icon: <LocationIcon className="w-5 h-5" /> },
    { label: '내돈내산', icon: <WonIcon className="w-5 h-5" /> },
    { label: '글감', icon: <BookSearchIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-1 bg-zinc-800/80 backdrop-blur-sm p-2 rounded-xl shadow-lg border border-zinc-700">
        {menuItems.map(item => (
          <TooltipButton key={item.label} label={item.label} onClick={item.action}>
            {item.icon}
          </TooltipButton>
        ))}
        <div className="h-6 w-px bg-zinc-600 mx-1"></div>
        {extraItems.map(item => (
          <TooltipButton key={item.label} label={item.label} onClick={item.action}>
            {item.icon}
          </TooltipButton>
        ))}
      </div>
    </div>
  );
};

export default BottomBar;