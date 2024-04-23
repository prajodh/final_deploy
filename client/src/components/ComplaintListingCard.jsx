import React from "react";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" }; // Choose options that suit your needs
  return new Date(dateString).toLocaleDateString(undefined, options); // The 'undefined' argument uses the browser's default locale
};
const ComplaintListingCard = ({ complaint, onDenial, onApproval }) => {

  return (
    <div className="flex flex-col bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="p-1 mb-4">
        <div className="uppercase tracking-wide text-sm text-black font-bold">
          Complaint
        </div>
        <p className="text-gray-700 text-base mt-2">Reported Id: {complaint._id}</p>
        <p className="text-gray-700 text-base">
          Owner Id: {complaint.itemOwnerId}
        </p>
        
        <p className="text-gray-700 text-base">
          Complaint: {complaint.comment}
        </p>
        
      </div>
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => onApproval(complaint._id)}
          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-400 transition duration-300"
        >
          Approve
        </button>
        <button
          onClick={() => onDenial(complaint._id)}
          className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-400 transition duration-300"
        >
          Deny
        </button>
      </div>
    </div>
  );
};

export default ComplaintListingCard;
