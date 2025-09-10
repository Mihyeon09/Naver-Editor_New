import React, { useEffect, useRef } from 'react';
import { DeleteIcon } from './Icons';

interface BlockMenuProps {
  x: number;
  y: number;
  blockId: string;
  onDelete: (blockId: string) => void;
  onClose: () => void;
}

const BlockMenu: React.FC<BlockMenuProps> = ({ x, y, blockId, onDelete, onClose }) => {
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

  const handleDelete = () => {
    onDelete(blockId);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white dark:bg-zinc-800 shadow-lg rounded-md border border-slate-200 dark:border-zinc-700 p-1 w-48"
      style={{ top: y, left: x }}
    >
      <ul>
        <li>
          <button
            onClick={handleDelete}
            className="w-full text-left flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 dark:hover:bg-zinc-700 text-red-500"
          >
            <DeleteIcon className="w-4 h-4" />
            <span>삭제</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default BlockMenu;
