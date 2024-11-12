import React from 'react';

export interface NotificationBarProps {
  message: string;
  type: string;
  onClose: () => void;
}

const NotificationBar: React.FC<NotificationBarProps> = ({
  message,
  type,
  onClose,
}) => {
  const baseStyle =
    'fixed top-0 left-0 w-full flex justify-between items-center p-4 shadow-md z-50';

  type Type = 'success' | 'error' | 'warning';
  const typeStyles: { [key in Type]: string } = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black',
  };
  const typeStyle: string = typeStyles[type as Type] || '';

  return (
    <div className={`${baseStyle} ${typeStyle}`}>
      <span>{message}</span>
      <button onClick={onClose} className="font-bold text-white">
        X
      </button>
    </div>
  );
};

export default NotificationBar;
