import React from 'react';
import { Page, Text, Font, View, Document, StyleSheet } from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';
import PoppinsRegular from '../assets/fonts/Poppins-Regular.ttf';
import PoppinsBold from '../assets/fonts/Poppins-Bold.ttf';

Font.register({
  family: 'Poppins',
  fonts: [
    {
      src: PoppinsRegular,
      fontWeight: 400
    },
    {
      src: PoppinsBold,
      fontWeight: 700
    }
  ],
});

// Create styles
const styles = StyleSheet.create({
    page: {
      fontFamily: 'Poppins',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
      fontSize: 11
    },
    section: {
      paddingHorizontal: 30,
      paddingVertical: 10
    },
    flexRow : {
      display: 'flex',
      flexDirection: 'row',
    },
    title:  {
        fontSize: 17,
        fontWeight: 700,
        margin: 10,
    },
    title2: {
        fontSize: 14,
        fontWeight: 700
    },

    borderBottom: {
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: '#e4e3e3',
    },
    borderTop: {
      borderTopWidth: 1,
      borderTopStyle: 'solid',
      borderTopColor: '#e4e3e3',
    },

    smallTitle: {
      fontSize: 10, 
      width: '18%', 
      marginLeft: 10, 
      marginTop: 20 
    }

  });




  // Create Document Component
  const NewPdf = ({ document, savePDF }) => {
    if (!document) {
      return (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <Text>No document data available.</Text>
            </View>
          </Page>
        </Document>
      );
    }
  
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={[styles.title, styles.borderBottom]}>
              <Text>Faktura č.: {document.documentNumber}</Text>
          </View>
          
          <Text style={[styles.borderBottom, styles.smallTitle]}>Identifikační údaje</Text>
          <View style={[styles.section, styles.flexRow, { justifyContent: 'space-between' }]}>
              <View style={styles.section}>
                  <Text style={styles.title2}>{document.supplier.title} </Text>
                  <Text style={{fontWeight: 700}}>{document.supplier.companyName}</Text>
                  <Text>IČO: {document.supplier.ico}</Text>
                  <Text>{document.supplier.street}, {document.supplier.postalCode} {document.supplier.city} </Text>
                  <Text>{document.supplier.postalCode} {document.supplier.city} </Text>
              </View>
              <View style={styles.section}>
                  <Text style={styles.title2}>{document.purchaser.title} </Text>
                  <Text style={{fontWeight: 700}}>{document.purchaser.companyName}</Text>
                  <Text>IČO: {document.purchaser.ico}</Text>
                  <Text>{document.purchaser.street}, {document.purchaser.postalCode} {document.purchaser.city} </Text>
                  <Text>{document.purchaser.postalCode} {document.purchaser.city} </Text>
              </View>
          </View>
          
          <Text style={[styles.borderBottom, styles.smallTitle]}>Platební údaje</Text>
          <View  style={[styles.section, styles.flexRow, { justifyContent: 'space-between' }]}>
            <View style={styles.section}>
                <Text>Platební metoda: {document.paymentMethods.paymentMethod}</Text>
                {document.paymentMethods.paymentMethod === "Převodem" && (
              <>
                <Text>Bankovní účet: {document.paymentMethods.accountNumber}/{document.paymentMethods.bankCode}</Text>
                <Text>Variabilní sybmol: {document.paymentMethods.vs}</Text>
              </>
              )}
                <Text style={[{fontWeight: 700}]}>K úhradě: {document.totalSum}</Text>
            </View>
            <View style={styles.section}>
              <Text>Datum vystavení {document.dates.startDate}</Text>
              <Text style={{fontWeight: 700}}>Datum splatnosti: {document.dates.payStartDate}</Text>
            </View>
          </View>
          <View style={styles.section}>
                <View style={[styles.flexRow, styles.section, {width: '100%', backgroundColor: '#e4e3e3', padding: 3, justifyContent: 'space-between'}]}>
                  <Text style={{width: '35%'}}>Položka</Text>
                  <Text style={[ {width: '18%', textAlign: 'right'}]}>Množství</Text>
                  <Text style={[ {width: '18%', textAlign: 'right'}]}>Jednotka</Text>
                  <Text style={[ {width: '18%', textAlign: 'right'}]} >Cena za m.j.</Text>
                  <Text style={[ {width: '18%', textAlign: 'right'}]} >Celkem</Text>
                </View>
              
              {document.items.map((item, index) => (
                <View style={[styles.flexRow, styles.section, styles.borderBottom,  {width: '100%', padding: 3, justifyContent: 'space-between', fontSize: 12}]}>
                  <Text style={[ {width: '35%'}]} key={index}>{item.item}</Text>
                  <Text style={[ {width: '18%', textAlign: 'right'}]} key={index}>{item.quantity}</Text>
                  <Text style={[ {width: '18%', textAlign: 'right'}]} key={index}>{item.unit}</Text>
                  <Text style={[ {width: '18%', textAlign: 'right'}]} key={index}>{item.price}</Text>
                  <Text style={[ {width: '18%', textAlign: 'right'}]} key={index}>{item.totalPrice}</Text>
                </View>
              ))}
          </View>
          <View style={[styles.section, {display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', width: '100%'}]}>
            <Text style={styles.smallTitle}>
              Celkem k úhradě
            </Text>
            <Text style={styles.title2}>{document.totalSum} Kč</Text>
          </View>
          <View style={[styles.borderTop, styles.section, {position: 'absolute', bottom: 0, width: '100%'}]} fixed>
            <Text style={{fontSize: 8}}>Vystaveno: {document.dates.startDate}</Text>
          </View>
        </Page>
      </Document>
    );
  };

export default NewPdf