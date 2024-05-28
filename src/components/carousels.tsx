import { useState } from "react";
import { Carousel } from "react-bootstrap";
import ImageLazy from "./UI/lazy-image";
import React from "react";

const Carousels = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item className="carsouel__item">
        <ImageLazy
          className="lazy-carousel"
          style={{ width: "1600px" }}
          imageUrl="/images/2.jpg"
        />
      </Carousel.Item>
      <Carousel.Item className="carsouel__item">
        <ImageLazy
          className="lazy-carousel"
          style={{ width: "1600px" }}
          imageUrl="/images/p2.jpg"
        />
      </Carousel.Item>
      <Carousel.Item className="carsouel__item">
        <ImageLazy
          style={{ width: "1600px" }}
          className="lazy-carousel"
          imageUrl="/images/4.jpg"
        />
      </Carousel.Item>
    </Carousel>
  );
};

export default Carousels;
