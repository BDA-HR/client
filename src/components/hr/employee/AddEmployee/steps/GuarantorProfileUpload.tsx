import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Upload } from "lucide-react";

interface GuarantorProfileUploadProps {
  guarantorFile: File | null;
  onGuarantorFileSelect: (file: File) => void;
  onGuarantorFileRemove: () => void;
  guarantorName?: string;
  guarantorNameAm?: string;
}

export const GuarantorProfileUpload: React.FC<GuarantorProfileUploadProps> = ({
  guarantorFile,
  onGuarantorFileSelect,
  onGuarantorFileRemove,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onGuarantorFileSelect(file);

      // Create preview URL for images and PDFs
      if (file.type.startsWith("image/") || file.type.includes("pdf")) {
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
      onGuarantorFileSelect(file);
      if (file.type.startsWith("image/") || file.type.includes("pdf")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleRemove = () => {
    onGuarantorFileRemove();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  const getFileIcon = (file: File) => {

    if (file.type.includes("pdf")) {
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
              <p className="text-base font-medium text-gray-700">
                PDF Document
              </p>
            </div>
          )}
        </div>
      );
    } else if (file.type.includes("word") || file.type.includes("document")) {
      return (
        <div className="flex flex-col items-center justify-center p-4 text-center w-full">
          <div className="w-16 h-20 bg-green-500 rounded flex items-center justify-center mb-3">
            <span className="text-white font-bold text-sm">DOC</span>
          </div>
          <p className="text-base font-medium text-gray-700">
            Word Document
          </p>
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

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="relative w-full">
          <label className="cursor-pointer block w-full">
            <input
              type="file"
              id="file"
              name="file"
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
            <div
              className={`
                w-full h-64 rounded-2xl border-2 border-dashed transition-all duration-200
                ${isDragging
                  ? "border-green-500 bg-green-50 scale-105"
                  : guarantorFile
                    ? "border-gray-300"
                    : "border-gray-300 hover:border-green-400 bg-gray-50"
                }
                overflow-hidden flex items-center justify-center
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {guarantorFile ? (
                getFileIcon(guarantorFile)
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center w-full">
                  <Upload className="w-16 h-16 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700">
                    Upload Guarantor Document
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Drag and drop or click to upload
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports PDF, Word documents, and images (Max: 10MB)
                  </p>
                </div>
              )}
              {/* <div className="flex flex-col items-center justify-center p-6 text-center w-full">
                <Upload className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700">
                  Upload Guarantor Document
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Drag and drop or click to upload
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports PDF, Word documents, and images (Max: 10MB)
                </p>
              </div> */}
            </div>
          </label>

          {guarantorFile && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {guarantorFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center w-full"
          >
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-base font-medium text-gray-800 truncate">
                {guarantorFile.name}
              </p>
              <div className="flex justify-center items-center gap-4 mt-2 text-sm text-gray-600">
                <span>Size: {(guarantorFile.size / 1024 / 1024).toFixed(2)} MB</span>
                <span>•</span>
                <span>Type: {guarantorFile.type || "Unknown"}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};