import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Createlisting from "./pages/Createlisting";
import Listingpage from "./pages/Listingpage";
import { Navbar } from "./components/Navbar";
import styles from "./App.module.css";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PrivateRoute from "./components/RoutingFolder/PrivateRoute";
import AdminRentalApprove from "./pages/Admin/AdminRentalApprove";
import ItemLocation from "./components/MapComponents/ItemLocation";
import CarDetailsPage from "./pages/CarDetailsPage";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./pages/Payment/CheckoutForm";
import { useDispatch, useSelector } from "react-redux";
import { update } from "firebase/database";
import { arrayUnion } from "firebase/firestore";
import Cart from "./pages/Cart";
import PaymentSucess from "./components/Payment/PaymentSuccess";
import PaymentFailure from "./components/Payment/PaymentFailure";
import useCart from "./hooks/useCart";


const stripePromise = loadStripe(
  "pk_test_51Oy4XrKDZmp8eDSbYQN6Fam0JxugYee73NJNswgl4U5QrS20yiYAYDseStP3Orj0YnIMFjWWMwWX3r5i0qBE1wVX00FJbX1o30"
);

function App() {
  const { cartItems, setCartItems, handleAddToCart, clientSecret, userId } = useCart();
  const { currUser } = useSelector((state) => state.user_mod);


  const appearance = {
    theme: "stripe",
    fontSize: "16px",
    fontFamily: "Arial, sans-serif",
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className={styles.App}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/Createlisting" element={<Createlisting />} />
          <Route path="/Listingpage" element={<Listingpage handleAddToCart={handleAddToCart} cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/paymentSuccess" element={<PaymentSucess/>} />
          <Route path="/paymentFailure" element={<PaymentFailure/>} />
          <Route path="/Cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route element={<PrivateRoute />}>
            <Route path="/modify-listing" element={<AdminRentalApprove />} />
          </Route>
          <Route path="/itemLocation" element={<ItemLocation />} />
          <Route path="/carDetails/:carId" element={<CarDetailsPage />} />
          {clientSecret && (
            <Route 
              path="/checkout"
              element={
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm />
                </Elements>
              }
            />
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
