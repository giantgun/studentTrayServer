import dotenv from "dotenv";
import { Response } from "express";
import nodemailer from "nodemailer";

dotenv.config;

export function IsProductAllowed(
  productSchoolArray: any[],
  userSchoolId: number,
) {
  for (let i = 0; i < productSchoolArray.length!; i++) {
    if (productSchoolArray[i].schoolId === userSchoolId) {
      return true;
    }
  }
  return false;
}

export async function sleep(ms: number | undefined) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export async function sendAnEmail(
  email: string,
  subject: string,
  message: string,
  res?: Response,
) {
  var transporter = nodemailer.createTransport({
    // service: process.env.COMPANY_EMAIL_SERVICE,
    host: "smtp.zoho.com",
    port: 587,
    service: "Zoho",
    secure: true,
    auth: {
      user: process.env.COMPANY_EMAIL_ZOHO,
      pass: process.env.COMPANY_EMAIL_PASSWORD_ZOHO,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  var mailOptions = {
    from: process.env.COMPANY_EMAIL_ZOHO,
    to: email,
    subject: subject,
    html: message,
  };

  await transporter.sendMail(mailOptions);
  try {
  } catch (error) {
    console.error(error);
  }
}

export async function sendAnEmailAsText(
  email: string,
  subject: string,
  message: string,
  emailfrom: string,
  res?: Response,
) {
  var transporter = nodemailer.createTransport({
    // service: process.env.COMPANY_EMAIL_SERVICE,
    host: "smtp.zoho.com",
    port: 587,
    service: "Zoho",
    secure: true,
    auth: {
      user: process.env.COMPANY_EMAIL_ZOHO,
      pass: process.env.COMPANY_EMAIL_PASSWORD_ZOHO,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  var mailOptions = {
    from: emailfrom,
    to: email,
    subject: subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);
  try {
  } catch (error) {
    console.error(error);
  }
}

export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function verifyEmailMessage(verificationLink: string) {
  return `<!doctype html>
          <html lang="en">
          <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Email Verification</title>
              <style>
              body {
                  font-family: Arial, sans-serif;
                  min-height: 100vh;
                  background-color: #f3f4f6;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  padding: 12px 16px;
                  margin: 0;
              }
                  a {
                    color: inherit;
                    text-decoration: none;
                  }
              .container {
                  margin: auto;
                  background-color: white;
                  padding: 5% 7%;
                  border-radius: 8px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  max-width: 500px;
                  width: 100%;
                  align-items: center;
                  text-align: center;
                  box-sizing: border-box;
              }
              img {
                  max-width: 100%;
                  height: auto;
                  margin-bottom: 0px;
              }
              h2 {
                  margin: 8px 0;
                  text-align: center;
                  font-size: clamp(18px, 5vw, 24px);
                  font-weight: 800;
                  color: #111827;
              }
              h3 {
                  margin: 0;
                  text-align: center;
                  font-size: clamp(10px, 5vw, 24px);
                  font-weight: 800;
                  color: rgba(75, 0, 130, 0.8);
              }
              p {
                  text-align: center;
                  font-size: clamp(12px, 3vw, 14px);
                  color: #6b7280;
                  margin-bottom: 24px;
              }
              .verify-button {
                  display: block;
                  width: 100%;
                  background-color: rgb(75, 0, 130);
                  color: white;
                  padding-top: 10px;
                  padding-bottom: 10px;
                  text-align: center;
                  text-decoration: none;
                  font-size: clamp(12px, 3vw, 14px);
                  font-weight: 600;
                  border-radius: 4px;
                  border: none;
                  cursor: pointer;
                  transition: background-color 0.2s;
              }
              .verify-button:hover {
                  background-color: rgba(75, 0, 130, 0.8);
              }
              .divider {
                  display: flex;
                  align-items: center;
                  text-align: center;
                  margin: 24px 0;
                  width: 100%;
              }
              .divider::before,
              .divider::after {
                  content: "";
                  flex: 1;
                  border-bottom: 1px solid #e5e7eb;
              }
              .divider-text {
                  padding: 0 8px;
                  color: #6b7280;
                  font-size: clamp(10px, 2.5vw, 12px);
              }
              .footer {
                  margin-top: 32px;
                  text-align: center;
                  font-size: clamp(10px, 2.5vw, 12px);
                  color: #6b7280;
              }
              .footer a {
                  color: rgb(75, 0, 130);
                  text-decoration: underline;
                  font-weight: 500;
              }
              .footer a:hover {
                  text-decoration: underline;
              }
              .logo {
                  margin: 5px, auto;
                  padding: auto;
                  align-items: center;
                  text-align: center;
              }
              @media (max-width: 480px) {
                  .container {
                  padding: 30px;
                  }
                  .verify-button {
                  margin-left: 15px;
                  margin-right: 15px;
                  }
              }
              </style>
          </head>
          <body>
              <div class="container">
              <div class="logo">
                  <img src="http://${process.env.SITE_URL}/logo.jpg" width="30" alt="Logo" />
                  <h3>StudentTray</h3>
              </div>
              <h2>Verify Your Email</h2>
              <p>
                  Please click the button below to verify your email address and activate
                  your account.
              </p>
              <a href='http://${verificationLink}'}" class="verify-button">Verify Email</a>
              <div class="divider">
                  <span class="divider-text">Or copy and paste link in your browser</span>
              </div>
              <p
                  style="
                  word-break: break-all;
                  font-size: clamp(10px, 2.5vw, 12px);
                  color: rgb(75, 0, 130);
                  "
              >
                  http://${verificationLink}
              </p>
              <div class="footer">
                  <p>Already have an account? <a href="http://${process.env.SITE_URL}/login">Log in</a></p>
              </div>
              </div>
          </body>
          </html>`;
}

export function changePasswordMessage(verificationLink: string) {
  return `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        min-height: 100vh;
        background-color: #f3f4f6;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 12px 16px;
        margin: 0;
    }
    .container {
        margin: auto;
        background-color: white;
        padding: 5% 7%;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 500px;
        width: 100%;
        align-items: center;
        text-align: center;
        box-sizing: border-box;
    }
    img {
        max-width: 100%;
        height: auto;
        margin-bottom: 0px;
    }
    h2 {
        margin: 8px 0;
        text-align: center;
        font-size: clamp(18px, 5vw, 24px);
        font-weight: 800;
        color: #111827;
    }
    h3 {
        margin: 0;
        text-align: center;
        font-size: clamp(10px, 5vw, 24px);
        font-weight: 800;
        color: rgba(75, 0, 130, 0.8);
    }
    p {
        text-align: center;
        font-size: clamp(12px, 3vw, 14px);
        color: #6b7280;
        margin-bottom: 24px;
    }
    .verify-button {
        display: block;
        width: 100%;
        background-color: rgb(75, 0, 130);
        color: white;
        text-align: center;
        padding-top: 10px;
        padding-bottom: 10px;
        text-decoration: none;
        font-size: clamp(12px, 3vw, 14px);
        font-weight: 600;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    .verify-button:hover {
        background-color: rgba(75, 0, 130, 0.8);
        color: white;
    }
    .divider {
        display: flex;
        align-items: center;
        text-align: center;
        margin: 24px 0;
        width: 100%;
    }
    .divider::before,
    .divider::after {
        content: "";
        flex: 1;
        border-bottom: 1px solid #e5e7eb;
    }
    .divider-text {
        padding: 0 8px;
        color: #6b7280;
        font-size: clamp(10px, 2.5vw, 12px);
    }
    .footer {
        margin-top: 32px;
        text-align: center;
        font-size: clamp(10px, 2.5vw, 12px);
        color: #6b7280;
    }
    .footer a {
        color: rgb(75, 0, 130);
        text-decoration: none;
        font-weight: 500;
    }
    .footer a:hover {
        text-decoration: underline;
    }
    .logo {
        margin: 5px, auto;
        padding: auto;
        align-items: center;
        text-align: center;
    }
    @media (max-width: 480px) {
        .container {
        padding: 30px;
        }
        .verify-button {
        margin-left: 15px;
        margin-right: 15px;
        }
    }
    </style>
</head>
<body>
    <div class="container">
    <div class="logo">
        <img src="http://${process.env.SITE_URL}/logo.jpg" width="30" alt="Logo" />
        <h3>StudentTray</h3>
    </div>
    <h2>Change Your Password</h2>
    <p>
        Please click the button below to change your password.
    </p>
    <a href='http://${verificationLink}' class="verify-button">Change Password</a>
    <div class="divider">
        <span class="divider-text">Or copy and paste link in your browser</span>
    </div>
    <p
        style="
        word-break: break-all;
        font-size: clamp(10px, 2.5vw, 12px);
        color: rgb(75, 0, 130);
        "
    >
        http://${verificationLink}
    </p>
    <div class="footer">
        <p>Remember your password? <a href="http://${process.env.SITE_URL}/login">Log in</a></p>
    </div>
    </div>
</body>
</html>`;
}
