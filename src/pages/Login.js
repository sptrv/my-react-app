import React, { useState, useEffect } from 'react';
import { Menu } from '../components/Menu.js';
import { auth, fs } from '../config/Config';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
    
    // Використання хука useNavigate для переходу між сторінками
    const navigate = useNavigate(); 

    // Стейти для зберігання даних форми
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Стейти для повідомлень про помилки та успішний вхід
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Функція обробки події входу
    const handleLogin = (e) => {
        e.preventDefault(); 

        // Аутентифікація користувача за допомогою електронної пошти та пароля
        auth.signInWithEmailAndPassword(email, password).then(() => {
            setSuccessMsg('Ви ввійшли успішно!'); 
            // Очищення полів форми після успішного входу
            setEmail('');
            setPassword('');
            setErrorMsg('');
            setTimeout(() => {
                setSuccessMsg('');
                navigate('/'); 
            }, 1000);
        }).catch(error => setErrorMsg(error.message)); 
    }

    // Функція для отримання поточного користувача
    function GetCurrentUser() {
        const [user, setUser] = useState(null);
        useEffect(() => {
            auth.onAuthStateChanged(user => {
                if (user) {
                    // Отримання даних користувача з бази даних при вході
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
            <Menu user={user}/>
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
                    <h1>Вхід</h1>
                    <hr></hr>
                    <br></br>

                    {/* Відображення повідомлень про успішний вхід або помилки */}
                    {successMsg && <>
                        <div className='success-msg'>{successMsg}</div>
                        <br></br>
                    </>}

                    <form autoComplete="off" onSubmit={handleLogin}>               
                        
                        <label>Е-пошта</label>
                        <input type="email" className='form-control' required onChange={(e) => setEmail(e.target.value)} value={email}></input>
                        <br></br>

                        <label>Пароль</label>
                        <input type="password" className='form-control' required onChange={(e) => setPassword(e.target.value)} value={password}></input>
                        <br></br>

                        <div className='btn-box'>
                            <span>У вас ще немає облікового запису?  
                                <Link to="/signup" className='link'>Зареєструватися</Link>
                            </span>
                            <br></br>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className='btn btn-md' style={{backgroundColor: '#f3c640'}}>
                               Увійти
                            </button>
                        </div>
                    </form>

                    {/* Відображення повідомлень про помилки */}
                    {errorMsg && <>
                        <br></br>
                        <div className='error-msg'>{errorMsg}</div>                
                    </>}
                </div> 
            </div> 
        </>
    );
}
