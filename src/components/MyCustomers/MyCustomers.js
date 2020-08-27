import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import {
  makeStyles,
  Typography,
  Container,
  Box,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableContainer,
  TableCell,
  Divider,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import {
  Pagination
} from '@material-ui/lab';
import axios from 'axios';
import {
  MDBDataTable,
  MDBDataTableV5,
} from 'mdbreact';
import { createNotification } from 'react-redux-notify';
import {
  errorNoCustomerSelectedNotification,
  successSendOfferNotification,
  errorRepeatedOfferNotification,
  successDeletePotentialCustomerNotification
} from '../../redux/constants/notifications';

const useStyles = makeStyles((theme) => ({
  sendOfferButton: {
    backgroundColor: '#ffd31f',
    "&:hover": {
      backgroundColor: '#eec20e'
    }
  },
  dialogTitle: {
    textAlign: 'center',
  },
  card: {
    boxShadow: '1px 1px 3px grey',
  },
  checkIcon: {
    color: 'green'
  },
  headerTableCell: {
    fontWeight: 'bold',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100,
  },
}));


const MyCustomers = ({ createNotification }) => {

  const classes = useStyles();
  const cookies = new Cookies();
  const csrfAccessToken = cookies.get('csrf_access_token');

  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [potentialCustomers, setPotentialCustomers] = useState([]);
  const [potentialCustomersDataTable, setPotentialCustomersDataTable] = useState({
    columns: [
      {
        label: 'NIF',
        field: 'nif',
      },
      {
        label: 'Nombre',
        field: 'name',
      },
      {
        label: 'Apellidos',
        field: 'surname',
      },
      {
        label: 'Email',
        field: 'email',
      },
      {
        label: 'Acciones',
        field: 'actions',
      },
    ],
    rows: [],
  });
  const [customerDataTable, setCustomerDataTable] = useState({
    columns: [
      {
        label: 'NIF',
        field: 'nif',
      },
      {
        label: 'Nombre',
        field: 'name',
      },
      {
        label: 'Apellidos',
        field: 'surname',
      },
      {
        label: 'Email',
        field: 'email',
      },
    ],
    rows: [],
  });
  const [selectedPotentialCustomers, setSelectedPotentialCustomers] = useState({});
  const [potentialCustomerSelected, setPotentialCustomerSelected] = useState();

  const [selectOfferDialogState, setSelectOfferDialogState] = useState(false);
  const [deletePotentialCustomerDialogState, setDeletePotentialCustomerDialogState] = useState(false);


  // OFFERS
  const [offersLoading, setOffersLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [offersList, setOffersList] = useState([]);
  const [offersPage, setOffersPage] = useState(1);
  const [offersCount, setOffersCount] = useState(0);
  const [offerRateFilter, setOfferRateFilter] = useState('');
  const [offersTypes, setOffersTypes] = useState([]);

  const handleChangeOfferRateFilter = (event) => setOfferRateFilter(event.target.value);
  const handleOffersPageChange = (event, value) => setOffersPage(value);

  const handleSendOffer = (offerId) => sendOffer(offerId);

  const sendOffer = async (offerId) => {
    try {
      const response = await axios.post(
        '/api/company/send-offer',
        {
          offerId: offerId,
          potentialCustomers: selectedPotentialCustomers,
        },
        { headers: { 'X-CSRF-TOKEN': csrfAccessToken, } },
      );
      if (response.data.length !== 0) {
        const repeatedOfferErrorMessage = "Esta oferta ya ha sido enviada al cliente con nif: " + response.data;
        createNotification(errorRepeatedOfferNotification(repeatedOfferErrorMessage));
      } else {
        createNotification(successSendOfferNotification);
        setSelectOfferDialogState(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/company/get-customers');
      setCustomers(response.data);
      setCustomerDataTable({
        ...customerDataTable,
        rows: response.data
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getPotentialsCustomers = async () => {
    try {
      const response = await axios.get('/api/company/get-potentials-customers');
      setPotentialCustomers(response.data);
      const result = response.data.map((value) => {
        return {
          ...value,
          actions:
            <Button
              color="secondary"
              variant="contained"
              onClick={() => openDeletePotentialCustomerDialog(value.nif)}
            >
              Eliminar
            </Button>
        }
      });
      setPotentialCustomersDataTable({
        ...potentialCustomersDataTable,
        rows: result
      });
    } catch (error) {
      console.log(error);
    }
  };


  const openDeletePotentialCustomerDialog = (nif) => {
    setDeletePotentialCustomerDialogState(true);
    setPotentialCustomerSelected(nif);
  }
  const closeDeletePotentialCustomerDialog = () => setDeletePotentialCustomerDialogState(false);
  const handleDeletePotentialCustomer = async () => {
    try {
      await axios.delete(
        '/api/company/delete-potential-customer/' + potentialCustomerSelected,
        { headers: { 'X-CSRF-TOKEN': csrfAccessToken } }
      );
      setDeletePotentialCustomerDialogState(false);
      setPotentialCustomerSelected('');
      createNotification(successDeletePotentialCustomerNotification);
      getPotentialsCustomers();
    } catch (error) {
      console.log(error);
    }
  }

  const updateSelectedPotentialCustomers = (e) => {
    if (Array.isArray(e)) {
      let newSelectedPotentialCustomers = selectedPotentialCustomers;
      e.forEach((value) => {
        if (value.checked)
          newSelectedPotentialCustomers = {
            ...newSelectedPotentialCustomers,
            [value.nif]: ''
          };
        else
          delete newSelectedPotentialCustomers[value.nif];
      });
      setSelectedPotentialCustomers(newSelectedPotentialCustomers);
    } else {
      if (e.checked)
        setSelectedPotentialCustomers({
          ...selectedPotentialCustomers,
          [e.nif]: '',
        });
      else {
        let newSelectedPotentialCustomers = selectedPotentialCustomers;
        delete newSelectedPotentialCustomers[e.nif];
        setSelectedPotentialCustomers(newSelectedPotentialCustomers);
      }
    }
  };

  const openSelectOfferDialog = () => {
    if (Object.keys(selectedPotentialCustomers).length === 0)
      createNotification(errorNoCustomerSelectedNotification);
    else {
      setSelectOfferDialogState(true);
      getOffers();
    }
  }
  const closeSelectOfferDialog = () => setSelectOfferDialogState(false);

  const getOffers = async () => {
    setOffersLoading(true);
    try {
      let response = await axios.get('/api/company/get-offers');
      const offers = response.data;
      if (offers.length === 0) {
        setOffers([]);
        setOffersList([]);
        setOffersCount(0);
      } else {
        setOffers(offers);
        setOffersCount(Math.ceil(offers.length / 2));
      }
      response = await axios.get('/api/company/get-offers-types');
      setOffersTypes(response.data);
      setOffersLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCustomers();
    getPotentialsCustomers();
  }, []);

  useEffect(() => {
    if (offers.length !== 0) {
      let filteredOffers = offers;
      if (offerRateFilter !== '')
        filteredOffers = offers.filter(offer =>
          offer.offer_type === offerRateFilter
        );
      setOffersCount(Math.ceil(filteredOffers.length / 2));
      const endIndex = offersPage * 2;
      const paginatedOffers = filteredOffers.slice(endIndex - 2, endIndex);
      const updatedOffersList = paginatedOffers.map(offer => {
        return (
          <Grid key={offer.id} item xs={12} md={12 / paginatedOffers.length}>
            <Card className={classes.card}>
              <CardHeader
                title={offer.name + " (" + offer.rate + ")"}
              />
              <CardContent>
                <Grid container justify="center" alignItems="center" spacing={3}>
                  <Grid item xs={12}>
                    <TableContainer component={Paper} className={classes.card}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            {offer.variable_term !== 0
                              ?
                              <>
                                <TableCell className={classes.headerTableCell} align="center">Término potencia</TableCell>
                                <TableCell className={classes.headerTableCell} align="center">Término energía</TableCell>
                              </>
                              :
                              <>
                                <TableCell className={classes.headerTableCell} rowSpan={2} align="center">Término potencia</TableCell>
                                {offer.super_valley !== 0
                                  ?
                                  <TableCell className={classes.headerTableCell} colSpan={3} align="center">Término energía</TableCell>
                                  :
                                  <TableCell className={classes.headerTableCell} colSpan={2} align="center">Término energía</TableCell>
                                }
                              </>
                            }
                          </TableRow>
                          {offer.variable_term === 0
                            ?
                            <TableRow>
                              <TableCell className={classes.headerTableCell} align="center">Punta</TableCell>
                              <TableCell className={classes.headerTableCell} align="center">Valle</TableCell>
                              {offer.super_valley !== 0
                                ?
                                <TableCell className={classes.headerTableCell} align="center">Super valle</TableCell>
                                :
                                <></>
                              }
                            </TableRow>
                            :
                            <></>
                          }
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell align="center">{offer.fixed_term + " €/kW día"}</TableCell>
                            {offer.variable_term === 0
                              ?
                              <>
                                <TableCell align="center">{offer.tip + " €/kWh"}</TableCell>
                                <TableCell align="center">{offer.valley + " €/kWh"}</TableCell>
                                {offer.super_valley !== 0 &&
                                  <TableCell align="center">{offer.super_valley + " €/kWh"}</TableCell>
                                }
                              </>
                              :
                              <TableCell align="center">{offer.variable_term + " €/kWh"}</TableCell>
                            }
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  {offer.features.length > 0 &&
                    <Grid item xs={12}>
                      <Card className={classes.card}>
                        <CardContent>
                          <List>
                            {offer.features.map((feature, index) => {
                              return (
                                <>
                                  <ListItem key={index}>
                                    <ListItemIcon>
                                      <CheckIcon className={classes.checkIcon} />
                                    </ListItemIcon>
                                    <ListItemText primary={feature} />
                                  </ListItem>
                                  <Divider />
                                </>
                              );
                            })}
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  }
                </Grid>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => handleSendOffer(offer.id)}
                  className={classes.sendOfferButton}
                >
                  Enviar oferta
                </Button>
              </CardActions>
            </Card>
          </Grid >
        );
      });
      setOffersList(updatedOffersList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    offers,
    offersPage,
    classes.card,
    classes.checkIcon,
    classes.headerTableCell,
    offerRateFilter
  ]);

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" align="center">Mis clientes</Typography>
      </Box>
      <Box>
        {loading ?
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
          :
          <>
            {customers.length !== 0
              ?
              <MDBDataTable
                hover
                infoLabel={["Viendo", "-", "de", "clientes"]}
                searchLabel="Buscar"
                entriesOptions={[5, 10, 15]}
                entries={5}
                data={customerDataTable}
                responsive
                paginationLabel={["Anterior", "Siguiente"]}
                entriesLabel="Clientes por página"
              />
              :
              <Box my={4}>
                <Typography variant="h6" align="center">Actualmente no tienes clientes</Typography>
              </Box>
            }
            {potentialCustomers.length !== 0
              ?
              <>
                <Box my={4}>
                  <Typography variant="h4" align="center">Clientes potenciales</Typography>
                  <Typography variant="h6" align="center">Selecciona los clientes a los que enviar tus ofertas</Typography>
                </Box>
                <MDBDataTableV5
                  hover
                  infoLabel={["Viendo", "-", "de", "clientes"]}
                  searchLabel="Buscar"
                  entriesOptions={[5, 10, 15]}
                  entries={5}
                  data={potentialCustomersDataTable}
                  responsive
                  paginationLabel={["Anterior", "Siguiente"]}
                  entriesLabel="Clientes por página"
                  checkbox
                  headCheckboxID='potential-customers-head-id'
                  bodyCheckboxID='potential-customers-body-id'
                  multipleCheckboxes
                  getValueCheckBox={(e) => {
                    updateSelectedPotentialCustomers(e);
                  }}
                  getValueAllCheckBoxes={(e) => {
                    updateSelectedPotentialCustomers(e);
                  }}
                />
                <Box display="flex" justifyContent="center" mt={2}>
                  <Button className={classes.sendOfferButton} onClick={openSelectOfferDialog}>Enviar oferta</Button>
                </Box>
                <Dialog open={selectOfferDialogState} maxWidth="xl">
                  <DialogTitle className={classes.dialogTitle}>
                    Selecciona la oferta que desees enviar
                  </DialogTitle>
                  <DialogContent>
                    <Container maxWidth="xl">
                      <Box my={4}>
                        {offersLoading ?
                          <Box display="flex" justifyContent="center">
                            <CircularProgress />
                          </Box>
                          :
                          <>
                            {offersList.length !== 0
                              ?
                              <>
                                <Grid container spacing={4}>
                                  {offersList}
                                </Grid>
                                <Box mt={4} display="flex" justifyContent="center">
                                  <Pagination color="primary" page={offersPage} count={offersCount} onChange={handleOffersPageChange} />
                                </Box>
                              </>
                              :
                              <>
                                {offerRateFilter !== ''
                                  ?
                                  <Box my={4}>
                                    <Typography variant="h6" align="center">Actualmente no tienes ofertas de este tipo</Typography>
                                  </Box>
                                  :
                                  <Box my={4}>
                                    <Typography variant="h6" align="center">Actualmente no tienes ofertas</Typography>
                                  </Box>
                                }
                              </>
                            }
                          </>
                        }
                      </Box >
                      <Box display="flex" justifyContent="center" mt={2}>
                        <FormControl variant="outlined" className={classes.formControl}>
                          <InputLabel id="offer-rate-filter">Tarifa</InputLabel>
                          <Select
                            labelId="offer-rate-filter"
                            id="offer-rate-filter"
                            value={offerRateFilter}
                            onChange={handleChangeOfferRateFilter}
                            label="rate-filter"
                          >
                            <MenuItem value=""><em>&nbsp;</em></MenuItem>
                            {offersTypes.map(offerType => {
                              return (
                                <MenuItem key={offerType.id} value={offerType.id}>{offerType.rate}</MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Box>
                    </Container>
                  </DialogContent>
                  <DialogActions>
                    <Button variant="contained" onClick={closeSelectOfferDialog}>Cancelar</Button>
                  </DialogActions>
                </Dialog>
                <Dialog open={deletePotentialCustomerDialogState}>
                  <DialogContent>
                    <DialogContentText>
                      ¿Seguro que quieres eliminar el cliente potencial con nif: {potentialCustomerSelected}?
                  </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button variant="contained" onClick={handleDeletePotentialCustomer} color="secondary">Eliminar</Button>
                    <Button variant="contained" onClick={closeDeletePotentialCustomerDialog}>Cancelar</Button>
                  </DialogActions>
                </Dialog>
              </>
              :
              <></>
            }
          </>
        }
      </Box >
    </Container>
  );
}

const mapDispatchToProps = dispatch => ({
  createNotification: (config) => {
    dispatch(createNotification(config))
  },
});

export default connect(null, mapDispatchToProps)(MyCustomers);