import Friend from "./Friend";

export default function FriendList({
  friendsList,
  selectedId,
  onSetSelectedId,
}) {
  return <ul>
    {friendsList.map((friend) => (
      <Friend
        name={friend.name}
        balance={friend.balance}
        image={friend.image}
        key={friend.id}
        selectedId={selectedId}
        onSetSelectedId={onSetSelectedId}
        id={friend.id}
      />
    ))}
  </ul>;
}
