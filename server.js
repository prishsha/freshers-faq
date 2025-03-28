const express = require('express');
const mongoose = require('mongoose');
const seedUser = require('./seed');
const authController = require('./controllers/authController');
const path = require('path');
const queryController = require('./controllers/queryController');
const Query = require('./models/queryModel');

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
    const result = await seedUser(email, password);
    
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

app.post('/fresher-portal', queryController);

// senior portal page
app.get('/senior-portal', function(req, res) {
  res.sendFile(path.join(__dirname, 'senior-portal.html'));
});

//fresher portal page
app.get('/fresher-portal', function(req, res) {
  res.sendFile(path.join(__dirname, 'fresherportal.html'));
})

app.get('/fresher-portal/api', async (req, res) => {
  try {
    const queries = await Query.find();
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching queries' });
  }
});

app.post('/fresher-portal/api/answer', async (req, res) => {
  try {
    const { message, answer } = req.body;

    if (!message || !answer) {
      return res.status(400).json({ message: 'Missing message or answer' });
    }

    const query = await Query.findOne({ message });

    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    query.answer = answer;
    query.status = 'Answered';
    await query.save();

    res.json({ message: 'Answer submitted successfully', query });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
