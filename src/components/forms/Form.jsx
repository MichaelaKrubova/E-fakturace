import { FormHeading } from "../../context/FormHeading";
import Heading2 from "../headings/Heading2";

const Form = ({children, h2text}) => {
    return (
        <form action="">
            <fieldset>
                <legend>
                    <FormHeading.Provider value={h2text}>
                        <Heading2  />
                    </FormHeading.Provider>
                </legend>
                <div>
                    {children}
                </div>
            </fieldset>
        </form>
    )
}

export default Form;