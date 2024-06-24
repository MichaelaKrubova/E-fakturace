//react 
import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect, createContext  } from 'react';

//components
import Section from "../components/Section";
import Faktura from "../components/Faktura";

//server/database
import axios from 'axios';
import docService from '../services/forms'

//imported components
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NewPdf from "../pdf/NewPdf";
import { PDFViewer } from '@react-pdf/renderer';

//custom hooks
import { useFormState } from '../hooks/useFormState';
import { useFetchCompanyData } from '../hooks/useFetchCompanyData';



const NewDoc = () => {
    //Title as heading of the page

    //db url
    const docsUrl = 'http://localhost:3001/faktury'
    const accountUrl = 'http://localhost:3001/my-account'

    //documents from db:
    const [documents, setDocuments] = useState([]);

    //doc number set by user
    const [newNumber, setNewNumber] = useState('');

    //set default docNumber and add it in main heading
    const [docNumber, setNumber] = useState('20240001');

    const [isCustomNumber, setIsCustomNumber] = useState(false);
    
    // Function to update document number
    const updateDocumentNumber = () => {
        axios.get('http://localhost:3001/faktury')
          .then(response => {
            const data = response.data;
            setDocuments(data);
    
            if (!isCustomNumber) {
              if (data.length > 0) {
                const lastDocNumber = data[data.length - 1].documentNumber;
                let nextDocNumber = parseInt(lastDocNumber) + 1;
    
                // Recursive function to find a unique document number
                const findUniqueDocNumber = (number) => {
                  if (data.some(doc => doc.documentNumber === number.toString().padStart(8, '0'))) {
                    return findUniqueDocNumber(number + 1);
                  } else {
                    setNumber(number.toString().padStart(8, '0'));
                  }
                };
    
                findUniqueDocNumber(nextDocNumber);
              } else {
                setNumber('20240001');
              }
            }
          })
          .catch(error => {
            console.error('Error fetching documents:', error);
          });
      };
    
      useEffect(() => {
        updateDocumentNumber();
      }, []); 
    

      const [bankFormValues, handleBankInputChange, setBankFormValues] = useFormState({
        accountNumber: '',
        bankCode: '',
        vs: ''
    });
    
    //select payment value
    const [selectValue, setSelectValue] = useState({
        value: "Převodem", 
        name: 'transfer', 
    })

    //select payment options
    const options = [
        {text: 'Převodem', value: "Převodem", name:"transfer"},
        {text: "Hotově", value: "Hotově", name:"cash"}
    ]
    

    //set dates
    const currentDay = new Date();
    const nextWeek = new Date(currentDay);
    nextWeek.setDate(currentDay.getDate() + 7);
    const [startDate, setStartDate] = useState(new Date());
    const [payStartDate, setPayStartDate] = useState(nextWeek);

    //suppliers data
    
    const [supplierFormValues, handleSupplierInputChange, setSupplierFormValues] = useFormState({
        title: 'Dodavatel',
        ico: '',
        companyName: '',
        dic: '',
        street: '',
        postalCode: '',
        city: ''
    });

    //purchaser's data
    const [purchaserFormValues, handlePurchaserInputChange, setPurchaserFormValues] = useFormState({
        title: 'Odběratel',
        ico: '',
        companyName: '',
        dic: '',
        street: '',
        postalCode: '',
        city: ''
    });

    //items in rows
    const [rows, setRows] = useState([
        { id: 1, quantity: 1, unit: '', item: '', price: '', totalPrice: '' }
    ]);

    //total sum price
    const [totalSum, setTotalSum] = useState(0);

    //all saved documents data
    const [document, setDocument] = useState([]);

    //actual filled data 
    const [latestDocument, setLatestDocument] = useState(null);
    const [showPdf, setShowPdf] = useState(false);
    //render pdf
    const [renderPdf, setRenderPdf] = useState(false);

    const [faktury, setFaktury] = useState([]);

    // Update bankFormValues whenever docNumber changes
        useEffect(() => {
            setBankFormValues(prevValues => ({
                ...prevValues,
                 vs: docNumber || ''
            }));
        }, [docNumber]);


    //fill the company data, if are stored in my-account db
    const getCompanyData = async () => {
        try {
            const initialData = await docService.getAll(accountUrl);
            if (initialData.length > 0) {
                const data = initialData[0];
                console.log(initialData);
                // Populate form values
                setSupplierFormValues({
                    title: supplierFormValues.title,
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
                /*
                setContactValues({
                    phone: data.contact.phone,
                    email: data.contact.email
                });*/
            }
        } catch (error) {
            console.error('Error fetching company data:', error);
        }
    };

    useEffect(() => {
        getCompanyData();
    }, []);

    const handleRowsChange = (updatedRows) => {
        setRows(updatedRows);
    };

    const handleTotalSumChange = (updatedTotalSum) => {
        setTotalSum(updatedTotalSum);
    };
    



    //get the company from Ares API
    const fetchDataAndUpdateForm = useFetchCompanyData();
    
    const handleIcoButtonClick = (e) => {
        e.preventDefault()
        fetchDataAndUpdateForm(supplierFormValues, setSupplierFormValues);
    };
    
    const handleIcoButtonClickPurchaser = (e) => {
        e.preventDefault()
        fetchDataAndUpdateForm(purchaserFormValues, setPurchaserFormValues);
    };
    

    const handleNewNumber = (e) => {
        setNewNumber(e.target.value);
      }
    
      const addNumber = (e) => {
        e.preventDefault();
        console.log('saveme');
        if (documents.length === 0) {
            // If there are no existing documents, set the default number directly from newNumber
            setNumber(newNumber);
            setIsCustomNumber(true); // Indicate that a custom number has been set
            console.log('save3');
        } else if (documents.some(doc => doc.documentNumber === newNumber)) {
            alert('Toto číslo faktury již existuje!');
            console.log('save2');
        } else {
            setNumber(newNumber);
            setIsCustomNumber(true); // Indicate that a custom number has been set
            console.log('save');
        }

      }

      const handleSelectChange = (e) => {
        const { value } = e.target;
        const selectedOption = options.find(option => option.value === value);
        setSelectValue(selectedOption);
    
      }


      const formatDate = (date) => {
        return date.toLocaleDateString('cs-CZ'); 
    };

      const addNewDocument = (e) => {
        e.preventDefault();
        const formattedStartDate = formatDate(startDate);
        const formattedPaytDate = formatDate(payStartDate);
        const newDocument = {
            documentTitle: `Faktura ${docNumber}`,
            documentNumber: docNumber,
            supplier: {
                title: supplierFormValues.title,
                ico: supplierFormValues.ico,
                dic: supplierFormValues.dic,
                companyName: supplierFormValues.companyName,
                street: supplierFormValues.street,
                postalCode: supplierFormValues.postalCode,
                city: supplierFormValues.city
            }, 
            purchaser: {
                title: purchaserFormValues.title,
                ico: purchaserFormValues.ico,
                dic: purchaserFormValues.dic,
                companyName: purchaserFormValues.companyName,
                street: purchaserFormValues.street,
                postalCode: purchaserFormValues.postalCode,
                city: purchaserFormValues.city
            }, 
            paymentMethods: {
                paymentMethod: selectValue.value,
                accountNumber: bankFormValues.accountNumber,
                bankCode: bankFormValues.bankCode,
                vs: bankFormValues.vs                    
                },
            dates: {
                startDate: formattedStartDate,
                payStartDate: formattedPaytDate
            },
            items: rows, 
            totalSum: totalSum
        };

        setDocument([...document, newDocument]);

        setLatestDocument(newDocument);

        setShowPdf(true); // Show the PDF viewer
        
        docService.create(docsUrl, newDocument)
            .then(docToServer => {
                setFaktury(faktury => [...faktury, docToServer]); // Update faktury with the new document
            })
            .catch(error => {
                console.error('Error creating document:', error);
                // Handle the error
            });
            saveDataToDatabase()
    };

    const saveDataToDatabase = () => {
       // resetForm();
        // Update document number if needed
        updateDocumentNumber();
        setIsCustomNumber(false)
    };

    const resetForm = () => {
        setNewNumber('');
        setSelectValue({value: "Převodem"});
        setBankFormValues({
            accountNumber: '',
            bankCode: '', 
            vs: docNumber
        })
        setPurchaserFormValues({
            title: 'Odběratel',
            ico: '',
            companyName: '',
            dic: '',
            street: '',
            postalCode: '',
            city: ''
        })
        setRows([])
        console.log('Rows reset to empty array:', rows);
        setTotalSum(0)

    }

    const lastDocument = documents[documents.length - 1];
    
    return (
        <>
            <Faktura 
                title="Nová faktura: "
                docNumber={docNumber}
                handleNewNumber={handleNewNumber}
                newNumber={newNumber}
                addNumber={addNumber}
                supplierFormValues={supplierFormValues}
                handleSupplierInputChange={handleSupplierInputChange}
                handleIcoButtonClick={handleIcoButtonClick}
                purchaserFormValues={purchaserFormValues}
                handlePurchaserInputChange={handlePurchaserInputChange}
                handleIcoButtonClickPurchaser={handleIcoButtonClickPurchaser}
                selectValue={selectValue}
                options={options}
                handleSelectChange={handleSelectChange}
                bankFormValues={bankFormValues}
                handleBankInputChange={handleBankInputChange}
                startDate={startDate}
                setStartDate={setStartDate}
                payStartDate={payStartDate}
                setPayStartDate={setPayStartDate}
                handleRowsChange={handleRowsChange}
                rows={rows}
                handleTotalSumChange={handleTotalSumChange}
                totalSum={totalSum}
                addNewDocument={addNewDocument}
            />
           
            <Section>
                <PDFViewer  width="100%" height="1200">
                    <NewPdf document={lastDocument} />
                </PDFViewer>
            </Section>
        </>
    )
}

export default NewDoc;