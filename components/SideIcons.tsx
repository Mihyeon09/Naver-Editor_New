import React from 'react';
import { MonitorIcon, QuestionIcon } from './Icons';

const SideIcons: React.FC = () => {
  return (
    <div className="hidden lg:flex fixed top-1/2 -translate-y-1/2 right-[calc(50%-theme(maxWidth.6xl)/2-60px)] flex-col gap-2.5 z-50">
      <button className="w-10 h-10 rounded-full bg-white dark:bg-zinc-700 shadow-md flex justify-center items-center p-0 border-none hover:bg-slate-100 dark:hover:bg-zinc-600 transition-colors text-gray-700 dark:text-gray-300">
        <MonitorIcon />
      </button>
      <button className="w-10 h-10 rounded-full bg-white dark:bg-zinc-700 shadow-md flex justify-center items-center p-0 border-none hover:bg-slate-100 dark:hover:bg-zinc-600 transition-colors text-gray-700 dark:text-gray-300">
        <QuestionIcon />
      </button>
    </div>
  );
};

export default SideIcons;