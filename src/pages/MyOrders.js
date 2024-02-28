import React, { useState, useEffect } from 'react';
import { Menu } from '../components/Menu.js';
import { Orders } from '../components/Orders.js';
import { auth, fs } from '../config/Config';
import { Link } from 'react-router-dom';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const MyOrders = () => {
   
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    // Отримання даних користувача та його замовлень під час завантаження сторінки
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                // Отримання даних користувача з бази даних
                fs.collection('users').doc(user.uid).get().then(snapshot => {
                    setUser(snapshot.data().FirstName);
                });

                // Отримання замовлень користувача з бази даних
                fs.collection('Orders').where('userUid', '==', user.uid).get().then(snapshot => {
                    const ordersArray = [];
                    let totalPrice = 0;
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        data.ID = doc.id;
                        ordersArray.push(data);
                        totalPrice += data.deliveryPrice;
                    });
                    setOrders(ordersArray);  
                    setTotalPrice(totalPrice); 
                }).catch(error => {
                    console.error('Помилка:', error);
                });
            } else {
                setUser(null);
                setOrders([]);
                setTotalPrice(0);
            }
        });
        return () => unsubscribe(); 
    }, []);

    const navigate = useNavigate();

    // Функція обробки платежу за допомогою Stripe
    const handleToken = async (token) => {
        const cart = { name: 'Всі замовлення', totalPrice };
        const response = await axios.post('http://localhost:8080/checkout', {
            token,
            cart
        });
        console.log(response);
        let { status } = response.data;
        console.log(status);
        if (status === 'success') {
            navigate('/'); 
            toast.success('Ваш заказ прийнято!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
            
            const uid = auth.currentUser.uid;
            const carts = await fs.collection('Orders').where('userUid', '==', uid).get();
            carts.forEach(doc => {
                fs.collection('Orders').doc(doc.id).delete();
            });
        } else {
            alert('Виникла помилка під час перевірки!'); 
        }
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
                    {/* Відображення замовлень користувача */}
                    {orders.length > 0 && (
                        <>
                            <h1>Мої замовлення</h1>
                            <hr></hr>
                            <br></br>
                            <div>
                                <Orders orders={orders} />
                                    <h className='text'>До оплати: </h><span> {totalPrice} грн</span>
                            </div>
                            <br></br>
                            <button className='btn btn-md'style={{marginBottom: 20+'px', backgroundColor: '#122641', color: 'white'}}>
                                Оплатити при відправленні
                            </button>
                            {/* Кнопка для оплати замовлень за допомогою Stripe */}
                            <StripeCheckout
                                stripeKey='pk_test_51MHGyfLFee9zmE0ab4bBw1uXZmmGnq2o9YpVgOAubzVl9kJxIb7oOM0fkNVeJNXahHfY43WGzIo64pg4WuuVV1le000mmRfUIV'
                                token={handleToken}
                                amount={totalPrice * 100} 
                                label="Оплатити картою"
                                buttonClassName="custom-stripe-button"
                            ></StripeCheckout>
                            
                        </>
                    )}

                    {/* Відображення повідомлення про очікування завантаження замовлень */}
                    {orders.length < 1 && (
                        <div className='container-fluid'> У вас нема замовлень....</div>
                    )}
                </div>
            </div>
        </>
    )
}

