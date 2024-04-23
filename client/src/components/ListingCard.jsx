import React from 'react';
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Choose options that suit your needs
  return new Date(dateString).toLocaleDateString(undefined, options); // The 'undefined' argument uses the browser's default locale
};
const ListingCard = ({ car, onDelete, onUpdate }) => {
  const availableFromDate = formatDate(car.availableFrom);
  const availableToDate = formatDate(car.availableTo);

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
        <button onClick={() => onUpdate(car)} className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-400 transition duration-300">
          Edit
        </button>
        <button onClick={() => onDelete(car._id)} className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-400 transition duration-300">
          Delete
        </button>
      </div>
    </div>
  );
};

export default ListingCard;
