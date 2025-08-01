import CreateOrder from "../features/order/CreateOrder";

function Home() {
  return (
    <div className="text-center my-4">
      <h1 className="text-xl font-semibold mb-4">
        The best pizza.
        <br />
        <span className="text-yellow-500">
          Straight out of the oven, straight to you.
        </span>
      </h1>

      <CreateOrder />
    </div>
  );
}

export default Home;
