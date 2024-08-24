import React from "react";
import Hero from "./Hero";
import NavBar from "./NavBar";

export default function () {
  return (
    <div id="home" className="spacer layerHeader h-fit w-full">
      <Hero>
        <NavBar />
      </Hero>
    </div>
  );
}
