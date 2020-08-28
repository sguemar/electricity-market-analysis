import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  makeStyles,
  Typography,
  Container,
  Box,
  Button,
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
import { createNotification } from 'react-redux-notify';
import {
  successReloadReceivedOffersNotification
} from '../../redux/constants/notifications';

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
  createOfferButton: {
    backgroundColor: '#39b856',
    "&:hover": {
      backgroundColor: '#28a745'
    }
  },
  editOfferButton: {
    backgroundColor: '#ffc107',
    "&:hover": {
      backgroundColor: '#eeb006'
    }
  },
}));


const ReceivedOffers = ({ createNotification }) => {

  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [offersList, setOffersList] = useState([]);
  const [offersPage, setOffersPage] = useState(1);
  const [offersCount, setOffersCount] = useState(0);
  const [offerRateFilter, setOfferRateFilter] = useState('');
  const [offersTypes, setOffersTypes] = useState([]);

  const handleChangeOfferRateFilter = (event) => setOfferRateFilter(event.target.value);

  const handleReloadReceivedOffersTable = () => {
    getReceiveOffers();
    createNotification(successReloadReceivedOffersNotification);
  }
  const handleOffersPageChange = (event, value) => setOffersPage(value);

  const getReceiveOffers = async () => {
    setLoading(true);
    try {
      let response = await axios.get('/api/customer/get-received-offers');
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
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

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
    classes.editOfferButton,
    offerRateFilter
  ]);

  useEffect(() => {
    getReceiveOffers();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box mt={4}>
        <Typography variant="h4" align="center">Ofertas recibidas</Typography>
      </Box>
      <Box my={4}>
        {loading ?
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
                    <Typography variant="h6" align="center">Actualmente no has recibido ofertas de este tipo</Typography>
                  </Box>
                  :
                  <Box my={4}>
                    <Typography variant="h6" align="center">Actualmente no has recibido ofertas</Typography>
                  </Box>
                }
              </>
            }
          </>
        }
      </Box >
      <Box display="flex" justifyContent="center" mt={2}>
        <Button color="primary" variant="contained" onClick={handleReloadReceivedOffersTable}>Actualizar ofertas</Button>
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

const mapDispatchToProps = dispatch => ({
  createNotification: (config) => {
    dispatch(createNotification(config))
  },
});

export default connect(null, mapDispatchToProps)(ReceivedOffers);