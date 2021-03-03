import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import styles from "./navBar.module.css";
import OrdersDetail from "../Admin/OrdersDetail/OrdersDetail";
import {NavLink} from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import {getUser} from "../../redux/actions/userActions"
import {logoutAction} from "../../redux/actions/userActions";
import {clearCarrito} from '../../redux/reducers/carritoReducer'

export default function UserNavBar () {

	const dispatch = useDispatch()
	const authUser = useSelector((state)=> state.user.userAUTH)

	const handleLogout=async ()=>{
		//mandar llamar las action de user action
		dispatch(clearCarrito());
		const logoutUser = async () => dispatch(logoutAction());
		await logoutUser();
	
	
		//vaciar local storage
		await window.localStorage.clear()
	
	
		return 
	 }


	return (	<div>
				<div className = {styles.divNavBar}> 
				<img src = {authUser.photoURL} className = {styles.img}/>
				<DropdownButton id="dropdown-basic-button" className = {styles.dropdownbutton} title={authUser.username}>
  					<Dropdown.Item href="/account/me">Mi cuenta</Dropdown.Item>
  					<Dropdown.Item href="/account/me/orders">Compras</Dropdown.Item>
  					<Dropdown.Item href="/account/me/privacity">Privacidad</Dropdown.Item>
   					<Dropdown.Item href="/" onClick = {handleLogout}>Salir</Dropdown.Item>
				</DropdownButton>
				</div>
				

			</div>)
}