"use client";

import { Suspense, useEffect, useState } from "react";
import TopBar from "./top-bar";
import Drawer from "./drawer";
import { fetchTopGenres } from "@/app/actions/repository";

export interface Props {
  open: boolean;
  toggleDrawer: (
    open: boolean
  ) => (_: React.KeyboardEvent | React.MouseEvent) => void;
}

const AppBar = () => {
  const [open, setOpen] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);

  const toggleDrawer =
    (open: boolean) => (_: React.KeyboardEvent | React.MouseEvent) => {
      setOpen(open);
    };

  useEffect(() => {
    const fetch = async () => {
      const genres = await fetchTopGenres();
      setGenres(genres);
    };
    fetch();
  }, []);

  return (
    <div>
      <TopBar open={open} toggleDrawer={toggleDrawer} />
      <Drawer open={open} toggleDrawer={toggleDrawer} genres={genres} />
    </div>
  );
};

export default AppBar;
