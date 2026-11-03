require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload'); // For handling file uploads
const app = express();
const port = 3001;
const mysql = require('mysql2');



// MySQL connection setup
// const db = mysql.createConnection({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'your_username',
//   password: process.env.DB_PASSWORD || 'your_password',
//   database: process.env.DB_Name || 'your_dbname'
// });

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });


function initializeDatabase() {
    try {
       

        db.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image VARCHAR(255)
      );
    `,(error, results) => {
        if (error) console.error('Error creating activities table:', error);
    });

   db.query(`
      CREATE TABLE IF NOT EXISTS gallery_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url VARCHAR(255) NOT NULL,
        caption VARCHAR(255)
      );
    `,(error, results) => {
        if (error) console.error('Error creating galleryitems table:', error);
    });

    db.query(`
      CREATE TABLE IF NOT EXISTS birthdays (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        date_of_birth DATE,
        class VARCHAR(100),
        image VARCHAR(255)
      );
    `,(error, results) => {
        if (error) console.error('Error creating birthdays table:', error);
    });

    db.query(`
      CREATE TABLE IF NOT EXISTS planner_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        pdf_url VARCHAR(255)
      );
    `,(error, results) => {
        if (error) console.error('Error creating planneritems table:', error);
    });
    db.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        reason VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `, (error) => {
        if (error) console.error('Error creating contact_messages table:', error);
    });
    console.log('All required tables ensured.');
} catch (error) {
    console.error('Database initialization error:', error);
}
  
};

initializeDatabase();


// Middleware to parse form data and handle file uploads
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(fileUpload()); // Enable file uploads

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded images

// Load environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME; // Username from .env
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // Password from .env
const SECRET_KEY = process.env.SECRET_KEY; // Secret key from .env

// Define routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/admissions', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admissions.html'));
});

app.get('/academics', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'academics.html'));
});

app.get('/secondary', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'secondary.html'));
});

app.get('/senior-secondary', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'senior-secondary.html'));
});

app.get('/hostel', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'hostel.html'));
});

app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signin.html'));
});

app.get('/activities', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'activities.html'));
});

app.get('/Login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Login.html'));
});

app.get('/staff', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'staff.html'));
});

app.get('/planner', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'planner.html'));
});

app.get('/contactus', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contactus.html'));
});
app.get('/admin-activities', (req, res) => {
    const token = req.query.token || req.headers.authorization?.split(' ')[1]; // Get token from query or headers
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });

    try {
        jwt.verify(token, SECRET_KEY); // Verify the token
        res.sendFile(path.join(__dirname, 'views', 'admin-activities.html'));
    } catch (error) {
        res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
});

app.get('/admin-gallery', (req, res) => {
    const token = req.query.token || req.headers.authorization?.split(' ')[1]; // Get token from query or headers
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });

    try {
        jwt.verify(token, SECRET_KEY); // Verify the token
        res.sendFile(path.join(__dirname, 'views', 'admin-gallery.html'));
    } catch (error) {
        res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
});

app.get('/admin-birthday', (req, res) => {
    const token = req.query.token || req.headers.authorization?.split(' ')[1]; // Get token from query or headers
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });

    try {
        jwt.verify(token, SECRET_KEY); // Verify the token
        res.sendFile(path.join(__dirname, 'views', 'admin-birthday.html')); // Serve the admin-birthday.html file
    } catch (error) {
        res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
});

app.get('/admin-planner', (req, res) => {
    const token = req.query.token || req.headers.authorization?.split(' ')[1]; // Get token from query or headers
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });

    try {
        jwt.verify(token, SECRET_KEY); // Verify the token
        res.sendFile(path.join(__dirname, 'views', 'admin-planner.html'));
    } catch (error) {
        res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
});

app.get('/admin-contact', (req, res) => {
    const token = req.query.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    try {
        jwt.verify(token, SECRET_KEY);
        res.sendFile(path.join(__dirname, 'views', 'admin-contact.html'));
    } catch (error) {
        res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
});
app.get('/gallery', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'gallery.html'));
});

app.get('/birthday', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'birthday.html'));
});
app.post('/submit-contact', (req, res) => {
    const { fullName, email, phone, reason, message } = req.body;
    if (!fullName?.trim() || !email?.trim() || !phone?.trim() || !message?.trim()) {
        return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
    const enquiryReason = reason?.trim() || 'Other';
    db.query(
        'INSERT INTO contact_messages (full_name, email, phone, reason, message) VALUES (?, ?, ?, ?, ?)',
        [fullName.trim(), email.trim(), phone.trim(), enquiryReason, message.trim()],
        (err) => {
            if (err) {
                console.error('Error saving contact message:', err);
                return res.status(500).json({ success: false, message: 'Unable to save your message. Please try again.' });
            }
            res.json({ success: true, message: 'Your message has been sent successfully.' });
        }
    );
});
app.get('/get-contact-messages', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });
    try {
        jwt.verify(token, SECRET_KEY);
        db.query('SELECT * FROM contact_messages ORDER BY created_at DESC', (err, results) => {
            if (err) return res.status(500).json({ success: false, message: 'DB error' });
            res.json(results);
        });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
});
app.post('/delete-contact-message', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false });
    try {
        jwt.verify(token, SECRET_KEY);
        const { id } = req.body;
        db.query('DELETE FROM contact_messages WHERE id = ?', [id], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: 'DB error' });
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Message not found' });
            }
            res.json({ success: true });
        });
    } catch (error) {
        res.status(401).json({ success: false });
    }
});

// Handle form submission
app.post('/submit-form', (req, res) => {
    const { parentName, mobile, email, city, branch } = req.body;

    // Send an email (mock implementation)
    const subject = 'New Admission Inquiry';
    const text = `
        Parent Name: ${parentName}
        Mobile: ${mobile}
        Email: ${email}
        City: ${city}
        Branch: ${branch}
    `;

    console.log('Email sent:', text); // Replace with actual email sending logic
    res.send('Form submitted successfully!');
});

// Sign-In Endpoint
app.post('/signin', (req, res) => {
    const { username, password } = req.body;
     console.log(username,password)
    // Check if the username and password match the environment variables
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        console.log(ADMIN_USERNAME,ADMIN_PASSWORD)
        // Generate a JWT token
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ success: true, token });
    } else {
        res.json({ success: false });
    }
});

// Upload Image Endpoint
app.post('/upload-image', (req, res) => {
    if (!req.files || !req.files.image) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const file = req.files.image;
    const fileName = `${Date.now()}-${file.name}`; // Add a timestamp to avoid filename conflicts
    const filePath = path.join(__dirname, 'uploads', fileName);

    // Save the file to the uploads folder
    file.mv(filePath, (err) => {
        if (err) {
            console.error('File upload failed:', err);
            return res.status(500).json({ success: false, message: 'File upload failed' });
        }
        console.log('File uploaded successfully:', fileName);
        res.json({ success: true, imageUrl: `/uploads/${fileName}` }); // Return the correct URL
    });
});

// Upload Images Endpoint
app.post('/upload-images', (req, res) => {
    if (!req.files || !req.files.images) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
    const imageUrls = files.map(file => {
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(__dirname, 'uploads', fileName);
        file.mv(filePath);
        return `/uploads/${fileName}`;
    });

    res.json({ success: true, imageUrls });
});

// Upload PDFs Endpoint
app.post('/upload-pdfs', (req, res) => {
    if (!req.files || !req.files.pdfs) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const files = Array.isArray(req.files.pdfs) ? req.files.pdfs : [req.files.pdfs];
    const pdfUrls = [];

    files.forEach(file => {
        // Check if file is a PDF
        if (file.mimetype !== 'application/pdf') {
            return res.status(400).json({ success: false, message: 'Only PDF files are allowed' });
        }

        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(__dirname, 'uploads', fileName);
        
        file.mv(filePath, (err) => {
            if (err) {
                console.error('File upload failed:', err);
                return res.status(500).json({ success: false, message: 'File upload failed' });
            }
        });
        
        pdfUrls.push(`/uploads/${fileName}`);
    });

    res.json({ success: true, pdfUrls });
});

// --- Activities Endpoints (MySQL) ---
app.post('/add-activity', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false });
    try {
        jwt.verify(token, SECRET_KEY);
        const { title, description, image } = req.body;
        db.query('SELECT * FROM activities WHERE title = ?', [title], (err, results) => {
            if (err) return res.status(500).json({ success: false, message: 'DB error' });
            if (results.length > 0) {
                return res.status(400).json({ success: false, message: 'Activity with this title already exists' });
            }
            db.query('INSERT INTO activities (title, description, image_url) VALUES (?, ?, ?)', [title, description, image], (err2) => {
                // if (err2) return res.status(500).json({ success: false, message: 'DB error' });
                if (err2) {
                    console.error('========== ADD ACTIVITY DB ERROR ==========');
                    console.error(err2);
                    console.error('SQL MESSAGE:', err2.message);
                    console.error('SQL CODE:', err2.code);
                    console.error('SQL STATE:', err2.sqlState);
                    console.error('SQL:', err2.sql);
                    console.error('============================================');
                
                    return res.status(500).json({
                        success: false,
                        message: 'DB error',
                        error: err2.message
                    });
                }
                res.json({ success: true });
            });
        });
    } catch (error) {
        res.status(401).json({ success: false });
    }
});

app.get('/get-activities', (req, res) => {
    db.query('SELECT * FROM activities', (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'DB error' });
        res.json(results);
    });
});

app.post('/update-activity', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false });
    try {
        jwt.verify(token, SECRET_KEY);
        const { originalTitle, title, description } = req.body;
        
        // Check if new title already exists (if title is being changed)
        if (originalTitle !== title) {
            db.query('SELECT * FROM activities WHERE title = ?', [title], (err, results) => {
                if (err) return res.status(500).json({ success: false, message: 'DB error' });
                if (results.length > 0) {
                    return res.status(400).json({ success: false, message: 'Activity with this title already exists' });
                }
                updateActivity();
            });
        } else {
            updateActivity();
        }
        
        function updateActivity() {
            db.query('UPDATE activities SET title = ?, description = ? WHERE title = ?', 
                [title, description, originalTitle], (err, result) => {
                if (err) return res.status(500).json({ success: false, message: 'DB error' });
                if (result.affectedRows === 0) {
                    return res.status(404).json({ success: false, message: 'Activity not found' });
                }
                res.json({ success: true });
            });
        }
    } catch (error) {
        res.status(401).json({ success: false });
    }
});

app.post('/delete-activity', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false });
    try {
        jwt.verify(token, SECRET_KEY);
        const { title } = req.body;
        db.query('DELETE FROM activities WHERE title = ?', [title], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: 'DB error' });
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Activity not found' });
            }
            res.json({ success: true });
        });
    } catch (error) {
        res.status(401).json({ success: false });
    }
});

// --- Gallery Endpoints (MySQL) ---
app.post('/add-gallery-item', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false });
    try {
        jwt.verify(token, SECRET_KEY);
        const { title, images } = req.body;
        db.query('SELECT * FROM gallery_items WHERE caption = ?', [title], (err, results) => {
            if (err) return res.status(500).json({ success: false, message: 'DB error' });
            if (results.length > 0) {
                return res.status(400).json({ success: false, message: 'Gallery item with this title already exists' });
            }
            // images is expected to be an array of URLs
            const insertMany = images.map(image_url => [image_url, title]);
            db.query('INSERT INTO gallery_items (image_url, caption) VALUES ?', [insertMany], (err2) => {
                // if (err2) return res.status(500).json({ success: false, message: 'DB error' });
                if (err2) {
                    console.error('========== ADD GALLERY DB ERROR ==========');
                    console.error(err2);
                    console.error('SQL MESSAGE:', err2.message);
                    console.error('SQL CODE:', err2.code);
                    console.error('SQL STATE:', err2.sqlState);
                    console.error('SQL:', err2.sql);
                    console.error('============================================');
                
                    return res.status(500).json({
                        success: false,
                        message: 'DB error',
                        error: err2.message
                    });
                }
                res.json({ success: true });
            });
        });
    } catch (error) {
        res.status(401).json({ success: false });
    }
});

app.get('/get-gallery', (req, res) => {
    db.query('SELECT caption, image_url FROM gallery_items', (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'DB error' });

        const galleryMap = {};

        results.forEach(row => {
            if (!galleryMap[row.caption]) {
                galleryMap[row.caption] = {
                    title: row.caption,
                    images: []
                };
            }
            galleryMap[row.caption].images.push(row.image_url);
        });

        res.json(Object.values(galleryMap));
    });
});




app.post('/delete-gallery-item', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false });

    try {
        jwt.verify(token, process.env.SECRET_KEY);

        const { title } = req.body;
        db.query('DELETE FROM gallery_items WHERE caption = ?', [title], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: 'DB error' });
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Gallery item not found' });
            }
            res.json({ success: true });
        });
    } catch (error) {
        res.status(401).json({ success: false });
    }
});


// --- Birthdays Endpoints (MySQL) ---
app.post('/add-birthday', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false });
    try {
        jwt.verify(token, SECRET_KEY);
        const { name, date, image, className } = req.body;
        db.query('SELECT * FROM birthdays WHERE name = ?', [name], (err, results) => {
            if (err) return res.status(500).json({ success: false, message: 'DB error' });
            if (results.length > 0) {
                return res.status(400).json({ success: false, message: 'Birthday with this name already exists' });
            }
            db.query('INSERT INTO birthdays (name, date_of_birth, class, image) VALUES (?, ?, ?, ?)', [name, date, className, image], (err2) => {
                if (err2) return res.status(500).json({ success: false, message: 'DB error' });
                res.json({ success: true });
            });
        });
    } catch (error) {
        res.status(401).json({ success: false });
    }
});

app.get('/get-birthdays', (req, res) => {
    db.query('SELECT * FROM birthdays', (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'DB error' });
        res.json(results);
    });
});

app.post('/delete-birthday', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false });
    try {
        jwt.verify(token, SECRET_KEY);
        const { name } = req.body;
        db.query('DELETE FROM birthdays WHERE name = ?', [name], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: 'DB error' });
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Birthday not found' });
            }
            res.json({ success: true });
        });
    } catch (error) {
        res.status(401).json({ success: false });
    }
});

// --- Planner Items Endpoints (MySQL) ---
app.post('/add-planner-item', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false });
    try {
        jwt.verify(token, SECRET_KEY);
        const { title, pdfs } = req.body; // pdfs is expected to be an array of URLs
        db.query('SELECT * FROM planner_items WHERE title = ?', [title], (err, results) => {
            if (err) return res.status(500).json({ success: false, message: 'DB error' });
            if (results.length > 0) {
                return res.status(400).json({ success: false, message: 'Planner with this title already exists' });
            }
            const insertMany = pdfs.map(pdf_url => [title, pdf_url]);
            db.query('INSERT INTO planner_items (title, pdf_url) VALUES ?', [insertMany], (err2) => {
                if (err2) return res.status(500).json({ success: false, message: 'DB error' });
                res.json({ success: true });
            });
        });
    } catch (error) {
        res.status(401).json({ success: false });
    }
});

app.get('/get-planner', (req, res) => {
    db.query('SELECT title, pdf_url FROM planner_items', (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'DB error' });

        const plannerMap = {};

        results.forEach(row => {
            if (!plannerMap[row.title]) {
                plannerMap[row.title] = {
                    title: row.title,
                    pdfs: []
                };
            }
            plannerMap[row.title].pdfs.push(row.pdf_url);
        });

        res.json(Object.values(plannerMap));
    });
});


app.post('/delete-planner-item', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false });
    try {
        jwt.verify(token, SECRET_KEY);
        const { title } = req.body;
        db.query('DELETE FROM planner_items WHERE title = ?', [title], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: 'DB error' });
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Planner not found' });
            }
            res.json({ success: true });
        });
    } catch (error) {
        res.status(401).json({ success: false });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});