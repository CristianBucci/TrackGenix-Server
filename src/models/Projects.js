import mongoose from 'mongoose';

const { Schema } = mongoose;

const schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, default: Date.now, required: true },
  endDate: { type: Date, required: true },
  clientName: { type: String, required: true },
  employees: [{
    _id: false,
    employeeId: { type: Schema.Types.ObjectId, required: true, ref: 'Employees' },
    role: { type: String, enum: ['DEV', 'QA', 'PM', 'TL'], required: true },
    rate: { type: Number, required: true },
  }],
  isDeleted: { type: Boolean, required: true, default: false },
});

export default mongoose.model('projects', schema);
