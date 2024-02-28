import React from 'react';
import { Navbar, Container } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import { auth } from '../config/Config';

export const Menu = ({ user }) => {

    const navigate = useNavigate();

    // Функція виходу користувача з облікового запису
    const handleLogout = () => {
        auth.signOut().then(() => {
            navigate('/login');
        });
    }

    return (
        <Navbar className='navbar' fixed='top'>
            <Container>
                <div className='logo'>
                    <div>
                        <Link to="/" className='link'>
                            <img src={logo} alt="logo" />
                        </Link>
                    </div>
                </div>
                <div className='rightside'>
                    {/* Відображення елементів меню залежно від статусу користувача */}
                    {!user && <>
                        <div>
                            <Link to="/signup" className='navlink'>ЗАРЕЄСТРУВАТИСЬ</Link>
                        </div>
                        <div>
                            <Link to="/login" className='navlink'>УВІЙТИ</Link>
                        </div>
                    </>}
                    {user && <>
                        <div>
                            <Link className='navlink' to="">{user}</Link>
                        </div>
                        <div className='btn btn-md' style={{fontWeight: 'bold', backgroundColor: '#f3c640'}} onClick={handleLogout}>
                            ВИЙТИ
                        </div>
                    </>}
                </div>
            </Container>
        </Navbar>
    )
}


