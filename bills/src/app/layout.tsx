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
import { useRef } from "react";

const inter = Inter({ subsets: ["latin"] });
const gradient = `linear-gradient(90deg, #ffffff 0%, #f7f2f2 100%)`;

function AppBarItem(props: { label: string; href: string, left?: boolean, right?: boolean }) {
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

        ...(props.left ? {
          borderTopLeftRadius: '8px',
          borderBottomLeftRadius: "8px",
        } : {}),

        ...(props.right ? {
          borderTopRightRadius: "8px",
          borderBottomRightRadius: "8px",
        } : {}),

        transition: "background-color 0.1s ease-out",

        ':hover': {
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
          margin: "8px auto 8px auto",
          position: "relative",
        })}
      >
        <Box ref={ref} sx={{
          position: "absolute",
        }}></Box>
        <AppBarItem left label="Home" href="/" />
        <AppBarItem label="Browse" href="/browse" />
        <AppBarItem right label="Leaderboard" href="/leaderboard" />
      </Box>
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = useTheme();
  return (
    <html lang="en">
      <CssBaseline />
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <body
        style={{
          background: gradient,
        }}
      >
        <AppBar />
        {children}
      </body>
    </html>
  );
}
