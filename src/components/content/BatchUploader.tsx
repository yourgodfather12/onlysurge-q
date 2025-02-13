import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Upload, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { analyzeContent, generateCaption } from '../../lib/openai';
import { createContentItem, uploadMedia } from '../../lib/supabase';
import type { ContentItem } from '../../types/database';

interface UploadFile extends File {
  preview?: string;
  progress?: number;
  error?: string;
  uploading?: boolean;
  completed?: boolean;
}

export function BatchUploader({ onComplete }: { onComplete: () => void }) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file),
      progress: 0
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi']
    }
  });

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const uploadFiles = async () => {
    setUploading(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Update progress
        setFiles(prev => {
          const newFiles = [...prev];
          newFiles[i] = { ...newFiles[i], uploading: true, progress: 0 };
          return newFiles;
        });

        // Generate AI analysis
        const [caption, analysis] = await Promise.all([
          generateCaption(file.name),
          analyzeContent(file.name)
        ]);

        // Upload file
        const path = `${Date.now()}-${file.name}`;
        await uploadMedia(file, path);

        // Create content item
        const contentItem: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'> = {
          creator_id: 'user_id', // Replace with actual user ID
          title: file.name,
          description: '',
          media_url: path,
          media_type: file.type.startsWith('image/') ? 'image' : 'video',
          ai_caption: caption,
          ai_hashtags: analysis.hashtags,
          ai_best_time: analysis.bestTime,
          ai_engagement_score: analysis.engagementScore
        };

        await createContentItem(contentItem);

        // Update progress
        setFiles(prev => {
          const newFiles = [...prev];
          newFiles[i] = { ...newFiles[i], completed: true, progress: 100 };
          return newFiles;
        });
      } catch (error) {
        setFiles(prev => {
          const newFiles = [...prev];
          newFiles[i] = {
            ...newFiles[i],
            error: 'Upload failed',
            uploading: false
          };
          return newFiles;
        });
      }
    }

    setUploading(false);
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Batch Upload
        </h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-creator-purple-500 bg-creator-purple-500/10' 
                : 'border-purple-800/50 hover:border-creator-purple-500/50'
              }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-8 h-8 text-creator-purple-400 mx-auto mb-2" />
            {isDragActive ? (
              <p>Drop your files here</p>
            ) : (
              <>
                <p className="font-medium">Drag & drop multiple files or click to select</p>
                <p className="text-sm text-gray-400 mt-1">
                  Supports images and videos up to 100MB each
                </p>
              </>
            )}
          </div>

          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-purple-900/20 rounded-lg p-4"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-purple-800/30">
                      {file.preview && (
                        file.type.startsWith('image/') ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={file.preview}
                            className="w-full h-full object-cover"
                          />
                        )
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        {file.uploading && (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            <span className="text-sm text-gray-400">
                              Uploading...
                            </span>
                          </>
                        )}
                        {file.completed && (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-green-400">
                              Upload complete
                            </span>
                          </>
                        )}
                        {file.error && (
                          <>
                            <AlertCircle className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-red-400">
                              {file.error}
                            </span>
                          </>
                        )}
                      </div>
                      {(file.uploading || file.completed) && (
                        <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-creator-purple-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${file.progress}%` }}
                          />
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 hover:bg-purple-800/30 rounded-lg transition-colors"
                      disabled={file.uploading}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <Button
                  variant="primary"
                  onClick={uploadFiles}
                  loading={uploading}
                  disabled={files.length === 0 || uploading}
                  className="w-full"
                  icon={<Upload className="w-4 h-4" />}
                >
                  Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}