"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcomeTemplate = exports.WelcomeTemplate = void 0;
const base_template_1 = require("./base.template");
class WelcomeTemplate extends base_template_1.BaseTemplate {
    getSubject(data) {
        return `🎉 Welcome to MonoRepo gRPC App, ${data.name}!`;
    }
    getHtml(data) {
        const escapedName = this.escape(data.name);
        const escapedEmail = this.escape(data.email);
        return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to MonoRepo gRPC App</title>
        <style>${this.getStyles()}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome, ${escapedName}! 🚀</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${escapedName}</strong>,</p>
            <p>Thank you for creating an account with us! We're excited to have you on board.</p>
            <p>Your account has been successfully created and you're all set to start using our platform.</p>
            <p>Here's what you can do next:</p>
            <ul>
              <li>Complete your profile</li>
              <li>Explore our features</li>
              <li>Start creating tasks</li>
            </ul>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            ${data.loginUrl ? `<p><a href="${data.loginUrl}" class="button">Get Started</a></p>` : ""}
            <p>Best regards,<br>The MonoRepo gRPC Team</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${escapedEmail}</p>
            <p>&copy; ${new Date().getFullYear()} MonoRepo gRPC App. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }
    getText(data) {
        return `
Welcome, ${data.name}!

Thank you for creating an account with us! We're excited to have you on board.

Your account has been successfully created and you're all set to start using our platform.

Here's what you can do next:
- Complete your profile
- Explore our features
- Start creating tasks

If you have any questions, feel free to reach out to our support team.

Best regards,
The MonoRepo gRPC Team

---
This email was sent to ${data.email}
© ${new Date().getFullYear()} MonoRepo gRPC App. All rights reserved.
    `.trim();
    }
}
exports.WelcomeTemplate = WelcomeTemplate;
exports.welcomeTemplate = new WelcomeTemplate();
