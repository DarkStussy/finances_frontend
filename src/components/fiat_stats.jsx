import {Button, ButtonGroup, Col, Container, Row, Table} from "react-bootstrap";
import {ArcElement, Chart as ChartJS, Tooltip} from "chart.js";
import {fiatStatsOptions, getISODate} from "../functions/periods";
import Select from "react-select";
import {useEffect, useState} from "react";
import {getSelectChangeFunc} from "../functions/input_change";
import {getTotalCategoriesByPeriod} from "../functions/totals";
import {Pie} from "react-chartjs-2";
import {generateColors} from "../functions/get_colors";

ChartJS.register(ArcElement, Tooltip);

const FiatStatsComponent = (props) => {
    let [options, setOptions] = useState({
        fiatStatsType: fiatStatsOptions[1],
        date: new Date(),
        type: "income"
    });
    let [totalCategories, setTotalCategories] = useState({total: 0, list: []});
    useEffect(() => {
        const setData = (startDate, endDate) => {
            getTotalCategoriesByPeriod(props.accessToken, startDate, endDate, options.type).then(data => {
                if (!data.detail) {
                    setTotalCategories({total: data.total, list: data.categories});
                } else {
                    console.error(data.detail);
                }
            });
        }
        let startDate, endDate;
        switch (options.fiatStatsType.value) {
            case "weakly":
                endDate = new Date(options.date.getFullYear(),
                    options.date.getMonth(), options.date.getDate() + 1);
                startDate = new Date(endDate);
                startDate.setDate(endDate.getDate() - 6);
                setData(startDate, endDate);
                break;
            case "monthly":
                startDate = new Date(options.date.getFullYear(), options.date.getMonth(), 1);
                endDate = new Date(options.date.getFullYear(), options.date.getMonth() + 1, 1);
                setData(startDate, endDate);
                break;
            case "annually":
                startDate = new Date(options.date.getFullYear(), 0, 1);
                endDate = new Date(options.date.getFullYear() + 1, 0, 1);
                setData(startDate, endDate);
                break;
            default:
                break;
        }
    }, [options.date, options.fiatStatsType, options.type, props.accessToken]);
    const getSliderValue = () => {
        let value;
        switch (options.fiatStatsType.value) {
            case "monthly":
                const month = options.date.toLocaleString('en-US', {month: 'long'});
                value = `${month} ${options.date.getFullYear()}`;
                break;
            case "annually":
                value = options.date.getFullYear();
                break;
            case "weakly":
                const now = new Date(options.date.getFullYear(),
                    options.date.getMonth(), options.date.getDate() + 1);
                const nowStr = getISODate(now);
                const weekAgo = new Date(now);
                weekAgo.setDate(now.getDate() - 6);
                const weakAgoStr = getISODate(weekAgo);
                value = `${weakAgoStr} ~ ${nowStr}`;
                break;
            default:
                value = "";
        }
        return value;
    }
    const onChangePeriodType = getSelectChangeFunc(setOptions);
    const onChangeTransactionType = e => {
        const {name} = e.target;
        setOptions(prevState => ({
            fiatStatsType: prevState.fiatStatsType,
            date: prevState.date,
            type: name
        }));
    };
    const backOrForwardPeriod = (type) => {
        return () => {
            let newDate = new Date();
            switch (options.fiatStatsType.value) {
                case "monthly":
                    if (type === 'back')
                        newDate = new Date(options.date.getFullYear(), options.date.getMonth() - 1, options.date.getDate())
                    else if (type === 'forward')
                        newDate = new Date(options.date.getFullYear(), options.date.getMonth() + 1, options.date.getDate())
                    setOptions(prevState => ({
                        date: newDate,
                        fiatStatsType: prevState.fiatStatsType,
                        type: prevState.type
                    }));
                    break;
                case "annually":
                    if (type === 'back')
                        newDate = new Date(options.date.getFullYear() - 1, options.date.getMonth(), options.date.getDate())
                    else if (type === 'forward')
                        newDate = new Date(options.date.getFullYear() + 1, options.date.getMonth(), options.date.getDate())
                    setOptions(prevState => ({
                        date: newDate,
                        fiatStatsType: prevState.fiatStatsType,
                        type: prevState.type
                    }));
                    break;
                case "weakly":
                    if (type === 'back')
                        newDate = new Date(options.date.getFullYear(), options.date.getMonth(), options.date.getDate() - 7)
                    else if (type === 'forward')
                        newDate = new Date(options.date.getFullYear(), options.date.getMonth(), options.date.getDate() + 7)
                    setOptions(prevState => ({
                        date: newDate,
                        fiatStatsType: prevState.fiatStatsType,
                        type: prevState.type
                    }));
                    break;
                default:
                    break;
            }
        }
    };
    const colors = generateColors(totalCategories.list.length);

    const data = {
        labels: [],
        datasets: [
            {
                label: props.baseCurrency.currencyCode,
                data: [],
                backgroundColor: colors,
                hoverBackgroundColor: colors,
                borderWidth: 0.25,
            },
            {
                label: '%',
                data: [],
                backgroundColor: colors,
                hoverBackgroundColor: colors,
                borderWidth: 0.25,
            }
        ],
    };
    const totalCategoriesRows = [];
    for (let i = 0; i < totalCategories.list.length; i++) {
        const cat = totalCategories.list[i];
        const title = cat.category;
        const percentage = cat["percentage"];
        const total = cat.total;
        data.labels.push(title);
        data.datasets[0].data.push(total);
        data.datasets[1].data.push(percentage);
        totalCategoriesRows.push(
            <tr key={title}>
                <td colSpan={1} className="text-start">{title}</td>
                <td colSpan={1} className="text-center">
                    <span className="percentage-badge fw-bold"
                          style={{
                              background: colors[i],
                          }}>{percentage}%</span>
                </td>
                <td colSpan={1} className="text-end">{total}</td>
            </tr>
        );
    }
    const pie = totalCategories.list.length === 0 ? <h4 className="p-5 text-center">No data available</h4> :
        <Pie className="mt-5 w-auto m-auto" data={data}/>;

    return <Container className="mt-4">
        <h2 className="text-center">Stats</h2>
        <Row className="mt-4 text-center justify-content-md-center">
            <Col className="m-auto">
                <ButtonGroup className="p-1">
                    <Button onClick={backOrForwardPeriod("back")} className="bg-gradient"
                            variant="outline-secondary">&lt;</Button>
                    <Button className="bg-gradient text-white"
                            variant="outline-secondary"><small>{getSliderValue()}</small></Button>
                    <Button onClick={backOrForwardPeriod("forward")} className="bg-gradient"
                            variant="outline-secondary">&gt;</Button>
                </ButtonGroup>
            </Col>
            <Col className="m-auto">
                <ButtonGroup className="p-1">
                    <Button name="income"
                            className="bg-gradient"
                            variant="success" onClick={onChangeTransactionType}
                            active={options.type === 'income'}>Income</Button>
                    <Button name="expense"
                            className="bg-gradient"
                            variant="danger" onClick={onChangeTransactionType}
                            active={options.type === 'expense'}>Expense</Button>
                </ButtonGroup>
            </Col>
            <Col className="m-auto">
                <Select isSearchable={false} className="my-select-container text-start p-1"
                        classNamePrefix="my-select" placeholder="Period"
                        value={options.fiatStatsType}
                        onChange={onChangePeriodType}
                        options={fiatStatsOptions}/>
            </Col>
        </Row>
        <Container className="w-50 h-50">
            {pie}
        </Container>
        <Container className="total-categories p-4">
            <Table responsive variant="dark">
                <thead>
                <tr>
                    <td colSpan={1} className="text-start">Category</td>
                    <td colSpan={1} className="text-center">%</td>
                    <td colSpan={1} className="text-end">Total {props.baseCurrency.currencyCode}</td>
                </tr>
                </thead>
                <tbody>
                {totalCategoriesRows}
                </tbody>
            </Table>
        </Container>
    </Container>
};

export default FiatStatsComponent;