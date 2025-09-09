import React from 'react';
import ContentEditable from 'react-contenteditable';

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  onEnterPress: () => void;
}

const TitleInput: React.FC<TitleInputProps> = ({ value, onChange, onEnterPress }) => {
  const handleChange = (e: any) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnterPress();
    }
  };
  
  return (
    <ContentEditable
      html={value}
      disabled={false}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      tagName="h1"
      className={`w-full outline-none leading-tight text-4xl font-bold mb-8
        ${!value ? 'before:content-[attr(data-placeholder)] before:text-gray-400 before:dark:text-zinc-500 before:absolute' : ''}`
      }
      data-placeholder="제목 없음"
    />
  );
};

export default TitleInput;