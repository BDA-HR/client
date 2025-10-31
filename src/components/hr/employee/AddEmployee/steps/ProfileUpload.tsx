import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Camera } from "lucide-react";

interface ProfilePictureUploadProps {
  profilePicture: File | null;
  onProfilePictureSelect: (file: File) => void;
  onProfilePictureRemove: () => void;
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  profilePicture,
  onProfilePictureSelect,
  onProfilePictureRemove,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
              w-32 h-32 rounded-2xl border-2 border-dashed transition-all duration-200
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
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <Camera className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  Add Photo
                </p>
              </div>
            )}
          </div>
        </label>

        {profilePicture && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {profilePicture && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-center"
        >
          <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
            {profilePicture.name}
          </p>
          <p className="text-xs text-gray-500">
            {(profilePicture.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </motion.div>
      )}
    </div>
  );
};