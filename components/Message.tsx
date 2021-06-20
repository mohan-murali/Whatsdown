import moment from "moment";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../firebase";
import { BODY_PRIMARY_DARK, INCOMING_BACKGROUND } from "../pages/constants";

export default function Message({ email, message }) {
  const [userLoggedIn] = useAuthState(auth);

  const TypeOfMessage = email === userLoggedIn.email ? Sender : Reciever;

  console.log(email);

  return (
    <Container>
      <TypeOfMessage>
        {message.message}
        <Timestamp>
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </Timestamp>
      </TypeOfMessage>
    </Container>
  );
}

const Container = styled.div``;

const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  padding-bottom: 26px;
  text-align: right;
  position: relative;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: ${BODY_PRIMARY_DARK};
  color: ${INCOMING_BACKGROUND};
`;

const Reciever = styled(MessageElement)`
  text-align: left;
  background-color: teal;
`;

const Timestamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  text-algin: right;
  right: 0;
`;
