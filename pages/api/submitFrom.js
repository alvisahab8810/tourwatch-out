// pages/api/submitForm.js

export default async function handler(req, res) {
    if (req.method === "POST") {
      try {
        const formData = req.body;
  
        // Send the form data to Google Apps Script via a POST request
        const response = await fetch("https://script.google.com/macros/s/AKfycbwqFFa97buQmByxaEhwZRcyJnfKH28N7bIlZ7ujojGNo_1ULIxxnciqZUKkzwnhanzq/execs", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        const data = await response.json();
        
        if (response.ok) {
          res.status(200).json({ message: "Form submitted successfully!" });
        } else {
          res.status(400).json({ message: "Error submitting form" });
        }
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
      }
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  }
  