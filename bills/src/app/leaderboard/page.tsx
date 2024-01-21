"use client";
import { PrimaryButton, darkHoverOrange, darkOrange, hoverOrange, orange } from "@bills/theme";
import { AspectRatio, Box, Button, Card, CardContent, CardOverflow } from "@mui/joy";
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

  return (
    <Card sx={{ width: "100%", maxWidth: "300px", m: 2 }}>
      <CardOverflow>
        <AspectRatio ratio="1">
          <Image
            src={"data:image/jpg;base64," + image}
            alt="placeholder"
            fill={true}
          />
        </AspectRatio>
      </CardOverflow>
      <CardContent>
        <p>{upvotes} upvote{upvotes != 1 ? 's' : ''}</p>
      </CardContent>
      <CardOverflow>
        <PrimaryButton
          onClick={() => {
            setUpvoted(!upvoted);
            upvote(upvoted ? -1 : 1);
          }}
          color={upvoted ? "neutral" : "primary"}
          sx={{
            backgroundColor: upvoted ? darkOrange : orange,
            transition: "background-color 0.1s ease-out",
            ":hover": {
              backgroundColor: upvoted ? darkHoverOrange : hoverOrange,
            },
          }}
        >
          {!upvoted ? "Upvote" : "Remove upvote"}{" "}
        </PrimaryButton>
      </CardOverflow>
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
        sx={theme => ({
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          [theme.breakpoints.down("sm")]: {
            justifyContent: "center",
          },
          
        })}
      >
        {pics.map((pic) => (
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
