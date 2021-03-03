import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProductId } from "../../redux/actions/productActions";
import { addReview, getReviews } from "../../redux/actions/reviewActions";
/* import Rater from "react-rater";
import "react-rater/lib/react-rater.css"; */
import "./Product_Review.css";
/* import { GetUsers,setUsers } from '../../redux/actions/userActions'; */
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const ProductReviews = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const userAuthenticated = useSelector((state) => state.user.userAUTH);
  const [data, setData] = useState({
    description: "",
    rating: 0,
    count: 0,
    userId: userAuthenticated.id,
  });
  
  useEffect(() => {
    const cargarProductos = () => dispatch(getProductId(id));
    cargarProductos();
  }, []); 
  
  const handleChange = (e) =>
    setData({ ...data, count: e.target.value.length, description: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push('/')
    dispatch(addReview(data, id));
  };
  
  return (
    <div className="reviewsContainer">
      <Form onSubmit={handleSubmit}>
        <h2 className="reviewTitle">
          En <img src="https://bit.ly/37jca0M" style={{ height: "40px" }} /> nos
          importa lo que tenés para decir!
        </h2>
        <Form.Group controlId="formBasicEmail">
          <Form.Label className="label-description">
            Cuéntanos que te pareció el concierto de
          </Form.Label>
        </Form.Group>
        <textarea
          className="input-description"
          onChange={(e) => handleChange(e)}
          maxlength={1000}
          value={data.description}
        />
        <p>{data.count}/1000</p>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>¿Cómo calificarías tu experiencia?</Form.Label>
        </Form.Group>

        <ul className="rating-stars">
          {Array.apply(null, { length: 5 }).map((e, i) => {
            return (
              <li key={i}>
                {
                  <i
                    onClick={() => setData({ ...data, rating: i + 1 })}
                    className="fas fa-star"
                    value={data.rating}
                  ></i>
                }
              </li>
            );
          })}
        </ul>
        <Button variant="dark" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default ProductReviews;
{
  /*  <div className="reviewsContainer">
      <div className="reviewsHead">
        <div className="reviewsMedia">
          <span className="">{promedioReviews}</span>
        </div>
        <div className="reviewsStars">
          <Rater total={5} rating={promedioReviews} interactive={false} />
        </div>
        <div>
          {!modoReview && (
            <button
              onClick={() => {
                setmodoReview(true);
              }}
            >
              Escribir Review
            </button>
          )}
        </div>
      </div>
      {modoReview && (
        <div style={{{{ padding: "10px" }}>
          <textarea></textarea>
          <Rater total={5} rating={0} interactive={true} />
        </div>
      )}
      <div className="reviews">
        {reviews.map((rev) => (
          <div key={rev.id} className="reviewContainer">
            <span className="reviewTittle">{rev.title}</span>
            <span className="reviewUser">{rev.user}</span>
            <span className="review">{rev.review}</span>
          </div>
        ))}
      </div>
    </div>  */
}
