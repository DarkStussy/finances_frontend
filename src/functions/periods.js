export const backOrForwardOneDay = (type, date, setDate) => {
    let newDate = new Date();
    if (type === "back")
        newDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    else if (type === "next")
        newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    setDate(newDate);
}


export const getISODate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const getISODatetime = (datetime) => {
    const year = datetime.getFullYear();
    const month = String(datetime.getMonth() + 1).padStart(2, '0');
    const day = String(datetime.getDate()).padStart(2, '0');
    const hours = String(datetime.getHours()).padStart(2, '0');
    const minutes = String(datetime.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const fiatStatsOptions = [
    {label: "Annually", value: "annually", type: "fiatStatsType"},
    {label: "Monthly", value: "monthly", type: "fiatStatsType"},
    {label: "Weakly", value: "weakly", type: "fiatStatsType"},
];