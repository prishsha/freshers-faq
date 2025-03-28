const bcrypt = require('bcrypt');
const User = require('./models/userModel.js');

const seedUser = async (email, password) => {
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { message: 'User already exists. Please log in.' };
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({email, password: hashedPassword });

    await newUser.save();
    return { message: 'User created successfully!' };
  } catch (error) {
    throw new Error('Error seeding user: ' + error.message);
  }
};

module.exports = seedUser;
