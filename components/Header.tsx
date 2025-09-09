import React from 'react';
import { LibraryIcon, TemplateIcon, MoreIcon, SunIcon, MoonIcon } from './Icons';
import { Theme } from '../App';

interface HeaderProps {
  saveCount: number;
  onSave: () => void;
  onPublish: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ saveCount, onSave, onPublish, theme, onToggleTheme }) => {
  return (
    <header className="flex justify-between items-center py-4 px-5 border-b border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 transition-colors">
      <div className="header-left flex items-center">
        <span className="font-bold text-2xl text-[#03c75a]">N</span>
        <span className="ml-1.5 text-lg font-normal text-black dark:text-gray-200 align-middle">블로그</span>
      </div>
      <div className="header-right flex items-center gap-2.5">
        <button 
          className="py-2 px-4 border-none rounded bg-slate-100 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 font-bold text-sm hover:bg-slate-200 dark:hover:bg-zinc-600 transition-colors"
          onClick={onSave}
          aria-label={`임시 저장된 글 ${saveCount}개`}
        >
          저장 <span className="ml-1 text-[#03c75a]">{saveCount}</span>
        </button>
        <button 
          className="py-2 px-4 border-none rounded bg-[#03c75a] text-white font-bold text-sm ml-2.5 hover:bg-green-600 transition-colors"
          onClick={onPublish}
        >
          발행
        </button>
        <div className="flex items-center gap-1 ml-5 text-gray-700 dark:text-gray-300">
           <button onClick={onToggleTheme} className="w-8 h-8 p-0 flex justify-center items-center bg-transparent border-none cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-zinc-700" aria-label="Toggle theme">
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          <button className="w-8 h-8 p-0 flex justify-center items-center bg-transparent border-none cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-zinc-700" aria-label="내 서재">
            <LibraryIcon />
          </button>
          <button className="w-8 h-8 p-0 flex justify-center items-center bg-transparent border-none cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-zinc-700" aria-label="템플릿">
            <TemplateIcon />
          </button>
          <button className="w-8 h-8 p-0 flex justify-center items-center bg-transparent border-none cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-zinc-700" aria-label="더보기">
            <MoreIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;