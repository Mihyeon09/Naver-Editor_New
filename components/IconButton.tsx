import React from 'react';

// This component is currently not used in the application.
// It can be used as a template for creating icon buttons.

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      {...props}
      className={`w-8 h-8 p-0 flex justify-center items-center bg-transparent border-none cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors ${className || ''}`}
    >
      {children}
    </button>
  );
};

export default IconButton;
