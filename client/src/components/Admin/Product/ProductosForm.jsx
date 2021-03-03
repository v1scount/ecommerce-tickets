import React,{ useState,useEffect } from 'react';
import { Multiselect } from 'multiselect-react-dropdown';
import styles  from './productos-form.module.css';  
import { useDispatch,useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import {useHistory} from 'react-router-dom';
//actions de redux
import {crearNuevoProductoAction,editarProductoAction} from '../../../redux/actions/productActions'; 
import {mostrarAlerta, ocultarAlertaAction} from '../../../redux/actions/alertaActions'; 

import {getCategories} from '../../../redux/actions/categoryActions'; 

const ProductosForm = () => {
    //sestilos del select
    const style = {
        chips: {
        background: "#29c1eb"
        },
        searchBox: {
            backgroundColor:"#313131",
            
        },
            multiselectContainer: {
            color: "white"
        }
    };

    //utilizar usedispatch y crea una funcion
    const dispatch = useDispatch();
    const history = useHistory();

    //Acceder al state del store
    const cargando = useSelector(state=>state.products.loading);
    const error = useSelector(state=>state.products.error);
    const alerta = useSelector(state=>state.alerta.alerta);
    var productoEditar = useSelector(state=>state.products.productoeditar);

    
    //conseguir el id que viene por la url
    const { id } = useParams()
    //efecto para traer categories 
    useEffect(()=>{
        //consultar a la base de datos las categories
        const CargarCategories = async() => dispatch(getCategories());
        CargarCategories();
         //eslint-disable-next-line
    },[])

    //obtener el state de categories
    const categories = useSelector(state =>state.categories.categorias);
    const options=[];//para cargar las opciones que van en el select de categories
    const selectedValues = [];//va cargar los valores de categories cuando estemos en modo edicion
    //ASignar categorias a las opciones del select
    for (const key in categories) {
        options.push({genero:categories[key].name, id:categories[key].id});
    } 

    //Estado que indica si estamos en modo edicion o modo creacion de nuevo producto
    const [modoEdit, setModoEdit] = useState(false);
    //Estado de errores del formulario
    const [errors, setErrors] = useState("");
    //Estado  del input de imagen
    const [file, setFile] = useState("");
    //estado de values de inputs
    const [inputs, setInputs] = useState({});
    const {name,stock, price, description,video}=inputs;//para llenars los values de los input cuando estemos en modo deedicion
    const [ImgUrl, setImgUrl] = useState('http://localhost:3001/img/producto-sin-foto.jpg')

    //efecto para llenar el state  de inputs con los datos del producto a editar en caso de que estemos en modo edicion
    useEffect(()=>{
        if(id && productoEditar){ //verificamos que venga un id por la url y que tengamos en el state de redux el producto a editar esto para saber que estamos en modo edicion
            setModoEdit(true);
            const genre=[];
            productoEditar.categories.map(c=>{
                return genre.push(c.id)
            });
            setInputs({
                id:productoEditar.id,
                name:productoEditar.name,
                description:productoEditar.description,
                price:productoEditar.price,
                stock:productoEditar.stock,
                video:productoEditar.video,
                genre,
                
            })
            setImgUrl(productoEditar.img);
        }
         //eslint-disable-next-line
    },[productoEditar])
    
    if(productoEditar){
        productoEditar.categories.map(c=>{
            return selectedValues.push({genero:c.name,id:c.id})
        })
    }
    
    //manejador de imagen obtenida en el input
    const imageHandler = async (e)=>{
        const file = await obtenerFileImg(e);
        await setFile(file);
        let reader = new FileReader();
        if(file){
            reader.onload = (e)=>{
                if(reader.readyState === 2){
                    setImgUrl(reader.result)
                }
            }
                reader.readAsDataURL(file)
        }
        
    }
    //Obtener imagen local ddada por el usuario 
    const obtenerFileImg = async (e)=>{
        return e.target.files[0]
    }
    
    //conseguir los generos que selecciono el usuario en el select de categorias
    const onSelect=(selectedList, selectedItem) =>{//selectedList contiene los generos seleccionados
        var genre=[]
        selectedList.map(g=>{
            genre.push(g.id)
        })
        setInputs({
            ...inputs,
            genre: genre
        });
    }
    //Quitar los geneross que selecciono el usuario y que luego elimino en el select de categorias
    const onRemove=(selectedList, removedItem) => {//selectedList contiene los generos seleccionados y se actualzia cuando el usuario remueve una opcion
        var genre=[]
        selectedList.map(g=>{
            genre.push(g.id)
        })
        setInputs({
            ...inputs,
            genre: genre
        });
    }

    //manejar values de inputs
    const handleInputChange = (e)=> {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        });
        
        
    }

    //mandar llamar las action de producto action
    const addProduct = async producto => dispatch(crearNuevoProductoAction(producto));
    const editProduct = async producto => dispatch(editarProductoAction(producto,id));
   //cuando el usuario haga submit
    const submitNuevoProducto= async (e)=>{
        e.preventDefault();
        //validar formulario
        var alerta={
            msg:'Debe llenar todos los campos del formulario',
            classes:'alert alert-danger text-center text-uppercase p3'
        }
        if(inputs.name==='' || inputs.stock ===''|| inputs.description ===''|| inputs.price==='' || !inputs.genre) {
            dispatch(mostrarAlerta(alerta));
            return;
        }
        if (!modoEdit && file==='') {
            dispatch(mostrarAlerta(alerta));
            return;
        }
        if(inputs.genre && inputs.genre.length<1){
            dispatch(mostrarAlerta(alerta));
            return;
        }
        //si no hay errores
        dispatch(ocultarAlertaAction());

        //crear nuevoproducto
        const data = new FormData();
        if(productoEditar)
        data.append('id',productoEditar.id);
        data.append('name',inputs.name);
        data.append('stock',inputs.stock);
        data.append('description',inputs.description);
        data.append('price',inputs.price);
        data.append('genre',inputs.genre);
        data.append('video',inputs.video)
        data.append('file',file);
        console.log(inputs.video)
       
        if(modoEdit){
            await editProduct(data);
        }else if(!modoEdit){
            await addProduct(data);
        }
        //redireccionar
        history.push('/admin/products');
    }
   
    return (
        <div >
            <div className="d-flex justify-content-center" >
                <div xs={12} style={{marginTop:"20px"}} >
                {!modoEdit ? <h2>Agregar producto</h2> : <h2> Editar producto</h2>}
                    {alerta ? <p className={alerta.classes}>{alerta.msg}</p> : null}
                    <div className="mt-5" >
                        <form style={{width:"100%"}} onSubmit={submitNuevoProducto} >
                            <div className="mb-3">
                                <label htmlFor="nombre" className="form-label">Nombre: *</label>
                                <input type="text" className="form-control" id="name" value={ name || '' } placeholder="Producto" name="name" onChange={handleInputChange} maxLength="20" required />
                            </div>
                         
                            <div className="mb-3">
                                <label htmlFor="stock" className="form-label">Stock: *</label>
                                <input type="number" className="form-control" id="stock" value={ stock || '' } placeholder="Stock" name="stock"  onChange={handleInputChange} min="0" max="9999999" required/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="precio" className="form-label">Precio: *</label>
                                <input type="number" className="form-control" id="price" placeholder="Precio" value={ price || '' } name="price" onChange={handleInputChange} min="1" max="999999999"required/>
                            </div>
                            <div>
                                <label htmlFor="precio" className="form-label">Categoria: *</label>
                                <Multiselect
                                    options={options} // Options to display in the dropdown
                                    displayValue="genero" // Property name to display in the dropdown options
                                    style={style}
                                    onChange={handleInputChange}
                                    onSelect={onSelect}
                                    onRemove={onRemove}
                                    selectedValues={selectedValues}
                                    required
                                />
                            </div>
                            <div className="mt-3">
                                <label htmlFor="precio" className="form-label">Descripción: *</label>
                                <div className="form-floating">
                                    <textarea className="form-control"  id="descripcion" value={ description || '' } name="description" style={{height:"100px"}} onChange={handleInputChange} maxLength="250" required></textarea>
                                </div>
                            </div>
                            <div>
                                <div >
                                    <h6 className={styles.heading}>Agrega una imagen: </h6>
                                    <div className={styles.imgHolder}>
                                        <img src={ImgUrl}  id="" alt="" className={styles.img}/>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="imagen" className="form-label"></label>
                                    {modoEdit 
                                    ? <input type="file" className="form-control form-control-lg" className={styles.input}  name="img"  accept="image/x-png,image/jpeg,image/jpg" onChange={imageHandler} />
                                    : <input type="file" className="form-control form-control-lg" className={styles.input}  name="img"  accept="image/x-png,image/jpeg,image/jpg" onChange={imageHandler} required/>
                                    }
                                </div>
                            </div>
                            <br />                            <div className="#">
                                <label htmlFor="video" className="form-label">urlVideo: </label>
                                <input type="text" className="form-control" id="video" value={ video || '' } placeholder="URL" name="video" onChange={handleInputChange}  />
                            </div>
                            <div className={styles.btnForm} className="d-grid gap-2 col-6 mx-auto">
                                <button variant="success" type="Guardar" style={{marginBottom:"20px"}} >
                                {!modoEdit ? 'Guardar' : 'Actualizar' }
                                </button>
                            </div>
                        </form>
                        {cargando ? <p>Cargando...</p>:null}
                        {error ? <p className="alert alert-danger p2 mt-4 text-center">Hubo un error</p>:null}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ProductosForm;