import { BaseTemplate } from "./base.template";

export interface UserUpdatedTemplateData {
  name: string;
  email: string;
  changes: string[];
  updatedAt: string;
}

export class UserUpdatedTemplate extends BaseTemplate<UserUpdatedTemplateData> {
  getSubject(data: UserUpdatedTemplateData): string {
    return `📝 Your Profile Has Been Updated`;
  }

  getHtml(data: UserUpdatedTemplateData): string {
    const escapedName = this.escape(data.name);
    const escapedEmail = this.escape(data.email);

    const changesList = data.changes
      .map((change) => `<li>${this.escape(change)}</li>`)
      .join("");

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Profile Updated</title>
        <style>${this.getStyles()}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Profile Updated 📝</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${escapedName}</strong>,</p>
            <p>Your profile has been successfully updated.</p>
            <p><strong>Changes made:</strong></p>
            <ul>
              ${changesList}
            </ul>
            <p><em>Updated at: ${this.escape(data.updatedAt)}</em></p>
            <p>If you didn't make these changes, please contact our support team immediately.</p>
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

  getText(data: UserUpdatedTemplateData): string {
    const changesList = data.changes.map((change) => `- ${change}`).join("\n");

    return `
Hi ${data.name},

Your profile has been successfully updated.

Changes made:
${changesList}

Updated at: ${data.updatedAt}

If you didn't make these changes, please contact our support team immediately.

Best regards,
The MonoRepo gRPC Team

---
This email was sent to ${data.email}
© ${new Date().getFullYear()} MonoRepo gRPC App. All rights reserved.
    `.trim();
  }
}

export const userUpdatedTemplate = new UserUpdatedTemplate();

