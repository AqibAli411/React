import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./pages/ProtectedRoute";
import CityList from "./components/CityList";
import City from "./components/City";
import CountryList from "./components/CountryList";
import Map from "./components/Map";
import Form from "./components/Form";
import { CityProvider } from "../Contexts/CityContext";
import { AuthProvider } from "../Contexts/FakeAuthContext";
import { lazy, Suspense } from "react";
import SpinnerFullPage from "./components/SpinnerFullPage";

//lazy is react provided function that divides bundle size into chunks
//now to move from one component to another the second componenet must be downloaded
//so the waiting time can be controlled by using component Suspense
const HomePage = lazy(() => import("./pages/Homepage"));
const Product = lazy(() => import("./pages/Product"));
const Pricing = lazy(() => import("./pages/Pricing"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Login = lazy(() => import("./pages/Login"));


function App() {
  return (
    <CityProvider>
      <AuthProvider>
        <Suspense fallback={<SpinnerFullPage/>}>
          <BrowserRouter>
            <Routes>
              <Route index element={<HomePage />} />
              <Route path="/product" element={<Product />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="cities" />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="map" element={<Map />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
        </Suspense>
      </AuthProvider>
    </CityProvider>
  );
}

export default App;
