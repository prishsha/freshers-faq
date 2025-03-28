const express = require('express');
const mongoose = require('mongoose');
const seedUser = require('./seed');
const authController = require('./controllers/authController');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data

//access assets
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/FreshStart")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("MongoDB connection error:", error));

//landing page
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
})

// register page
app.get('/sign-in', function(req, res) {
  res.sendFile(path.join(__dirname,'sign-in.html'));
});

//login page
app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, 'seniorlogin.html'));
})

// handle new users
app.post('/sign-in', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await seedUser('New User', email, password);
    
    if (result.message === 'User created successfully!') {
      return res.redirect('/senior-portal'); // Redirect on success
    } else {
      return res.send(`
        <script>
          alert('${result.message}');
          window.location.href = '/login';
        </script>
      `);
    }
  } catch (error) {
    res.status(500).send(`
      <script>
        alert('Error: ${error.message}');
        window.location.href = '/sign-in';
      </script>
    `);
  }
});

//handle form submission on login page
app.post('/login', authController);

app.post('/fresher-portal', async (req, res) => {
  try {
    const { queryText, category } = req.body;
    const newQuery = new Query({ queryText, category });
    await newQuery.save();
    res.status(201).json({ message: 'Query submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// senior portal page
app.get('/senior-portal', function(req, res) {
  res.sendFile(path.join(__dirname, 'senior-portal.html'));
});

//fresher portal page
app.get('/fresher-portal', function(req, res) {
  res.sendFile(path.join(__dirname, 'fresherportal.html'));
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
