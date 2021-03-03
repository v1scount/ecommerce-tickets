import React from 'react'
import './ProductItem.css'

const ProducItem = ({product, onIncreaseCant, onDecreaseCant}) =>{
    return <div className = 'btn-groups'>
        <strong className="productNameCart">{product.name}</strong>
        { ' ' }
        <br/>
        <button id='decrease-btn' onClick={onDecreaseCant}>-</button>
        { ' ' }
        <button  id='increase-btn' onClick={onIncreaseCant}>+</button>
        <br/>
        <strong>Unidades:</strong> {product.cantidad} 
        <br/>
        <strong>Precio:</strong> 
        <br/>
        {product.price * product.cantidad}$               
    </div>
}
export default ProducItem