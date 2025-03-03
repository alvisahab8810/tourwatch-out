// import ReactPaginate from "react-paginate";

// import Footer from "../components/checkin/Footer";
// import Hero from "../components/checkin/Hero";
// import { useEffect, useState } from "react";
// import { FaTrash, FaUndo } from "react-icons/fa"; // Import Trash & Undo icons
// import * as XLSX from "xlsx"; // Import XLSX for Excel export
// import axios from "axios"; // Import Axios for API calls

// const Response = () => {
//   const [formData, setFormData] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [deletedRows, setDeletedRows] = useState([]);
//   const [loading, setLoading] = useState(true); // Loading state

//   // Fetch data from MongoDB when the component mounts
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("/api/getCheckins"); // Fetch from API
//         setFormData(response.data); // Set the fetched data
//       } catch (error) {
//         console.error("Error fetching check-in data:", error);
//       } finally {
//         setLoading(false); // Stop loading
//       }
//     };

//     fetchData();
//   }, []);

//   // Delete function
//   const handleDelete = (index) => {
//     const newData = [...formData];
//     const removedItem = newData.splice(index, 1)[0]; // Remove the row
//     setDeletedRows([...deletedRows, { ...removedItem, index }]); // Store for undo
//     setFormData(newData);
//   };

//   // Undo Delete function
//   const handleUndo = (index) => {
//     const lastDeleted = deletedRows.find((row) => row.index === index);
//     if (lastDeleted) {
//       const newData = [...formData];
//       newData.splice(lastDeleted.index, 0, lastDeleted); // Reinsert row
//       setFormData(newData);
//       setDeletedRows(deletedRows.filter((row) => row.index !== index)); // Remove from deleted list
//     }
//   };

//   // Export to Excel
//   const exportToExcel = () => {
//     const dataToExport = formData.map(({ governmentId, ...rest }) => rest); // Remove government ID (base64)
//     const ws = XLSX.utils.json_to_sheet(dataToExport);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Check-In Data");
//     XLSX.writeFile(wb, "CheckInData.xlsx");
//   };


//   //Pagination 

//   const [currentPage, setCurrentPage] = useState(0);
// const rowsPerPage = 15;

// // Calculate total pages
// const pageCount = Math.ceil(formData.length / rowsPerPage);

// // Get rows for the current page
// const displayedRows = formData.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

// // Handle page change
// const handlePageClick = ({ selected }) => {
//   setCurrentPage(selected);
// };


//   return (
//     <>
//       <Hero />
//       <div className="container response-main ptb-80">
//         <h2 className="text-center mb-4">Check-In Response</h2>

//         <button className="btn btn-success mb-3" onClick={exportToExcel}>
//           Export to Excel
//         </button>

//         {loading ? (
//           <p className="text-center">Loading check-in data...</p>
//         ) : formData.length > 0 ? (
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
//             {displayedRows.map((entry, index) => (
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


//     {/* // Pagination Component */}
//     <ReactPaginate
//       previousLabel={"← Previous"}
//       nextLabel={"Next →"}
//       breakLabel={"..."}
//       pageCount={pageCount}
//       marginPagesDisplayed={2}
//       pageRangeDisplayed={3}
//       onPageChange={handlePageClick}
//       containerClassName={"pagination"}
//       activeClassName={"active"}
//       pageClassName={"page-item"}
//       pageLinkClassName={"page-link"}
//       previousClassName={"page-item"}
//       previousLinkClassName={"page-link"}
//       nextClassName={"page-item"}
//       nextLinkClassName={"page-link"}
//       breakClassName={"page-item"}
//       breakLinkClassName={"page-link"}
//     />

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


import { useState } from "react";
import Response from "../components/CorporateResponse";
import FamilyResponse from "../components/FamilyResponse";
import Hero from "../components/checkin/Hero";
import Footer from "../components/checkin/Footer";

const CheckInResponsePage = () => {
  const [activeTab, setActiveTab] = useState("corporate"); // default tab

  return (
    <div>
      <Hero/>
      {/* Tab Navigation */}
      <div className="tabs-btns tabs pt-5" style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
        <button
          className={`down-btn ${activeTab === "corporate" ? "active" : ""}`}
          onClick={() => setActiveTab("corporate")}
          style={{ marginRight: "10px" }}
        >
          Corporate Check-In
        </button>
        <button
          className={`down-btn ${activeTab === "family" ? "active" : ""}`}
          onClick={() => setActiveTab("family")}
        >
          Family Check-In
        </button>
      </div>

      {/* Conditional Rendering Based on Tab */}
      {activeTab === "corporate" && <Response />}
      {activeTab === "family" && <FamilyResponse />}
      <Footer/>
    </div>
  );
};

export default CheckInResponsePage;

