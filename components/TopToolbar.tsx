import React, { useRef } from 'react';
import IconButton from './IconButton';
import { PhotoIcon, MyboxIcon, VideoIcon, StickerIcon, LinkIcon, FileIcon, ScheduleIcon, CodeIcon, TableIcon, FormulaIcon, LocationIcon, MyPurchaseIcon, ContentIcon } from './Icons';

interface TopToolbarProps {
  onAddImageBlock: (imageDataUrl: string) => void;
}

const TopToolbar: React.FC<TopToolbarProps> = ({ onAddImageBlock }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onAddImageBlock(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
     // Reset file input to allow uploading the same file again
    event.target.value = '';
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const toolbarItems = [
    { icon: <PhotoIcon />, label: '사진', action: triggerFileUpload },
    { icon: <MyboxIcon />, label: 'MYBOX' },
    { icon: <VideoIcon />, label: '동영상' },
    { icon: <StickerIcon />, label: '스티커' },
    { icon: <LinkIcon />, label: '링크' },
    { icon: <FileIcon />, label: '파일' },
    { icon: <ScheduleIcon />, label: '일정' },
    { icon: <CodeIcon />, label: '소스코드' },
    { icon: <TableIcon />, label: '표' },
    { icon: <FormulaIcon />, label: '수식' },
    { icon: <LocationIcon />, label: '장소' },
    { icon: <MyPurchaseIcon />, label: '내돈내산' },
    { icon: <ContentIcon />, label: '글감' },
  ];

  const handleClick = (label: string, action?: () => void) => {
    if (action) {
      action();
    } else {
      console.log(`${label} 아이콘 클릭됨`);
    }
  };

  return (
    <nav className="flex items-center p-2.5 px-5 border-b border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex-wrap gap-x-2.5 gap-y-1 transition-colors">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      {toolbarItems.map((item, index) => (
        <IconButton
          key={index}
          icon={item.icon}
          label={item.label}
          onClick={() => handleClick(item.label, item.action)}
        />
      ))}
    </nav>
  );
};

export default TopToolbar;