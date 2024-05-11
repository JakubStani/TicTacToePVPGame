import React, { useState } from "react";
import "./SignUp.css";
import UserPool from "../../auth/UserPool";

const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

function SignUp(props) {
  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();

    props.sendJsonMessage({
      option: "signUp",
      nick: nick,
      email: email,
      password: password,
    });

    // const attributeList = [
    //   new AmazonCognitoIdentity.CognitoUserAttribute({
    //     Name: "nickname",
    //     Value: nick,
    //   }),
    //   new AmazonCognitoIdentity.CognitoUserAttribute({
    //     Name: "email",
    //     Value: email,
    //   }),
    // ];

    // UserPool.signUp(nick, password, attributeList, null, (error, data) => {
    //   if (error) {
    //     console.error(error);
    //   }
    //   console.log(data);

    //   props.saveUserCredentials(
    //     data.getIdToken().getJwtToken(),
    //     data.getAccessToken().getJwtToken(),
    //     data.getRefreshToken().getToken()
    //   );
    // });

    // props.setIsAuthenticated(true);
    // props.setShowSignIn(true);
  };

  return (
    <div>
      <div>Sign In</div>

      <label>Nick</label>
      <form onSubmit={onSubmit} className="su-auth-container">
        <input
          type="text"
          value={nick}
          onChange={(event) => setNick(event.target.value)}
        />

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
        <button onClick={() => props.setShowSignIn(true)}>SignIn</button>
      </div>
    </div>
  );
}

export default SignUp;
