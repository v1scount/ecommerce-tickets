import React,{useState,useEffect} from 'react';
import styles  from './productsAdmin.module.css';  
import { useHistory } from "react-router-dom";
import Pagination from '../../Pagination/Pagination'
import Producto from './Product';
//redux
import {useSelector,useDispatch} from 'react-redux'
//actions
import {obtenerProductosAction,obtenerProductoEditar} from '../../../redux/actions/productActions';  


const ProductsAdmin = () => {

    const dispatch = useDispatch();
    const history = useHistory();//habilitar history para redireccion

    useEffect(()=>{
        //consultar la base de datos 
        const cargarProductos = ()=> dispatch(obtenerProductosAction());
        cargarProductos()
        //eslint-disable-next-line
    },[])

    //obtener el state
    const data = useSelector(state =>state.products.productos);
    const error = useSelector(state=>state.products.error);
    const cargando = useSelector(state=>state.products.loading);

    //constantes para la paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const [productPerPage] = useState(10);
    const indexOfLastProduct = currentPage * productPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productPerPage;
    const currentProducts = Array.isArray(data) && data.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );
    const paginate = (pageNum) => setCurrentPage(pageNum);
    const nextPage = () => setCurrentPage(currentPage + 1);
    const prevPage = () => setCurrentPage(currentPage - 1);

  
    //funcion que dirige de forma programada, En este caso como es un producto nuevo aqui seteamos a null el estado en redux de productoEditar, pra que el form no se cargue con datos 
    const redireccionarEdicion = producto=>{
        dispatch(obtenerProductoEditar(producto));
        history.push(`/admin/products/new`)
    }

    return (
        <div className={styles.productos}>
            <div className={styles.title}>
                <strong><h2 >Lista de Productos</h2></strong>
            </div>
            {error ? <p className="font-weight-bold alert alert-danger text-center mt-4">Hubo un error</p>: null}
            {cargando ? <p className="text-center">Cargando...</p>:null}
            <div className={styles.btnDiv}>
                <button 
                    onClick={()=>redireccionarEdicion("")}
                    className="btn btn-info nuevo-post d-block d-md-inline-block" id={styles.btnCustomized}
                >Agregar Producto &#43;
                </button>
            </div>
            <div className={styles.containerTable}> 
                <div className={styles.table}>
                    <div className={styles.tableBody}>
                    <table className="table table-dark">
                        <thead  className={styles.tableahead}>
                            <tr>
                                <th scope="col"  className={styles.columnImg}>Imagen</th>
                                <th scope="col"  className={styles.columnas}>Nombre</th>
                                <th scope="col"  className={styles.columnas}>Precio</th>
                                <th scope="col"  className={styles.columnas}>Stock</th>
                                <th scope="col"  className={styles.columnas}>Categoria</th>
                                <th scope="col"  className={styles.columnas}>Descripción</th>
                                <th scope="col"  className={styles.columnas}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tableBodyProducts}>
                            {currentProducts.length === 0 ? <tr><td colSpan="7"> No hay productos</td></tr>: (
                                Array.isArray(currentProducts) && currentProducts.map(producto => (
                                    <Producto
                                        key={producto.id}
                                        producto={producto}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                    </div>
                    <Pagination
                        productPerPage={productPerPage}
                        totalproduct={data.length}
                        paginate={paginate}
                        nextPage={nextPage}
                        prevPage={prevPage}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        </div>
    );
}

export default ProductsAdmin;