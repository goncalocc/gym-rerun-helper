import { Dispatch, SetStateAction, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneProps {
  handleFileImport: (event: React.MouseEvent<HTMLButtonElement>) => void;
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
}

const Dropzone: React.FC<DropzoneProps> = ({
  handleFileImport,
  file,
  setFile,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFile(acceptedFiles[0]); // Store the first selected file
    },
    [setFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false, // Allow only one file
    accept: { 'application/json': ['.json'] }, // Restrict to JSON files
  });

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        {...getRootProps()}
        className="flex h-36 w-full cursor-pointer items-center justify-center rounded-xl border-4 border-dashed border-gray-400 bg-gray-300 p-4 text-center hover:bg-gray-200 sm:w-64 md:w-80 lg:w-96"
      >
        <input {...getInputProps()} />
        {file ? (
          <p className="text-lg text-green-600">File selected: {file.name}</p>
        ) : isDragActive ? (
          <p className="text-lg text-blue-600">Drop the file here...</p>
        ) : (
          <p className="text-lg text-gray-600">
            Drag a file here or click to select
          </p>
        )}
      </div>

      <button
        onClick={handleFileImport}
        className={`rounded-md bg-blue-500 px-6 py-3 text-lg text-white ${
          !file && 'cursor-not-allowed opacity-50'
        }`}
        disabled={!file}
      >
        Import Teams
      </button>
    </div>
  );
};

export default Dropzone;
