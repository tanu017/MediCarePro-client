import React from 'react';
import { User, Camera } from 'lucide-react';

const ProfileImageUpload = ({ 
  imagePreview, 
  onImageChange, 
  isEditing = false, 
  size = "h-40 w-40",
  iconSize = "h-24 w-24"
}) => {
  return (
    <div className="relative inline-block mb-6">
      <div className={`${size} rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg`}>
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <User className={`${iconSize} text-blue-500`} />
        )}
      </div>
      {/* Status indicator */}
      <div className="absolute bottom-2 right-2 h-6 w-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
        <div className="h-2 w-2 bg-white rounded-full"></div>
      </div>
      
      {isEditing && (
        <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
          <Camera className="h-4 w-4" />
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};

export default ProfileImageUpload;
