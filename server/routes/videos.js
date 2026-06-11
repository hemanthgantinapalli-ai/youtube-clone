import express from 'express';
import {
  getVideos, getVideoById, createVideo, updateVideo, deleteVideo, likeVideo, dislikeVideo,
} from '../controllers/videoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getVideos);
router.get('/:videoId', getVideoById);
router.post('/', protect, createVideo);
router.put('/:videoId', protect, updateVideo);
router.delete('/:videoId', protect, deleteVideo);
router.put('/:videoId/like', protect, likeVideo);
router.put('/:videoId/dislike', protect, dislikeVideo);

export default router;
