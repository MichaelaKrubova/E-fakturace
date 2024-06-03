import React from 'react';
import FormInput from './FormInput'; 
import Form from './Form';

const CompanyForm = ({ formValues, handleInputChange, handleButtonClick, hasButton }) => {
    return (
        <Form h2text={formValues.title}>
            <FormInput 
                text="IČO: " 
                name="ico" 
                onChange={handleInputChange} 
                value={formValues.ico} 
                hasButton={hasButton}
                buttonText={'Vyhledat'} 
                onButtonClick={handleButtonClick}
            />
            <FormInput 
                text="Firma/Jméno: " 
                name="companyName" 
                onChange={handleInputChange} 
                value={formValues.companyName} 
                hasButton={false} 
            />
            <FormInput 
                text="DIČ: " 
                name="dic" 
                onChange={handleInputChange} 
                value={formValues.dic} 
                hasButton={false} 
            />
            <FormInput 
                text="Ulice: " 
                name="street" 
                onChange={handleInputChange} 
                value={formValues.street} 
                hasButton={false} 
            />
            <FormInput 
                text="PSČ: " 
                name="postalCode" 
                onChange={handleInputChange} 
                value={formValues.postalCode} 
                hasButton={false} 
            />
            <FormInput 
                text="Město: " 
                name="city" 
                onChange={handleInputChange} 
                value={formValues.city} 
                hasButton={false} 
            />
        </Form>
    );
};

export default CompanyForm;
