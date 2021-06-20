import { Circle } from "better-react-spinkit";

const Loading = () => {
  return (
    <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src="https://png.pngtree.com/element_our/md/20180626/md_5b321c99945a2.jpg"
          alt=""
          style={{ marginBottom: 40 }}
          height={200}
        />
        <Circle color="#3CBC28" size={60} />
      </div>
    </div>
  );
};

export default Loading;
