import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    videoId:      { type: String, required: true, unique: true },
    title:        { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    videoUrl:     { type: String, required: true },
    description:  { type: String, default: '' },
    channelId:    { type: String, required: true },
    uploader:     { type: String, required: true },
    category: {
      type: String,
      enum: ['All', 'Web Dev', 'JavaScript', 'Data Structures', 'Server', 'Music',
             'Gaming', 'News', 'Movies', 'Live', 'Information Technology', 'Spring Framework'],
      default: 'All',
    },
    views:      { type: Number, default: 0 },
    likes:      [{ type: String }],   // array of userIds
    dislikes:   [{ type: String }],   // array of userIds
    uploadDate: { type: Date, default: Date.now },
    comments:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

export default mongoose.model('Video', videoSchema);
