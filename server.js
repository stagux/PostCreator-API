const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS

// MongoDB connection setup
const connectDB = async () => {
    try {
        const uri = '';
        // Connect to MongoDB using the URI directly
        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // Exit process with failure
    }
};

// Call the connectDB function immediately
connectDB();

const app = express();
app.use(express.json());

// CORS configuration (allowing all origins for simplicity, you can restrict this later)
app.use(cors());

// Post Model (Post.js)
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: 'Anonymous'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model('Post', postSchema);

// Post Routes (posts.js)
const postRoutes = express.Router();

// Create a new post
postRoutes.post('/', async (req, res) => {
    const { title, content, author } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required.' });
    }

    try {
        const newPost = new Post({ title, content, author });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Use post routes
app.use('/posts', postRoutes);

// Listen on a specific port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
