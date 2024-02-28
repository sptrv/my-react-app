import React from 'react';
import { IndividualOrder } from './IndividualOrder';

export const Orders = ({ orders }) => {

    // Перебір масиву замовлень та відображення кожного замовлення
    return (
        <>
            {orders.map((individualOrder) => (
                <IndividualOrder key={individualOrder.ID} individualOrder={individualOrder} />
            ))}
        </>
    );
}
