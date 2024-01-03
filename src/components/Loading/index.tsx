"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Loading() {
  const spinTransitionFineTuned = {
    rotate: {
      loop: Infinity,
      ease: "linear",
      duration: 1,
    },
    scale: {
      duration: 0.5,
    },
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <motion.div
        className="rounded-full  border-x-4  border-b-4 border-t-4 border-gray-00 border-solid h-12 w-12 animate-spin "
        style={{ borderTopColor: "#6174EE" }}
      ></motion.div>
    </div>
  );
}
