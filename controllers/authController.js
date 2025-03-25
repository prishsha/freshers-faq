// Import required modules
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Login controller
const authController = async (req, res) => {
  const { email, password } = req.body;

  try 
  {
    //check if user exists
    const user = await User.findOne({ email });
    if (!user) 
    {
      return res.status(404).json({ message: 'User not found' });
    }

    //check is password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) 
    {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } 
  catch (error) 
  {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports=authController;
