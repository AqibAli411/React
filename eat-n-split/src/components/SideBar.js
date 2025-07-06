import { useState } from "react";
import FormAddFriend from "./FormAddFriend";
import FriendList from "./FriendList";

export default function SideBar({
  friendsList,
  onAddFriend,
  selectedId,
  setSelectedId,
}) {
  //this is for add firend button
  const [isClicked, setIsClicked] = useState(false);

  function handleClick() {
    setIsClicked((isClicked) => !isClicked);
  }

  return (
    <div className="sidebar">
      <FriendList
        friendsList={friendsList}
        selectedId={selectedId}
        onSetSelectedId={setSelectedId}
      />

      {isClicked ? (
        <>
          <FormAddFriend
            onAddFriend={onAddFriend}
            onHandleClick={handleClick}
          />
          <button className="button" onClick={handleClick}>
            Close
          </button>
        </>
      ) : (
        <button className="button" onClick={handleClick}>
          Add Friend
        </button>
      )}
    </div>
  );
}
