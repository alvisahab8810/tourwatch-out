import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(to, name, otp) {
  await transporter.sendMail({
    from:    process.env.SMTP_FROM,
    to,
    subject: `${otp} is your Tourwatchout verification code`,
    html: `
      <div style="font-family:'DM Sans',Arial,sans-serif;max-width:480px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
        <div style="background:linear-gradient(135deg,#e84949,#ff6b6b);padding:32px 32px 24px;text-align:center">
          <img src="https://tourwatchout.com/assets/images/logo.png" alt="Tourwatchout" style="height:40px;object-fit:contain" />
        </div>
        <div style="padding:32px">
          <h2 style="margin:0 0 8px;font-size:22px;color:#111">Hi ${name},</h2>
          <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px">
            Use the code below to verify your email and complete your Tourwatchout account setup.
          </p>
          <div style="text-align:center;margin:0 0 24px">
            <div style="display:inline-block;background:#fff8f8;border:2px dashed #e84949;border-radius:12px;padding:18px 36px">
              <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#e84949">${otp}</span>
            </div>
          </div>
          <p style="color:#888;font-size:12px;text-align:center;margin:0 0 24px">
            This code expires in <strong>10 minutes</strong>. Do not share it with anyone.
          </p>
          <hr style="border:none;border-top:1px solid #f0f0f0;margin:0 0 20px" />
          <p style="color:#aaa;font-size:11px;text-align:center;margin:0">
            If you didn't request this, you can safely ignore this email.<br/>
            &copy; ${new Date().getFullYear()} Tourwatchout. All rights reserved.
          </p>
        </div>
      </div>
    `,
  });
}
