import nodemailer from "nodemailer";

export async function sendLeadConfirmationEmail({ name, email, phone, destination }) {
  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from:    `TourWatchOut <${process.env.SMTP_FROM}>`,
    to:      email,
    subject: `We've received your travel request, ${name}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif">
  <div style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10)">

    <!-- Header Banner -->
    <div style="background:#EE4C49;padding:40px 32px 32px;text-align:center">
      <h1 style="margin:0 0 6px;color:#fff;font-size:26px;font-weight:800;letter-spacing:-0.5px">Request Received</h1>
      <p style="margin:0;color:rgba(255,255,255,0.80);font-size:14px">We will call you within 24 hours</p>
    </div>

    <!-- Body -->
    <div style="padding:32px 32px 24px">
      <p style="margin:0 0 6px;font-size:16px;color:#0f172a">Hi <strong>${name}</strong>,</p>
      <p style="margin:0 0 28px;font-size:14px;color:#64748b;line-height:1.7">
        Thank you for reaching out to <strong>TourWatchOut</strong>. We have received your travel enquiry and our expert will be in touch with you shortly to craft the perfect itinerary.
      </p>

      <!-- Details card -->
      <div style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:28px">
        <div style="background:#f8fafc;padding:12px 18px;border-bottom:1px solid #e2e8f0">
          <p style="margin:0;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em">Your Enquiry Details</p>
        </div>
        <table style="width:100%;border-collapse:collapse">
          ${destination ? `
          <tr>
            <td style="padding:13px 18px;width:110px;font-size:12px;color:#94a3b8;font-weight:600;border-bottom:1px solid #f1f5f9">Destination</td>
            <td style="padding:13px 18px;font-size:13px;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9">${destination}</td>
          </tr>` : ""}
          <tr>
            <td style="padding:13px 18px;width:110px;font-size:12px;color:#94a3b8;font-weight:600;border-bottom:1px solid #f1f5f9">Mobile</td>
            <td style="padding:13px 18px;font-size:13px;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9">${phone}</td>
          </tr>
          <tr>
            <td style="padding:13px 18px;width:110px;font-size:12px;color:#94a3b8;font-weight:600">Email</td>
            <td style="padding:13px 18px;font-size:13px;font-weight:600;color:#0f172a">${email}</td>
          </tr>
        </table>
      </div>

      <!-- What's next -->
      <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.05em">What happens next</p>
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="width:36px;vertical-align:top;padding-bottom:16px">
            <div style="width:26px;height:26px;background:#EE4C49;border-radius:50%;color:#fff;font-size:12px;font-weight:800;text-align:center;line-height:26px">1</div>
          </td>
          <td style="padding:4px 0 16px 12px;font-size:13px;color:#374151;border-bottom:1px solid #f1f5f9">Our travel expert reviews your enquiry</td>
        </tr>
        <tr>
          <td style="width:36px;vertical-align:top;padding-bottom:16px;padding-top:4px">
            <div style="width:26px;height:26px;background:#EE4C49;border-radius:50%;color:#fff;font-size:12px;font-weight:800;text-align:center;line-height:26px">2</div>
          </td>
          <td style="padding:8px 0 16px 12px;font-size:13px;color:#374151;border-bottom:1px solid #f1f5f9">We call you within <strong>24 hours</strong> to understand your needs</td>
        </tr>
        <tr>
          <td style="width:36px;vertical-align:top;padding-top:4px">
            <div style="width:26px;height:26px;background:#EE4C49;border-radius:50%;color:#fff;font-size:12px;font-weight:800;text-align:center;line-height:26px">3</div>
          </td>
          <td style="padding:8px 0 0 12px;font-size:13px;color:#374151">You receive a custom travel plan tailored for you</td>
        </tr>
      </table>
    </div>

    <!-- CTA -->
    <div style="padding:8px 32px 36px;text-align:center">
      <a href="https://tourwatchout.com" style="display:inline-block;background:#EE4C49;color:#fff;text-decoration:none;padding:14px 40px;border-radius:50px;font-size:14px;font-weight:700;letter-spacing:0.2px">
        Explore Our Packages
      </a>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #f1f5f9">
      <p style="margin:0 0 6px;font-size:12px;color:#94a3b8">© ${new Date().getFullYear()} TourWatchOut. All rights reserved.</p>
      <p style="margin:0;font-size:11px;color:#cbd5e1">If you did not make this request, please ignore this email.</p>
    </div>

  </div>
</body>
</html>
    `,
  });
}

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
