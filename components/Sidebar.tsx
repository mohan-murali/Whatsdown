import { Avatar, Button, IconButton } from "@material-ui/core";
import React from "react";
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
  INCOMING_BACKGROUND,
  PANEL_HEADER_ICON,
  SEARCH_INPUT_BACKGROUND,
} from "../utils/constants";

function Sidebar() {
  const [user] = useAuthState(auth);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  const createChat = () => {
    const input = prompt(
      "Please enter an email address for the user you wish to chat with"
    );

    if (!input) return;

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      //we need to add the chat into the DB.
      db.collection("chats").add({
        users: [user.email, input],
      });
    }
  };

  const chatAlreadyExists = (recipientEmail: string) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

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
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  height: 97.5vh;
  border: 2px solid ${BORDER_DEFAULT};
`;

const SidebarButton = styled(Button)`
  width: 100%;

  &&& {
    color: whitesmoke;
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
