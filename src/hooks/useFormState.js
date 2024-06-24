import { useState } from 'react';

export const useFormState = (initialValues) => {
    const [formValues, setFormValues] = useState(initialValues);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    return [formValues, handleInputChange, setFormValues];
};
