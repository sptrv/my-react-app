import React, { useState, useEffect } from 'react';
import { Menu } from '../components/Menu.js';
import { auth, fs } from '../config/Config.js';
import { Link, useNavigate } from 'react-router-dom';

export const Signup = () => {
    
    // Використання хука useNavigate для переходу між сторінками
    const navigate = useNavigate(); 

    // Стейти для зберігання даних форми
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [type, setType] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Стейти для повідомлень про помилки та успішну реєстрацію
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Функція обробки події реєстрації
    const handleSignup = (e) => {
        e.preventDefault(); 

        // Створення користувача з електронною поштою та паролем
        auth.createUserWithEmailAndPassword(email, password).then((credentials) => {
            console.log(credentials);
            // Додавання користувача в базу даних після успішної аутентифікації
            fs.collection('users').doc(credentials.user.uid).set({
                FirstName: firstName,
                LastName: lastName,
                Phone: phone,
                Email: email,
                Type: type,
                Password: password
            }).then(() => {
                setSuccessMsg('Реєстрація пройшла успішно!'); 
                // Очищення полів форми після успішної реєстрації
                setFirstName('');
                setLastName('');
                setEmail('');
                setType('');
                setPhone('');
                setPassword('');
                setErrorMsg('');
                setTimeout(() => {
                    setSuccessMsg('');
                    navigate('/'); 
                }, 1000);
            }).catch(error => setErrorMsg(error.message)); 
        }).catch((error) => {
            setErrorMsg(error.message); 
        });
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
                    <h1>Реєстрація</h1>
                    <hr></hr>
                    <br></br>
                    {/* Відображення повідомлень про успішну реєстрацію або помилки */}
                    {successMsg && <>
                        <div className='success-msg'>{successMsg}</div>
                        <br></br>
                    </>}
                    <form autoComplete="off" onSubmit={handleSignup}>
                        <label>Ім'я</label>
                        <input type="text" className='form-control' required onChange={(e) => setFirstName(e.target.value)} value={firstName}></input>
                        <br></br>

                        <label>Прізвище</label>
                        <input type="text" className='form-control' required onChange={(e) => setLastName(e.target.value)} value={lastName}></input>
                        <br></br>

                        <label>Номер телефону</label>
                        <input type="tel" className='form-control' required onChange={(e) => setPhone(e.target.value)} value={phone}></input>
                        <br></br>

                        <label>Е-пошта</label>
                        <input type="email" className='form-control' required onChange={(e) => setEmail(e.target.value)} value={email}></input>
                        <br></br>

                        <label>Тип користувача</label>
                        <select className='form-control' required value={type} onChange={(e) => setType(e.target.value)}>
                            <option value=""></option>
                            <option>Замовник</option>
                            <option>Водій</option>
                            <option>Вантажник</option>
                            <option>Логіст</option>
                        </select>
                        <br></br>

                        <label>Пароль</label>
                        <input type="password" className='form-control' required onChange={(e) => setPassword(e.target.value)} value={password}></input>
                        <br></br>

                        <div className='btn-box'>
                            <span>У вас вже є обліковий запис?
                                <Link to="/login" className='link'>Увійти</Link>
                            </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className='btn btn-md' style={{backgroundColor: '#f3c640'}}>
                                Зареєструватись
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

