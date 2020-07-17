import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress
} from '@material-ui/core';
import {
  Pagination
} from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';


const Invoices = () => {
  const [contracts, setContracts] = useState([]);
  const [contractExpanded, setContractExpanded] = useState(false);
  const [contractsList, setContractsList] = useState("");
  const [contractsPage, setContractsPage] = useState(1);
  const [invoicesList, setInvoicesList] = useState("");
  const [invoicesPage, setInvoicesPage] = useState(1);
  const [invoicesCount, setInvoicesCount] = useState(0);
  const [contractsCount, setContractsCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleContractsSelectedChange = (contractNumber) => (event, isExpanded) =>
    setContractExpanded(isExpanded ? contractNumber : false);

  const handleInvoicesPageChange = (event, value) => setInvoicesPage(value);
  const handleContractsPageChange = (event, value) => setContractsPage(value);

  const getContracts = async () => {
    setLoading(true);
    const data = await axios.get('/api/customer/get-invoices-data');
    const contracts = data.data;
    contracts.sort((a, b) =>
      new Date(a.contract_data.init_date) - new Date(b.contract_data.init_date)
    );
    setContracts(contracts);
    setLoading(false);
    setContractsCount(Math.ceil(contracts.length / 3));
    setContractExpanded(contracts[0].contract_data.contract_number);
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
              <Typography>Documento: {invoice.file}</Typography>
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
                  contractsList
                }
              </Box >
              <Box display="flex" justifyContent="center">
                <Pagination page={contractsPage} count={contractsCount} onChange={handleContractsPageChange} />
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
                  invoicesList
                }
              </Box>
              <Box margin="auto">
                <Pagination page={invoicesPage} count={invoicesCount} onChange={handleInvoicesPageChange} />
              </Box>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Invoices;