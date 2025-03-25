

// import ReactPaginate from "react-paginate";

// import { useEffect, useState } from "react";
// import { FaTrash, FaUndo, FaDownload } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import axios from "axios";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";


// const Response = () => {
//   const [formData, setFormData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [deletedRows, setDeletedRows] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Filter states
//   const [companyFilter, setCompanyFilter] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [mobileFilter, setMobileFilter] = useState("");
//   const [dateFilter, setDateFilter] = useState("");


//   // Reset filters
//   const resetFilters = () => {
//     setCompanyFilter("");
//     setDateFilter("");
//     setMobileFilter("");
//     setCurrentPage(0); // Reset pagination to first page
//     setFilteredData(formData);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("/api/getCheckins");
//         setFormData(response.data);
//         setFilteredData(response.data);
//       } catch (error) {
//         console.error("Error fetching check-in data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // Filtering logic
//    // Filtering logic
//    useEffect(() => {
//     let filtered = formData;

//     if (companyFilter) {
//       filtered = filtered.filter(entry =>
//         entry.companyName.toLowerCase().includes(companyFilter.toLowerCase())
//       );
//     }

//     if (startDate) {
//       filtered = filtered.filter(entry => new Date(entry.timestamp) >= new Date(startDate));
//     }

//     if (endDate) {
//       filtered = filtered.filter(entry => new Date(entry.timestamp) <= new Date(endDate));
//     }

//     if (mobileFilter) {
//       filtered = filtered.filter(entry =>
//         entry.whatsappContact.includes(mobileFilter)
//       );
//     }

//     setFilteredData(filtered);
//   }, [companyFilter, startDate, endDate, mobileFilter, formData]);


//   // Export to Excel
//   const exportToExcel = () => {
//     const dataToExport = filteredData.map(({ governmentId, ...rest }) => rest);
//     const ws = XLSX.utils.json_to_sheet(dataToExport);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Filtered Check-In Data");
//     XLSX.writeFile(wb, "FilteredCheckInData.xlsx");
//   };

//   // Download all government ID cards as ZIP
//   const downloadAllIDs = async () => {
//     const zip = new JSZip();
//     let count = 0;

//     filteredData.forEach((entry) => {
//       if (entry.governmentId) {
//         const base64Data = entry.governmentId.split(",")[1];
//         zip.file(`ID_${entry.fullName}_${count + 1}.png`, base64Data, { base64: true });
//         count++;
//       }
//     });

//     if (count === 0) {
//       alert("No government IDs available for download.");
//       return;
//     }

//     const content = await zip.generateAsync({ type: "blob" });
//     saveAs(content, "Government_IDs.zip");
//   };

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(0);
//   const rowsPerPage = 15;
//   const pageCount = Math.ceil(filteredData.length / rowsPerPage);
//   const displayedRows = filteredData.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

//   const handlePageClick = ({ selected }) => {
//     setCurrentPage(selected);
//   };

//   return (
//     <>
   
//       <div className="container response-main ptb-80">
//         <h2 className="text-center mb-4">Corporate Check-In</h2>

      


//         {/* Export & Download Buttons */}
//         <div className="d-flex align-items-center justify-content-between mb-3">
//           <button className="btn btn-success down-btn" onClick={exportToExcel}>
//             Export to Excel
//           </button>
//           <button className="down-btn" onClick={downloadAllIDs}>
//             <FaDownload /> Download All IDs
//           </button>
//         </div>



//           {/* Filter Section */}

//         <div className="filter-row bg-light mb-3">
//           {/* Company Name Dropdown */}

//             <div className="d-flex justify-content-between filt-bx">
//               <div>
//               <label className="mb-2">Filter by Company Name</label>
//                 <input
//                   type="text"
//                   // placeholder="Filter by Company Name"
//                   className="form-control mb-2"
//                   value={companyFilter}
//                   onChange={(e) => setCompanyFilter(e.target.value)}
//                 />
//               </div>
//               {/* WhatsApp Number Dropdown */}

//               <div>
//               <label className="mb-2">Filter by  Contact</label>
//                 <input
//                   type="text"
//                   // placeholder="Filter by WhatsApp Number"
//                   className="form-control mb-2"
//                   value={mobileFilter}
//                   onChange={(e) => setMobileFilter(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Date Range Filter */}

//             <div>
//             <label className="mb-2">Date Range</label>
//             <div className="d-flex">
//               <input
//                 type="date"
//                 className="form-control mb-2"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//               />
//               <input
//                 type="date"
//                 className="form-control mb-2 ml-2"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value) }
//               />

//             <button className="btn btn-secondary reset-btn" onClick={resetFilters}>
//               <FaUndo />  
//             </button>
//             </div>
//             </div>
        
//         </div>

//         {loading ? (
//           <p className="text-center">Loading check-in data...</p>
//         ) : filteredData.length > 0 ? (
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
//               </tr>
//             </thead>
//             <tbody>
//               {displayedRows.map((entry, index) => (
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
//                   <td>{new Date(entry.timestamp).toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p className="text-center">No check-in data found.</p>
//         )}

//         {/* Pagination */}
//         <ReactPaginate
//           previousLabel={"← Previous"}
//           nextLabel={"Next →"}
//           breakLabel={"..."}
//           pageCount={pageCount}
//           marginPagesDisplayed={2}
//           pageRangeDisplayed={3}
//           onPageChange={handlePageClick}
//           containerClassName={"pagination"}
//           activeClassName={"active"}
//           pageClassName={"page-item"}
//           pageLinkClassName={"page-link"}
//           previousClassName={"page-item"}
//           previousLinkClassName={"page-link"}
//           nextClassName={"page-item"}
//           nextLinkClassName={"page-link"}
//           breakClassName={"page-item"}
//           breakLinkClassName={"page-link"}
//         />

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

   
//     </>
//   );
// };

// export default Response;





import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import { FaTrash, FaUndo, FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const Response = () => {
  const [formData, setFormData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deletedRows, setDeletedRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [companyFilter, setCompanyFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [mobileFilter, setMobileFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Reset filters
  const resetFilters = () => {
    setCompanyFilter("");
    setDateFilter("");
    setMobileFilter("");
    setCurrentPage(0); // Reset pagination to first page
    setFilteredData(formData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/getCheckins");
        setFormData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching check-in data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtering logic
  useEffect(() => {
    let filtered = formData;

    if (companyFilter) {
      filtered = filtered.filter((entry) =>
        entry.companyName.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }

    if (startDate) {
      filtered = filtered.filter(
        (entry) => new Date(entry.timestamp) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (entry) => new Date(entry.timestamp) <= new Date(endDate)
      );
    }

    if (mobileFilter) {
      filtered = filtered.filter((entry) =>
        entry.whatsappContact.includes(mobileFilter)
      );
    }

    setFilteredData(filtered);
  }, [companyFilter, startDate, endDate, mobileFilter, formData]);

  // Export to Excel
  const exportToExcel = () => {
    const dataToExport = filteredData.map(({ governmentId, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Filtered Check-In Data");
    XLSX.writeFile(wb, "FilteredCheckInData.xlsx");
  };

  // Download all government ID cards as ZIP
  const downloadAllIDs = async () => {
    const zip = new JSZip();
    let count = 0;

    filteredData.forEach((entry) => {
      if (entry.governmentId) {
        const base64Data = entry.governmentId.split(",")[1];
        zip.file(`ID_${entry.fullName}_${count + 1}.png`, base64Data, {
          base64: true,
        });
        count++;
      }
    });

    if (count === 0) {
      alert("No government IDs available for download.");
      return;
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "Government_IDs.zip");
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 15;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const displayedRows = filteredData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };


  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/deleteCheckin?id=${id}`); // <-- FIXED URL FORMAT
  
      // If the request is successful, remove the item from the state
      setFilteredData((prevData) => prevData.filter((entry) => entry._id !== id));
  
    } catch (error) {
      console.error("Error deleting check-in:", error);
      alert("Failed to delete check-in. Please try again.");
    }
  };
  

  
  const handleUndo = (id) => {
    setDeletedRows((prev) => prev.filter((rowId) => rowId !== id));
  };

  return (
    <>
      <div className="container-fluid response-main ptb-80">
        <h2 className="text-center mb-4">Corporate Check-In</h2>

        {/* Export & Download Buttons */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <button className="btn btn-success down-btn" onClick={exportToExcel}>
            Export to Excel
          </button>
          <button className="down-btn" onClick={downloadAllIDs}>
            <FaDownload /> Download All IDs
          </button>
        </div>

        {/* Filter Section */}
        <div className="filter-row bg-light mb-3">
          <div className="d-flex justify-content-between filt-bx">
            <div>
              <label className="mb-2">Filter by Company Name</label>
              <input
                type="text"
                className="form-control mb-2"
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2">Filter by Contact</label>
              <input
                type="text"
                className="form-control mb-2"
                value={mobileFilter}
                onChange={(e) => setMobileFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="mb-2">Date Range</label>
            <div className="d-flex">
              <input
                type="date"
                className="form-control mb-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className="form-control mb-2 ml-2"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <button
                className="btn btn-secondary reset-btn"
                onClick={resetFilters}
              >
                <FaUndo />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center">Loading check-in data...</p>
        ) : filteredData.length > 0 ? (
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
                <th>Entry Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedRows.map((entry, index) => (
                <tr
                  key={index}
                  style={{
                    opacity: deletedRows.includes(entry._id) ? 0.5 : 1,
                  }}
                >
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
                  <td>{new Date(entry.timestamp).toLocaleString()}</td>
                  <td>
                    {deletedRows.includes(entry._id) ? (
                      <button
                        className="delete-btn"
                        onClick={() => handleUndo(entry._id)}
                      >
                        <FaUndo />
                      </button>
                    ) : (
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(entry._id)}
                      >
                        <FaTrash />
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

        {/* Pagination */}
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
        />

        {/* Modal to display ID */}
        {selectedImage && (
          <div
            className="modal fade show"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Government ID</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedImage(null)}
                  ></button>
                </div>
                <div className="modal-body text-center">
                  <img
                    src={selectedImage}
                    alt="Uploaded ID"
                    className="img-fluid"
                    style={{ maxHeight: "400px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Response;
