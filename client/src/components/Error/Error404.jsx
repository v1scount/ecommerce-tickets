import React from "react";
import { Link } from "react-router-dom";
import './error404.css';
import astronauta from "./img/astronauta.png";

const PageNotFound = () => (

  <div className="bodyerror">
	  <div class="circle move" data-value="-1"></div>
    <div class="circle move" data-value="-1"></div>
    <div class="circle move" data-value="-1"></div>
    <div class="circle move" data-value="-1"></div>
 
    <div class="containerError">
        <p>Parece que estás perdido en el espacio</p>
        <h1>404</h1>
        <Link to={'/'}>Volver al inicio</Link>
        <img src={astronauta} alt="Astronaut_img"/>
    </div>
   
  </div>
)
export default PageNotFound