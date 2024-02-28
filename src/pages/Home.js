import React, { useState, useEffect } from 'react';
import { Menu } from '../components/Menu.js';
import { auth, fs } from '../config/Config';
import { Link } from 'react-router-dom';

export const Home = () => {

    // Функція для отримання поточного користувача
    function GetCurrentUser() {
        const [user, setUser] = useState(null);
        useEffect(() => {
            auth.onAuthStateChanged(user => {
                if (user) {
                    // Отримання даних користувача з бази даних
                    fs.collection('users').doc(user.uid).get().then(snapshot => {
                        setUser(snapshot.data().FirstName);
                    });
                } else {
                    setUser(null);
                }
            });
        }, []);
        return user;
    }

    const user = GetCurrentUser();

    return (
        <>
            <Menu user={user} /> 
            <div className='side-navbar'>
                <div className='navbar-box'>
                    <h1>-</h1>
                    <br></br>
                    <div>
                        <Link className='navlink' to="/orders">Мої замовлення</Link>
                    </div>
                    <br></br>
                    <div>
                        <Link className='navlink' to="/add-order">Зробити замовлення</Link>
                    </div>
                    <br></br>
                    <div className='navlink'>Міжнародні доставки</div><br></br>
                    <div className='navlink'>Вартість доставки</div><br></br>
                    <div className='navlink'>Терміни доставки</div><br></br>
                    <div className='navlink'>Відділення</div><br></br>
                    <div className='navlink'>Розклад</div><br></br>
                    <div className='navlink'>Про нас</div>
                </div>
                <div className='box'>
                    <h1>Головна сторінка</h1>
                    <hr></hr>
                    <br></br>
                </div>
            </div>
        </>
    )
}
