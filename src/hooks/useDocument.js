
import { useState, useEffect } from 'react';
import docService from '../services/forms'

const useDocuments = (docsUrl) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDocuments = async () => {
    try {
      const initialData = await docService.getAll(docsUrl);
      setDocuments(initialData);
    } catch (error) {
      setError('Error fetching documents');
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDocuments();
  }, [docsUrl]);

  return { documents, setDocuments, loading, error };
};

export default useDocuments;