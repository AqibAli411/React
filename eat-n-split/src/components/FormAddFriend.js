import { useState } from "react";

export default function FormAddFriend({ onAddFriend, onHandleClick }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    //checks if any of name or image is empty
    if (!name || !image) return;

    const newFriend = { name, image, id: Date.now(), balance: 0 };
    onAddFriend(newFriend);

    setName("");
    setImage("");
    onHandleClick();
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑 Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼️ Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <button className="button">Add</button>
    </form>
  );
}
