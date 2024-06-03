import DocItems from "../components/forms/DocItems"
import Heading1 from "../components/headings/Heading1";
import Form from "../components/forms/Form";
import FormInput from "../components/forms/FormInput";
import Section from "../components/Section";
import FormSelect from "../components/forms/FormSelect";
import CompanyForm from "../components/forms/CompanyForm";
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import docService from '../services/faktury'
import { useState, useEffect, createContext  } from 'react';
import Button from "../components/buttons/Button";
import NewPdf from "../pdf/faktury-pdf";
import React from 'react';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';



const NewDoc = () => {
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
      }, []); // Empty dependency array means this effect runs once on mount
    

    // Bank values
        const [bankFormValues, setBankFormValues] = useState({
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
    const [supplierFormValues, setSupplierFormValues] = useState({
        title: 'Dodavatel',
        ico: '',
        companyName: '',
        dic: '',
        street: '',
        postalCode: '',
        city: ''
    });

    //purchaser's data
    const [purchaserFormValues, setPurchaserFormValues] = useState({
        title: 'Odběratel',
        ico: '',
        companyName: '',
        dic: '',
        street: '',
        postalCode: '',
        city: ''
    });

    //items in rows
    const [rows, setRows] = useState([]);

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
                vs: docNumber
            }));
        }, [docNumber]);


    const handleRowsChange = (updatedRows) => {
        setRows(updatedRows);
    };

    const handleTotalSumChange = (updatedTotalSum) => {
        setTotalSum(updatedTotalSum);
    };
    

   // Handler for supplier form inputs
    const handleSupplierInputChange = (e) => {
        const { name, value } = e.target;
        setSupplierFormValues({
            ...supplierFormValues,
            [name]: value
        });
    };

    // Handler for purchaser form inputs
    const handlePurchaserInputChange = (e) => {
        const { name, value } = e.target;
        setPurchaserFormValues({
            ...purchaserFormValues,
            [name]: value
        });
    };

    const fetchDataAndUpdateForm = async (formValues, setFormValues) => {
        try {
            const response = await axios.get(`https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${formValues.ico}`);
            const data = response.data;
    
            if (data) {
                const { ico, obchodniJmeno, sidlo, stav } = data;
                const { nazevUlice, cisloOrientacni, cisloDomovni, nazevObce, nazevCastiObce, psc } = sidlo;
                const cp = cisloOrientacni  ? `${cisloDomovni}/${cisloOrientacni}` : cisloDomovni;
                const address = nazevUlice  ? `${nazevUlice} ${cp}` : `${nazevCastiObce}/${cp}`;

    
                setFormValues({
                    ...formValues,
                    ico: ico,
                    companyName: obchodniJmeno,
                    street: address,
                    city: nazevObce,
                    postalCode: psc,
                    stav: stav || ''
                });
            } else {
                setFormValues({
                    ...formValues,
                    stav: 'IČO firmy nebylo nalezeno'
                });
            }
        } catch (error) {
            console.error('Error fetching company information:', error);
            setFormValues({
                ...formValues,
                stav: 'Chyba při načítání dat'
            });
        }
    };
    
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
        if (documents.length === 0) {
            // If there are no existing documents, set the default number directly from newNumber
            setNumber(newNumber);
            setIsCustomNumber(true); // Indicate that a custom number has been set
        } else if (documents.some(doc => doc.documentNumber === newNumber)) {
            alert('Toto číslo faktury již existuje!');
        } else {
            setNumber(newNumber);
            setIsCustomNumber(true); // Indicate that a custom number has been set
        }

      }

      const handleSelectChange = (e) => {
        const { value } = e.target;
        const selectedOption = options.find(option => option.value === value);
        setSelectValue(selectedOption);
    
      }

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBankFormValues({
            ...bankFormValues,
            [name]: value
        });

      }

      const formatDate = (date) => {
        return date.toLocaleDateString('cs-CZ'); 
    };

      const addNewDocument = (e) => {
        e.preventDefault();
        const formattedStartDate = formatDate(startDate);
        const formattedPaytDate = formatDate(payStartDate);
        const newDocument = {
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
        docService.create(newDocument)
            .then(docToServer => {
                setFaktury(faktury => [...faktury, docToServer]); // Update faktury with the new document
            })
            .catch(error => {
                console.error('Error creating document:', error);
                // Handle the error
            });
            saveDataToDatabase()
            console.log(document);
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
        setSupplierFormValues({
            title: 'Dodavatel',
            ico: '',
            companyName: '',
            dic: '',
            street: '',
            postalCode: '',
            city: ''
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
    console.log(documents[documents.length - 1]);
    
    return (
        <>
            <Section className='page-hero'>
                <Heading1 text={'Nová faktura: '} number={docNumber} />
            </Section>
            
            <Section>
                <FormInput text="Číslo faktury: " onChange={handleNewNumber} value={newNumber} hasButton={true} buttonText={'Uložit'} onButtonClick={addNumber} />
            </Section>

            <Section className="flex-cont">
                <CompanyForm 
                    formValues={supplierFormValues}
                    handleInputChange={handleSupplierInputChange}
                    handleButtonClick={handleIcoButtonClick}
                    hasButton={true}
                />

                <CompanyForm 
                    formValues={purchaserFormValues}
                    handleInputChange={handlePurchaserInputChange}
                    handleButtonClick={handleIcoButtonClickPurchaser}
                    hasButton={true}
                />
            </Section>

            <Section className="flex-cont">
                <Form h2text="Platební údaje">
                    <FormSelect
                     text="Platební metoda"
                     name="paymentMethod"
                     value={selectValue.value}
                     options={options}
                     onChange={handleSelectChange}
                     />
                    {selectValue.name === "transfer" && (
                        <>
                            <FormInput text="Číslo účtu: " name="accountNumber" onChange={handleInputChange} value={bankFormValues.accountNumber} />
                            <FormInput text="Kód banky: " name="bankCode" onChange={handleInputChange} value={bankFormValues.bankCode} />
                            <FormInput text="Variabilní symbol: " name="vs" onChange={handleInputChange} value={bankFormValues.vs} />
                        </>
                    )}
                </Form>
                <Form h2text="Datumy">
                    <div>
                        <label>Datum vystavení:
                            <DatePicker
                            selected={startDate}
                            onChange={(date) =>  setStartDate(date)}
                            dateFormat="dd.MM.yyyy"
                            />
                        </label>
                    </div>
                    <div>
                        <label>Datum splatnosti:
                            <DatePicker
                            selected={payStartDate}
                            onChange={(date) =>  setPayStartDate(date)}
                            dateFormat="dd.MM.yyyy"
                            />
                        </label>
                    </div>
                </Form>

            </Section>
            <Section>
                <DocItems onRowsChange={handleRowsChange} onTotalSumChange={handleTotalSumChange} />
                <Button text="Uložit" onClick={addNewDocument}/>
            </Section>
            <Section>
                <PDFViewer  width="100%" height="600">
                    <NewPdf document={lastDocument} />
                </PDFViewer>
            </Section>
        </>
    )
}

export default NewDoc;