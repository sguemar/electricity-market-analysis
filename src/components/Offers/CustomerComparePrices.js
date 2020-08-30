import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  makeStyles,
  Card,
  CardHeader,
  CardContent,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Divider,
  Container,
  Box,
  Typography,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import {
  Pagination
} from '@material-ui/lab';
import { createNotification } from 'react-redux-notify';
import {
  MDBDataTable,
} from 'mdbreact';
import axios from 'axios';
import {
  errorRepeatedCompanySelectedNotification,
} from '../../redux/constants/notifications';


const dataTablesData = {
  columns: [
    {
      label: 'CIF',
      field: 'cif',
    },
    {
      label: 'Nombre',
      field: 'name',
    },
  ],
  rows: [],
};

const useStyles = makeStyles((theme) => ({
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
  horizontalList: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  },
  cheapestValue: {
    color: 'green',
  },
  expensiveValue: {
    color: 'red',
  },
}));

const CustomerComparePrices = ({ createNotification }) => {

  const classes = useStyles();

  // COMPANIES
  const [companiesLoading, setCompaniesLoading] = useState(false);
  // COMPANY 1
  const [tradingCompanies1, setTradingCompanies1] = useState([]);
  const [tradingCompaniesDataTable1, setTradingCompaniesDataTable1] = useState(dataTablesData);
  const [selectedTradingCompanyCif1, setSelectedTradingCompanyCif1] = useState('');
  const [selectedTradingCompany1, setSelectedTradingCompany1] = useState({});
  // COMPANY 2
  const [tradingCompanies2, setTradingCompanies2] = useState([]);
  const [tradingCompaniesDataTable2, setTradingCompaniesDataTable2] = useState(dataTablesData);
  const [selectedTradingCompanyCif2, setSelectedTradingCompanyCif2] = useState('');
  const [selectedTradingCompany2, setSelectedTradingCompany2] = useState({});


  // OFFERS
  const [offersTypes, setOffersTypes] = useState([]);
  const [offerRateFilter, setOfferRateFilter] = useState(1);
  const handleChangeOfferRateFilter = (event) => setOfferRateFilter(event.target.value);
  // OFFER 1
  const [offersLoading1, setOffersLoading1] = useState(false);
  const [offers1, setOffers1] = useState([]);
  const [offersList1, setOffersList1] = useState([]);
  const [offersPage1, setOffersPage1] = useState(1);
  const [offersCount1, setOffersCount1] = useState(0);
  const [offerSelected1, setOfferSelected1] = useState({});
  const [fixedTermClassName1, setFixedTermClassName1] = useState("");
  const [variableTermClassName1, setVariableTermClassName1] = useState("");
  const [tipClassName1, setTipClassName1] = useState("");
  const [valleyClassName1, setValleyClassName1] = useState("");
  const [superValleyClassName1, setSuperValleyClassName1] = useState("");
  const handleOffersPageChange1 = (event, value) => setOffersPage1(value);
  // OFFER 2
  const [offersLoading2, setOffersLoading2] = useState(false);
  const [offers2, setOffers2] = useState([]);
  const [offersList2, setOffersList2] = useState([]);
  const [offersPage2, setOffersPage2] = useState(1);
  const [offersCount2, setOffersCount2] = useState(0);
  const [offerSelected2, setOfferSelected2] = useState({});
  const [fixedTermClassName2, setFixedTermClassName2] = useState("");
  const [variableTermClassName2, setVariableTermClassName2] = useState("");
  const [tipClassName2, setTipClassName2] = useState("");
  const [valleyClassName2, setValleyClassName2] = useState("");
  const [superValleyClassName2, setSuperValleyClassName2] = useState("");
  const handleOffersPageChange2 = (event, value) => setOffersPage2(value);


  const handleTradingCompanyClick = (tradingCompany, number) => {
    if (number === 1) {
      setSelectedTradingCompanyCif1(tradingCompany.cif);
      setSelectedTradingCompany1(tradingCompany);
    } else {
      setSelectedTradingCompanyCif2(tradingCompany.cif);
      setSelectedTradingCompany2(tradingCompany);
    }
  }

  const getSelectedTradingCompanyOffers = async (tradingCompany, number) => {
    if (number === 1) {
      setOffersLoading1(true);
      try {
        let response = await axios.get('/api/public/get-trading-company-offers/' + tradingCompany.cif);
        const offers = response.data;
        if (offers.length === 0) {
          setOffers1([]);
          setOffersList1([]);
          setOffersCount1(0);
          setOfferSelected1({});
        } else {
          setOffers1(offers);
          setOffersCount1(offers.length);
          setOfferSelected1(offers[0]);
        }
        setOffersLoading1(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      setOffersLoading2(true);
      try {
        let response = await axios.get('/api/public/get-trading-company-offers/' + tradingCompany.cif);
        const offers = response.data;
        if (offers.length === 0) {
          setOffers2([]);
          setOffersList2([]);
          setOffersCount2(0);
          setOfferSelected2({});
        } else {
          setOffers2(offers);
          setOffersCount2(offers.length);
          setOfferSelected2(offers[0]);
        }
        setOffersLoading2(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getAllTradingCompanies = async () => {
    setCompaniesLoading(true);
    try {
      const response = await axios.get('/api/public/get-all-trading-companies');
      if (response.data.length !== 0) {
        const tradingCompanies1 = response.data.map(tradingCompany => {
          return {
            ...tradingCompany,
            clickEvent: () => handleTradingCompanyClick(tradingCompany, 1)
          }
        });
        setTradingCompanies1(tradingCompanies1);
        setTradingCompaniesDataTable1({
          ...tradingCompaniesDataTable1,
          rows: tradingCompanies1
        });
        const tradingCompanies2 = response.data.map(tradingCompany => {
          return {
            ...tradingCompany,
            clickEvent: () => handleTradingCompanyClick(tradingCompany, 2)
          }
        });
        setTradingCompanies2(tradingCompanies2);
        setTradingCompaniesDataTable2({
          ...tradingCompaniesDataTable2,
          rows: tradingCompanies2
        });
      }
      setCompaniesLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getOffersTypes = async () => {
    const response = await axios.get('/api/company/get-offers-types');
    setOffersTypes(response.data);
  };

  useEffect(() => {
    getOffersTypes();
    getAllTradingCompanies();
  }, []);

  useEffect(() => {
    if (selectedTradingCompanyCif1 === '' && selectedTradingCompanyCif2 === '') {
      return;
    }
    if (selectedTradingCompanyCif1 !== '' &&
      selectedTradingCompanyCif1 === selectedTradingCompanyCif2) {
      createNotification(
        errorRepeatedCompanySelectedNotification(
          "Ya has seleccionado la empresa con cif: " + selectedTradingCompanyCif1
        )
      );
      setSelectedTradingCompanyCif1('');
      setSelectedTradingCompany1({});
      setOfferSelected1({});
      setOffersPage1(1);
      setOffersCount1(0);
    } else {
      getSelectedTradingCompanyOffers(selectedTradingCompany1, 1);
    }
  }, [selectedTradingCompanyCif1]);

  useEffect(() => {
    if (selectedTradingCompanyCif1 === '' && selectedTradingCompanyCif2 === '') {
      return;
    }
    if (selectedTradingCompanyCif2 !== '' &&
      selectedTradingCompanyCif1 === selectedTradingCompanyCif2) {
      createNotification(
        errorRepeatedCompanySelectedNotification(
          "Ya has seleccionado la empresa con cif: " + selectedTradingCompanyCif2
        )
      );
      setSelectedTradingCompanyCif2('');
      setSelectedTradingCompany2({});
      setOfferSelected2({});
      setOffersPage2(1);
      setOffersCount2(0);
    } else {
      getSelectedTradingCompanyOffers(selectedTradingCompany2, 2);
    }
  }, [selectedTradingCompanyCif2]);

  useEffect(() => {
    if (offers1.length !== 0 && Object.keys(offerSelected2).length !== 0) {
      let filteredOffers1 = offers1;
      if (offerRateFilter !== '')
        filteredOffers1 = offers1.filter(offer =>
          offer.offerInfo.offer_type === offerRateFilter
        );
      if (filteredOffers1.length !== 0) {
        setOffersCount1(filteredOffers1.length);
        setOfferSelected1(filteredOffers1[offersPage1 - 1]);
        let offer = filteredOffers1[offersPage1 - 1];
        if (typeof(offer) === 'undefined') {
          offer = filteredOffers1[0];
          setOfferSelected1(filteredOffers1[0]);
          setOffersPage1(1);
        }

        // FIXED TERM
        if (offer.offerInfo.fixed_term > offerSelected2.offerInfo.fixed_term)
          setFixedTermClassName1(classes.expensiveValue);
        else if (offer.offerInfo.fixed_term < offerSelected2.offerInfo.fixed_term)
          setFixedTermClassName1(classes.cheapestValue);
        else
          setFixedTermClassName1("");

        // VARIABLE TERM
        if (offer.offerInfo.variable_term > offerSelected2.offerInfo.variable_term)
          setVariableTermClassName1(classes.expensiveValue);
        else if (offer.offerInfo.variable_term < offerSelected2.offerInfo.variable_term)
          setVariableTermClassName1(classes.cheapestValue);
        else
          setVariableTermClassName1("");

        // TIP
        if (offer.offerInfo.tip > offerSelected2.offerInfo.tip)
          setTipClassName1(classes.expensiveValue);
        else if (offer.offerInfo.tip < offerSelected2.offerInfo.tip)
          setTipClassName1(classes.cheapestValue);
        else
          setTipClassName1("");

        // VALLEY
        if (offer.offerInfo.valley > offerSelected2.offerInfo.valley)
          setValleyClassName1(classes.expensiveValue);
        else if (offer.offerInfo.valley < offerSelected2.offerInfo.valley)
          setValleyClassName1(classes.cheapestValue);
        else
          setValleyClassName1("");

        // SUPERVALLEY
        if (offer.offerInfo.super_valley > offerSelected2.offerInfo.super_valley)
          setSuperValleyClassName1(classes.expensiveValue);
        else if (offer.offerInfo.super_valley < offerSelected2.offerInfo.super_valley)
          setSuperValleyClassName1(classes.cheapestValue);
        else
          setSuperValleyClassName1("");

        setOffersList1(
          <Grid key={offer.offerInfo.id} item xs={12}>
            <Card className={classes.card}>
              <CardHeader
                title={offer.offerInfo.name + " (" + offer.offerInfo.rate + ")"}
              />
              <CardContent>
                <Grid container justify="center" alignItems="center" spacing={3}>
                  <Grid item xs={12}>
                    <TableContainer component={Paper} className={classes.card}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            {offer.offerInfo.variable_term !== 0
                              ?
                              <>
                                <TableCell className={classes.headerTableCell} align="center">Término potencia</TableCell>
                                <TableCell className={classes.headerTableCell} align="center">Término energía</TableCell>
                              </>
                              :
                              <>
                                <TableCell className={classes.headerTableCell} rowSpan={2} align="center">Término potencia</TableCell>
                                {offer.offerInfo.super_valley !== 0
                                  ?
                                  <TableCell className={classes.headerTableCell} colSpan={3} align="center">Término energía</TableCell>
                                  :
                                  <TableCell className={classes.headerTableCell} colSpan={2} align="center">Término energía</TableCell>
                                }
                              </>
                            }
                          </TableRow>
                          {offer.offerInfo.variable_term === 0
                            ?
                            <TableRow>
                              <TableCell className={classes.headerTableCell} align="center">Punta</TableCell>
                              <TableCell className={classes.headerTableCell} align="center">Valle</TableCell>
                              {offer.offerInfo.super_valley !== 0
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
                            <TableCell className={fixedTermClassName1} align="center">
                              {offer.offerInfo.fixed_term + " €/kW día"}
                            </TableCell>
                            {offer.offerInfo.variable_term === 0
                              ?
                              <>
                                <TableCell className={tipClassName1} align="center">{offer.offerInfo.tip + " €/kWh"}</TableCell>
                                <TableCell className={valleyClassName1} align="center">{offer.offerInfo.valley + " €/kWh"}</TableCell>
                                {offer.offerInfo.super_valley !== 0 &&
                                  <TableCell className={superValleyClassName1} align="center">{offer.offerInfo.super_valley + " €/kWh"}</TableCell>
                                }
                              </>
                              :
                              <TableCell className={variableTermClassName1} align="center">{offer.offerInfo.variable_term + " €/kWh"}</TableCell>
                            }
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  {offer.offerInfo.features.length > 0 &&
                    <Grid item xs={12}>
                      <Card className={classes.card}>
                        <CardContent>
                          <List>
                            {offer.offerInfo.features.map((feature, index) => {
                              return (
                                <>
                                  <ListItem key={index}>
                                    <ListItemIcon>
                                      <CheckIcon className={classes.checkIcon} />
                                    </ListItemIcon>
                                    <ListItemText primary={feature} />
                                  </ListItem>
                                  {offer.offerInfo.features.length - 1 !== index && <Divider />}
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
            </Card>
          </Grid >
        );
      } else {
        setOffersCount1(0);
        setOfferSelected1({});
        setOffersList1([]);
      }
    }
  }, [
    offers1,
    offers2,
    offersPage1,
    offersPage2,
    offerSelected2,
    offerSelected1,
    classes.card,
    classes.checkIcon,
    classes.headerTableCell,
    classes.expensiveValue,
    classes.cheapestValue,
    fixedTermClassName1,
    variableTermClassName1,
    tipClassName1,
    valleyClassName1,
    superValleyClassName1,
    offerRateFilter
  ]);

  useEffect(() => {
    if (offers2.length !== 0 && Object.keys(offerSelected1).length !== 0) {
      let filteredOffers2 = offers2;
      if (offerRateFilter !== '')
        filteredOffers2 = offers2.filter(offer =>
          offer.offerInfo.offer_type === offerRateFilter
        );
      if (filteredOffers2.length !== 0) {
        setOffersCount2(filteredOffers2.length);
        setOfferSelected2(filteredOffers2[offersPage2 - 1]);
        let offer = filteredOffers2[offersPage2 - 1];
        if (typeof(offer) === 'undefined') {
          offer = filteredOffers2[0];
          setOfferSelected2(filteredOffers2[0]);
          setOffersPage2(1);
        }
        // FIXED TERM
        if (offer.offerInfo.fixed_term > offerSelected1.offerInfo.fixed_term)
          setFixedTermClassName2(classes.expensiveValue);
        else if (offer.offerInfo.fixed_term < offerSelected1.offerInfo.fixed_term)
          setFixedTermClassName2(classes.cheapestValue);
        else
          setFixedTermClassName2("");

        // VARIABLE TERM
        if (offer.offerInfo.variable_term > offerSelected1.offerInfo.variable_term)
          setVariableTermClassName2(classes.expensiveValue);
        else if (offer.offerInfo.variable_term < offerSelected1.offerInfo.variable_term)
          setVariableTermClassName2(classes.cheapestValue);
        else
          setVariableTermClassName2("");

        // TIP
        if (offer.offerInfo.tip > offerSelected1.offerInfo.tip)
          setTipClassName2(classes.expensiveValue);
        else if (offer.offerInfo.tip < offerSelected1.offerInfo.tip)
          setTipClassName2(classes.cheapestValue);
        else
          setTipClassName2("");

        // VALLEY
        if (offer.offerInfo.valley > offerSelected1.offerInfo.valley)
          setValleyClassName2(classes.expensiveValue);
        else if (offer.offerInfo.valley < offerSelected1.offerInfo.valley)
          setValleyClassName2(classes.cheapestValue);
        else
          setValleyClassName2("");

        // SUPERVALLEY
        if (offer.offerInfo.super_valley > offerSelected1.offerInfo.super_valley)
          setSuperValleyClassName2(classes.expensiveValue);
        else if (offer.offerInfo.super_valley < offerSelected1.offerInfo.super_valley)
          setSuperValleyClassName2(classes.cheapestValue);
        else
          setSuperValleyClassName2("");

        setOffersList2(
          <Grid key={offer.offerInfo.id} item xs={12}>
            <Card className={classes.card}>
              <CardHeader
                title={offer.offerInfo.name + " (" + offer.offerInfo.rate + ")"}
              />
              <CardContent>
                <Grid container justify="center" alignItems="center" spacing={3}>
                  <Grid item xs={12}>
                    <TableContainer component={Paper} className={classes.card}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            {offer.offerInfo.variable_term !== 0
                              ?
                              <>
                                <TableCell className={classes.headerTableCell} align="center">Término potencia</TableCell>
                                <TableCell className={classes.headerTableCell} align="center">Término energía</TableCell>
                              </>
                              :
                              <>
                                <TableCell className={classes.headerTableCell} rowSpan={2} align="center">Término potencia</TableCell>
                                {offer.offerInfo.super_valley !== 0
                                  ?
                                  <TableCell className={classes.headerTableCell} colSpan={3} align="center">Término energía</TableCell>
                                  :
                                  <TableCell className={classes.headerTableCell} colSpan={2} align="center">Término energía</TableCell>
                                }
                              </>
                            }
                          </TableRow>
                          {offer.offerInfo.variable_term === 0
                            ?
                            <TableRow>
                              <TableCell className={classes.headerTableCell} align="center">Punta</TableCell>
                              <TableCell className={classes.headerTableCell} align="center">Valle</TableCell>
                              {offer.offerInfo.super_valley !== 0
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
                            <TableCell className={fixedTermClassName2} align="center">
                              {offer.offerInfo.fixed_term + " €/kW día"}
                            </TableCell>
                            {offer.offerInfo.variable_term === 0
                              ?
                              <>
                                <TableCell className={tipClassName2} align="center">{offer.offerInfo.tip + " €/kWh"}</TableCell>
                                <TableCell className={valleyClassName2} align="center">{offer.offerInfo.valley + " €/kWh"}</TableCell>
                                {offer.offerInfo.super_valley !== 0 &&
                                  <TableCell className={superValleyClassName2} align="center">{offer.offerInfo.super_valley + " €/kWh"}</TableCell>
                                }
                              </>
                              :
                              <TableCell className={variableTermClassName2} align="center">{offer.offerInfo.variable_term + " €/kWh"}</TableCell>
                            }
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  {offer.offerInfo.features.length > 0 &&
                    <Grid item xs={12}>
                      <Card className={classes.card}>
                        <CardContent>
                          <List>
                            {offer.offerInfo.features.map((feature, index) => {
                              return (
                                <>
                                  <ListItem key={index}>
                                    <ListItemIcon>
                                      <CheckIcon className={classes.checkIcon} />
                                    </ListItemIcon>
                                    <ListItemText primary={feature} />
                                  </ListItem>
                                  {offer.offerInfo.features.length - 1 !== index && <Divider />}
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
            </Card>
          </Grid >
        );
      } else {
        setOffersCount2(0);
        setOfferSelected2({});
        setOffersList2([]);
      }
    }
  }, [
    offers1,
    offers2,
    offersPage2,
    offersPage1,
    offerSelected1,
    offerSelected2,
    classes.card,
    classes.checkIcon,
    classes.headerTableCell,
    classes.expensiveValue,
    classes.cheapestValue,
    fixedTermClassName2,
    variableTermClassName2,
    tipClassName2,
    valleyClassName2,
    superValleyClassName2,
    offerRateFilter
  ]);

  return (
    <Container maxWidth="lg">
      <Box mt={4}>
        <Typography variant="h4" align="center">Comparador de precios</Typography>
        <Typography variant="h6" align="center">Selecciona las dos comercializadoras a comparar</Typography>
      </Box>
      <Box my={4}>
        {companiesLoading
          ?
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
          :
          <>
            {tradingCompanies1.length !== 0 && tradingCompanies2.length !== 0
              ?
              <>
                <Grid container spacing={8}>
                  <Grid item xs={12} md={6}>
                    <Box mb={2}>
                      <Typography variant="h6" align="center">Selecciona la comercializadora 1</Typography>
                    </Box>
                    <MDBDataTable
                      hover
                      infoLabel={["Viendo", "-", "de", "comercializadoras"]}
                      searchLabel="Buscar"
                      entriesOptions={[5, 10, 15]}
                      entries={5}
                      data={tradingCompaniesDataTable1}
                      responsive
                      paginationLabel={["Anterior", "Siguiente"]}
                      entriesLabel="Comercializadoras por página"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box mb={2}>
                      <Typography variant="h6" align="center">Selecciona la comercializadora 2</Typography>
                    </Box>
                    <MDBDataTable
                      hover
                      infoLabel={["Viendo", "-", "de", "comercializadoras"]}
                      searchLabel="Buscar"
                      entriesOptions={[5, 10, 15]}
                      entries={5}
                      data={tradingCompaniesDataTable2}
                      responsive
                      paginationLabel={["Anterior", "Siguiente"]}
                      entriesLabel="Comercializadoras por página"
                    />
                  </Grid>
                </Grid>
              </>
              :
              <Box my={4}>
                <Typography variant="h6" align="center">Actualmente no existen comercializadoras registradas</Typography>
              </Box>
            }
          </>
        }
      </Box>
      <Box my={4}>
        <Grid container spacing={8}>
          <Grid item xs={12} md={6}>
            {offersLoading1
              ?
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
              :
              <>
                {selectedTradingCompanyCif1 !== ''
                  ?
                  <>
                    <Box my={4}>
                      <Typography variant="h6" align="center">Comercializadora 1 seleccionada</Typography>
                    </Box>
                    <Card>
                      <List className={classes.horizontalList}>
                        <Grid container spacing={2}>
                          <Grid item>
                            <ListItem>
                              <ListItemText primary="CIF" secondary={selectedTradingCompany1.cif || "-"} />
                            </ListItem>
                          </Grid>
                          <Grid item>
                            <ListItem>
                              <ListItemText primary="Nombre" secondary={selectedTradingCompany1.name || "-"} />
                            </ListItem>
                          </Grid>
                          <Grid item>
                            <ListItem>
                              <ListItemText primary="Dirección" secondary={selectedTradingCompany1.address || "-"} />
                            </ListItem>
                          </Grid>
                          <Grid item>
                            <ListItem>
                              <ListItemText primary="Email" secondary={selectedTradingCompany1.email || "-"} />
                            </ListItem>
                          </Grid>
                          <Grid item>
                            <ListItem>
                              <ListItemText primary="URL" secondary={selectedTradingCompany1.url || "-"} />
                            </ListItem>
                          </Grid>
                          <Grid item>
                            <ListItem>
                              <ListItemText primary="Teléfono" secondary={selectedTradingCompany1.phone || "-"} />
                            </ListItem>
                          </Grid>
                        </Grid>
                      </List>
                    </Card>
                  </>
                  :
                  <></>
                }
              </>
            }
          </Grid>
          <Grid item xs={12} md={6}>
            {offersLoading2
              ?
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
              :
              <>
                {selectedTradingCompanyCif2 !== ''
                  ?
                  <>
                    <Box my={4}>
                      <Typography variant="h6" align="center">Comercializadora 2 seleccionada</Typography>
                    </Box>
                    <Card>
                      <List className={classes.horizontalList}>
                        <Grid container spacing={2}>
                          <Grid item>
                            <ListItem>
                              <ListItemText primary="CIF" secondary={selectedTradingCompany2.cif || "-"} />
                            </ListItem>
                          </Grid>
                          <Grid item>
                            <ListItem>
                              <ListItemText primary="Nombre" secondary={selectedTradingCompany2.name || "-"} />
                            </ListItem>
                          </Grid>
                          <Grid item>
                            <ListItem>
                              <ListItemText primary="Dirección" secondary={selectedTradingCompany2.address || "-"} />
                            </ListItem>
                          </Grid>
                          <Grid item>
                            <ListItem>
                              <ListItemText primary="Email" secondary={selectedTradingCompany2.email || "-"} />
                            </ListItem>
                          </Grid>
                          <Grid item>
                            <ListItem>
                              <ListItemText primary="URL" secondary={selectedTradingCompany2.url || "-"} />
                            </ListItem>
                          </Grid>
                          <Grid item>
                            <ListItem>
                              <ListItemText primary="Teléfono" secondary={selectedTradingCompany2.phone || "-"} />
                            </ListItem>
                          </Grid>
                        </Grid>
                      </List>
                    </Card>
                  </>
                  :
                  <></>
                }
              </>
            }
          </Grid>
        </Grid>
      </Box>
      <Box display="flex" justifyContent="center" flexDirection="column" mt={2}>
        <Box my={4}>
          <Typography variant="h6" align="center">Elige la tarifa que deseas comparar</Typography>
        </Box>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="offer-rate-filter">Tarifa</InputLabel>
          <Select
            labelId="offer-rate-filter"
            id="offer-rate-filter"
            value={offerRateFilter}
            defaultValue={1}
            onChange={handleChangeOfferRateFilter}
            label="rate-filter"
          >
            {offersTypes.map(offerType => {
              return (
                <MenuItem key={offerType.id} value={offerType.id}>{offerType.rate}</MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      <Box my={4}>
        <Grid container spacing={8}>
          <Grid item xs={12} md={6}>
            {offersLoading1
              ?
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
              :
              <>
                {offersList1.length !== 0
                  ?
                  <>
                    <Box my={4}>
                      <Typography variant="h5" align="center">Ofertas de {selectedTradingCompany1.name}</Typography>
                    </Box>
                    <Grid container spacing={4}>
                      {offersList1}
                    </Grid>
                    <Box mt={4} display="flex" justifyContent="center">
                      <Pagination color="primary" page={offersPage1} count={offersCount1} onChange={handleOffersPageChange1} />
                    </Box>
                  </>
                  :
                  <>
                    {selectedTradingCompanyCif1 === ''
                      ?
                      <Box my={4}>
                        <Typography variant="h6" align="center">Debes seleccionar una comercializadora para ver sus ofertas</Typography>
                      </Box>
                      :
                      <>
                        {selectedTradingCompanyCif2 === ''
                          ?
                          <Box my={4}>
                            <Typography variant="h6" align="center">Debes seleccionar la comercializadora 2 para poder comparar las ofertas</Typography>
                          </Box>
                          :
                          <Box my={4}>
                            <Typography variant="h6" align="center">Actualmente la comercializadora 1 seleccionada no tiene publicada ninguna oferta de este tipo</Typography>
                          </Box>
                        }
                      </>
                    }
                  </>
                }
              </>
            }
          </Grid>
          <Grid item xs={12} md={6}>
            {offersLoading2
              ?
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
              :
              <>
                {offersList2.length !== 0
                  ?
                  <>
                    <Box my={4}>
                      <Typography variant="h5" align="center">Ofertas de {selectedTradingCompany2.name}</Typography>
                    </Box>
                    <Grid container spacing={4}>
                      {offersList2}
                    </Grid>
                    <Box mt={4} display="flex" justifyContent="center">
                      <Pagination color="primary" page={offersPage2} count={offersCount2} onChange={handleOffersPageChange2} />
                    </Box>
                  </>
                  :
                  <>
                    {selectedTradingCompanyCif2 === ''
                      ?
                      <Box my={4}>
                        <Typography variant="h6" align="center">Debes seleccionar una comercializadora para ver sus ofertas</Typography>
                      </Box>
                      :
                      <>
                        {selectedTradingCompanyCif1 === ''
                          ?
                          <Box my={4}>
                            <Typography variant="h6" align="center">Debes seleccionar la comercializadora 1 para poder comparar las ofertas</Typography>
                          </Box>
                          :
                          <Box my={4}>
                            <Typography variant="h6" align="center">Actualmente la comercializadora 2 seleccionada no tiene publicada ninguna oferta de este tipo</Typography>
                          </Box>
                        }
                      </>
                    }
                  </>
                }
              </>
            }
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

const mapDispatchToProps = dispatch => ({
  createNotification: (config) => {
    dispatch(createNotification(config))
  },
})

export default connect(null, mapDispatchToProps)(CustomerComparePrices);