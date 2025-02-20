  // import React from "react";

  // export default function Form() {
  //   return (
  //     <>
  //       <section className="form-section">
  //         <div className="container p-relative">
  //           <div className="container-form">
  //             <form>
  //               <div className="form-row">
  //                 <div className="form-group col-md-3">
  //                   <label htmlFor="full-name">Full Name</label>
  //                   <input
  //                     type="text"
  //                     className="form-control"
  //                     id="full-name"
  //                     placeholder=""
  //                   />
  //                 </div>
  //                 <div className="form-group col-md-3">
  //                   <label htmlFor="destination">Destination</label>
  //                   <select className="form-select" aria-label="Select Destination">
  //                     <optgroup label="🌍 International Destinations">
  //                       <option>Dubai</option>
  //                       <option>Bali</option>
  //                       <option>Thailand</option>
  //                       <option>Singapore</option>
  //                       <option>Malaysia</option>
  //                     </optgroup>
  //                     <optgroup label="🏞️ National Destinations">
  //                       <option>Kashmir</option>
  //                       <option>Leh Ladakh</option>
  //                       <option>Shimla</option>
  //                       <option>Kullu</option>
  //                       <option>Manali</option>
  //                       <option>Dharamshala</option>
  //                       <option>McLeod Ganj</option>
  //                       <option>Dehradun</option>
  //                       <option>Mussorie</option>
  //                       <option>Nainital</option>
  //                       <option>Jim Corbett</option>
  //                       <option>Jaipur</option>
  //                       <option>Udaipur</option>
  //                       <option>Jaisalmer</option>
  //                       <option>Gangtok</option>
  //                       <option>Darjeeling</option>
  //                       <option>Lonavala</option>
  //                       <option>Khandala</option>
  //                       <option>Goa</option>
  //                       <option>Andaman & Nicobar</option>
  //                     </optgroup>
  //                   </select>
  //                 </div>


  //                 <div className="form-group col-md-3">
  //                   <label htmlFor="contact">Contact</label>
  //                   <input
  //                     type="text"
  //                     className="form-control"
  //                     id="contact"
  //                     placeholder=""
  //                   />
  //                 </div>
  //                 <div className="form-group col-md-3">
  //                   <label htmlFor="email">Email</label>
  //                   <input
  //                     type="email"
  //                     className="form-control"
  //                     id="email"
  //                     placeholder=""
  //                   />
  //                 </div>

  //                 <div className="form-group col-md-3 margin-bottom d-flex justify-content-end">
  //                   <button type="submit" className="btn btn-danger">
  //                     Get A Call
  //                   </button>
  //                 </div>
  //               </div>
  //             </form>
  //           </div>
  //         </div>
  //       </section>
  //     </>
  //   );
  // }



  import React, { useState } from "react";
  import toast, { Toaster } from "react-hot-toast";
  
  export default function Form() {
    const [formData, setFormData] = useState({
      fullName: "",
      destination: "",
      contact: "",
      email: "",
      formType: "TourWatchout-Form",
    });
  
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
  
      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbxo7bKXBcwDk6oGV3pz1fzDR8cpaIKAJSW82flunKKrTOg1d_anWYMpVAXnEbOIXa9B/exec",
          {
            method: "POST",
            body: new URLSearchParams(formData),
          }
        );
  
        if (response.ok) {
          setShowPopup(true);
          setFormData({ fullName: "", destination: "", contact: "", email: "", formType: "TourWatchout-Form" });
        } else {
          toast.error("Failed to submit form. Please try again.");
        }
      } catch (error) {
        toast.error("Failed to submit form. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <section className="form-section">
        <div className="container p-relative">
          <div className="container-form">
            <Toaster />
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group col-md-3">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group col-md-3">
                  <label htmlFor="destination">Destination</label>
                  <select
                    className="form-select"
                    id="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Destination</option>
                    <optgroup label="🌍 International Destinations">
                      <option>Dubai</option>
                      <option>Bali</option>
                      <option>Thailand</option>
                      <option>Singapore</option>
                      <option>Malaysia</option>
                    </optgroup>
                    <optgroup label="🏞️ National Destinations">
                      <option>Kashmir</option>
                      <option>Leh Ladakh</option>
                      <option>Shimla</option>
                      <option>Kullu</option>
                      <option>Manali</option>
                      <option>Dharamshala</option>
                      <option>McLeod Ganj</option>
                      <option>Dehradun</option>
                      <option>Mussorie</option>
                      <option>Nainital</option>
                      <option>Jim Corbett</option>
                      <option>Jaipur</option>
                      <option>Udaipur</option>
                      <option>Jaisalmer</option>
                      <option>Gangtok</option>
                      <option>Darjeeling</option>
                      <option>Lonavala</option>
                      <option>Khandala</option>
                      <option>Goa</option>
                      <option>Andaman & Nicobar</option>
                    </optgroup>
                  </select>
                </div>
                <div className="form-group col-md-3">
                  <label htmlFor="contact">Contact</label>
                  <input
                    type="text"
                    className="form-control"
                    id="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group col-md-3">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group col-md-3 margin-bottom d-flex justify-content-end">
                  <button type="submit" className="btn btn-danger" disabled={loading}>
                    {loading ? <span><i className="ri-loader-4-line ri-spin"></i> Submitting...</span> : "Get A Call"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2>Form Submitted Successfully! 🎉</h2>
              <p>Thank you for reaching out. We'll get back to you soon!</p>
              <button onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>
        )}
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
            z-index: 11000;
          }
          .popup-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
      </section>
    );
  }
  