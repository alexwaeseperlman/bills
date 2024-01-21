"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { List, ListItem, Modal, Button, Box, Input, ModalClose, Sheet, Typography } from "@mui/joy";
import { PrimaryButton } from "@bills/theme";
import { aFrameLoadedProvider as AFrameLoadedContext } from "./layout";
import SearchIcon from '@mui/icons-material/Search';

function ARContainer() {
  const sceneRef = useRef(null);
  const aFrameLoaded = useContext(AFrameLoadedContext);

  if (!aFrameLoaded) {
    return null;
  }

  return (
    <div style={{
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

  const callBackendApi = async () => {
    console.log(inputPrompt)
    try {
      const response = await fetch('/api/create3Dmodel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({prompt: inputPrompt}),
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
            console.log('3D Model URL:', modelUrl);
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
  const [newPromptOpen, setNewPromptOpen] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      callBackendApi();
    }
  }
  return (
    <main>

      <ARContainer />
 
      <div style={{
        position: 'fixed',
        left: '50%', 
        bottom: '20px', 
        transform: 'translateX(-50%)'
      }}>

      <Button onClick={() => setNewPromptOpen(true)}>New Prompt</Button>
      </div>

      <Modal
        open={newPromptOpen}
        onClose={() => setNewPromptOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >

        <Box
          sx={{
            backgroundColor: 'background.paper',
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            minWidth: 300,
          }}
        >

    <Input
        placeholder="Enter your prompt"
        value={inputPrompt}
        onChange={(e) => setInputPrompt(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{ marginBottom: 2, borderRadius: 15, padding: 1.5 }}
        endDecorator={(
          <SearchIcon 
            onClick={() => callBackendApi()} 
            sx={{ cursor: 'pointer' }} 
          />
        )}
      />

      </Box>
      </Modal>

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
          <PrimaryButton onClick={() => setInstructionsOpen(false)}>Let me cook 😤</PrimaryButton>
        </Sheet>
      </Modal>


    </main>
  );
}
