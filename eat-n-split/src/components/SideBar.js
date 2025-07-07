import { useState } from "react";
import FormAddFriend from "./FormAddFriend";

export default function SideBar({
  onAddFriend,
  children
}) {
  //this is for add firend button
  const [isClicked, setIsClicked] = useState(false);

  function handleClick() {
    setIsClicked((isClicked) => !isClicked);
  }

  return (
    <div className="sidebar">
      {children}

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
