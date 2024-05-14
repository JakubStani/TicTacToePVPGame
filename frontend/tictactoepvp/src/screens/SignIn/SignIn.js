import React, { useState } from "react";
import "./SignIn.css";

function SignIn(props) {
  const [nick, setNick] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();

    props.sendJsonMessage({
      option: "signIn",
      nick: nick,
      password: password,
    });
  };

  return (
    <div>
      <div>Sign In</div>
      <form onSubmit={onSubmit} className="si-auth-container">
        <label>Nick</label>
        <input
          type="text"
          value={nick}
          onChange={(event) => setNick(event.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit">Submit</button>
      </form>

      <div>
        <button onClick={() => props.setShowSignIn(false)}>SignUp</button>
      </div>
    </div>
  );
}

export default SignIn;
