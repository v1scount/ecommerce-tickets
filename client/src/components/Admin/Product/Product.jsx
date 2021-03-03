import React from 'react';
import styles  from './product.module.css';  
import { useHistory } from "react-router-dom";
import Swal from 'sweetalert2';
//redux
import {useDispatch} from 'react-redux'
//actions
import {borrarProductoAction,obtenerProductoEditar} from '../../../redux/actions/productActions';  

const Product = ({producto}) => {
    
    const{id,img,name,price,stock,categories,description}=producto;
   
    //por si el producto no tiene imagen se muestra esta
    const defaultImg='http://localhost:3001/img/producto-sin-foto.jpg';
    
    const dispatch = useDispatch();

    const history = useHistory();//habilitar history para redireccion

    //Confirmar si desea eliminar
    const confirmarEliminarProducto = id => {
        //preguntaar al usuario
        Swal.fire({
            title: '¿Estas seguro?',
            text: "Un producto eliminado, no se podra recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, estoy consciente. Eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {

              //pasarlo al action
              dispatch(borrarProductoAction(id))
                
            }
        })
    }
 
    //funcion que dirige de forma programada 
    const redireccionarEdicion = producto=>{
        dispatch(obtenerProductoEditar(producto));
        history.push(`/admin/products/edit/${producto.id}`)
    }

    return ( 
        
        <tr key={id}>
            <td className={styles.columnImg}>
                <div  className={styles.imgContainer} >
                    <div className={styles.imgItem}>
                        {img!=="" ? 
                            <img src={img}  alt="foto producto" className={styles.imgProduct}/> 
                        :
                            <img src={defaultImg}  alt="foto producto" className={styles.imgProduct}/>
                        }
                    </div>
                </div> 
            </td>
            <td className={styles.columnas}>{name}</td>
            <td className={styles.columnas}> $ {price}</td>
            <td className={styles.columnas}>{stock}</td>
          
            <td className={styles.columnas}>{categories && categories.map(c=> c.name )}</td>
            
            <td className={styles.columnas}>{description}</td>
            <td className={styles.columnas}>
                <button 
                    type="button"
                    onClick={()=>redireccionarEdicion(producto)}
                    className="btn btn-primary m-1" id={styles.btnEditCustomized}
                >Editar 
                </button>
                <button 
                    className="btn btn-danger " id={styles.btnDeleteCustomized}
                    onClick={()=>confirmarEliminarProducto(id)}
                >Eliminar 
                </button>
            </td> 
        </tr>
       
     );
}
 
export default Product;