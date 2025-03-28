import React from "react";
import { Container, Typography, Box, useTheme } from "@mui/material";
import Marquee from "react-fast-marquee";
import { IconType } from "react-icons";
import {
  SiApple,
  SiSamsung,
  SiHuawei,
  SiXiaomi,
  SiDell,
  SiHp,
  SiAsus,
  SiLenovo,
  SiSony,
  SiBose,
  SiOneplus,
  SiNvidia,
} from "react-icons/si";

const GoogleLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 48 48"
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
      c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4
      C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
      C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    ></path>
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238
      C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025
      C9.505,39.556,16.227,44,24,44z"
    ></path>
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
      c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
  </svg>
);

interface TechIconItem {
  icon: IconType | null;
  label: string;
  color: string;
}

const techIcons: TechIconItem[] = [
  { icon: SiApple, label: "Apple", color: "#000000" },
  { icon: SiSamsung, label: "Samsung", color: "#1428A0" },
  { icon: SiHuawei, label: "Huawei", color: "#E2231A" },
  { icon: SiXiaomi, label: "Xiaomi", color: "#FF6900" },
  { icon: SiDell, label: "Dell", color: "#007DB8" },
  { icon: SiHp, label: "HP", color: "#0096D6" },
  { icon: SiAsus, label: "Asus", color: "#010101" },
  { icon: SiLenovo, label: "Lenovo", color: "#E2231A" },
  { icon: SiSony, label: "Sony", color: "#000000" },
  { icon: SiBose, label: "Bose", color: "#000000" },
  { icon: SiOneplus, label: "OnePlus", color: "#F50157" },
  { icon: SiNvidia, label: "Nvidia", color: "#76B900" },
  { icon: null, label: "Google", color: "multicolor" },
];

const BrandsMarquee = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
        py: theme.spacing(4),
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            overflow: "hidden",
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <Marquee pauseOnHover speed={50} gradient={false}>
            {techIcons.map((item, index) => (
              <Box
                key={`${item.label}-${index}`}
                sx={{
                  width: 64,
                  height: 64,
                  mx: theme.spacing(4),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.label === "Google" || item.icon === null ? (
                  <GoogleLogo />
                ) : (
                  React.createElement(item.icon as IconType, {
                    style: { color: item.color, width: "100%", height: "100%" },
                    title: item.label,
                  })
                )}
              </Box>
            ))}
          </Marquee>
        </Box>
      </Container>
    </Box>
  );
};

export default BrandsMarquee;
