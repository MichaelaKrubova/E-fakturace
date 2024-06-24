
import { useState, useEffect, createContext  } from 'react';
import axios from 'axios';

//components
import Form from '../components/forms/Form';
import FormInput from '../components/forms/FormInput';
import CompanyForm from "../components/forms/CompanyForm"
import Section from '../components/Section';
import Heading1 from '../components/headings/Heading1';
import docService from '../services/forms'
import Button from '../components/buttons/Button';
//hooks
import useCompanyData from '../hooks/useCompanyData';
import { useFormState } from '../hooks/useFormState';
import { useFetchCompanyData } from '../hooks/useFetchCompanyData';

const MyAccount = () => {
    //db url
    const docsUrl = 'http://localhost:3001/my-account';

    //all saved documents data
    const [data, setData] = useState([]);

    //company data
    const [companyData, setCompanyData] = useState([]);

    const [supplierFormValues, handleSupplierInputChange, setSupplierFormValues] = useFormState({
        title: 'Základní údaje',
        ico: '',
        companyName: '',
        dic: '',
        street: '',
        postalCode: '',
        city: ''
    });

    const [bankFormValues, handleBankInputChange, setBankFormValues] = useFormState({
        accountNumber: '',
        bankCode: '',
    });

    const [contactValues, handleContactInputChange, setContactValues] = useFormState({
        phone: '',
        email: ''
    });


    const fetchDataAndUpdateForm = useFetchCompanyData();

    const handleIcoButtonClick = (e) => {
        e.preventDefault();
        fetchDataAndUpdateForm(supplierFormValues, setSupplierFormValues);
    };
    const getCompanyData = async () => {
        try {
            const initialData = await docService.getAll(docsUrl);
            if (initialData.length > 0) {
                const data = initialData[0];
                setCompanyData(data);
                
                // Populate form values
                setSupplierFormValues({
                    title: data.supplier.title,
                    ico: data.supplier.ico,
                    companyName: data.supplier.companyName,
                    dic: data.supplier.dic,
                    street: data.supplier.street,
                    postalCode: data.supplier.postalCode,
                    city: data.supplier.city
                });

                setBankFormValues({
                    accountNumber: data.paymentMethods.accountNumber,
                    bankCode: data.paymentMethods.bankCode,
                });

                setContactValues({
                    phone: data.contact.phone,
                    email: data.contact.email
                });
            }
        } catch (error) {
            console.error('Error fetching company data:', error);
        }
    };

    useEffect(() => {
        getCompanyData();
    }, []);
    console.log(companyData);
    const addNewData = async (e) => {
        e.preventDefault();

        const newData = {
            supplier: {
                title: supplierFormValues.title,
                ico: supplierFormValues.ico,
                dic: supplierFormValues.dic,
                companyName: supplierFormValues.companyName,
                street: supplierFormValues.street,
                postalCode: supplierFormValues.postalCode,
                city: supplierFormValues.city
            }, 
            paymentMethods: {
                accountNumber: bankFormValues.accountNumber,
                bankCode: bankFormValues.bankCode,
            },
            contact: {
                phone: contactValues.phone,
                email: contactValues.email
            }
        };
        
        try {
            if (companyData.length === 0) {
                const docToServer = await docService.create(docsUrl, newData);
                setCompanyData(docToServer);
            } else {
                const updatedDoc = await docService.update(docsUrl, companyData.id, newData);
                setCompanyData(updatedDoc);
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

        
    return (
        <>
            <Section className='page-hero'>
                <Heading1 text={'Moje firma: '} />
            </Section>
            <Section className={'flex-cont'}>
                <CompanyForm 
                    formValues={supplierFormValues}
                    handleInputChange={handleSupplierInputChange}
                    handleButtonClick={handleIcoButtonClick}
                    hasButton={true}
                />
                <Form h2text="Bankovní údaje">
                    <FormInput text="Číslo účtu: " name="accountNumber" onChange={handleBankInputChange} value={bankFormValues.accountNumber} />
                    <FormInput text="Kód banky: " name="bankCode" onChange={handleBankInputChange} value={bankFormValues.bankCode} />
                </Form>
            </Section>
             <Section className={'flex-cont'}>
                <Form h2text="Kontaktní údaje">
                    <FormInput text="Telefon: " name="phone" onChange={handleContactInputChange} value={contactValues.phone} />
                    <FormInput text="Email: " name="email" onChange={handleContactInputChange} value={contactValues.email} />
                </Form>
            </Section> 
            <Section>
                 <Button text="Uložit" onClick={addNewData}/> 
            </Section>
        </>
    )
}

export default MyAccount;