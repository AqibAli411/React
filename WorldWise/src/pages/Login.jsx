import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/FakeAuthContext";
import Button from "../components/Button";
import PageNav from "../components/PageNav";
import styles from "./Login.module.css";
import { useEffect, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");
  //these are tobe checked..
  const {isAuth,login} = useAuth();
  const navigate = useNavigate();

  function handleAuth(e){
    e.preventDefault();
    if(email && password) login(email,password);
  }

  useEffect(
    function () {
      if (isAuth) navigate("/app", { replace: true });
    },
    [isAuth, navigate]
  );

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleAuth}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
