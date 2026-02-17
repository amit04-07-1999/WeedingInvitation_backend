const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Email Route
app.post('/api/rsvp', async (req, res) => {
    const { name, message, attendance } = req.body;

    if (!name || !attendance) {
        return res.status(400).json({ success: false, message: 'Name and attendance are required.' });
    }

    try {
        // Create Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email Options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO, // Send to the specific recipient
            subject: `New Wedding RSVP from ${name}`,
            text: `
                Name: ${name}
                Attendance: ${attendance}
                Message: ${message || 'No message'}
            `,
            html: `
                <div style="font-family: 'Playfair Display', serif; background-color: #0E2216; color: #E8D5B7; padding: 40px; text-align: center;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: rgba(26, 92, 66, 0.4); border: 2px solid #D4A853; border-radius: 15px; padding: 30px; box-shadow: 0 0 20px rgba(212, 168, 83, 0.2);">
                        <h1 style="color: #F0D78C; font-family: 'Great Vibes', cursive; font-size: 3rem; margin-bottom: 10px;">Ashish & Sapna</h1>
                        <p style="color: #D4A853; text-transform: uppercase; letter-spacing: 2px; font-size: 0.9rem; margin-bottom: 30px;">Wedding RSVP Notification</p>
                        
                        <div style="border-top: 1px solid rgba(212, 168, 83, 0.3); border-bottom: 1px solid rgba(212, 168, 83, 0.3); padding: 20px 0; margin-bottom: 30px;">
                            <h2 style="color: #FFFDF5; margin-bottom: 20px;">New Response Received</h2>
                            
                            <p style="font-size: 1.1rem; margin: 10px 0;">
                                <strong style="color: #D4A853;">Guest Name:</strong><br>
                                <span style="color: #FFFDF5; font-size: 1.2rem;">${name}</span>
                            </p>
                            
                            <p style="font-size: 1.1rem; margin: 10px 0;">
                                <strong style="color: #D4A853;">Attendance:</strong><br>
                                <span style="font-size: 1.2rem; padding: 5px 10px; border-radius: 5px; background-color: ${attendance === 'yes' ? 'rgba(72, 187, 120, 0.2)' : 'rgba(229, 62, 62, 0.2)'}; color: ${attendance === 'yes' ? '#48BB78' : '#FC8181'};">
                                    ${attendance === 'yes' ? 'Joyfully Accepting' : 'Regretfully Declining'}
                                </span>
                            </p>
                            
                            <p style="font-size: 1.1rem; margin: 10px 0;">
                                <strong style="color: #D4A853;">Message:</strong><br>
                                <span style="color: #FFFDF5; font-style: italic;">"${message || 'No message provided'}"</span>
                            </p>
                        </div>
                        
                        <p style="font-size: 0.8rem; color: rgba(232, 213, 183, 0.6);">
                            Received via Wedding Invitation Website<br>
                            ${new Date().toLocaleString()}
                        </p>
                    </div>
                </div>
            `
        };

        // Send Email
        await transporter.sendMail(mailOptions);

        console.log(`RSVP received from ${name}`);
        res.status(200).json({ success: true, message: 'RSVP sent successfully!' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send RSVP.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
