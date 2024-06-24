import axios from 'axios';

export const useFetchCompanyData = () => {
    const fetchDataAndUpdateForm = async (formValues, setFormValues) => {
        try {
            const response = await axios.get(`https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${formValues.ico}`);
            const data = response.data;
    
            if (data) {
                const { ico, obchodniJmeno, sidlo, stav } = data;
                const { nazevUlice, cisloOrientacni, cisloDomovni, nazevObce, nazevCastiObce, psc } = sidlo;
                const cp = cisloOrientacni ? `${cisloDomovni}/${cisloOrientacni}` : cisloDomovni;
                const address = nazevUlice ? `${nazevUlice} ${cp}` : `${nazevCastiObce}/${cp}`;
    
                setFormValues({
                    ...formValues,
                    ico,
                    companyName: obchodniJmeno,
                    street: address,
                    city: nazevObce,
                    postalCode: psc,
                    stav: stav || '',
                });
            } else {
                setFormValues({
                    ...formValues,
                    stav: 'IČO firmy nebylo nalezeno',
                });
            }
        } catch (error) {
            console.error('Error fetching company information:', error);
            setFormValues({
                ...formValues,
                stav: 'Chyba při načítání dat',
            });
        }
    };

    return fetchDataAndUpdateForm;
};

