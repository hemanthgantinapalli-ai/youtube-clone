import { v4 as uuidv4 } from 'uuid';
import Channel from '../models/Channel.js';
import User from '../models/User.js';
import Video from '../models/Video.js';

/**
 * POST /api/channels
 * Protected — create a new channel for the authenticated user.
 */
export const createChannel = async (req, res) => {
  try {
    const { channelName, handle, description, avatar, channelBanner } = req.body;
    if (!channelName || !handle)
      return res.status(400).json({ message: 'Channel name and handle are required' });

    const existing = await Channel.findOne({ handle });
    if (existing) return res.status(400).json({ message: 'Handle already taken' });

    const channelId = uuidv4();
    const channel = await Channel.create({
      channelId,
      channelName,
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      owner: req.user.userId,
      description: description || '',
      avatar: avatar || '',
      channelBanner: channelBanner || '',
    });

    // Add channelId to user's channels array
    await User.findOneAndUpdate({ userId: req.user.userId }, { $push: { channels: channelId } });

    res.status(201).json(channel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create channel' });
  }
};

/**
 * GET /api/channels/:channelId
 * Public — get channel info and all its videos.
 */
export const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findOne({ channelId: req.params.channelId });
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    const videos = await Video.find({ channelId: channel.channelId }).sort({ uploadDate: -1 });
    res.json({ channel, videos });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch channel' });
  }
};

/**
 * PUT /api/channels/:channelId
 * Protected — update channel info (owner only).
 */
export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findOne({ channelId: req.params.channelId });
    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    if (channel.owner !== req.user.userId)
      return res.status(403).json({ message: 'Not authorized to edit this channel' });

    const { channelName, description, avatar, channelBanner } = req.body;
    if (channelName) channel.channelName = channelName;
    if (description !== undefined) channel.description = description;
    if (avatar) channel.avatar = avatar;
    if (channelBanner) channel.channelBanner = channelBanner;

    await channel.save();
    res.json(channel);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update channel' });
  }
};
