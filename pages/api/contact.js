// import dbConnect from '../utils/dbconnect';
// import Contact from '../models/Contact';

// export default async function handler(req, res) {
//   await dbConnect(); // Ensure the connection is established

//   if (req.method === 'POST') {
//     try {
//       const contactData = req.body; // Get the form data from the request body

//       // Create a new contact document with the form data
//       const contact = new Contact(contactData);
      
//       // Save the contact document to the database
//       await contact.save();

//       // Respond with a success message
//       res.status(200).json({ message: 'Form data saved successfully!' });
//     } catch (error) {
//       console.error('Error saving data:', error); // Log the error for debugging

//       // Respond with an error message
//       res.status(500).json({ error: 'Failed to save data' });
//     }
//   } else {
//     // Handle unsupported methods
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
