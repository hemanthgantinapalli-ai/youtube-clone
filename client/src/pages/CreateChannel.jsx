import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * CreateChannel page — lets authenticated users create their YouTube channel.
 */
const CreateChannel = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [channelName, setChannelName] = useState('');
  const [handle, setHandle] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState('');
  const [banner, setBanner] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!channelName || !handle) {
      setError('Channel name and handle are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formattedHandle = handle.startsWith('@') ? handle : `@${handle}`;
      const res = await API.post('/channels', {
        channelName,
        handle: formattedHandle,
        description,
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(channelName)}&background=random&color=fff&size=128`,
        channelBanner: banner || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=300&fit=crop',
      });

      // Update the user context with the new channel ID in user.channels array
      const updatedUser = {
        ...user,
        channels: [...(user.channels || []), res.data.channelId],
      };
      
      // Keep token from localStorage
      const token = localStorage.getItem('token');
      login(updatedUser, token);

      navigate(`/channel/${res.data.channelId}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create channel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yt-dark text-yt-text flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-yt-gray p-8 rounded-2xl border border-yt-light-gray shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">Create Your Channel</h2>
        
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-yt-text-secondary" htmlFor="channelName">
              Channel Name *
            </label>
            <input
              id="channelName"
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="e.g. My Coding Journey"
              className="w-full bg-yt-dark border border-yt-light-gray rounded-lg px-4 py-2.5 text-yt-text focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-yt-text-secondary" htmlFor="handle">
              Handle * (unique)
            </label>
            <input
              id="handle"
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value.replace(/\s+/g, '').toLowerCase())}
              placeholder="e.g. @mycodingjourney"
              className="w-full bg-yt-dark border border-yt-light-gray rounded-lg px-4 py-2.5 text-yt-text focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-yt-text-secondary" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers about your channel..."
              rows={3}
              className="w-full bg-yt-dark border border-yt-light-gray rounded-lg px-4 py-2.5 text-yt-text focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-yt-text-secondary" htmlFor="avatar">
              Avatar Image URL (optional)
            </label>
            <input
              id="avatar"
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.png"
              className="w-full bg-yt-dark border border-yt-light-gray rounded-lg px-4 py-2.5 text-yt-text focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-yt-text-secondary" htmlFor="banner">
              Banner Image URL (optional)
            </label>
            <input
              id="banner"
              type="url"
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
              placeholder="https://example.com/banner.png"
              className="w-full bg-yt-dark border border-yt-light-gray rounded-lg px-4 py-2.5 text-yt-text focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 bg-transparent hover:bg-yt-light-gray border border-yt-light-gray text-yt-text py-2.5 rounded-full font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-white hover:bg-yt-text text-yt-dark py-2.5 rounded-full font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChannel;
