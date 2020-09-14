import React, { useState, useEffect } from 'react';
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
import {
  MDBDataTable,
} from 'mdbreact';
import axios from 'axios';


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

const TradingCompanyComparePrices = () => {

  const classes = useStyles();

  // COMPANIES
  const [companiesLoading, setCompaniesLoading] = useState(false);
  // COMPETENCY COMPANIES
  const [competencyTradingCompanies, setCompetencyTradingCompanies] = useState([]);
  const [competencyTradingCompaniesDataTable, setCompetencyTradingCompaniesDataTable] = useState(dataTablesData);
  const [selectedCompetencyTradingCompanyCif, setSelectedCompetencyTradingCompanyCif] = useState('');
  const [selectedCompetencyTradingCompany, setSelectedCompetencyTradingCompany] = useState({});

  // OFFERS
  const [offersTypes, setOffersTypes] = useState([]);
  const [offerRateFilter, setOfferRateFilter] = useState('');
  const handleChangeOfferRateFilter = (event) => setOfferRateFilter(event.target.value);
  // COMPETENCY OFFERS
  const [competencyOffersLoading, setCompetencyOffersLoading] = useState(false);
  const [competencyOffers, setCompetencyOffers] = useState([]);
  const [competencyOffersList, setCompetencyOffersList] = useState([]);
  const [competencyOffersPage, setCompetencyOffersPage] = useState(1);
  const [competencyOffersCount, setCompetencyOffersCount] = useState(0);
  const [competencyOfferSelected, setCompetencyOfferSelected] = useState({});
  const [competencyFixedTermClassName, setCompetencyFixedTermClassName] = useState("");
  const [competencyVariableTermClassName, setCompetencyVariableTermClassName] = useState("");
  const [competencyTipClassName, setCompetencyTipClassName] = useState("");
  const [competencyValleyClassName, setCompetencyValleyClassName] = useState("");
  const [competencySuperValleyClassName, setCompetencySuperValleyClassName] = useState("");
  const handleCompetencyOffersPageChange = (event, value) => setCompetencyOffersPage(value);
  // MY OFFERS
  const [myOffersLoading, setMyOffersLoading] = useState(false);
  const [myOffers, setMyOffers] = useState([]);
  const [myOffersList, setMyOffersList] = useState([]);
  const [myOffersPage, setMyOffersPage] = useState(1);
  const [myOffersCount, setMyOffersCount] = useState(0);
  const [myOfferSelected, setMyOfferSelected] = useState({});
  const [myFixedTermClassName, setMyFixedTermClassName] = useState("");
  const [myVariableTermClassName, setMyVariableTermClassName] = useState("");
  const [myTipClassName, setMyTipClassName] = useState("");
  const [myValleyClassName, setMyValleyClassName] = useState("");
  const [mySuperValleyClassName, setMySuperValleyClassName] = useState("");
  const handleMyOffersPageChange = (event, value) => setMyOffersPage(value);


  const handleTradingCompanyClick = (tradingCompany) => {
    setSelectedCompetencyTradingCompanyCif(tradingCompany.cif);
    setSelectedCompetencyTradingCompany(tradingCompany);
  }

  const getSelectedTradingCompanyOffers = async (tradingCompany) => {
    setCompetencyOffersLoading(true);
    try {
      let response = await axios.get('/api/public/get-trading-company-offers/' + tradingCompany.cif);
      const offers = response.data;
      if (offers.length === 0) {
        setCompetencyOffers([]);
        setCompetencyOffersList([]);
        setCompetencyOffersCount(0);
        setCompetencyOfferSelected({});
      } else {
        setCompetencyOffers(offers);
        setCompetencyOfferSelected(offers[0]);
      }
      setCompetencyOffersLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getOffersTypes = async () => {
    const response = await axios.get('/api/company/get-offers-types');
    setOffersTypes(response.data);
  };

  const getAllCompetencyTradingCompanies = async () => {
    setCompaniesLoading(true);
    try {
      const response = await axios.get('/api/company/get-compentency-trading-companies');
      if (response.data.length !== 0) {
        const tradingCompanies = response.data.map(tradingCompany => {
          return {
            ...tradingCompany,
            clickEvent: () => handleTradingCompanyClick(tradingCompany)
          }
        });
        setCompetencyTradingCompanies(tradingCompanies);
        setCompetencyTradingCompaniesDataTable({
          ...competencyTradingCompaniesDataTable,
          rows: tradingCompanies
        });
      }
      setCompaniesLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getMyOffers = async () => {
    setMyOffersLoading(true);
    try {
      let response = await axios.get('/api/company/get-offers');
      const offers = response.data;
      if (offers.length === 0) {
        setMyOffers([]);
        setMyOffersList([]);
        setMyOffersCount(0);
        setMyOfferSelected({});
      } else {
        setMyOffers(offers);
        setMyOfferSelected(offers[0]);
      }
      setMyOffersLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getOffersTypes();
    getAllCompetencyTradingCompanies();
    getMyOffers();
  }, []);

  useEffect(() => {
    getSelectedTradingCompanyOffers(selectedCompetencyTradingCompany);
  }, [selectedCompetencyTradingCompanyCif]);

  useEffect(() => {
    let competencyFilteredOffers = [];
    if (competencyOffers.length !== 0 && Object.keys(myOfferSelected).length !== 0) {
      competencyFilteredOffers = competencyOffers;
      if (offerRateFilter !== '')
        competencyFilteredOffers = competencyOffers.filter(offer =>
          offer.offerInfo.offer_type === offerRateFilter
        );
      if (competencyFilteredOffers.length !== 0) {
        setCompetencyOffersCount(competencyFilteredOffers.length);
        setCompetencyOfferSelected(competencyFilteredOffers[competencyOffersPage - 1]);
        let offer = competencyFilteredOffers[competencyOffersPage - 1];
        if (typeof (offer) === 'undefined') {
          offer = competencyFilteredOffers[0];
          setCompetencyOfferSelected(competencyFilteredOffers[0]);
          setCompetencyOffersPage(1);
        }

        // FIXED TERM
        if (offer.offerInfo.fixed_term > myOfferSelected.fixed_term)
          setCompetencyFixedTermClassName(classes.expensiveValue);
        else if (offer.offerInfo.fixed_term < myOfferSelected.fixed_term)
          setCompetencyFixedTermClassName(classes.cheapestValue);

        // VARIABLE TERM
        if (offer.offerInfo.variable_term > myOfferSelected.variable_term)
          setCompetencyVariableTermClassName(classes.expensiveValue);
        else if (offer.offerInfo.variable_term < myOfferSelected.variable_term)
          setCompetencyVariableTermClassName(classes.cheapestValue);

        // TIP
        if (offer.offerInfo.tip > myOfferSelected.tip)
          setCompetencyTipClassName(classes.expensiveValue);
        else if (offer.offerInfo.tip < myOfferSelected.tip)
          setCompetencyTipClassName(classes.cheapestValue);

        // VALLEY
        if (offer.offerInfo.valley > myOfferSelected.valley)
          setCompetencyValleyClassName(classes.expensiveValue);
        else if (offer.offerInfo.valley < myOfferSelected.valley)
          setCompetencyValleyClassName(classes.cheapestValue);

        // SUPERVALLEY
        if (offer.offerInfo.super_valley > myOfferSelected.super_valley)
          setCompetencySuperValleyClassName(classes.expensiveValue);
        else if (offer.offerInfo.super_valley < myOfferSelected.super_valley)
          setCompetencySuperValleyClassName(classes.cheapestValue);

        setCompetencyOffersList(
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
                            <TableCell className={competencyFixedTermClassName} align="center">
                              {offer.offerInfo.fixed_term + " €/kW día"}
                            </TableCell>
                            {offer.offerInfo.variable_term === 0
                              ?
                              <>
                                <TableCell className={competencyTipClassName} align="center">{offer.offerInfo.tip + " €/kWh"}</TableCell>
                                <TableCell className={competencyValleyClassName} align="center">{offer.offerInfo.valley + " €/kWh"}</TableCell>
                                {offer.offerInfo.super_valley !== 0 &&
                                  <TableCell className={competencySuperValleyClassName} align="center">{offer.offerInfo.super_valley + " €/kWh"}</TableCell>
                                }
                              </>
                              :
                              <TableCell className={competencyVariableTermClassName} align="center">{offer.offerInfo.variable_term + " €/kWh"}</TableCell>
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
        setCompetencyOffersCount(0);
        setCompetencyOffersList([]);
        setMyFixedTermClassName("");
        setMyVariableTermClassName("");
        setMyTipClassName("");
        setMyValleyClassName("");
        setMySuperValleyClassName("");
      }
    }
    if (myOffers.length !== 0 && Object.keys(competencyOfferSelected).length !== 0) {
      let myFilteredOffers = myOffers;
      if (offerRateFilter !== '')
        myFilteredOffers = myOffers.filter(offer =>
          offer.offer_type === offerRateFilter
        );
      if (myFilteredOffers.length !== 0) {
        setMyOffersCount(myFilteredOffers.length);
        setMyOfferSelected(myFilteredOffers[myOffersPage - 1]);
        let offer = myFilteredOffers[myOffersPage - 1];
        if (typeof (offer) === 'undefined') {
          offer = myFilteredOffers[0];
          setMyOfferSelected(myFilteredOffers[0]);
          setMyOffersPage(1);
        }

        if (competencyFilteredOffers.length !== 0) {
          // FIXED TERM
          if (offer.fixed_term > competencyOfferSelected.offerInfo.fixed_term)
            setMyFixedTermClassName(classes.expensiveValue);
          else if (offer.fixed_term < competencyOfferSelected.offerInfo.fixed_term)
            setMyFixedTermClassName(classes.cheapestValue);

          // VARIABLE TERM
          if (offer.variable_term > competencyOfferSelected.offerInfo.variable_term)
            setMyVariableTermClassName(classes.expensiveValue);
          else if (offer.variable_term < competencyOfferSelected.offerInfo.variable_term)
            setMyVariableTermClassName(classes.cheapestValue);

          // TIP
          if (offer.tip > competencyOfferSelected.offerInfo.tip)
            setMyTipClassName(classes.expensiveValue);
          else if (offer.tip < competencyOfferSelected.offerInfo.tip)
            setMyTipClassName(classes.cheapestValue);

          // VALLEY
          if (offer.valley > competencyOfferSelected.offerInfo.valley)
            setMyValleyClassName(classes.expensiveValue);
          else if (offer.valley < competencyOfferSelected.offerInfo.valley)
            setMyValleyClassName(classes.cheapestValue);

          // SUPERVALLEY
          if (offer.super_valley > competencyOfferSelected.offerInfo.super_valley)
            setMySuperValleyClassName(classes.expensiveValue);
          else if (offer.super_valley < competencyOfferSelected.offerInfo.super_valley)
            setMySuperValleyClassName(classes.cheapestValue);
        }

        setMyOffersList(
          <Grid key={offer.id} item xs={12}>
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
                            <TableCell className={myFixedTermClassName} align="center">
                              {offer.fixed_term + " €/kW día"}
                            </TableCell>
                            {offer.variable_term === 0
                              ?
                              <>
                                <TableCell className={myTipClassName} align="center">{offer.tip + " €/kWh"}</TableCell>
                                <TableCell className={myValleyClassName} align="center">{offer.valley + " €/kWh"}</TableCell>
                                {offer.super_valley !== 0 &&
                                  <TableCell className={mySuperValleyClassName} align="center">{offer.super_valley + " €/kWh"}</TableCell>
                                }
                              </>
                              :
                              <TableCell className={myVariableTermClassName} align="center">{offer.variable_term + " €/kWh"}</TableCell>
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
                                  {offer.features.length - 1 !== index && <Divider />}
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
        setMyOffersCount(0);
        setMyOffersList([]);
        setCompetencyFixedTermClassName("");
        setCompetencyVariableTermClassName("");
        setCompetencyTipClassName("");
        setCompetencyValleyClassName("");
        setCompetencySuperValleyClassName("");
      }
    }
  }, [
    offerRateFilter,
    selectedCompetencyTradingCompany,
    myOfferSelected,
    competencyOfferSelected,
    competencyOffersPage,
    myOffersPage,
    competencyOffersCount,
    myOffersCount,
    competencyFixedTermClassName,
    myFixedTermClassName,
    competencyVariableTermClassName,
    myVariableTermClassName,
    competencyTipClassName,
    myTipClassName,
    competencyValleyClassName,
    myValleyClassName,
    competencySuperValleyClassName,
    mySuperValleyClassName,
  ]);

  return (
    <Container maxWidth="lg">
      <Box mt={4}>
        <Typography variant="h4" align="center">Comparador de precios</Typography>
        <Typography variant="h6" align="center">Selecciona la comercializadora con la que deseas comparar tus ofertas</Typography>
      </Box>
      <Box my={4}>
        {companiesLoading
          ?
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
          :
          <>
            {competencyTradingCompanies.length !== 0
              ?
              <>
                <Grid container>
                  <Grid item xs={12}>
                    <Box mb={2}>
                      <Typography variant="h6" align="center">Selecciona la comercializadora</Typography>
                    </Box>
                    <MDBDataTable
                      hover
                      infoLabel={["Viendo", "-", "de", "comercializadoras"]}
                      searchLabel="Buscar"
                      entriesOptions={[5, 10, 15]}
                      entries={5}
                      data={competencyTradingCompaniesDataTable}
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
        <Grid container>
          <Grid item xs={12}>
            {competencyOffersLoading
              ?
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
              :
              <>
                {selectedCompetencyTradingCompanyCif !== ''
                  ?
                  <>
                    <Box my={4}>
                      <Typography variant="h6" align="center">Comercializadora seleccionada</Typography>
                    </Box>
                    <Card>
                      <List className={classes.horizontalList}>
                        <Grid container spacing={2}>
                          <Grid item>
                            <ListItem>
                              <ListItemText primary="CIF" secondary={selectedCompetencyTradingCompany.cif || "-"} />
                            </ListItem>
                          </Grid>
                          <Grid item>
                            <ListItem>
                              <ListItemText primary="Nombre" secondary={selectedCompetencyTradingCompany.name || "-"} />
                            </ListItem>
                          </Grid>
                          <Grid item>
                            <ListItem>
                              <ListItemText primary="Dirección" secondary={selectedCompetencyTradingCompany.address || "-"} />
                            </ListItem>
                          </Grid>
                          <Grid item>
                            <ListItem>
                              <ListItemText primary="Email" secondary={selectedCompetencyTradingCompany.email || "-"} />
                            </ListItem>
                          </Grid>
                          <Grid item>
                            <ListItem>
                              <ListItemText primary="URL" secondary={selectedCompetencyTradingCompany.url || "-"} />
                            </ListItem>
                          </Grid>
                          <Grid item>
                            <ListItem>
                              <ListItemText primary="Teléfono" secondary={selectedCompetencyTradingCompany.phone || "-"} />
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
      <Box my={4}>
        <Grid container spacing={8}>
          <Grid item xs={12} md={6}>
            {competencyOffersLoading
              ?
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
              :
              <>
                {selectedCompetencyTradingCompanyCif === ''
                  ?
                  <Box my={4}>
                    <Typography variant="h6" align="center">Debes seleccionar una comercializadora para ver sus ofertas</Typography>
                  </Box>
                  :
                  <>
                    {offerRateFilter !== ''
                      ?
                      <>
                        {competencyOffersList.length !== 0
                          ?
                          <>
                            <Box my={4}>
                              <Typography variant="h5" align="center">Ofertas de {selectedCompetencyTradingCompany.name}</Typography>
                            </Box>
                            <Grid container spacing={4}>
                              {competencyOffersList}
                            </Grid>
                            <Box mt={4} display="flex" justifyContent="center">
                              <Pagination color="primary" page={competencyOffersPage} count={competencyOffersCount} onChange={handleCompetencyOffersPageChange} />
                            </Box>
                          </>
                          :
                          <Box my={4}>
                            <Typography variant="h6" align="center">Actualmente la comercializadora seleccionada no tiene publicada ninguna oferta de este tipo</Typography>
                          </Box>
                        }
                      </>
                      :
                      <Box my={4}>
                        <Typography variant="h6" align="center">Debes selecionar una tarifa</Typography>
                      </Box>
                    }
                  </>
                }
              </>
            }
          </Grid>
          <Grid item xs={12} md={6}>
            {myOffersLoading
              ?
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
              :
              <>
                {selectedCompetencyTradingCompanyCif !== ''
                  ?
                  <>
                    {offerRateFilter !== ''
                      ?
                      <>
                        {myOffersList.length !== 0
                          ?
                          <>
                            <Box my={4}>
                              <Typography variant="h5" align="center">Mis ofertas</Typography>
                            </Box>
                            <Grid container spacing={4}>
                              {myOffersList}
                            </Grid>
                            <Box mt={4} display="flex" justifyContent="center">
                              <Pagination color="primary" page={myOffersPage} count={myOffersCount} onChange={handleMyOffersPageChange} />
                            </Box>
                          </>
                          :
                          <Box my={4}>
                            <Typography variant="h6" align="center">Actualmente no tienes publicada ninguna oferta de este tipo</Typography>
                          </Box>
                        }
                      </>
                      :
                      <Box my={4}>
                        <Typography variant="h6" align="center">Debes selecionar una tarifa</Typography>
                      </Box>
                    }
                  </>
                  :
                  <Box my={4}>
                    <Typography variant="h6" align="center">Debes selecionar la comercializadora con la que vas a comparar tus ofertas</Typography>
                  </Box>
                }
              </>
            }
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default TradingCompanyComparePrices;