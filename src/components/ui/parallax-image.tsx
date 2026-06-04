"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image, { ImageProps } from "next/image";
import { useRef } from "react";

interface ParallaxImageProps extends Omit<ImageProps, "className"> {
  containerClassName?: string;
  imageClassName?: string;
  offset?: number;
}

export function ParallaxImage({ 
  containerClassName = "", 
  imageClassName = "", 
  offset = 20, 
  ...props 
}: ParallaxImageProps) {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`-${offset}%`, `${offset}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden w-full h-full ${containerClassName}`}>
      <motion.div 
        style={{ y }} 
        className="absolute w-full h-full"
        // Scale up the inner div so it never reveals empty space during parallax
        initial={{ scale: 1 + (offset * 2) / 100 }}
      >
        <Image 
          {...props} 
          className={`object-cover ${imageClassName}`} 
        />
      </motion.div>
    </div>
  );
}
