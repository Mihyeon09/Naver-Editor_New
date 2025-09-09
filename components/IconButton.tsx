import React from 'react';

interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-transparent border-none cursor-pointer flex flex-col items-center text-xs text-gray-600 dark:text-gray-300 gap-1 p-1.5 rounded transition-colors hover:bg-slate-100 dark:hover:bg-zinc-700"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default IconButton;