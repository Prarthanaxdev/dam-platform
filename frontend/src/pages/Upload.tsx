import React, { useRef, useState } from 'react';
import { useUpload } from '../hooks/useUpload';

export default function Upload() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUpload();

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles((prev) => {
        const newFiles = Array.from(e.dataTransfer.files).filter(
          (file) => !prev.some((f) => f.name === file.name && f.size === file.size)
        );
        return [...prev, ...newFiles].slice(0, 10);
      });
    }
  };

  const handleRemoveFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const newFiles = Array.from(fileList).filter(
        (file) => !files.some((f) => f.name === file.name && f.size === file.size)
      );
      setFiles((prev) => {
        return [...prev, ...newFiles].slice(0, 10);
      });
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setMessage(null);
    uploadMutation.mutate(files, {
      onSuccess: () => {
        setMessage('Upload successful!');
        setFiles([]);
      },
      onError: () => {
        setMessage('Upload failed. Please try again.');
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-1">Upload Assets</h2>
      <p className="text-gray-500 mb-8">Add new files to your asset library</p>
      <div
        className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center bg-gray-50 transition-colors duration-200 ${
          dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{ cursor: 'pointer', minHeight: 320 }}
      >
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          ref={inputRef}
          onChange={handleChange}
        />
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-gray-100 p-6 mb-4">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16"
              />
            </svg>
          </div>
          <p className="text-lg font-semibold mb-1">Drag & drop files</p>
          <p className="text-gray-500 mb-2">or click to browse from your computer</p>
          <p className="text-gray-400 text-sm">
            Supports images, videos, audio, and documents up to 100MB each
          </p>
        </div>
      </div>
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Files to upload:</h3>
          <ul className="mb-4">
            {files.map((file, idx) => (
              <li key={idx} className="text-gray-700 text-sm flex items-center gap-2">
                <span>
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
                <button
                  type="button"
                  className="ml-2 p-1 rounded-full hover:bg-gray-200"
                  aria-label="Remove file"
                  onClick={() => handleRemoveFile(idx)}
                >
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            onClick={handleUpload}
            disabled={uploadMutation.isPending || files.length === 0}
          >
            {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
          </button>
          {files.length === 10 && (
            <div className="text-xs text-gray-500 mt-2">
              Maximum 10 files can be uploaded at once.
            </div>
          )}
        </div>
      )}
      {message && (
        <div className="mt-4 text-center text-sm font-medium text-red-500">{message}</div>
      )}
    </div>
  );
}
