import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Camera } from "lucide-react";

interface ProfilePictureUploadProps {
  profilePicture: File | null;
  onProfilePictureSelect: (file: File) => void;
  onProfilePictureRemove: () => void;
  size?: "small" | "medium" | "large";
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  profilePicture,
  onProfilePictureSelect,
  onProfilePictureRemove,
  size = "medium",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Size configurations
  const sizeConfig = {
    small: {
      container: "w-32 h-32",
      icon: "w-6 h-6",
      text: "text-xs",
      removeButton: "-top-1 -right-1 p-0.5",
      fileName: "max-w-[120px] text-xs",
    },
    medium: {
      container: "w-48 h-48",
      icon: "w-6 h-6",
      text: "text-sm",
      removeButton: "-top-2 -right-2 p-1",
      fileName: "max-w-[180px] text-sm",
    },
    large: {
      container: "w-80 h-80",
      icon: "w-6 h-6",
      text: "text-base",
      removeButton: "-top-3 -right-3 p-2",
      fileName: "max-w-[250px] text-base",
    },
  };

  const currentSize = sizeConfig[size];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && isImageFile(file)) {
      onProfilePictureSelect(file);
      // Create and set preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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
    if (file && isImageFile(file)) {
      onProfilePictureSelect(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemove = () => {
    onProfilePictureRemove();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  const isImageFile = (file: File) => {
    return file.type.startsWith("image/");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <label className="cursor-pointer block">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            id="file"
            name="file"
            onChange={handleFileChange}
          />
          <div
            className={`
              ${currentSize.container} rounded-2xl border-2 border-dashed transition-all duration-200
              ${isDragging
                ? "border-green-500 bg-green-50 scale-105"
                : profilePicture
                  ? "border-gray-300"
                  : "border-gray-300 hover:border-green-400 bg-gray-50"
              }
              overflow-hidden flex items-center justify-center
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {profilePicture && previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <Camera className={`${currentSize.icon} text-gray-400 mb-3`} />
                <p className={`${currentSize.text} font-medium text-gray-700`}>
                  Add Photo
                </p>
                {size === "large" && (
                  <p className="text-xs text-gray-500 mt-1">
                    Click or drag & drop
                  </p>
                )}
              </div>
            )}
          </div>
        </label>

        {profilePicture && (
          <button
            type="button"
            onClick={handleRemove}
            className={`absolute ${currentSize.removeButton} bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg`}
          >
            <X className={currentSize.icon} />
          </button>
        )}
      </div>

      {profilePicture && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <p className={`font-medium text-gray-700 truncate ${currentSize.fileName}`}>
            {profilePicture.name}
          </p>
          <p className={`text-gray-500 ${size === "large" ? "text-sm" : "text-xs"}`}>
            {(profilePicture.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </motion.div>
      )}
    </div>
  );
};