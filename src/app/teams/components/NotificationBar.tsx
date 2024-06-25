import React from 'react';

export interface NotificationBarProps {
    message: string;
    type: string;
    onClose: () => void;
}

const NotificationBar: React.FC<NotificationBarProps> = ({ message, type, onClose }) => {
  const baseStyle = "fixed top-0 left-0 w-full flex justify-between items-center p-4 shadow-md z-50";
  const typeStyle = type === 'success' ? 'bg-green-500 text-white' : '';

  return (
    <div className={`${baseStyle} ${typeStyle}`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-white font-bold">X</button>
    </div>
  );
};

export default NotificationBar;