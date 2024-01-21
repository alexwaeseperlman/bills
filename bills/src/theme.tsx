import { Button, styled } from "@mui/joy";

export const orange = "#FFA500";
export const hoverOrange = "#bc7b04";
export const darkOrange = "#aaa";
export const darkHoverOrange = "#888";

export const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: orange,
  transition: "background-color 0.1s ease-out",
  ":hover": {
    backgroundColor: hoverOrange,
  },
}));

export const PrimaryButtonOutlined = styled(Button)(({ theme }) => ({
  border: `1px solid ${orange}`,
  color: orange,
  transition: "background-color 0.1s ease-out",
  ":hover": {
    backgroundColor: hoverOrange,
  },
}));