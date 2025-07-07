export default function Friend({
  name,
  balance,
  image,
  id,
  selectedId,
  onSetSelectedId,
}) {
  return (
    <li>
      <img src={image} alt="friend_image" />
      <h3>{name}</h3>

      <p
        style={
          balance > 0 ? { color: "green" } : balance < 0 ? { color: "red" } : {}
        }
      >
        {balance === 0
          ? `you and ${name} are even`
          : balance > 0
          ? `${name} owes you $${balance}`
          : `you owe ${name} $${-1 * balance}`}
      </p>

      <button
        className="button"
        onClick={() => onSetSelectedId(id === selectedId ? null : id)}
      >
        {id === selectedId ? <span>close</span> : <span>select</span>}
      </button>
    </li>
  );
}
