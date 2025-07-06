import { useState } from "react";

export default function FormBill({ name, onGetBalance, onSetSelectedId }) {
  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const [payBill, setPayBill] = useState("You");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || (yourExpense > bill)) return;

    const value = payBill === "You" ? bill - yourExpense : -1 * yourExpense;

    onGetBalance(value);
    onSetSelectedId(null);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with name</h2>

      <label>💰 Bill value </label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🙎 Your expense </label>
      <input
        type="number"
        value={yourExpense}
        onChange={(e) => setYourExpense(Number(e.target.value))}
      />

      <label>🧑‍🤝‍🧑 {name}'s expense</label>
      <input type="text" value={bill - yourExpense} disabled />

      <label>🤑 Who is paying bill</label>
      <select value={payBill} onChange={(e) => setPayBill(e.target.value)}>
        <option value="You">You</option>
        <option value={`${name}`}>{name}</option>
      </select>

      <button className="button">Split bill</button>
    </form>
  );
}
