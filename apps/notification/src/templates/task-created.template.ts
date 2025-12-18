import { BaseTemplate } from "./base.template";

export interface TaskCreatedTemplateData {
  adminName: string;
  taskId: string;
  taskName: string;
  userId: string;
  userName: string;
  createdAt: string;
}

class TaskCreatedTemplate extends BaseTemplate<TaskCreatedTemplateData> {
  getSubject(data: TaskCreatedTemplateData): string {
    return `🆕 New Task Created: "${this.escape(data.taskName)}"`;
  }

  getHtml(data: TaskCreatedTemplateData): string {
    const formattedDate = new Date(data.createdAt).toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
    });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${this.getStyles()}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🆕 New Task Created</h1>
            </div>
            <div class="content">
              <p>Hello ${this.escape(data.adminName)},</p>
              
              <p>A new task has been created in your system. Here are the details:</p>
              
              <div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 0 5px 5px 0;">
                <h3 style="margin: 0 0 15px 0; color: #667eea;">📋 Task Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; width: 120px;">Task Name:</td>
                    <td style="padding: 8px 0;">${this.escape(data.taskName)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Task ID:</td>
                    <td style="padding: 8px 0; font-family: monospace; font-size: 12px; color: #666;">${this.escape(data.taskId)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Created By:</td>
                    <td style="padding: 8px 0;">${this.escape(data.userName)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">User ID:</td>
                    <td style="padding: 8px 0; font-family: monospace; font-size: 12px; color: #666;">${this.escape(data.userId)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Created At:</td>
                    <td style="padding: 8px 0;">${formattedDate}</td>
                  </tr>
                </table>
              </div>
              
              <p>You can view and manage this task in the admin dashboard.</p>
              
              <a href="#" class="button" style="display: inline-block; margin-top: 15px;">View Task in Dashboard</a>
            </div>
            <div class="footer">
              <p>This is an automated notification from MonoRepo gRPC App</p>
              <p>© ${new Date().getFullYear()} MonoRepo gRPC App. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  getText(data: TaskCreatedTemplateData): string {
    const formattedDate = new Date(data.createdAt).toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
    });

    return `
New Task Created

Hello ${data.adminName},

A new task has been created in your system. Here are the details:

Task Details:
- Task Name: ${data.taskName}
- Task ID: ${data.taskId}
- Created By: ${data.userName}
- User ID: ${data.userId}
- Created At: ${formattedDate}

You can view and manage this task in the admin dashboard.

---
This is an automated notification from MonoRepo gRPC App
    `.trim();
  }
}

export const taskCreatedTemplate = new TaskCreatedTemplate();
export { TaskCreatedTemplate };

