import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FolderHeart, Upload, Image, Film, Calendar, Sparkles, Search, Filter, ArrowUpDown, Grid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeContent, generateCaption } from '../lib/openai';
import { createContentItem, uploadMedia, getContentItems, getMediaUrl } from '../lib/supabase';
import type { ContentItem } from '../types/database';
import { ContentScheduler } from '../components/content/ContentScheduler';
import { ContentDetails } from '../components/content/ContentDetails';
import { BatchUploader } from '../components/content/BatchUploader';

type SortField = 'created_at' | 'ai_engagement_score' | 'title';
type SortOrder = 'asc' | 'desc';
type MediaFilter = 'all' | 'image' | 'video';
type ViewMode = 'grid' | 'list';

export function Content() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<{
    caption: string;
    hashtags: string[];
    bestTime: string;
    engagementScore: number;
  } | null>(null);

  // Content Grid State
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showUpload, setShowUpload] = useState(false);
  const [showBatchUpload, setShowBatchUpload] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);

  useEffect(() => {
    if (user) {
      fetchContent();
    }
  }, [user]);

  const fetchContent = async () => {
    try {
      const items = await getContentItems(user!.id);
      setContentItems(items);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const filePreview = URL.createObjectURL(file);
      setPreview(filePreview);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi']
    },
    maxFiles: 1
  });

  const handleAnalyze = async () => {
    if (!description) return;

    setAnalyzing(true);
    try {
      const [captionResult, analysisResult] = await Promise.all([
        generateCaption(description),
        analyzeContent(description)
      ]);

      setAiAnalysis({
        caption: captionResult,
        ...analysisResult
      });
    } catch (error) {
      console.error('Error analyzing content:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user || !aiAnalysis) return;

    setUploading(true);
    try {
      const path = `${user.id}/${Date.now()}-${selectedFile.name}`;
      await uploadMedia(selectedFile, path);
      
      const contentItem: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'> = {
        creator_id: user.id,
        title,
        description,
        media_url: path,
        media_type: selectedFile.type.startsWith('image/') ? 'image' : 'video',
        ai_caption: aiAnalysis.caption,
        ai_hashtags: aiAnalysis.hashtags,
        ai_best_time: aiAnalysis.bestTime,
        ai_engagement_score: aiAnalysis.engagementScore
      };

      await createContentItem(contentItem);
      await fetchContent();
      
      // Reset form
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setPreview(null);
      setAiAnalysis(null);
      setShowUpload(false);
    } catch (error) {
      console.error('Error uploading content:', error);
    } finally {
      setUploading(false);
    }
  };

  const filteredContent = contentItems
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = mediaFilter === 'all' || item.media_type === mediaFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortOrder === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * modifier;
      }
      return ((aValue as number) - (bValue as number)) * modifier;
    });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Content Vault</h1>
          <p className="text-gray-400">Upload and analyze your content for maximum engagement.</p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setShowBatchUpload(true);
              setShowUpload(false);
            }}
            icon={<Upload className="w-4 h-4" />}
          >
            Batch Upload
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowUpload(!showUpload);
              setShowBatchUpload(false);
            }}
            icon={<Upload className="w-4 h-4" />}
          >
            Upload Content
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showBatchUpload && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <BatchUploader
              onComplete={() => {
                setShowBatchUpload(false);
                fetchContent();
              }}
            />
          </motion.div>
        )}

        {showUpload && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Upload Section */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Content
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <Input
                      label="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a title for your content"
                    />
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-300">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded-lg bg-purple-900/20 border border-purple-800/50 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-creator-purple-500 placeholder:text-gray-400"
                        rows={4}
                        placeholder="Describe your content for better AI analysis"
                      />
                    </div>

                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                        ${isDragActive 
                          ? 'border-creator-purple-500 bg-creator-purple-500/10' 
                          : 'border-purple-800/50 hover:border-creator-purple-500/50'
                        }`}
                    >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center gap-2">
                        <FolderHeart className="w-8 h-8 text-creator-purple-400" />
                        {isDragActive ? (
                          <p>Drop your content here</p>
                        ) : (
                          <>
                            <p className="font-medium">Drag & drop or click to upload</p>
                            <p className="text-sm text-gray-400">
                              Supports images and videos up to 100MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {preview && (
                      <div className="relative rounded-lg overflow-hidden">
                        {selectedFile?.type.startsWith('image/') ? (
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <video
                            src={preview}
                            className="w-full h-48 object-cover"
                            controls
                          />
                        )}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button
                        variant="primary"
                        onClick={handleAnalyze}
                        disabled={!description || analyzing}
                        loading={analyzing}
                        className="flex-1"
                        icon={<Sparkles className="w-4 h-4" />}
                      >
                        Analyze with AI
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleUpload}
                        disabled={!selectedFile || !aiAnalysis || uploading}
                        loading={uploading}
                        className="flex-1"
                        icon={<Upload className="w-4 h-4" />}
                      >
                        Upload
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Analysis Section */}
              <AnimatePresence>
                {aiAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Card>
                      <CardHeader>
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          AI Analysis
                        </h2>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-sm font-medium text-gray-400 mb-2">
                              Suggested Caption
                            </h3>
                            <p className="text-white">{aiAnalysis.caption}</p>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-gray-400 mb-2">
                              Hashtags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {aiAnalysis.hashtags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 rounded-full bg-creator-purple-500/20 text-creator-purple-300 text-sm"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-medium text-gray-400 mb-2">
                                Best Time to Post
                              </h3>
                              <div className="flex items-center gap-2 text-white">
                                <Calendar className="w-4 h-4" />
                                {new Date(aiAnalysis.bestTime).toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-400 mb-2">
                                Engagement Score
                              </h3>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-700 rounded-full">
                                  <div
                                    className="h-full bg-creator-purple-500 rounded-full"
                                    style={{ width: `${aiAnalysis.engagementScore}%` }}
                                  />
                                </div>
                                <span className="text-white">
                                  {aiAnalysis.engagementScore}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Grid */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search content..."
              icon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <div className="flex gap-4">
              <select
                value={mediaFilter}
                onChange={(e) => setMediaFilter(e.target.value as MediaFilter)}
                className="bg-purple-900/20 border border-purple-800/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-creator-purple-500"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
              </select>
              <select
                value={`${sortField}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortField(field as SortField);
                  setSortOrder(order as SortOrder);
                }}
                className="bg-purple-900/20 border border-purple-800/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-creator-purple-500"
              >
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="ai_engagement_score-desc">Highest Engagement</option>
                <option value="ai_engagement_score-asc">Lowest Engagement</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
              </select>
              <div className="flex rounded-lg overflow-hidden border border-purple-800/50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${
                    viewMode === 'grid'
                      ? 'bg-creator-purple-500 text-white'
                      : 'bg-purple-900/20 text-gray-400 hover:text-white hover:bg-purple-800/30'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${
                    viewMode === 'list'
                      ? 'bg-creator-purple-500 text-white'
                      : 'bg-purple-900/20 text-gray-400 hover:text-white hover:bg-purple-800/30'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-creator-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-400">Loading content...</p>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-8">
              <FolderHeart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No content found</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  onClick={() => setSelectedContent(item)}
                >
                  <Card hover>
                    <div className="aspect-video relative overflow-hidden rounded-t-2xl">
                      {item.media_type === 'image' ? (
                        <img
                          src={getMediaUrl(item.media_url)}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={getMediaUrl(item.media_url)}
                          className="w-full h-full object-cover"
                          controls
                        />
                      )}
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs font-medium flex items-center gap-1">
                          {item.media_type === 'image' ? (
                            <Image className="w-3 h-3" />
                          ) : (
                            <Film className="w-3 h-3" />
                          )}
                          {item.media_type}
                        </span>
                      </div>
                    </div>
                    <CardContent>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-creator-purple-400" />
                          <span className="text-sm">{item.ai_engagement_score}% Engagement</span>
                        </div>
                        <span className="text-sm text-gray-400">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContent.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => setSelectedContent(item)}
                >
                  <Card hover>
                    <div className="flex gap-4 p-4">
                      <div className="w-48 h-32 rounded-lg overflow-hidden">
                        {item.media_type === 'image' ? (
                          <img
                            src={getMediaUrl(item.media_url)}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={getMediaUrl(item.media_url)}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                          </div>
                          <span className="px-2 py-1 rounded-full bg-purple-900/20 text-xs font-medium flex items-center gap-1">
                            {item.media_type === 'image' ? (
                              <Image className="w-3 h-3" />
                            ) : (
                              <Film className="w-3 h-3" />
                            )}
                            {item.media_type}
                          </span>
                        </div>
                        <div className="mt-4 flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-creator-purple-400" />
                            <span className="text-sm">{item.ai_engagement_score}% Engagement</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Details Modal */}
      <AnimatePresence>
        {selectedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
          >
            <div className="min-h-screen px-4 py-8">
              <div className="max-w-6xl mx-auto">
                <div className="flex justify-end mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedContent(null)}
                    icon={<X className="w-4 h-4" />}
                  >
                    Close
                  </Button>
                </div>
                <ContentDetails
                  content={selectedContent}
                  onEdit={() => {
                    // Implement edit functionality
                  }}
                  onDelete={() => {
                    // Implement delete functionality
                    setSelectedContent(null);
                  }}
                  onSchedule={() => {
                    setShowScheduler(true);
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scheduler Modal */}
      <AnimatePresence>
        {showScheduler && selectedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
          >
            <div className="min-h-screen px-4 py-8">
              <div className="max-w-lg mx-auto">
                <div className="flex justify-end mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowScheduler(false)}
                    icon={<X className="w-4 h-4" />}
                  >
                    Close
                  </Button>
                </div>
                <ContentScheduler
                  content={selectedContent}
                  onSchedule={() => {
                    setShowScheduler(false);
                    setSelectedContent(null);
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}