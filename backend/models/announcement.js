import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      enum: ['info', 'warning', 'success', 'urgent'],
      default: 'info',
    },
    createdBy: {
      type: String,
      default: 'admin',
    },
    handle: {
      type: String,
      default: '',
      trim: true,
    },
    instagramUrl: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Announcement', announcementSchema);