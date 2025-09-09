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
  onSetActiveBlock: (id: string | null) => void;
  activeBlockId: string | null;
  onAddBlockAfter: (currentBlockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
  nextFocusId: string | null;
  onSetNextFocusId: (id: string | null) => void;
  onOpenBlockMenu: (blockId: string, ref: React.RefObject<HTMLDivElement>) => void;
  onMoveBlock: (dragId: string, dropId: string) => void;
  draggedBlockId: string | null;
  onSetDraggedBlockId: (id: string | null) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  title,
  onTitleChange,
  onTitleEnter,
  blocks,
  onUpdateBlock,
  onSetActiveBlock,
  activeBlockId,
  onAddBlockAfter,
  onDeleteBlock,
  nextFocusId,
  onSetNextFocusId,
  onOpenBlockMenu,
  onMoveBlock,
  draggedBlockId,
  onSetDraggedBlockId
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
                onFocus={() => onSetActiveBlock(block.id)}
                onOpenMenu={onOpenBlockMenu}
                onMoveBlock={onMoveBlock}
                draggedBlockId={draggedBlockId}
                onSetDraggedBlockId={onSetDraggedBlockId}
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
              onAddBlockAfter={onAddBlockAfter}
              onDeleteBlock={onDeleteBlock}
              isFirst={index === 0}
              shouldFocus={nextFocusId === block.id}
              onDoneFocusing={() => onSetNextFocusId(null)}
              onOpenMenu={onOpenBlockMenu}
              onMoveBlock={onMoveBlock}
              draggedBlockId={draggedBlockId}
              onSetDraggedBlockId={onSetDraggedBlockId}
            />
          );
        })}
      </div>
    </main>
  );
};

export default MainContent;