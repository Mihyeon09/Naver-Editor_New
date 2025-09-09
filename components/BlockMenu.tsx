import React, { useState } from 'react';
import { TrashIcon, DuplicateIcon, TurnIntoIcon, CheckIcon } from './Icons';
import { BlockType } from '../App';

interface BlockMenuProps {
  blockId: string;
  onDelete: (blockId: string) => void;
  onDuplicate: (blockId: string) => void;
  onChangeBlockType: (blockId: string, newType: BlockType) => void;
  currentType: BlockType;
}

const MenuItem: React.FC<{ icon: React.ReactNode; label: string; shortcut?: string; onClick?: () => void, hasSubmenu?: boolean }> = 
  ({ icon, label, shortcut, onClick, hasSubmenu = false }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between text-left px-3 py-1.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded transition-colors">
    <div className="flex items-center gap-2">
      {icon}
      <span>{label}</span>
    </div>
    <div className="flex items-center gap-2">
       {hasSubmenu && <span className="text-xs transform scale-x-75 rotate-90">▲</span>}
       {shortcut && <span className="text-xs text-gray-400 dark:text-zinc-500">{shortcut}</span>}
    </div>
  </button>
);

const BlockMenu: React.FC<BlockMenuProps> = ({ blockId, onDelete, onDuplicate, onChangeBlockType, currentType }) => {
  const [showTurnInto, setShowTurnInto] = useState(false);
  const isTextBlock = currentType === 'p' || currentType === 'h1' || currentType === 'h2';

  const blockTypes: { label: string; type: BlockType }[] = [
    { label: '본문', type: 'p' },
    { label: '제목1', type: 'h1' },
    { label: '제목2', type: 'h2' },
  ];

  if (showTurnInto) {
    return (
      <div className="w-56 bg-white dark:bg-zinc-800 rounded-md shadow-lg border border-slate-200 dark:border-zinc-700 p-1">
        <button onClick={() => setShowTurnInto(false)} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded">
           <span className="text-xs transform -rotate-90">▲</span>
           <span>전환</span>
        </button>
        <div className="my-1 h-px bg-slate-200 dark:bg-zinc-700" />
        {blockTypes.map(({ label, type }) => (
          <button 
            key={type}
            onClick={() => onChangeBlockType(blockId, type)}
            className="w-full flex items-center justify-between text-left px-3 py-1.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded transition-colors"
          >
            <span>{label}</span>
            {currentType === type && <CheckIcon />}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-56 bg-white dark:bg-zinc-800 rounded-md shadow-lg border border-slate-200 dark:border-zinc-700 p-1">
      {isTextBlock && (
        <>
          <MenuItem icon={<TurnIntoIcon />} label="전환" onClick={() => setShowTurnInto(true)} hasSubmenu/>
          <div className="my-1 h-px bg-slate-200 dark:bg-zinc-700" />
        </>
      )}
      <MenuItem icon={<DuplicateIcon />} label="복제" shortcut="⌘D" onClick={() => onDuplicate(blockId)}/>
      <MenuItem icon={<TrashIcon />} label="삭제" shortcut="Del" onClick={() => onDelete(blockId)}/>
    </div>
  );
};

export default BlockMenu;