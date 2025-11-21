/**
 * Compress and resize an image file to reduce its size
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Maximum width in pixels (default: 400)
 * @param {number} maxHeight - Maximum height in pixels (default: 400)
 * @param {number} quality - Image quality 0-1 (default: 0.8)
 * @returns {Promise<string>} - Base64 string of the compressed image
 */
export const compressImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculate new dimensions while maintaining aspect ratio
            let { width, height } = img;

            if (width > height) {
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
            }

            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;

            // Draw and compress the image
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to base64 with compression
            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedBase64);
        };

        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };

        // Load the image
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        reader.readAsDataURL(file);
    });
};

/**
 * Get file size in MB
 * @param {File} file - The file to check
 * @returns {number} - File size in MB
 */
export const getFileSizeInMB = (file) => {
    return file.size / (1024 * 1024);
};

/**
 * Check if file is a valid image type
 * @param {File} file - The file to check
 * @returns {boolean} - Whether the file is a valid image
 */
export const isValidImageType = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
};
