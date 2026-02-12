import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';

interface SignatureStepProps {
  signatureFile: File | null;
  onNext: (file: File | null) => void;
  loading?: boolean;
}

export const SignatureStep: React.FC<SignatureStepProps> = ({
  signatureFile: initialSignatureFile,
  onNext,
  loading = false,
}) => {
  const [signatureFile, setSignatureFile] = useState<File | null>(initialSignatureFile);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Load preview if initial file exists
  React.useEffect(() => {
    if (initialSignatureFile) {
      if (initialSignatureFile.type.startsWith('image/') || initialSignatureFile.type.includes('pdf')) {
        const url = URL.createObjectURL(initialSignatureFile);
        setPreviewUrl(url);
      }
    }
  }, [initialSignatureFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setSignatureFile(file);

      // Create preview URL for images and PDFs
      if (file.type.startsWith('image/') || file.type.includes('pdf')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setSignatureFile(file);
      if (file.type.startsWith('image/') || file.type.includes('pdf')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleRemove = () => {
    setSignatureFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center">
          {previewUrl ? (
            <iframe
              src={previewUrl}
              title="PDF Preview"
              className="w-full h-80 rounded-lg border"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center w-full">
              <div className="w-16 h-20 bg-red-500 rounded flex items-center justify-center mb-3">
                <span className="text-white font-bold text-sm">PDF</span>
              </div>
              <p className="text-base font-medium text-gray-700">PDF Document</p>
            </div>
          )}
        </div>
      );
    } else if (file.type.includes('word') || file.type.includes('document')) {
      return (
        <div className="flex flex-col items-center justify-center p-4 text-center w-full">
          <div className="w-16 h-20 bg-green-500 rounded flex items-center justify-center mb-3">
            <span className="text-white font-bold text-sm">DOC</span>
          </div>
          <p className="text-base font-medium text-gray-700">Word Document</p>
        </div>
      );
    } else if (file.type.startsWith('image/')) {
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <img
            src={previewUrl || ''}
            alt="Signature preview"
            className="max-w-full max-h-56 object-contain rounded-lg"
          />
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center p-4 text-center w-full">
          <Upload className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-base font-medium text-gray-700">Document</p>
        </div>
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(signatureFile);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
          <h3 className="text-xl font-semibold text-gray-800">Upload Signature</h3>
        </div>

        {/* Upload Area */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="relative w-full">
              <label className="cursor-pointer block w-full">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                <div
                  className={`
                    w-full h-64 rounded-2xl border-2 border-dashed transition-all duration-200
                    ${
                      isDragging
                        ? 'border-green-500 bg-green-50 scale-105'
                        : signatureFile
                          ? 'border-gray-300'
                          : 'border-gray-300 hover:border-green-400 bg-gray-50'
                    }
                    overflow-hidden flex items-center justify-center
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {signatureFile ? (
                    getFileIcon(signatureFile)
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center w-full">
                    <Upload className="w-16 h-16 text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-700">Upload Signature</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Drag and drop or click to upload
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Supports PDF, Word documents, and images (Max: 10MB)
                      </p>
                    </div>
                  )}
                </div>
              </label>

              {signatureFile && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {signatureFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center w-full"
              >
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-base font-medium text-gray-800 truncate">
                    {signatureFile.name}
                  </p>
                  <div className="flex justify-center items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>Size: {(signatureFile.size / 1024 / 1024).toFixed(2)} MB</span>
                    <span>•</span>
                    <span>Type: {signatureFile.type || 'Unknown'}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>


        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};
