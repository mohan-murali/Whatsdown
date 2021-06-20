import { Button } from "@material-ui/core";
import Head from "next/head";
import styled from "styled-components";
import { auth, provider } from "../firebase";

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
        <Logo src="https://png.pngtree.com/element_our/md/20180626/md_5b321c99945a2.jpg"></Logo>
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
  background-color: whitesmoke;
`;

const LoginContainter = styled.div`
  padding: 100px;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
  width: 200px;
  margin-bottom: 50px;
`;
