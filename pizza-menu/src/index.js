import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const pizzaData = [
  {
    name: "Focaccia",
    ingredients: "Bread with italian olive oil and rosemary",
    price: 6,
    photoName: "pizzas/focaccia.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Margherita",
    ingredients: "Tomato and mozarella",
    price: 10,
    photoName: "pizzas/margherita.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Spinaci",
    ingredients: "Tomato, mozarella, spinach, and ricotta cheese",
    price: 12,
    photoName: "pizzas/spinaci.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Funghi",
    ingredients: "Tomato, mozarella, mushrooms, and onion",
    price: 12,
    photoName: "pizzas/funghi.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Salamino",
    ingredients: "Tomato, mozarella, and pepperoni",
    price: 15,
    photoName: "pizzas/salamino.jpg",
    soldOut: true,
  },
  {
    name: "Pizza Prosciutto",
    ingredients: "Tomato, mozarella, ham, aragula, and burrata cheese",
    price: 18,
    photoName: "pizzas/prosciutto.jpg",
    soldOut: false,
  },
];

function App() {
  return (
    <div className="container">
      <Header />
      <Menu />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <h1>Fast React Resturant Co.</h1>
    </header>
  );
}

function Menu() {
  const pizzas = pizzaData;
  const numPizzas = pizzas.length;

  return (
    <div className="menu">
      <h2>Our Menu</h2>
      {/* list rendering */}
      {numPizzas > 0 ? (
        <>
        {/* this is short noation for react fragment <></> which will leave no trace of parent and we will have only one root element to work with. React.Fragment is used when we also need a key to work wtih */}
          <p>
            {" "}
            We welcome you to the best hotel of the city here we have everything
            you will ever need to eat
          </p>
          <ul className="pizzas">
            {pizzas.map((pizza, index) => (
              <Pizza pizzaObj={pizza} key={index} />
            ))}
          </ul>
        </>
      ) : (
        <p>Currently we're updating our menu!</p>
      )}
    </div>
  );
}

function Pizza({ pizzaObj }) {
  // if (pizzaObj.soldOut) return null;

  return (
    <li className={`pizza ${pizzaObj.soldOut ? "sold-out" : ""}`}>
      <img src={pizzaObj.photoName} alt={pizzaObj.photoName} />
      <div>
        <h3>{pizzaObj.name}</h3>
        <p>{pizzaObj.ingredients}</p>
        <span>{pizzaObj.soldOut ? "SOLD OUT" : pizzaObj.price}</span>
      </div>
    </li>
  );
}

function Footer() {
  const openHours = 8;
  const closeHours = 23;

  const currHours = new Date().getHours();

  const isOpen = currHours <= closeHours && currHours >= openHours;

  //as there components are js functions we can write any logic here
  return (
    <footer className="footer">
      {/* conditional rendering using shortcircuit strategy with And operator  */}
      {/* {isOpen && <p> Welcome we are open until {closeHours} </p>} */}
      {isOpen ? (
        <Order closeHours={closeHours} />
      ) : (
        <p>Sorry Resturant is closed. Opens at {openHours % 12}:00</p>
      )}
    </footer>
  );
}

// de structuring the prop object to get close hours directly....
function Order({ closeHours }) {
  return (
    <div className="order">
      <p> Welcome we are open until {closeHours % 12}:00 </p>
      <button className="btn">Order Now</button>
    </div>
  );
}

//this is for react 18+
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //this StrictMode checks components twice before rendering
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// for less than that we use 'react-dom' as import and
// ReactDOM.render(<App />,document.getElementById("root"))
