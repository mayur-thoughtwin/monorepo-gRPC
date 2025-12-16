import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "tempthoughtwin@gmail.com",
    pass: process.env.EMAIL_PASS || "bmrf njdq vyos jojv",
  },
});

export const sendEmail = async (options: {
  html?: string;
  to: string;
  subject: string;
  text: string;
}) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const subject = "🎉 Welcome to MonoRepo gRPC App!";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome, ${name}! 🚀</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${name}</strong>,</p>
          <p>Thank you for creating an account with us! We're excited to have you on board.</p>
          <p>Your account has been successfully created and you're all set to start using our platform.</p>
          <p>Here's what you can do next:</p>
          <ul>
            <li>Complete your profile</li>
            <li>Explore our features</li>
            <li>Start creating tasks</li>
          </ul>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The MonoRepo gRPC Team</p>
        </div>
        <div class="footer">
          <p>This email was sent to ${email}</p>
          <p>&copy; ${new Date().getFullYear()} MonoRepo gRPC App. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Welcome, ${name}!
    
    Thank you for creating an account with us! We're excited to have you on board.
    
    Your account has been successfully created and you're all set to start using our platform.
    
    Here's what you can do next:
    - Complete your profile
    - Explore our features
    - Start creating tasks
    
    If you have any questions, feel free to reach out to our support team.
    
    Best regards,
    The MonoRepo gRPC Team
  `;

  await sendEmail({
    to: email,
    subject,
    text,
    html,
  });
};

