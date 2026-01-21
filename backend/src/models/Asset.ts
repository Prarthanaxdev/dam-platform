import mongoose, { Schema } from 'mongoose';
import { IAsset } from '../types/assetType';

const AssetSchema: Schema = new Schema<IAsset>(
  {
    assetId: {
      type: String,
      required: true
    },
    rawKey: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['uploaded', 'processing', 'processed', 'failed']
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    thumbnailKey: {
      type: String,
    },
    variants: {
      type: Schema.Types.Mixed,
      default: {},
    },
    error: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance optimization
AssetSchema.index({ assetId: 1 }, { unique: true });
AssetSchema.index({ status: 1 });
AssetSchema.index({ tags: 1 });
AssetSchema.index({ createdAt: -1 });

const AssetModel = mongoose.model('Asset', AssetSchema);
export default AssetModel;
