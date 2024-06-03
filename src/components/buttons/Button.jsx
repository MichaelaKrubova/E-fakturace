const Button = ({text, classname, onClick}) => {
    return (
        <>
            <button className={classname} onClick={onClick}>{text}</button>
        </>
    )
}

export default Button;