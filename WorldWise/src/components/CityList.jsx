import CityItem from "./CityItem";
import Spinner from "./Spinner";
import Message from "./Message";
import styles from "./CityList.module.css";
import { useCiy } from "./CityContext";

function CityList() {
  const { isLoading, cities } = useCiy();

  if (isLoading) return <Spinner />;
   
  if (!cities)
    return (
      <Message message="you haven't selected any country, click on the map to make a selection!" />
    );

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id}/>
      ))}
    </ul>
  );
}

export default CityList;
