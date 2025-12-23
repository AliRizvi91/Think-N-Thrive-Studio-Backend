import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/* =======================
   ENV VALIDATION
======================= */
const requiredEnvVars = [
  "SENDMAIL_HOST",
  "SENDMAIL_PORT",
  "SENDMAIL_SECURE",
  "MAILER_USER",
  "MAILER_PASS",
  "FRONTEND_URL",
];

const missingVars = requiredEnvVars.filter(
  (key) => !process.env[key]
);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
}

/* =======================
   TRANSPORTER
======================= */
const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SENDMAIL_HOST,
  port: Number(process.env.SENDMAIL_PORT),
  secure: process.env.SENDMAIL_SECURE === "true",
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
});

/* =======================
   SEND MAIL FUNCTION
======================= */
export const sendmailer = async (
  email: string,
  token: string,
  userName: string
): Promise<void> => {
  const currentYear = new Date().getFullYear();

  const encodedToken = encodeURIComponent(token);
  const encodedEmail = encodeURIComponent(email);

  const verificationUrl = `${process.env.FRONTEND_URL}/verification?token=${encodedToken}&email=${encodedEmail}`;

  const mailOptions = {
    from: {
      name: "Think N Thrive",
      address: process.env.MAILER_USER as string,
    },
    to: email,
    subject: "Confirm Your Email Address",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirm Your Email</title>
</head>

<body style="
  margin:0;
  padding:0;
  background-color:#f5f5f5;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Helvetica,
    Arial,
    sans-serif;
  color:#000;
">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:50px 0;">
    <tr>
      <td align="center">

        <table width="400" cellpadding="0" cellspacing="0" role="presentation"
          style="
            background:#ffffff;
            border-radius:32px;
            padding:40px;
            text-align:center;
            box-shadow:0 10px 30px rgba(0,0,0,0.15);
          "
        >
          <tr>
            <td>

              <h1 style="
                font-size:24px;
                font-weight:800;
                margin:0 0 10px;
              ">
                Think <span style="color:#0ea5e9;">N</span> Thrive Studio
              </h1>

              <h4 style="
                font-size:18px;
                font-weight:600;
                margin:0 0 6px;
              ">
                Hey ${userName}
              </h4>

              <p style="
                font-size:14px;
                font-weight:400;
                margin:0 0 24px;
              ">
                You need to confirm your email
              </p>

              <a
                href="${verificationUrl}"
                style="
                  display:inline-block;
                  padding:12px 34px;
                  background:#000000;
                  color:#ffffff;
                  text-decoration:none;
                  border-radius:9999px;
                  font-size:14px;
                  font-weight:600;
                  margin-bottom:24px;
                "
              >
                Verify Email
              </a>

              <p style="
                font-size:14px;
                line-height:1.6;
                margin:0 0 14px;
              ">
                Thank you for visiting <strong>Think N Thrive</strong>. We’re glad
                to have you here and hope our educational resources help you
                learn, grow, and achieve your goals. Your journey matters to
                us—keep thinking, keep thriving!
              </p>

              <p style="
                font-size:12px;
                color:#dc2626;
                margin:0 0 22px;
              ">
                If you didn’t request this, ignore it. Link expires in 24 hours.
              </p>

              <p style="
                font-size:12px;
                font-weight:600;
                margin:0;
              ">
                © ${currentYear} Think N Thrive. All rights reserved.
              </p>

            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};
