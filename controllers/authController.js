const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const authController = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if(!(await testAndCompare(password, user.password)))
    {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const testAndCompare = async (password, hashedPassword) => {
  
  //console.log('Hashed Password:', hashedPassword);
  const isMatch = await bcrypt.compare(password, hashedPassword);
  //console.log('Password Match:', isMatch);
  return isMatch;
};

module.exports = authController;
