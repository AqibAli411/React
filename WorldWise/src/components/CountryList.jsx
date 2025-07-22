import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Spinner from "./Spinner";
import { useCiy } from "./CityContext";

function CountryList() {
  const {isLoading,cities} = useCiy();

  if (isLoading) return <Spinner />;

  const countries = cities.reduce(
    (acc, curr) =>
      !acc.some((item) => item.country === curr.country)
        ? [...acc, { country: curr.country, emoji: curr.emoji }]
        : acc,
    []
  );

  return (
    <div className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} />
      ))}
    </div>
  );
}

export default CountryList;
