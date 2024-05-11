import React, { useState } from "react";
import "./SignIn.css";

function SignIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();

    props.setIsAuthenticated(true);
    props.setShowSignIn(true);
  };

  return (
    <div>
      <div>Sign In</div>
      <form onSubmit={onSubmit} className="si-auth-container">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
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
