// import React, { useEffect, useState } from "react";
// import ReactPaginate from "react-paginate";
// import { FaUndo } from "react-icons/fa";
// import axios from "axios";

// const FamilyResponse = () => {
//   const [familyData, setFamilyData] = useState([]);
//   const [filteredFamilyData, setFilteredFamilyData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(null);

//   // Filter states
//   const [contactFilter, setContactFilter] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   useEffect(() => {
//     const fetchFamilyData = async () => {
//       try {
//         const response = await axios.get("/api/family-checkin");
//         setFamilyData(response.data.data || []);
//         setFilteredFamilyData(response.data.data || []);
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

//   return (
//     <div className="container response-main ptb-80">
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
//               <th>Timestamp</th>
//             </tr>
//           </thead>
//           <tbody>
//             {displayedRows.map((entry, index) => (
//               <tr key={index}>
//                 <td>{entry.fullName}</td>
//                 <td>{entry.contact}</td>
//                 <td>{entry.email}</td>
//                 <td>{entry.totalPersons}</td>
//                 <td>
//                   {entry.persons && entry.persons.length > 0 ? (
//                     entry.persons.map((person, i) => {
//                       // If governmentId starts with "data:" then it's already a full URL; otherwise prepend a base path.
//                       const idUrl = person.governmentId.startsWith("data:")
//                         ? person.governmentId
//                         : `/uploads/${person.governmentId}`;
//                       return (
//                         <div key={i} style={{ marginBottom: "5px" }}>
//                           {person.governmentId ? (
//                             <button
//                               className="view-btn"
//                               onClick={() => setSelectedImage(idUrl)}
//                             >
//                               ({person.name}) View ID 
//                             </button>
//                           ) : (
//                             <span>{person.name} (No ID)</span>
//                           )}
//                         </div>
//                       );
//                     })
//                   ) : (
//                     "No persons"
//                   )}
//                 </td>
//                 <td>{entry.totalKids}</td>
//                 <td>
//                   {entry.kids && entry.kids.length > 0 ? (
//                     entry.kids.map((kid, i) => (
//                       <div key={i}>
//                         {kid.name} (Age: {kid.age})
//                       </div>
//                     ))
//                   ) : (
//                     "No kids"
//                   )}
//                 </td>
//                 <td>{new Date(entry.createdAt).toLocaleString()}</td>
//               </tr>
//             ))}
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
import ReactPaginate from "react-paginate";
import { FaUndo, FaTrash } from "react-icons/fa";
import axios from "axios";

const FamilyResponse = () => {
  const [familyData, setFamilyData] = useState([]);
  const [filteredFamilyData, setFilteredFamilyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deletedIds, setDeletedIds] = useState([]);

  // Filter states
  const [contactFilter, setContactFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchFamilyData = async () => {
      try {
        const response = await axios.get("/api/family-checkin");
        let data = response.data.data || [];
        // Sort descending so newest appears first
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFamilyData(data);
        setFilteredFamilyData(data);
      } catch (error) {
        console.error("Error fetching family check-in data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFamilyData();
  }, []);

  // Filtering logic
  useEffect(() => {
    let filtered = familyData;
    if (contactFilter) {
      filtered = filtered.filter((entry) =>
        entry.contact.includes(contactFilter)
      );
    }
    if (startDate) {
      filtered = filtered.filter(
        (entry) => new Date(entry.createdAt) >= new Date(startDate)
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (entry) => new Date(entry.createdAt) <= new Date(endDate)
      );
    }
    setFilteredFamilyData(filtered);
    setCurrentPage(0);
  }, [contactFilter, startDate, endDate, familyData]);

  const resetFilters = () => {
    setContactFilter("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(0);
    setFilteredFamilyData(familyData);
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 15;
  const pageCount = Math.ceil(filteredFamilyData.length / rowsPerPage);
  const displayedRows = filteredFamilyData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Delete / Undo actions (using _id field)
  const handleDelete = (id) => {
    setDeletedIds((prev) => [...prev, id]);
  };

  const handleUndo = (id) => {
    setDeletedIds((prev) => prev.filter((item) => item !== id));
  };

  return (
    <div className="container response-main ptb-80">
      <h2 className="text-center mb-4">Family Check-In Response</h2>

      {/* Filter Section */}
      <div className="filter-row bg-light mb-3">
        <div>
          <label className="mb-2">Filter by Contact</label>
          <input
            type="text"
            className="form-control mb-2"
            value={contactFilter}
            onChange={(e) => setContactFilter(e.target.value)}
          />
        </div>
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
            <button className="btn btn-secondary reset-btn" onClick={resetFilters}>
              <FaUndo />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading family check-in data...</p>
      ) : filteredFamilyData.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>No. of People</th>
              <th>Persons Details</th>
              <th>No. of Kids</th>
              <th>Kids Details</th>
              <th>Timestamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedRows.map((entry, index) => {
              const isDeleted = deletedIds.includes(entry._id);
              return (
                <tr key={index} style={{ opacity: isDeleted ? 0.5 : 1 }}>
                  <td>{entry.fullName}</td>
                  <td>{entry.contact}</td>
                  <td>{entry.email}</td>
                  <td>{entry.totalPersons}</td>
                  <td>
                    {entry.persons && entry.persons.length > 0 ? (
                      entry.persons.map((person, i) => {
                        // Check if governmentId is a full data URL; if not, prepend base path.
                        const idUrl = person.governmentId.startsWith("data:")
                          ? person.governmentId
                          : `/uploads/${person.governmentId}`;
                        return (
                          <div key={i} style={{ marginBottom: "5px" }}>
                            {person.governmentId ? (
                              <button
                                className="view-btn"
                                onClick={() => setSelectedImage(idUrl)}
                              >
                                View ID ({person.name})
                              </button>
                            ) : (
                              <span>{person.name} (No ID)</span>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      "No persons"
                    )}
                  </td>
                  <td>{entry.totalKids}</td>
                  <td>
                    {entry.kids && entry.kids.length > 0 ? (
                      entry.kids.map((kid, i) => (
                        <div key={i}>
                          {kid.name} (Age: {kid.age})
                        </div>
                      ))
                    ) : (
                      "No kids"
                    )}
                  </td>
                  <td>{new Date(entry.createdAt).toLocaleString()}</td>
                  <td>
                    {isDeleted ? (
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
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No family check-in data found.</p>
      )}

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
      />

      {/* Modal for displaying Government ID */}
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
  );
};

export default FamilyResponse;
