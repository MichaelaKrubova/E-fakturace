//react 
import React from 'react';
import { useState, useEffect, createContext  } from 'react';
import { useParams } from 'react-router-dom';

//server/database
import docService from '../services/forms'


//hooks
import useDocuments from '../hooks/useDocument';

//components
import Section from '../components/Section';
import NewPdf from "../pdf/NewPdf";
import { PDFViewer } from '@react-pdf/renderer';


const PdfView = () => {


     //db url
     const docsUrl = 'http://localhost:3001/faktury'

     //documents from db:
     const { documents, setDocuments, loading, error } = useDocuments(docsUrl);
     const [currentDocument, setCurrentDocument] = useState(null);
     const { id } = useParams();

     useEffect(() => {
        if (documents.length > 0) {
            const doc = documents.find(doc => doc.id === id);

            setCurrentDocument(doc);
        }
    }, [documents, id]);
    return (
        
    <Section>
        <PDFViewer  width="100%" height="1200">
            <NewPdf document={currentDocument} />
        </PDFViewer>
    </Section>

    )
}

export default PdfView