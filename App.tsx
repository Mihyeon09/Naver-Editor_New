import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import Header from './components/Header';
import MainContent from './components/MainContent';
import BottomBar from './components/BottomBar';
import SideIcons from './components/SideIcons';
import BlockMenu from './components/BlockMenu';
import SlashCommandMenu from './components/SlashCommandMenu';
import ImageUploadMenu from './components/ImageUploadMenu';
import { TextIcon, Heading1Icon, Heading2Icon, Heading3Icon, PhotoIcon } from './components/Icons';
import { createPortal } from 'react-dom';

export type BlockType = 'p' | 'h1' | 'h2' | 'h3' | 'image';
export type Theme = 'light' | 'dark';
export type CommandValue = BlockType | 'upload-image';


export interface Block {
  id: string;
  type: BlockType;
  content: string;
  data?: {
    src?: string;
    caption?: string;
    [key: string]: any;
  };
}

export interface CommandItem {
  value: CommandValue;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const initialBlocks: Block[] = [
  { id: `block-${Date.now()}`, type: 'p', content: '' },
];

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [saveCount, setSaveCount] = useState(0);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [nextFocusId, setNextFocusId] = useState<string | null>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [blockMenuState, setBlockMenuState] = useState<{ x: number; y: number; blockId: string } | null>(null);
  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [slashMenuFilter, setSlashMenuFilter] = useState('');
  const [slashMenuBlockId, setSlashMenuBlockId] = useState<string | null>(null);
  const [slashMenuSelectedIndex, setSlashMenuSelectedIndex] = useState(0);
  const [isImageUploadMenuOpen, setIsImageUploadMenuOpen] = useState(false);


  const mainContentRef = useRef<HTMLDivElement>(null);

  const commandItems: CommandItem[] = [
    { value: 'p', icon: <TextIcon />, title: '텍스트', description: '일반 텍스트를 입력합니다.' },
    { value: 'h1', icon: <Heading1Icon />, title: '제목 1', description: '가장 큰 제목입니다.' },
    { value: 'h2', icon: <Heading2Icon />, title: '제목 2', description: '중간 크기 제목입니다.' },
    { value: 'h3', icon: <Heading3Icon />, title: '제목 3', description: '작은 크기 제목입니다.' },
    { value: 'upload-image', icon: <PhotoIcon />, title: '이미지', description: '이미지를 업로드합니다.' },
  ];

  const filteredCommands = commandItems.filter(cmd =>
    cmd.title.toLowerCase().includes(slashMenuFilter.toLowerCase()) ||
    cmd.description.toLowerCase().includes(slashMenuFilter.toLowerCase())
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleToggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const handleSave = () => setSaveCount(prev => prev + 1);
  const handlePublish = () => alert('Published!');

  const findBlockIndex = (blockId: string) => blocks.findIndex(b => b.id === blockId);

  const addBlock = (newBlock: Omit<Block, 'id'>, atIndex: number) => {
    const block = { ...newBlock, id: `block-${Date.now()}` };
    const newBlocks = [...blocks];
    newBlocks.splice(atIndex + 1, 0, block);
    setBlocks(newBlocks);
    setNextFocusId(block.id);
  };
  
  const handleAddImageBlock = (imageDataUrl: string) => {
    const newBlock: Omit<Block, 'id'> = { type: 'image', content: '', data: { src: imageDataUrl, caption: '' } };
    const currentIndex = activeBlockId ? findBlockIndex(activeBlockId) : blocks.length - 1;
    addBlock(newBlock, currentIndex);
    setIsImageUploadMenuOpen(false);
  };

  const handleUpdateBlock = (id: string, content: string) => {
    setBlocks(prev => prev.map(b => (b.id === id ? { ...b, content } : b)));
  };
  
  const handleUpdateBlockData = (id: string, data: Partial<NonNullable<Block['data']>>) => {
    setBlocks(prev => prev.map(b => (b.id === id ? { ...b, data: {...b.data, ...data} } : b)));
  };

  const handleChangeBlockType = (id: string, newType: BlockType) => {
    setBlocks(prev => prev.map(b => (b.id === id ? { ...b, type: newType, content: newType === 'image' ? '' : b.content } : b)));
    setIsSlashMenuOpen(false);
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };
  
  const handleTitleEnter = () => {
    if (blocks.length > 0) {
      setNextFocusId(blocks[0].id);
    } else {
      addBlock({type: 'p', content: ''}, -1);
    }
  };

  const handleMoveBlock = (dragId: string, dropId: string) => {
    const dragIndex = findBlockIndex(dragId);
    const dropIndex = findBlockIndex(dropId);
    if (dragIndex === -1 || dropIndex === -1) return;

    const newBlocks = [...blocks];
    const [draggedBlock] = newBlocks.splice(dragIndex, 1);
    newBlocks.splice(dropIndex, 0, draggedBlock);
    setBlocks(newBlocks);
  };

  const handleAiImageCorrection = async (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block || block.type !== 'image' || !block.data?.src) return;

    const [header, base64Data] = block.data.src.split(',');
    if (!base64Data) return;
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';

    handleUpdateBlockData(blockId, { caption: 'AI로 이미지 보정 중...' });
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: mimeType } },
            { text: 'Slightly enhance this image to be clearer and more vibrant, maintaining the original style.' },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });
      
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const newSrc = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          handleUpdateBlockData(blockId, { src: newSrc, caption: 'AI로 보정된 이미지' });
          return;
        }
      }
    } catch (error) {
      console.error('AI image correction failed', error);
      handleUpdateBlockData(blockId, { caption: 'AI 보정 실패' });
    }
  };
  
  const handleOpenBlockMenu = (blockId: string, ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setBlockMenuState({ x: rect.left, y: rect.bottom, blockId });
    }
  };

  const handleOpenSlashMenu = (blockId: string, position: { top: number, left: number }) => {
    setSlashMenuBlockId(blockId);
    setSlashMenuPosition(position);
    setIsSlashMenuOpen(true);
    setSlashMenuSelectedIndex(0);
  };

  const handleCloseSlashMenu = useCallback(() => {
    setIsSlashMenuOpen(false);
    setSlashMenuFilter('');
    setSlashMenuBlockId(null);
  }, []);
  
  const openImageUploadMenu = () => {
    setIsImageUploadMenuOpen(true);
  };

  const handleCommandSelect = (id: string, value: CommandValue) => {
    handleCloseSlashMenu();
    if (value === 'upload-image') {
      handleUpdateBlock(id, ''); 
      openImageUploadMenu();
    } else {
      handleChangeBlockType(id, value);
    }
  };

  const handleSlashMenuKeyDown = useCallback((key: 'ArrowUp' | 'ArrowDown' | 'Enter') => {
    if (!isSlashMenuOpen) return;
    if (key === 'ArrowUp') {
      setSlashMenuSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
    } else if (key === 'ArrowDown') {
      // FIX: ArrowDown should increment the index, not decrement it.
      setSlashMenuSelectedIndex(prev => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
    } else if (key === 'Enter') {
      if (slashMenuBlockId && filteredCommands[slashMenuSelectedIndex]) {
        handleCommandSelect(slashMenuBlockId, filteredCommands[slashMenuSelectedIndex].value);
      }
    }
  }, [isSlashMenuOpen, slashMenuBlockId, filteredCommands, slashMenuSelectedIndex, handleCommandSelect]);

  return (
    <>
      <div ref={mainContentRef} className="h-screen flex flex-col font-sans bg-white dark:bg-zinc-800">
        <Header saveCount={saveCount} onSave={handleSave} onPublish={handlePublish} theme={theme} onToggleTheme={handleToggleTheme} />
        <div className="flex-grow flex flex-col overflow-hidden">
          <MainContent
            title={title}
            onTitleChange={setTitle}
            onTitleEnter={handleTitleEnter}
            blocks={blocks}
            onUpdateBlock={handleUpdateBlock}
            onUpdateBlockData={handleUpdateBlockData}
            onAiImageCorrection={handleAiImageCorrection}
            onSetActiveBlock={setActiveBlockId}
            activeBlockId={activeBlockId}
            onDeleteBlock={handleDeleteBlock}
            nextFocusId={nextFocusId}
            onSetNextFocusId={setNextFocusId}
            onOpenBlockMenu={handleOpenBlockMenu}
            onMoveBlock={handleMoveBlock}
            draggedBlockId={draggedBlockId}
            onSetDraggedBlockId={setDraggedBlockId}
            isSlashMenuOpen={isSlashMenuOpen}
            onOpenSlashMenu={handleOpenSlashMenu}
            onCloseSlashMenu={handleCloseSlashMenu}
            onUpdateSlashMenuFilter={setSlashMenuFilter}
            onSlashMenuKeyDown={handleSlashMenuKeyDown}
          />
        </div>
        <BottomBar onOpenImageUploadMenu={openImageUploadMenu} />
        <SideIcons />
      </div>

      {blockMenuState && createPortal(
        <BlockMenu
          x={blockMenuState.x}
          y={blockMenuState.y}
          blockId={blockMenuState.blockId}
          onDelete={handleDeleteBlock}
          onClose={() => setBlockMenuState(null)}
        />,
        document.body
      )}

      {isSlashMenuOpen && slashMenuPosition && slashMenuBlockId && createPortal(
        <div className="fixed z-50" style={{ top: slashMenuPosition.top, left: slashMenuPosition.left }}>
          <SlashCommandMenu
            blockId={slashMenuBlockId}
            commands={filteredCommands}
            selectedIndex={slashMenuSelectedIndex}
            onCommandSelect={handleCommandSelect}
            onClose={handleCloseSlashMenu}
          />
        </div>,
        document.body
      )}

      {isImageUploadMenuOpen && createPortal(
        <ImageUploadMenu 
            onClose={() => setIsImageUploadMenuOpen(false)} 
            onImageSelect={handleAddImageBlock} 
        />,
        document.body
      )}
    </>
  );
};

export default App;