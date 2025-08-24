function Link({ className = "", children }) {
  return (
    <li>
      <a className={className} href="#">
        {children}
      </a>
    </li>
  );
}

export default Link;
