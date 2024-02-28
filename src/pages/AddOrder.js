import React, { useState, useEffect } from 'react';
import { Menu } from "../components/Menu";
import { auth, fs } from '../config/Config';
import { Link, useNavigate } from 'react-router-dom';

export const AddOrder = () => {
    
    // Використання хука useNavigate для переходу між сторінками
    const navigate = useNavigate(); 

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

    // Стейти для даних форми додавання замовлення
    const [type, setType] = useState('');
    const [dimensions, setDimensions] = useState('');
    const [description, setDescription] = useState('');
    const [senderAddress, setSenderAddress] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [recipientPhone, setRecipientPhone] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');
    const [deliveryPrice, setDeliveryPrice] = useState(0);

    // Стейти для повідомлень про успішне додавання замовлення та помилки
    const [successMsg, setSuccessMsg] = useState('');
    const [uploadError, setUploadError] = useState('');

    // Встановлення вартості доставки в залежності від типу та розмірів відправлення
    useEffect(() => {
        if (type === 'Посилка') {
            if (dimensions === 'Мала (До 2 кг | 35×20×10 см)') {
                setDeliveryPrice(100);
            } else if (dimensions === 'Середня (До 10 кг | 40×30×30 см)') {
                setDeliveryPrice(200);
            } else if (dimensions === 'Велика (До 30 кг | 60×50×40 см)') {
                setDeliveryPrice(350);
            }
        } else if (type === 'Документи') {
            setDeliveryPrice(100); 
        }
    }, [type, dimensions]);

    // Функція обробки події додавання замовлення
    const handleAddOrder = (e) => {
        e.preventDefault(); 

        // Додавання нового замовлення до бази даних
        fs.collection('Orders').add({
            type,
            dimensions: type === 'Документи' ? '-' : dimensions,
            description: type === 'Документи' ? '-' : description,
            address: senderAddress,
            recipient: {
                name: recipientName,
                phone: recipientPhone,
                email: recipientEmail,
                address: recipientAddress
            },
            userUid: auth.currentUser.uid,
            deliveryPrice,
        }).then(() => {
            setSuccessMsg('Замовлення створено успішно!'); 
            // Очищення полів форми після успішного додавання замовлення
            setType('');
            setDimensions('');
            setDescription('');
            setSenderAddress('');
            setRecipientName('');
            setRecipientPhone('');
            setRecipientEmail('');
            setRecipientAddress('');
            setTimeout(() => {
                setSuccessMsg('');
                navigate('/orders'); 
            }, 1000);
        }).catch(error => setUploadError(error.message)); 
    }

  
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
                    <h1>Створення замовлення</h1>
                    <hr></hr>
                    <br></br>

                    {/* Відображення повідомлень про успішне додавання замовлення та про помилки */}
                    {successMsg && <>
                        <div className='success-msg'>{successMsg}</div>
                        <br></br>
                    </>}
                    {uploadError && <>
                        <br></br>
                        <div className='error-msg'>{uploadError}</div>
                    </>}

                    {/* Форма для додавання замовлення */}
                    <form autoComplete="off" className='form-group' onSubmit={handleAddOrder}>
                        <label>Тип замовлення</label>
                        <select className='form-control' required
                            value={type} onChange={(e) => setType(e.target.value)}>
                            <option value=""></option>
                            <option>Посилка</option>
                            <option>Документи</option>
                        </select>
                        <br></br>

                        {/* Додаткові поля для посилок */}
                        {type === 'Посилка' && <>
                            <label>Розміри посилки</label>
                            <select className='form-control' required
                                value={dimensions} onChange={(e) => setDimensions(e.target.value)}>
                                <option value=""></option>
                                <option>Мала (До 2 кг | 35×20×10 см)</option>
                                <option>Середня (До 10 кг | 40×30×30 см)</option>
                                <option>Велика (До 30 кг | 60×50×40 см)</option>
                            </select>
                            <br></br>

                            <label>Опис посилки</label>
                            <input type="text" className='form-control' required
                                onChange={(e) => setDescription(e.target.value)} value={description}>
                            </input>
                            <br></br>
                        </>}

                        {/* Спільні поля для всіх типів відправлень */}
                        <label>Адреса відправки: місто (або населений пункт), вулиця та номер будинку</label>
                        <input type="text" className='form-control' required
                            onChange={(e) => setSenderAddress(e.target.value)} value={senderAddress}>
                        </input>
                        <br></br>

                        <label>ПІБ отримувача</label>
                        <input type="text" className='form-control' required
                            onChange={(e) => setRecipientName(e.target.value)} value={recipientName}>
                        </input>
                        <br></br>

                        <label>Номер телефону отримувача</label>
                        <input type="tel" className='form-control' required
                            onChange={(e) => setRecipientPhone(e.target.value)} value={recipientPhone}>
                        </input>
                        <br></br>

                        <label>Е-пошта отримувача</label>
                        <input type="email" className='form-control' required
                            onChange={(e) => setRecipientEmail(e.target.value)} value={recipientEmail}></input>
                        <br></br>

                        <label>Адреса доставки: місто (або населений пункт), вулиця та номер будинку</label>
                        <input type="text" className='form-control' required
                            onChange={(e) => setRecipientAddress(e.target.value)} value={recipientAddress}>
                        </input>
                        <br></br>
                        <br></br>

                        {/* Кнопка для додавання замовлення */}
                        {user && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className='btn btn-md' style={{backgroundColor: '#f3c640'}} >
                                Створити
                            </button>
                        </div>
                        )}
                        {!user && (
                            <div className='btn-box'>
                                <span>Для створення замовлення потрібно увійти в систему. 
                                <Link to="/login" className='link'>Увійти</Link>
                                </span>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    )
}

