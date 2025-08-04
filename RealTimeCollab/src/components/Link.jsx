function Link({ className="", children }) {

  return (
    <li className={className}>
      <a href='#'>{children}</a>
    </li>
  );
}

export default Link;
