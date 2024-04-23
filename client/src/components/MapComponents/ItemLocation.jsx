// ItemLocation.jsx

import React from "react";
import { useLocation } from "react-router-dom";
import MapComponent from "./Maps";

export default function ItemLocation() {
  // Access location object from react-router-dom
  const location = useLocation();
  // Parse query parameters from the location search string
  const params = new URLSearchParams(location.search);
  // Get the values of lat and lng from the query parameters
  const lat = parseFloat(params.get("lat"));
  const lng = parseFloat(params.get("lng"));

  return (
    <div>
      <h1 className="text-white font-roboto" style={{ fontSize: '2rem', position: 'relative', left: '730px', display: 'inline' }}><b>ITEM LOCATION</b></h1>
      <br />
      <p className="text-white font-roboto" style={{ fontSize: '2rem', position: 'relative', left: '490px', display: 'inline' }}><b>Information about the item or location goes here</b></p>
      {/* Pass the lat and lng to the MapComponent */}
      <MapComponent selectedLocation={{ lat, lng }} />
    </div>
  );
}
