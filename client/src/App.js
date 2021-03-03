import React, { useState } from 'react';
import './App.css';
import store from './redux/store';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from './components/toaster/toaster';
import Catalogue from "./components/Catalogue/Catalogue.jsx";
import SearchBar from './components/Nav/Nav.jsx';
import Sidebar from './components/Sidenavbar/Sidebar';
import SideBarRight from './components/SideBarRight/SideBarRight';
import Routes from './routes/routes';

// el Context es para crear la conexión entre las acciones de Sidebar y el catálogo, para poner conectar el filtrado
export const Context = React.createContext({
  currentCategory: null,
  setCurrentCategory: () => { },
  isRightBarOpen: null,
  setRightBarOpen: () => { },
  dropdownSideBar: null,
  setDropdownSideBar: () => { }
});

function App() {
  const [currentCategory, setCurrentCategory] = useState('All');
  const [isRightBarOpen, setRightBarOpen] = useState(false);
  const [dropdownSideBar, setDropdownSideBar] = useState('x');

  return (
    <Provider store={store}>
      <BrowserRouter>
        {/* esto es parte de context, le paso las acciones que quiero conectar y en qué componentes */}
        <Context.Provider value={{ currentCategory, setCurrentCategory, isRightBarOpen, setRightBarOpen, dropdownSideBar, setDropdownSideBar }}>
          <Sidebar />
          <Route exact path="/" component={Catalogue} />
          <Route path="/" component={SideBarRight}/>
          <Toaster />
          <Route path="/" component={SearchBar} />
        
          <Routes/>
        </Context.Provider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

