

// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import Link from "next/link";
// export default function CheckIn() {
//   // Declare states first
//   const router = useRouter();

//   // State declarations
//   const [companyName, setCompanyName] = useState("");

//   const [formData, setFormData] = useState({
//     fullName: "",
//     whatsappContact: "",
//     emailAddress: "",
//   });
//   const [error, setError] = useState("");
//   const [occupancy, setOccupancy] = useState("");
//   const [rooms, setRooms] = useState([]);
//   const occupancyLimits = {
//     Single: 1,
//     Double: 2,
//     Triple: 3,
//     Fourth: 4,
//   };
//   const [occupancyData, setOccupancyData] = useState({});
//   const [occupancyCount, setOccupancyCount] = useState({
//     Single: 0,
//     Double: 0,
//     Triple: 0,
//     Fourth: 0,
//   });
//   const [roomData, setRoomData] = useState({
//     Single: "",
//     Double: "",
//     Triple: "",
//     Fourth: "",
//   });
//   const [generatedLink, setGeneratedLink] = useState("");
//   const [duplicateRooms, setDuplicateRooms] = useState([]);

//   // Guest Selection
//   const [selectedOccupancy, setSelectedOccupancy] = useState("");
//   const [selectedRoom, setSelectedRoom] = useState("");
//   const [availableOccupancies, setAvailableOccupancies] = useState([]);
//   const [availableRooms, setAvailableRooms] = useState([]);

//   // Admin vs Guest view flag
//   const [isAdmin, setIsAdmin] = useState(true);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };
  

//   // ----------------------------
//   // useEffect to fetch live occupancy counts using companyName
//   useEffect(() => {
//     if (companyName) {
//       fetch(`/api/occupancyCounts?company=${encodeURIComponent(companyName)}`)
//         .then((res) => res.json())
//         .then((data) => {
//           setOccupancyCount(data);
//         })
//         .catch(() => alert("Error fetching occupancy counts"));
//     }
//   }, [companyName]);

//   // useEffect to process router query parameters
//   useEffect(() => {
//     if (!router.isReady) return;

//     console.log("Router Query Params (Live):", router.query);
//     const { company, ...queryRooms } = router.query;

//     if (company) {
//       setCompanyName(company);
//       setIsAdmin(false); // Show Guest Form
//     } else {
//       setIsAdmin(true); // Show Admin Form
//     }

//     const occupancyData = {};
//     Object.entries(queryRooms).forEach(([occ, rooms]) => {
//       if (typeof rooms === "string") {
//         occupancyData[occ] = decodeURIComponent(rooms);
//       }
//     });
//     setRoomData(occupancyData);
//     setAvailableOccupancies(Object.keys(occupancyData));
//   }, [router.isReady, router.query]);

//   // Duplicate useEffect (if needed, or you can combine with the above)
//   useEffect(() => {
//     if (router.isReady) {
//       const { company, ...queryRooms } = router.query;
//       if (company) setCompanyName(company);

//       const params = new URLSearchParams(window.location.search);
//       console.log(
//         "Window Location Params:",
//         Object.fromEntries(params.entries())
//       );

//       const occupancyData = {};
//       Object.entries(queryRooms).forEach(([occ, rooms]) => {
//         occupancyData[occ] = decodeURIComponent(rooms);
//       });

//       setRoomData(occupancyData);
//       setAvailableOccupancies(Object.keys(occupancyData));
//     }
//   }, [router.isReady, router.query]);

//   // ----------------------------
//   // Handler for admin to input room numbers
//   const handleRoomInputChange = (occ, value) => {
//     // Split input by commas and handle ranges
//     const entries = value.split(",").map((entry) => entry.trim());
//     const expandedRooms = [];
//     entries.forEach((entry) => {
//       if (entry.includes("-")) {
//         const [start, end] = entry.split("-").map((num) => parseInt(num, 10));
//         if (!isNaN(start) && !isNaN(end) && start <= end) {
//           for (let i = start; i <= end; i++) {
//             expandedRooms.push(i.toString());
//           }
//         } else {
//           expandedRooms.push(entry);
//         }
//       } else {
//         expandedRooms.push(entry);
//       }
//     });

//     setRoomData((prev) => ({
//       ...prev,
//       [occ]: expandedRooms.join(", "),
//     }));
//   };

//   // Handler for generating the link (Admin Form)
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!companyName) return alert("Please enter a company name.");

//     const allEnteredRooms = new Set();
//     const duplicateRoomsFound = new Set();

//     const roomParams = Object.entries(roomData)
//       .filter(([_, rooms]) => rooms.trim() !== "")
//       .map(([occ, rooms]) => {
//         const roomArray = rooms.split(",").map((room) => room.trim());
//         roomArray.forEach((room) => {
//           if (allEnteredRooms.has(room)) {
//             duplicateRoomsFound.add(room);
//           }
//           allEnteredRooms.add(room);
//         });
//         return `${occ}=${encodeURIComponent(rooms)}`;
//       })
//       .join("&");

//     if (duplicateRoomsFound.size > 0) {
//       setDuplicateRooms([...duplicateRoomsFound]);
//       return alert(
//         `Duplicate room numbers found: ${[...duplicateRoomsFound].join(", ")}`
//       );
//     }

//     setDuplicateRooms([]);
//     const shareableLink = `https://tourwatchout.com/checkin-corporate?company=${encodeURIComponent(
//       companyName
//     )}&${roomParams}`;

//     setGeneratedLink(shareableLink);
//   };

//   // Copy link handler
//   const handleCopyLink = () => {
//     navigator.clipboard.writeText(generatedLink);
//     alert("Link copied to clipboard!");
//   };

//   // ----------------------------
//   // Handler for occupancy change (User Form)
//   const handleOccupancyChange = async (e) => {
//     const selected = e.target.value;

//     if (occupancyCount[selected] >= occupancyLimits[selected]) {
//       alert(`${selected} occupancy is fully booked.`);
//       return;
//     }

//     // Update the occupancy count in the DB
//     const response = await fetch("/api/occupancy", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ occupancyType: selected }),
//     });

//     if (response.ok) {
//       // Re-fetch live counts after update
//       const res = await fetch(
//         `/api/occupancyCounts?company=${encodeURIComponent(companyName)}`
//       );
//       const data = await res.json();
//       setOccupancyCount(data);
//     } else {
//       alert("Error updating occupancy data.");
//       return;
//     }

//     setSelectedOccupancy(selected);
//     setAvailableRooms(roomData[selected]?.split(",") || []);
//     setSelectedRoom("");
//   };

//   // ----------------------------
//   // Handler for check-in submission (User Form)
//   const handleSubmitted = async (e) => {
//     e.preventDefault();
//     setError("");

//     const fullName = e.target.fullName.value.trim();
//     const whatsappContact = e.target.whatsappContact.value.trim();
//     const emailAddress = e.target.emailAddress.value.trim();
//     const uploadedFile = e.target.uploadId.files[0];

//     if (
//       !fullName ||
//       !whatsappContact ||
//       !emailAddress ||
//       !selectedOccupancy ||
//       !selectedRoom ||
//       !uploadedFile
//     ) {
//       setError("Please fill all fields and upload an ID.");
//       return;
//     }

//     if (uploadedFile.size > 400 * 1024) {
//       setError("File must be under 400KB.");
//       return;
//     }

//     try {
//       const checkResponse = await fetch("/api/checkMobile", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ whatsappContact }),
//       });

//       if (!checkResponse.ok) {
//         throw new Error("Failed to verify WhatsApp number.");
//       }

//       const checkData = await checkResponse.json();

//       if (checkData.exists) {
//         setError("This WhatsApp number is already registered!");
//         return;
//       }

//       const reader = new FileReader();
//       reader.readAsDataURL(uploadedFile);
//       reader.onload = async () => {
//         const governmentId = reader.result;

//         const response = await fetch("/api/saveCheckin", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             companyName,
//             fullName,
//             whatsappContact,
//             emailAddress,
//             selectedOccupancy,
//             selectedRoom,
//             governmentId,
//             timestamp: new Date().toISOString(),
//           }),
//         });

//         if (!response.ok) {
//           throw new Error("Failed to save check-in.");
//         }

//         alert("Check-in successful!");
//         router.reload();
//         e.target.reset();
//         setSelectedOccupancy("");
//         setSelectedRoom("");
//         setError("");
//       };
//     } catch (error) {
//       console.error("Error during check-in:", error);
//       setError(error.message || "Something went wrong. Please try again.");
//     }
//   };

//   // ----------------------------
//   return (
//     <section className="checkin-section">
//       <div className="container ptb-50">
//         <h1 className="check-heading">Seamless Check-In, Zero Delays</h1>
//         <p className="check-para">
//           Optimize your travel—check-in before arrival.
//         </p>

//         <div className="checkinbox">
//           <div className="form-container">
//             <div className="row">
              
//               <div className="col-md-6">
//                 {/* Admin Form */}
//                 {isAdmin ? (
//                   <form onSubmit={handleSubmit}>
//                     {/* Company Name */}
//                     <div className="mb-3">
//                       <label className="form-label">Company Name</label>
//                       <input
//                         type="text"
//                         className="form-control form-control1"
//                         value={companyName}
//                         onChange={(e) => setCompanyName(e.target.value)}
//                       />
//                     </div>

//                     {/* Room Entry for Each Occupancy Type */}
//                     {["Single", "Double", "Triple", "Fourth"].map((occ) => (
//                       <div key={occ} className="mb-3">
//                         <label className="form-label">
//                           {occ} Occupancy Room Numbers
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={roomData[occ] || ""}
//                           onChange={(e) =>
//                             handleRoomInputChange(occ, e.target.value)
//                           }
//                           placeholder="Enter room numbers (comma-separated)"
//                         />
//                       </div>
//                     ))}

//                     {/* Submit Button */}
//                     <button type="submit" className="btn btn-submit w-100">
//                       Generate Link
//                     </button>

//                     {/* Display Generated Link */}
//                     {generatedLink && (
//                       <div className="mt-3 d-flex">
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={generatedLink}
//                           readOnly
//                         />
//                         <button
//                           type="button"
//                           className="btn btn-secondary ms-2"
//                           onClick={handleCopyLink}
//                         >
//                           Copy
//                         </button>
//                       </div>
//                     )}

//                     {/* Show duplicate room numbers */}
//                     {duplicateRooms.length > 0 && (
//                       <div className="alert alert-danger mt-2">
//                         Duplicate rooms found: {duplicateRooms.join(", ")}
//                       </div>
//                     )}
//                   </form>
//                 ) : (
//                   /* User Check-In Form */

//                   <form onSubmit={handleSubmitted}>
//                     <h2 className="guest-check mb-4">Guest Check-In</h2>

//                     {/* Company Name (Read-Only) */}
//                     <div className="mb-3">
//                       <label className="form-label">Company Name</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={companyName}
//                         readOnly
//                       />
//                     </div>

                   


//                   <div className="row">
//                     <div className="col-md-6 mb-3">
//                       <label htmlFor="fullName" className="form-label">
//                         Full Name
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="fullName"
//                         required
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3 p-relative">
//                       <label htmlFor="whatsappContact" className="form-label">
//                         WhatsApp Contact
//                       </label>
//                       <span className="country-num">+91 </span>
//                       <input
//                         type="text"
//                         className="form-control pl-20"
//                         id="whatsappContact"
//                         name="whatsappContact"
//                         // placeholder="+91:"
//                         value={formData.whatsappContact}
//                         onChange={handleChange}
//                         maxLength={10}
//                         required
//                       />
//                       {error && (
//                         <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
//                       )}
//                     </div>
//                   </div>


//                     {/* Email Address */}
//                     <div className="mb-3">
//                       <label htmlFor="emailAddress" className="form-label">
//                         Email Address
//                       </label>
//                       <input
//                         type="email"
//                         className="form-control"
//                         id="emailAddress"
//                         required
//                       />
//                     </div>

//                     {/* Government ID Upload */}
//                     <div className="mb-3">
//                       <label htmlFor="uploadId" className="form-label">
//                         Please upload any Government ID, size less than 400KB
//                       </label>
//                       <input
//                         className="form-control"
//                         type="file"
//                         id="uploadId"
//                         required
//                       />
//                       <div className="form-text">
//                         *This Doc. will be used for check-in purpose only
//                       </div>
//                     </div>

//                     {/* Occupancy Selection */}
//                     <div className="mb-3">
//                       <label className="form-label">Select Occupancy</label>
//                       <select
//                         value={occupancy}
//                         onChange={handleOccupancyChange}
//                       >
//                         <option value="">Select Occupancy</option>
//                         {["Single", "Double", "Triple", "Fourth"].map(
//                           (type) => (
//                             <option
//                               key={type}
//                               value={type}
//                               disabled={
//                                 occupancyCount[type] >= occupancyLimits[type]
//                               }
//                             >
//                               {type}{" "}
//                               {occupancyCount[type] >= occupancyLimits[type]
//                                 ? "(Full)"
//                                 : ""}
//                             </option>
//                           )
//                         )}
//                       </select>
//                     </div>

//                     {selectedOccupancy && (
//                       <p>Selected Occupancy: {selectedOccupancy}</p>
//                     )}

//                     {/* Room Selection */}
//                     {selectedOccupancy && (
//                       <div className="mb-3">
//                         <label className="form-label">Select Room</label>
//                         <select
//                           className="form-select"
//                           value={selectedRoom}
//                           onChange={(e) => setSelectedRoom(e.target.value)}
//                         >
//                           <option value="">Select Room</option>
//                           {availableRooms.map((room) => (
//                             <option key={room} value={room}>
//                               {room}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     )}

//                     {/* Check-In Button */}
//                     <button type="submit" className="btn btn-submit w-100">
//                       Check-In
//                     </button>
//                   </form>
//                 )}
//               </div>

//               <div className="col-md-6 form_imgs mobile-none">
//                 <div className="img__bx">
//                   <img src="/assets/images/check.webp" alt="img"></img>
//                 </div>
//                 <div className="overlay-logo-bx">
//                   <img src="/assets/images/logo.png" alt="Logo"></img>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="checkin-footer">
//           <p>Let’s Stay in Touch!</p>
//           <ul className="social-list-icons">
            
//             <li>
//               <Link href="https://www.facebook.com/TourWatchout/"  target="_blank">
//                 <img
//                   src="./assets/images/icons/facebook.png"
//                   alt="Facebook Icon"
//                 />
//               </Link>
//             </li>
//             <li>
//               <Link href="https://www.instagram.com/tourwatchout/" target="_blank">
//                 <img
//                   src="./assets/images/icons/insta.png"
//                   alt="Instagram Icon"
//                 />
//               </Link>
//             </li>
//             <li>
//               <Link href="https://tourwatchout.com/" target="_blank">
//                 <img src="./assets/images/icons/web.png" alt="Web Icon" />
//               </Link>
//             </li>
//             <li>
//               <Link href="https://www.youtube.com/@Tourwatchout" target="_blank">
//                 <img src="./assets/images/icons/youtube.png" alt="Youtube Icon" />
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </section>
//   );
// }

// export async function getServerSideProps(context) {
//   console.log("Server Side Query Params:", context.query);
//   return { props: {} };
// }












"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
export default function CheckIn() {
  // Declare states first
  const router = useRouter();

  // State declarations
  const [companyName, setCompanyName] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    whatsappContact: "",
    emailAddress: "",
  });
  const [error, setError] = useState("");
  const [occupancy, setOccupancy] = useState("");
  const [rooms, setRooms] = useState([]);
  const occupancyLimits = {
    Single: 1,
    Double: 2,
    Triple: 3,
    Fourth: 4,
  };
  const [occupancyData, setOccupancyData] = useState({});
  const [occupancyCount, setOccupancyCount] = useState({
    Single: 0,
    Double: 0,
    Triple: 0,
    Fourth: 0,
  });
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

  // Admin vs Guest view flag
  const [isAdmin, setIsAdmin] = useState(true);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  


  // useEffect to process router query parameters
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
    Object.entries(queryRooms).forEach(([occ, rooms]) => {
      if (typeof rooms === "string") {
        occupancyData[occ] = decodeURIComponent(rooms);
      }
    });
    setRoomData(occupancyData);
    setAvailableOccupancies(Object.keys(occupancyData));
  }, [router.isReady, router.query]);

  // Duplicate useEffect (if needed, or you can combine with the above)
  useEffect(() => {
    if (router.isReady) {
      const { company, ...queryRooms } = router.query;
      if (company) setCompanyName(company);

      const params = new URLSearchParams(window.location.search);
      console.log(
        "Window Location Params:",
        Object.fromEntries(params.entries())
      );

      const occupancyData = {};
      Object.entries(queryRooms).forEach(([occ, rooms]) => {
        occupancyData[occ] = decodeURIComponent(rooms);
      });

      setRoomData(occupancyData);
      setAvailableOccupancies(Object.keys(occupancyData));
    }
  }, [router.isReady, router.query]);

  // ----------------------------
  // Handler for admin to input room numbers
  const handleRoomInputChange = (occ, value) => {
    // Split input by commas and handle ranges
    const entries = value.split(",").map((entry) => entry.trim());
    const expandedRooms = [];
    entries.forEach((entry) => {
      if (entry.includes("-")) {
        const [start, end] = entry.split("-").map((num) => parseInt(num, 10));
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            expandedRooms.push(i.toString());
          }
        } else {
          expandedRooms.push(entry);
        }
      } else {
        expandedRooms.push(entry);
      }
    });

    setRoomData((prev) => ({
      ...prev,
      [occ]: expandedRooms.join(", "),
    }));
  };

  // Handler for generating the link (Admin Form)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyName) return alert("Please enter a company name.");

    const allEnteredRooms = new Set();
    const duplicateRoomsFound = new Set();

    const roomParams = Object.entries(roomData)
      .filter(([_, rooms]) => rooms.trim() !== "")
      .map(([occ, rooms]) => {
        const roomArray = rooms.split(",").map((room) => room.trim());
        roomArray.forEach((room) => {
          if (allEnteredRooms.has(room)) {
            duplicateRoomsFound.add(room);
          }
          allEnteredRooms.add(room);
        });
        return `${occ}=${encodeURIComponent(rooms)}`;
      })
      .join("&");

    if (duplicateRoomsFound.size > 0) {
      setDuplicateRooms([...duplicateRoomsFound]);
      return alert(
        `Duplicate room numbers found: ${[...duplicateRoomsFound].join(", ")}`
      );
    }

    setDuplicateRooms([]);
    const shareableLink = `https://tourwatchout.com/checkin-corporate?company=${encodeURIComponent(
      companyName
    )}&${roomParams}`;

    setGeneratedLink(shareableLink);
  };

  // Copy link handler
  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    alert("Link copied to clipboard!");
  };

  // ----------------------------
  // Handler for occupancy change (User Form)
  
  const handleOccupancyChange = async (e) => {
    const selected = e.target.value;
  
    if (!roomData[selected]) return;
  
    // Split all rooms and trim
    const allRooms = roomData[selected].split(",").map((room) => room.trim());
  
    // Fetch current room counts
    const res = await fetch(`/api/roomOccupancyCounts?company=${encodeURIComponent(companyName)}&occupancy=${selected}`);
    const roomCounts = await res.json(); // { "101": 2, "102": 1, ... }
  
    // Get limit for the selected occupancy type
    const maxPerRoom = occupancyLimits[selected];
  
    // Filter rooms that have not reached their limit
    const available = allRooms.filter((room) => {
      const currentCount = roomCounts[room] || 0;
      return currentCount < maxPerRoom;
    });
  
    setSelectedOccupancy(selected);
    setAvailableRooms(available);
    setSelectedRoom("");
  };
  
  // ----------------------------
  // Handler for check-in submission (User Form)
  const handleSubmitted = async (e) => {
    e.preventDefault();
    setError("");

    const fullName = e.target.fullName.value.trim();
    const whatsappContact = e.target.whatsappContact.value.trim();
    const emailAddress = e.target.emailAddress.value.trim();
    const uploadedFile = e.target.uploadId.files[0];

    if (
      !fullName ||
      !whatsappContact ||
      // !emailAddress ||
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

        if (!response.ok) {
          throw new Error("Failed to save check-in.");
        }

        alert("Check-in successful!");
        router.reload();
        e.target.reset();
        setSelectedOccupancy("");
        setSelectedRoom("");
        setError("");
      };
    } catch (error) {
      console.error("Error during check-in:", error);
      setError(error.message || "Something went wrong. Please try again.");
    }
  };

  // ----------------------------
  return (
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
                    {["Single", "Double", "Triple", "Fourth"].map((occ) => (
                      <div key={occ} className="mb-3">
                        <label className="form-label">
                          {occ} Occupancy Room Numbers
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={roomData[occ] || ""}
                          onChange={(e) =>
                            handleRoomInputChange(occ, e.target.value)
                          }
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
                        <input
                          type="text"
                          className="form-control"
                          value={generatedLink}
                          readOnly
                        />
                        <button
                          type="button"
                          className="btn btn-secondary ms-2"
                          onClick={handleCopyLink}
                        >
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

                  <form onSubmit={handleSubmitted}>
                    <h2 className="guest-check mb-4">Guest Check-In</h2>

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
                      <label htmlFor="fullName" className="form-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3 p-relative">
                      <label htmlFor="whatsappContact" className="form-label">
                        WhatsApp Contact
                      </label>
                      <span className="country-num">+91 </span>
                      <input
                        type="text"
                        className="form-control pl-20"
                        id="whatsappContact"
                        name="whatsappContact"
                        // placeholder="+91:"
                        value={formData.whatsappContact}
                        onChange={handleChange}
                        maxLength={10}
                        required
                      />
                      {error && (
                        <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
                      )}
                    </div>
                  </div>


                    {/* Email Address */}
                    <div className="mb-3">
                      <label htmlFor="emailAddress" className="form-label">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="emailAddress"

                        // required
                      />
                    </div>

                    {/* Government ID Upload */}
                    <div className="mb-3">
                      <label htmlFor="uploadId" className="form-label">
                        Please upload any Government ID, size less than 400KB
                      </label>
                      <input
                        className="form-control"
                        type="file"
                        id="uploadId"
                        required
                      />
                      <div className="form-text">
                        *This Doc. will be used for check-in purpose only
                      </div>
                    </div>

                    {/* Occupancy Selection */}
                    {/* <div className="mb-3">
                      <label className="form-label">Select Occupancy</label>
                      <select
                        value={occupancy}
                        onChange={handleOccupancyChange}
                      >
                        <option value="">Select Occupancy</option>
                        {["Single", "Double", "Triple", "Fourth"].map(
                          (type) => (
                            <option
                              key={type}
                              value={type}
                              disabled={
                                occupancyCount[type] >= occupancyLimits[type]
                              }
                            >
                              {type}{" "}
                              {occupancyCount[type] >= occupancyLimits[type]
                                ? "(Full)"
                                : ""}
                            </option>
                          )
                        )}
                      </select>
                    </div> */}


                    {/* Occupancy Selection */}
                      <div className="mb-3">
                        <label className="form-label">Select Occupancy</label>
                        <select value={occupancy} onChange={handleOccupancyChange}>
                          <option value="">Select Occupancy</option>
                          {Object.keys(roomData)
                            .filter((type) => roomData[type] && roomData[type].trim() !== "")
                            .map((type) => (
                              <option
                                key={type}
                                value={type}
                                disabled={occupancyCount[type] >= occupancyLimits[type]}
                              >
                                {type}{" "}
                                {occupancyCount[type] >= occupancyLimits[type] ? "(Full)" : ""}
                              </option>
                            ))}
                        </select>
                      </div>


                    {selectedOccupancy && (
                      <p>Selected Occupancy: {selectedOccupancy}</p>
                    )}

                    <div className="mb-3">
                      <label className="form-label">Select Room</label>
                      <select
                        className="form-control"
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                      >
                        <option value="">Select a room</option>
                        {availableRooms.map((room, idx) => (
                          <option key={idx} value={room}>
                            {room}
                          </option>
                        ))}
                      </select>
                    </div>


                    {/* Check-In Button */}
                    <button type="submit" className="btn btn-submit w-100">
                      Check-In
                    </button>
                  </form>
                )}
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
        <div className="checkin-footer">
          <p>Let’s Stay in Touch!</p>
          <ul className="social-list-icons">
            
            <li>
              <Link href="https://www.facebook.com/TourWatchout/"  target="_blank">
                <img
                  src="./assets/images/icons/facebook.png"
                  alt="Facebook Icon"
                />
              </Link>
            </li>
            <li>
              <Link href="https://www.instagram.com/tourwatchout/" target="_blank">
                <img
                  src="./assets/images/icons/insta.png"
                  alt="Instagram Icon"
                />
              </Link>
            </li>
            <li>
              <Link href="https://tourwatchout.com/" target="_blank">
                <img src="./assets/images/icons/web.png" alt="Web Icon" />
              </Link>
            </li>
            <li>
              <Link href="https://www.youtube.com/@Tourwatchout" target="_blank">
                <img src="./assets/images/icons/youtube.png" alt="Youtube Icon" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export async function getServerSideProps(context) {
  console.log("Server Side Query Params:", context.query);
  return { props: {} };
}





