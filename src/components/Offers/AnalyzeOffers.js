import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  CardHeader,
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Grid,
  CircularProgress,
  Divider,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import {
  Pagination
} from '@material-ui/lab';
import axios from 'axios';
import {
  MDBDataTable,
} from 'mdbreact';

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
}));


const AnalyzeOffers = () => {

  const classes = useStyles();

  // COMPANIES
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [tradingCompanies, setTradingCompanies] = useState([]);
  const [tradingCompaniesDataTable, setTradingCompaniesDataTable] = useState({
    columns: [
      {
        label: 'CIF',
        field: 'cif',
      },
      {
        label: 'Nombre',
        field: 'name',
      },
      {
        label: 'Dirección',
        field: 'address',
      },
      {
        label: 'URL',
        field: 'url',
      },
      {
        label: 'Email',
        field: 'email',
      },
      {
        label: 'Teléfono',
        field: 'phone',
      },
    ],
    rows: [],
  });
  const [selectedTradingCompanyCif, setSelectedTradingCompanyCif] = useState('');


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

  const handleTradingCompanyClick = (cif) => getSelectedTradingCompanyOffers(cif);

  const getSelectedTradingCompanyOffers = async (cif) => {
    setOffersLoading(true);
    setSelectedTradingCompanyCif(cif);
    try {
      let response = await axios.get('/api/public/get-trading-company-offers/' + cif);
      const offers = response.data;
      if (offers.length === 0) {
        setOffers([]);
        setOffersList([]);
        setOffersCount(0);
      } else {
        setOffers(offers);
        setOffersCount(Math.ceil(offers.length / 2));
      }
      setOffersLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTradingCompanies = async () => {
    setCompaniesLoading(true);
    try {
      const response = await axios.get('/api/public/get-all-trading-companies');
      if (response.data.length !== 0) {
        const tradingCompanies = response.data.map(tradingCompany => {
          return {
            ...tradingCompany,
            clickEvent: () => handleTradingCompanyClick(tradingCompany.cif)
          }
        });
        setTradingCompanies(tradingCompanies);
        setTradingCompaniesDataTable({
          ...tradingCompaniesDataTable,
          rows: tradingCompanies
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
    if (offers.length !== 0) {
      let filteredOffers = offers;
      if (offerRateFilter !== '')
        filteredOffers = offers.filter(offer =>
          offer.offerInfo.offer_type === offerRateFilter
        );
      setOffersCount(Math.ceil(filteredOffers.length / 2));
      const endIndex = offersPage * 2;
      const paginatedOffers = filteredOffers.slice(endIndex - 2, endIndex);
      const updatedOffersList = paginatedOffers.map(offer => {
        return (
          <Grid key={offer.offerInfo.id} item xs={12} md={12 / paginatedOffers.length}>
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
                            <TableCell align="center">{offer.offerInfo.fixed_term + " €/kW día"}</TableCell>
                            {offer.offerInfo.variable_term === 0
                              ?
                              <>
                                <TableCell align="center">{offer.offerInfo.tip + " €/kWh"}</TableCell>
                                <TableCell align="center">{offer.offerInfo.valley + " €/kWh"}</TableCell>
                                {offer.offerInfo.super_valley !== 0 &&
                                  <TableCell align="center">{offer.offerInfo.super_valley + " €/kWh"}</TableCell>
                                }
                              </>
                              :
                              <TableCell align="center">{offer.offerInfo.variable_term + " €/kWh"}</TableCell>
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
                  <Grid item xs={12}>
                    <Card className={classes.card}>
                      <CardContent>
                        <Grid container spacing={4}>
                          <Grid item xs={12} sm={6}>
                            <List
                              subheader={
                                <ListSubheader>
                                  Datos de la empresa
                              </ListSubheader>
                              }
                            >
                              <ListItem>
                                <ListItemText primary="CIF" secondary={offer.companyInfo.cif || "-"} />
                              </ListItem>
                              <Divider />
                              <ListItem>
                                <ListItemText primary="Nombre" secondary={offer.companyInfo.name || "-"} />
                              </ListItem>
                              <Divider />
                              <ListItem>
                                <ListItemText primary="Dirección" secondary={offer.companyInfo.address || "-"} />
                              </ListItem>
                            </List>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <List
                              subheader={
                                <ListSubheader>
                                  Datos de contacto
                              </ListSubheader>
                              }
                            >
                              <ListItem>
                                <ListItemText primary="Email" secondary={offer.companyInfo.email || "-"} />
                              </ListItem>
                              <Divider />
                              <ListItem>
                                <ListItemText primary="URL" secondary={offer.companyInfo.url || "-"} />
                              </ListItem>
                              <Divider />
                              <ListItem>
                                <ListItemText primary="Teléfono" secondary={offer.companyInfo.phone || "-"} />
                              </ListItem>
                            </List>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
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
    <Container maxWidth="lg">
      <Box mt={4}>
        <Typography variant="h4" align="center">Ofertas públicas</Typography>
        <Typography variant="h5" align="center">Selecciona una comercializadora</Typography>
      </Box>
      <Box my={4}>
        {companiesLoading ?
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
          :
          <>
            {tradingCompanies.length !== 0
              ?
              <MDBDataTable
                hover
                infoLabel={["Viendo", "-", "de", "comercializadoras"]}
                searchLabel="Buscar"
                entriesOptions={[5, 10, 15]}
                entries={5}
                data={tradingCompaniesDataTable}
                responsive
                paginationLabel={["Anterior", "Siguiente"]}
                entriesLabel="Comercializadoras por página"
              />
              :
              <Box my={4}>
                <Typography variant="h6" align="center">Actualmente no existen comercializadoras registradas</Typography>
              </Box>
            }
          </>
        }
      </Box>
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
                <Box my={4}>
                  <Typography variant="h5" align="center">Ofertas</Typography>
                </Box>
                <Grid container spacing={4}>
                  {offersList}
                </Grid>
                <Box mt={4} display="flex" justifyContent="center">
                  <Pagination color="primary" page={offersPage} count={offersCount} onChange={handleOffersPageChange} />
                </Box>
              </>
              :
              <>
                {offerRateFilter !== '' && selectedTradingCompanyCif
                  ?
                  <Box my={4}>
                    <Typography variant="h6" align="center">Actualmente la comercializadora seleccionada no tiene publicada ninguna factura de este tipo</Typography>
                  </Box>
                  :
                  <Box my={4}>
                    <Typography variant="h6" align="center">Debes seleccionar una comercializadora para ver sus ofertas</Typography>
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
  );
}

export default AnalyzeOffers;