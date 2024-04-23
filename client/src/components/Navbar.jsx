import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo-png.png";
import { useSelector, useDispatch } from "react-redux";
import {
  signOutUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice";

export const Navbar = () => {
  const [menuDraw, setMenuDraw] = useState(false);
  const { currUser } = useSelector((state) => state.user_mod);
  const dispatchAction = useDispatch();

  const handleSignOut = async () => {
    try {
      dispatchAction(signOutUserStart());
      const res = await fetch("/api/v1/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatchAction(deleteUserFailure(data.message));
        return;
      }
      dispatchAction(deleteUserSuccess(data));
    } catch (error) {
      dispatchAction(deleteUserFailure(data.message));
    }
  };

  return (
    <nav className="navbar flex items-center justify-between px-10 py-4 bg-transparent text-white">
      <Link to="/" className="text-2xl font-semibold font-montserrat">
        <img src={logo} alt="Logo" className="h-10 mr-4" style={{ position: 'relative', display: 'inline' }}/>
        HPASS RENTALS
      </Link>

      <div className="md:hidden">
        <button
          className="block text-white hover:text-gray-200 focus:text-gray-200 focus:outline-none"
          onClick={() => setMenuDraw(!menuDraw)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuDraw ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
      <div
        className={`md:flex flex-col md:flex-row md:items-center md:w-auto w-full ${
          menuDraw ? "block" : "hidden"
        }`}
      >
        <ul className="md:flex flex-col md:flex-row md:ml-auto md:mr-0 items-center">
          <li>
            <button className="md:ml-4 text-lg font-bold bg-transparent rounded-md px-4 py-2 transition-colors hover:bg-white hover:text-black">
              <Link to="/">Home</Link>
            </button>
          </li>
          {currUser?.data?.username === "admin" && (
            <li>
              <button className="md:ml-4 text-lg font-bold bg-transparent rounded-md px-4 py-2 transition-colors hover:bg-white hover:text-black">
                <Link to="/modify-listing">Admin Page</Link>
              </button>
            </li>
          )}
          <li>
            <button className="md:ml-4 text-lg font-bold bg-transparent rounded-md px-4 py-2 transition-colors hover:bg-white hover:text-black">
              <Link to="/Listingpage">Browse</Link>
            </button>
          </li>
          {currUser?.data?.username ? (
            <li>
              <button
                onClick={handleSignOut}
                className="md:ml-4 text-lg font-bold bg-red-500 rounded-md px-4 py-2 transition-colors hover:bg-white hover:text-black"
              >
                Sign Out
              </button>
            </li>
          ) : (
            <li>
              <button className="md:ml-4 text-lg font-bold bg-transparent rounded-md px-4 py-2 transition-colors hover:bg-white hover:text-black">
                <Link to="/sign-up">Register</Link>
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};
