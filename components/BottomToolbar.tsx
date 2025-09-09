import React from 'react';
import {
  AlignLeftIcon, AlignCenterIcon, AlignRightIcon, AlignJustifyIcon,
  SpellcheckIcon, BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon,
  TextColorIcon, BgColorIcon, LineHeightIcon, QuoteIcon, DividerIcon,
  ListIcon, ListNumbersIcon, OutdentIcon, IndentIcon
} from './Icons';
import { Block, BlockType } from '../App';

interface BottomToolbarProps {
  activeBlock: Block | undefined;
  onChangeBlockType: (blockId: string, newType: BlockType) => void;
}


const ToolbarButton: React.FC<{ children: React.ReactNode; 'aria-label': string }> = ({ children, 'aria-label': ariaLabel }) => (
  <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50" aria-label={ariaLabel} disabled>
    {children}
  </button>
);

const ToolbarSeparator = () => <div className="w-px h-5 bg-slate-200 dark:bg-zinc-600" />;

const BottomToolbar: React.FC<BottomToolbarProps> = ({ activeBlock, onChangeBlockType }) => {
  const customArrow = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`;

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (activeBlock) {
      onChangeBlockType(activeBlock.id, e.target.value as BlockType);
    }
  };

  return (
    <nav className="flex items-center py-2.5 px-5 border-b border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex-wrap gap-x-4 gap-y-2 transition-colors">
      <div className="flex gap-1.5 items-center">
        <select
          aria-label="단락 스타일"
          value={activeBlock?.type || 'p'}
          onChange={handleTypeChange}
          disabled={!activeBlock}
          className="py-1 px-2 border border-slate-300 dark:border-zinc-600 rounded text-sm appearance-none pr-8 bg-no-repeat bg-right bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundImage: customArrow, minWidth: '80px' }}
        >
          <option value="p">본문</option>
          <option value="h1">제목1</option>
          <option value="h2">제목2</option>
        </select>
        <select
          aria-label="글꼴"
          className="py-1 px-2 border border-slate-300 dark:border-zinc-600 rounded text-sm appearance-none pr-8 bg-no-repeat bg-right bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200 transition-colors disabled:opacity-50"
          style={{ backgroundImage: customArrow, minWidth: '100px' }}
          disabled
        >
          <option value="nanumgothic">나눔고딕</option>
        </select>
        <select
          aria-label="글자 크기"
          className="py-1 px-2 border border-slate-300 dark:border-zinc-600 rounded text-sm appearance-none pr-8 bg-no-repeat bg-right bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200 transition-colors disabled:opacity-50"
          style={{ backgroundImage: customArrow, minWidth: '60px' }}
          disabled
        >
          <option value="16">16</option>
        </select>
      </div>

      <ToolbarSeparator />

      <div className="flex gap-0.5 items-center">
        <ToolbarButton aria-label="굵게"><BoldIcon /></ToolbarButton>
        <ToolbarButton aria-label="기울임"><ItalicIcon /></ToolbarButton>
        <ToolbarButton aria-label="밑줄"><UnderlineIcon /></ToolbarButton>
        <ToolbarButton aria-label="취소선"><StrikethroughIcon /></ToolbarButton>
      </div>
      <div className="flex gap-0.5 items-center">
        <ToolbarButton aria-label="글자 색"><TextColorIcon /></ToolbarButton>
        <ToolbarButton aria-label="글자 배경 색"><BgColorIcon /></ToolbarButton>
      </div>

      <ToolbarSeparator />

      <div className="flex gap-0.5 items-center">
        <ToolbarButton aria-label="왼쪽 정렬"><AlignLeftIcon /></ToolbarButton>
        <ToolbarButton aria-label="가운데 정렬"><AlignCenterIcon /></ToolbarButton>
        <ToolbarButton aria-label="오른쪽 정렬"><AlignRightIcon /></ToolbarButton>
        <ToolbarButton aria-label="양쪽 정렬"><AlignJustifyIcon /></ToolbarButton>
      </div>
      <div className="flex gap-0.5 items-center">
        <ToolbarButton aria-label="줄 간격"><LineHeightIcon /></ToolbarButton>
      </div>

      <ToolbarSeparator />

      <div className="flex gap-0.5 items-center">
        <ToolbarButton aria-label="인용구"><QuoteIcon /></ToolbarButton>
        <ToolbarButton aria-label="구분선"><DividerIcon /></ToolbarButton>
        <ToolbarButton aria-label="글머리 기호"><ListIcon /></ToolbarButton>
        <ToolbarButton aria-label="번호 매기기"><ListNumbersIcon /></ToolbarButton>
        <ToolbarButton aria-label="내어쓰기"><OutdentIcon /></ToolbarButton>
        <ToolbarButton aria-label="들여쓰기"><IndentIcon /></ToolbarButton>
      </div>
      
      <div className="flex gap-1.5 items-center ml-auto">
        <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors text-gray-700 dark:text-gray-300" aria-label="맞춤법 검사"><SpellcheckIcon /></button>
      </div>
    </nav>
  );
};

export default BottomToolbar;