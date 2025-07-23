import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCiy } from "./CityContext";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }) {
  const { currCity, deleteCity } = useCiy();
  const { cityName, emoji, date, id, position } = city;

  //how here i know, which city is selected
  //if i transfer here the state how can move it to City then
  //here comes useLocation hook that is to transfer throw link
  //because it is which takes us to the next componenet

  return (
    <li
      className={`${styles.container} ${
        currCity.id === id ? styles.cityItem__active : ""
      }`}
    >
      <Link
        className={`${styles.cityItem}`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}> {emoji}</span>
        <h3 className={styles.name}> {cityName}</h3>
        <time className={styles.date}> {formatDate(date)}</time>
      </Link>
      <button onClick={() => deleteCity(id)} className={styles.deleteBtn}>
        &times;
      </button>
    </li>
  );
}

export default CityItem;
