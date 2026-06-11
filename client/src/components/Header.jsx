import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Header component — contains logo, hamburger toggle, search bar, and user auth state.
 * @param {Function} onToggleSidebar - callback to toggle sidebar open/close
 * @param {Function} onSearch - callback called with the current search query string
 */
const Header = ({ onToggleSidebar, onSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Handle search input change — updates query and calls parent callback.
   */
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  /**
   * Handle search form submission (pressing Enter).
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  /**
   * Get user avatar initial for the avatar circle.
   */
  const getInitial = (name) => name?.charAt(0).toUpperCase() || 'U';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-yt-dark flex items-center justify-between px-4 h-14 border-b border-yt-gray">
      {/* Left — Hamburger + Logo */}
      <div className="flex items-center gap-4">
        <button
          id="hamburger-btn"
          onClick={onToggleSidebar}
          className="p-2 rounded-full hover:bg-yt-gray transition-colors duration-150"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>

        <button
          id="logo-btn"
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 hover:opacity-95 transition-opacity"
          aria-label="Go to home"
        >
          {/* YouTube official style logo SVG */}
          <svg className="w-7 h-5 text-red-600 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.518 3.55 12 3.55 12 3.55s-7.518 0-9.388.505a3.003 3.003 0 0 0-2.11 2.108C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.482 20.45 12 20.45 12 20.45s7.518 0 9.388-.505a3.003 3.003 0 0 0 2.11-2.108C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span className="text-white font-bold text-lg tracking-tighter font-sans hidden sm:block">
            YouTube
          </span>
        </button>
      </div>

      {/* Center — Search Bar (hidden on mobile, shown via icon) */}
      <form
        onSubmit={handleSearchSubmit}
        className={`${showMobileSearch ? 'flex absolute left-0 right-0 top-0 h-14 px-4 bg-yt-dark z-50' : 'hidden'} md:flex flex-1 max-w-2xl mx-4 items-center`}
      >
        {showMobileSearch && (
          <button type="button" onClick={() => setShowMobileSearch(false)} className="mr-3 text-yt-text-secondary">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
        )}
        <div className="flex flex-1 border border-yt-gray rounded-full overflow-hidden bg-[#121212] focus-within:border-blue-500 shadow-inner">
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search"
            className="flex-1 bg-transparent px-5 py-2 text-yt-text placeholder-yt-text-secondary text-sm focus:outline-none"
            aria-label="Search videos"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); onSearch(''); }}
              className="px-3 text-yt-text-secondary hover:text-yt-text"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          )}
          <button
            type="submit"
            id="search-btn"
            className="px-6 bg-[#222222] hover:bg-[#303030] border-l border-yt-gray transition-colors duration-150 text-yt-text"
            aria-label="Submit search"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </div>
        {/* Microphone icon */}
        <button
          type="button"
          className="ml-3 p-2.5 rounded-full bg-[#212121] hover:bg-yt-gray transition-colors duration-150 text-yt-text shrink-0"
          aria-label="Search by voice"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
          </svg>
        </button>
      </form>

      {/* Right — Mobile search icon + Auth */}
      <div className="flex items-center gap-2">
        {/* Mobile search icon */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-yt-gray transition-colors"
          onClick={() => setShowMobileSearch(true)}
          aria-label="Open search"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>

        {user ? (
          /* Authenticated — show avatar + dropdown */
          <div className="relative" ref={dropdownRef}>
            <button
              id="avatar-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-yt-gray transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full bg-yt-red flex items-center justify-center text-white font-semibold text-sm">
                {getInitial(user.username)}
              </div>
              <span className="hidden md:block text-sm font-medium text-yt-text max-w-24 truncate">
                {user.username}
              </span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-12 w-52 bg-[#282828] border border-yt-light-gray rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                <div className="px-4 py-3 border-b border-yt-gray">
                  <p className="font-semibold text-sm">{user.username}</p>
                  <p className="text-yt-text-secondary text-xs truncate">{user.email}</p>
                </div>
                <button
                  id="my-channel-btn"
                  onClick={() => { navigate(`/channel/${user.channels?.[0] || 'create'}`); setShowDropdown(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-yt-gray transition-colors text-left"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                  My Channel
                </button>
                <button
                  id="signout-btn"
                  onClick={() => { logout(); setShowDropdown(false); navigate('/'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-yt-gray transition-colors text-left text-red-400"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Unauthenticated — show Sign In button */
          <button
            id="signin-btn"
            onClick={() => navigate('/auth')}
            className="flex items-center gap-2 border border-blue-500 text-blue-400 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-500/10 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
