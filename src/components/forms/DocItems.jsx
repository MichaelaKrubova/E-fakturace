import React, { useState, useEffect } from 'react';
import FormItemsHeader from './FormItemsHeader';
import FormItemsRow from './FormItemsRow';
import Button from '../buttons/Button';
import FormInput from './FormInput';


const DocItems = ({ onRowsChange, onTotalSumChange, rows: initialRows, totalSum }) => {
    const [rows, setRows] = useState(initialRows); // State for rows
    
    useEffect(() => {
        onRowsChange(rows);
    }, [rows, onRowsChange]);


    const handleInputChange = (e, id) => {
        const { name, value } = e.target;
        setRows(rows.map(row => {
            if (row.id === id) {
                const updatedRow = { ...row, [name.split('-')[0]]: value };
                if (name.startsWith('quantity') || name.startsWith('price')) {
                    const quantity = Number(updatedRow.quantity) || 0;
                    const price = Number(updatedRow.price) || 0;
                    const totalPrice = (quantity * price).toFixed(2);
                    updatedRow.totalPrice = totalPrice;
                    //updatedRow.price = price.toFixed(2);
                }
                return updatedRow;
            }
            return row;
        }));
    };

    const addRow = () => {
        console.log('click');
        const newRowId = rows.length + 1;
        setRows([...rows, { id: newRowId, quantity: 1, unit: '', item: '', price: 0, totalPrice: '' }]);
    };

    // Update total price whenever rows change
    useEffect(() => {
        const newTotalSum = rows.reduce((sum, row) => sum + Number(row.totalPrice), 0).toFixed(2);
        onTotalSumChange(newTotalSum);
    }, [rows, onTotalSumChange]);

    return (
        <>
            <div className="table-header">
                <FormItemsHeader text="Množství" className="width-10" />
                <FormItemsHeader text="Jednotka" className="width-10" />
                <FormItemsHeader text="Položka" className="width-50" />
                <FormItemsHeader text="Cena" className="width-20" />
                <FormItemsHeader text="Celkem" className="width-10" />
            </div>
            {rows.map(row => (
                <FormItemsRow
                    key={row.id}
                    rowId={row.id}
                    className=""
                    handleInputChange={e => handleInputChange(e, row.id)}
                    values={row}
                />
                
            ))}
            
            <div className='summary'>
                <FormInput text="Celkem: " type="number" value={totalSum} step="0.01" readOnly currency="Kč" />
            </div>
            <Button text="Další položka" onClick={addRow} />
        </>
    );
};

export default DocItems;
