const bcrypt = require('bcrypt');
const User = require('./models/userModel.js');

const seedUser = async (email, password) => {
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists. Please log in.');
      return { message: 'User already exists. Please log in.' };
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    const newUser = new User({ email, password: hashedPassword });

    await newUser.save();
    console.log('User seeded with hashed password');

    return { message: 'User created successfully!' };
  } catch (error) {
    console.error('Error seeding user:', error.message);
    return { error: 'Error seeding user: ' + error.message };
  }
};

module.exports = seedUser;
