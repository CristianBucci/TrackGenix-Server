import mongoose from 'mongoose';

const { Schema } = mongoose;

const adminSchema = new Schema({

  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  firebaseUid: { type: String, required: true },
  isDeleted: { type: Boolean, required: true, default: false },
});

export default mongoose.model('Admins', adminSchema);
