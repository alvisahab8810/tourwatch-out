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
//                     placeholder="Madhav Singh"
//                   />
//                 </div>
//                 <div className="form-group col-md-3">
//                   <label htmlFor="destination">Destination</label>
//                   <select
//                     className="form-select"
//                     aria-label="Default select example"
//                   >
//                     <option>Dubai</option>
//                     <option>One</option>
//                     <option>Two</option>
//                     <option>Three</option>
//                   </select>
//                 </div>

//                 <div className="form-group col-md-3">
//                   <label htmlFor="contact">Contact</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="contact"
//                     placeholder="9876543210"
//                   />
//                 </div>
//                 <div className="form-group col-md-3">
//                   <label htmlFor="email">Email</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     id="email"
//                     placeholder="madhavsingh365@rediffmail.com"
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




import { useState } from "react";

export default function Form() {
  const [formData, setFormData] = useState({
    fullName: "",
    destination: "",
    contact: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const scriptURL = "https://script.google.com/macros/s/AKfycbzgYRJrVpi-0hKd_h_Xk5kBlckUhmNclr-9fS_YSToE8zagaKBgInyb3r_Tg9d9Gej7/exec"; // Replace with your Web App URL

    const formBody = new FormData();
    formBody.append("fullName", formData.fullName);
    formBody.append("destination", formData.destination);
    formBody.append("contact", formData.contact);
    formBody.append("email", formData.email);

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        body: formBody,
      });

      const result = await response.json();
      console.log("Success:", result);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <section className="form-section">
      <div className="container p-relative">
        <div className="container-form">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group col-md-3">
                <label htmlFor="full-name">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="full-name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Madhav Singh"
                />
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="destination">Destination</label>
                <select
                  className="form-select"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                >
                  <option value="Dubai">Dubai</option>
                  <option value="One">One</option>
                  <option value="Two">Two</option>
                  <option value="Three">Three</option>
                </select>
              </div>

              <div className="form-group col-md-3">
                <label htmlFor="contact">Contact</label>
                <input
                  type="text"
                  className="form-control"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="9876543210"
                />
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="madhavsingh365@rediffmail.com"
                />
              </div>

              <div className="form-group col-md-3 margin-bottom d-flex justify-content-end">
                <button type="submit" className="btn btn-danger">
                  Get A Call
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
