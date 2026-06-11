import { v4 as uuidv4 } from 'uuid';
import Video from '../models/Video.js';
import Channel from '../models/Channel.js';

/**
 * GET /api/videos
 * Fetch all videos. Supports ?search=title&category=cat query params.
 */
export const getVideos = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search) filter.title = { $regex: search, $options: 'i' };
    if (category && category !== 'All') filter.category = category;

    const videos = await Video.find(filter).sort({ uploadDate: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch videos' });
  }
};

/**
 * GET /api/videos/:videoId
 * Fetch a single video by videoId and increment the view count.
 */
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findOneAndUpdate(
      { videoId: req.params.videoId },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('comments');
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch video' });
  }
};

/**
 * POST /api/videos
 * Protected — create a new video linked to a channel.
 */
export const createVideo = async (req, res) => {
  try {
    const { title, thumbnailUrl, videoUrl, description, channelId, category } = req.body;
    if (!title || !thumbnailUrl || !videoUrl || !channelId)
      return res.status(400).json({ message: 'Title, thumbnail, video URL, and channelId are required' });

    const videoId = uuidv4();
    const video = await Video.create({
      videoId,
      title,
      thumbnailUrl,
      videoUrl,
      description: description || '',
      channelId,
      uploader: req.user.userId,
      category: category || 'All',
    });

    // Add videoId to channel's videos array
    await Channel.findOneAndUpdate({ channelId }, { $push: { videos: videoId } });

    res.status(201).json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create video' });
  }
};

/**
 * PUT /api/videos/:videoId
 * Protected — update a video (owner only).
 */
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (video.uploader !== req.user.userId)
      return res.status(403).json({ message: 'Not authorized to edit this video' });

    const { title, description, category, thumbnailUrl, videoUrl } = req.body;
    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (category) video.category = category;
    if (thumbnailUrl) video.thumbnailUrl = thumbnailUrl;
    if (videoUrl) video.videoUrl = videoUrl;

    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update video' });
  }
};

/**
 * DELETE /api/videos/:videoId
 * Protected — delete a video (owner only). Also removes from channel.
 */
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (video.uploader !== req.user.userId)
      return res.status(403).json({ message: 'Not authorized to delete this video' });

    await Channel.findOneAndUpdate(
      { channelId: video.channelId },
      { $pull: { videos: video.videoId } }
    );
    await video.deleteOne();
    res.json({ message: 'Video deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete video' });
  }
};

/**
 * PUT /api/videos/:videoId/like
 * Protected — toggle like on a video.
 * If already liked → unlike. If disliked → switch to like.
 */
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userId = req.user.userId;
    const alreadyLiked = video.likes.includes(userId);

    if (alreadyLiked) {
      video.likes = video.likes.filter((id) => id !== userId);
    } else {
      video.likes.push(userId);
      video.dislikes = video.dislikes.filter((id) => id !== userId);
    }

    await video.save();
    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle like' });
  }
};

/**
 * PUT /api/videos/:videoId/dislike
 * Protected — toggle dislike on a video.
 */
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userId = req.user.userId;
    const alreadyDisliked = video.dislikes.includes(userId);

    if (alreadyDisliked) {
      video.dislikes = video.dislikes.filter((id) => id !== userId);
    } else {
      video.dislikes.push(userId);
      video.likes = video.likes.filter((id) => id !== userId);
    }

    await video.save();
    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle dislike' });
  }
};
