import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Home', path: '/', icon: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  )},
  { label: 'Shorts', path: '/', icon: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.23-2.53-5.06-1.56L6 6.94c-1.29.68-2.06 2.03-1.98 3.49.07 1.18.67 2.23 1.56 2.91l1.2.5L5.36 14.6c-1.84.96-2.53 3.23-1.56 5.06.97 1.84 3.23 2.53 5.06 1.56l8.5-4.5c1.29-.68 2.06-2.03 1.98-3.49-.07-1.18-.67-2.23-1.57-2.91zM10 14.45v-5l5 2.5-5 2.5z"/>
    </svg>
  )},
  { label: 'Subscriptions', path: '/', icon: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
    </svg>
  )},
];

const LIBRARY_ITEMS = [
  { label: 'History', icon: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7V3zM11 8v5l4.28 2.54.72-1.21L12 12V8h-1z"/>
    </svg>
  )},
  { label: 'Playlists', icon: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 5h2V3c-1.1 0-2 .9-2 2zm0 8h2v-2H3v2zm4 8h2v-2H7v2zM3 9h2V7H3v2zm10-6h-2v2h2V3zm6 0v2h2c0-1.1-.9-2-2-2zM5 21v-2H3c0 1.1.9 2 2 2zm-2-4h2v-2H3v2zM9 3H7v2h2V3zm2 18h2v-2h-2v2zm8-8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2zm0-12h2V7h-2v2zm0 8h2v-2h-2v2zm-4 4h2v-2h-2v2zm0-16h2V3h-2v2z"/>
    </svg>
  )},
  { label: 'Watch Later', icon: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
    </svg>
  )},
  { label: 'Liked Videos', icon: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
    </svg>
  )},
];

const EXPLORE_ITEMS = [
  { label: 'Trending', icon: '🔥' },
  { label: 'Shopping', icon: '🛒' },
  { label: 'Music', icon: '🎵' },
  { label: 'Movies', icon: '🎬' },
  { label: 'Live', icon: '📡' },
  { label: 'Gaming', icon: '🎮' },
  { label: 'News', icon: '📰' },
  { label: 'Sports', icon: '⚽' },
];

/**
 * Sidebar component — collapsible navigation with icons and labels.
 * @param {boolean} isOpen - whether sidebar is expanded
 */
const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" />
      )}

      <aside
        className={`
          fixed top-14 left-0 bottom-0 z-40 bg-yt-dark overflow-y-auto hide-scrollbar
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-60 translate-x-0' : 'w-0 md:w-[72px] -translate-x-full md:translate-x-0'}
        `}
      >
        <nav className="py-3 px-2">
          {/* Main nav items */}
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center gap-4 px-3 py-2.5 rounded-xl mb-0.5 transition-colors duration-150
                ${location.pathname === item.path ? 'bg-yt-gray' : 'hover:bg-yt-gray'}
                ${isOpen ? 'justify-start' : 'justify-center md:flex-col md:gap-1 md:py-3 md:px-1'}
              `}
              title={!isOpen ? item.label : ''}
            >
              <span className="text-yt-text shrink-0">{item.icon}</span>
              <span className={`text-sm font-medium text-yt-text ${isOpen ? 'block' : 'hidden md:block md:text-[10px]'}`}>
                {item.label}
              </span>
            </button>
          ))}

          {isOpen && (
            <>
              <div className="border-t border-yt-gray my-3" />

              {/* Library section */}
              <p className="px-3 py-1 text-sm font-semibold text-yt-text mb-1">You</p>
              {LIBRARY_ITEMS.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-yt-gray transition-colors duration-150 mb-0.5"
                >
                  <span className="text-yt-text shrink-0">{item.icon}</span>
                  <span className="text-sm text-yt-text">{item.label}</span>
                </button>
              ))}

              <div className="border-t border-yt-gray my-3" />

              {/* Explore section */}
              <p className="px-3 py-1 text-sm font-semibold text-yt-text mb-1">Explore</p>
              {EXPLORE_ITEMS.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-yt-gray transition-colors duration-150 mb-0.5"
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="text-sm text-yt-text">{item.label}</span>
                </button>
              ))}
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
