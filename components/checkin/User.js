import React, { useState } from "react";

const RoomGuestSelector = () => {
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(1);
  
  const handleRoomChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setRooms(value);
  };

  const handleGuestChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setGuests(value);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md w-64">
      <h2 className="text-lg font-semibold mb-2">Select Rooms & Guests</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium">Rooms:</label>
        <input
          type="number"
          min="1"
          max="10"
          value={rooms}
          onChange={handleRoomChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Guests:</label>
        <input
          type="number"
          min="1"
          max={rooms * 4} // Assuming a max of 4 guests per room
          value={guests}
          onChange={handleGuestChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium">Selected: {rooms} Room(s), {guests} Guest(s)</p>
      </div>
    </div>
  );
};

export default RoomGuestSelector;
