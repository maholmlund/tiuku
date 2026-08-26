import mongoose from 'mongoose';

const PollSchema = new mongoose.Schema({
  uuid: { type: String, required: true },
  encryptedData: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Poll || mongoose.model('Poll', PollSchema);
