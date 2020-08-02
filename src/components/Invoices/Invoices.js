import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Typography,
  Grid,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  makeStyles,
  Slide,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@material-ui/core';
import {
  Pagination
} from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Button as RBButton
} from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Notify, createNotification } from 'react-redux-notify';
import { succeessAddInvoiceNotification, errorAddInvoiceNotification } from '../../redux/constants/notifications';


const useStyles = makeStyles((theme) => ({
  input: {
    display: 'none',
  },
  dialogTitle: {
    textAlign: 'center',
  },
  label: {
    marginBottom: '0',
  },
  iframe: {
    border: 'none',
    boxShadow: '10px 10px 20px grey',
    width: '90%',
    height: '90%',
    margin: '0 auto',
    display: 'block',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100,
  },
  yearTextField: {
    width: 100,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Invoices = ({ createNotification }) => {
  const classes = useStyles();
  const cookies = new Cookies();
  const csrfAccessToken = cookies.get('csrf_access_token');

  const [loading, setLoading] = useState(false);

  // CONTRACTS STATE
  const [contracts, setContracts] = useState([]);
  const [contractExpanded, setContractExpanded] = useState(false);
  const [contractsList, setContractsList] = useState("");
  const [contractsPage, setContractsPage] = useState(1);
  const [contractsCount, setContractsCount] = useState(0);
  const [contractMonth, setContractMonth] = useState("");
  const [contractYear, setContractYear] = useState("");

  // INVOICES STATE
  const [invoicesList, setInvoicesList] = useState("");
  const [invoicesPage, setInvoicesPage] = useState(1);
  const [invoicesCount, setInvoicesCount] = useState(0);
  const [invoiceSelected, setInvoiceSelected] = useState("");
  const [invoiceMonth, setInvoiceMonth] = useState("");
  const [invoiceYear, setInvoiceYear] = useState("");

  // DELETE
  const [deleteInvoiceDialogState, setDeleteInvoiceDialogState] = useState(false);
  // ADD
  const [addInvoiceDialogState, setAddInvoiceDialogState] = useState(false);
  const [addInvoiceFile, setAddInvoiceFile] = useState({});
  const [addInvoceFilePath, setAddInvoiceFilePath] = useState("");
  // CHANGE
  const [changeInvoiceDialogState, setChangeInvoiceDialogState] = useState(false);
  const [changeInvoiceFile, setChangeInvoiceFile] = useState({});
  const [changeInvoceFilePath, setChangeInvoiceFilePath] = useState("");

  const handleContractsSelectedChange = (contractNumber) => (event, isExpanded) =>
    setContractExpanded(isExpanded ? contractNumber : false);

  const handleChangeContractMonth = (event) => setContractMonth(event.target.value);
  const handleChangeContractYear = (event) => {
    let year = parseInt(event.target.value);
    Number.isInteger(year) ? setContractYear(year) : setContractYear("");
  }

  const handleChangeInvoiceMonth = (event) => setInvoiceMonth(event.target.value);
  const handleChangeInvoiceYear = (event) => {
    let year = parseInt(event.target.value);
    Number.isInteger(year) ? setInvoiceYear(year) : setInvoiceYear("");
  }

  // PAGINATION
  const handleInvoicesPageChange = (event, value) => setInvoicesPage(value);
  const handleContractsPageChange = (event, value) => setContractsPage(value);

  // DELETE INVOICE
  const openDeleteInvoiceDialog = (invoice_number) => {
    setDeleteInvoiceDialogState(true);
    setInvoiceSelected(invoice_number);
  }
  const closeDeleteInvoiceDialog = () => setDeleteInvoiceDialogState(false);
  const handleDeleteInvoice = async () => {
    try {
      await axios.delete(
        '/api/customer/delete-invoice/' + invoiceSelected,
        { headers: { 'X-CSRF-TOKEN': csrfAccessToken } }
      );
      setContractExpanded(false);
      setDeleteInvoiceDialogState(false);
      getContracts();
    } catch (error) {
      console.log(error);
    }
  }

  // ADD INVOICE
  const openAddInvoiceDialog = () => setAddInvoiceDialogState(true);
  const closeAddInvoiceDialog = () => setAddInvoiceDialogState(false);
  const handleInputInvoice = (event) => {
    let inputFile = event.target.files[0];
    setAddInvoiceFile(inputFile);
    let reader = new FileReader();
    reader.onload = () => setAddInvoiceFilePath(reader.result);
    reader.onerror = error => console.log('Error: ', error);
    reader.readAsDataURL(inputFile);
  };
  const handleAddInvoice = async () => {
    try {
      var formData = new FormData();
      formData.append('file', addInvoiceFile);
      const result = await axios.post(
        '/api/customer/add-invoice',
        formData,
        {
          headers: {
            'X-CSRF-TOKEN': csrfAccessToken,
            'content-type': 'multipart/form-data'
          }
        },
      );
      if (result.data.type === "error") {
        createNotification(errorAddInvoiceNotification(result.data.message));
      } else {
        createNotification(succeessAddInvoiceNotification);
        setAddInvoiceDialogState(false);
        getContracts();
      }
    } catch (error) {
      createNotification(errorAddInvoiceNotification(
        "Ha ocurrido un error, la factura no se ha guardado"
      ));
      console.log(error.response);
    }
  }

  // CHANGE INVOICE
  const openChangeInvoiceDialog = (invoice_number) => {
    setChangeInvoiceDialogState(true);
    setInvoiceSelected(invoice_number);
  }
  const closeChangeInvoiceDialog = () => setChangeInvoiceDialogState(false);
  const handleInputChangeInvoice = (event) => {
    let inputFile = event.target.files[0];
    setChangeInvoiceFile(inputFile);
    let reader = new FileReader();
    reader.onload = () => setChangeInvoiceFilePath(reader.result);
    reader.onerror = error => console.log('Error: ', error);
    reader.readAsDataURL(inputFile);
  };
  const handleChangeInvoice = async () => {
    setContractExpanded(false);
    try {
      var formData = new FormData();
      formData.append('file', changeInvoiceFile);
      await axios.post(
        '/api/customer/add-invoice',
        formData,
        {
          headers: {
            'X-CSRF-TOKEN': csrfAccessToken,
            'content-type': 'multipart/form-data'
          }
        },
      );
      await axios.delete(
        '/api/customer/delete-invoice/' + invoiceSelected,
        { headers: { 'X-CSRF-TOKEN': csrfAccessToken } }
      );
      setChangeInvoiceDialogState(false);
      getContracts();
    } catch (error) {
      console.log(error.response.data);
    }
  }

  const getContracts = async () => {
    setLoading(true);
    const data = await axios.get('/api/customer/get-invoices-data');
    const contracts = data.data;
    contracts.sort((a, b) =>
      new Date(a.contract_data.init_date) - new Date(b.contract_data.init_date)
    );
    if (contracts.length === 0) {
      setContracts([]);
      setContractsCount(0);
      setContractExpanded(false);
      setContractsList("");
      setInvoicesList("");
    } else {
      setContracts(contracts);
      setContractsCount(Math.ceil(contracts.length / 3));
      setContractExpanded(contracts[0].contract_data.contract_number);
    }
    setLoading(false);
  }

  useEffect(() => {
    getContracts();
  }, []);

  useEffect(() => {
    if (contractExpanded) {
      let contractsToShow = [...contracts];
      if (Number.isInteger(contractMonth))
        contractsToShow = contractsToShow.filter(contract =>
          new Date(contract.contract_data.init_date).getMonth() === contractMonth
        );
      if (Number.isInteger(contractYear)) {
        contractsToShow = contractsToShow.filter(contract =>
          new Date(contract.contract_data.init_date).getFullYear() === contractYear
        );
      }
      setContractsCount(Math.ceil(contractsToShow.length / 3));
      const endIndex = contractsPage * 3;
      const paginatedContracts = contractsToShow.slice(endIndex - 3, endIndex);
      const updatedContractsList = paginatedContracts.map(contract => {
        const contractNumber = contract.contract_data.contract_number;
        return (
          <Accordion
            key={contractNumber}
            expanded={contractExpanded === contractNumber}
            onChange={handleContractsSelectedChange(contractNumber)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Grid container direction="column">
                <Typography>Dirección: {contract.contract_data.address}</Typography>
                <Typography>Nº contrato: {contractNumber}</Typography>
                <Typography>Fecha inicio: {contract.contract_data.init_date}</Typography>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column">
                <Typography>Potencia contratada: {contract.contract_data.contracted_power} kWs/h</Typography>
                <Typography>Peaje acceso: {contract.contract_data.toll_access}</Typography>
                <Typography>Fecha fin: {contract.contract_data.end_date}</Typography>
                <Typography>CNAE: {contract.contract_data.CNAE}</Typography>
                <Typography>Tarifa acceso: {contract.contract_data.tariff_access}</Typography>
                <Typography>Descripción: {contract.contract_data.description}</Typography>
              </Grid>
            </AccordionDetails>
          </Accordion>
        );
      });
      setContractsList(updatedContractsList);
    }
  }, [
    contractExpanded,
    contracts,
    contractsPage,
    contractMonth,
    contractYear
  ]);

  useEffect(() => {
    if (contractExpanded) {
      let invoicesList = contracts.find(contract =>
        contract.contract_data.contract_number === contractExpanded
      ).invoices;
      if (Number.isInteger(invoiceMonth))
        invoicesList = invoicesList.filter(invoice =>
          new Date(invoice.init_date).getMonth() === invoiceMonth
        );
      if (Number.isInteger(invoiceYear)) {
        invoicesList = invoicesList.filter(invoice =>
          new Date(invoice.init_date).getFullYear() === invoiceYear
        );
      }
      setInvoicesCount(Math.ceil(invoicesList.length / 5));
      invoicesList.sort((a, b) =>
        new Date(a.init_date) - new Date(b.init_date)
      );
      const endIndex = invoicesPage * 5;
      invoicesList = invoicesList.slice(endIndex - 5, endIndex);
      const updatedInvoicesList = invoicesList.map(invoice =>
        <Accordion
          key={invoice.invoice_number}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid container direction="column">
              <Typography>Nº de factura: {invoice.invoice_number}</Typography>
              <Typography>Fecha de inicio: {invoice.init_date}</Typography>
              <Typography>Cuantía total: {invoice.total_amount} €</Typography>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container direction="column">
              <Typography>Potencia contratada: {invoice.contracted_power_amount} kWs</Typography>
              <Typography>Energía consumida: {invoice.consumed_energy_amount} kWs</Typography>
              <Typography>Fecha de emisión: {invoice.issue_date}</Typography>
              <Typography>Fecha de cargo: {invoice.charge_date}</Typography>
              <Typography>Fecha de fin: {invoice.end_date}</Typography>
              <Typography>Impuestos: {invoice.tax}%</Typography>
              <Typography>Referencia contrato: {invoice.contract_reference}</Typography>
              <Box my={2}>
                <Grid container justify="space-evenly">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => openChangeInvoiceDialog(invoice.invoice_number)}
                  >
                    Cambiar
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => openDeleteInvoiceDialog(invoice.invoice_number)}
                  >
                    Eliminar
                  </Button>
                </Grid>
              </Box>
            </Grid>
          </AccordionDetails>
        </Accordion>
      );
      setInvoicesList(updatedInvoicesList);
    }
  }, [
    contractExpanded,
    contracts,
    invoicesPage,
    invoiceMonth,
    invoiceYear
  ]);

  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box m={4}>
            <Grid container direction="column">
              <Typography align="center" variant="h5">Selecciona un contrato</Typography>
              <Box my={4}>
                {loading ?
                  <Box display="flex" justifyContent="center">
                    <CircularProgress />
                  </Box>
                  :
                  <>
                    {contractsList.length !== 0 ?
                      contractsList :
                      <>
                        {contractMonth || contractYear ?
                          <Typography align="center">No tienes contratos en la fecha seleccionada</Typography> :
                          <Typography align="center">No tienes ningún contrato, añade alguna factura</Typography>
                        }
                      </>
                    }
                  </>
                }
              </Box >
              <Box display="flex" justifyContent="center">
                <Pagination color="primary" page={contractsPage} count={contractsCount} onChange={handleContractsPageChange} />
              </Box>
              <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="contract-select-month">Mes</InputLabel>
                  <Select
                    labelId="contract-select-month"
                    id="contract-select-month"
                    value={contractMonth}
                    onChange={handleChangeContractMonth}
                    label="contract-month"
                  >
                    <MenuItem value=""><em>&nbsp;</em></MenuItem>
                    <MenuItem value={0}>Enero</MenuItem>
                    <MenuItem value={1}>Febrero</MenuItem>
                    <MenuItem value={2}>Marzo</MenuItem>
                    <MenuItem value={3}>Abril</MenuItem>
                    <MenuItem value={4}>Mayo</MenuItem>
                    <MenuItem value={5}>Junio</MenuItem>
                    <MenuItem value={6}>Julio</MenuItem>
                    <MenuItem value={7}>Agosto</MenuItem>
                    <MenuItem value={8}>Septiembre</MenuItem>
                    <MenuItem value={9}>Octubre</MenuItem>
                    <MenuItem value={10}>Noviembre</MenuItem>
                    <MenuItem value={11}>Diciembre</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  className={classes.yearTextField}
                  id="contract-select-year"
                  label="Año"
                  type="number"
                  value={contractYear}
                  onChange={handleChangeContractYear}
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box m={4}>
            <Grid container direction="column">
              <Typography align="center" variant="h5">Facturas</Typography>
              <Box my={4}>
                {loading ?
                  <Box display="flex" justifyContent="center">
                    <CircularProgress />
                  </Box>
                  :
                  <>
                    {invoicesList.length !== 0 ?
                      invoicesList :
                      <>
                        {invoiceMonth || invoiceYear ?
                          <Typography align="center">No tienes facturas en la fecha seleccionada</Typography> :
                          <Typography align="center">No tienes facturas guardadas</Typography>
                        }
                      </>
                    }
                  </>
                }
              </Box>
              <Box margin="auto">
                <Pagination color="primary" page={invoicesPage} count={invoicesCount} onChange={handleInvoicesPageChange} />
              </Box>
              <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="invoice-select-month">Mes</InputLabel>
                  <Select
                    labelId="invoice-select-month"
                    id="invoice-select-month"
                    value={invoiceMonth}
                    onChange={handleChangeInvoiceMonth}
                    label="invoice-month"
                  >
                    <MenuItem value=""><em>&nbsp;</em></MenuItem>
                    <MenuItem value={0}>Enero</MenuItem>
                    <MenuItem value={1}>Febrero</MenuItem>
                    <MenuItem value={2}>Marzo</MenuItem>
                    <MenuItem value={3}>Abril</MenuItem>
                    <MenuItem value={4}>Mayo</MenuItem>
                    <MenuItem value={5}>Junio</MenuItem>
                    <MenuItem value={6}>Julio</MenuItem>
                    <MenuItem value={7}>Agosto</MenuItem>
                    <MenuItem value={8}>Septiembre</MenuItem>
                    <MenuItem value={9}>Octubre</MenuItem>
                    <MenuItem value={10}>Noviembre</MenuItem>
                    <MenuItem value={11}>Diciembre</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  className={classes.yearTextField}
                  id="invoice-select-year"
                  label="Año"
                  type="number"
                  value={invoiceYear}
                  onChange={handleChangeInvoiceYear}
                  variant="outlined"
                />
              </Box>
              <Box my={2}>
                <RBButton variant="success" onClick={openAddInvoiceDialog} block>Añadir factura</RBButton>
              </Box>
              <Dialog open={deleteInvoiceDialogState}>
                <DialogContent>
                  <DialogContentText>
                    ¿Seguro que quieres eliminar la factura Nº {invoiceSelected}?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button variant="contained" onClick={handleDeleteInvoice} color="secondary">Eliminar</Button>
                  <Button variant="contained" onClick={closeDeleteInvoiceDialog}>Cancelar</Button>
                </DialogActions>
              </Dialog>
              <Dialog open={addInvoiceDialogState} TransitionComponent={Transition} fullScreen>
                <DialogTitle className={classes.dialogTitle}>
                  Selecciona la factura que quieres guardar
                </DialogTitle>
                <DialogContent>
                  <iframe className={classes.iframe} src={addInvoceFilePath} title="invoice-preview" alt="Vista previa de factura"></iframe>
                </DialogContent>
                <DialogActions>
                  <input
                    accept=".txt,.pdf,.png,.jpg,.jpeg,.gif"
                    className={classes.input}
                    id="upload-button-file"
                    type="file"
                    onChange={handleInputInvoice}
                  />
                  <label className={classes.label} htmlFor="upload-button-file">
                    <Button variant="contained" color="primary" component="span">
                      Seleccionar
                    </Button>
                  </label>
                  <RBButton variant="success" onClick={handleAddInvoice}>Añadir</RBButton>
                  <Button variant="contained" onClick={closeAddInvoiceDialog}>Cancelar</Button>
                </DialogActions>
              </Dialog>
              <Dialog open={changeInvoiceDialogState} TransitionComponent={Transition} fullScreen>
                <DialogTitle className={classes.dialogTitle}>
                  Selecciona la factura que quieres guardar
                </DialogTitle>
                <DialogContent>
                  <iframe className={classes.iframe} src={changeInvoceFilePath} title="invoice-preview" alt="Vista previa de factura"></iframe>
                </DialogContent>
                <DialogActions>
                  <input
                    accept=".txt,.pdf,.png,.jpg,.jpeg,.gif"
                    className={classes.input}
                    id="upload-button-file"
                    type="file"
                    onChange={handleInputChangeInvoice}
                  />
                  <label className={classes.label} htmlFor="upload-button-file">
                    <Button variant="contained" color="primary" component="span">
                      Seleccionar
                    </Button>
                  </label>
                  <RBButton variant="success" onClick={handleChangeInvoice}>Cambiar</RBButton>
                  <Button variant="contained" onClick={closeChangeInvoiceDialog}>Cancelar</Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Notify />
    </Container>
  );
}

const mapDispatchToProps = dispatch => ({
  createNotification: (config) => {
    dispatch(createNotification(config))
  },
})

export default connect(null, mapDispatchToProps)(Invoices);