import React, {useState} from "react";
import { connect } from "react-redux";
import { addCategory } from "../../../redux/actions/categoryActions";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styles from "./addCategories.module.css";

function AddCategories (props) {

 //useHistory para redireccion
 const history = useHistory();

const [data, setData] = useState({
	name: "",
	description: ""
});


const handleSubmit = (event) => {
	event.preventDefault ();
	console.log(data.name, data.description)

	if (data.name && data.description !== '') {
	props.addCategory(data);
	history.push('/admin/categories')
	return}

	 Swal.fire({
            title: 'Error',
            text: "Por favor, ingrese todos los campos correctamente",
            icon: 'error',
            confirmButtonText: 'Aceptar'
            })
	  

	
}

const handleChange = (event) => {
	setData ({...data,
		 [event.target.name] : event.target.value
	})
}




	return (
		<div className = {styles.divFather}>
			<Form onSubmit = {handleSubmit} /* style={{marginLeft:"400px", padding:"40px"}} */>
	 		<div>
	 		<h3 className = {styles.center}>Agregar Categoria </h3>
	 		<br/>
	 		<Form.Label className = {styles.labelName}> Nombre:* </Form.Label>
	 		<Form.Control className = {styles.formName} type="text" column = "sm" size = "sm" name = "name" onChange={handleChange} value = {data.name}/>
	 		<br/>
	 		<Form.Label className = {styles.labelDescription}> Descripcion:* </Form.Label>
	 		<Form.Control className = {styles.formDescription} type= "text" name = "description"  onChange={handleChange} value = {data.description} />
	 		<br/>
	 		<Button type = "submit" className = {styles.btnSubmit}> Añadir</Button>
	 		</div>
	 		</Form>



    </div>)
}

function mapDispatchToProps (dispatch) {
	return {
		addCategory : data => dispatch (addCategory(data))
	}
}

export default connect (null, mapDispatchToProps) (AddCategories);
