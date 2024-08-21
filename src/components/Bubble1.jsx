import React from "react";

const Bubble1 = () => {
  return (
    <div className="grid place-content-center bg-transparent">
      <BubbleText />
    </div>
  );
};

const BubbleText = () => {
  return (
    <h2 className="text-center text-4xl sm:text-6xl font-bold text-white">
      {"MUHAMMAD".split("").map((child, idx) => (
        <span className={styles.hoverText} key={idx}>
          {child}
        </span>
      ))}
    </h2>
  );
};

export default Bubble1;