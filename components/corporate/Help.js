
"use client";
import { useState } from "react";
export default function Help() {

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    formType: "Helping Form", // 📌 Ensuring form type is captured
  });

  const [loading, setLoading] = useState(false); // 🔥 State for Loader
  const [showPopup, setShowPopup] = useState(false); // 🔥 State for Popup

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 🔥 Show loader

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwEHJ8jAIROffMRe5DFZltQ7Enqfb-gVXeneBwRphmuPtNELbWRIrkFX701n5A-vCE5/exec",
        {
          method: "POST",
          body: new URLSearchParams(formData).toString(),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.ok) {
        setShowPopup(true); // ✅ Show Popup
        setFormData({
          fullName: "",
          phoneNumber: "",
          emailAddress: "",
          formType: "Helping Form",
        }); // ✅ Reset form
      } else {
        alert("Failed to submit. Try again."); // ❌ Show error message
      }
    } catch (error) {
      alert("Failed to submit. Try again."); // ❌ Show error message
    } finally {
      setLoading(false); // 🔥 Hide loader after submission
    }
  };
  return (
    <>
      <section className="need-help-section ">
        <div className="container">
          <div className="need-help-row">
          <div className="need-form-bx">
              <h2>Need help to decide?</h2>
              <p className="need-para">Let’s Connect and talk out your doubts</p>

              <div className="contact-form p-5">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="emailAddress" className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      name="emailAddress"
                      value={formData.emailAddress}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-block" disabled={loading}>
                    {loading ? (
                      <span>
                        <i className="ri-loader-4-line ri-spin"></i> Submitting...
                      </span>
                    ) : (
                      "Contact Us"
                    )}
                  </button>
                </form>
              </div>
            </div>
            <div className="need-form-bx">
              <section className="banner-sections ">
                <div className="banner-section1">
                  <div className="banner-content">
                    <p>Visit the Paradise of earth</p>
                    <h1 className="pacifico-regular">Kashmir</h1>
                    <p>And get exciting offers</p>
                    <button className="btn btn-primary1" data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter"
                    fdprocessedid="s6df8j">
                      Request A Callback
                    </button>
                  </div>
                  <div className="ms-auto"></div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

       {/* ✅ Popup Modal */}
       {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Form Submitted Successfully! 🎉</h2>
            <p>Thank you for reaching out. We'll get back to you soon!</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {/* ✅ Popup Styles */}
      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .popup-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          max-width: 400px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .popup-content p {
          font-size: 13px;
          margin-top: 20px;
          margin-bottom: 20px;
        }
        .popup-content h2 {
          margin-bottom: 10px;
          font-size: 22px;
        }
        .popup-content button {
          padding: 10px 20px;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 14px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}



// "use client";
// import { useState } from "react";

// export default function Help() {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     phoneNumber: "",
//     emailAddress: "",
//     formType: "Helping Form", // 📌 Ensuring form type is captured
//   });

//   const [loading, setLoading] = useState(false); // 🔥 State for Loader
//   const [showPopup, setShowPopup] = useState(false); // 🔥 State for Popup

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true); // 🔥 Show loader

//     try {
//       const response = await fetch(
//         "https://script.google.com/macros/s/AKfycbwEHJ8jAIROffMRe5DFZltQ7Enqfb-gVXeneBwRphmuPtNELbWRIrkFX701n5A-vCE5/exec",
//         {
//           method: "POST",
//           body: new URLSearchParams(formData).toString(),
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//         }
//       );

//       if (response.ok) {
//         setShowPopup(true); // ✅ Show Popup
//         setFormData({
//           fullName: "",
//           phoneNumber: "",
//           emailAddress: "",
//           formType: "Helping Form",
//         }); // ✅ Reset form
//       } else {
//         alert("Failed to submit. Try again."); // ❌ Show error message
//       }
//     } catch (error) {
//       alert("Failed to submit. Try again."); // ❌ Show error message
//     } finally {
//       setLoading(false); // 🔥 Hide loader after submission
//     }
//   };

//   return (
//     <>
//       <section className="international-help need-help-section">
//         <div className="container">
//           <div className="need-help-row">
//             <div className="need-form-bx">
//               <h2>Need help to decide?</h2>
//               <p className="need-para">Let’s Connect and talk out your doubts</p>

//               <div className="contact-form p-5">
//                 <form onSubmit={handleSubmit}>
//                   <div className="mb-3">
//                     <label htmlFor="fullName" className="form-label">Full Name</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="fullName"
//                       value={formData.fullName}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="phoneNumber"
//                       value={formData.phoneNumber}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="emailAddress" className="form-label">Email Address</label>
//                     <input
//                       type="email"
//                       className="form-control"
//                       name="emailAddress"
//                       value={formData.emailAddress}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                   <button type="submit" className="btn btn-block" disabled={loading}>
//                     {loading ? (
//                       <span>
//                         <i className="ri-loader-4-line ri-spin"></i> Submitting...
//                       </span>
//                     ) : (
//                       "Contact Us"
//                     )}
//                   </button>
//                 </form>
//               </div>
//             </div>

//             <div className="need-form-bx">
//               <section className="banner-sections ">
//                 <div className="banner-section1">
//                   <div className="banner-content">
//                     <p>Visit the Paradise of earth</p>
//                     <h1 className="pacifico-regular">Kashmir</h1>
//                     <p>And get exciting offers</p>
//                     <button className="btn btn-primary1" data-bs-toggle="modal"
//                     data-bs-target="#exampleModalCenter"
//                     fdprocessedid="s6df8j">
//                       Request A Callback
//                     </button>
//                   </div>
//                   <div className="ms-auto"></div>
//                 </div>
//               </section>
//             </div>

            
//           </div>
//         </div>
//       </section>

//       {/* ✅ Popup Modal */}
//       {showPopup && (
//         <div className="popup-overlay">
//           <div className="popup-content">
//             <h2>Form Submitted Successfully! 🎉</h2>
//             <p>Thank you for reaching out. We'll get back to you soon!</p>
//             <button onClick={() => setShowPopup(false)}>Close</button>
//           </div>
//         </div>
//       )}

//       {/* ✅ Popup Styles */}
//       <style jsx>{`
//         .popup-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           background: rgba(0, 0, 0, 0.5);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }
//         .popup-content {
//           background: white;
//           padding: 20px;
//           border-radius: 8px;
//           text-align: center;
//           max-width: 400px;
//           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//         }
//         .popup-content p {
//           font-size: 13px;
//           margin-top: 20px;
//           margin-bottom: 20px;
//         }
//         .popup-content h2 {
//           margin-bottom: 10px;
//           font-size: 22px;
//         }
//         .popup-content button {
//           padding: 10px 20px;
//           background-color: #f44336;
//           color: white;
//           border: none;
//           border-radius: 5px;
//           font-size: 14px;
//           cursor: pointer;
//         }
//       `}</style>
//     </>
//   );
// }
