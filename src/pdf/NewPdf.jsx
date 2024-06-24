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

const separateNum = (num) => {
  return (
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  );
}

// Create styles
const styles = StyleSheet.create({
    page: {
      fontFamily: 'Poppins',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
      fontSize: 10,
      paddingHorizontal: 30,
      paddingVertical: 10
    },
    section: {
      paddingVertical: 20
    },
    flexRow : {
      display: 'flex',
      flexDirection: 'row',
    },
    title:  {
        fontSize: 14,
        fontWeight: 700,
        paddingVertical: 10,
    },
    title2: {
        fontSize: 11,
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
    borderRight: {
      borderRightWidth: 1,
      borderRightStyle: 'solid',
      borderRightColor: '#e4e3e3',
    },

    smallTitle: {
      fontSize: 10, 
      width: '100%', 
      paddingVertical: 5 
    }, 
    smallColumn: {
      width: '18%', 
      textAlign: 'right'
    },
    stamp: {
      fontSize: 8,
      fontWeight: 700,
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',

    },
    flexWrap: {
      marginTop: 50,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      textAlign: 'center'
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
          <View style={[styles.title, styles.borderBottom, {display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}]}>
              <Text>Faktura č.: {document.documentNumber}</Text>
          </View>
          
          <View style={[ styles.flexRow,  { justifyContent: 'space-between' }]}>
              <View style={[styles.section,  styles.borderRight, {width: '50%'} ]}>
                  <Text style={styles.title2}>{document.supplier.title} </Text>
                  <Text style={{fontWeight: 700}}>{document.supplier.companyName}</Text>
                  <Text>IČO: {document.supplier.ico}</Text>
                  <Text>{document.supplier.street}, {document.supplier.postalCode} {document.supplier.city} </Text>
                  <Text>{document.supplier.postalCode} {document.supplier.city} </Text>
              </View>
              <View style={[styles.section, {display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start', paddingTop: 100, paddingRight: 80}]}>
                  <Text style={styles.title2}>{document.purchaser.title} </Text>
                  <Text style={{fontWeight: 700}}>{document.purchaser.companyName}</Text>
                  <Text>IČO: {document.purchaser.ico}</Text>
                  <Text>{document.purchaser.street}, {document.purchaser.postalCode} {document.purchaser.city} </Text>
                  <Text>{document.purchaser.postalCode} {document.purchaser.city} </Text>
              </View>
          </View>
          
          <Text style={[styles.smallTitle, styles.borderRight, {width: '50%'} ]}>Platební metoda:  <Text style={{fontWeight: 700}}>{document.paymentMethods.paymentMethod}</Text></Text>
          <View  style={[styles.flexRow, styles.borderTop,   { justifyContent: 'space-between', position: 'relative' }]}>
            <View style={[styles.section, {fontWeight: 700}  ]}>
                {document.paymentMethods.paymentMethod === "Převodem" && (
              <>
                <Text>Bankovní účet: </Text>
                <Text >{document.paymentMethods.accountNumber}/{document.paymentMethods.bankCode}</Text>
                <Text style={{paddingTop: 10}}>Variabilní symbol:</Text>
                <Text> {document.paymentMethods.vs}</Text>
              </>
              )}
            </View>
            <View style={[styles.section, {display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}]}>
              <Text>Datum vystavení {document.dates.startDate}</Text>
              <Text style={{fontWeight: 700}}>Datum splatnosti: {document.dates.payStartDate}</Text>
            </View>
            <View style={[styles.section, {display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}]}>
              <Text style={[]}>K úhradě: {separateNum(document.totalSum)} Kč</Text>
            </View>
          </View>
          <View style={styles.section}>
                <View style={[styles.flexRow, styles.section, {width: '100%', backgroundColor: '#e4e3e3', padding: 3, justifyContent: 'space-between', fontSize: 10}]}>
                  <Text style={{width: '70%'}}>Položka</Text>
                  <Text style={[ styles.smallColumn]}>Množství</Text>
                  <Text style={[ styles.smallColumn]}>Jednotka</Text>
                  <Text style={[ styles.smallColumn]} >Cena / m.j.</Text>
                  <Text style={[ styles.smallColumn]} >Celkem</Text>
                </View>
              
              {document.items.map((item, index) => (
                <View key={item.id} style={[styles.flexRow, styles.section,  {width: '100%', padding: 3, justifyContent: 'space-between', fontSize: 10}]}>
                  <Text style={[ {width: '70%'}]} key={index}>{item.item}</Text>
                  <Text style={[ styles.smallColumn]} key={index}>{item.quantity}</Text>
                  <Text style={[ styles.smallColumn]} key={index}>{item.unit}</Text>
                  <Text style={[ styles.smallColumn]} key={index}>{separateNum(item.price)} Kč</Text>
                  <Text style={[ styles.smallColumn]} key={index}>{separateNum(item.totalPrice)} Kč</Text>
                </View>
              ))}
          </View>
          <View style={[styles.section, {display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', width: '100%', paddingTop: 40}]}>
            <Text style={[styles.smallTitle, {textAlign: 'right'}]}>
              Celkem k úhradě:
            </Text>
            <Text style={styles.title2}>{separateNum(document.totalSum)} Kč</Text>
          </View>
          <View style={[styles.flexWrap,]}>
            <View style={[styles.stamp]}>
                <Text style={{textAlign: 'center'}}>Petr Kruba</Text>
                <Text>Pozďátky 35 675 01 Slavičky</Text>
                <Text>IČO: 88089444</Text>
                <Text>tel.: +420 737 315 218</Text>
            </View>
          </View>
          <View style={[styles.borderTop, {position: 'relative', marginTop: 100}]}>

          </View>
            <View style={[ styles.section, {position: 'absolute', bottom: 0, right: 0, left: 0, width: '100%', paddingLeft: 50}]} fixed>
              <Text style={{fontSize: 8}}>Zapsaná v MěÚ Třebíč</Text>
              <Text style={{fontSize: 8}}>Vystavil: Petr Kruba {document.dates.startDate}</Text>
            </View>
        </Page>
      </Document>
    );
  };

export default NewPdf