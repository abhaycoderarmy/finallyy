// // services/notificationService.js
// const nodemailer = require('nodemailer');
// const twilio = require('twilio');
// require('dotenv').config();

// // Initialize Twilio client
// const twilioClient = new twilio(
//     process.env.TWILIO_ACCOUNT_SID,
//     process.env.TWILIO_AUTH_TOKEN
// );

// // Initialize Nodemailer transporter
// const emailTransporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD
//     }
// });

// class NotificationService {
//     static async sendEmail(booking, payment) {
//         const emailTemplate = `
//             <h1>Booking Confirmation - Urban Oasis</h1>
//             <p>Dear ${booking.first_name} ${booking.last_name},</p>
//             <p>Your booking has been confirmed and payment has been received successfully.</p>
            
//             <h2>Booking Details:</h2>
//             <ul>
//                 <li>Booking ID: ${booking.booking_id}</li>
//                 <li>Room Type: ${booking.room_type}</li>
//                 <li>Room Number: ${booking.room_number}</li>
//                 <li>Check-in Date: ${new Date(booking.check_in_date).toLocaleDateString()}</li>
//                 <li>Check-out Date: ${new Date(booking.check_out_date).toLocaleDateString()}</li>
//             </ul>

//             <h2>Payment Details:</h2>
//             <ul>
//                 <li>Amount Paid: ₹${payment.amount}</li>
//                 <li>Payment ID: ${payment.paymentId}</li>
//                 <li>Payment Method: ${payment.paymentMethod}</li>
//             </ul>

//             <p>Thank you for choosing Urban Oasis. We look forward to hosting you!</p>
//         `;

//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: booking.email,
//             subject: 'Booking Confirmation - Urban Oasis',
//             html: emailTemplate
//         };

//         try {
//             await emailTransporter.sendMail(mailOptions);
//             console.log('Confirmation email sent successfully');
//         } catch (error) {
//             console.error('Error sending email:', error);
//             throw error;
//         }
//     }

//     static async sendSMS(booking, payment) {
//         const message = `
//             Booking Confirmed! Urban Oasis
//             Booking ID: ${booking.booking_id}
//             Room: ${booking.room_type} (${booking.room_number})
//             Check-in: ${new Date(booking.check_in_date).toLocaleDateString()}
//             Amount Paid: ₹${payment.amount}
//             Thank you for choosing Urban Oasis!
//         `;

//         try {
//             await twilioClient.messages.create({
//                 body: message,
//                 to: booking.phone_number,
//                 from: process.env.TWILIO_PHONE_NUMBER
//             });
//             console.log('Confirmation SMS sent successfully');
//         } catch (error) {
//             console.error('Error sending SMS:', error);
//             throw error;
//         }
//     }

//     static async sendWhatsApp(booking, payment) {
//         const message = `
//             *Booking Confirmed! Urban Oasis* 🏨

//             Dear ${booking.first_name},
//             Your booking has been confirmed!

//             *Booking Details:*
//             Booking ID: ${booking.booking_id}
//             Room Type: ${booking.room_type}
//             Room Number: ${booking.room_number}
//             Check-in: ${new Date(booking.check_in_date).toLocaleDateString()}
//             Check-out: ${new Date(booking.check_out_date).toLocaleDateString()}

//             *Payment Details:*
//             Amount Paid: ₹${payment.amount}
//             Payment ID: ${payment.paymentId}

//             Thank you for choosing Urban Oasis! 🙏
//             For any assistance, please contact us at +91 9554112334.
//         `;

//         try {
//             await twilioClient.messages.create({
//                 body: message,
//                 to: `whatsapp:${booking.phone_number}`,
//                 from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`
//             });
//             console.log('WhatsApp message sent successfully');
//         } catch (error) {
//             console.error('Error sending WhatsApp message:', error);
//             throw error;
//         }
//     }

//     static async sendAllNotifications(booking, payment) {
//         try {
//             // Send all notifications concurrently
//             await Promise.all([
//                 this.sendEmail(booking, payment),
//                 this.sendSMS(booking, payment),
//                 this.sendWhatsApp(booking, payment)
//             ]);
//             return true;
//         } catch (error) {
//             console.error('Error sending notifications:', error);
//             // Don't throw error to prevent payment process from failing
//             return false;
//         }
//     }
// }

// module.exports = NotificationService;

const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

// Initialize Twilio client
const twilioClient = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

class NotificationService {
    // Helper function to format phone numbers
    static formatPhoneNumber(phoneNumber) {
        // Remove any non-digit characters
        const cleaned = phoneNumber.replace(/\D/g, '');
        
        // Add India country code if not present
        if (!cleaned.startsWith('91')) {
            return `+91${cleaned}`;
        }
        
        // Add + if missing
        return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
    }

    // Helper to validate phone number
    static validatePhoneNumber(phoneNumber) {
        const phoneRegex = /^\+?91[1-9]\d{9}$/;
        return phoneRegex.test(phoneNumber);
    }

    static async sendEmail(booking, payment) {
        const emailTemplate = `
            <h1>Booking Confirmation - Urban Oasis</h1>
            <p>Dear ${booking.first_name} ${booking.last_name},</p>
            <p>Your booking has been confirmed and payment has been received successfully.</p>
            
            <h2>Booking Details:</h2>
            <ul>
                <li>Booking ID: ${booking.booking_id}</li>
                <li>Room Type: ${booking.room_type}</li>
                <li>Room Number: ${booking.room_number}</li>
                <li>Check-in Date: ${new Date(booking.check_in_date).toLocaleDateString()}</li>
                <li>Check-out Date: ${new Date(booking.check_out_date).toLocaleDateString()}</li>
            </ul>

            <h2>Payment Details:</h2>
            <ul>
                <li>Amount Paid: ₹${payment.amount}</li>
                <li>Payment ID: ${payment.paymentId}</li>
                <li>Payment Method: ${payment.paymentMethod}</li>
            </ul>

            <p>Thank you for choosing Urban Oasis. We look forward to hosting you!</p>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: booking.email,
            subject: 'Booking Confirmation - Urban Oasis',
            html: emailTemplate
        };

        try {
            await emailTransporter.sendMail(mailOptions);
            return { success: true, channel: 'email' };
        } catch (error) {
            console.error('Error sending email:', error);
            return { 
                success: false, 
                channel: 'email',
                error: error.message 
            };
        }
    }

    static async sendSMS(booking, payment) {
        try {
            const formattedPhone = this.formatPhoneNumber(booking.phone_number);
            
            if (!this.validatePhoneNumber(formattedPhone)) {
                throw new Error(`Invalid phone number format: ${formattedPhone}`);
            }

            const message = `
                Booking Confirmed! Urban Oasis
                Booking ID: ${booking.booking_id}
                Room: ${booking.room_type} (${booking.room_number})
                Check-in: ${new Date(booking.check_in_date).toLocaleDateString()}
                Amount Paid: ₹${payment.amount}
                Thank you for choosing Urban Oasis!
            `;

            await twilioClient.messages.create({
                body: message,
                to: formattedPhone,
                from: process.env.TWILIO_PHONE_NUMBER
            });
            
            return { success: true, channel: 'sms' };
        } catch (error) {
            console.error('Error sending SMS:', error);
            return { 
                success: false, 
                channel: 'sms',
                error: error.message 
            };
        }
    }

    static async sendWhatsApp(booking, payment) {
        try {
            const formattedPhone = this.formatPhoneNumber(booking.phone_number);
            
            if (!this.validatePhoneNumber(formattedPhone)) {
                throw new Error(`Invalid phone number format: ${formattedPhone}`);
            }

            // Verify WhatsApp configuration
            if (!process.env.TWILIO_WHATSAPP_NUMBER) {
                throw new Error('WhatsApp sender number not configured');
            }

            const message = `
                *Booking Confirmed! Urban Oasis* 🏨

                Dear ${booking.first_name},
                Your booking has been confirmed!

                *Booking Details:*
                Booking ID: ${booking.booking_id}
                Room Type: ${booking.room_type}
                Room Number: ${booking.room_number}
                Check-in: ${new Date(booking.check_in_date).toLocaleDateString()}
                Check-out: ${new Date(booking.check_out_date).toLocaleDateString()}

                *Payment Details:*
                Amount Paid: ₹${payment.amount}
                Payment ID: ${payment.paymentId}

                Thank you for choosing Urban Oasis! 🙏
                For any assistance, please contact us at +91 9554112334.
            `;

            await twilioClient.messages.create({
                body: message,
                to: `whatsapp:${formattedPhone}`,
                from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`
            });
            
            return { success: true, channel: 'whatsapp' };
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
            return { 
                success: false, 
                channel: 'whatsapp',
                error: error.message 
            };
        }
    }

    static async sendAllNotifications(booking, payment) {
        const results = await Promise.all([
            this.sendEmail(booking, payment),
            this.sendSMS(booking, payment),
            this.sendWhatsApp(booking, payment)
        ]);

        const successCount = results.filter(result => result.success).length;
        const failures = results.filter(result => !result.success);

        if (failures.length > 0) {
            console.error(`Some notifications failed for booking ${booking.booking_id}:`, 
                failures.map(f => `${f.channel}: ${f.error}`).join(', ')
            );
        }

        return {
            success: successCount > 0,  // Consider partial success if at least one notification sent
            results,
            failureCount: failures.length,
            successCount
        };
    }
}

module.exports = NotificationService;