const FormInput = ({ text, type, onChange, value, name, hasButton, buttonText, onButtonClick, className, placeholder, min, readOnly, step, currency }) => {
    return (
        <div className={className}>
            <label>{text}
                <input type={type} onChange={onChange} value={value} name={name} placeholder={placeholder} min={min} readOnly={readOnly} step={step} />
                {hasButton && (
                    <button onClick={onButtonClick}>
                        {buttonText}
                    </button>
                )}
                {currency}
            </label>
        </div>
    );
}

export default FormInput;