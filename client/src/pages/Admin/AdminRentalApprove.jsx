import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AdminListingCard from "../../components/AdminListingCard";
import ComplaintListingCard from "../../components/ComplaintListingCard";
import { nightStyles } from "../../constants/constants";

export default function CRUDListings() {
  const [carsForApproval, setCarsForApproval] = useState([]);
  const [complaintsFiled, setComplaintsFiled] = useState([]);
  const [mostComplainedCustomer, setMostComplainedCustomer] = useState({});
  const [mostComplainedOwner, setMostComplainedOwner] = useState({});
  const [mostRentedItem, setMostRentedItem] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currUser } = useSelector((state) => state.user_mod);
  

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch available cars for approval
        const approvalResponse = await fetch(
          "/api/v1/cars/getAllCarsListingsAdmin",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currUser?.data?.token}`,
            },
          }
        );
        if (!approvalResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const approvalData = await approvalResponse.json();
        setCarsForApproval(approvalData.data);

        // Fetch complaints filed
        const complaintsResponse = await fetch(
          "/api/v1/ticketingSystem/adminGetAllComplaints",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currUser?.data?.token}`,
            },
          }
        );
        const customerComplaintResponse = await fetch("/api/v1/ticketingSystem/adminCustomerWithMostComplaints", {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${currUser?.data?.token}` },
        });
        const ownerComplaintResponse = await fetch("/api/v1/ticketingSystem/adminCustomerWithMostComplaints", {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${currUser?.data?.token}` },
        });
        const mostRentedResponse = await fetch("/api/v1/rent/mostRentedItem", {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${currUser?.data?.token}` },
        });
        if (!complaintsResponse.ok || !customerComplaintResponse.ok || !ownerComplaintResponse.ok || !mostRentedResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const complaintsData = await complaintsResponse.json();
        const customerComplaintData = await customerComplaintResponse.json();
        const ownerComplaintData = await ownerComplaintResponse.json();
        const mostRentedData = await mostRentedResponse.json();
        setComplaintsFiled(complaintsData.data);
        setMostComplainedCustomer(customerComplaintData.data);
        setMostComplainedOwner(ownerComplaintData.data);
        setMostRentedItem(mostRentedData.data);
        console.log("complaints", complaintsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleRentalApproval = async (carId) => {
    try {
      const response = await fetch(`/api/v1/cars/adminApprove/${carId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currUser?.data?.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to approve the car listing"
        );
      }

      // Functional update to remove the deleted item from the state
      setCarsForApproval((currentCars) =>
        currentCars.filter((car) => car._id !== carId)
      );
    } catch (error) {
      console.error("Error approving listing:", error);
    }
  };

  const handleComplaintApprove = async (commentId) => {
    try {
      const response = await fetch(`/api/v1/ticketingSystem/updateComplaintResolveStatus/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currUser?.data?.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to approve the car listing"
        );
      }

      // Functional update to remove the deleted item from the state
      setComplaintsFiled((currentComplaints) =>
        currentComplaints.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Error approving listing:", error);
    }
  };

  const handleRentalDeny = async (carId) => {
    try {
      const response = await fetch(`/api/v1/cars/deleteCarListings/${carId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currUser?.data?.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to delete the car listing"
        );
      }

      // Functional update to remove the deleted item from the state
      setCarsForApproval((currentCars) =>
        currentCars.filter((car) => car._id !== carId)
      );
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  const handleComplaintDeny = async (commentId) => {
    try {
      const response = await fetch(`/api/v1/ticketingSystem/deleteComplaint/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currUser?.data?.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to delete the car listing"
        );
      }


      setComplaintsFiled((currentComplaints) =>
        currentComplaints.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  const CustomerComplaintCard = ({ customer }) => {
    if (!customer) return <p className="text-center">No data available.</p>;
    return (
      <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-all">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Customer with Most Complaints</h3>
        <p><strong>Username:</strong> {customer.username}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Complaints:</strong> {customer.complaint_frequency}</p>
      </div>
    );
  };

  const OwnerComplaintCard = ({ owner }) => {
    if (!owner) return <p className="text-center">No data available.</p>;
    return (
      <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-all">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Owner with Most Complaints</h3>
        <p><strong>Username:</strong> {owner.username}</p>
        <p><strong>Email:</strong> {owner.email}</p>
        <p><strong>Complaints:</strong> {owner.complaint_frequency}</p>
      </div>
    );
  };

  const RentalInfoCard = ({ item }) => {
    if (!item) return <p className="text-center">No data available.</p>;
    return (
      <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-all">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Most Rented Item</h3>
        {item.itemdetails ? (
          <>
            <p><strong> Car Id:</strong> {item.itemdetails._id}</p>
            <p><strong>Make:</strong> {item.itemdetails.carMake}</p>
            <p><strong>Model:</strong> {item.itemdetails.carModel}</p>
            <p><strong>Year:</strong> {item.itemdetails.year}</p>
            <p><strong>Mileage:</strong> {item.itemdetails.mileage}</p>
            <p><strong>Transmission:</strong> {item.itemdetails.transmission}</p>
            <p><strong>Fuel Type:</strong> {item.itemdetails.fuelType}</p>
            <p><strong>Rental Count:</strong> {item.item_frequency}</p>
          </>
        ) : (
          <p>Details not available.</p>
        )}
      </div>
    );
  };



  return (
    <main className="container mx-auto px-4 py-8" style={nightStyles}>
      {currUser?.data?.username === "admin" && (
        <>
          <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg mb-8">
            <h1 className="text-3xl text-white font-bold text-center mb-8">
              Dashboard Overview
            </h1>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Name/ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">

                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Customer with Most Complaints
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mostComplainedCustomer.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mostComplainedCustomer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mostComplainedCustomer.complaint_frequency}
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Owner with Most Complaints
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mostComplainedOwner.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mostComplainedOwner.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mostComplainedOwner.complaint_frequency}
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Most Rented Item
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mostRentedItem.itemdetails?.carMake ?? 'N/A'} {mostRentedItem.itemdetails?.carModel ?? ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Year: {mostRentedItem.itemdetails?.year ?? 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mostRentedItem.item_frequency ?? 'N/A'}
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          <section className="mb-12">

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <CustomerComplaintCard customer={mostComplainedCustomer} />
              <OwnerComplaintCard owner={mostComplainedOwner} />
              <RentalInfoCard item={mostRentedItem} />
            </div>
          </section>

          <section className="mb-12">
            <h1 className="text-3xl text-white font-bold text-center mb-8">
              Available Cars for Approval
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <p className="text-center col-span-full">Loading...</p>
              ) : carsForApproval.length > 0 ? (
                carsForApproval.map((car) => (
                  <AdminListingCard
                    key={car._id}
                    car={car}
                    onApproval={() => handleRentalApproval(car._id)}
                    onDenial={() => handleRentalDeny(car._id)}
                  />
                ))
              ) : (
                <p className="text-center text-white col-span-full">No available cars for approval.</p>
              )}
            </div>
          </section>

          <section className="mb-12">
            <h1 className="text-3xl text-white font-bold text-center mb-8">
              Complaints Filed
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <p className="text-center col-span-full">Loading...</p>
              ) : complaintsFiled.length > 0 ? (
                complaintsFiled.map((complaint) => (
                  <ComplaintListingCard
                    key={complaint._id}
                    complaint={complaint}
                    onApproval={() => handleComplaintApprove(complaint._id)}
                    onDenial={() => handleComplaintDeny(complaint._id)}
                  />
                ))
              ) : (
                <p className="text-center text-white col-span-full">No complaints filed.</p>
              )}
            </div>
          </section>



        </>
      )}
    </main>
  );

}