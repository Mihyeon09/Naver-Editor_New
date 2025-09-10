import React from 'react';
import EditableBlock from './EditableBlock';
import ImageBlock from './ImageBlock';
import { Block } from '../App';
import TitleInput from './TitleInput';

interface MainContentProps {
  title: string;
  onTitleChange: (value: string) => void;
  onTitleEnter: () => void;
  blocks: Block[];
  onUpdateBlock: (id: string, content: string) => void;
  // FIX: Corrected the type for onUpdateBlockData to allow passing partial block data.
  onUpdateBlockData: (id: string, data: Partial<NonNullable<Block['data']>>) => void;
  onAiImageCorrection: (blockId: string) => Promise<void>;
  onSetActiveBlock: (id: string | null) => void;
  activeBlockId: string | null;
  onDeleteBlock: (blockId: string) => void;
  nextFocusId: string | null;
  onSetNextFocusId: (id: string | null) => void;
  onOpenBlockMenu: (blockId: string, ref: React.RefObject<HTMLDivElement>) => void;
  onMoveBlock: (dragId: string, dropId: string) => void;
  draggedBlockId: string | null;
  onSetDraggedBlockId: (id: string | null) => void;
  isSlashMenuOpen: boolean;
  onOpenSlashMenu: (blockId: string, position: { top: number; left: number }) => void;
  onCloseSlashMenu: () => void;
  onUpdateSlashMenuFilter: (filter: string) => void;
  onSlashMenuKeyDown: (key: 'ArrowUp' | 'ArrowDown' | 'Enter') => void;
}

const MainContent: React.FC<MainContentProps> = ({
  title,
  onTitleChange,
  onTitleEnter,
  blocks,
  onUpdateBlock,
  onUpdateBlockData,
  onAiImageCorrection,
  onSetActiveBlock,
  activeBlockId,
  onDeleteBlock,
  nextFocusId,
  onSetNextFocusId,
  onOpenBlockMenu,
  onMoveBlock,
  draggedBlockId,
  onSetDraggedBlockId,
  isSlashMenuOpen,
  onOpenSlashMenu,
  onCloseSlashMenu,
  onUpdateSlashMenuFilter,
  onSlashMenuKeyDown
}) => {
  return (
    <main 
      className="flex-grow overflow-y-auto bg-white dark:bg-zinc-800 transition-colors pb-48" 
      onClick={() => {
        onSetActiveBlock(null)
      }}
    >
      <div 
        className="max-w-4xl mx-auto pt-8 pb-8 px-12 text-gray-900 dark:text-gray-100" 
        onClick={(e) => e.stopPropagation()}
      >
        <TitleInput 
          value={title}
          onChange={onTitleChange}
          onEnterPress={onTitleEnter}
        />
        {blocks.map((block, index) => {
          if (block.type === 'image') {
            return (
              <ImageBlock
                key={block.id}
                block={block}
                isActive={activeBlockId === block.id}
                onFocus={() => onSetActiveBlock(block.id)}
                onOpenMenu={onOpenBlockMenu}
                onMoveBlock={onMoveBlock}
                draggedBlockId={draggedBlockId}
                onSetDraggedBlockId={onSetDraggedBlockId}
                onUpdateBlockData={onUpdateBlockData}
                onAiImageCorrection={onAiImageCorrection}
                onDeleteBlock={onDeleteBlock}
              />
            );
          }
          return (
            <EditableBlock
              key={block.id}
              block={block}
              onUpdate={onUpdateBlock}
              onFocus={() => onSetActiveBlock(block.id)}
              isActive={activeBlockId === block.id}
              onDeleteBlock={onDeleteBlock}
              isFirst={index === 0}
              shouldFocus={nextFocusId === block.id}
              onDoneFocusing={() => onSetNextFocusId(null)}
              onOpenMenu={onOpenBlockMenu}
              onMoveBlock={onMoveBlock}
              draggedBlockId={draggedBlockId}
              onSetDraggedBlockId={onSetDraggedBlockId}
              isSlashMenuOpen={isSlashMenuOpen}
              onOpenSlashMenu={onOpenSlashMenu}
              onCloseSlashMenu={onCloseSlashMenu}
              onUpdateSlashMenuFilter={onUpdateSlashMenuFilter}
              onSlashMenuKeyDown={onSlashMenuKeyDown}
            />
          );
        })}
      </div>
    </main>
  );
};

export default MainContent;