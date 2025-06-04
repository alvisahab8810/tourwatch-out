import connectDB from '../../utils/mongodb';
import RoomLinks from '../../models/RoomLinks';
import { nanoid } from 'nanoid';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { companyName, rooms } = req.body;

  await connectDB();

  const shortId = nanoid(6); // Generates a 6-character unique ID

  const newLink = new RoomLinks({ companyName, rooms, shortId });
  await newLink.save();

  res.status(200).json({ link: `/checkin/${shortId}` });
}
