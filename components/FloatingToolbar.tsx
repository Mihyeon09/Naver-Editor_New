import React from 'react';
import { BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon, LinkIcon } from './Icons';

interface FloatingToolbarProps {
  x: number;
  y: number;
  onClose: () => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ x, y }) => {
  const handleFormat = (e: React.MouseEvent, command: string) => {
    e.preventDefault();
    document.execCommand(command, false);
  };
  
  const handleLink = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = prompt("Enter the URL:");
    if (url) {
        document.execCommand('createLink', false, url);
    }
  };

  return (
    <div
      className="fixed z-50 bg-zinc-800/80 backdrop-blur-sm p-1 rounded-lg shadow-lg border border-zinc-700 flex items-center gap-1"
      style={{ top: y, left: x }}
    >
      <button onMouseDown={(e) => handleFormat(e, 'bold')} className="p-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors" aria-label="Bold">
        <BoldIcon className="w-4 h-4" />
      </button>
      <button onMouseDown={(e) => handleFormat(e, 'italic')} className="p-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors" aria-label="Italic">
        <ItalicIcon className="w-4 h-4" />
      </button>
      <button onMouseDown={(e) => handleFormat(e, 'underline')} className="p-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors" aria-label="Underline">
        <UnderlineIcon className="w-4 h-4" />
      </button>
      <button onMouseDown={(e) => handleFormat(e, 'strikeThrough')} className="p-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors" aria-label="Strikethrough">
        <StrikethroughIcon className="w-4 h-4" />
      </button>
       <div className="h-4 w-px bg-zinc-600 mx-1"></div>
      <button onMouseDown={handleLink} className="p-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors" aria-label="Add link">
        <LinkIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default FloatingToolbar;
