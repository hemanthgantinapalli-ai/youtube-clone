import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema(
  {
    channelId:     { type: String, required: true, unique: true },
    channelName:   { type: String, required: true },
    handle:        { type: String, required: true, unique: true }, // @username
    owner:         { type: String, required: true },               // userId
    description:   { type: String, default: '' },
    channelBanner: { type: String, default: '' },
    avatar:        { type: String, default: '' },
    subscribers:   { type: Number, default: 0 },
    videos:        [{ type: String }],                             // array of videoIds
  },
  { timestamps: true }
);

export default mongoose.model('Channel', channelSchema);
