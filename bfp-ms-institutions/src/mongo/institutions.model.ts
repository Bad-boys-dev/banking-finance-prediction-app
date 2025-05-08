import mongoose from 'mongoose';

export const institutionsModel = new mongoose.Schema({
  _id: String,
  name: String,
  bic: String,
  transaction_total_days: String,
  countries: Array,
  logo: String,
  max_access_valid_for_days: String,
});

export const institutions = mongoose.model('institutions', institutionsModel);
