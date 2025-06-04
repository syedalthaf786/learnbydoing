import { useState, useCallback } from 'react';

function useFileUpload(options = {}) {
  const {
    maxSize = 5242880, // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
    maxFiles = 1
  } = options;

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState(null);

  const validateFile = useCallback((file) => {
    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not supported');
    }
    if (file.size > maxSize) {
      throw new Error('File size too large');
    }
  }, [allowedTypes, maxSize]);

  const handleFiles = useCallback((fileList) => {
    try {
      setError(null);
      const newFiles = Array.from(fileList);

      if (newFiles.length > maxFiles) {
        throw new Error(`Maximum ${maxFiles} files allowed`);
      }

      newFiles.forEach(validateFile);

      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      
      setFiles(newFiles);
      setPreviews(newPreviews);

      return newFiles;
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, [maxFiles, validateFile]);

  const clearFiles = useCallback(() => {
    previews.forEach(URL.revokeObjectURL);
    setFiles([]);
    setPreviews([]);
    setError(null);
  }, [previews]);

  return {
    files,
    previews,
    error,
    handleFiles,
    clearFiles
  };
}

export default useFileUpload;