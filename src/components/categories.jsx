import {Button, ButtonGroup, ButtonToolbar, Container, Form, Modal, Table} from "react-bootstrap";
import {faPenToSquare, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useState} from "react";
import {
    addTransactionCategory,
    changeTransactionCategory, deleteTransactionCategory,
    getAllTransactionCategories
} from "../functions/transaction_category";
import {getInputChangeFunc, getSelectChangeFunc} from "../functions/input_change";
import Select from "react-select";
import {typesOptions} from "../functions/transaction";
import InfinitySpinContainer from "./infinity_spin";

const CategoriesComponent = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState({
        type: 'income', list: []
    });
    const [selectedCategory, setSelectedCategory] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [input, setInput] = useState({
        categoryTitle: "",
        transactionType: ""
    });
    useEffect(() => {
        const getAndSetTransactionCategoriesData = async () => {
            const response = await getAllTransactionCategories(props.accessToken, categories.type)
            setCategories(prevState => (
                {type: prevState.type, list: response}));
            setTimeout(() => setIsLoading(false), 500);
        };
        getAndSetTransactionCategoriesData().catch(console.error);
    }, [isLoading, categories.type, props.accessToken]);

    const handleCloseAddModal = () => setShowAddModal(false);
    const handleShowAddModal = () => {
        setInput({categoryTitle: "", transactionType: input.transactionType});
        setShowAddModal(true);
    };
    const handleCloseEditModal = () => setShowEditModal(false);
    const handleShowEditModal = (category) => {
        return () => {
            setSelectedCategory(category);
            setInput({categoryTitle: category.title, transactionType: input.transactionType});
            setShowEditModal(true)
        };
    };
    const handleCloseDeleteModal = () => setShowDeleteModal(false);
    const handleShowDeleteModal = (category) => {
        return () => {
            setSelectedCategory(category);
            setShowDeleteModal(true);
        }
    }

    const onChangeSelect = getSelectChangeFunc(setInput);

    const categoriesList = categories.list.map(category => {
        return (
            <tr key={category.id}>
                <td colSpan={2} className="text-center">{category.title}</td>
                <td colSpan={2} className="text-end">
                    <FontAwesomeIcon onClick={handleShowEditModal(category)} className="me-2 clickable-row"
                                     icon={faPenToSquare}
                                     size="lg"/>
                    <FontAwesomeIcon onClick={handleShowDeleteModal(category)} icon={faTrash} size="lg"
                                     className="clickable-row"/>
                </td>
            </tr>
        );
    });

    const onChangeTransactionType = e => {
        const {name} = e.target;
        if (categories.type !== name) {
            setCategories({type: name, list: categories.list});
            setIsLoading(true);
        }
    };

    const onChangeCategoryName = getInputChangeFunc(setInput);

    const onSubmitAddCategory = (e) => {
        e.preventDefault();
        addTransactionCategory(props.accessToken, input.categoryTitle, input.transactionType.value).catch(console.error);
        setInput({categoryTitle: "", transactionType: ""});
        setIsLoading(true);
        setShowAddModal(false);
    };

    const onSubmitChangeCategory = (e) => {
        e.preventDefault();
        changeTransactionCategory(props.accessToken, selectedCategory.id, input.categoryTitle).catch(console.error);
        setInput({categoryTitle: "", transactionType: ""});
        setIsLoading(true);
        setShowEditModal(false);
    };

    const onDeleteCategory = (e) => {
        e.preventDefault();
        deleteTransactionCategory(props.accessToken, selectedCategory.id).catch(console.error);
        setIsLoading(true);
        setShowDeleteModal(false);
    };

    return (
        <Container className="categories p-4">
            <div className="d-flex align-items-center justify-content-center">
                <h2 className="text-center p-3">Transaction categories</h2>
                <FontAwesomeIcon
                    onClick={handleShowAddModal}
                    className="mb-1 clickable-row"
                    icon={faPlus}
                    size="xl"/>
            </div>
            <ButtonToolbar
                className="mt-3 justify-content-center">
                <ButtonGroup className="w-100">
                    <Button onClick={onChangeTransactionType} active={categories.type === 'income'} name="income"
                            className="bg-gradient"
                            variant="primary">Income</Button>
                    <Button onClick={onChangeTransactionType} active={categories.type === 'expense'} name="expense"
                            className="bg-gradient"
                            variant="danger">Expense</Button>
                </ButtonGroup>
            </ButtonToolbar>
            {(isLoading) ? (<InfinitySpinContainer marginTop="8rem"/>) : (
                <Table responsive variant="dark">
                    <tbody>
                    {categoriesList}
                    </tbody>
                </Table>
            )}
            <Modal centered show={showAddModal} onHide={handleCloseAddModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add category</Modal.Title>
                </Modal.Header>
                <Form onSubmit={onSubmitAddCategory}>
                    <Modal.Body>
                        <Form.Control autoComplete="off" placeholder="Category title" onChange={onChangeCategoryName}
                                      name="categoryTitle"
                                      value={input.categoryTitle} minLength={3} maxLength={50}/>
                        <Select className="my-select-container text-start mt-3"
                                isSearchable={false}
                                options={typesOptions}
                                value={input.transactionType}
                                onChange={onChangeSelect}
                                classNamePrefix="my-select" placeholder="Category type" required/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit"
                                className="bg-gradient"
                                variant="primary">
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Modal centered show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Change category</Modal.Title>
                </Modal.Header>
                <Form onSubmit={onSubmitChangeCategory}>
                    <Modal.Body>
                        <Form.Control autoComplete="off" onChange={onChangeCategoryName} name="categoryTitle"
                                      value={input.categoryTitle}
                                      minLength={3} maxLength={50}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit"
                                className="bg-gradient"
                                variant="primary">
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Modal centered show={showDeleteModal} onHide={handleCloseDeleteModal}
                   style={{background: "rgba(0, 0, 0, 0.5)"}}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete category `{selectedCategory.title}`?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={onDeleteCategory}>
                        Yes, delete
                    </Button>
                    <Button variant="danger" onClick={handleCloseDeleteModal}>
                        No, back
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CategoriesComponent;