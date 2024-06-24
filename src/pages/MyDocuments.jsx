//react 
import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect, createContext  } from 'react';
import { useNavigate } from 'react-router-dom';

//server/database
import axios from 'axios';
import docService from '../services/forms'

//components
import Section from '../components/Section';
import Heading1 from '../components/headings/Heading1';
import FormItemsHeader from '../components/forms/FormItemsHeader';
import Button from '../components/buttons/Button';

//hooks
import useDocuments from '../hooks/useDocument';

//icons
import { FaRegEdit  } from "react-icons/fa";
import { BsFilePdf } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";

const MyDocuments = () => {
    //db url
    const docsUrl = 'http://localhost:3001/faktury'

     //documents from db:
     const { documents, setDocuments, loading, error } = useDocuments(docsUrl);

    //navigation
    const navigate = useNavigate();

 //fill the company data, if are stored in faktury db
    

   
    const handleEditClick = (id) => {
        navigate(`/edit/${id}`);
    };

    const handleDeleteClick = (docsUrl, id) => {
        const docToRemove = documents.find(doc => doc.id === id);
    
        if (!docToRemove) {
            console.error(`Document with ID ${id} not found.`);
            return;
        }
    
        const confirmed = window.confirm(`Opravdu chcete smazat ${docToRemove.documentTitle}?`);
        
        if (confirmed) {
            docService.remove(docsUrl, id)
                .then(() => {
                    const docsNotToRemove = documents.filter(doc => doc.id !== id);
                    setDocuments(docsNotToRemove);
                })
                .catch(error => {
                    console.error('Error removing document:', error);
                    // Optionally handle error state or display an error message
                });
        }
    };
    
    
    const handlePdfClick = (id) => {
        navigate(`/pdf-view/${id}`);
    };

    return (
        <>
            <Section className='page-hero'>
                <Heading1 text={'Moje faktury '} />
            </Section>
            <Section>
                <div className={"table-header"}>
                    <FormItemsHeader text="Číslo faktury" className="width-20" />
                    <FormItemsHeader text="Datum vystavení" className="width-20" />
                    <FormItemsHeader text="Odběratel" className="width-20" />
                    <FormItemsHeader text="Celková cena" className="width-20" />
                    <FormItemsHeader text="Akce" className="width-10" />
                </div>
                {documents.map(doc => (
                <div className={"table-rows"} key={doc.id}>
                    <FormItemsHeader text={doc.documentNumber} className="width-20" />
                    <FormItemsHeader text={doc.dates.startDate} className="width-20" />
                    <FormItemsHeader text={doc.purchaser.companyName} className="width-20" />
                    <FormItemsHeader text={doc.totalSum} className="width-20" />
                    <div className="width-10">
                        <Button classname={"btn-icon"} onClick={() => handleEditClick(doc.id)}>
                            <FaRegEdit title="Upravit" />
                        </Button>
                        <Button classname={"btn-icon"} onClick={() => handleDeleteClick(docsUrl ,doc.id)}>
                            <MdDeleteOutline  title="Vymazat" />
                        </Button>
                        <Button classname={"btn-icon"} onClick={() => handlePdfClick(doc.id)}>
                            <BsFilePdf title="PDF" />
                        </Button>
                    </div>  
                </div>
                ))}
            </Section>
            <Section>
            </Section>
            
        </>
    )
 }

export default MyDocuments;