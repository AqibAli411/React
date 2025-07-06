import { useState } from "react";
import SideBar from "./SideBar";
import FormBill from "./FormBill";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friendsList, setFriendsList] = useState(initialFriends);
  //this is for select button
  const [selectedId, setSelectedId] = useState(null);

  // a variable -> pass child -> child un ke update kare -> parent me updated use kaya
  // getBalance -> pass to FormBill -> get some value -> updated value reflect back in parent
  // benifit -> separte states for each person
  function getBalance(value) {
    setFriendsList((friendsList) =>
      friendsList.map((friend) =>
        friend.id === selectedId ? { ...friend, balance: value } : friend
      )
    );
  }

  function handleAddFriend(newFriend) {
    setFriendsList((friendsList) => [...friendsList, newFriend]);
  }

  return (
    <div className="app">
      <SideBar
        friendsList={friendsList}
        onAddFriend={handleAddFriend}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
      {selectedId !== null && (
        <FormBill
          name={
            friendsList.filter((friend) => friend.id === selectedId)[0].name
          }
          onGetBalance={getBalance}
          onSetSelectedId={setSelectedId}
        />
      )}
    </div>
  );
}
