import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import VideoCard from '../components/VideoCard';

const CATEGORIES = ['All', 'Web Dev', 'JavaScript', 'Data Structures', 'Server', 'Music', 'Gaming', 'News', 'Movies', 'Live', 'Information Technology', 'Spring Framework'];

const ChannelPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  
  const [activeTab, setActiveTab] = useState('Videos'); // Videos | About
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  // Upload Video Form Fields
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoCategory, setVideoCategory] = useState('All');
  
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchChannelDetails();
  }, [id]);

  const fetchChannelDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get(`/channels/${id}`);
      setChannel(res.data.channel);
      setVideos(res.data.videos);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch channel details.');
    } finally {
      setLoading(false);
    }
  };

  const isOwner = user && channel && channel.owner === user.userId;

  // --- Upload Video Flow ---
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!videoTitle || !videoUrl || !thumbnailUrl) {
      setFormError('Title, Video URL, and Thumbnail URL are required.');
      return;
    }
    setFormLoading(true);
    setFormError('');
    try {
      await API.post('/videos', {
        title: videoTitle,
        description: videoDesc,
        videoUrl,
        thumbnailUrl,
        channelId: channel.channelId,
        category: videoCategory,
      });

      // Reset fields and fetch updated listings
      setVideoTitle('');
      setVideoUrl('');
      setThumbnailUrl('');
      setVideoDesc('');
      setVideoCategory('All');
      setShowUploadModal(false);
      fetchChannelDetails();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to upload video.');
    } finally {
      setFormLoading(false);
    }
  };

  // --- Edit Video Flow ---
  const openEditModal = (video) => {
    setEditingVideo(video);
    setVideoTitle(video.title);
    setVideoDesc(video.description);
    setVideoCategory(video.category);
    setThumbnailUrl(video.thumbnailUrl);
    setVideoUrl(video.videoUrl);
    setFormError('');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!videoTitle || !videoUrl || !thumbnailUrl) {
      setFormError('Title, Video URL, and Thumbnail URL are required.');
      return;
    }
    setFormLoading(true);
    setFormError('');
    try {
      await API.put(`/videos/${editingVideo.videoId}`, {
        title: videoTitle,
        description: videoDesc,
        category: videoCategory,
        thumbnailUrl,
        videoUrl,
      });
      setShowEditModal(false);
      setEditingVideo(null);
      
      // Reset form variables
      setVideoTitle('');
      setVideoUrl('');
      setThumbnailUrl('');
      setVideoDesc('');
      fetchChannelDetails();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to update video.');
    } finally {
      setFormLoading(false);
    }
  };

  // --- Delete Video Flow ---
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to permanently delete this video?')) return;
    try {
      await API.delete(`/videos/${videoId}`);
      fetchChannelDetails();
    } catch (err) {
      console.error(err);
      alert('Failed to delete video.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-yt-dark text-yt-text">
        <div className="w-10 h-10 border-4 border-yt-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-yt-dark text-yt-text p-4">
        <p className="text-red-500 mb-4">{error || 'Channel not found'}</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yt-dark text-yt-text">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} onSearch={(q) => navigate(`/?search=${encodeURIComponent(q)}`)} />

      <div className="flex pt-14">
        <Sidebar isOpen={sidebarOpen} />

        <main className={`flex-1 min-w-0 transition-all duration-300 ${sidebarOpen ? 'md:ml-60' : 'md:ml-[72px]'}`}>
          {/* Banner */}
          <div className="w-full h-36 md:h-48 overflow-hidden bg-yt-gray">
            <img
              src={channel.channelBanner || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=300&fit=crop'}
              alt="banner"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Channel Info Row */}
          <div className="px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-yt-gray">
            <div className="flex items-start md:items-center gap-5">
              <img
                src={channel.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.channelName)}`}
                alt="avatar"
                className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-yt-dark object-cover"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold">{channel.channelName}</h1>
                <p className="text-sm text-yt-text-secondary mt-1">
                  {channel.handle} · {channel.subscribers?.toLocaleString()} subscribers · {videos.length} videos
                </p>
                <p className="text-xs text-yt-text-secondary mt-1.5 max-w-lg line-clamp-1">{channel.description}</p>
              </div>
            </div>

            <div className="flex gap-3 shrink-0">
              {isOwner ? (
                <>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="btn-primary"
                  >
                    Upload Video
                  </button>
                </>
              ) : (
                <button className="bg-white hover:bg-yt-text text-yt-dark px-6 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200">
                  Subscribe
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 md:px-12 flex border-b border-yt-gray">
            <button
              onClick={() => setActiveTab('Videos')}
              className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'Videos' ? 'border-white text-white' : 'border-transparent text-yt-text-secondary hover:text-white'
              }`}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveTab('About')}
              className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'About' ? 'border-white text-white' : 'border-transparent text-yt-text-secondary hover:text-white'
              }`}
            >
              About
            </button>
          </div>

          {/* Tab content */}
          <div className="px-6 md:px-12 py-6">
            {activeTab === 'Videos' ? (
              videos.length === 0 ? (
                <p className="text-sm text-yt-text-secondary">This channel has no videos uploaded yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {videos.map((vid) => (
                    <div key={vid.videoId} className="relative group">
                      <VideoCard video={vid} />
                      {isOwner && (
                        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-1.5 rounded-lg z-10">
                          <button
                            onClick={() => openEditModal(vid)}
                            className="p-1 bg-yt-gray hover:bg-yt-light-gray rounded text-white"
                            title="Edit Video"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(vid.videoId)}
                            className="p-1 bg-red-600 hover:bg-red-700 rounded text-white"
                            title="Delete Video"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="max-w-2xl bg-yt-gray p-6 rounded-xl border border-yt-light-gray">
                <h2 className="text-lg font-bold mb-3">Description</h2>
                <p className="text-sm text-yt-text-secondary whitespace-pre-wrap">
                  {channel.description || 'No description available for this channel.'}
                </p>
                <h2 className="text-lg font-bold mt-6 mb-3">Stats</h2>
                <p className="text-xs text-yt-text-secondary">Joined {new Date(channel.createdAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* --- UPLOAD VIDEO MODAL --- */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#282828] border border-yt-light-gray rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Upload Video</h2>
            {formError && <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded-lg">{formError}</div>}
            
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-yt-text-secondary">Video Title *</label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="e.g. Master CSS Grid Layout"
                  className="w-full bg-yt-dark border border-yt-light-gray rounded-lg px-4 py-2.5 text-yt-text focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-yt-text-secondary">Video File URL *</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://example.com/movie.mp4"
                  className="w-full bg-yt-dark border border-yt-light-gray rounded-lg px-4 py-2.5 text-yt-text focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-yt-text-secondary">Thumbnail URL *</label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://example.com/thumbnail.jpg"
                  className="w-full bg-yt-dark border border-yt-light-gray rounded-lg px-4 py-2.5 text-yt-text focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-yt-text-secondary">Category *</label>
                <select
                  value={videoCategory}
                  onChange={(e) => setVideoCategory(e.target.value)}
                  className="w-full bg-yt-dark border border-yt-light-gray rounded-lg px-4 py-2.5 text-yt-text focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-yt-text-secondary">Description</label>
                <textarea
                  value={videoDesc}
                  onChange={(e) => setVideoDesc(e.target.value)}
                  placeholder="Write a description for your video..."
                  rows={4}
                  className="w-full bg-yt-dark border border-yt-light-gray rounded-lg px-4 py-2.5 text-yt-text focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-5 py-2.5 rounded-full bg-yt-gray hover:bg-yt-light-gray font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2.5 rounded-full bg-white text-yt-dark hover:bg-yt-text font-semibold text-sm disabled:opacity-50"
                >
                  {formLoading ? 'Uploading...' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT VIDEO MODAL --- */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#282828] border border-yt-light-gray rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Edit Video Details</h2>
            {formError && <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded-lg">{formError}</div>}
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-yt-text-secondary">Video Title *</label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full bg-yt-dark border border-yt-light-gray rounded-lg px-4 py-2.5 text-yt-text focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-yt-text-secondary">Video File URL *</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full bg-yt-dark border border-yt-light-gray rounded-lg px-4 py-2.5 text-yt-text focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-yt-text-secondary">Thumbnail URL *</label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full bg-yt-dark border border-yt-light-gray rounded-lg px-4 py-2.5 text-yt-text focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-yt-text-secondary">Category *</label>
                <select
                  value={videoCategory}
                  onChange={(e) => setVideoCategory(e.target.value)}
                  className="w-full bg-yt-dark border border-yt-light-gray rounded-lg px-4 py-2.5 text-yt-text focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-yt-text-secondary">Description</label>
                <textarea
                  value={videoDesc}
                  onChange={(e) => setVideoDesc(e.target.value)}
                  rows={4}
                  className="w-full bg-yt-dark border border-yt-light-gray rounded-lg px-4 py-2.5 text-yt-text focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditingVideo(null); }}
                  className="px-5 py-2.5 rounded-full bg-yt-gray hover:bg-yt-light-gray font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2.5 rounded-full bg-white text-yt-dark hover:bg-yt-text font-semibold text-sm disabled:opacity-50"
                >
                  {formLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ChannelPage;
