// pages/checkin/[id].js
// import connectDB from "../../utils/dbconnect";
import connectDB from '../../utils/mongodb';

import RoomLinks from "../../models/RoomLinks";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Hero from "../../components/checkin/Hero";

export default function CheckinPage({
  companyName: serverCompanyName,
  roomData: serverRoomData,
}) {
  const router = useRouter();
  const [companyName] = useState(serverCompanyName);
  const [roomData] = useState(serverRoomData || {});
  const [formData, setFormData] = useState({
    fullName: "",
    whatsappContact: "",
    emailAddress: "",
  });
  const [error, setError] = useState("");
  const [occupancyLimits] = useState({
    Single: 1,
    Double: 2,
    Triple: 3,
    Fourth: 4,
  });

  const [selectedOccupancy, setSelectedOccupancy] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [occupancyCounts, setOccupancyCounts] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOccupancyChange = async (e) => {
    const selected = e.target.value;
    setSelectedOccupancy(selected);

    const rawRooms = roomData[selected];
    if (!rawRooms) return;

    const allRooms = Array.isArray(rawRooms)
      ? rawRooms
      : String(rawRooms)
          .split(",")
          .map((room) => room.trim());

    const res = await fetch(
      `/api/roomOccupancyCounts?company=${encodeURIComponent(
        companyName
      )}&occupancy=${selected}`
    );
    const roomCounts = await res.json();

    const maxPerRoom = occupancyLimits[selected];
    setOccupancyCounts(roomCounts);

    const available = allRooms.filter((room) => {
      const currentCount = roomCounts[room] || 0;
      return currentCount < maxPerRoom;
    });

    setAvailableRooms(available);
    setSelectedRoom("");
  };

  const handleSubmitted = async (e) => {
    e.preventDefault();
    setError("");

    const { fullName, whatsappContact, emailAddress } = formData;
    const uploadedFile = e.target.uploadId.files[0];

    if (
      !fullName ||
      !whatsappContact ||
      !selectedOccupancy ||
      !selectedRoom ||
      !uploadedFile
    ) {
      alert("Please fill all fields and upload an ID.");
      return;
    }

    if (uploadedFile.size > 400 * 1024) {
      alert("File must be under 400KB.");
      return;
    }

    try {
      const checkResponse = await fetch("/api/checkMobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsappContact }),
      });

      if (!checkResponse.ok) {
        throw new Error("Failed to verify WhatsApp number.");
      }

      const checkData = await checkResponse.json();
      if (checkData.exists) {
        alert("This WhatsApp number is already registered!");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(uploadedFile);
      reader.onload = async () => {
        const governmentId = reader.result;

        const response = await fetch("/api/saveCheckin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companyName,
            fullName,
            whatsappContact,
            emailAddress,
            selectedOccupancy,
            selectedRoom,
            governmentId,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) throw new Error("Failed to save check-in.");

        alert("Check-in successful!");
        router.reload();
      };
    } catch (error) {
      console.error("Check-in error:", error);
      setError(error.message || "Something went wrong.");
    }
  };

  return (
    <div className="bg-prime check-corporate">
      <Hero />
      <section className="checkin-section">
        <div className="container ptb-50">
          <h1 className="check-heading">Seamless Check-In, Zero Delays</h1>
          <p className="check-para">
            Optimize your travel—check-in before arrival.
          </p>

          <div className="checkinbox">
            <div className="form-container">
              <div className="row">
                <div className="col-md-6">
                  <h2 className="guest-check mb-4">
                    Check-in for {companyName}
                  </h2>
                  <form onSubmit={handleSubmitted}>
                    {/* Company Name (Read-Only) */}
                    <div className="mb-3">
                      <label className="form-label">Company Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={companyName}
                        readOnly
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="col-md-6 mb-3 position-relative">
                        <label className="form-label">WhatsApp Contact</label>
                        <span className="country-num">+91 </span>

                        <input
                          type="text"
                          name="whatsappContact"
                          value={formData.whatsappContact}
                          onChange={handleChange}
                          maxLength={10}
                          className="form-control ps-5"
                          required
                        />
                        {error && (
                          <small className="text-danger">{error}</small>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Upload Government ID (Max 400KB)
                      </label>
                      <input
                        type="file"
                        name="uploadId"
                        className="form-control"
                        accept="image/*,application/pdf"
                        id="uploadId"
                        required
                      />
                      <small className="form-text">
                        * This document will be used only for check-in purposes.
                      </small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Select Occupancy</label>
                      <select
                        className="form-select"
                        value={selectedOccupancy}
                        onChange={handleOccupancyChange}
                        required
                      >
                        <option value="">Select Occupancy</option>
                        {Object.keys(roomData).map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedOccupancy && (
                      <div className="mb-3">
                        <label className="form-label">Select Room</label>
                        <select
                          className="form-select"
                          value={selectedRoom}
                          onChange={(e) => setSelectedRoom(e.target.value)}
                          required
                        >
                          <option value="">Select Room</option>
                          {availableRooms.map((room) => (
                            <option key={room} value={room}>
                              {room}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <button type="submit" className="btn btn-primary w-100">
                      Check In
                    </button>
                  </form>
                </div>
                <div className="col-md-6 form_imgs mobile-none">
                  <div className="img__bx">
                    <img src="/assets/images/check.webp" alt="img"></img>
                  </div>
                  <div className="overlay-logo-bx">
                    <img src="/assets/images/logo.png" alt="Logo"></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Server-side: fetch room and company data
export async function getServerSideProps(context) {
  const { id } = context.params;
  await connectDB();
  const data = await RoomLinks.findOne({ shortId: id }).lean();

  if (!data) {
    return { notFound: true };
  }

  return {
    props: {
      roomData: data.rooms || {},
      companyName: data.companyName || "",
    },
  };
}
