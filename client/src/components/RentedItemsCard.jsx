import React, { useState } from 'react';
import { useSelector } from "react-redux";

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const RentedItemsCard = ({ car }) => {
  const [showComplaintPopup, setShowComplaintPopup] = useState(false);
  const [complaintText, setComplaintText] = useState('');
  const { currUser } = useSelector((state) => state.user_mod);

  const availableFromDate = formatDate(car.availableFrom);
  const availableToDate = formatDate(car.availableTo);

  const handleFileComplaint = () => {
    setShowComplaintPopup(true);
  };

  const handleComplaintSubmit = async () => {
    try {
      const res = await fetch("/api/v1/ticketingSystem/launchComplaint/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currUser?.data?.token}`,
        },
        body: JSON.stringify({
          item: car._id,
          comment: complaintText
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit complaint');
      }
      
      setShowComplaintPopup(false);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      // Handle error
    }
  };

  const handleCancel = () => {
    setShowComplaintPopup(false);
  };

  return (
    <div className="flex flex-col bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="p-1 mb-4">
        <div className="uppercase tracking-wide text-sm text-black font-bold">{car.carMake} {car.carModel}</div>
        <p className="text-gray-700 text-base">Year: {car.year}</p>
        <p className="text-gray-700 text-base">Price Per Day: ${car.pricePerDay}</p>
        <p className="text-gray-700 text-base">Available From: {availableFromDate}</p>
        <p className="text-gray-700 text-base">Available To: {availableToDate}</p>
      </div>
      <div className="flex justify-end space-x-3">
        <button onClick={handleFileComplaint} className="bg-violet-700 text-white px-3 py-2 rounded hover:bg-blue-400 transition duration-300">
          File Complaint
        </button>
      </div>

      {showComplaintPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <textarea
              className="w-full h-64 p-2 mb-4 border border-gray-300 rounded"
              placeholder="Enter your complaint here..."
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button onClick={handleCancel} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-300">
                Cancel
              </button>
              <button onClick={handleComplaintSubmit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentedItemsCard;
