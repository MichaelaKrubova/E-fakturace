//react 
import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect, createContext  } from 'react';
import { useParams } from 'react-router-dom';

//server/database
import axios from 'axios';
import docService from '../services/forms'

//hooks
import useDocuments from '../hooks/useDocument';
import { useFormState } from '../hooks/useFormState';
import { useFetchCompanyData } from '../hooks/useFetchCompanyData';

//components
import Faktura from "../components/Faktura";

const docsUrl = 'http://localhost:3001/faktury';

// Function to parse the date string
const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('. ').map(part => part.trim());
    return new Date(`${year}-${month}-${day}`);
};


const EditDocument = () => {
    const { id } = useParams();
    const { documents, loading, error } = useDocuments(docsUrl);
    const [currentDocument, setCurrentDocument] = useState(null);
    const [updatedDoc, setUpdatedDoc] = useState([])

    const [docNumber, setNumber] = useState('20240001');
    //doc number edited by user
    const [newNumber, setNewNumber] = useState('');
    const [isCustomNumber, setIsCustomNumber] = useState(false);
    
    // Function to update document number
    const updateDocumentNumber = () => {
        axios.get('http://localhost:3001/faktury')
          .then(response => {
            const data = response.data;
            
    
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

    const [bankFormValues, handleBankInputChange, setBankFormValues] = useFormState({
      accountNumber: '',
      bankCode: '',
      vs: ''
  });
  //items in rows
  const [rows, setRows] = useState([]);

    //total sum price
    const [totalSum, setTotalSum] = useState('');

    //set dates
    const currentDay = new Date();
    const nextWeek = new Date(currentDay);
    nextWeek.setDate(currentDay.getDate() + 7);
    const [startDate, setStartDate] = useState(new Date());
    const [payStartDate, setPayStartDate] = useState(nextWeek);

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


    useEffect(() => {
        if (documents.length > 0) {
            const doc = documents.find(doc => doc.id === id);

            setCurrentDocument(doc);
            setNumber(doc.documentNumber)
            setRows(doc.items);
            setTotalSum(doc.totalSum);
            setBankFormValues(doc.paymentMethods)
            setSupplierFormValues(doc.supplier)
            setPurchaserFormValues(doc.purchaser)
            setStartDate(parseDate(doc.dates.startDate))
            setPayStartDate(parseDate(doc.dates.payStartDate))

        }
    }, [documents, id]);


    
    const handleSelectChange = (e) => {
        const { value } = e.target;
        const selectedOption = options.find(option => option.value === value);
        setSelectValue(selectedOption);
    
      }

    const handleNewNumber = (e) => {
        setNewNumber(e.target.value);
        console.log(newNumber);
      }

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

    const addNumber = (e) => {
        e.preventDefault();
        if (documents.length === 0) {
            // If there are no existing documents, set the default number directly from newNumber
            setNumber(newNumber);
            setIsCustomNumber(true); // Indicate that a custom number has been set
        } else if (documents.some(doc => doc.documentNumber === newNumber)) {
            alert('Toto číslo faktury již existuje!');
        } else {
            setNumber(newNumber);
            setIsCustomNumber(true); // Indicate that a custom number has been set
            console.log('save');
        }

      }

      
    const handleRowsChange = (updatedRows) => {
        setRows(updatedRows);
    };

    const handleTotalSumChange = (updatedTotalSum) => {
        setTotalSum(updatedTotalSum);
    };

    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading document: {error.message}</div>;
    }

    if (!currentDocument) {
        return <div>Document not found</div>;
    }

    
    const formatDate = (date) => {
        return date.toLocaleDateString('cs-CZ'); 
    };

    const updateDocument = async (e) => {
        e.preventDefault();
        const formattedStartDate = formatDate(startDate);
        const formattedPaytDate = formatDate(payStartDate);
        const updatedDocument = {
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

        //setUpdatedDoc([...updatedDoc, updatedDocument]);
        console.log(updatedDoc);
        
        await docService.update(docsUrl, currentDocument.id, updatedDocument);
            
    };


    return (
        <Faktura 
            title="Změna faktury: "
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
            rows={currentDocument.items}
            handleTotalSumChange={handleTotalSumChange}
            totalSum={totalSum}
            addNewDocument={updateDocument}
        />
    );
};

export default EditDocument;