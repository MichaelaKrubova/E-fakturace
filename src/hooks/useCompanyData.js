import { useState, useEffect } from 'react';
import docService from '../services/forms';

const useCompanyData = (docsUrl) => {
  const [companyData, setCompanyData] = useState(null);
  const [supplierFormValues, setSupplierFormValues] = useState({
    title: '',
    ico: '',
    companyName: '',
    dic: '',
    street: '',
    postalCode: '',
    city: ''
  });
  const [bankFormValues, setBankFormValues] = useState({
    accountNumber: '',
    bankCode: ''
  });
  const [contactValues, setContactValues] = useState({
    phone: '',
    email: ''
  });

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
          bankCode: data.paymentMethods.bankCode
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
  }, [docsUrl]);

  return {
    companyData,
    supplierFormValues,
    setSupplierFormValues,
    bankFormValues,
    setBankFormValues,
    contactValues,
    setContactValues
  };
};

export default useCompanyData;
