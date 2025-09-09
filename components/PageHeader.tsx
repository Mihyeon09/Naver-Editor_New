import React from 'react';
import { StickerIcon, PhotoIcon, CommentIcon } from './Icons'; 

const PageHeaderButton: React.FC<{icon: React.ReactNode, label: string}> = ({icon, label}) => (
    <button className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-700 p-1 rounded-md transition-colors">
        {icon}
        <span>{label}</span>
    </button>
);

const PageHeader: React.FC = () => {
    return (
        <div className="flex items-center gap-4 mb-2">
            <PageHeaderButton icon={<StickerIcon />} label="아이콘 추가" />
            <PageHeaderButton icon={<PhotoIcon />} label="커버 추가" />
            <PageHeaderButton icon={<CommentIcon />} label="댓글 추가" />
        </div>
    );
};

export default PageHeader;
