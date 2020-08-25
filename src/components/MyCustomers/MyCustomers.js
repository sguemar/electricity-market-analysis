import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Box,
  CircularProgress,
  makeStyles
} from '@material-ui/core';
import axios from 'axios';
import { MDBDataTable } from 'mdbreact';


const useStyles = makeStyles((theme) => ({
}));


const MyCustomers = () => {

  const classes = useStyles();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerDataTable, setCustomerDataTable] = useState({
    columns: [
      {
        label: 'Nombre',
        field: 'name',
      },
      {
        label: 'Apellidos',
        field: 'surname',
      },
      {
        label: 'NIF',
        field: 'nif',
      },
      {
        label: 'Email',
        field: 'email',
      },
    ],
    rows: [],
  });



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
  }

  useEffect(() => {
    getCustomers();
  }, [])

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" align="center">Mis clientes</Typography>
      </Box>
      <Box my={4}>
        {loading ?
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
          :
          <>
            {customers.length !== 0
              ?
              <MDBDataTable
                className={classes.card}
                hover
                infoLabel={["Viendo del", "al", "de", "clientes"]}
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
          </>
        }
      </Box >
    </Container>
  );
}


export default MyCustomers;