import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import ImagePaletteProvider from "react-image-theme-parser";

var images = [
  require("./wowee.jpg"),
  require("./test.jpeg"),
  require("./test2.jpeg"),
  require("./logan.jpg"),
  require("./test3.gif"),
  require("./test4.jpg"),
  require("./white.png"),
  require("./sky.jpeg")
];

class App extends Component {
  render() {
    return (
      <div className="App">
        {images.map(image => (
          <ImagePaletteProvider image={image}>
            {({ backgroundColor, color, alternativeColor }) => (
              <div>
                <img src={image} style={{ height: 300 }} />
                <div
                  style={{
                    backgroundColor,
                    color,
                    margin: 20,
                    padding: 5
                  }}
                >
                  <span style={{ color: alternativeColor }}>
                    Lorem ipsum dolor sit
                  </span>, amet consectetur adipisicing elit. Distinctio
                  expedita architecto deserunt. Id dicta, veniam inventore
                  ducimus nobis consectetur omnis vel, qui sequi ex placeat fuga
                  harum deleniti praesentium quaerat?
                </div>
              </div>
            )}
          </ImagePaletteProvider>
        ))}
      </div>
    );
  }
}

export default App;
