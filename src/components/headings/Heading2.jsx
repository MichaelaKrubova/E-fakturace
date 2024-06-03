import { useContext } from 'react';
import { FormHeading } from '../../context/FormHeading';

const Heading2 = () => {
    const h2text = useContext(FormHeading);
    return (
        <>
            <h2>{h2text} </h2>
        </>
    )
}

export default Heading2;