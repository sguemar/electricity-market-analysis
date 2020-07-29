import React, { useState, useEffect } from 'react';
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


const useStyles = makeStyles(() => ({
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
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Invoices = () => {
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
  
  // INVOICES STATE
  const [invoicesList, setInvoicesList] = useState("");
  const [invoicesPage, setInvoicesPage] = useState(1);
  const [invoicesCount, setInvoicesCount] = useState(0);
  const [invoiceSelected, setInvoiceSelected] = useState("");
  const [deleteInvoiceDialogState, setDeleteInvoiceDialogState] = useState(false);
  const [addInvoiceDialogState, setAddInvoiceDialogState] = useState(false);
  const [invoiceFile, setInvoiceFile] = useState({});
  const [invoceFilePath, setInvoiceFilePath] = useState("");

  const handleContractsSelectedChange = (contractNumber) => (event, isExpanded) =>
    setContractExpanded(isExpanded ? contractNumber : false);

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
    setInvoiceFile(inputFile);
    let reader = new FileReader();
    reader.onload = () => setInvoiceFilePath(reader.result);
    reader.onerror = error => console.log('Error: ', error);
    reader.readAsDataURL(inputFile);
  };
  const handleAddInvoice = async () => {
    try {
      var formData = new FormData();
      formData.append('file', invoiceFile);
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
      setAddInvoiceDialogState(false);
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
      const endIndex = contractsPage * 3;
      const paginatedContracts = contracts.slice(endIndex - 3, endIndex);
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
  }, [contractExpanded, contracts, contractsPage]);

  useEffect(() => {
    if (contractExpanded) {
      let invoicesList = contracts.find(contract =>
        contract.contract_data.contract_number === contractExpanded
      ).invoices;
      setInvoicesCount(Math.ceil(invoicesList.length / 5));
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
  }, [contractExpanded, contracts, invoicesPage]);

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
                      <Typography align="center">No tienes ningún contrato, añade alguna factura</Typography>
                    }
                  </>
                }
              </Box >
              <Box display="flex" justifyContent="center">
                <Pagination color="primary" page={contractsPage} count={contractsCount} onChange={handleContractsPageChange} />
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
                      <Typography align="center">No tienes facturas guardadas</Typography>
                    }
                  </>
                }
              </Box>
              <Box margin="auto">
                <Pagination color="primary" page={invoicesPage} count={invoicesCount} onChange={handleInvoicesPageChange} />
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
                  <iframe className={classes.iframe} src={invoceFilePath} title="invoice-preview" alt="Vista previa de factura"></iframe>
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
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Invoices;