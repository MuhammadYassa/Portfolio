import React from "react";
import Hero from "./Hero";
import NavBar from "./NavBar";

export default function () {
  return (
    <div id="home" className="spacer layerHeader h-[100vh] -mb-1">
      <Hero>
        <NavBar />
      </Hero>
    </div>
  );
}
