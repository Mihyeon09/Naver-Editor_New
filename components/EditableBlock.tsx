import React, { useRef, useEffect, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { Block, BlockType } from '../App';
import { PlusIcon, DragHandleIcon } from './Icons';

interface EditableBlockProps {
  block: Block;
  onUpdate: (id: string, content: string) => void;
  onFocus: () => void;
  isActive: boolean;
  onAddBlockAfter: (currentBlockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
  isFirst: boolean;
  shouldFocus: boolean;
  onDoneFocusing: () => void;
  onOpenMenu: (blockId: string, ref: React.RefObject<HTMLDivElement>) => void;
  onMoveBlock: (dragId: string, dropId: string) => void;
  draggedBlockId: string | null;
  onSetDraggedBlockId: (id: string | null) => void;
}

const EditableBlock: React.FC<EditableBlockProps> = ({
  block, onUpdate, onFocus, isActive,
  onAddBlockAfter, onDeleteBlock, isFirst,
  shouldFocus, onDoneFocusing, onOpenMenu,
  onMoveBlock, draggedBlockId, onSetDraggedBlockId
}) => {
  const contentEditableRef = useRef<HTMLElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  useEffect(() => {
    if (shouldFocus && contentEditableRef.current) {
      contentEditableRef.current.focus();
      // Place cursor at the end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(contentEditableRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
      onDoneFocusing();
    }
  }, [shouldFocus, onDoneFocusing]);

  const handleChange = (e: any) => {
    onUpdate(block.id, e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddBlockAfter(block.id);
    }
    if (e.key === 'Backspace' && (!block.content || block.content === '<br>')) {
      if (!isFirst) {
        e.preventDefault();
        onDeleteBlock(block.id);
      }
    }
  };
  
  const getElementByBlockType = (type: BlockType): keyof JSX.IntrinsicElements => {
    switch (type) {
        case 'h1': return 'h1';
        case 'h2': return 'h2';
        case 'p':
        default: return 'p';
    }
  };

  const Tag = getElementByBlockType(block.type);

  const getPlaceholder = () => {
    if (block.content) return '';
    switch (block.type) {
      case 'h1': return '제목을 입력하세요';
      case 'h2': return '소제목';
      default: return "'/'를 입력하여 블록을 고르세요.";
    }
  };
  
  // Drag and Drop handlers
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
      <div className={`absolute top-0 -left-12 h-full flex items-center gap-1 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity`}>
        <button className="p-1 rounded text-gray-400 hover:bg-slate-200 dark:hover:bg-zinc-700" aria-label="Add block below">
          <PlusIcon />
        </button>
        <div 
          className="p-1 rounded text-gray-400 hover:bg-slate-200 dark:hover:bg-zinc-700 cursor-grab" 
        >
          <DragHandleIcon />
        </div>
      </div>
      <ContentEditable
        innerRef={contentEditableRef}
        html={block.content}
        disabled={false}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        tagName={Tag}
        className={`w-full outline-none leading-relaxed relative
          ${block.type === 'h1' ? 'text-4xl font-bold' : ''}
          ${block.type === 'h2' ? 'text-2xl font-semibold' : ''}
          ${block.type === 'p' ? 'text-base' : ''}
          ${!block.content && isActive ? 'before:content-[attr(data-placeholder)] before:text-gray-400 before:dark:text-zinc-500 before:absolute before:left-0 before:top-1' : ''}`
        }
        data-placeholder={getPlaceholder()}
      />
    </div>
  );
};

export default EditableBlock;