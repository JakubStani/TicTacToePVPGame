import React, { useState } from "react";
import "./SignIn.css";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from "../../auth/UserPool";

function SignIn(props) {
  const [nick, setNick] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();

    const user = new CognitoUser({
      Username: nick,
      Pool: UserPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: nick,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        console.log("Success ", data);
        console.log(data.getIdToken().getJwtToken());
        console.log(data.getAccessToken().getJwtToken());
        console.log(data.getRefreshToken().getToken());
        //localStorage.setItem('accessToken-tttpvp', data[])
      },
      onFailure: (error) => {
        console.error("Error ", error);
      },
    });

    props.setIsAuthenticated(true);
    props.setShowSignIn(true);
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
