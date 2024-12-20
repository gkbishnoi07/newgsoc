const express = require('express');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
app.use(express.json());

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Serve static files
app.use(express.static('public'));

// SMS sending endpoint
app.post('/api/send-sms', async (req, res) => {
    try {
        const { to, message } = req.body;
        
        // Validate input
        if (!to || !message) {
            return res.status(400).json({ 
                error: 'Phone number and message are required' 
            });
        }

        // Send SMS using Twilio
        const twilioMessage = await client.messages.create({
            body: message,
            to: to,
            from: process.env.TWILIO_PHONE_NUMBER
        });

        res.json({ 
            success: true, 
            messageId: twilioMessage.sid 
        });
    } catch (error) {
        console.error('SMS sending error:', error);
        res.status(500).json({ 
            error: 'Failed to send SMS',
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});