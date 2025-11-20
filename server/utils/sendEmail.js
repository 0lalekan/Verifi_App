import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create Transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use the built-in 'gmail' service for better compatibility
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    // Debug settings to see logs in terminal
    logger: true,
    debug: true 
  });

  // Define Email Options
  const message = {
    from: `Verifi Security <${process.env.SMTP_EMAIL}>`, // Gmail forces the sender to be YOU
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Send
  try {
    const info = await transporter.sendMail(message);
    console.log('✅ Email Sent Successfully! Message ID: %s', info.messageId);
  } catch (error) {
    console.error('❌ Email Send Failed:', error);
    throw error; // Re-throw so the controller catches it
  }
};

export default sendEmail;