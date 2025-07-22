import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { useCiy } from "./CityContext";
import { map } from "leaflet";

function Map() {
  //when i click on a particular country in the side bar, map should move to it.
  //precisely, update mapPositon acc to searchParams..
  const [mapPosition, setMapPosition] = useState([31.582045, -9]);
  const navigate = useNavigate();
  const { cities } = useCiy();
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  useEffect(
    function () {
      if(lat && lng) setMapPosition([lat, lng]);
    },
    [lat, lng]
  );

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <CenterMap mapPosition={mapPosition} />
      </MapContainer>
    </div>
  );
}

//this comp will center the map
function CenterMap({ mapPosition }) {
  const map = useMap();
  map.setView(mapPosition);
  return null;
}

export default Map;
