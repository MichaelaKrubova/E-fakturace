const Heading1 = ({text, number}) => {
    return (
        <>
            <div className="main-heading">
                <h1>{text} {number && number} </h1>
            </div>
        </>
    )
}

export default Heading1;