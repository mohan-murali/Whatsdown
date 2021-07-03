import { Circle } from "better-react-spinkit";
import styled from "styled-components";
import { BACKGROUND_DEFAULT } from "../utils/constants";

const Loading = () => {
  return (
    <Container>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img src="/logo.png" alt="" style={{ marginBottom: 40 }} height={200} />
        <Circle color="#3CBC28" size={60} />
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  background-color: ${BACKGROUND_DEFAULT};
  place-items: center;
  height: 100vh;
`;

export default Loading;
