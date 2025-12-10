import mongoose from 'mongoose';

const PollSchema = new mongoose.Schema({
  uuid: { type: String, required: true },
  title: { type: String, required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
  responses: { type: [] },
}, { timestamps: true });

export default mongoose.models.Poll || mongoose.model('Poll', PollSchema);
