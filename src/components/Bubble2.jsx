import React from "react";
import styles from "../assets/bubble.module.css";

const Bubble2 = () => {
  return (
    <div className="grid place-content-center bg-transparent">
      <BubbleText />
    </div>
  );
};

const BubbleText = () => {
  return (
    <h2 className="text-center text-7xl sm:text-9xl font-bold text-white">
      {"YASSA".split("").map((child, idx) => (
        <span className={styles.hoverText} key={idx}>
          {child}
        </span>
      ))}
    </h2>
  );
};

export default Bubble2;