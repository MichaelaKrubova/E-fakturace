const FormSelect = ({ text, options,  onChange, value, name }) => {
    return (
        <div>
            <label>{text}
                <select onChange={onChange} value={value} name={name} > 
                    {options.map((option) => (
                        <option key={option.name} value={option.value} name={option.name}>{option.text}</option>
                    ))}
                </select>
            </label>
        </div>
    );
}

export default FormSelect;