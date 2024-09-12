import "./styles.css";
import * as React from "react";
import { motion, useCycle } from "framer-motion";
import { MenuToggle } from "./Toggle";
import { Navigation } from "./Nav";

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2
    }
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  }
};


const ChatButton = () => {

  const [isOpen, toggleOpen] = useCycle(false, true);

  return (
    <>
      <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        custom="100%"
      >
        <motion.div className="navbar" variants={sidebar} />
        <Navigation />
        <MenuToggle toggle={() => toggleOpen()} />
      </motion.nav>
    </>
  );
}

export default ChatButton
