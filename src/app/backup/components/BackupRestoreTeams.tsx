'use client';

import { useState } from 'react';

const BackupRestoreTeams: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');

  return (
    <div className="flex h-screen flex-col p-4">
      <textarea
        className="w-full flex-grow resize-none rounded border p-2 text-lg"
        value={inputValue}
      />
      <div className="mt-4 flex justify-end space-x-4">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          //   onClick={handleSave}
        >
          Save
        </button>
        <button
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          //   onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BackupRestoreTeams;
