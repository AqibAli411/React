// useCiy -> custom hook
// CityProvider() => component
import { useContext } from "react";
import { createContext, useEffect, useState } from "react";

const CityContext = createContext();

const BASE_URL = "http://localhost:5000";

function CityProvider({ children }) {
  //all the city related states here
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currCity, setCurrCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch {
        alert("unknown error has occurred");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrCity(data);
    } catch {
      alert("unknown error has occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        currCity,
        getCity,
        setCurrCity,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

//custom hook
function useCiy() {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error("CityContext can only be called inside CityProvider!");
  }
  return context;
}

export { CityProvider, useCiy };
