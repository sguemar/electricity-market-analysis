import React, { useEffect, useState } from 'react';
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
  Paper
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import {
  Pagination
} from '@material-ui/lab';
import {
  Button as RBButton
} from 'react-bootstrap';
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
  }
}));


const Offers = () => {

  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [offersList, setOffersList] = useState([]);
  const [offersPage, setOffersPage] = useState(1);
  const [offersCount, setOffersCount] = useState(0);

  const handleOffersPageChange = (event, value) => setOffersPage(value);

  const getOffers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/company/get-offers');
      const offers = response.data;
      if (offers.length === 0) {
        setOffers([]);
        setOffersList([]);
        setOffersCount(0);
      } else {
        setOffers(offers);
        setOffersCount(Math.ceil(offers.length / 2));
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    if (offers.length !== 0) {
      const endIndex = offersPage * 2;
      const paginatedOffers = offers.slice(endIndex - 2, endIndex);
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
                <Button size="small">Editar</Button>
                <Button size="small">Eliminar</Button>
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
    classes.headerTableCell
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
                <Box my={4}>
                  <Typography variant="h6" align="center">Actualmente no tienes ofertas</Typography>
                </Box>
              </>
            }
          </>
        }
      </Box >
      <Box display="flex" justifyContent="center" mt={2}>
        <RBButton variant="success" size="lg">Crear oferta</RBButton>
      </Box>
    </Container>
  );
}


export default Offers;