// useCiy -> custom hook
// CityProvider() => component
import { useContext, useReducer } from "react";
import { createContext, useEffect } from "react";

const CityContext = createContext();

const BASE_URL = "http://localhost:5000";

const initalState = {
  cities: [],
  isLoading: false,
  currCity: {},
  error: "",
};

function render(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    case "rejected":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    default:
      return new Error("unknown input");
  }
}

function CityProvider({ children }) {
  //all the city related states here
  const [{ cities, isLoading, currCity }, dispatch] = useReducer(
    render,
    initalState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({ type: "rejected", payload: "failed to get cities" });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    if(Number(id) === currCity) return;

    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({ type: "rejected", payload: "failed to get city" });
    }
  }

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({ type: "rejected", payload: "failed to create city" });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({ type: "rejected", payload: "failed to delete city" });
    }
  }

  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        currCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

//custom hook
function useCity() {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error("CityContext can only be called inside CityProvider!");
  }
  return context;
}

export { CityProvider, useCity };
