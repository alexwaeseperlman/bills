"use client";
import Container from "@mui/joy/Container";
import Image from "next/image";
import placeholderImage from "@bills/assets/placeholder.jpg";
import Button from "@mui/joy/Button";
import { useContext, useEffect, useRef, useState } from "react";
import { List, ListItem, Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { PrimaryButton } from "@bills/theme";
import { aFrameLoadedProvider as AFrameLoadedContext } from "./layout";

function ARContainer() {
  const sceneRef = useRef(null);
  const aFrameLoaded = useContext(AFrameLoadedContext);

  if (!aFrameLoaded) {
    return null;
  }

  console.log("loaded");
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
