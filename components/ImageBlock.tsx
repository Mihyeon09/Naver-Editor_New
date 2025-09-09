import React, { useRef, useState } from 'react';
import { Block } from '../App';
import { PlusIcon, DragHandleIcon } from './Icons';

interface ImageBlockProps {
  block: Block;
  onFocus: () => void;
  onOpenMenu: (blockId: string, ref: React.RefObject<HTMLDivElement>) => void;
  onMoveBlock: (dragId: string, dropId: string) => void;
  draggedBlockId: string | null;
  onSetDraggedBlockId: (id: string | null) => void;
}

const ImageBlock: React.FC<ImageBlockProps> = ({
  block, onFocus, onOpenMenu,
  onMoveBlock, draggedBlockId, onSetDraggedBlockId
}) => {
  const blockRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', block.id);
    onSetDraggedBlockId(block.id);
  };
  
  const handleDragEnd = () => {
    onSetDraggedBlockId(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedBlockId && draggedBlockId !== block.id) {
        setIsDraggingOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dragId = e.dataTransfer.getData('text/plain');
    if (dragId && dragId !== block.id) {
        onMoveBlock(dragId, block.id);
    }
    setIsDraggingOver(false);
    onSetDraggedBlockId(null);
  };

  return (
    <div
      ref={blockRef}
      className={`relative group py-1 transition-opacity ${draggedBlockId === block.id ? 'opacity-30' : 'opacity-100'}`}
      onFocus={onFocus}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDraggingOver && <div className="absolute top-0 left-[-2rem] right-0 h-0.5 bg-blue-500 z-10" />}
      <div 
        ref={handleRef}
        className={`absolute top-0 -left-12 h-full flex items-center gap-1 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity`}
      >
        <button className="p-1 rounded text-gray-400 hover:bg-slate-200 dark:hover:bg-zinc-700" aria-label="Add block below" disabled>
          <PlusIcon />
        </button>
        <button 
          className="p-1 rounded text-gray-400 hover:bg-slate-200 dark:hover:bg-zinc-700 cursor-grab"
          onClick={() => onOpenMenu(block.id, handleRef)}
        >
          <DragHandleIcon />
        </button>
      </div>
      <img src={block.content} alt="" className="w-full h-auto rounded-md object-cover" />
    </div>
  );
};

export default ImageBlock;