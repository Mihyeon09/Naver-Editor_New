import React from 'react';

interface HeaderProps {
  saveCount: number;
  onSave: () => void;
  onPublish: () => void;
}

const Header: React.FC<HeaderProps> = ({ saveCount, onSave, onPublish }) => {
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
      </div>
    </header>
  );
};

export default Header;