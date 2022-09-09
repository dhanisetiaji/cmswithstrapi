import React from 'react'
import { Link } from 'react-router-dom'
import './navbar.scss'
import { TbLayoutDashboard } from 'react-icons/tb'
import { FiPackage } from 'react-icons/fi'
import { AiOutlinePlusSquare } from 'react-icons/ai'
import { RiFileUserLine } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { AuthLogout } from '../../redux/actions/auth'
import { useLocation } from "react-router-dom"

const Navbar = () => {
    const dispatch = useDispatch()
    const { pathname } = useLocation()


    const handleLogout = (e) => {
        e.preventDefault()
        dispatch(AuthLogout())
    }
    return (
        <nav className="navbar navbar-expand-lg mt-2 mb-3">
            <div className="container">
                <div className="navbar-brand">
                    <Link className='navbar-brand' to="/">Travel</Link>
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <img src="../img/toggle.svg" alt="toggle" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link to={"/"} className={pathname === '/' ? 'nav-link bottom-text active' : 'nav-link bottom-text'}><TbLayoutDashboard className='iconNavbar' /> Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={"/packages"} className={pathname === '/packages' ? 'nav-link bottom-text active' : 'nav-link bottom-text'}><FiPackage className='iconNavbar' />Package</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={"/orders"} className={pathname === '/orders' ? 'nav-link bottom-text active' : 'nav-link bottom-text'}><AiOutlinePlusSquare className='iconNavbar' />Orders</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={"/customers"} className={pathname === '/customers' ? 'nav-link bottom-text active' : 'nav-link bottom-text'}><RiFileUserLine className='iconNavbar' />Customers</Link>
                        </li>
                        <li className="nav-item d-block d-lg-none">
                            <Link to={'/#'} onClick={e => handleLogout(e)} className="nav-link bottom-text">Logout</Link>
                        </li>
                    </ul>
                    <div className="btn-group d-none d-lg-block">
                        <a role='button' className="img-profile" href='/#' id="dropdownCenterBtn" data-bs-toggle="dropdown" aria-expanded="false">
                            <img className="rounded-circle" src="../img/profile.png" alt="profile" />
                        </a>
                        <ul className="dropdown-menu dropdown-menu-lg-end" aria-labelledby="dropdownCenterBtn">
                            <li><span onClick={e => handleLogout(e)} className="dropdown-item pointer">Logout</span></li>
                        </ul>
                    </div>

                </div>
            </div>
        </nav>
    )
}

export default Navbar