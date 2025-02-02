import React, { useState, useEffect, useContext } from "react";
import "./Navbar.css";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Context } from "../../Context/Context";
import axios from "axios";
import Logo from "../../Imagenes/ROLLFLIX-LOGO.jpg";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const toggleNav = () => {
    setIsMobile(!isMobile);
  };

  useEffect(() => {
    const changeWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", changeWidth);

    return () => {
      window.removeEventListener("resize", changeWidth);
    };
  }, []);

  //   DATA PARA SEARCHBAR
  const [films, setFilms] = useState([]);

  const getFilms = async () => {
    try {
      await axios.get(`https://rollflix-back.herokuapp.com/api/films/`).then((response) => {
        setFilms(response.data);
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getFilms();
  }, []);

  const [dataFiltrada, setDataFiltrada] = useState([]);
  const handleFilter = (e) => {
    const busqueda = e.target.value;
    const nuevoFiltro = films.filter((value) => {
      return value.nombre.toLowerCase().includes(busqueda.toLowerCase());
    });
    if (busqueda === "") {
      setDataFiltrada([]);
    } else {
      setDataFiltrada(nuevoFiltro);
    }
  };
  let navigate = useNavigate();

  const { user, dispatch } = useContext(Context);
  const [usuario, setUsuario] = useState([]);
  useEffect(() => {
    async function getUsuario() {
      try {
        const usuario = await axios.get(
          `https://rollflix-back.herokuapp.com/api/usuario/find/${user._id}`
        );
        setUsuario(usuario.data);
      } catch (err) {
        console.log("messaje", err);
      }
    }
    getUsuario();
  }, [user._id]);

  //CERRAR SESION
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <nav className="barra">
      <div className="contenedor-barra">
        <NavLink to="/">
          <img src={Logo} alt="logo Rollflix"></img>
        </NavLink>
        <div className="menu-icon" onClick={() => toggleNav(!isMobile)}>
          <i className={isMobile ? "fas fa-times" : "fas fa-bars"} />
        </div>
        <div
          className={
            isMobile && screenWidth < 860
              ? "barra-izquierda-mobile"
              : "barra-izquierda"
          }
        >
          <NavLink
            to="/"
            className="link"
            activeclassname="active-link"
            onClick={() => setIsMobile(!isMobile)}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/series"
            className="link"
            activeclassname="active-link"
            onClick={() => setIsMobile(!isMobile)}
          >
            Series
          </NavLink>
          <NavLink
            to="/peliculas"
            className="link"
            activeclassname="active-link"
            onClick={() => setIsMobile(!isMobile)}
          >
            Películas
          </NavLink>
          <NavLink
            to="/configuracion"
            className="link desktop"
            activeclassname="active-link"
            onClick={() => setIsMobile(!isMobile)}
          >
            Configuración
          </NavLink>
          <p className="link  desktop" onClick={() => setIsMobile(!isMobile)}>
            Cerrar Sesión
          </p>
        </div>
        <div className="barra-derecha">
          <div className="search-bar">
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Buscar"
                aria-label="Search"
                onChange={handleFilter}
              />
            </form>
            {dataFiltrada.length !== 0 && (
              <div className="dataResultado">
                {dataFiltrada.slice(0, 14).map((value, key) => {
                  return (
                    <Link
                      to={{ pathname: `/ver/${value._id}` }}
                      className="busqueda"
                    >
                      {value.nombre}
                    </Link>
                  );
                })}
              </div>
            )}
            <i className="fas fa-search"></i>
          </div>
          <div className="profile-user">
            {usuario?.fotoPerfil !== "" ? (
              <img
                src={usuario?.fotoPerfil}
                className="foto-perfil "
                alt="Foto de perfil"
              />
            ) : (
              <i className="fas fa-user-circle"></i>
            )}
            <span>{usuario?.username}</span>
          </div>
          <div className="perfil">
            <i className="fas fa-caret-down"></i>
            <div className="opciones">
              <NavLink to="/configuracion" className="link">
                Configuración
              </NavLink>
              <p className="link" onClick={handleLogout}>
                Cerrar Sesión
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
