"use client";
import Container from "@mui/joy/Container";
import Slider from "@mui/joy/Slider";
import Image from "next/image";
import placeholderImage from "@bills/assets/placeholder.jpg";
import Button from "@mui/joy/Button";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
} from "@mui/joy";
import { PrimaryButton, PrimaryButtonOutlined } from "@bills/theme";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { List, ListItem, Modal, ModalClose, Sheet, Typography, ButtonGroup } from "@mui/joy";
// import { aFrameLoadedProvider as AFrameLoadedContext } from "./layout";
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
    console.log(e);
    mouseRef.current = {
      x: e.pageX, y: e.pageY,
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
function ARContainer(props: { onPictureTaken: (data: string) => void }) {
  const sceneRef = useRef<HTMLIFrameElement>(null);

  const [flash, setFlash] = useState(false);
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data.type === "takePicture") {
        props.onPictureTaken(event.data.dataURL);
      }
    };

    window.addEventListener("message", listener);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, [props.onPictureTaken]);

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0
      }}>
      <DummyDiv sceneRef={sceneRef}/>

      <iframe
        tabIndex={-1}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
        scrolling="no"
        src={"/ar.html"}
        ref={sceneRef}
      />
      <ButtonGroup>
      <Button onClick={() => {rotate('x', "hat", sceneRef)}}>X 90</Button>
      <Button onClick={() => {rotate('y', "hat", sceneRef)}}>Y 90</Button>
      <Button onClick={() => {rotate('z', "hat", sceneRef)}}>Z 90</Button>
      </ButtonGroup>
      <Box
        sx={{
          position: "absolute",
          bottom: "50px",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <IconButton
          sx={{
            borderRadius: "50%",
            width: "64px",
            height: "64px",
          }}
          onClick={() => handlePicture()}
          variant="soft"
          size="lg"
        >
          <CameraAltIcon />
        </IconButton>
      </Box>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: flash ? "white" : "transparent",
          transition: flash ? "none" : "background 0.5s ease",
          pointerEvents: "none",
        }}
      ></div>
    </div>
  );

  function handlePicture() {
    sceneRef.current!.contentWindow?.postMessage("takePicture", "*");
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
    }, 1);
  }
}

export default function Home() {
  const callBackendApi = async () => {
    try {
      const response = await fetch("/api/create3Dmodel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      const taskId = data.result;

      const pollInterval = 2000;
      const pollFor3DModel = async () => {
        try {
          const response = await fetch(`/api/get3Dmodel?taskId=${taskId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          console.log(data);

          if (data.status !== "SUCCEEDED") {
            setTimeout(pollFor3DModel, pollInterval);
          } else {
            const modelUrl = data.model_urls.glb;
            const thumbnailUrl = data.thumbnail_url;
          }
        } catch (error) {
          console.error("There was an error:", error);
        }
      };

      setTimeout(pollFor3DModel, pollInterval);
    } catch (error) {
      console.error("There was an error:", error);
    }
  };

  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [picturePopup, setPicturePopup] = useState<string | null>(null);

  return (
    <main>
      <button onClick={callBackendApi}>Make API Call</button>
      <ARContainer
        onPictureTaken={(pic) => {
          setPicturePopup(pic);
        }}
      />
      <InstructionsModal
        instructionsOpen={instructionsOpen}
        setInstructionsOpen={setInstructionsOpen}
      />
      <PictureModal picture={picturePopup} setPicture={setPicturePopup} />
    </main>
  );
}

function PictureModal({
  picture,
  setPicture,
}: {
  picture: string | null;
  setPicture: (pic: string | null) => void;
}) {
  const [publishing, setPublishing] = useState(false);

  if (!picture) return null;
  return (
    <Modal
      open={!!picture}
      onClose={() => setPicture(null)}
      sx={{
        height: "100vh",
        display: "flex",
      }}
    >
      <Sheet
        variant="plain"
        sx={{ maxWidth: "500px", margin: "auto", borderRadius: "md", p: 4 }}
      >
        <ModalClose variant="plain" sx={{ m: 1 }} />

        <Typography
          component="h2"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}
        >
          Here's your photo!
        </Typography>
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
          }}
        >
          <img src={picture} width={500} />
        </Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <PrimaryButtonOutlined
            variant="outlined"
            onClick={() => setPicture(null)}
          >
            Discard
          </PrimaryButtonOutlined>
          <PrimaryButtonOutlined
            variant="outlined"
            onClick={() => {
              const downloadLink = document.createElement("a");
              document.body.appendChild(downloadLink);

              downloadLink.href = picture ?? "";
              downloadLink.target = "_self";
              downloadLink.download = "bills.jpg";
              downloadLink.click();
              document.removeChild(downloadLink);
            }}
          >
            Save
          </PrimaryButtonOutlined>
          <PrimaryButton onClick={() => {
            setPublishing(true);
            console.log(picture)
            const a = atob(picture?.replace("data:image/jpeg;base64,", ""));
            console.log(a)
            const byteCharacters = atob(picture?.replace("data:image/jpeg;base64,", ""));
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            fetch("/api/upload-pic", {
              method: "POST",
              body: new Blob([byteArray]),
              headers: {
                "Content-Type": "image/jpeg",
              },
            }).then(async (res) => {
              console.log(await res.text());

              setPublishing(false);
              setPicture(null);
            });
          }}>
            {publishing ? <CircularProgress /> : "Publish"}
          </PrimaryButton>
        </Box>
      </Sheet>
    </Modal>
  );
}

function InstructionsModal({
  instructionsOpen,
  setInstructionsOpen,
}: {
  instructionsOpen: boolean;
  setInstructionsOpen: (open: boolean) => void;
}) {
  return (
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
          <ListItem>When you're done, vote on your favourite photos!</ListItem>
        </List>
        <PrimaryButton onClick={() => setInstructionsOpen(false)}>
          Let me cook 😤
        </PrimaryButton>
      </Sheet>
    </Modal>
  );
}
