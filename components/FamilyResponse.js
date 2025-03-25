// import React, { useEffect, useState } from "react";
// import ReactPaginate from "react-paginate";
// import { FaUndo, FaTrash } from "react-icons/fa";
// import axios from "axios";

// const FamilyResponse = () => {
//   const [familyData, setFamilyData] = useState([]);
//   const [filteredFamilyData, setFilteredFamilyData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [deletedIds, setDeletedIds] = useState([]);

//   // Filter states
//   const [contactFilter, setContactFilter] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   useEffect(() => {
//     const fetchFamilyData = async () => {
//       try {
//         const response = await axios.get("/api/family-checkin");
//         let data = response.data.data || [];
//         // Sort descending so newest appears first
//         data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         setFamilyData(data);
//         setFilteredFamilyData(data);
//       } catch (error) {
//         console.error("Error fetching family check-in data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFamilyData();
//   }, []);

//   // Filtering logic
//   useEffect(() => {
//     let filtered = familyData;
//     if (contactFilter) {
//       filtered = filtered.filter((entry) =>
//         entry.contact.includes(contactFilter)
//       );
//     }
//     if (startDate) {
//       filtered = filtered.filter(
//         (entry) => new Date(entry.createdAt) >= new Date(startDate)
//       );
//     }
//     if (endDate) {
//       filtered = filtered.filter(
//         (entry) => new Date(entry.createdAt) <= new Date(endDate)
//       );
//     }
//     setFilteredFamilyData(filtered);
//     setCurrentPage(0);
//   }, [contactFilter, startDate, endDate, familyData]);

//   const resetFilters = () => {
//     setContactFilter("");
//     setStartDate("");
//     setEndDate("");
//     setCurrentPage(0);
//     setFilteredFamilyData(familyData);
//   };

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(0);
//   const rowsPerPage = 15;
//   const pageCount = Math.ceil(filteredFamilyData.length / rowsPerPage);
//   const displayedRows = filteredFamilyData.slice(
//     currentPage * rowsPerPage,
//     (currentPage + 1) * rowsPerPage
//   );
//   const handlePageClick = ({ selected }) => {
//     setCurrentPage(selected);
//   };

//   // Delete / Undo actions (using _id field)
//   const handleDelete = (id) => {
//     setDeletedIds((prev) => [...prev, id]);
//   };

//   const handleUndo = (id) => {
//     setDeletedIds((prev) => prev.filter((item) => item !== id));
//   };

//   return (
//     <div className="container-fluid response-main ptb-80">
//       <h2 className="text-center mb-4">Family Check-In Response</h2>

//       {/* Filter Section */}
//       <div className="filter-row bg-light mb-3">
//         <div>
//           <label className="mb-2">Filter by Contact</label>
//           <input
//             type="text"
//             className="form-control mb-2"
//             value={contactFilter}
//             onChange={(e) => setContactFilter(e.target.value)}
//           />
//         </div>
//         <div>
//           <label className="mb-2">Date Range</label>
//           <div className="d-flex">
//             <input
//               type="date"
//               className="form-control mb-2"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//             <input
//               type="date"
//               className="form-control mb-2 ml-2"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//             <button className="btn btn-secondary reset-btn" onClick={resetFilters}>
//               <FaUndo />
//             </button>
//           </div>
//         </div>
//       </div>

//       {loading ? (
//         <p className="text-center">Loading family check-in data...</p>
//       ) : filteredFamilyData.length > 0 ? (
//         <table className="table table-bordered">
//           <thead>
//             <tr>
//               <th>Full Name</th>
//               <th>Contact</th>
//               <th>Email</th>
//               <th>No. of People</th>
//               <th>Persons Details</th>
//               <th>No. of Kids</th>
//               <th>Kids Details</th>
//               <th>Entery Date</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {displayedRows.map((entry, index) => {
//               const isDeleted = deletedIds.includes(entry._id);
//               return (
//                 <tr key={index} style={{ opacity: isDeleted ? 0.5 : 1 }}>
//                   <td>{entry.fullName}</td>
//                   <td>{entry.contact}</td>
//                   <td>{entry.email}</td>
//                   <td>{entry.totalPersons}</td>
//                   <td>
//                     {entry.persons && entry.persons.length > 0 ? (
//                       entry.persons.map((person, i) => {
//                         // Check if governmentId is a full data URL; if not, prepend base path.
//                         const idUrl = person.governmentId.startsWith("data:")
//                           ? person.governmentId
//                           : `/uploads/${person.governmentId}`;
//                         return (
//                           <div key={i} style={{ marginBottom: "5px" }}>
//                             {person.governmentId ? (
//                               <button
//                                 className="view-btn"
//                                 onClick={() => setSelectedImage(idUrl)}
//                               >
//                                 View ID ({person.name})
//                               </button>
//                             ) : (
//                               <span>{person.name} (No ID)</span>
//                             )}
//                           </div>
//                         );
//                       })
//                     ) : (
//                       "No persons"
//                     )}
//                   </td>
//                   <td>{entry.totalKids}</td>
//                   <td>
//                     {entry.kids && entry.kids.length > 0 ? (
//                       entry.kids.map((kid, i) => (
//                         <div key={i}>
//                           {kid.name} (Age: {kid.age})
//                         </div>
//                       ))
//                     ) : (
//                       "No kids"
//                     )}
//                   </td>
//                   <td>{new Date(entry.createdAt).toLocaleString()}</td>
//                   <td>
//                     {isDeleted ? (
//                       <button
//                         className="delete-btn"
//                         onClick={() => handleUndo(entry._id)}
//                       >
//                         <FaUndo />
//                       </button>
//                     ) : (
//                       <button
//                         className="delete-btn"
//                         onClick={() => handleDelete(entry._id)}
//                       >
//                         <FaTrash />
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       ) : (
//         <p className="text-center">No family check-in data found.</p>
//       )}

//       <ReactPaginate
//         previousLabel={"← Previous"}
//         nextLabel={"Next →"}
//         breakLabel={"..."}
//         pageCount={pageCount}
//         marginPagesDisplayed={2}
//         pageRangeDisplayed={3}
//         onPageChange={handlePageClick}
//         containerClassName={"pagination"}
//         activeClassName={"active"}
//       />

//       {/* Modal for displaying Government ID */}
//       {selectedImage && (
//         <div
//           className="modal fade show"
//           tabIndex="-1"
//           role="dialog"
//           style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
//         >
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Government ID</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setSelectedImage(null)}
//                 ></button>
//               </div>
//               <div className="modal-body text-center">
//                 <img
//                   src={selectedImage}
//                   alt="Uploaded ID"
//                   className="img-fluid"
//                   style={{ maxHeight: "400px" }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FamilyResponse;

import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { FaTrash, FaUndo, FaDownload } from "react-icons/fa";

import ReactPaginate from "react-paginate";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const FamilyResponse = () => {


   // Pagination
   const [currentPage, setCurrentPage] = useState(0);
  const [filteredData, setFilteredData] = useState([]);

   const rowsPerPage = 15;
   const pageCount = Math.ceil(filteredData.length / rowsPerPage);
   const displayedRows = filteredData.slice(
     currentPage * rowsPerPage,
     (currentPage + 1) * rowsPerPage
   );
 
   const handlePageClick = ({ selected }) => {
     setCurrentPage(selected);
   };


  


  const downloadAllIDs = async () => {
    const zip = new JSZip();
    let count = 0;

    // Loop through filteredFamilyData and each person in each record
    filteredFamilyData.forEach((entry) => {
      if (entry.persons && entry.persons.length > 0) {
        entry.persons.forEach((person, i) => {
          if (person.governmentId) {
            // Assume governmentId is a Data URL (e.g., "data:image/png;base64,...")
            const base64Data = person.governmentId.split(",")[1];
            // Create a filename like "ID_<FullName>_1.png"
            zip.file(`ID_${entry.fullName}_${i + 1}.png`, base64Data, {
              base64: true,
            });
            count++;
          }
        });
      }
    });

    if (count === 0) {
      alert("No government IDs available for download.");
      return;
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "Government_IDs.zip");
  };

  const exportToExcel = () => {
    // Optionally remove or transform fields you don't want in Excel (like base64 images)
    const dataToExport = filteredFamilyData.map(({ persons, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FamilyCheckInData");
    XLSX.writeFile(workbook, "FamilyCheckInData.xlsx");
  };

  const [familyData, setFamilyData] = useState([]);
  const [filteredFamilyData, setFilteredFamilyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedKids, setSelectedKids] = useState(null); // ✅ Fixed missing state
  const [selectedIdImage, setSelectedIdImage] = useState(null);
  const [deletedIds, setDeletedIds] = useState([]);

  const [contactFilter, setContactFilter] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // Reset filters
  const resetFilters = () => {
    setCompanyFilter("");
    setDateFilter("");
    setMobileFilter("");
    setCurrentPage(0); // Reset pagination to first page
    setFilteredData(formData);
  };

  useEffect(() => {
    let filtered = familyData;

    // Filter by contact
    if (contactFilter) {
      filtered = filtered.filter((entry) =>
        entry.contact.includes(contactFilter)
      );
    }

    // Filter by date range
    if (filterStartDate && filterEndDate) {
      filtered = filtered.filter((entry) => {
        const entryDate = new Date(entry.createdAt);
        return (
          entryDate >= new Date(filterStartDate) &&
          entryDate <= new Date(filterEndDate)
        );
      });
    }

    setFilteredFamilyData(filtered);
    setCurrentPage(0); // reset pagination when filters change
  }, [contactFilter, filterStartDate, filterEndDate, familyData]);

  const [deletedRows, setDeletedRows] = useState([]);

  useEffect(() => {
    const fetchFamilyData = async () => {
      try {
        const response = await axios.get("/api/family-checkin");
        let data = response.data.data || [];
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFamilyData(data);
        setFilteredFamilyData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFamilyData();
  }, []);

  const handleDelete = async (id) => {
    try {
      // Call the delete API endpoint for family check-ins

      await axios.delete(`/api/deleteFamily/${id}`);

      // Update the state: remove the deleted record from filteredFamilyData
      setFilteredFamilyData((prevData) =>
        prevData.filter((entry) => entry._id !== id)
      );
    } catch (error) {
      console.error("Error deleting check-in:", error);
      alert("Failed to delete check-in. Please try again.");
    }
  };

  const handleUndo = (id) =>
    setDeletedIds(deletedIds.filter((item) => item !== id));

  return (
    <div className="container-fluid response-main ptb-80">
      <h2 className="text-center mb-4">Family Check-In Response</h2>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <button className="btn btn-success down-btn" onClick={exportToExcel}>
          Export to Excel
        </button>
        <button className="down-btn" onClick={downloadAllIDs}>
          <FaDownload /> Download All IDs
        </button>
      </div>

      <div className="filter-row bg-light mb-3">
        <div>
          <label className="mb-2">Filter by Contact</label>
          <input
            type="text"
            className="form-control mb-2"
            value={contactFilter}
            onChange={(e) => setContactFilter(e.target.value)}
            placeholder="Enter contact"

            // onChange={(e) => setCompanyFilter(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-2">Date Range</label>
          <div className="d-flex">
            <input
              type="date"
              className="form-control mb-2"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
            />
            <input
              type="date"
              className="form-control mb-2 ml-2"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* <button
                className="btn btn-secondary reset-btn"
                onClick={resetFilters}
              >
                <FaUndo />
              </button> */}
      </div>

      {loading ? (
        <p className="text-center">Loading data...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>No. of People</th>
              <th>Person Details</th>
              <th>No. of Kids</th>
              <th>Kids Details</th>
              <th>Entry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFamilyData.map((entry, index) => (
              <tr
                key={index}
                style={{ opacity: deletedIds.includes(entry._id) ? 0.5 : 1 }}
              >
                <td>{entry.fullName}</td>
                <td>{entry.contact}</td>
                <td>{entry.email}</td>
                <td>{entry.totalPersons}</td>
                <td>
                  {entry.persons?.length ? (
                    <button
                      className="view-btn"
                      onClick={() => setSelectedPerson(entry.persons)}
                    >
                      View Details
                    </button>
                  ) : (
                    "No persons"
                  )}
                </td>
                <td>{entry.totalKids}</td>
                <td>
                  {entry.kids?.length ? (
                    <button
                      className="view-btn"
                      onClick={() => setSelectedKids(entry.kids)}
                    >
                      {" "}
                      {/* ✅ Fixed here */}
                      View Details
                    </button>
                  ) : (
                    "No kids"
                  )}
                </td>
                <td>{new Date(entry.createdAt).toLocaleString()}</td>
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

      {/* Modal for Person Details */}
      {selectedPerson && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Person Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedPerson(null)}
                ></button>
              </div>
              <div className="modal-body">
                {selectedPerson.map((person, i) => (
                  <div key={i} className="row mb-2">
                    <div className="col-md-6">
                       <span><b>Name</b> : {person.name}</span> 
                    </div>

                    <div className="col-md-6">
                      {person.governmentId && (
                        <button
                          className="view-btn"
                          onClick={() => setSelectedIdImage(person.governmentId)}
                        >
                          View ID
                        </button>
                      )}
                    </div>

                    
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Government ID */}
      {selectedIdImage && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Government ID</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedIdImage(null)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={selectedIdImage}
                  alt="Uploaded ID"
                  className="img-fluid"
                  style={{ maxHeight: "400px" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kids Details Modal */}
      {selectedKids && ( // ✅ Fixed this section
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Kids Details</h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedKids(null)}
                ></button>
              </div>
              <div className="modal-body">
                {selectedKids.map((kid, i) => (
                  <div key={i} className="mb-2 row">
                    <div className="col-md-6">
                      <strong>Name:</strong> {kid.name} 
                    </div>
                    <div className="col-md-6">
                      <strong>Age:</strong> {kid.age ? kid.age : "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyResponse;
