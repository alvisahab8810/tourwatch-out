// import React from "react";

// export default function CheckIn() {
//   return (
//     <>
//       <section className="checkin-section">
//         <div className="container ptb-50">
//           <h1 className="check-heading">Seamless Check-In, Zero Delays</h1>
//           <p className="check-para"> Optimize your travel—check-in before arrival.</p>

//           <div className="checkinbox">
//             <div className="form-container">
//               <form>
//                 <div className="mb-3">
//                   <label for="companyName" className="form-label">
//                     Company Name
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control form-control1"
//                     id="companyName"
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label for="fullName" className="form-label">
//                     Full Name
//                   </label>
//                   <input type="text" className="form-control" id="fullName" />
//                 </div>
//                 <div className="mb-3">
//                   <label for="whatsappContact" className="form-label">
//                     WhatsApp Contact
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="whatsappContact"
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label for="emailAddress" className="form-label">
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     id="emailAddress"
//                   />
//                 </div>
                
//                 <div className="row mb-3">
//                   <div className="col">
//                     <label for="occupancy" className="form-label">
//                       Occupancy
//                     </label>
//                     <select className="form-select" id="occupancy">
//                       <option selected>Select room</option>
//                       <option value="1">Single</option>
//                       <option value="2">Double</option>
//                       <option value="3">Suite</option>
//                     </select>
//                   </div>
//                   <div className="col">
//                     <label for="selectRoom" className="form-label">
//                       Select Room
//                     </label>
//                     <select className="form-select" id="selectRoom">
//                       <option selected>Select room</option>
//                       <option value="1">Room 101</option>
//                       <option value="2">Room 102</option>
//                       <option value="3">Room 103</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="mb-3">
//                   <label for="uploadId" className="form-label">
//                     Please upload any Government ID, size less than 100KB
//                   </label>
//                   <input className="form-control" type="file" id="uploadId" />
//                   <div className="form-text">
//                     *This Doc. will be used for check-in purpose only
//                   </div>
//                 </div>
//                 <button type="submit" className="btn btn-submit w-100">
//                   Submit
//                 </button>
//               </form>
//             </div>
//           </div>
//           <div className="checkin-footer">
//              <p>Let’s Stay in Touch! </p>
//              <ul className="social-list-icons">
//                 <li><a href="#"><img src="./assets/images/icons/whatsapp.png" alt="Whatsapp Icon"></img></a></li>
//                 <li><a href="#"><img src="./assets/images/icons/facebook.png" alt="Facebook Icon"></img></a></li>
//                 <li><a href="#"><img src="./assets/images/icons/insta.png" alt="Instagram Icon"></img></a></li>
//                 <li><a href="#"><img src="./assets/images/icons/web.png" alt="Web Icon"></img></a></li>
//                 <li><a href="#"><img src="./assets/images/icons/x.png" alt="X Icon"></img></a></li>
//              </ul>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }




  "use client";
  import { useState, useEffect } from "react";
  import { useRouter } from "next/router";
  export default function CheckIn() {
    const router = useRouter();
    const [companyName, setCompanyName] = useState("");
    const [roomData, setRoomData] = useState({
      Single: "",
      Double: "",
      Triple: "",
      Fourth: "",
    });
    const [generatedLink, setGeneratedLink] = useState("");
    const [duplicateRooms, setDuplicateRooms] = useState([]);

    // Guest Selection  
    const [selectedOccupancy, setSelectedOccupancy] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [availableOccupancies, setAvailableOccupancies] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);

    // const isAdmin = !router.query.company; // Admin view if no company query

    const [isAdmin, setIsAdmin] = useState(true);


    useEffect(() => {
      if (!router.isReady) return;
    
      console.log("Router Query Params (Live):", router.query);
    
      const { company, ...queryRooms } = router.query;
    
      if (company) {
        setCompanyName(company);
        setIsAdmin(false); // Show Guest Form
      } else {
        setIsAdmin(true); // Show Admin Form
      }
    
      const occupancyData = {};
      Object.entries(queryRooms).forEach(([occupancy, rooms]) => {
        if (typeof rooms === "string") {
          occupancyData[occupancy] = decodeURIComponent(rooms);
        }
      });
    
      setRoomData(occupancyData);
      setAvailableOccupancies(Object.keys(occupancyData));
    }, [router.isReady, router.query]);
    


    useEffect(() => {
      if (router.isReady) {
        const { company, ...queryRooms } = router.query;
        if (company) setCompanyName(company);

        const params = new URLSearchParams(window.location.search);
        console.log("Window Location Params:", Object.fromEntries(params.entries()));

        const occupancyData = {};
        Object.entries(queryRooms).forEach(([occupancy, rooms]) => {
          occupancyData[occupancy] = decodeURIComponent(rooms);
        });

        

        setRoomData(occupancyData);
        setAvailableOccupancies(Object.keys(occupancyData));
      }
    }, [router.isReady, router.query]);

    // Handle room input change (Admin)
    const handleRoomInputChange = (occupancy, value) => {
      setRoomData((prev) => ({
        ...prev,
        [occupancy]: value,
      }));
    };

    // Handle form submission (Admin: Generate link)
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!companyName) return alert("Please enter a company name.");

      const allEnteredRooms = new Set();
      const duplicateRoomsFound = new Set();

      const roomParams = Object.entries(roomData)
        .filter(([_, rooms]) => rooms.trim() !== "")
        .map(([occupancy, rooms]) => {
          const roomArray = rooms.split(",").map((room) => room.trim());

          roomArray.forEach((room) => {
            if (allEnteredRooms.has(room)) {
              duplicateRoomsFound.add(room);
            }
            allEnteredRooms.add(room);
          });

          return `${occupancy}=${encodeURIComponent(rooms)}`;
        })
        .join("&");

      if (duplicateRoomsFound.size > 0) {
        setDuplicateRooms([...duplicateRoomsFound]);
        return alert(`Duplicate room numbers found: ${[...duplicateRoomsFound].join(", ")}`);
      }

      setDuplicateRooms([]);
      const shareableLink = `/checkin-corporate?company=${encodeURIComponent(companyName)}&${roomParams}`;

      setGeneratedLink(shareableLink);
    };

    // Copy link to clipboard
    const handleCopyLink = () => {
      navigator.clipboard.writeText(generatedLink);
      alert("Link copied to clipboard!");
    };

    // Handle occupancy selection (Guest)
    const handleOccupancyChange = (e) => {
      const selected = e.target.value;
      setSelectedOccupancy(selected);
      setAvailableRooms(roomData[selected]?.split(",") || []);
      setSelectedRoom(""); // Reset selected room when occupancy changes
    };


    const [submittedData, setSubmittedData] = useState(null);



    // const handleSubmitted = async (e) => {
    //   e.preventDefault();
    //   const fullName = e.target.fullName.value.trim();
    //   const whatsappContact = e.target.whatsappContact.value.trim();
    //   const emailAddress = e.target.emailAddress.value.trim();
    //   const uploadedFile = e.target.uploadId.files[0];
    
    //   if (!fullName || !whatsappContact || !emailAddress || !selectedOccupancy || !selectedRoom || !uploadedFile) {
    //     alert("Please fill all fields and upload an ID.");
    //     return;
    //   }
    
    //   if (uploadedFile.size > 100 * 1024) {
    //     alert("File must be under 100KB.");
    //     return;
    //   }
    
    //   const reader = new FileReader();
    //   reader.readAsDataURL(uploadedFile);
    //   reader.onload = async () => {
    //     const governmentId = reader.result;
    
    //     const response = await fetch("/api/saveCheckin", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         companyName,
    //         fullName,
    //         whatsappContact,
    //         emailAddress,
    //         selectedOccupancy,
    //         selectedRoom,
    //         governmentId,
    //         timestamp: new Date().toLocaleString(),
    //       }),
    //     });
    
    //     if (response.ok) {
    //       alert("Check-in successful!");
    //       e.target.reset();
    //       setSelectedOccupancy("");
    //       setSelectedRoom("");
    //     } else {
    //       alert("Error saving check-in.");
    //     }
    //   };
    // };
  



    const [error, setError] = useState(""); // State to track errors
    const [formData, setFormData] = useState({
      fullName: "",
      whatsappContact: "",
      emailAddress: "",
    });

    
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };
    
const handleSubmitted = async (e) => {
  e.preventDefault();
  setError(""); // Reset error on new submission

  const fullName = e.target.fullName.value.trim();
  const whatsappContact = e.target.whatsappContact.value.trim();
  const emailAddress = e.target.emailAddress.value.trim();
  const uploadedFile = e.target.uploadId.files[0];

  if (!fullName || !whatsappContact || !emailAddress || !selectedOccupancy || !selectedRoom || !uploadedFile) {
    setError("Please fill all fields and upload an ID.");
    return;
  }

  if (uploadedFile.size > 100 * 1024) {
    setError("File must be under 100KB.");
    return;
  }

  try {
    // Check if the WhatsApp number already exists
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
      setError("This WhatsApp number is already registered!");
      return;
    }

    // Process file upload and save check-in
    const reader = new FileReader();
    reader.readAsDataURL(uploadedFile);
    reader.onload = async () => {
      const governmentId = reader.result;

      const response = await fetch("/api/saveCheckin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName, // Ensure companyName is available in your component
          fullName,
          whatsappContact,
          emailAddress,
          selectedOccupancy,
          selectedRoom,
          governmentId,
          timestamp: new Date().toISOString(),

        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save check-in.");
      }

      alert("Check-in successful!");
      e.target.reset();
      setSelectedOccupancy("");
      setSelectedRoom("");
      setError(""); // Clear any previous errors
    };
  } catch (error) {
    console.error("Error during check-in:", error);
    setError(error.message || "Something went wrong. Please try again.");
  }
};


  return (
    <section className="checkin-section">
      <div className="container ptb-50">
        <h1 className="check-heading">Seamless Check-In, Zero Delays</h1>
        <p className="check-para">Optimize your travel—check-in before arrival.</p>

        <div className="checkinbox">
          <div className="form-container">
            {/* Admin Form */}
            {isAdmin ? (
              <form onSubmit={handleSubmit}>
                {/* Company Name */}
                <div className="mb-3">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-control form-control1"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                {/* Room Entry for Each Occupancy Type */}
                {["Single", "Double", "Triple", "Fourth"].map((occupancy) => (
                  <div key={occupancy} className="mb-3">
                    <label className="form-label">{occupancy} Occupancy Room Numbers</label>
                    <input
                      type="text"
                      className="form-control"
                      value={roomData[occupancy] || ""}
                      onChange={(e) => handleRoomInputChange(occupancy, e.target.value)}
                      placeholder="Enter room numbers (comma-separated)"
                    />
                  </div>
                ))}

                {/* Submit Button */}
                <button type="submit" className="btn btn-submit w-100">
                  Generate Link
                </button>

                {/* Display Generated Link */}
                {generatedLink && (
                  <div className="mt-3 d-flex">
                    <input type="text" className="form-control" value={generatedLink} readOnly />
                    <button type="button" className="btn btn-secondary ms-2" onClick={handleCopyLink}>
                      Copy
                    </button>
                  </div>
                )}

                {/* Show duplicate room numbers */}
                {duplicateRooms.length > 0 && (
                  <div className="alert alert-danger mt-2">
                    Duplicate rooms found: {duplicateRooms.join(", ")}
                  </div>
                )}
              </form>
            ) : (
              /* User Check-In Form */
              <form  onSubmit={handleSubmitted}>
                <h2 className="text-center mb-4">Guest Check-In</h2>

                {/* Company Name (Read-Only) */}
                <div className="mb-3">
                  <label className="form-label">Company Name</label>
                  <input type="text" className="form-control" value={companyName} readOnly />
                </div>

                {/* Full Name */}
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">
                    Full Name
                  </label>
                  <input type="text" className="form-control" id="fullName" />
                </div>

                {/* WhatsApp Contact */}
                {/* <div className="mb-3">
                  <label htmlFor="whatsappContact" className="form-label">
                    WhatsApp Contact
                  </label>
                  <input type="text" className="form-control" id="whatsappContact" />
                </div> */}

                  <div className="mb-3">
                    <label htmlFor="whatsappContact" className="form-label">
                      WhatsApp Contact
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="whatsappContact"
                      name="whatsappContact"
                      placeholder="Enter WhatsApp Number"
                      value={formData.whatsappContact}
                      onChange={handleChange}
                      required
                    />
                    {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
                  </div>

                {/* Email Address */}
                <div className="mb-3">
                  <label htmlFor="emailAddress" className="form-label">
                    Email Address
                  </label>
                  <input type="email" className="form-control" id="emailAddress" />
                </div>

                {/* Government ID Upload */}
                <div className="mb-3">
                  <label htmlFor="uploadId" className="form-label">
                    Please upload any Government ID, size less than 100KB
                  </label>
                  <input className="form-control" type="file" id="uploadId" />
                  <div className="form-text">
                    *This Doc. will be used for check-in purpose only
                  </div>
                </div>

                {/* Occupancy Selection */}
                <div className="mb-3">
                  <label className="form-label">Select Occupancy</label>
                  <select className="form-select" value={selectedOccupancy} onChange={handleOccupancyChange}>
                    <option value="">Select Occupancy</option>
                    {availableOccupancies.map((occupancy) => (
                      <option key={occupancy} value={occupancy}>
                        {occupancy}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Room Selection */}
                {selectedOccupancy && (
                  <div className="mb-3">
                    <label className="form-label">Select Room</label>
                    <select className="form-select" value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                      <option value="">Select Room</option>
                      {availableRooms.map((room) => (
                        <option key={room} value={room}>
                          {room}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Check-In Button */}
                <button type="submit" className="btn btn-submit w-100">
                  Check-In
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}



export async function getServerSideProps(context) {
  console.log("Server Side Query Params:", context.query);
  return { props: {} };
}
