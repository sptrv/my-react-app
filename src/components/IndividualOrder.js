import React, { useState } from 'react';
import { fs } from '../config/Config';

export const IndividualOrder = ({ individualOrder }) => {
    const [deleted, setDeleted] = useState(false); 
    const [showDetails, setShowDetails] = useState(false); 

    // Функція видалення замовлення
    const handleIndividualOrderDelete = () => {
        fs.collection('Orders').doc(individualOrder.ID).delete()
            .then(() => {
                console.log('Замовлення видалено успішно!');
                setDeleted(true); // Оновлення стану після видалення
            })
            .catch(error => {
                console.error('Помилка:', error);
            });
    }

    // Функція для обробки оплати
    const handlePayment = (paymentMethod) => {
        // Тут можна додати код для обробки платежу за допомогою вибраного методу оплати
    }

    // Функція для перемикання відображення деталей замовлення
    const toggleDetails = () => {
        setShowDetails(!showDetails);
    }

    // Якщо елемент видалений, не рендеримо його
    if (deleted) {
        return null;
    }

    return (
        <div>
        <div className='order'>
            {/* Відображення основної інформації про замовлення */}
            <div className='text'>{individualOrder.type}</div>
            <div className='text'>{individualOrder.description}</div>
            <div className='text'>{individualOrder.recipient.name}</div>
            <div className='text'>{individualOrder.deliveryPrice} грн</div>
            <div className='btn btn-md' style={{fontWeight: 'bold', backgroundColor: '#f3c640'}} onClick={toggleDetails}>
                {showDetails ? "Приховати деталі" : "Показати деталі"}
            </div>
            <div style={{fontSize: '1.5em'}} onClick={handleIndividualOrderDelete}>
                ×</div>
       </div>    
            {/* Відображення деталей замовлення, якщо showDetails === true */}
            {showDetails && (
                <div className='additional-details'>
                <br></br>
                <div class="details-container">
                    <div class="text-details">
                        <p><h className='text'>Тип відправлення:</h> {individualOrder.type}</p>
                        <p><h className='text'>Опис посилки:</h> {individualOrder.description}</p>
                        <p><h className='text'>Розміри посилки:</h> {individualOrder.dimensions}</p>
                        <p><h className='text'>Адреса відправки:</h> {individualOrder.address}</p>
                        <p><h className='text'>Отримувач:</h> {individualOrder.recipient.name}</p>
                        <p><h className='text'>Адреса доставки:</h> {individualOrder.address}</p>
                        <p><h className='text'>Ціна доставки:</h> ${individualOrder.deliveryPrice}</p>
                    </div>
                    <div class="payment-buttons">
                        <div  className='text'> Оплачує відправник </div>
                        <br></br>
                        <div className='btn btn-md' style={{color: 'white', backgroundColor: '#7a3318'}} onClick={() => handlePayment('cash')}>
                            Оплатити при відправленні 
                        </div>
                        <br></br>
                        <div className='btn btn-md' style={{color: 'white', backgroundColor: '#7a3318'}} onClick={() => handlePayment('card')}>
                            Оплатити карткою 
                        </div>
                        <br></br>
                        <br></br>
                        <div className='text'> Оплачує отримувач </div>
                        <br></br>
                        <div className='btn btn-md' style={{color: 'white', backgroundColor: '#7a3318'}} onClick={() => handlePayment('cash')}>
                            Оплатити при доставці
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}


