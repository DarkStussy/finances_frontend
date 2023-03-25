export const getInputChangeFunc = (setInput, validateInput) => {
    return e => {
        const {name, value} = e.target;
        setInput(prev => ({
            ...prev,
            [name]: value
        }))
        if (validateInput)
            validateInput(e);
    }
}