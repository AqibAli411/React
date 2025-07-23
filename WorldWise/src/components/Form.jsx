// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUrlPosition } from "../../hooks/useUrlPosition";
import { useCity } from "../../Contexts/CityContext";

import Button from "./Button";
import styles from "./Form.module.css";
import Message from "./Message";
import Spinner from "./Spinner";


export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const { createCity, isLoading: isLoadingForAdd } = useCity();
  const navigate = useNavigate();
  const [lat, lng] = useUrlPosition();

  const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

  useEffect(
    function () {
      //for suppose user directly went to /form then it should ask user to click on map
      if (!lat && !lng) return;

      async function fetchDetails() {
        try {
          setIsLoadingGeoCoding(true);
          setErrorMessage("");
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          if (!data.countryCode)
            throw new Error(
              "There is exist no country on the location clicked. Please click on a correct location"
            );

          setCountry(data.countryName);
          setCityName(data.cityName || data.locality || "");
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          setErrorMessage(err.message);
        } finally {
          setIsLoadingGeoCoding(false);
        }
      }

      fetchDetails();
    },
    [lat, lng]
  );

  if (!lat && !lng)
    return <Message message="Make a selection by clicking on the map!" />;

  if (isLoadingGeoCoding) return <Spinner />;

  if (errorMessage) return <Message message={errorMessage} />;

  function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    // loading when adding and then navigate back to cities list
    // navigate(-1) -> to go back
    // or <Navigate /> Component to go to list exactly
    //

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };

    createCity(newCity);
    navigate('/app/cities');
  }

  return (
    <form
      className={`${styles.form} ${isLoadingForAdd ? `${styles.loading}` : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
          id="date"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            navigate("/app/cities");
          }}
          type="back"
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
