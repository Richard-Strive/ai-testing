import React, { useRef } from "react";
import "./App.css";

import * as tf from "@tensorflow/tfjs";

import * as facemesh from "@tensorflow-models/facemesh";

import Webcam from "react-webcam";
import { drawMash } from "./tools";

function App() {
  const WebCamRef = useRef(null);
  const CanvasRef = useRef(null);

  // load the modules
  const loadFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });

    setInterval(() => {
      detect(net);
    }, 100);
  };

  // detect fun
  const detect = async (net) => {
    if (
      typeof WebCamRef.current !== "undefined" &&
      WebCamRef.current !== null &&
      WebCamRef.current.video.readyState === 4
    ) {
      // Grab our webcam component video property
      const video = WebCamRef.current.video;
      const videoWidth = WebCamRef.current.video.videoWidth;
      const videoHeight = WebCamRef.current.video.videoHeight;

      // Define the webcam video size
      WebCamRef.current.video.height = videoHeight;
      WebCamRef.current.video.width = videoWidth;

      // Define Canvas size
      CanvasRef.current.height = videoHeight;
      CanvasRef.current.width = videoWidth;

      //MAKE DETECTION
      const face = await net.estimateFaces(video);
      console.log(face);

      // Canvas context/obj for drawing
      const ctx = CanvasRef.current.getContext("2d");
      drawMash(face, ctx);
    }
  };
  loadFacemesh();
  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={WebCamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",

            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "centr",
            zIndex: 1,
            width: 640,
            height: 480,
          }}
        />
        <canvas
          ref={CanvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "centr",
            zIndex: 1,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
