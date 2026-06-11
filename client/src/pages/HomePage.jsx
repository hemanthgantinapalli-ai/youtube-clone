import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FilterBar from '../components/FilterBar';
import VideoCard from '../components/VideoCard';
import API from '../services/api';

/**
 * HomePage component — contains Header, collapsible Sidebar, scrollable FilterBar, and Video Grid.
 * Supports search query updates from Header and category filter updates from FilterBar.
 */
const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch videos on mount or when category/searchQuery changes
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError('');
      try {
        let url = '/videos';
        const params = [];
        if (category && category !== 'All') {
          params.push(`category=${encodeURIComponent(category)}`);
        }
        if (searchQuery) {
          params.push(`search=${encodeURIComponent(searchQuery)}`);
        }
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }
        const res = await API.get(url);
        setVideos(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load videos. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [category, searchQuery]);

  return (
    <div className="min-h-screen bg-yt-dark text-yt-text">
      {/* Header */}
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onSearch={(query) => setSearchQuery(query)}
      />

      {/* Main Layout */}
      <div className="flex pt-14">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Content Area */}
        <main
          className={`flex-1 min-w-0 p-4 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'md:ml-60' : 'md:ml-[72px]'
          }`}
        >
          {/* Filter Bar */}
          <FilterBar activeCategory={category} onCategoryChange={setCategory} />

          {/* Videos Grid / States */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="w-10 h-10 border-4 border-yt-red border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <p className="text-red-500 mb-2">{error}</p>
              <button
                onClick={() => setCategory('All')}
                className="btn-primary"
              >
                Reset Filters
              </button>
            </div>
          ) : videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <svg className="w-16 h-16 text-yt-text-secondary mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 12c0 6.075-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1s11 4.925 11 11zm-2 0a9 9 0 1 0-18 0 9 9 0 0 0 18 0zm-7.5-3a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM12 18c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/>
              </svg>
              <h3 className="text-lg font-medium text-yt-text-secondary">No videos found</h3>
              <p className="text-sm text-yt-text-secondary mt-1">Try refining your search or changing categories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 mt-4">
              {videos.map((video) => (
                <VideoCard key={video.videoId} video={video} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
