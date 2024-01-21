"use client";
import Container from "@mui/joy/Container";
import Slider from "@mui/joy/Slider";
import Image from "next/image";
import placeholderImage from "@bills/assets/placeholder.jpg";
import Button from "@mui/joy/Button";
import { useContext, useEffect, useRef, useState } from "react";
import { List, ListItem, Modal, ModalClose, Sheet, Typography, ButtonGroup } from "@mui/joy";
import { PrimaryButton } from "@bills/theme";
import { aFrameLoadedProvider as AFrameLoadedContext } from "./layout";
import { rotate, setPos, requestPos } from "./controlAr";

function convertToAFrameCoords(x : any, y : any) {
  return {
    "x": x/window.innerWidth * 5,
    "y": -1*y/window.innerHeight * 5
  }
}

function convertToScreenCoords(x : any, y : any) {
  return {
    "x": x * window.innerWidth,
    "y": y * window.innerHeight
  }
}

const DummyDiv = ({ sceneRef }) => {
  const [isDragging, setIsDragging] = useState(false);
  const INF = 1000000;
  const modelRef = useRef({ x : INF, y : INF});
  const mouseRef = useRef({ x : 0, y : 0});
  
  const handleMouseDown = (e : any) => {
    mouseRef.current = {
      x: e.screenX, y: e.screenY,
    }
    console.log(mouseRef.current);
    requestPos("hat", sceneRef);
    setIsDragging(true);
  }

  const handleMouseMove = (e : any) => {
    if (isDragging && modelRef.current.x < INF) {
      let delta = {"x": e.x - mouseRef.current.x, "y": e.y - mouseRef.current.y};
      delta = convertToAFrameCoords(delta.x, delta.y);
      setPos({
        "x": delta.x + modelRef.current.x,
        "y": delta.y + modelRef.current.y,
      }, "hat", sceneRef);
    }
  }

  const handleMouseUp = (e : any) => {
    setIsDragging(false);
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    const handleMessage = (event : any) => {
      console.log("parent received message");
      if ("pos" in event.data) {
        modelRef.current = event.data.pos;
      }
    }
    window.addEventListener("message", handleMessage);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener("message", handleMessage);
    }
  }, [isDragging]);

  return (
    <div onMouseDown={handleMouseDown} style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      height: "90vh",
      width: "100vw",
    }}></div>
  );
}
function ARContainer() {
  const sceneRef = useRef(null);
  const dummyRef = useRef(null);
  const aFrameLoaded = useContext(AFrameLoadedContext);
  let isDragging : Boolean = false;
  let mousex = 0;
  let mousey = 0;
  const INF = 1000000;
  let modelx = 0;
  let modely = 0;
  const modelRef = useRef({ x : INF, y : INF});
  const mouseRef = useRef({ x : 0, y : 0});
  const draggingRef = useRef(false);

  // const [sliderVal, setSliderVal] = useState(0);
  // const handleSliderChange = (event, newVal) => {
  //   setSliderVal(newVal);
  // }

  useEffect(() => {
    const handleMouseDown = (e : any) => {
      console.log(e);
      mouseRef.current = {
        x: e.x, y: e.y,
      }
      requestPos("hat", sceneRef);
      draggingRef.current = true;
    };
    const handleMouseMove = (e : any) => {
      if (draggingRef.current && modelRef.current.x < INF) {
        let delta = {"x": e.x - mouseRef.current.x, "y": e.y - mouseRef.current.y};
        delta = convertToAFrameCoords(delta.x, delta.y);
        setPos({
          "x": delta.x + modelRef.current.x,
          "y": delta.y + modelRef.current.y,
        }, "hat", sceneRef);

      }
    }
    const handleMouseUp = (e : any) => {
      draggingRef.current = false;
    }

    const handleMessage = (event : any) => {
      console.log("parent received message");
      if ("pos" in event.data) {
        modelRef.current = event.data.pos;
      }
    }
    window.addEventListener("message", handleMessage);
    return () => {

      window.removeEventListener("message", handleMessage);
    };
  }, []);

  if (!aFrameLoaded) {
    return null;
  }

  return (
    <div sx={{
      margin:0,
      padding:0,
    }}>
      <iframe style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        padding:0,
        margin:0,
      }} src={'/ar.html'} ref={sceneRef} />
      <DummyDiv sceneRef={sceneRef}/>
      <ButtonGroup>
          <Button onClick={() => {rotate('x', "hat", sceneRef)}}>X 90</Button>
          <Button onClick={() => {rotate('y', "hat", sceneRef)}}>Y 90</Button>
          <Button onClick={() => {rotate('z', "hat", sceneRef)}}>Z 90</Button>
          </ButtonGroup>
          {/* <Slider value={sliderVal} onChange={handleSliderChange} min={0} max={100} step={1}>test</Slider> */}
      </div>
    
  );
}

export default function Home() {
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  return (
    <main>
      <ARContainer />
      <Modal
        open={instructionsOpen}
        onClose={() => setInstructionsOpen(false)}
        sx={{
          height: "100vh",
          display: "flex",
        }}
      >
        <Sheet
          variant="plain"
          sx={{
            maxWidth: "500px",
            margin: "auto",
            borderRadius: "md",
            p: 4,
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            component="h2"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            How to use BILLS
          </Typography>
          <List marker="disc">
            <ListItem>Pinch to pick up an object</ListItem>
            <ListItem>Let it go to track your head</ListItem>
            <ListItem>Make a X sign to take a picture</ListItem>
            <ListItem>Prompt to create new models using generative AI</ListItem>
            <ListItem>
              When you're done, vote on your favourite photos!
            </ListItem>
          </List>
          <PrimaryButton onClick={() => setInstructionsOpen(false)}>
            Got it
          </PrimaryButton>
        </Sheet>
      </Modal>
    </main>
  );
}
