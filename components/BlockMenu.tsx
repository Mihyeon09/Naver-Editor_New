import React, { useState } from 'react';
import { TrashIcon, DuplicateIcon, TurnIntoIcon, CheckIcon, StrikethroughIcon, SubscriptIcon, SuperscriptIcon, TextColorIcon, BgColorIcon, SlashIcon } from './Icons';
import { BlockType } from '../App';

interface BlockMenuProps {
  blockId: string;
  onDelete: (blockId: string) => void;
  onDuplicate: (blockId: string) => void;
  onChangeBlockType: (blockId: string, newType: BlockType) => void;
  currentType: BlockType;
  onClose: () => void;
}

const MenuItem: React.FC<{ icon: React.ReactNode; label: string; shortcut?: string; onMouseDown?: (e: React.MouseEvent) => void, hasSubmenu?: boolean }> = 
  ({ icon, label, shortcut, onMouseDown, hasSubmenu = false }) => (
  <button onMouseDown={onMouseDown} className="w-full flex items-center justify-between text-left px-3 py-1.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded transition-colors">
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

const ColorPalette: React.FC<{ colors: string[], onBack: () => void, command: string, onClose: () => void }> = ({ colors, onBack, command, onClose }) => {
  
  const handleSelect = (e: React.MouseEvent, color: string) => {
    e.preventDefault();
    document.execCommand(command, false, color);
    onClose();
  };

  return (
    <div className="w-56 bg-white dark:bg-zinc-800 rounded-md shadow-lg border border-slate-200 dark:border-zinc-700 p-1">
      <button onMouseDown={(e) => { e.preventDefault(); onBack(); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded">
        <span className="text-xs transform -rotate-90">▲</span>
        <span>Back</span>
      </button>
      <div className="my-1 h-px bg-slate-200 dark:bg-zinc-700" />
      <div className="grid grid-cols-6 gap-2 p-2">
        <button
          onMouseDown={(e) => handleSelect(e, 'transparent')}
          className="w-7 h-7 rounded-full border border-slate-200 dark:border-zinc-600 hover:scale-110 transition-transform flex items-center justify-center bg-slate-100 dark:bg-zinc-700"
          aria-label="Remove color"
        >
          <SlashIcon />
        </button>
        {colors.map(color => (
          <button
            key={color}
            onMouseDown={(e) => handleSelect(e, color)}
            className="w-7 h-7 rounded-full border border-slate-200 dark:border-zinc-600 hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            aria-label={color}
          />
        ))}
      </div>
    </div>
  );
};


const BlockMenu: React.FC<BlockMenuProps> = ({ blockId, onDelete, onDuplicate, onChangeBlockType, currentType, onClose }) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const isTextBlock = currentType === 'p' || currentType === 'h1' || currentType === 'h2';

  const blockTypes: { label: string; type: BlockType }[] = [
    { label: '본문', type: 'p' },
    { label: '제목1', type: 'h1' },
    { label: '제목2', type: 'h2' },
  ];

  const TEXT_COLORS = ['#374151', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#78716c'];
  const BG_COLORS = ['#f3f4f6', '#fee2e2', '#ffedd5', '#fef9c3', '#dcfce7', '#dbeafe', '#ede9fe', '#fce7f3', '#f5f5f4'];


  const handleFormat = (e: React.MouseEvent, command: string) => {
    e.preventDefault();
    document.execCommand(command, false);
    onClose();
  };

  const handleChangeType = (type: BlockType) => {
    onChangeBlockType(blockId, type);
    onClose();
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault();
    onDuplicate(blockId);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    onDelete(blockId);
  };

  if (activeSubmenu === 'turnInto') {
    return (
      <div className="w-56 bg-white dark:bg-zinc-800 rounded-md shadow-lg border border-slate-200 dark:border-zinc-700 p-1">
        <button onMouseDown={(e) => { e.preventDefault(); setActiveSubmenu(null); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded">
           <span className="text-xs transform -rotate-90">▲</span>
           <span>전환</span>
        </button>
        <div className="my-1 h-px bg-slate-200 dark:bg-zinc-700" />
        {blockTypes.map(({ label, type }) => (
          <button 
            key={type}
            onMouseDown={() => handleChangeType(type)}
            className="w-full flex items-center justify-between text-left px-3 py-1.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded transition-colors"
          >
            <span>{label}</span>
            {currentType === type && <CheckIcon />}
          </button>
        ))}
      </div>
    );
  }

  if (activeSubmenu === 'textColor') {
    return <ColorPalette colors={TEXT_COLORS} onBack={() => setActiveSubmenu(null)} command="foreColor" onClose={onClose} />;
  }
  
  if (activeSubmenu === 'bgColor') {
    return <ColorPalette colors={BG_COLORS} onBack={() => setActiveSubmenu(null)} command="hiliteColor" onClose={onClose} />;
  }

  return (
    <div className="w-56 bg-white dark:bg-zinc-800 rounded-md shadow-lg border border-slate-200 dark:border-zinc-700 p-1">
      {isTextBlock ? (
        <>
          <MenuItem icon={<TurnIntoIcon />} label="전환" onMouseDown={(e) => { e.preventDefault(); setActiveSubmenu('turnInto'); }} hasSubmenu/>
          <div className="my-1 h-px bg-slate-200 dark:bg-zinc-700" />
          <MenuItem icon={<StrikethroughIcon />} label="Strikethrough" onMouseDown={(e) => handleFormat(e, 'strikeThrough')} />
          <MenuItem icon={<SubscriptIcon />} label="Subscript" onMouseDown={(e) => handleFormat(e, 'subscript')} />
          <MenuItem icon={<SuperscriptIcon />} label="Superscript" onMouseDown={(e) => handleFormat(e, 'superscript')} />
          <div className="my-1 h-px bg-slate-200 dark:bg-zinc-700" />
          <MenuItem icon={<TextColorIcon />} label="Text Color" onMouseDown={(e) => { e.preventDefault(); setActiveSubmenu('textColor'); }} hasSubmenu />
          <MenuItem icon={<BgColorIcon />} label="Background Color" onMouseDown={(e) => { e.preventDefault(); setActiveSubmenu('bgColor'); }} hasSubmenu />
          <div className="my-1 h-px bg-slate-200 dark:bg-zinc-700" />
        </>
      ) : null}
      <MenuItem icon={<DuplicateIcon />} label="복제" shortcut="⌘D" onMouseDown={handleDuplicate}/>
      <MenuItem icon={<TrashIcon />} label="삭제" shortcut="Del" onMouseDown={handleDelete}/>
    </div>
  );
};

export default BlockMenu;
