const Query = require('../models/queryModel');

// Controller to handle query submission
const queryController = async (req, res) => {
  try {
    const { message, category } = req.body;

    if (!message || !category) 
    {
      return res.status(400).json({ error: 'Query text and category are required' });
    }

    const newQuery = new Query({ message, category });
    await newQuery.save();

    res.status(201).json({ message: 'Query submitted successfully', query: newQuery });
  } catch (error) {
    console.error('Error submitting query:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = queryController;
