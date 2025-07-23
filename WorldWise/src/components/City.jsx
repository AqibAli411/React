import {useNavigate, useParams } from "react-router-dom";
import styles from "./City.module.css";
import Button from "./Button";
import Spinner from "./Spinner";
import { useEffect } from "react";
import { useCiy } from "./CityContext";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  //value returned from useParam hook is indeed a string
  const { currCity, getCity, isLoading } = useCiy();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(
    function () {
      getCity(id);
    },
    [id]
  );

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{currCity.emoji}</span> {currCity.cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {currCity.cityName} on</h6>
        <p>{formatDate(currCity.date || null)}</p>
      </div>

      {currCity.notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{currCity.notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${currCity.cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {currCity.cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <Button type="back" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    </div>
  );
}

export default City;
