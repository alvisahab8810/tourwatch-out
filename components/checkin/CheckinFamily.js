import React from "react";

export default function CheckInFamily() {
  return (
    <>
      <section className="checkin-section">
        <div className="container ptb-50">
          <h1 className="check-heading">Seamless Check-In, Zero Delays</h1>
          <p className="check-para"> Optimize your travel—check-in before arrival.</p>

          <div className="checkinbox">
          <div className="bg-gray-100 p-4 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="num-people" className="block text-gray-700">No. of people</label>
            <select id="num-people" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option>Select Item</option>
            </select>
          </div>
          <div>
            <label htmlFor="num-kids" className="block text-gray-700">No of kids</label>
            <select id="num-kids" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option>Select Item</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email Address</label>
          <input type="email" id="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Person 1</h2>
          <div className="border border-gray-300 p-4 rounded-md">
            <div className="mb-4">
              <label htmlFor="person1-name" className="block text-gray-700">Full Name</label>
              <input type="text" id="person1-name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className="mb-4">
              <label htmlFor="person1-contact" className="block text-gray-700">Contact</label>
              <input type="text" id="person1-contact" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className="mb-4">
              <p className="text-gray-600">Please upload any Government ID, size less than 100KB</p>
              <input type="file" id="person1-id" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
              <p className="text-xs text-gray-500 mt-1">*This Doc. will be used for check-in purpose only</p>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Person 2</h2>
          <div className="border border-gray-300 p-4 rounded-md">
            <div className="mb-4">
              <label htmlFor="person2-name" className="block text-gray-700">Full Name</label>
              <input type="text" id="person2-name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className="mb-4">
              <label htmlFor="person2-contact" className="block text-gray-700">Contact</label>
              <input type="text" id="person2-contact" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className="mb-4">
              <p className="text-gray-600">Please upload any Government ID, size less than 100KB</p>
              <input type="file" id="person2-id" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
              <p className="text-xs text-gray-500 mt-1">*This Doc. will be used for check-in purpose only</p>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Child 1</h2>
          <div className="border border-gray-300 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="child1-name" className="block text-gray-700">Full Name</label>
                <input type="text" id="child1-name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="child1-age" className="block text-gray-700">Child Age</label>
                <select id="child1-age" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option>Select</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Child 2</h2>
          <div className="border border-gray-300 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="child2-name" className="block text-gray-700">Full Name</label>
                <input type="text" id="child2-name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="child2-age" className="block text-gray-700">Child Age</label>
                <select id="child2-age" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option>Select</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <button className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Submit</button>
        </div>
      </div>
    </div>
          </div>
          <div className="checkin-footer">
             <p>Let’s Stay in Touch! </p>
             <ul className="social-list-icons">
                <li><a href="#"><img src="./assets/images/icons/whatsapp.png" alt="Whatsapp Icon"></img></a></li>
                <li><a href="#"><img src="./assets/images/icons/facebook.png" alt="Facebook Icon"></img></a></li>
                <li><a href="#"><img src="./assets/images/icons/insta.png" alt="Instagram Icon"></img></a></li>
                <li><a href="#"><img src="./assets/images/icons/web.png" alt="Web Icon"></img></a></li>
                <li><a href="#"><img src="./assets/images/icons/x.png" alt="X Icon"></img></a></li>
             </ul>
          </div>
        </div>
      </section>
    </>
  );
}
