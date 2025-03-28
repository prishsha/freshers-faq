const mongoose = require('mongoose');

// Define the query schema
const querySchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'Unanswered',
  },
  answer: {
   type: String,
   trim:true, 
  }
}, 
{
  timestamps: true,
  collection: 'queries'
});

// Create Query model
const Query = mongoose.model('Query', querySchema);

module.exports = Query;
