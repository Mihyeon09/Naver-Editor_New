import React, { useRef, useEffect, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { Block, BlockType } from '../App';
import { DragHandleIcon, PlusIcon } from './Icons';

interface EditableBlockProps {
  block: Block;
  onUpdate: (id: string, content: string) => void;
  onFocus: () => void;
  isActive: boolean;
  onDeleteBlock: (id: string) => void;
  isFirst: boolean;
  shouldFocus: boolean;
  onDoneFocusing: () => void;
  onOpenMenu: (blockId: string, ref: React.RefObject<HTMLButtonElement>) => void;
  onMoveBlock: (dragId: string, dropId: string) => void;
  draggedBlockId: string | null;
  onSetDraggedBlockId: (id: string | null) => void;
  isSlashMenuOpen: boolean;
  onOpenSlashMenu: (blockId: string, position: { top: number; left: number }) => void;
  onCloseSlashMenu: () => void;
  onUpdateSlashMenuFilter: (filter: string) => void;
  onSlashMenuKeyDown: (key: 'ArrowUp' | 'ArrowDown' | 'Enter') => void;
  onTextSelect: (range: Range | null) => void;
}

const getCaretCoordinates = () => {
    let x = 0, y = 0;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0).cloneRange();
        range.collapse(true);
        const rect = range.getClientRects()[0];
        if (rect) {
            x = rect.left;
            y = rect.top;
        }
    }
    return { x, y };
};

const EditableBlock: React.FC<EditableBlockProps> = ({
  block,
  onUpdate,
  onFocus,
  isActive,
  onDeleteBlock,
  isFirst,
  shouldFocus,
  onDoneFocusing,
  onOpenMenu,
  onMoveBlock,
  draggedBlockId,
  onSetDraggedBlockId,
  isSlashMenuOpen,
  onOpenSlashMenu,
  onCloseSlashMenu,
  onUpdateSlashMenuFilter,
  onSlashMenuKeyDown,
  onTextSelect,
}) => {
  const contentEditableRef = useRef<HTMLElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const plusButtonRef = useRef<HTMLButtonElement>(null);
  const [showControls, setShowControls] = useState(false);
  const tag = block.type as keyof JSX.IntrinsicElements;

  useEffect(() => {
    if (shouldFocus && contentEditableRef.current) {
      contentEditableRef.current.focus();
      onDoneFocusing();
    }
  }, [shouldFocus, onDoneFocusing]);

  const handleChange = (e: any) => {
    const newContent = e.target.value;
    onUpdate(block.id, newContent);

    if (newContent.startsWith('/')) {
        const caret = getCaretCoordinates();
        const filter = newContent.substring(1);
        onUpdateSlashMenuFilter(filter);
        onOpenSlashMenu(block.id, { top: caret.y + 24, left: caret.x });
    } else {
        if (isSlashMenuOpen) {
            onCloseSlashMenu();
        }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && block.content === '' && !isFirst) {
      e.preventDefault();
      onDeleteBlock(block.id);
    }
    if (isSlashMenuOpen) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        onSlashMenuKeyDown(e.key);
      }
      if(e.key === 'Escape') {
        e.preventDefault();
        onCloseSlashMenu();
      }
    }
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      onTextSelect(range);
    }
  };
  
  const handleDragStart = (e: React.DragEvent) => {
    onSetDraggedBlockId(block.id);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedBlockId && draggedBlockId !== block.id) {
       // Add visual indicator logic here if desired
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedBlockId) {
      onMoveBlock(draggedBlockId, block.id);
    }
    onSetDraggedBlockId(null);
  };
  
  const handlePlusClick = () => {
    if (plusButtonRef.current) {
        const rect = plusButtonRef.current.getBoundingClientRect();
        onOpenSlashMenu(block.id, { top: rect.bottom, left: rect.left });
        onUpdateSlashMenuFilter('');
    }
  };

  const placeholderText = block.type === 'p' ? '블로그 글 작성을 시작해보세요. /를 입력하여 명령어 메뉴를 열 수 있습니다.' : `제목 ${block.type.substring(1)}`;

  return (
    <div
      className={`relative group flex items-start gap-1 py-1 ${draggedBlockId === block.id ? 'opacity-50' : ''}`}
      onFocus={onFocus}
      onClick={onFocus}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={`flex items-center absolute -left-10 top-1.5 transition-opacity duration-200 ${isActive || showControls ? 'opacity-100' : 'opacity-0'}`}>
        <button 
          ref={plusButtonRef}
          onClick={handlePlusClick}
          className="p-0.5 rounded text-gray-400 hover:bg-slate-200 dark:hover:bg-zinc-700"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
        <button 
          ref={handleRef}
          className="p-0.5 rounded text-gray-400 hover:bg-slate-200 dark:hover:bg-zinc-700 cursor-grab"
          draggable
          onDragStart={handleDragStart}
          onDragEnd={() => onSetDraggedBlockId(null)}
          onClick={(e) => { e.stopPropagation(); onOpenMenu(block.id, handleRef); }}
        >
          <DragHandleIcon className="w-4 h-4" />
        </button>
      </div>
      <ContentEditable
        innerRef={contentEditableRef}
        html={block.content}
        disabled={false}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onMouseUp={handleMouseUp}
        tagName={tag}
        className={`w-full outline-none leading-relaxed
          ${!block.content ? 'before:content-[attr(data-placeholder)] before:text-gray-400 before:dark:text-zinc-500 before:pointer-events-none' : ''}
          ${block.type === 'h1' && 'text-3xl font-bold mt-4 mb-2'}
          ${block.type === 'h2' && 'text-2xl font-bold mt-3 mb-1.5'}
          ${block.type === 'h3' && 'text-xl font-bold mt-2 mb-1'}
        `}
        data-placeholder={placeholderText}
      />
    </div>
  );
};

export default EditableBlock;
