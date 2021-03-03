import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import Pagination from "../Pagination/Pagination";
import Product from "../Product/Product.jsx";
import "./catalogue.css";
import { getProducts } from "../../redux/actions/productActions";
import { Context } from "../../App";
import spinner from "../Spinner";
import { getAllReviews } from "../../redux/actions/reviewActions";
import { getUserOrderDetail } from "../../redux/actions/orderActions.js";
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
// aca se van a renderizar todas las card de product

const Cataloge = () => {
  const { currentCategory } = useContext(Context);
  const [productos, setProductos] = useState([]);
  //traigo los datos del array "productos" del estado inicial, que está adentro de un array "products"
  const products = useSelector((state) => state.products.productos);
  //constantes para la paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage, setProductPerPage] = useState(12);
  const indexOfLastProduct = currentPage * productPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productPerPage;
  const userAuthenticated = useSelector((state) => state.user.userAUTH);
  const userData = useSelector((state) => state.user);

  const idUser = useSelector((state) => state.user.userAUTH);
  const [state, setState] = useState(0); //Estado solamente para que el useEffect reconozca
  //un cambio en el componente y lo vuelva a renderizar

  useEffect(() => {
    if (userData.isAuthenticated) {
      const obtenerUserOrden = () => dispatch(getUserOrderDetail(idUser.id));
      obtenerUserOrden();
    }
  }, [state]);

  if (!products.data) {
    var currentProducts = !productos
      ? spinner()
      : Array.isArray(productos) &&
        productos.slice(indexOfFirstProduct, indexOfLastProduct);
  } else {
    currentProducts = products.data;
  }

  const paginate = (pageNum) => setCurrentPage(pageNum);
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  useEffect(() => {
    //si no hay productos, aparece el spinner
    if (!products) return spinner();
    //cuando entra en / la categoría es 'All', está seteada así en Sidebar, y renderiza todos los productos
    (async () => {
      try {
        if (currentCategory === "All") await setProductos(products);
      } catch (error) {
        console.log(error);
      }
    })();
  });

  useEffect(() => {
    if (!products) return spinner();
    (async () => {
      //una vez la categoría cambia de All a cualquier otro nombre, va a insertar en un nuevo array el producto que tenga esa categoría asociada
      if (currentCategory !== "All") {
        const filterProducts = [];
        Array.isArray(products) &&
          products.forEach((producto) =>
            producto.categories.forEach((categoria) => {
              if (categoria.name == currentCategory) {
                filterProducts.push(producto);
              }
            })
          );
        await setProductos(filterProducts);
      }
    })();
  }, [currentCategory]);

  const dispatch = useDispatch();

  useEffect(() => {
    const cargarProductos = () => dispatch(getProducts());
    setProductos(cargarProductos());
  }, []);

  useEffect(() => {
    const getReviews = () => dispatch(getAllReviews());
    getReviews();
  }, []);

  return (
    <div>
      <div className="box">
        <div className="containerCatalogue">
          {!currentProducts
            ? spinner()
            : currentProducts.map((i) => {
                //validamos el stock. En caso que este agotado, le agregamos una propiedad
                //para utilizarlo despues
                if (i.stock === 0) {
                  return (
                    <div key={i.id}>
                      <Product
                        image={i.img}
                        name={i.name}
                        price={i.price}
                        description={i.description}
                        id={i.id}
                        sold_out={true}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div key={i.id}>
                      <Product
                        image={i.img}
                        name={i.name}
                        price={i.price}
                        description={i.description}
                        id={i.id}
                        sold_out={false}
                      />
                    </div>
                  );
                }
              })}

          <div className="pag">
            <div className="pagnation">
              <Pagination
                productPerPage={productPerPage}
                totalproduct={products.length}
                paginate={paginate}
                nextPage={nextPage}
                prevPage={prevPage}
                currentPage={currentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cataloge;
