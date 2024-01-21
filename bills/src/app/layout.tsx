"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  Box,
  CssBaseline,
  CssVarsProvider,
  Typography,
  useTheme,
} from "@mui/joy";
import { darkOrange, hoverOrange, orange } from "@bills/theme";
import { createContext, useRef, useState } from "react";
import Head from "next/head";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });
const gradient = `linear-gradient(90deg, #ffffff 0%, #f7f2f2 100%)`;

function AppBarItem(props: {
  label: string;
  href: string;
  left?: boolean;
  right?: boolean;
}) {
  const selected = window.location.pathname === props.href;
  const color = "white";

  return (
    <Box
      component="a"
      href={props.href}
      sx={{
        color,
        textDecoration: "none",
        cursor: "pointer",
        userSelect: "none",

        display: "flex",
        alignItems: "center",
        backgroundColor: orange,
        height: "100%",
        p: 2,
        whiteSpace: "nowrap",

        ...(props.left
          ? {
              borderTopLeftRadius: "8px",
              borderBottomLeftRadius: "8px",
            }
          : {}),

        ...(props.right
          ? {
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
            }
          : {}),

        transition: "background-color 0.1s ease-out",

        ":hover": {
          backgroundColor: hoverOrange,
        },
      }}
    >
      <Typography
        textColor="inherit"
        fontWeight={700}
        level="title-sm"
        sx={{
          textTransform: "uppercase",
        }}
      >
        {props.label}
      </Typography>
    </Box>
  );
}

function AppBar() {
  const ref = useRef<HTMLDivElement>(null);

  const leaderboard = window.location.pathname === "/leaderboard";

  return (
    <>
      <Box
        sx={(theme) => ({
          height: "50px",
          alignItems: "stretch",
          display: "flex",
          zIndex: 2,
          background: orange,
          width: "min-content",
          borderRadius: "lg",
          margin: "8px 8px 8px 8px",
          position: "fixed",
          right: 0,
          bottom: 0,
        })}
      >
        <AppBarItem
          right
          left
          label={leaderboard ? "Back to Home" : "Leaderboard"}
          href={leaderboard ? "/" : "/leaderboard"}
        />
      </Box>
    </>
  );
}

export const aFrameLoadedProvider = createContext(0);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = useTheme();
  const [aFrameLoaded, setAFrameLoaded] = useState(0);
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <CssBaseline />
      <body
        style={{
          background: gradient,
        }}
      >
        <AppBar />
        <aFrameLoadedProvider.Provider value={aFrameLoaded}>
          {children}
        </aFrameLoadedProvider.Provider>
      </body>
    </html>
  );
}
