import fs from "fs";
import path from "path";
import formidable from "formidable";
import nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: false, // Disable default body parser for file uploads
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new formidable.IncomingForm({
      uploadDir,
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(500).json({ message: "Error processing form data." });
      }

      const { name, email, phone, appliedPosition } = fields;
      const resume = files.resume;

      try {
        // Generate the file URL
        const fileUrl = `/uploads/${path.basename(resume.filepath)}`;

        // Send email with the data
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "your-email@gmail.com", // Replace with your email
            pass: "your-email-password", // Replace with your email password
          },
        });

        const mailOptions = {
          from: "your-email@gmail.com",
          to: "alvisahab1999@gmail.com", // Replace with your email
          subject: "New Career Application",
          html: `
            <h3>New Career Application</h3>
            <p><strong>Position:</strong> ${appliedPosition}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Resume:</strong> <a href="${fileUrl}">Download</a></p>
          `,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: "Form submitted successfully!" });
      } catch (error) {
        console.error("Error handling form submission:", error);
        return res.status(500).json({ message: "An error occurred." });
      }
    });
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
