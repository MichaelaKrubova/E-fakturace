const Section = ({children, className}) => {
    return (
        <section className={`top-section ${className}`}>
            {children}
        </section>
    )
}

export default Section;