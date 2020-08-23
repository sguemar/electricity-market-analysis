import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  makeStyles,
  Typography,
  Container,
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  CardHeader,
  List,
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
  MenuItem
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import {
  Pagination
} from '@material-ui/lab';
import axios from 'axios';


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


const Offers = () => {

  const classes = useStyles();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [offersList, setOffersList] = useState([]);
  const [offersPage, setOffersPage] = useState(1);
  const [offersCount, setOffersCount] = useState(0);
  const [offerRateFilter, setOfferRateFilter] = useState('');
  const [offersTypes, setOffersTypes] = useState([]);

  const handleChangeOfferRateFilter = (event) => setOfferRateFilter(event.target.value);

  const handleOffersPageChange = (event, value) => setOffersPage(value);

  const handleCreateOffer = () => history.push('/create-offer');

  const handleEditOffer = (offerId) => history.push('/edit-offer/' + offerId);

  const handleDeleteOffer = (offerId) => {
    console.log(offerId);
  }

  const getOffers = async () => {
    setLoading(true);
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
                  variant="contained"
                  onClick={() => handleEditOffer(offer.id)}
                  className={classes.editOfferButton}
                  size="small"
                >
                  Editar
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleDeleteOffer(offer.id)}
                  color="secondary"
                  size="small"
                >
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          </Grid >
        );
      });
      setOffersList(updatedOffersList);
    }
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
    getOffers();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box mt={4}>
        <Typography variant="h4" align="center">Ofertas actuales</Typography>
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
        <Button className={classes.createOfferButton} onClick={handleCreateOffer}>Crear oferta</Button>
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


export default Offers;