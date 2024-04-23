import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector} from "react-redux";
import { Rating } from "@mui/material";
import { nightStyles } from "../constants/constants";
import { loadStripe } from "@stripe/stripe-js";
import Chatbot from "../components/chatbot";


function CarDetailsPage() {
  const { currUser } = useSelector((state) => state.user_mod);
  const { carId } = useParams();
  const [carDetails, setCarDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewFormData, setReviewFormData] = useState({
    rating: "",
    review: "",
  });
  const [rating, setRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rentalDays, setRentalDays] = useState(1);


  useEffect(() => {
    const fetchCarDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/v1/cars/getSingleCarListings/${carId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currUser?.data?.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Could not fetch car details");
        }
        const data = await response.json();
        setCarDetails(data.data);
        setSelectedImage(data.data.image_url[0]);
        fetchReviews();
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `/api/v1/reviews/getallCarReviews/${carId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currUser?.data?.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Could not fetch reviews");
        }
        const reviewData = await response.json();
        setReviews(reviewData.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCarDetails();
  }, [carId, currUser?.data?.token]);

  

  const postReview = async (reviewData) => {
    try {
      const response = await fetch(`/api/v1/reviews/createReview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currUser?.data?.token}`,
        },
        body: JSON.stringify(reviewData),
      });
      if (!response.ok) {
        throw new Error("Failed to post review");
      }
      fetchReviews();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePayment = async () => {
    if (currUser && currUser.data && currUser.data.token) {
      try {
        const stripe = await loadStripe(
          "pk_test_51Oy4XrKDZmp8eDSbYQN6Fam0JxugYee73NJNswgl4U5QrS20yiYAYDseStP3Orj0YnIMFjWWMwWX3r5i0qBE1wVX00FJbX1o30"
        );

        const stripeRes = await fetch(
          "http://localhost:5173/api/v1/rent/stripePayment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currUser.data.token}`,
            },
            body: JSON.stringify({
                duration: rentalDays,
                cost: carDetails.pricePerDay,
                item_id: carDetails._id,
            }),
          }
        );
        if (!stripeRes.ok) {
          throw new Error(`Failed to fetch client secret: ${stripeRes.status}`);
        }

        const session = await stripeRes.json();
        console.log("sesss", session);
        const result = stripe.redirectToCheckout({
          sessionId:session.data.id
        });

      } catch (error) {
        console.error("Error fetching client secret:", error);
      }
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ratings: rating,
      review: reviewFormData.review,
      item_id: carId,
    };

    await postReview(dataToSubmit);
    setReviewFormData({ rating: "", review: "" });
  };

  if (isLoading) {
    return <div className="text-center text-xl mt-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-xl text-red-500 mt-10">
        Error: {error}
      </div>
    );
  }

  if (!carDetails) {
    return (
      <div className="text-center text-xl text-gray-500 mt-10">
        Car not found
      </div>
    );
  }

  const mapLink = `/itemLocation?lat=${carDetails.location.lat}&lng=${carDetails.location.lng}`;
  const backLink = "/Listingpage";

  return (
    <div className="min-h-screen bg-customcolor-100 py-10" style={nightStyles}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between mb-6">
        <Link
  to={backLink}
  className="bg-white text-black py-2 px-8 transition duration-300 rounded-full border border-black hover:bg-gray-300"
  style={{ display: 'inline-block' }}
>
  ← Go back
</Link>

          <Link
            to={mapLink}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-8 rounded-full transition ease-in-out duration-300"
          >
            View on Map
          </Link>
        </div>
        <div className="md:flex md:-mx-4">
          {/* Column for Car Image Gallery and Reviews */}
          <div className="md:w-2/3 px-4 mb-6">
            <div className="bg-white shadow rounded-lg mb-6">
              {/* Car Image */}
              <div className="text-center p-4 ">
                <img
                  className="inline-block mx-auto h-auto max-w-full rounded-lg"
                  src={selectedImage}
                  alt={`${carDetails.carMake} ${carDetails.carModel}`}
                />
                {/* Thumbnails */}
                <div className="flex justify-center space-x-1 overflow-x-auto py-2">
                  {carDetails.image_url.map((image, index) => (
                    <img
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className="inline-block object-cover rounded-lg cursor-pointer p-1 border-2 border-transparent hover:border-blue-500"
                      src={image}
                      alt={`Thumbnail ${index}`}
                      style={{ width: "100px", height: "75px" }}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Reviews Section */}
            <div className="bg-white shadow rounded-lg p-4">
              <h6 className="text-lg font-semibold mb-4">Reviews</h6>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border-b border-gray-200 mb-4 pb-4"
                  >
                    <Rating name="read-only" value={review.ratings} readOnly />
                    <p className="text-gray-800 mt-2">{review.review}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
          </div>
          {/* Right Column for Car Details and Review Form */}
          <div className="md:w-1/3 px-4">
            {/* Car Details */}
            <div className="bg-white shadow rounded-lg p-4 mb-6">
              <h5 className="text-xl font-semibold mb-2">
                {carDetails.carMake} {carDetails.carModel}
              </h5>
              <dl>
                <p>
                  <strong>Year:</strong> {carDetails.year}
                </p>
                <p>
                  <strong>Mileage:</strong> {carDetails.mileage}
                </p>
                <p>
                  <strong>Transmission:</strong> {carDetails.transmission}
                </p>
                <p>
                  <strong>Fuel Type:</strong> {carDetails.fuelType}
                </p>
                <p>
                  <strong>Seats:</strong> {carDetails.seats}
                </p>
                <p>
                  <strong>Price Per Day:</strong> {carDetails.pricePerDay}
                </p>
                <p>
                  <strong>Available From:</strong>{" "}
                  {new Date(carDetails.availableFrom).toLocaleDateString()}
                </p>
                <p>
                  <strong>Available To:</strong>{" "}
                  {new Date(carDetails.availableTo).toLocaleDateString()}
                </p>
                <dl>
                  {/* Existing car details... */}
                  <p>
                    <strong>Rental Days:</strong>
                    <input
                      type="number"
                      value={rentalDays}
                      onChange={(e) => setRentalDays(e.target.value)}
                      className="ml-2 w-20 border border-gray-300 rounded p-1"
                      min="1"
                    />
                  </p>
                  <p>
                    <strong>Total Cost:</strong> $
                    {carDetails.pricePerDay * rentalDays}
                  </p>
                </dl>
              </dl>
            </div>
            {/* Review Form */}
            <div className="bg-white shadow rounded-lg p-4">
              <h6 className="text-lg font-semibold mb-4">Submit a Review</h6>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={(event, newValue) => {
                      setRating(newValue);
                      setReviewFormData({
                        ...reviewFormData,
                        rating: newValue,
                      });
                    }}
                  />
                </div>
                <div className="mb-4">
                  <textarea
                    id="review"
                    name="review"
                    placeholder="Write your review here"
                    value={reviewFormData.review}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded p-2"
                    rows="4"
                  ></textarea>
                </div>
                <div className="text-right">
                  <button
                    type="submit"
                    className="rounded bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 transition-colors duration-300"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
            <div className="text-right mt-4" style={{ paddingTop: "70px" }}>
              <button
                onClick={handlePayment}
                className="rounded bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 transition-colors duration-300"
              >
                Proceed to Payment
              </button>
              
            </div>
            <Chatbot/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarDetailsPage;
