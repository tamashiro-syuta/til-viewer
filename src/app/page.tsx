import Image from "next/image";
import styles from "./page.module.css";
import { Button, Container } from "@mui/material";
import Card from "@/components/card";

export default function Home() {
  return (
    <Container sx={{ marginTop: 2 }}>
      <Card />
    </Container>
  );
}
