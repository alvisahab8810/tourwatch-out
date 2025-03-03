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


import React, { useState } from "react";

export default function CheckInFamily() {
  const [maxPeople, setMaxPeople] = useState(1);
  const [personFields, setPersonFields] = useState(1);
  const [maxKids, setMaxKids] = useState(0);
  const [kidFields, setKidFields] = useState(0);
  const [error, setError] = useState("");

  // Handle dropdown change for number of people
  const handlePeopleChange = (e) => {
    const selected = parseInt(e.target.value, 10);
    setMaxPeople(selected);
    setPersonFields(1);
  };

  // Handle dropdown change for number of kids
  const handleKidsChange = (e) => {
    const selected = parseInt(e.target.value, 10);
    setMaxKids(selected);
    setKidFields(selected > 0 ? 1 : 0);
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

  // Render dynamic person fields with Government ID upload
  const renderPersonFields = () => {
    let fields = [];
    for (let i = 1; i <= personFields; i++) {
      fields.push(
        <div key={`person-${i}`} className="person-field mb-3">
          <h5 className="mb-3 person-heading">Person {i}</h5>
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
                />
              </div>
              <div className="col-md-6">
                <label htmlFor={`uploadId-${i}`} className="form-label">
                  Please upload any Government ID (JPG or PDF, &lt;100KB)
                </label>
                <input
                  type="file"
                  className="form-control p-id"
                  id={`uploadId-${i}`}
                  name={`uploadId-${i}`}
                  accept=".jpg, .jpeg, .pdf"
                />
                <div className="form-text">
                  *This Doc. will be used for check-in purpose only.
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return fields;
  };

  // Render dynamic kid fields
  const renderKidFields = () => {
    let fields = [];
    for (let i = 1; i <= kidFields; i++) {
      fields.push(
        <div key={`kid-${i}`} className="kid-field mb-3">
          <h5 className="mb-3 person-heading">Child {i}</h5>
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

  // Handle form submission for Family Check-In
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const form = e.target;
    const fullName = form.fullName.value.trim();
    const contact = form["person1-contact"].value.trim();
    const emailAddress = form.emailAddress.value.trim();

    // Ensure main fields are filled
    if (!fullName || !contact || !emailAddress) {
      setError("Please fill in all main fields.");
      return;
    }

    // Process persons fields (each may include a file)
    let persons = [];
    for (let i = 1; i <= personFields; i++) {
      const personName = form[`person${i}-name`].value.trim();
      const fileInput = form[`uploadId-${i}`];
      let governmentId = "";
      if (fileInput && fileInput.files[0]) {
        const file = fileInput.files[0];
        if (file.size > 100 * 1024) {
          setError(`File for Person ${i} must be under 100KB.`);
          return;
        }
        try {
          governmentId = await readFileAsDataURL(file);
        } catch (err) {
          setError(`Error reading file for Person ${i}.`);
          return;
        }
      }
      persons.push({
        personId: `person-${i}-${Date.now()}`,
        name: personName,
        governmentId, // This is the data URL
      });
    }

    // Process kids fields
    let kids = [];
    for (let i = 1; i <= kidFields; i++) {
      const kidName = form[`child${i}-name`].value.trim();
      const kidAge = Number(form[`child${i}-age`].value);
      kids.push({
        kidId: `kid-${i}-${Date.now()}`,
        name: kidName,
        age: kidAge,
      });
    }

    // Build final data object
    // const data = {
    //   fullName,
    //   contact,
    //   email: emailAddress,
    //   totalPersons: personFields,
    //   totalKids: kidFields,
    //   persons,
    //   kids,
    //   timestamp: new Date().toISOString(),
    // };



    const data = {
      fullName,
      contact,
      email: emailAddress,
      totalPersons: maxPeople, // use the dropdown value
      totalKids: maxKids,      // use the dropdown value
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
      alert("Family check-in submitted successfully!");
      form.reset();
      // Optionally reset state variables if needed
    } catch (error) {
      console.error("Error during family check-in:", error);
      setError(error.message || "Something went wrong. Please try again.");
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
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="person1-contact" className="form-label">
                      Contact
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="person1-contact"
                      name="person1-contact"
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
                  />
                </div>

                {/* Dropdown for number of people */}
                {/* <div className="mb-3">
                  <label htmlFor="selectPeople" className="form-label">
                    No. of People
                  </label>
                  <select
                    className="form-select"
                    id="selectPeople"
                    onChange={handlePeopleChange}
                  >
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1 < 10 ? "0" + (i + 1) : i + 1}
                      </option>
                    ))}
                  </select>
                </div> */}


                <div className="mb-3">
                  <label htmlFor="selectPeople" className="form-label">
                    No. of People
                  </label>
                  <select
                    className="form-select"
                    id="selectPeople"
                    value={maxPeople}
                    onChange={handlePeopleChange}
                  >
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1 < 10 ? "0" + (i + 1) : i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Render person fields */}
                {renderPersonFields()}
                {personFields < maxPeople && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary mb-3"
                    onClick={addPersonField}
                  >
                    + Add Person
                  </button>
                )}

                {/* Dropdown for number of kids */}
                {/* <div className="mb-3">
                  <label htmlFor="selectKids" className="form-label">
                    No. of Kids
                  </label>
                  <select
                    className="form-select"
                    id="selectKids"
                    onChange={handleKidsChange}
                  >
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i} value={i}>
                        {i < 10 ? "0" + i : i}
                      </option>
                    ))}
                  </select>
                </div> */}


              <div className="mb-3">
                <label htmlFor="selectKids" className="form-label">
                  No. of Kids
                </label>
                <select
                  className="form-select"
                  id="selectKids"
                  value={maxKids}
                  onChange={handleKidsChange}
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={i}>
                      {i < 10 ? "0" + i : i}
                    </option>
                  ))}
                </select>
              </div>

                {/* Render kid fields */}
                {renderKidFields()}
                {kidFields < maxKids && maxKids > 0 && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary mb-3"
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
              </form>
            </div>
          </div>
        </div>
        <div className="checkin-footer">
          <p>Let’s Stay in Touch!</p>
          <ul className="social-list-icons">
            <li>
              <a href="#">
                <img
                  src="./assets/images/icons/whatsapp.png"
                  alt="Whatsapp Icon"
                />
              </a>
            </li>
            <li>
              <a href="#">
                <img
                  src="./assets/images/icons/facebook.png"
                  alt="Facebook Icon"
                />
              </a>
            </li>
            <li>
              <a href="#">
                <img
                  src="./assets/images/icons/insta.png"
                  alt="Instagram Icon"
                />
              </a>
            </li>
            <li>
              <a href="#">
                <img src="./assets/images/icons/web.png" alt="Web Icon" />
              </a>
            </li>
            <li>
              <a href="#">
                <img src="./assets/images/icons/x.png" alt="X Icon" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
