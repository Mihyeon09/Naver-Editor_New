import React, { useState, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import Header from './components/Header';
import TopToolbar from './components/TopToolbar';
import BottomToolbar from './components/BottomToolbar';
import MainContent from './components/MainContent';
import BottomBar from './components/BottomBar';
import SideIcons from './components/SideIcons';
import BlockMenu from './components/BlockMenu';
import './index.css';

export type Theme = 'light' | 'dark';
export type BlockType = 'p' | 'h1' | 'h2' | 'image';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
}

export interface MenuState {
  isOpen: boolean;
  position: { top: number; left: number };
  blockId: string | null;
}

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [blocks, setBlocks] = useState<Block[]>([
    { id: nanoid(), type: 'h1', content: '' },
    { id: nanoid(), type: 'p', content: '' },
  ]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [saveCount, setSaveCount] = useState(0);
  const [activeTab, setActiveTab] = useState('음악 글감');
  const [nextFocusId, setNextFocusId] = useState<string | null>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [menuState, setMenuState] = useState<MenuState>({
    isOpen: false,
    position: { top: 0, left: 0 },
    blockId: null,
  });
  const menuRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuState.isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeBlockMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuState.isOpen]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSave = () => {
    setSaveCount(prev => prev + 1);
    console.log('Saved');
  };

  const handlePublish = () => {
    console.log('Published');
    alert('발행되었습니다!');
  };
  
  const updateBlock = (id: string, newContent: string) => {
    setBlocks(blocks.map(block => block.id === id ? { ...block, content: newContent } : block));
  };
  
  const changeBlockType = (id: string, newType: BlockType) => {
    if (!id) return;
    setBlocks(blocks.map(block => block.id === id ? { ...block, type: newType } : block));
    closeBlockMenu();
  };

  const addBlockAfter = (currentBlockId: string) => {
    const newBlock: Block = { id: nanoid(), type: 'p', content: '' };
    const currentIndex = blocks.findIndex(b => b.id === currentBlockId);
    const newBlocks = [...blocks];
    newBlocks.splice(currentIndex + 1, 0, newBlock);
    setBlocks(newBlocks);
    setNextFocusId(newBlock.id);
  };
  
  const addImageBlock = (imageDataUrl: string) => {
    const newBlock: Block = { id: nanoid(), type: 'image', content: imageDataUrl };
    const currentIndex = activeBlockId ? blocks.findIndex(b => b.id === activeBlockId) : blocks.length - 1;
    
    const newBlocks = [...blocks];
    newBlocks.splice(currentIndex + 1, 0, newBlock);
    setBlocks(newBlocks);
  };

  const deleteBlock = (blockId: string) => {
    if (blocks.length <= 1) return; // Don't delete the last block
    const blockIndex = blocks.findIndex(b => b.id === blockId);
    const newBlocks = blocks.filter(b => b.id !== blockId);
    setBlocks(newBlocks);
    if (blockIndex > 0) {
      setNextFocusId(newBlocks[blockIndex - 1].id);
    }
     closeBlockMenu();
  };
  
  const duplicateBlock = (blockId: string) => {
    const blockToDuplicate = blocks.find(b => b.id === blockId);
    if (!blockToDuplicate) return;
    const newBlock: Block = { ...blockToDuplicate, id: nanoid() };
    const currentIndex = blocks.findIndex(b => b.id === blockId);
    const newBlocks = [...blocks];
    newBlocks.splice(currentIndex + 1, 0, newBlock);
    setBlocks(newBlocks);
    setNextFocusId(newBlock.id);
    closeBlockMenu();
  };
  
  const openBlockMenu = (blockId: string, ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setMenuState({
            isOpen: true,
            position: { top: rect.top + window.scrollY, left: rect.left + window.scrollX - 220 },
            blockId,
        });
    }
  };

  const closeBlockMenu = () => {
    setMenuState({ isOpen: false, position: { top: 0, left: 0 }, blockId: null });
  };

  const moveBlock = (dragId: string, dropId: string) => {
    const draggedIndex = blocks.findIndex(b => b.id === dragId);
    const dropIndex = blocks.findIndex(b => b.id === dropId);
    
    if (draggedIndex === -1 || dropIndex === -1) return;

    const newBlocks = [...blocks];
    const [draggedItem] = newBlocks.splice(draggedIndex, 1);
    const newDropIndex = newBlocks.findIndex(b => b.id === dropId); // Recalculate index after splice
    newBlocks.splice(newDropIndex, 0, draggedItem);
    
    setBlocks(newBlocks);
  };

  const activeBlock = blocks.find(block => block.id === activeBlockId);

  return (
    <div className={`flex flex-col h-screen font-sans bg-slate-50 dark:bg-zinc-900 transition-colors`}>
      <Header 
        saveCount={saveCount}
        onSave={handleSave}
        onPublish={handlePublish}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <div className="flex-grow flex flex-col overflow-hidden">
        <TopToolbar onAddImageBlock={addImageBlock} />
        <BottomToolbar activeBlock={activeBlock} onChangeBlockType={changeBlockType}/>
        <MainContent 
          blocks={blocks} 
          onUpdateBlock={updateBlock} 
          onSetActiveBlock={setActiveBlockId}
          activeBlockId={activeBlockId}
          onAddBlockAfter={addBlockAfter}
          onDeleteBlock={deleteBlock}
          nextFocusId={nextFocusId}
          onSetNextFocusId={setNextFocusId}
          onOpenBlockMenu={openBlockMenu}
          onMoveBlock={moveBlock}
          draggedBlockId={draggedBlockId}
          onSetDraggedBlockId={setDraggedBlockId}
        />
      </div>
      <SideIcons />
      <BottomBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {menuState.isOpen && menuState.blockId && (
        <div ref={menuRef} style={{ position: 'absolute', top: menuState.position.top, left: menuState.position.left, zIndex: 50 }}>
          <BlockMenu
            blockId={menuState.blockId}
            onDelete={deleteBlock}
            onDuplicate={duplicateBlock}
            onChangeBlockType={changeBlockType}
            currentType={blocks.find(b => b.id === menuState.blockId)?.type || 'p'}
          />
        </div>
      )}
    </div>
  );
};

export default App;