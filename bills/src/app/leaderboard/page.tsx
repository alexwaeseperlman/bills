"use client";
import {
  PrimaryButton,
  darkHoverOrange,
  darkOrange,
  hoverOrange,
  orange,
} from "@bills/theme";
import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardContent,
  CardOverflow,
} from "@mui/joy";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Image from "next/image";
import { useEffect, useState } from "react";

function PicCard({
  image,
  upvotes,
  id,
  upvote,
}: Readonly<{
  image: string;
  upvotes: number;
  id: string;
  upvote: (n: number) => undefined;
}>) {
  const [upvoted, setUpvoted] = useState(
    localStorage.getItem(id + "-upvoted") === "true"
  );

  useEffect(() => {
    localStorage.setItem(id + "-upvoted", (!!upvoted).toString());
  }, [upvoted]);

  console.log(image)
  return (
    <Card
      sx={{ width: "100%", maxWidth: "300px", m: 2, justifyItems: "center" }}
    >
      <CardOverflow>
        <AspectRatio ratio="1">
          <Image
            src={"data:image/jpg;base64," + image}
            alt="placeholder"
            fill={true}
          />
        </AspectRatio>
      </CardOverflow>
      <PrimaryButton
        onClick={() => {
          setUpvoted(!upvoted);
          upvote(upvoted ? -1 : 1);
        }}
        color={upvoted ? "neutral" : "primary"}
        sx={{
          backgroundColor: upvoted ? "white" : orange,
          color: upvoted ? orange : "white",
          border: upvoted ? `1px solid ${orange}` : "none",
          transition:
            "background-color 0.1s ease-out, color 0.1s ease-out, border-color 0.1s ease-out",
          ":hover": {
            backgroundColor: upvoted ? "white" : hoverOrange,
            border: upvoted ? `1px solid ${darkHoverOrange}` : "none",
            color: upvoted ? darkHoverOrange : "inherit",
          },
        }}
      >
        <ArrowDropUpIcon /> {!upvoted ? "Upvote" : "Upvoted"} {upvotes}
      </PrimaryButton>
    </Card>
  );
}

export default function Home() {
  const [pics, setPics] = useState([]);
  const refresh = () => {
    fetch("/api/get-pics")
      .then((res) => res.json())
      .then((res) => setPics(res));
  };
  useEffect(() => {
    refresh();
  }, []);

  return (
    <main>
      <Box
        sx={(theme) => ({
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          [theme.breakpoints.down("sm")]: {
            justifyContent: "center",
          },
        })}
      >
        {pics.map((pic: {
          image: string;
          upvotes: number;
          _id: string;
        }) => (
          <PicCard
            image={pic.image}
            upvotes={pic.upvotes}
            id={pic._id}
            upvote={(amount: number) => {
              fetch("/api/upvote-pic", {
                method: "POST",
                body: JSON.stringify({
                  id: pic._id,
                  amount,
                }),
              }).then(() => {
                refresh();
              });
            }}
          />
        ))}
      </Box>
    </main>
  );
}
