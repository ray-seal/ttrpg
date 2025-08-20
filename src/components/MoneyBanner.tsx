import React from "react";

const MoneyBanner: React.FC<{ galleons: number }> = ({ galleons }) => (
  <div style={{
    width: "100%",
    background: "#b79b5a",
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "1.2em",
    padding: ".5em 0",
    letterSpacing: ".07em",
    boxShadow: "0 1px 6px #b79b5a33",
    marginBottom: "1.2em"
  }}>
    Galleons: {galleons}
  </div>
);

export default MoneyBanner;
