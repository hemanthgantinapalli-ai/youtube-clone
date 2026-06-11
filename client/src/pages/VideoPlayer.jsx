import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { formatViews } from '../utils/formatViews';
import { timeAgo } from '../utils/timeAgo';

const VideoPlayer = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [activeMenuCommentId, setActiveMenuCommentId] = useState(null);
  
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [showMoreDesc, setShowMoreDesc] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch video data, related videos, channel info, and comments
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch Video & increment views (handled by server controller)
        const videoRes = await API.get(`/videos/${id}`);
        setVideo(videoRes.data);

        // Fetch comments
        const commentsRes = await API.get(`/comments/${id}`);
        setComments(commentsRes.data);

        // Fetch channel info
        const channelRes = await API.get(`/channels/${videoRes.data.channelId}`);
        setChannel(channelRes.data.channel);

        // Fetch all videos for related sidebar
        const allVideosRes = await API.get('/videos');
        // Filter out current video
        const related = allVideosRes.data.filter((v) => v.videoId !== id);
        setRelatedVideos(related);
      } catch (err) {
        console.error(err);
        setError('Failed to load video player details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  /**
   * Handle Like button click.
   */
  const handleLike = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    try {
      const res = await API.put(`/videos/${video.videoId}/like`);
      setVideo((prev) => ({
        ...prev,
        likes: res.data.likes,
        dislikes: res.data.dislikes,
      }));
    } catch (err) {
      console.error('Like toggle failed', err);
    }
  };

  /**
   * Handle Dislike button click.
   */
  const handleDislike = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    try {
      const res = await API.put(`/videos/${video.videoId}/dislike`);
      setVideo((prev) => ({
        ...prev,
        likes: res.data.likes,
        dislikes: res.data.dislikes,
      }));
    } catch (err) {
      console.error('Dislike toggle failed', err);
    }
  };

  /**
   * Handle POST/Create comment.
   */
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      const res = await API.post(`/comments/${video.videoId}`, { text: newCommentText });
      setComments((prev) => [res.data, ...prev]);
      setNewCommentText('');
    } catch (err) {
      console.error('Failed to post comment', err);
    }
  };

  /**
   * Save Edited Comment.
   */
  const handleSaveEdit = async (commentId) => {
    if (!editingText.trim()) return;
    try {
      const res = await API.put(`/comments/${commentId}`, { text: editingText });
      setComments((prev) =>
        prev.map((c) => (c.commentId === commentId ? { ...c, text: res.data.text } : c))
      );
      setEditingCommentId(null);
      setEditingText('');
    } catch (err) {
      console.error('Failed to edit comment', err);
    }
  };

  /**
   * Delete Comment.
   */
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await API.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.commentId !== commentId));
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-yt-dark text-yt-text">
        <div className="w-10 h-10 border-4 border-yt-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-yt-dark text-yt-text p-4">
        <p className="text-red-500 mb-4">{error || 'Video not found'}</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  const isLiked = user && video.likes.includes(user.userId);
  const isDisliked = user && video.dislikes.includes(user.userId);

  return (
    <div className="min-h-screen bg-yt-dark text-yt-text">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} onSearch={(q) => navigate(`/?search=${encodeURIComponent(q)}`)} />
      
      <div className="flex pt-14">
        <Sidebar isOpen={sidebarOpen} />

        {/* Main Grid: Left player, Right sidebar */}
        <main className={`flex-1 min-w-0 p-4 lg:p-6 transition-all duration-300 ${sidebarOpen ? 'md:ml-60' : 'md:ml-[72px]'} grid grid-cols-1 lg:grid-cols-3 gap-6`}>
          
          {/* Left Column — Video player, info, details, comments */}
          <div className="lg:col-span-2 space-y-4">
            {/* HTML5 Video Player */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
              <video
                src={video.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
                poster={video.thumbnailUrl}
              />
            </div>

            {/* Video Title */}
            <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-snug">
              {video.title}
            </h1>

            {/* View, likes, action items row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-yt-gray">
              <div className="text-sm text-yt-text-secondary">
                {formatViews(video.views)} · {timeAgo(video.uploadDate)}
              </div>
              
              <div className="flex items-center gap-2">
                {/* Like / Dislike pills */}
                <div className="flex items-center bg-yt-gray rounded-full overflow-hidden">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 hover:bg-yt-light-gray transition-colors border-r border-yt-light-gray ${
                      isLiked ? 'text-blue-500 font-bold' : ''
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                    </svg>
                    <span>{video.likes.length}</span>
                  </button>
                  <button
                    onClick={handleDislike}
                    className={`flex items-center gap-2 px-4 py-2 hover:bg-yt-light-gray transition-colors ${
                      isDisliked ? 'text-red-500 font-bold' : ''
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3h-4V15h4V3zm-22 11c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2z"/>
                    </svg>
                    <span>{video.dislikes.length}</span>
                  </button>
                </div>

                <button className="btn-secondary flex items-center gap-2">
                  <span>Share</span>
                </button>
                <button className="btn-secondary flex items-center gap-2">
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Channel metadata row */}
            <div className="flex items-center justify-between gap-4 py-3">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/channel/${video.channelId}`)}>
                <img
                  src={channel?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(video.uploader)}`}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-sm hover:text-white leading-tight">{channel?.channelName || video.uploader}</h3>
                  <p className="text-xs text-yt-text-secondary">{channel?.subscribers?.toLocaleString() || 0} subscribers</p>
                </div>
              </div>
              <button className="bg-white hover:bg-yt-text text-yt-dark px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-200">
                Subscribe
              </button>
            </div>

            {/* Description box (collapsible) */}
            <div className="bg-yt-gray p-4 rounded-xl text-sm leading-relaxed">
              <p className="font-semibold text-xs mb-1">
                Uploaded {new Date(video.uploadDate).toLocaleDateString()} · {video.category}
              </p>
              <div className={`${showMoreDesc ? '' : 'line-clamp-2'}`}>
                {video.description || 'No description provided.'}
              </div>
              <button
                onClick={() => setShowMoreDesc(!showMoreDesc)}
                className="mt-2 text-xs font-bold hover:underline block"
              >
                {showMoreDesc ? 'Show less' : 'Show more'}
              </button>
            </div>

            {/* Comments CRUD Section */}
            <div className="space-y-6 pt-4">
              <h2 className="text-lg font-bold">{comments.length} Comments</h2>

              {/* Comment Input */}
              {user ? (
                <form onSubmit={handleAddComment} className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-yt-red flex items-center justify-center text-white text-sm font-semibold shrink-0">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 space-y-2">
                    <textarea
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      rows={2}
                      className="w-full bg-transparent border-b border-yt-light-gray focus:border-white focus:outline-none text-sm py-1 resize-none"
                    />
                    {newCommentText && (
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setNewCommentText('')}
                          className="px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-yt-light-gray"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-yt-dark hover:bg-yt-text"
                        >
                          Comment
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              ) : (
                <div className="text-sm bg-yt-gray p-4 rounded-xl text-center text-yt-text-secondary border border-yt-light-gray">
                  Please{' '}
                  <button onClick={() => navigate('/auth')} className="text-blue-400 font-bold hover:underline">
                    Sign In
                  </button>{' '}
                  to leave a comment.
                </div>
              )}

              {/* Comment List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.commentId} className="flex gap-3 items-start group">
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                      {comment.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0 relative">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">{comment.username}</span>
                        <span className="text-[10px] text-yt-text-secondary">{timeAgo(comment.createdAt)}</span>
                      </div>
                      
                      {editingCommentId === comment.commentId ? (
                        /* Editing view */
                        <div className="mt-2 space-y-2">
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            rows={2}
                            className="w-full bg-yt-dark border border-yt-light-gray rounded-lg p-2 text-sm focus:outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingCommentId(null)}
                              className="px-3 py-1 rounded-full text-xs bg-yt-gray hover:bg-yt-light-gray"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit(comment.commentId)}
                              className="px-3 py-1 rounded-full text-xs bg-white text-yt-dark hover:bg-yt-text"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Text view */
                        <p className="text-sm mt-1 text-yt-text break-words pr-6">{comment.text}</p>
                      )}

                      {/* Comment actions (likes/edit/delete) */}
                      {editingCommentId !== comment.commentId && (
                        <div className="flex items-center gap-4 mt-2">
                          <button className="flex items-center gap-1 text-yt-text-secondary hover:text-yt-text text-xs">
                            👍 <span>{comment.likes}</span>
                          </button>
                          <button className="text-yt-text-secondary hover:text-yt-text text-xs">Reply</button>
                        </div>
                      )}

                      {/* Options menu dropdown indicator (visible if owner) */}
                      {user && user.userId === comment.userId && editingCommentId !== comment.commentId && (
                        <div className="absolute right-0 top-0">
                          <button
                            onClick={() => setActiveMenuCommentId(activeMenuCommentId === comment.commentId ? null : comment.commentId)}
                            className="p-1 rounded-full hover:bg-yt-gray text-yt-text-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ⋮
                          </button>
                          {activeMenuCommentId === comment.commentId && (
                            <div className="absolute right-0 top-6 w-24 bg-[#282828] border border-yt-light-gray rounded-lg overflow-hidden shadow-xl z-10">
                              <button
                                onClick={() => {
                                  setEditingCommentId(comment.commentId);
                                  setEditingText(comment.text);
                                  setActiveMenuCommentId(null);
                                }}
                                className="w-full px-3 py-2 text-xs hover:bg-yt-gray text-left"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteComment(comment.commentId);
                                  setActiveMenuCommentId(null);
                                }}
                                className="w-full px-3 py-2 text-xs hover:bg-yt-gray text-left text-red-400"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Related / Sidebar Videos */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold tracking-wider text-yt-text-secondary uppercase">Related Videos</h2>
            
            {relatedVideos.length === 0 ? (
              <p className="text-xs text-yt-text-secondary">No related videos available.</p>
            ) : (
              relatedVideos.map((item) => (
                <div
                  key={item.videoId}
                  onClick={() => navigate(`/watch/${item.videoId}`)}
                  className="flex gap-3 cursor-pointer group hover:bg-yt-gray/30 p-1 rounded-xl transition-colors"
                >
                  {/* Small Thumbnail */}
                  <div className="relative w-40 aspect-video rounded-lg overflow-hidden shrink-0 bg-yt-gray">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  
                  {/* Meta */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-yt-text text-sm font-medium line-clamp-2 leading-tight group-hover:text-white">
                      {item.title}
                    </h4>
                    <p className="text-yt-text-secondary text-xs mt-1 truncate">{item.uploader}</p>
                    <p className="text-yt-text-secondary text-[10px] mt-0.5">
                      {formatViews(item.views)} · {timeAgo(item.uploadDate)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default VideoPlayer;
