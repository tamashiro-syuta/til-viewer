"use client";

import { useState } from "react";
import Drawer from "../drawer";
import TopBar from "../top-bar";

export interface Props {
  open: boolean;
  toggleDrawer: (
    open: boolean
  ) => (_: React.KeyboardEvent | React.MouseEvent) => void;
}

const AppBar = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer =
    (open: boolean) => (_: React.KeyboardEvent | React.MouseEvent) => {
      setOpen(open);
    };

  return (
    <div>
      <TopBar open={open} toggleDrawer={toggleDrawer} />
      <Drawer open={open} toggleDrawer={toggleDrawer} />
    </div>
  );
};

export default AppBar;
