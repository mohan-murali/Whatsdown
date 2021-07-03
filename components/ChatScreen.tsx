import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Avatar, IconButton } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import {
  BACKGROUND_DEFAULT_HOVER,
  BODY_PRIMARY_DARK,
  COMPOSE_PANEL_BACKGROUND,
  SEARCH_INPUT_BACKGROUND,
} from "../utils/constants";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import firebase from "firebase";

export default function ChatScreen({ messages, recipientEmail }) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id as string)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [recipientSnapshot] = useCollection(
    db.collection("user").where("email", "==", recipientEmail)
  );

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          email={message.data().email}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => {
        <Message key={message.id} email={message.email} message={message} />;
      });
    }
  };

  const [input, setInput] = useState("");

  const onMessageChange = (event) => setInput(event.target.value);

  const handleKeyPress = async (event) => {
    if (event.charCode === 13) {
      // Update the last seen...
      db.collection("user").doc(user.uid).set(
        {
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      db.collection("chats")
        .doc(router.query.id as string)
        .collection("messages")
        .add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          message: input,
          photoURL: user.photoURL,
          email: user.email,
        });

      setInput("");
      scrollToBottom();
    }
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();

  return (
    <Container>
      <Header>
        <HeaderInformation>
          {recipient ? (
            <Avatar src={recipient?.photoURL} />
          ) : (
            <Avatar>{recipientEmail[0]}</Avatar>
          )}
          <h3 style={{ paddingLeft: "20px" }}>{recipientEmail}</h3>
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon style={{ color: `${BODY_PRIMARY_DARK}` }} />
          </IconButton>
          <IconButton>
            <MoreVertIcon style={{ color: `${BODY_PRIMARY_DARK}` }} />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessages()}
        <MessageEnd ref={messagesEndRef} />
      </MessageContainer>

      <Footer>
        <IconButton>
          <InsertEmoticonIcon style={{ color: `${BODY_PRIMARY_DARK}` }} />
        </IconButton>
        <SendMessage
          value={input}
          onChange={onMessageChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message"
        />
      </Footer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 97.5vh;
`;

const MessageEnd = styled.div`
  margin-bottom: 50px;
`;

const MessageContainer = styled.div`
  overflow-y: scroll;
  flex: 1;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  flex: none;
  top: 0;
  z-index: 100;
  align-items: center;
  justify-content: space-between;
  background-color: ${BACKGROUND_DEFAULT_HOVER};
`;

const HeaderInformation = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20px;
`;

const HeaderIcons = styled.div``;

const Footer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${COMPOSE_PANEL_BACKGROUND};
  position: sticky;
  flex: none;
  bottom: 0;
  z-index: 100;
`;

const SendMessage = styled.input`
  padding-left: 10px;
  background-color: ${SEARCH_INPUT_BACKGROUND};
  outline-width: 0;
  border: none;
  flex: 1;
  font-size: 18px;
  height: 40px;
  color: ${BODY_PRIMARY_DARK};
  border-radius: 20px;
  padding-left: 20px;
  margin-right: 20px;
`;
