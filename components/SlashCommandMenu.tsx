import React from 'react';
import { CommandValue, CommandItem } from '../App';

interface SlashCommandMenuProps {
  blockId: string;
  commands: CommandItem[];
  selectedIndex: number;
  onCommandSelect: (blockId: string, value: CommandValue) => void;
  onClose: () => void;
}

const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({ blockId, commands, selectedIndex, onCommandSelect, onClose }) => {
  
  const handleSelect = (value: CommandValue) => {
    onCommandSelect(blockId, value);
  };
  
  return (
    <div 
      className="w-80 bg-zinc-800 rounded-lg shadow-2xl border border-zinc-700 text-white flex flex-col overflow-hidden outline-none"
    >
        <div className="p-2">
             <div className="px-2 pt-2 pb-1 text-xs font-semibold text-zinc-400">기본 블록</div>
             <ul>
                {commands.map((cmd, index) => (
                    <li key={cmd.title}>
                        <button
                            onClick={() => handleSelect(cmd.value)}
                            className={`w-full flex items-center gap-3 text-left p-2 rounded transition-colors ${
                                index === selectedIndex ? 'bg-zinc-700' : 'hover:bg-zinc-700/50'
                            }`}
                        >
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-zinc-600 rounded">
                                {cmd.icon}
                            </div>
                            <div>
                                <div className="font-medium text-sm text-zinc-100">{cmd.title}</div>
                                <div className="text-xs text-zinc-400">{cmd.description}</div>
                            </div>
                        </button>
                    </li>
                ))}
             </ul>
        </div>
        <div className="border-t border-zinc-700 px-4 py-2 text-xs text-zinc-500">
            페이지에 '/'을(를) 입력하세요. <span className="float-right">esc</span>
        </div>
    </div>
  );
};

export default SlashCommandMenu;
