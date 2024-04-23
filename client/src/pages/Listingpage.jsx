import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import placeholderImage from "../../assets/car2.jpg";

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const ListingCard = ({ car, handleAddToCart, cartItems }) => {
  const formattedAvailableFrom = formatDate(car.availableFrom);
  const formattedAvailableTo = formatDate(car.availableTo);

  const isInCart =
    cartItems &&
    cartItems[0] &&
    cartItems[0].items &&
    cartItems[0].items.some((item) => item._id === car._id);

  const handleClick = async () => {
    console.log(cartItems)
    handleAddToCart(car)
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 flex items-center">
          <div>{`${car.carMake} ${car.carModel}`}</div>
          {isInCart && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-500 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <div className="h-48 overflow-hidden relative rounded-t-md">
        <img
          className="object-cover w-full h-full border border-gray-300 rounded-b-md"
          src={car.image_url && car.image_url[0] ? car.image_url[0] : placeholderImage}
          alt={`${car.carMake} ${car.carModel}`}
        />
      </div>
      <div className="px-6 py-4">
        <ul className="list-none">
          <li className="mb-1 font-roboto"><b>Year:  </b>{car.year}</li>
          <li className="mb-1 font-roboto"><b>Mileage:  </b>{car.mileage}</li>
          <li className="mb-1 font-roboto"><b>Transmission:  </b>{car.transmission}</li>
          <li className="mb-1 font-roboto"><b>Fuel Type:  </b>{car.fuelType}</li>
          <li className="mb-1 font-roboto"><b>Seats:  </b>{car.seats}</li>
          <li className="mb-1 font-roboto"><b>Price Per Day:  </b>${car.pricePerDay}</li>
          <li className="mb-1 font-roboto"><b>Available From:  </b>{formattedAvailableFrom}</li>
          <li className="mb-1 font-roboto"><b>Available To:  </b>{formattedAvailableTo}</li>
        </ul>
      </div>
      <div className="px-6 py-4 flex justify-between items-center space-x-4">
        <Link
          to={`/itemLocation?lat=${car.location.lat}&lng=${car.location.lng}`}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          View Item Location
        </Link>
        <Link
          to={`/carDetails/${car._id}`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          View Details
        </Link>
        <button
          onClick={handleClick}
          disabled={isInCart}
          className={`${
            isInCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'
          } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
        >
          {isInCart ? 'Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};



const FilterDropdown = ({ label, options, selectedOption, onChange }) => {
  return (
    <div className="mb-4">
      <div className="relative">
        {/* <label>{label}</label> */}
        <select
          className="appearance-none w-full border border-gray-300 rounded px-3 py-2 pr-10"
          value={selectedOption}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{label}</option>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default function Listingpage({
  handleAddToCart,
  cartItems,
  setCartItems,
}) {
  // Initialize state with empty array or example data if you want to show something initially

  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({}); // State to hold filter values
  // const { currUser } = useSelector((state) => state.user_mod);
  const { currUser, clientSecret } = useSelector((state) => state.user_mod);
  const userId = currUser ? currUser.data.username : null;
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCartItems = async () => {
    try {
      console.log(currUser?.data?.token);
      const response = await fetch(
        `/api/v1/shoppingCart/get_Shoppingcart/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currUser?.data?.token}`,
          },
        }
      );
      const data = await response.json();
      setCartItems(data.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCartItems();
    }
  }, []);

  // fetchCartItems();

  const handleSearch = async () => {
    console.log(searchQuery);

    if (searchQuery.trim() !== "") {
      try {
        const response = await fetch(
          `/api/v1/cars/searchCars?query=${searchQuery.trim()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currUser?.data?.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setCars(data.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("Failed to fetch search results. Please try again later.");
      } finally {
        setIsLoading(false); // End loading
      }
    }
  };

  useEffect(() => {
    async function fetchListings() {
      setIsLoading(true); // Begin loading
      setError(null); // Reset error state
      try {
        const response = await fetch("/api/v1/cars/getAllCarsListings", {
          method: "GET", // Method is optional if you are making a GET request, included here for clarity
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currUser?.data?.token}`, // Uncomment and replace if you need to send an authorization token
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setCars(data.data);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setError("Failed to fetch listings. Please try again later."); // Set error message
      } finally {
        setIsLoading(false); // End loading
      }
    }

    fetchListings();
  }, []);

  useEffect(() => {
    async function fetchFilters() {
      setIsLoading(true);
      setError(null);
      try {
        const url = `/api/v1/cars/filterCars?${new URLSearchParams(
          filters
        ).toString()}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currUser?.data?.token}`,
            // You can add authorization token if needed
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setCars(data.data);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setError("Failed to fetch listings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchFilters();
  }, [filters]); // Run whenever filters change

  const handleFilterChange = (name, value) => {
    if (value.includes("-")) {
      const [n1, n2] = name.split("-").map(String);
      const [minValue, maxValue] = value.split("-").map(Number);
      // const yearsInRange = Array.from({ length: maxValue - minValue + 1 }, (_, i) => minValue + i);
      setFilters((prevFilters) => ({
        ...prevFilters,
        [n1]: minValue,
        [n2]: maxValue,
      }));
    } else if (name.includes("-")) {
      const [n1, n2] = name.split("-").map(String);
      setFilters((prevFilters) => ({
        ...prevFilters,
        [n1]: 0,
        [n2]: 10000000,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: [value],
      }));
    }
  };

return (
  <main className="container mx-auto p-4 justify-center bg-black">
    <form className="flex items-center">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-400 py-2 px-4 rounded-l-lg focus:outline-none"
        />
        <button
          type="button"
          className="text-white bg-black py-2 px-4 rounded-r-lg"
          onClick={handleSearch}
        >
          <FaSearch />
        </button>
      </form>
    <h1 className="text-3xl text-white font-bold text-center mb-6">
      AVAILABLE CARS FOR RENT
    </h1>

      <Link
        to={`/Cart`}
        className="bg-red-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded ml-4 focus:outline-none focus:shadow-outline"
        style={{ left: "1545px", top: "125px", position: "absolute" }}
      >
        View Cart
      </Link>

      <div className="absolute top-50">
        <FilterDropdown
          label="All Cars"
          options={[
            "Toyota",
            "honda",
            "Ford",
            "Mercedes-Benz",
            "Audi",
            "BMW",
            "Tesla",
            "Lexus",
            "Chevrolet",
          ]}
          onChange={(value) => handleFilterChange("carMake", value)}
        />
      </div>

    <h1 className="text-3xl font-bold text-center mb-6 text-white" style={{ left: "1345px", top: "325px", position: "absolute" }}>
      More Filters
    </h1>
      <h1
        className="text-3xl font-bold text-center mb-6"
        style={{ left: "1345px", top: "325px", position: "absolute" }}
      >
        More Filters
      </h1>

      <div
        className="absolute top-50"
        style={{ left: "1355px", top: "400px", position: "absolute" }}
      >
        <FilterDropdown
          label="Year"
          options={["2010-2015", "2015-2020", "2020-2025", "2025-2030"]}
          onChange={(value) => handleFilterChange("minYear-maxYear", value)}
        />
      </div>

      <div
        className="absolute top-50"
        style={{ left: "1355px", top: "450px", position: "absolute" }}
      >
        <FilterDropdown
          label="Mileage"
          options={[]}
          onChange={(value) =>
            handleFilterChange("minMileage-maxMileage", value)
          }
        />
      </div>

      <div
        className="absolute top-50"
        style={{ left: "1355px", top: "500px", position: "absolute" }}
      >
        <FilterDropdown
          label="Transmission"
          options={["Manual", "Automatic"]}
          onChange={(value) => handleFilterChange("transmission", value)}
        />
      </div>

      <div
        className="absolute top-50"
        style={{ left: "1355px", top: "550px", position: "absolute" }}
      >
        <FilterDropdown
          label="Fueltype"
          options={["Diesel", "Gasoline", "Electric", "Hybrid"]}
          onChange={(value) => handleFilterChange("fuelType", value)}
        />
      </div>

      <div
        className="absolute top-50"
        style={{ left: "1355px", top: "600px", position: "absolute" }}
      >
        <FilterDropdown
          label="Seats"
          options={["2-seater", "3-seater", "4-seater", "5-seater", "6-seater"]}
          onChange={(value) => handleFilterChange("minSeats-maxSeats", value)}
        />
      </div>

      <div
        className="absolute top-50"
        style={{ left: "1355px", top: "650px", position: "absolute" }}
      >
        <FilterDropdown
          label="Price per day (USD)"
          options={["40-50", "50-60", "60-70", "70-80", "80-90", "90-100"]}
          onChange={(value) =>
            handleFilterChange("minPricePerDay-maxPricePerDay", value)
          }
        />
      </div>
    
    <div className="text-center mb-4">
      {currUser ? (
        <Link
          to="/Createlisting"
          className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300"
        >
          POST YOUR CAR
        </Link>
      ) : (
        <Link
          to="/sign-in"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300"
        >
          SIGN IN TO POST YOUR CAR
        </Link>
      )}
    </div>
    <section className="flex flex-wrap -mx-4">
      {isLoading ? (
        <p className="mx-auto">Loading...</p>
      ) : cars.length > 0 ? (
        cars.map((car) => (
            <ListingCard key={`${car.id}-${Math.random()}`} car={car} handleAddToCart={handleAddToCart} cartItems={cartItems} />
          ))
        ) : (
          <p className="mx-auto">No listings available.</p>
        )}
      </section>
    </main>
  );
}
