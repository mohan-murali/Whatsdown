import Head from "next/head";
import styled from "styled-components";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "../../utils/getRecipientEmail";

export default function Chat({ chat, messages }) {
  const [user] = useAuthState(auth);
  const recipientEmail = getRecipientEmail(chat?.users, user);

  return (
    <Container>
      <Head>
        <title>Chat with {recipientEmail}</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen recipientEmail={recipientEmail} messages={messages} />
      </ChatContainer>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);

  const messagesRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

  const messages = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
    }));

  //PREP the chats
  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  --ms-overflow-style: none;
  scrollbar-width: none;
`;
