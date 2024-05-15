import React, { useState } from "react";
import "./SignIn.css";

function SignIn(props) {
  const [nick, setNick] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

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
      <label>If you have just registered, enter your confirmation code</label>
      <input
        type="text"
        value={confirmationCode}
        onChange={(event) => setConfirmationCode(event.target.value)}
      />
      <label>and nick</label>
      <input
        type="text"
        value={nick}
        onChange={(event) => setNick(event.target.value)}
      />
      <div>
        <button onClick={() => props.confirmCode(nick, confirmationCode)}>
          Confirm registration code
        </button>
      </div>
    </div>
  );
}

export default SignIn;
