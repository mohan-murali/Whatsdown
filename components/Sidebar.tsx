import {
  Avatar,
  Button,
  IconButton,
  Modal,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import styled from "styled-components";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Chat from "./Chat";
import {
  BACKGROUND_DEFAULT_HOVER,
  BODY_PRIMARY_DARK,
  BORDER_DEFAULT,
  BORDER_LIST,
  COMPOSE_PANEL_BACKGROUND,
  INCOMING_BACKGROUND,
  MODAL_BACKGROUND,
  PANEL_HEADER_ICON,
  SEARCH_INPUT_BACKGROUND,
} from "../utils/constants";

function Sidebar() {
  const [user] = useAuthState(auth);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);
  const [open, setOpen] = useState(true);
  const [enteredEmail, setEnteredEmail] = useState("");

  const createChat = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setEnteredEmail("");
    setOpen(false);
  };

  const chatAlreadyExists = (recipientEmail: string) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  const onEmailChange = ({ target }) => {
    setEnteredEmail(target.value);
  };

  const addNewChat = () => {
    if (!enteredEmail) return;

    if (
      EmailValidator.validate(enteredEmail) &&
      !chatAlreadyExists(enteredEmail) &&
      enteredEmail !== user.email
    ) {
      //we need to add the chat into the DB.
      db.collection("chats").add({
        users: [user.email, enteredEmail],
      });
    }
    setEnteredEmail("");
    setOpen(false);
  };

  return (
    <Container>
      <Header>
        <UseAvatar src={user.photoURL} onClick={() => auth.signOut()} />

        <IconsContainer>
          <IconButton>
            <ChatIcon style={{ color: `${PANEL_HEADER_ICON}` }} />
          </IconButton>
          <IconButton>
            <MoreVertIcon style={{ color: `${PANEL_HEADER_ICON}` }} />
          </IconButton>
        </IconsContainer>
      </Header>

      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search in chats" />
      </Search>

      <SidebarButton onClick={createChat}>Star a new chat</SidebarButton>

      {/* List of chats */}
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
      <ModalInput open={open} onClose={handleClose}>
        <ModalContainer>
          <ModalDiv>
            <EmailInput
              value={enteredEmail}
              onChange={onEmailChange}
              placeholder="Enter the email id"
            />
            <AddEmailButton onClick={addNewChat}> Confirm </AddEmailButton>
          </ModalDiv>
        </ModalContainer>
      </ModalInput>
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  height: 97.5vh;
  border: 2px solid ${BORDER_DEFAULT};
`;

const ModalInput = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  width: 400px;
  background-color: ${MODAL_BACKGROUND};
  color: ${BODY_PRIMARY_DARK};
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px ${BORDER_DEFAULT};
`;

const ModalDiv = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 150px;
`;

const EmailInput = styled.input`
  padding-left: 10px;
  background-color: ${SEARCH_INPUT_BACKGROUND};
  outline-width: 0;
  border: none;
  font-size: 18px;
  width: 80%;
  height: 40px;
  color: ${BODY_PRIMARY_DARK};
`;

const AddEmailButton = styled(Button)`
  margin-top: 200px;
  width: 50%;
  &&& {
    color: ${BODY_PRIMARY_DARK};
    background-color: ${INCOMING_BACKGROUND};
    border-top: 1px solid ${BORDER_DEFAULT};
    border-bottom: 1px solid ${BORDER_DEFAULT};

    :hover {
      background-color: ${BORDER_LIST};
      transition: 1s;
    }
  }
`;

const SidebarButton = styled(Button)`
  width: 100%;

  &&& {
    color: ${BODY_PRIMARY_DARK};
    background-color: ${INCOMING_BACKGROUND};
    border-top: 1px solid ${BORDER_DEFAULT};
    border-bottom: 1px solid ${BORDER_DEFAULT};
  }
`;

const Search = styled.div`
  background-color: ${SEARCH_INPUT_BACKGROUND};
  display: flex;
  align-items: center;
  padding: 20 px;
  border: 2px solid ${BORDER_LIST};
  border-radius: 30px;
  margin: 8px 15px;
  padding-left: 10px;
  padding-right: 15px;
`;

const SearchInput = styled.input`
  padding-left: 10px;
  background-color: ${SEARCH_INPUT_BACKGROUND};
  outline-width: 0;
  border: none;
  flex: 1;
  font-size: 18px;
  height: 40px;
  color: ${BODY_PRIMARY_DARK};
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: ${BACKGROUND_DEFAULT_HOVER};
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 59px;
  border-bottom: 1px solid ${BORDER_DEFAULT};
`;

const UseAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;
