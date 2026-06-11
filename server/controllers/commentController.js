import { v4 as uuidv4 } from 'uuid';
import Comment from '../models/Comment.js';
import Video from '../models/Video.js';

/**
 * GET /api/comments/:videoId
 * Public — fetch all comments for a video, sorted newest first.
 */
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

/**
 * POST /api/comments/:videoId
 * Protected — add a new comment to a video.
 * Saves comment, then pushes its ObjectId into Video.comments array.
 */
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim())
      return res.status(400).json({ message: 'Comment text is required' });

    const comment = await Comment.create({
      commentId: uuidv4(),
      videoId: req.params.videoId,
      userId: req.user.userId,
      username: req.user.username,
      text: text.trim(),
    });

    // Push comment ObjectId to Video's comments array
    await Video.findOneAndUpdate(
      { videoId: req.params.videoId },
      { $push: { comments: comment._id } }
    );

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

/**
 * PUT /api/comments/:commentId
 * Protected — edit a comment (owner only).
 */
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({ commentId: req.params.commentId });
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.userId !== req.user.userId)
      return res.status(403).json({ message: 'Not authorized to edit this comment' });

    const { text } = req.body;
    if (!text || !text.trim())
      return res.status(400).json({ message: 'Comment text is required' });

    comment.text = text.trim();
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update comment' });
  }
};

/**
 * DELETE /api/comments/:commentId
 * Protected — delete a comment (owner only).
 * Also removes the comment ObjectId from Video.comments array.
 */
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({ commentId: req.params.commentId });
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.userId !== req.user.userId)
      return res.status(403).json({ message: 'Not authorized to delete this comment' });

    // Remove from Video comments array
    await Video.findOneAndUpdate(
      { videoId: comment.videoId },
      { $pull: { comments: comment._id } }
    );

    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};
