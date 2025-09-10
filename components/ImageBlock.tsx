import React, { useState, useRef } from 'react';
import ContentEditable from 'react-contenteditable';
import { Block } from '../App';
import { DragHandleIcon, PlusIcon, AIIcon, DeleteIcon } from './Icons';

interface ImageBlockProps {
  block: Block;
  isActive: boolean;
  onFocus: () => void;
  onOpenMenu: (blockId: string, ref: React.RefObject<HTMLDivElement>) => void;
  onMoveBlock: (dragId: string, dropId: string) => void;
  draggedBlockId: string | null;
  onSetDraggedBlockId: (id: string | null) => void;
  // FIX: Corrected the type for onUpdateBlockData to allow passing partial block data.
  onUpdateBlockData: (id: string, data: Partial<NonNullable<Block['data']>>) => void;
  onAiImageCorrection: (blockId: string) => Promise<void>;
  onDeleteBlock: (blockId: string) => void;
}

const ImageBlock: React.FC<ImageBlockProps> = ({
  block,
  isActive,
  onFocus,
  onOpenMenu,
  onMoveBlock,
  draggedBlockId,
  onSetDraggedBlockId,
  onUpdateBlockData,
  onAiImageCorrection,
  onDeleteBlock
}) => {
  const blockRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);
  const [isAiCorrecting, setIsAiCorrecting] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    onSetDraggedBlockId(block.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedBlockId) {
      onMoveBlock(draggedBlockId, block.id);
    }
    onSetDraggedBlockId(null);
  };
  
  const handleCaptionChange = (e: any) => {
    onUpdateBlockData(block.id, { caption: e.target.value });
  };

  const handleAiClick = async () => {
    setIsAiCorrecting(true);
    await onAiImageCorrection(block.id);
    setIsAiCorrecting(false);
  };

  return (
    <div
      ref={blockRef}
      className={`relative group my-4 ${draggedBlockId === block.id ? 'opacity-50' : ''}`}
      onClick={onFocus}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
        <div className={`flex items-center absolute -left-10 top-1/2 -translate-y-1/2 transition-opacity duration-200 z-10 ${isActive || showControls ? 'opacity-100' : 'opacity-0'}`}>
            <button className="p-0.5 rounded text-gray-400 bg-white dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700">
            <PlusIcon className="w-4 h-4" />
            </button>
            <button
                className="p-0.5 rounded text-gray-400 bg-white dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 cursor-grab"
                draggable
                onDragStart={handleDragStart}
                onDragEnd={() => onSetDraggedBlockId(null)}
                onClick={(e) => { e.stopPropagation(); onOpenMenu(block.id, blockRef); }}
            >
            <DragHandleIcon className="w-4 h-4" />
            </button>
        </div>

        <figure className={`border-2 ${isActive ? 'border-green-500' : 'border-transparent'}`}>
            <img src={block.data?.src} alt={block.data?.caption || 'User uploaded content'} className="max-w-full h-auto mx-auto" />
            <ContentEditable
              tagName="figcaption"
              html={block.data?.caption || ''}
              disabled={false}
              onChange={handleCaptionChange}
              className="w-full outline-none text-center text-sm text-gray-500 dark:text-gray-400 mt-2 p-1 before:content-[attr(data-placeholder)] before:text-gray-400 dark:before:text-zinc-500"
              data-placeholder="캡션을 입력하세요"
            />
        </figure>

        <div className={`absolute top-2 right-2 flex gap-1 transition-opacity duration-200 ${isActive || showControls ? 'opacity-100' : 'opacity-0'}`}>
            <button onClick={handleAiClick} disabled={isAiCorrecting} className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm p-1.5 rounded-md shadow hover:bg-slate-100 dark:hover:bg-zinc-700 disabled:opacity-50">
                <AIIcon className="w-5 h-5" />
            </button>
             <button onClick={() => onDeleteBlock(block.id)} className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm p-1.5 rounded-md shadow hover:bg-slate-100 dark:hover:bg-zinc-700">
                <DeleteIcon className="w-5 h-5 text-red-500" />
            </button>
        </div>

    </div>
  );
};

export default ImageBlock;