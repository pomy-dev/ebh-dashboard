'use client';

import React, { useState } from 'react';
import { X, FileText, Image, Download, Eye, File, Paperclip, FilmIcon } from 'lucide-react';
import { Fault } from '@/types';

interface FaultFile {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video';
  url: string;
  size: string;
  uploadedAt: string;
}

interface FaultFilesModalProps {
  fault: Fault | null;
  isOpen: boolean;
  onClose: () => void;
}

const FaultFilesModal: React.FC<FaultFilesModalProps> = ({ fault, isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<FaultFile | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock files data - in a real app, this would come from the fault object or API
  const mockFiles: FaultFile[] = [
    {
      id: '1',
      name: 'leaking_faucet_photo.jpg',
      type: 'image',
      url: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg',
      size: '2.4 MB',
      uploadedAt: '2024-03-01T10:30:00Z'
    },
    {
      id: '2',
      name: 'water_damage_close_up.jpg',
      type: 'image',
      url: 'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg',
      size: '1.8 MB',
      uploadedAt: '2024-03-01T10:32:00Z'
    },
    {
      id: '3',
      name: 'repair_estimate.pdf',
      type: 'document',
      url: '#',
      size: '156 KB',
      uploadedAt: '2024-03-01T11:15:00Z'
    },
    {
      id: '4',
      name: 'leak_video_evidence.mp4',
      type: 'video',
      url: '#',
      size: '12.3 MB',
      uploadedAt: '2024-03-01T10:45:00Z'
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-6 h-6 text-blue-600" />;
      case 'document':
        return <FileText className="w-6 h-6 text-red-600" />;
      case 'video':
        return <FilmIcon className="w-6 h-6 text-purple-600" />;
      default:
        return <File className="w-6 h-6 text-gray-600" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'bg-blue-100 text-blue-800';
      case 'document':
        return 'bg-red-100 text-red-800';
      case 'video':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileClick = (file: FaultFile) => {
    if (file.type === 'image') {
      setSelectedFile(file);
    } else {
      // For non-image files, trigger download or open in new tab
      window.open(file.url, '_blank');
    }
  };

  const handleDownload = (file: FaultFile) => {
    // In a real app, this would trigger actual file download
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  if (!isOpen || !fault) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Paperclip className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Fault Evidence Files</h2>
              <p className="text-gray-600">{fault.title} - {fault.propertyName}, Unit {fault.unit}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Files List */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Uploaded Files ({mockFiles.length})
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                      }`}
                  >
                    <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                      }`}
                  >
                    <div className="w-4 h-4 flex flex-col space-y-1">
                      <div className="bg-current h-0.5 rounded"></div>
                      <div className="bg-current h-0.5 rounded"></div>
                      <div className="bg-current h-0.5 rounded"></div>
                    </div>
                  </button>
                </div>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 gap-4">
                  {mockFiles.map((file) => (
                    <div
                      key={file.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleFileClick(file)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        {getFileIcon(file.type)}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(file);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>

                      {file.type === 'image' && (
                        <div className="mb-3">
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-medium text-gray-800 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getFileTypeColor(file.type)}`}>
                            {file.type}
                          </span>
                          <span className="text-xs text-gray-500">{file.size}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {mockFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleFileClick(file)}
                    >
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getFileTypeColor(file.type)}`}>
                            {file.type}
                          </span>
                          <span className="text-xs text-gray-500">{file.size}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(file.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(file);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {mockFiles.length === 0 && (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-100 rounded-lg inline-block mb-4">
                    <Paperclip className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No files uploaded for this fault report.</p>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-1/2 overflow-y-auto">
            <div className="p-6">
              {selectedFile ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">File Preview</h3>
                    <button
                      onClick={() => handleDownload(selectedFile)}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <img
                      src={selectedFile.url}
                      alt={selectedFile.name}
                      className="w-full h-auto max-h-96 object-contain rounded-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">File Name:</span>
                      <p className="text-sm text-gray-600">{selectedFile.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">File Size:</span>
                      <p className="text-sm text-gray-600">{selectedFile.size}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Upload Date:</span>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedFile.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">File Type:</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getFileTypeColor(selectedFile.type)}`}>
                        {selectedFile.type}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-100 rounded-lg inline-block mb-4">
                    <Eye className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Select a file to preview</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Click on any image file to view it here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaultFilesModal;