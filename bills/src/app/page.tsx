"use client";
import Container from "@mui/joy/Container";
import Image from "next/image";
import placeholderImage from "@bills/assets/placeholder.jpg";
import Button from "@mui/joy/Button";
import { useState } from "react";
import { List, ListItem, Modal, ModalClose, ModalDialog, Sheet, Typography } from "@mui/joy";
import { PrimaryButton } from "@bills/theme";


export default function Home() {

  const callBackendApi = async () => {
    try {
      const response = await fetch('/api/create3Dmodel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log(data);
      const taskId = data.result;
  
      const pollInterval = 2000; 
      const pollFor3DModel = async () => {
        try {
          const response = await fetch(`/api/get3Dmodel?taskId=${taskId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          const data = await response.json();
          console.log(data);
  
          if (data.status !== 'SUCCEEDED') {

            setTimeout(pollFor3DModel, pollInterval);
          } else {

            const modelUrl = data.model_urls.glb;
            const thumbnailUrl = data.thumbnail_url;
          }
        } catch (error) {
          console.error('There was an error:', error);
        }
      };

      setTimeout(pollFor3DModel, pollInterval);
  
    } catch (error) {
      console.error('There was an error:', error);
    }
  }  

  const [instructionsOpen, setInstructionsOpen] = useState(true);
  return (
    <main>
      <button onClick={callBackendApi}>Make API Call</button>
      <Image
        src={placeholderImage}
        alt="placeholder"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      />
      <Modal open={instructionsOpen} onClose={() => setInstructionsOpen(false)} sx={{
        height: "100vh",
        display: "flex",
      }}>
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
          <PrimaryButton onClick={() => setInstructionsOpen(false)}>Let me cook 😤</PrimaryButton>
        </Sheet>
      </Modal>
    </main>
  );
}
