// Base template class for all email templates
export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

export abstract class BaseTemplate<T> {
  abstract getSubject(data: T): string;
  abstract getHtml(data: T): string;
  abstract getText(data: T): string;

  getContent(data: T): EmailContent {
    return {
      subject: this.getSubject(data),
      html: this.getHtml(data),
      text: this.getText(data),
    };
  }

  // Escape HTML to prevent XSS
  protected escape(str: string): string {
    const htmlEscapes: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return str.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
  }

  // Common styles shared across templates
  protected getStyles(): string {
    return `
      body { 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        line-height: 1.6; 
        color: #333; 
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .container { 
        max-width: 600px; 
        margin: 20px auto; 
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      .header { 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
        color: white; 
        padding: 30px; 
        text-align: center; 
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content { 
        padding: 30px; 
      }
      .content p {
        margin: 15px 0;
      }
      .content ul {
        padding-left: 20px;
      }
      .content li {
        margin: 8px 0;
      }
      .button { 
        display: inline-block; 
        background: #667eea; 
        color: white !important; 
        padding: 12px 30px; 
        text-decoration: none; 
        border-radius: 5px; 
        margin-top: 20px; 
        font-weight: bold;
      }
      .button:hover {
        background: #5a6fd6;
      }
      .footer { 
        text-align: center; 
        padding: 20px;
        background: #f9f9f9;
        color: #666; 
        font-size: 12px; 
        border-top: 1px solid #eee;
      }
      .footer p {
        margin: 5px 0;
      }
    `;
  }
}

