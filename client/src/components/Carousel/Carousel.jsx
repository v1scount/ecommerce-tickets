import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import "./Carousel.css";

const HandleCarousel = () => {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex, e) => setIndex(selectedIndex);
  return (
    <div>
      <h1 className="catalogueParent-h1" >
        News
      </h1>
      <hr className="lineParent-h1"/>
      <div className="carouselDiv">
        <Carousel activeIndex={index} onSelect={handleSelect}>
          <Carousel.Item>
            <img
              className="d-block w-10"
              id="img-carousel"
              src="https://drake-tickets.com/image.jpg"
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>Drake 2021</h3>
              <p>Consigue tus entradas con nosotros</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-10"
              id="img-carousel"
              src="https://scontent.faep9-2.fna.fbcdn.net/v/t1.0-9/90056090_2581351602140029_8162921753656426496_n.jpg?_nc_cat=106&ccb=2&_nc_sid=8bfeb9&_nc_ohc=ZoB-4ZdLXnEAX-z7WTh&_nc_ht=scontent.faep9-2.fna&oh=4fdbe980f66d3e4855e1017bec880d06&oe=60193918"
              alt="Second slide"
            />

            <Carousel.Caption>
              <h3>El regreso de Linkin Park</h3>
              <p>
                Sé testigo del regreso de los legendarios autores de In The End
              </p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-10"
              id="img-carousel"
              src="https://thumbs.gfycat.com/BleakApprehensiveArrowworm-size_restricted.gif"
              alt="Third slide"
            />
            <Carousel.Caption>
              <h3>El último tour</h3>
              <p>Consigue tus entradas al mejor precio con nosotros!</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <h2 className="box-h1">Inicio</h2>
        <hr className="lineBox-h1" />
      </div>
    </div>
  );
};

export default HandleCarousel;
