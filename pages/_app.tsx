import "../styles/globals.css";
import { AppProps } from "next/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import Login from "./login";
import Loading from "../components/Loading";
import firebase from "firebase";
import { useEffect } from "react";
import styled from "styled-components";
import {
  APP_BACKGROUND,
  BACKGROUND_DEFAULT,
  BODY_PRIMARY_DARK,
  BORDER_DEFAULT,
} from "../utils/constants";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      db.collection("user").doc(user.uid).set({
        email: user.email,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL: user.photoURL,
      }),
        { merge: true };
    }
  }, [user]);



  if (loading) return <Loading />;
  if (!user) return <Login />;
  return (
    <Main>
      <Container>
        <Component {...pageProps} />
      </Container>
    </Main>
  );
}

export default MyApp;

const Main = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${APP_BACKGROUND};
  color: ${BODY_PRIMARY_DARK};
`;

const Container = styled.div`
  width: 1396px;
  height: 98vh;
  background-color: ${BACKGROUND_DEFAULT};
  border: 3px solid ${BORDER_DEFAULT};
  border-radius: 3px;
`;
