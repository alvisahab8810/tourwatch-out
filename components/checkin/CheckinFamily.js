// import React from "react";

// export default function CheckInFamily() {
//   return (
//     <>
//       <section className="checkin-section">
//         <div className="container ptb-50">
//           <h1 className="check-heading">Skip the Wait, Check-In Now</h1>
//           <p className="check-para">
//             {" "}
//             Check-in early and enjoy your trip stress-free!
//           </p>

//           <div className="checkinbox">
//             <div class="container">
//               <div className="form-container">
//                 {/* <h2 className="mb-3">Travellers</h2> */}
//                 <form>
//                   <div className="row mb-3">

//                     <div className="col">
//                       <label for="fullName" className="form-label">
//                         Full Name
//                        </label>
//                        <input
//                         type="text"
//                         className="form-control"
//                         id="fullName"
//                        />
//                     </div>
//                     <div className="col">
//                       <label for="person1-contact" className="form-label">Contact</label>
//                        <input
//                         type="text"
//                         class="form-control"
//                         id="person1-contact"
//                       />
//                     </div>

//                   </div>

//                   <div class="mb-3">

//                      <label for="emailAddress" className="form-label">
//                         Email Address
//                       </label>
//                       <input
//                         type="email"
//                         className="form-control"
//                         id="emailAddress"
//                       />

//                     </div>
//                   <div className="row mb-3">
//                     <div className="col">
//                       <label for="people" className="form-label">
//                         No. of people
//                       </label>
//                       <select className="form-select" id="selectpeople">
//                         <option selected>Select Item</option>
//                         <option value="1">01</option>
//                         <option value="2">02</option>
//                         <option value="3">03</option>
//                         <option value="4">04</option>
//                         <option value="5">05</option>

//                         <option value="6">06</option>
//                         <option value="7">07</option>
//                         <option value="8">08</option>
//                         <option value="9">09</option>
//                         <option value="10">10</option>
//                       </select>
//                     </div>
//                     <div className="col">
//                       <label for="selectRoom" className="form-label">
//                         No of kids
//                       </label>
//                       <select className="form-select" id="selectkids">
//                         <option selected>Select Item</option>
//                         <option value="1">01</option>
//                         <option value="2">02</option>
//                         <option value="3">03</option>
//                         <option value="4">04</option>
//                         <option value="5">05</option>
//                       </select>
//                     </div>
//                   </div>

//                   <h5 className="person-heading">Person 1</h5>

//                   <div class="mt-3  person1">
//                     <div className="row ">
//                     <div className="col-md-6">
//                       <label for="fullName" className="form-label">
//                         Full Name
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="fullName"
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <label for="uploadId" className="form-label">
//                         Please upload any Government ID, size less than 100KB
//                       </label>
//                       <input
//                         className="form-control"
//                         type="file"
//                         id="uploadId"
//                       />
//                       <div className="form-text">
//                         *This Doc. will be used for check-in purpose only
//                       </div>
//                     </div>
//                     </div>

//                   </div>

//                   <h5 className="mt-3 person-heading">Child 1</h5>

//                   <div className="mt-3 person1">
//                     <div className="row">
//                       <div className=" col-md-6">
//                         <label for="child1-name" className="form-label">Full Name</label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           id="child1-name"
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <label for="selectRoom" className="form-label">
//                           Child Age
//                         </label>
//                         <select className="form-select" id="selectkids">
//                           <option selected>Select Item</option>
//                           <option value="1">01</option>
//                           <option value="2">02</option>
//                           <option value="3">03</option>
//                           <option value="4">04</option>
//                           <option value="5">05</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-4">
//                     <button type="submit" className="btn btn-submit w-100">
//                       Submit
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//           <div className="checkin-footer">
//             <p>Let’s Stay in Touch! </p>
//             <ul className="social-list-icons">
//               <li>
//                 <a href="#">
//                   <img
//                     src="./assets/images/icons/whatsapp.png"
//                     alt="Whatsapp Icon"
//                   ></img>
//                 </a>
//               </li>
//               <li>
//                 <a href="#">
//                   <img
//                     src="./assets/images/icons/facebook.png"
//                     alt="Facebook Icon"
//                   ></img>
//                 </a>
//               </li>
//               <li>
//                 <a href="#">
//                   <img
//                     src="./assets/images/icons/insta.png"
//                     alt="Instagram Icon"
//                   ></img>
//                 </a>
//               </li>
//               <li>
//                 <a href="#">
//                   <img src="./assets/images/icons/web.png" alt="Web Icon"></img>
//                 </a>
//               </li>
//               <li>
//                 <a href="#">
//                   <img src="./assets/images/icons/x.png" alt="X Icon"></img>
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

// import React, { useState } from "react";
// import Link from "next/link";
// export default function CheckInFamily() {
//   const [maxPeople, setMaxPeople] = useState(1);
//   const [personFields, setPersonFields] = useState(1);
//   const [maxKids, setMaxKids] = useState(0);
//   const [kidFields, setKidFields] = useState(0);
//   const [error, setError] = useState("");

//   // Handle dropdown change for number of people
//   const handlePeopleChange = (e) => {
//     const selected = parseInt(e.target.value, 10);
//     setMaxPeople(selected);
//     setPersonFields(1);
//   };

//   // Handle dropdown change for number of kids
//   const handleKidsChange = (e) => {
//     const selected = parseInt(e.target.value, 10);
//     setMaxKids(selected);
//     setKidFields(selected > 0 ? 1 : 0);
//   };

//   // Add another person field if not reached the max
//   const addPersonField = () => {
//     if (personFields < maxPeople) {
//       setPersonFields(personFields + 1);
//     }
//   };

//   // Add another kid field if not reached the max
//   const addKidField = () => {
//     if (kidFields < maxKids) {
//       setKidFields(kidFields + 1);
//     }
//   };

//   // Render dynamic person fields with Government ID upload
//   const renderPersonFields = () => {
//     let fields = [];
//     for (let i = 1; i <= personFields; i++) {
//       fields.push(
//         <div key={`person-${i}`} className="person-field mb-3">
//           <h5 className="mb-3 person-heading">Person {i}</h5>
//           <div className="person1">
//             <div className="row">
//               <div className="col-md-6">
//                 <label htmlFor={`person${i}-name`} className="form-label">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id={`person${i}-name`}
//                   name={`person${i}-name`}
//                   required
//                 />
//               </div>
//               <div className="col-md-6">
//                 <label htmlFor={`uploadId-${i}`} className="form-label">
//                   Please upload any Government ID (JPG or PDF, &lt;100KB)
//                 </label>
//                 <input
//                   type="file"
//                   className="form-control p-id"
//                   id={`uploadId-${i}`}
//                   name={`uploadId-${i}`}
//                   accept=".jpg, .jpeg, .pdf"
//                   required
//                 />
//                 <div className="form-text">
//                   *This Doc. will be used for check-in purpose only.
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       );
//     }
//     return fields;
//   };

//   // Render dynamic kid fields
//   const renderKidFields = () => {
//     let fields = [];
//     for (let i = 1; i <= kidFields; i++) {
//       fields.push(
//         <div key={`kid-${i}`} className="kid-field mb-3">
//           <h5 className="mb-3 person-heading">Child {i}</h5>
//           <div className="person1">
//             <div className="row">
//               <div className="col-md-6">
//                 <label htmlFor={`child${i}-name`} className="form-label">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id={`child${i}-name`}
//                   name={`child${i}-name`}
//                   required
//                 />
//               </div>
//               <div className="col-md-6">
//                 <label htmlFor={`child${i}-age`} className="form-label">
//                   Age
//                 </label>
//                 <select
//                   className="form-select"
//                   id={`child${i}-age`}
//                   name={`child${i}-age`}
//                   required
//                 >
//                   <option value="">Select Age</option>
//                   <option value="1">01</option>
//                   <option value="2">02</option>
//                   <option value="3">03</option>
//                   <option value="4">04</option>
//                   <option value="5">05</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>
//       );
//     }
//     return fields;
//   };

//   // Helper to read a file as Data URL (returns a Promise)
//   const readFileAsDataURL = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });
//   };

//   // Handle form submission for Family Check-In
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     const form = e.target;
//     const fullName = form.fullName.value.trim();
//     const contact = form["person1-contact"].value.trim();
//     const emailAddress = form.emailAddress.value.trim();

//     // Ensure main fields are filled
//     if (!fullName || !contact || !emailAddress) {
//       setError("Please fill in all main fields.");
//       return;
//     }

//     // Process persons fields (each may include a file)
//     let persons = [];
//     for (let i = 1; i <= personFields; i++) {
//       const personName = form[`person${i}-name`].value.trim();
//       const fileInput = form[`uploadId-${i}`];
//       let governmentId = "";
//       if (fileInput && fileInput.files[0]) {
//         const file = fileInput.files[0];
//         if (file.size > 100 * 1024) {
//           setError(`File for Person ${i} must be under 100KB.`);
//           return;
//         }
//         try {
//           governmentId = await readFileAsDataURL(file);
//         } catch (err) {
//           setError(`Error reading file for Person ${i}.`);
//           return;
//         }
//       }
//       persons.push({
//         personId: `person-${i}-${Date.now()}`,
//         name: personName,
//         governmentId, // This is the data URL
//       });
//     }

//     // Process kids fields
//     let kids = [];
//     for (let i = 1; i <= kidFields; i++) {
//       const kidName = form[`child${i}-name`].value.trim();
//       const kidAge = Number(form[`child${i}-age`].value);
//       kids.push({
//         kidId: `kid-${i}-${Date.now()}`,
//         name: kidName,
//         age: kidAge,
//       });
//     }

//     // Build final data object
//     // const data = {
//     //   fullName,
//     //   contact,
//     //   email: emailAddress,
//     //   totalPersons: personFields,
//     //   totalKids: kidFields,
//     //   persons,
//     //   kids,
//     //   timestamp: new Date().toISOString(),
//     // };

//     const data = {
//       fullName,
//       contact,
//       email: emailAddress,
//       totalPersons: maxPeople, // use the dropdown value
//       totalKids: maxKids,      // use the dropdown value
//       persons,
//       kids,
//       timestamp: new Date().toISOString(),
//     };

//     try {
//       const response = await fetch("/api/family-checkin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to save family check-in.");
//       }
//       alert("Family check-in submitted successfully!");
//       form.reset();
//       // Optionally reset state variables if needed
//     } catch (error) {
//       console.error("Error during family check-in:", error);
//       setError(error.message || "Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <section className="checkin-section">
//       <div className="container ptb-50">
//         <h1 className="check-heading">Skip the Wait, Check-In Now</h1>
//         <p className="check-para">
//           Check-in early and enjoy your trip stress-free!
//         </p>
//         {error && <p className="error">{error}</p>}
//         <div className="checkinbox">
//           <div className="container">
//             <div className="form-container">
//               <form onSubmit={handleSubmit}>
//                 <div className="row mb-3">
//                   <div className="col">
//                     <label htmlFor="fullName" className="form-label">
//                       Full Name
//                     </label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="fullName"
//                       name="fullName"
//                       required
//                     />
//                   </div>
//                   <div className="col p-relative">
//                     <label htmlFor="person1-contact" className="form-label">
//                       Contact
//                     </label>
//                     <span className="country-num">+91 </span>
//                     <input
//                       type="text"
//                       className="form-control pl-20"
//                       id="person1-contact"
//                       name="person1-contact"
//                       maxLength={10}
//                       required

//                     />
//                   </div>
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="emailAddress" className="form-label">
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     id="emailAddress"
//                     name="emailAddress"
//                     required

//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="selectPeople" className="form-label">
//                     No. of People
//                   </label>
//                   <select
//                     className="form-select"
//                     id="selectPeople"
//                     required
//                     value={maxPeople}
//                     onChange={handlePeopleChange}
//                   >
//                     {Array.from({ length: 10 }, (_, i) => (
//                       <option key={i + 1} value={i + 1}>
//                         {i + 1 < 10 ? "0" + (i + 1) : i + 1}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Render person fields */}
//                 {renderPersonFields()}
//                 {personFields < maxPeople && (
//                   <button
//                     type="button"
//                     className="btn btn-outline-secondary mb-3"
//                     onClick={addPersonField}
//                     required
//                   >
//                     + Add Person
//                   </button>
//                 )}

//               <div className="mb-3">
//                 <label htmlFor="selectKids" className="form-label">
//                   No. of Kids
//                 </label>
//                 <select
//                   className="form-select"
//                   required
//                   id="selectKids"
//                   value={maxKids}
//                   onChange={handleKidsChange}
//                 >
//                   {Array.from({ length: 10 }, (_, i) => (
//                     <option key={i} value={i}>
//                       {i < 10 ? "0" + i : i}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//                 {/* Render kid fields */}
//                 {renderKidFields()}
//                 {kidFields < maxKids && maxKids > 0 && (
//                   <button
//                     type="button"
//                     className="btn btn-outline-secondary mb-3"
//                     required
//                     onClick={addKidField}
//                   >
//                     + Add Child
//                   </button>
//                 )}

//                 <div className="mt-4">
//                   <button type="submit" className="btn btn-submit w-100">
//                     Submit
//                   </button>
//                 </div>
//               </form>
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

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
export default function CheckInFamily() {
  const [maxPeople, setMaxPeople] = useState(1);
  const [personFields, setPersonFields] = useState(1);
  const [maxKids, setMaxKids] = useState(0);
  const [kidFields, setKidFields] = useState(0);
  const [error, setError] = useState("");

  const [activePerson, setActivePerson] = useState(null);
  const [activeKid, setActiveKid] = useState(null);
 

  const [expandedFields, setExpandedFields] = useState({
    people: { 1: true }, // First person is always visible
    kids: {},
  });

  const addPerson = () => {
    setPersonFields((prev) => prev + 1);
  };

  const addKid = () => {
    setKidFields((prev) => prev + 1);
  };

  // Update expanded fields when personFields or kidFields change
  useEffect(() => {
    setExpandedFields((prev) => ({
      ...prev,
      people: Array.from({ length: personFields }, (_, i) => i + 1).reduce(
        (acc, num) => {
          acc[num] = true; // Ensure all persons are visible
          return acc;
        },
        {}
      ),
    }));
  }, [personFields]);

  useEffect(() => {
    setExpandedFields((prev) => ({
      ...prev,
      kids: Array.from({ length: kidFields }, (_, i) => i + 1).reduce(
        (acc, num) => {
          acc[num] = true; // Ensure all kids are visible
          return acc;
        },
        {}
      ),
    }));
  }, [kidFields]);

  const handleToggleExpand = (type, index) => {
    setExpandedFields((prev) => ({
      ...prev,
      [type]: { ...prev[type], [index]: !prev[type][index] },
    }));
  };

  const handleFieldFocus = (type, index) => {
    if (type === "people") {
      setActivePerson(index);
    } else {
      setActiveKid(index);
    }
  };

  // Handle dropdown change for number of people
  const handlePeopleChange = (e) => {
    setMaxPeople(Number(e.target.value));
  };

  // Handle dropdown change for number of kids
  const handleKidsChange = (e) => {
    setMaxKids(Number(e.target.value));
  };

  // Add another person field if not reached the max
  const addPersonField = () => {
    if (personFields < maxPeople) {
      setPersonFields(personFields + 1);
    }
  };

  // Add another kid field if not reached the max
  const addKidField = () => {
    if (kidFields < maxKids) {
      setKidFields(kidFields + 1);
    }
  };

  
  const renderPersonFields = () => {
    let fields = [];
    for (let i = 1; i <= personFields; i++) {
      fields.push(
        <div key={`person-${i}`} className="person-field mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">Person {i}</h5>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() =>
                setExpandedFields((prev) => ({
                  ...prev,
                  people: { ...prev.people, [i]: !prev.people[i] },
                }))
              }
            >
              <i
                className={
                  expandedFields.people[i]
                    ? "fa-solid fa-eye"
                    : "fa-solid fa-eye-slash"
                }
              ></i>
            </button>
          </div>
          {expandedFields.people[i] && (
            <div className="person1">
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor={`person${i}-name`} className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id={`person${i}-name`}
                    name={`person${i}-name`}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor={`uploadId-${i}`} className="form-label">
                    Upload Government ID (400KB)
                  </label>
                  <input
                    type="file"
                    className="form-control p-id"
                    id={`uploadId-${i}`}
                    name={`uploadId-${i}`}
                    accept=".jpg, .jpeg, .pdf"
                    required
                  />
                  <div className="form-text">
                    *This Doc. will be used for check-in only.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    return fields;
  };
  

  const renderKidFields = () => {
    let fields = [];
    for (let i = 1; i <= kidFields; i++) {
      fields.push(
        <div key={`kid-${i}`} className="kid-field mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">Child {i}</h5>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() =>
                setExpandedFields((prev) => ({
                  ...prev,
                  kids: { ...prev.kids, [i]: !prev.kids[i] },
                }))
              }
            >
              <i
                className={
                  expandedFields.kids[i]
                    ? "fa-solid fa-eye"
                    : "fa-solid fa-eye-slash"
                }
              ></i>
            </button>
          </div>
          {expandedFields.kids[i] && (
            <div className="person1">
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor={`child${i}-name`} className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id={`child${i}-name`}
                    name={`child${i}-name`}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor={`child${i}-age`} className="form-label">
                    Age
                  </label>
                  <select
                    className="form-select"
                    id={`child${i}-age`}
                    name={`child${i}-age`}
                    required
                  >
                    <option value="">Select Age</option>
                    <option value="1">01</option>
                    <option value="2">02</option>
                    <option value="3">03</option>
                    <option value="4">04</option>
                    <option value="5">05</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    return fields;
  };

  // Helper to read a file as Data URL (returns a Promise)
  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous errors

    const form = e.target;
    const fullName = form.fullName.value.trim();
    const contact = form["person1-contact"].value.trim();
    const emailAddress = form.emailAddress.value.trim();

    if (!fullName || !contact || !emailAddress) {
      toast.error("Please fill in all main fields.");
      return;
    }

    let persons = [];
    for (let i = 1; i <= maxPeople; i++) {
      const personName = form[`person${i}-name`]?.value.trim();
      const fileInput = form[`uploadId-${i}`];

      if (!personName) {
        toast.error(`Please enter the full name for Person ${i}.`);
        return;
      }

      if (!fileInput || fileInput.files.length === 0) {
        toast.error(`Please upload an ID for Person ${i}.`);
        return;
      }

      let governmentId = "";
      const file = fileInput.files[0];
      if (file.size > 400 * 1024) {
        toast.error(`File for Person ${i} must be under 400KB.`);
        return;
      }
      try {
        governmentId = await readFileAsDataURL(file);
      } catch (err) {
        toast.error(`Error reading file for Person ${i}.`);
        return;
      }

      persons.push({
        personId: `person-${i}-${Date.now()}`,
        name: personName,
        governmentId,
      });
    }

    let kids = [];

    // Ensure kids selection is made
    if (maxKids > 0) {
      for (let i = 1; i <= maxKids; i++) {
        const kidName = form[`child${i}-name`]?.value.trim();
        const kidAge = form[`child${i}-age`]?.value;

        if (!kidName) {
          toast.error(`Please enter the full name for Child ${i}.`);
          return;
        }

        if (!kidAge) {
          toast.error(`Please select an age for Child ${i}.`);
          return;
        }

        kids.push({
          kidId: `kid-${i}-${Date.now()}`,
          name: kidName,
          age: Number(kidAge),
        });
      }
    } else {
      toast.error("Please select the number of kids.");
      return;
    }

    const data = {
      fullName,
      contact,
      email: emailAddress,
      totalPersons: maxPeople, // Ensure these values persist
      totalKids: maxKids,
      persons,
      kids,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/family-checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save family check-in.");
      }

      toast.success("Family check-in submitted successfully!");

       // Reload the page after successful submission
    setTimeout(() => {
      window.location.reload();
    }, 2000); // Delay reload slightly for better user experience

    
      form.reset(); // Reset form only after successful submission
    } catch (error) {
      console.error("Error during family check-in:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="checkin-section">
      <div className="container ptb-50">
        <h1 className="check-heading">Skip the Wait, Check-In Now</h1>
        <p className="check-para">
          Check-in early and enjoy your trip stress-free!
        </p>

        {error && <p className="error">{error}</p>}
        <div className="checkinbox">
          <div className="container">
            <div className="form-container">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col">
                    <label htmlFor="fullName" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="fullName"
                      name="fullName"
                      required
                    />
                  </div>
                  <div className="col p-relative pl-0">
                    <label htmlFor="person1-contact" className="form-label">
                      Contact
                    </label>
                    <span className="country-num">+91 </span>
                    <input
                      type="text"
                      className="form-control pl-20"
                      id="person1-contact"
                      name="person1-contact"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="emailAddress" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailAddress"
                    name="emailAddress"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="selectPeople" className="form-label">
                    No. of People
                  </label>
                  <select
                    className="form-select"
                    id="selectPeople"
                    required
                    value={maxPeople}
                    onChange={handlePeopleChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>

                {/* Render person fields */}
                {renderPersonFields()}
                {personFields < maxPeople && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary mb-3"
                    onClick={addPersonField}
                    required
                  >
                    + Add Person
                  </button>
                )}

                <div className="mb-3">
                  <label htmlFor="selectKids" className="form-label">
                    No. of Kids
                  </label>
                  <select
                    className="form-select"
                    required
                    id="selectKids"
                    value={maxKids}
                    onChange={handleKidsChange}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>

                {/* Render kid fields */}
                {renderKidFields()}
                {kidFields < maxKids && maxKids > 0 && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary mb-3"
                    required
                    onClick={addKidField}
                  >
                    + Add Child
                  </button>
                )}

                <div className="mt-4">
                  <button type="submit" className="btn btn-submit w-100">
                    Submit
                  </button>
                </div>

                <ToastContainer position="top-right" autoClose={3000} />
              </form>
            </div>
          </div>
        </div>
        <div className="checkin-footer">
          <p>Let’s Stay in Touch!</p>
          <ul className="social-list-icons">
            <li>
              <Link
                href="https://www.facebook.com/TourWatchout/"
                target="_blank"
              >
                <img
                  src="./assets/images/icons/facebook.png"
                  alt="Facebook Icon"
                />
              </Link>
            </li>
            <li>
              <Link
                href="https://www.instagram.com/tourwatchout/"
                target="_blank"
              >
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
              <Link
                href="https://www.youtube.com/@Tourwatchout"
                target="_blank"
              >
                <img
                  src="./assets/images/icons/youtube.png"
                  alt="Youtube Icon"
                />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
