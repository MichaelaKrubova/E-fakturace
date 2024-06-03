import React from 'react';
import FormInput from './FormInput';

const FormItemsRow = ({ className, rowId, handleInputChange, values }) => {
    return (
        <div className={`form-row ${className}`}>
            <FormInput
                id={`${rowId}-quantity`}
                name={`quantity-${rowId}`}
                value={values.quantity || 1}
                onChange={handleInputChange}
                type="number"
                min="1"
                placeholder="Množství"
                className="width-10"
            />
            <FormInput
                id={`${rowId}-unit`}
                name={`unit-${rowId}`}
                value={values.unit}
                onChange={handleInputChange}
                type="text"
                placeholder="Jednotka"
                className="width-10"
            />
            <FormInput
                id={`${rowId}-item`}
                name={`item-${rowId}`}
                value={values.item}
                onChange={handleInputChange}
                type="text"
                placeholder="Položka"
                className="width-50"
            />
            <FormInput
                id={`${rowId}-price`}
                name={`price-${rowId}`}
                value={values.price}
                onChange={handleInputChange}
                type="number"
                placeholder="Cena"
                className="width-20"
                step="0.01"
            />
            <FormInput 
                id={`${rowId}-totalPrice`} 
                type="number" 
                name="totalPrice" 
                readOnly 
                value={values.totalPrice} 
                placeholder="0.00"
                className="width-10"
            />
        </div>
    );
};

export default FormItemsRow;
