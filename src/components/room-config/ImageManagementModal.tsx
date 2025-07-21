/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/room-config/ImageManagementModal.tsx
import React, { useState, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { 
  Gallery, 
  AddSquare, 
  Trash, 
  Eye, 
  DocumentUpload,
  CloseCircle,
  InfoCircle
} from 'iconsax-react';
import Button from '@/components/Button';
import Modal, { type ModalRef } from '@/components/ui/Modal';
import { useToast } from '@/context/toast-context';
import type { RoomTypeConfig } from '@/types/room-config.types';

interface ImageManagementModalProps {
  roomType: RoomTypeConfig | null;
  onImagesUpdate: (roomTypeId: string, images: string[]) => void;
  onClose: () => void;
}

export interface ImageManagementModalRef {
  open: () => void;
  close: () => void;
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  isUploading: boolean;
  error?: string | null;
}

const ImageManagementModal = forwardRef<ImageManagementModalRef, ImageManagementModalProps>(
  ({ roomType, onImagesUpdate, onClose }, ref) => {
    const toast = useToast();
    const modalRef = useRef<ModalRef>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [images, setImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<ImageFile[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      open: () => {
        if (roomType) {
          setImages(roomType.images || []);
          setNewImages([]);
          setSelectedImage(null);
          modalRef.current?.open();
        }
      },
      close: () => {
        modalRef.current?.close();
        handleClose();
      }
    }));

    const handleClose = () => {
      setImages([]);
      setNewImages([]);
      setSelectedImage(null);
      setIsDragOver(false);
      onClose();
    };

    // File validation
    const validateFile = (file: File): string | null => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

      if (!allowedTypes.includes(file.type)) {
        return 'Only JPEG, PNG and WebP images are allowed';
      }

      if (file.size > maxSize) {
        return 'Image size must be less than 5MB';
      }

      return null;
    };

    // Handle file selection
    const handleFileSelect = useCallback((files: FileList | null) => {
      if (!files) return;

      const fileArray = Array.from(files);
      const validFiles: ImageFile[] = [];

      fileArray.forEach((file) => {
        const error = validateFile(file);
        const imageFile: ImageFile = {
          id: `temp_${Date.now()}_${Math.random()}`,
          file,
          preview: URL.createObjectURL(file),
          isUploading: false,
          error
        };

        validFiles.push(imageFile);

        if (error) {
          toast.error('Invalid File', `${file.name}: ${error}`);
        }
      });

      setNewImages(prev => [...prev, ...validFiles]);
    }, [toast]);

    // Drag and drop handlers
    const handleDragEnter = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDragOver(false);
      }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      
      const files = e.dataTransfer.files;
      handleFileSelect(files);
    }, [handleFileSelect]);

    // File input change handler
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files);
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    };

    // Remove new image before upload
    const removeNewImage = (imageId: string) => {
      setNewImages(prev => {
        const updated = prev.filter(img => img.id !== imageId);
        // Clean up object URL
        const removedImage = prev.find(img => img.id === imageId);
        if (removedImage) {
          URL.revokeObjectURL(removedImage.preview);
        }
        return updated;
      });
    };

    // Remove existing image
    const removeExistingImage = (imageUrl: string) => {
      setImages(prev => prev.filter(img => img !== imageUrl));
    };

    // Simulate image upload
    const uploadImage = async (imageFile: ImageFile): Promise<string> => {
      // Simulate API upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, this would upload to a server/cloud storage
      // For now, we'll use a mock URL
      return `https://example.com/room-images/${imageFile.file.name}_${Date.now()}`;
    };

    // Upload all valid new images
    const handleUploadImages = async () => {
      const validImages = newImages.filter(img => !img.error);
      
      if (validImages.length === 0) {
        toast.error('No Valid Images', 'Please add valid images to upload');
        return;
      }

      setIsUploading(true);

      try {
        // Mark images as uploading
        setNewImages(prev => prev.map(img => 
          validImages.some(valid => valid.id === img.id) 
            ? { ...img, isUploading: true }
            : img
        ));

        // Upload images one by one
        const uploadedUrls: string[] = [];
        
        for (const imageFile of validImages) {
          try {
            const uploadedUrl = await uploadImage(imageFile);
            uploadedUrls.push(uploadedUrl);
            
            toast.success('Image Uploaded', `${imageFile.file.name} uploaded successfully`);
          } catch (error) {
            toast.error('Upload Failed', `Failed to upload ${imageFile.file.name}`);
          }
        }

        // Update images list
        const updatedImages = [...images, ...uploadedUrls];
        setImages(updatedImages);

        // Clean up new images
        validImages.forEach(img => URL.revokeObjectURL(img.preview));
        setNewImages(prev => prev.filter(img => !validImages.some(valid => valid.id === img.id)));

        if (uploadedUrls.length > 0) {
          toast.success(
            'Upload Complete', 
            `${uploadedUrls.length} image${uploadedUrls.length !== 1 ? 's' : ''} uploaded successfully`
          );
        }

      } catch (error) {
        toast.error('Upload Error', 'Failed to upload images');
      } finally {
        setIsUploading(false);
      }
    };

    // Save changes and close modal
    const handleSave = () => {
      if (!roomType) return;

      onImagesUpdate(roomType.id, images);
      toast.success(
        'Images Updated', 
        `Banner images for "${roomType.name}" have been updated`
      );
      modalRef.current?.close();
    };

    const totalImagesCount = images.length + newImages.filter(img => !img.error).length;

    return (
      <>
        <Modal
          ref={modalRef}
          title={`Manage Images - ${roomType?.name || 'Room Type'}`}
          size="lg"
          onClose={handleClose}
        >
          <div className="p-6">
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <InfoCircle size={20} color="#3B82F6" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Banner Images</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    These images will be used as banner images for this room type. 
                    Upload high-quality images (JPEG, PNG, WebP) up to 5MB each.
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 mb-6 transition-all ${
                isDragOver
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <DocumentUpload size={48} color={isDragOver ? "#3B82F6" : "#9CA3AF"} className="mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Drop images here or click to browse
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Support for JPEG, PNG, WebP up to 5MB each
                </p>
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  <AddSquare size={16} color="white" />
                  <span className="ml-2">Select Images</span>
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>

            {/* New Images Preview */}
            {newImages.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    New Images ({newImages.length})
                  </h4>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        newImages.forEach(img => URL.revokeObjectURL(img.preview));
                        setNewImages([]);
                      }}
                      className="text-sm px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                    >
                      Clear All
                    </Button>
                    <Button
                      onClick={handleUploadImages}
                      disabled={isUploading || newImages.every(img => img.error)}
                      className="text-sm px-3 py-1 bg-green-600 text-white hover:bg-green-700 rounded-lg disabled:opacity-50"
                    >
                      {isUploading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Uploading...</span>
                        </div>
                      ) : (
                        <>
                          <DocumentUpload size={14} color="white" />
                          <span className="ml-1">Upload All</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {newImages.map((imageFile) => (
                    <div key={imageFile.id} className="relative group">
                      <div className={`relative rounded-lg overflow-hidden border-2 ${
                        imageFile.error 
                          ? 'border-red-300 bg-red-50' 
                          : imageFile.isUploading
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200'
                      }`}>
                        <img
                          src={imageFile.preview}
                          alt={imageFile.file.name}
                          className="w-full h-24 object-cover"
                        />
                        
                        {/* Upload overlay */}
                        {imageFile.isUploading && (
                          <div className="absolute inset-0 bg-blue-500 bg-opacity-75 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}

                        {/* Error overlay */}
                        {imageFile.error && (
                          <div className="absolute inset-0 bg-red-500 bg-opacity-75 flex items-center justify-center">
                            <CloseCircle size={24} color="white" />
                          </div>
                        )}

                        {/* Remove button */}
                        {!imageFile.isUploading && (
                          <button
                            onClick={() => removeNewImage(imageFile.id)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash size={12} color="white" />
                          </button>
                        )}
                      </div>
                      
                      <div className="mt-1">
                        <p className="text-xs text-gray-600 truncate">{imageFile.file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(imageFile.file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                        {imageFile.error && (
                          <p className="text-xs text-red-500 mt-1">{imageFile.error}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Images */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-900">
                  Current Images ({images.length})
                </h4>
                {images.length > 0 && (
                  <span className="text-sm text-gray-500">
                    Click on an image to preview
                  </span>
                )}
              </div>

              {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((imageUrl, index) => (
                    <div key={imageUrl} className="relative group">
                      <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors">
                        <img
                          src={imageUrl}
                          alt={`Room type image ${index + 1}`}
                          className="w-full h-24 object-cover cursor-pointer"
                          onClick={() => setSelectedImage(imageUrl)}
                        />
                        
                        {/* Overlay actions */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                          <button
                            onClick={() => setSelectedImage(imageUrl)}
                            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                            title="Preview"
                          >
                            <Eye size={14} color="white" />
                          </button>
                          <button
                            onClick={() => removeExistingImage(imageUrl)}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                            title="Remove"
                          >
                            <Trash size={14} color="white" />
                          </button>
                        </div>

                        {/* Primary badge */}
                        {index === 0 && (
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                              Primary
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Gallery size={48} color="#9CA3AF" className="mx-auto mb-4" />
                  <p className="text-sm text-gray-500">No images uploaded yet</p>
                </div>
              )}
            </div>

            {/* Summary */}
            {totalImagesCount > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total images:</span>
                  <span className="font-medium text-gray-900">{totalImagesCount}</span>
                </div>
                {images.length > 0 && (
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Current uploaded:</span>
                    <span className="font-medium text-gray-900">{images.length}</span>
                  </div>
                )}
                {newImages.filter(img => !img.error).length > 0 && (
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Ready to upload:</span>
                    <span className="font-medium text-gray-900">
                      {newImages.filter(img => !img.error).length}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                onClick={() => modalRef.current?.close()}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>

        {/* Image Preview Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full p-4">
              <img
                src={selectedImage}
                alt="Room type preview"
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
              >
                <CloseCircle size={20} color="white" />
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
);

ImageManagementModal.displayName = 'ImageManagementModal';

export default ImageManagementModal;