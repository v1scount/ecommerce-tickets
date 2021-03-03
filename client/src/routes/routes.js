import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {PublicRoute,PrivateRoute,AdminRoute} from './helperRoutes';
//components
import Login from '../components/Login/Login';
import UserForm from '../components/User/UserForm.jsx';
import ProductCard from '../components/ProductCard/Product_Card';
import MusicBar from '../components/MusicBar/MusicBar';
import Carousel from '../components/Carousel/Carousel';
import Order from '../components/order/Order';
import Admin from '../components/Admin/Admin2/Admin'
import ProductsAdmin from "../components/Admin/Product/ProductsAdmin.jsx";
import ProductsForm from "../components/Admin/Product/ProductosForm.jsx";
import AddCategories from "../components/Admin/Category/AddCategories.jsx";
import CategoryAdmin from "../components/Admin/Category/CategoryAdmin.jsx";
import Orders from '../components/Admin/Orders/Orders'
import OrdersDetail from '../components/Admin/OrdersDetail/OrdersDetail';
import UserOrdersDetail from '../components/Admin/UserOrdersDetail/UserOrdersDetail';
import Checkout from '../components/Checkout/Checkout';
import Error404 from '../components/Error/Error404';
import AccountSettings from "../components/UserAccount/AccountSettings.jsx";
import UserOrders from "../components/UserAccount/Orders.jsx";
import UserPrivacity from "../components/UserAccount/Privacity.jsx";
import OrderProductsDetails from '../components/UserAccount/OrderProductsDetails';
//redux
import {useSelector} from 'react-redux';


const Routes = () => {

    //obtener el state
    const isAuth = useSelector(state =>state.user.isAuthenticated);
    let isAdmin = useSelector(state =>state.user.userAUTH);

    if(isAdmin && Object.keys(isAdmin).length >0){
        if(isAdmin.isAdmin==='false')isAdmin = false;
        if(isAdmin.isAdmin==='true')isAdmin = true;
    }else{
        isAdmin = false
    }

    return (
        <Switch>
             {/* Rutas de admin */}
             <AdminRoute exact path='/admin' component={Admin} isAuth={isAuth} isAdmin={isAdmin} />
            <AdminRoute exact path='/admin/products' component={ProductsAdmin} isAuth={isAuth} isAdmin={isAdmin}/>
            <AdminRoute exact path='/admin/products/new' component={ProductsForm} isAuth={isAuth} isAdmin={isAdmin}/>
            <AdminRoute exact path='/admin/products/edit/:id' component={ProductsForm} isAuth={isAuth} isAdmin={isAdmin}/>
            <AdminRoute exact path='/admin/categories/' component={CategoryAdmin} isAuth={isAuth} isAdmin={isAdmin}/>
            <AdminRoute exact path='/admin/categories/new' component={AddCategories} isAuth={isAuth} isAdmin={isAdmin}/>
            <AdminRoute exact path='/admin/orders' component={Orders} isAuth={isAuth} isAdmin={isAdmin}/>
            <AdminRoute exact path='/admin/orders/:id' component={OrdersDetail} isAuth={isAuth} isAdmin={isAdmin}/>
            <AdminRoute exact path='/admin/orders/users/:id' component={UserOrdersDetail} isAuth={isAuth} isAdmin={isAdmin}/>
            {/* Rutas privadas */}
            <PrivateRoute exact path='/order/checkout' component={Checkout} isAuth={isAuth}/>
            <PrivateRoute exact path='/account/me' component={AccountSettings} isAuth={isAuth}/>
            <PrivateRoute exact path='/account/me/orders' component={UserOrders} isAuth={isAuth}/>
            <PrivateRoute exact path='/account/me/privacity' component={UserPrivacity} isAuth={isAuth}/>
            <PublicRoute exact path='/account/me/orders/:id' component={OrderProductsDetails}/>
            {/* Rutas publicas */}
            <PublicRoute exact path='/login' component={Login}/>
            <PublicRoute exact path='/user' component={UserForm}/>
            <PublicRoute exact path='/products/:id' component={ProductCard}/>
            <PublicRoute exact path='/musicbar' component={MusicBar}/>
            <PublicRoute exact path="/" component={Carousel} />
            <PublicRoute exact path='/carousel' component={Carousel}/>
            <PublicRoute exact path='/order' component={Order}/>
            <PublicRoute exact path='/error404' component={Error404}/>
            <Route exact path="*" render={()=>{
                return <Redirect to ="/error404" />
            }}/> 
        </Switch>
    );
};

export default Routes 