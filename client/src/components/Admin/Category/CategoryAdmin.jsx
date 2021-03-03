import React ,{useState, useEffect }from 'react';
import {useDispatch, useSelector} from "react-redux";
import styles  from './categoryAdmin.module.css';  
import { Link, useHistory } from "react-router-dom";
import Pagination from '../../Pagination/Pagination'
import { getCategoriesAdmin, deleteCategory, editCategory } from "../../../redux/actions/categoryActions";
import data from '../../../data/categories.json';
import Swal from "sweetalert2";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';



const CategoryAdmin = () => {

    const dispatch = useDispatch ();

    //Traemos el state de redux de categories para poder acceder al arreglo con todas las categorias
    const res = useSelector ((state) => state.categories.categorias)

    //Traemos todas categorias para renderizarlas en el CRUD
    useEffect(() => {
      const obtenerCategorias = () => dispatch (getCategoriesAdmin());
       obtenerCategorias()
    }, [])

    //Handler para eliminar categoria  
    const eliminarCategoria = (id) => {
        Swal.fire({
                title: 'Eliminar categoría',
                text: "¿Esta seguro que desea eliminar la categoría? Una vez eliminada no se podrá recuperar.",
                icon: 'warning',
                confirmButtonText: 'Confirmar',
                showDenyButton: true,
                denyButtonText: "No"
            })
        .then((result) => {
            if (result.isConfirmed) {
              dispatch(deleteCategory (id))
            }
        })}

    //State para mostrar form de editar categoria en este mismo componente
    const [editState, setEditState] = useState(false); //inicialmente en false 

    //Handler para cambiar el estado y volver a renderizar el paginado de categorias
    const handleEdit = function () {
    {setEditState (!editState)}
    } 

    //Obtener el Id de la categoria
     function getCategoryId (id) {
         window.categoriaid = id //Guardo el id de la categoria en global
    }

    const [data, setData] = useState({
    name: "",
    description: ""
});
    //UseHistory para redireccionar
    const history = useHistory();


const handleSubmit = (event) => {

    event.preventDefault ();
    console.log(data.name, data.description)

    if (data.name && data.description !== '') {
    dispatch (editCategory(window.categoriaid, data))
    Swal.fire ({
        title: "Categoría actualizada",
        text: "La categoría ha sido actualizada correctamente",
        icon: "success",
        confirmButtonText: "Aceptar"
    })
    handleEdit()
    return}

     Swal.fire({
            title: "Error",
            text: 'Por favor, ingrese todos los campos correctamente',
            icon: 'error',
            confirmButtonText: 'Aceptar'
            })
}

console.log(window.categoriaid)
    console.log(data)

const handleChange = (event) => {
    setData ({...data,
         [event.target.name] : event.target.value
    })
}

        //constantes para la paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const [productPerPage] = useState(10);
    const indexOfLastProduct = currentPage * productPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productPerPage;
    const currentCategories = res.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );
    const paginate = (pageNum) => setCurrentPage(pageNum);
    const nextPage = () => setCurrentPage(currentPage + 1);
    const prevPage = () => setCurrentPage(currentPage - 1);

    if (editState === false) {
    return (
        <div className={styles.productos}>
            <div className={styles.title}>
                <h2 >Lista de Categorias</h2>
            </div>
            <div className={styles.btnDiv}>
                <Link to={"/admin/categories/new"}
                    className="btn btn-info nuevo-post d-block d-md-inline-block" id={styles.btnCustomized}
                >Agregar Categoria &#43;
                </Link>
            </div>
            <div className={styles.containerTable}> 
                <div className={styles.table}>
                    <table className="table table-dark">
                        <thead  className={styles.tableahead}>
                            <tr>
                                <th scope="col"  className={styles.columnas}>Nombre</th>
                                <th scope="col"  className={styles.columnas}>Descripción</th>
                                <th scope="col"  className={styles.columnas}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCategories.length === 0 ?'No hay categorias':currentCategories.map(item => (
                                <tr key={item.id}>
                                    <td className={styles.columnas}>{item.name}</td>
                                    <td className={styles.columnas}>{item.description}</td>
                                    <td className={styles.columnas}>
                                        <button 
                                            type="button"
                                            className="btn btn-primary m-1 "
                                            onClick={() => {
                                        getCategoryId(item.id);
                                        handleEdit();
                                        }}
                                        id={styles.btnEditCustomized}
                                        >Editar</button>
                                        <button
                                        type="button"
                                        className="btn btn-danger m-1"
                                        onClick = {()=> eliminarCategoria(item.id)}
                                        id={styles.btnDeleteCustomized}

                                        >Eliminar</button>
                                    </td> 
                                </tr>
                            ))}
                           
                        </tbody>
                    </table>
                    <Pagination
                        productPerPage={productPerPage}
                        totalproduct={res.length}
                        paginate={paginate}
                        nextPage={nextPage}
                        prevPage={prevPage}
                        currentPage={currentPage}
                    />
                   
                </div>
            </div>
        </div>
    );
    } else{

        return (
        <div className = "containerEditDiv">
            <Form onSubmit = {handleSubmit} style={{marginLeft:"400px", padding:"40px"}}>
            <div>
            <h3 className = {styles.center}>Editar Categoria </h3>
            <br/>
            <Form.Label> Nombre:* </Form.Label>
            <Form.Control type="text" column = "sm" size = "sm" name = "name" onChange={handleChange} value = {data.name}/>
            <br/>
            <Form.Label> Descripcion:* </Form.Label>
            <Form.Control type= "text" name = "description"  onChange={handleChange} value = {data.description} />
            <br/>
            <Button type = "submit"> GUARDAR</Button>
            </div>
            </Form>
    </div>)
    }
}




export default CategoryAdmin;