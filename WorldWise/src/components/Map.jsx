import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCity } from "../../Contexts/CityContext";
import { useGeolocation } from "../../hooks/useGeoLocation";
import { useUrlPosition } from "../../hooks/useUrlPosition";
import Button from "./Button";
import User from "./User";


//to create a logic that doesn't exist there in the leaflet component
//create a componenet that returns null (if only concerend with logic)
//implement and use it inside the MapContainer

function Map() {
  //when i click on a particular country in the side bar, map should move to it.
  //precisely, update mapPositon acc to searchParams..
  const [mapPosition, setMapPosition] = useState([31.582045, -9]);
  const { cities } = useCity();
  const {
    isLoading: isLoadingGeo,
    position: geoLocation,
    getPosition,
  } = useGeolocation();
  const [lat,lng] = useUrlPosition();

  //to sync with geo location
  useEffect(
    function () {
      if (geoLocation) setMapPosition([geoLocation.lat, geoLocation.lng]);
    },
    [geoLocation]
  );

  //to sync lat and lng with map positions
  useEffect(
    function () {
      if (lat && lng) setMapPosition([lat, lng]);
    },
    [lat, lng]
  );

  return (
    <div className={styles.mapContainer}>
      {!geoLocation && (
        <Button type="position" onClick={getPosition}>
          {isLoadingGeo ? "Loading..." : "Use your Location"}
        </Button>
      )}
      <User />
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
        {geoLocation && <Marker
          position={[geoLocation.lat,geoLocation.lng]}
        >
          <Popup>
            <span>Your location</span>
          </Popup>
        </Marker>}

        <CenterMap mapPosition={mapPosition} />
        <Clicked />
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

function Clicked() {
  const navigate = useNavigate();

  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
  return null;
}

export default Map;
