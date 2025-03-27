const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/uploads/home.html'));
});

app.get('/editor', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/uploads/Editor.html'));
});

app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/auth.html'));
});

// Handle blog post routes
app.get('/:blogId', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/uploads/blog.html'));
});

// Handle file uploads
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const imagePath = `/uploads/${req.file.filename}`;
    res.json(imagePath);
});

// Handle blog post creation
app.post('/api/posts', async (req, res) => {
    try {
        const postData = req.body;
        if (!postData.title || !postData.article) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Here you would typically save to your database
        // For now, we'll just return success since we're using Firebase
        res.json({ 
            success: true, 
            message: 'Post created successfully',
            post: postData 
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 