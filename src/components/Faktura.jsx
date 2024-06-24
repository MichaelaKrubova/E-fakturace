

import React from 'react';
import DatePicker from "react-datepicker";

import DocItems from "../components/forms/DocItems"
import Heading1 from "../components/headings/Heading1";
import Form from "../components/forms/Form";
import FormInput from "../components/forms/FormInput";
import Section from "../components/Section";
import FormSelect from "../components/forms/FormSelect";
import CompanyForm from "../components/forms/CompanyForm";
import Button from "../components/buttons/Button";

const Faktura = ({
    title, 
    docNumber, 
    handleNewNumber, 
    newNumber, 
    addNumber, 
    supplierFormValues, 
    handleSupplierInputChange, 
    handleIcoButtonClick, 
    purchaserFormValues, 
    handlePurchaserInputChange, 
    handleIcoButtonClickPurchaser, 
    selectValue, 
    handleSelectChange, 
    options,
    bankFormValues, 
    handleBankInputChange, 
    startDate, 
    setStartDate, 
    payStartDate, 
    setPayStartDate, 
    rows,
    handleRowsChange, 
    totalSum,
    handleTotalSumChange, 
    addNewDocument, }) => {

    return (
        <>
            <Section className='page-hero'>
                <Heading1 text={title} number={docNumber} />
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
                            <FormInput text="Číslo účtu: " name="accountNumber" onChange={handleBankInputChange} value={bankFormValues.accountNumber} />
                            <FormInput text="Kód banky: " name="bankCode" onChange={handleBankInputChange} value={bankFormValues.bankCode} />
                            <FormInput text="Variabilní symbol: " name="vs" onChange={handleBankInputChange} value={bankFormValues.vs} />
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
                <DocItems rows={rows} totalSum={totalSum} onRowsChange={handleRowsChange} onTotalSumChange={handleTotalSumChange} />
                <Button text="Uložit" onClick={addNewDocument}/>
            </Section>
        </>
    )
}

export default Faktura;