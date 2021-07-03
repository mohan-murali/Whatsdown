import { Button } from "@material-ui/core";
import Head from "next/head";
import styled from "styled-components";
import { auth, provider } from "../firebase";
import {
  BACKGROUND_DEFAULT,
  BODY_PRIMARY_DARK,
  BORDER_DEFAULT,
  COMPOSE_PANEL_BACKGROUND,
} from "../utils/constants";

const Login = () => {
  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  };
  return (
    <Containter>
      <Head>
        <title>Login</title>
      </Head>

      <LoginContainter>
        <Logo src="/logo.png"></Logo>
        <Button onClick={signIn} variant="outlined">
          Sign In with Google
        </Button>
      </LoginContainter>
    </Containter>
  );
};

export default Login;

const Containter = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: ${COMPOSE_PANEL_BACKGROUND};
`;

const LoginContainter = styled.div`
  padding: 100px;
  display: flex;
  flex-direction: column;
  background-color: ${BODY_PRIMARY_DARK};
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px ${BORDER_DEFAULT};
`;

const Logo = styled.img`
  width: 200px;
  margin-bottom: 50px;
`;
