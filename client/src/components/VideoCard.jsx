import { useNavigate } from 'react-router-dom';
import { formatViews } from '../utils/formatViews';
import { timeAgo } from '../utils/timeAgo';

/**
 * VideoCard component — displays a single video thumbnail card.
 * @param {Object} video - video data from the API
 */
const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  return (
    <div
      id={`video-card-${video.videoId}`}
      onClick={() => navigate(`/watch/${video.videoId}`)}
      className="cursor-pointer group"
      role="article"
      aria-label={video.title}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-yt-gray">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${video.videoId}/640/360`;
          }}
        />
        {/* Duration badge — placeholder */}
        <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
          {video.category === 'Live' ? (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              LIVE
            </span>
          ) : '10:30'}
        </div>
      </div>

      {/* Info */}
      <div className="flex gap-3 mt-3">
        {/* Channel Avatar */}
        <div className="shrink-0 w-9 h-9 rounded-full bg-yt-red flex items-center justify-center text-white text-sm font-semibold">
          {video.uploader?.charAt(0).toUpperCase() || 'C'}
        </div>

        {/* Meta */}
        <div className="flex-1 min-w-0">
          <h3 className="text-yt-text text-sm font-medium line-clamp-2 group-hover:text-white leading-snug">
            {video.title}
          </h3>
          <p className="text-yt-text-secondary text-sm mt-1 hover:text-yt-text transition-colors cursor-pointer line-clamp-1">
            {video.uploader}
          </p>
          <p className="text-yt-text-secondary text-xs mt-0.5">
            {formatViews(video.views)} · {timeAgo(video.uploadDate)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
