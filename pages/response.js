

// import Footer from "../components/checkin/Footer";
// import Hero from "../components/checkin/Hero";
// import { useEffect, useState } from "react";
// import { FaTrash, FaUndo } from "react-icons/fa"; // Import Trash & Undo icons
// import * as XLSX from "xlsx"; // Import XLSX for Excel export

// const Response = () => {
//   const [formData, setFormData] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [deletedRows, setDeletedRows] = useState([]);

//   useEffect(() => {
//     const data = localStorage.getItem("checkinData");
//     if (data) {
//       setFormData(JSON.parse(data));
//     }
//   }, []);

//   // Delete function
//   const handleDelete = (index) => {
//     const newData = [...formData];
//     const removedItem = newData.splice(index, 1)[0]; // Remove the row
//     setDeletedRows([...deletedRows, { ...removedItem, index }]); // Store for undo
//     setFormData(newData);
//     localStorage.setItem("checkinData", JSON.stringify(newData)); // Update local storage
//   };

//   // Undo Delete function
//   const handleUndo = (index) => {
//     const lastDeleted = deletedRows.find((row) => row.index === index);
//     if (lastDeleted) {
//       const newData = [...formData];
//       newData.splice(lastDeleted.index, 0, lastDeleted); // Reinsert row
//       setFormData(newData);
//       setDeletedRows(deletedRows.filter((row) => row.index !== index)); // Remove from deleted list
//       localStorage.setItem("checkinData", JSON.stringify(newData)); // Update local storage
//     }
//   };

//   // Export to Excel
//   const exportToExcel = () => {
//     // Remove the Government ID (base64) before exporting
//     const dataToExport = formData.map(({ governmentId, ...rest }) => rest);
  
//     const ws = XLSX.utils.json_to_sheet(dataToExport); // Convert to sheet
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Check-In Data"); // Append sheet
//     XLSX.writeFile(wb, "CheckInData.xlsx"); // Download file
//   };
  

//   return (
//     <>
//       <Hero />
//       <div className="container response-main ptb-80">
//         <h2 className="text-center mb-4">Check-In Response</h2>

//         <button className="btn btn-success mb-3" onClick={exportToExcel}>
//           Export to Excel
//         </button>

//         {formData.length > 0 ? (
//           <table className="table table-bordered">
//             <thead>
//               <tr>
//                 <th>Company Name</th>
//                 <th>Full Name</th>
//                 <th>WhatsApp Contact</th>
//                 <th>Email Address</th>
//                 <th>Occupancy</th>
//                 <th>Room</th>
//                 <th>Government ID</th>
//                 <th>Timestamp</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {formData.map((entry, index) => (
//                 <tr key={index}>
//                   <td>{entry.companyName}</td>
//                   <td>{entry.fullName}</td>
//                   <td>{entry.whatsappContact}</td>
//                   <td>{entry.emailAddress}</td>
//                   <td>{entry.selectedOccupancy}</td>
//                   <td>{entry.selectedRoom}</td>
//                   <td>
//                     {entry.governmentId ? (
//                       <button
//                         className="view-btn"
//                         onClick={() => setSelectedImage(entry.governmentId)}
//                       >
//                         View ID
//                       </button>
//                     ) : (
//                       "No ID uploaded"
//                     )}
//                   </td>
//                   <td>{entry.timestamp}</td>
//                   <td>
//                     <button className="btn btn-sm me-2" onClick={() => handleDelete(index)}>
//                       <FaTrash />
//                     </button>
//                     {deletedRows.find((row) => row.index === index) && (
//                       <button className="btn btn-sm" onClick={() => handleUndo(index)}>
//                         <FaUndo />
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p className="text-center">No check-in data found.</p>
//         )}

//         {/* Modal to display ID */}
//         {selectedImage && (
//           <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
//             <div className="modal-dialog">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">Government ID</h5>
//                   <button type="button" className="btn-close" onClick={() => setSelectedImage(null)}></button>
//                 </div>
//                 <div className="modal-body text-center">
//                   <img src={selectedImage} alt="Uploaded ID" className="img-fluid" style={{ maxHeight: "400px" }} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Response;




import Footer from "../components/checkin/Footer";
import Hero from "../components/checkin/Hero";
import { useEffect, useState } from "react";
import { FaTrash, FaUndo } from "react-icons/fa"; // Import Trash & Undo icons
import * as XLSX from "xlsx"; // Import XLSX for Excel export
import axios from "axios"; // Import Axios for API calls

const Response = () => {
  const [formData, setFormData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deletedRows, setDeletedRows] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch data from MongoDB when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/getCheckins"); // Fetch from API
        setFormData(response.data); // Set the fetched data
      } catch (error) {
        console.error("Error fetching check-in data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  // Delete function
  const handleDelete = (index) => {
    const newData = [...formData];
    const removedItem = newData.splice(index, 1)[0]; // Remove the row
    setDeletedRows([...deletedRows, { ...removedItem, index }]); // Store for undo
    setFormData(newData);
  };

  // Undo Delete function
  const handleUndo = (index) => {
    const lastDeleted = deletedRows.find((row) => row.index === index);
    if (lastDeleted) {
      const newData = [...formData];
      newData.splice(lastDeleted.index, 0, lastDeleted); // Reinsert row
      setFormData(newData);
      setDeletedRows(deletedRows.filter((row) => row.index !== index)); // Remove from deleted list
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const dataToExport = formData.map(({ governmentId, ...rest }) => rest); // Remove government ID (base64)
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Check-In Data");
    XLSX.writeFile(wb, "CheckInData.xlsx");
  };

  return (
    <>
      <Hero />
      <div className="container response-main ptb-80">
        <h2 className="text-center mb-4">Check-In Response</h2>

        <button className="btn btn-success mb-3" onClick={exportToExcel}>
          Export to Excel
        </button>

        {loading ? (
          <p className="text-center">Loading check-in data...</p>
        ) : formData.length > 0 ? (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Full Name</th>
                <th>WhatsApp Contact</th>
                <th>Email Address</th>
                <th>Occupancy</th>
                <th>Room</th>
                <th>Government ID</th>
                <th>Timestamp</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.companyName}</td>
                  <td>{entry.fullName}</td>
                  <td>{entry.whatsappContact}</td>
                  <td>{entry.emailAddress}</td>
                  <td>{entry.selectedOccupancy}</td>
                  <td>{entry.selectedRoom}</td>
                  <td>
                    {entry.governmentId ? (
                      <button
                        className="view-btn"
                        onClick={() => setSelectedImage(entry.governmentId)}
                      >
                        View ID
                      </button>
                    ) : (
                      "No ID uploaded"
                    )}
                  </td>
                  <td>{entry.timestamp}</td>
                  <td>
                    <button className="btn btn-sm me-2" onClick={() => handleDelete(index)}>
                      <FaTrash />
                    </button>
                    {deletedRows.find((row) => row.index === index) && (
                      <button className="btn btn-sm" onClick={() => handleUndo(index)}>
                        <FaUndo />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No check-in data found.</p>
        )}

        {/* Modal to display ID */}
        {selectedImage && (
          <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Government ID</h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedImage(null)}></button>
                </div>
                <div className="modal-body text-center">
                  <img src={selectedImage} alt="Uploaded ID" className="img-fluid" style={{ maxHeight: "400px" }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Response;

