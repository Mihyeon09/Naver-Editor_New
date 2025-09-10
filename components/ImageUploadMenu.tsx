import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PhotoIcon, UnsplashIcon, GiphyIcon, UploadCloudIcon } from './Icons';

interface ImageUploadMenuProps {
  onClose: () => void;
  onImageSelect: (dataUrl: string) => void;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button onClick={onClick} className={`px-3 py-2 text-sm font-medium transition-colors relative ${active ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}>
    {children}
    {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />}
  </button>
);

const ImageUploadMenu: React.FC<ImageUploadMenuProps> = ({ onClose, onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('upload');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageSelect(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-zinc-800 rounded-lg shadow-2xl w-[560px] text-white p-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-zinc-700 pb-3 mb-3">
          <PhotoIcon className="w-5 h-5 text-zinc-400" />
          <h2 className="font-semibold">이미지 추가</h2>
        </div>
        
        <div className="flex items-center border-b border-zinc-700">
          <TabButton active={activeTab === 'upload'} onClick={() => setActiveTab('upload')}>업로드</TabButton>
          <TabButton active={activeTab === 'embed'} onClick={() => setActiveTab('embed')}>링크 임베드</TabButton>
          <TabButton active={activeTab === 'unsplash'} onClick={() => setActiveTab('unsplash')}>
            <span className="flex items-center gap-1.5"><UnsplashIcon className="w-4 h-4" /> Unsplash</span>
          </TabButton>
          <TabButton active={activeTab === 'giphy'} onClick={() => setActiveTab('giphy')}>
            <span className="flex items-center gap-1.5"><GiphyIcon className="w-4 h-4" /> GIPHY</span>
          </TabButton>
        </div>
        
        <div className="py-8">
            {activeTab === 'upload' && (
                <div className="flex flex-col items-center justify-center gap-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full text-center py-10 border-2 border-dashed border-zinc-600 rounded-lg hover:bg-zinc-700 hover:border-zinc-500 transition-colors"
                    >
                        <div className="flex flex-col items-center gap-2 text-zinc-400">
                            <UploadCloudIcon className="w-8 h-8"/>
                            <span className="font-semibold text-white">파일 업로드</span>
                            <span className="text-sm">이미지를 드래그하거나 클릭하여 업로드하세요.</span>
                        </div>
                    </button>
                    <p className="text-xs text-zinc-400 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                        5MB를 초과하는 파일 사용을 위해 <a href="#" className="text-blue-500 hover:underline">업그레이드하기</a>
                    </p>
                </div>
            )}
            {activeTab !== 'upload' && (
                 <div className="text-center py-16 text-zinc-500">
                    이 기능은 현재 지원되지 않습니다.
                 </div>
            )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ImageUploadMenu;
