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


const MyCustomers = () => {

  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [potencialCustomers, setPotencialCustomers] = useState([]);
  const [potencialCustomersDataTable, setPotencialCustomersDataTable] = useState({
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

  const getPotentialsCustomers = async () => {
    try {
      const response = await axios.get('/api/company/get-potentials-customers');
      setPotencialCustomers(response.data);
      setPotencialCustomersDataTable({
        ...potencialCustomersDataTable,
        rows: response.data
      });
    } catch (error) {
      console.log(error);
    }
	};

  useEffect(() => {
    getCustomers();
    getPotentialsCustomers();
    const interval = setInterval(() => {
      getPotentialsCustomers();
    }, 5000);
    return () => clearInterval(interval);
  }, [])

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
            {potencialCustomers.length !== 0
              ?
              <>
                <Box my={4}>
                  <Typography variant="h4" align="center">Clientes potenciales</Typography>
                </Box>
                <MDBDataTable
                  hover
                  infoLabel={["Viendo", "-", "de", "clientes"]}
                  searchLabel="Buscar"
                  entriesOptions={[5, 10, 15]}
                  entries={5}
                  data={potencialCustomersDataTable}
                  responsive
                  paginationLabel={["Anterior", "Siguiente"]}
                  entriesLabel="Clientes por página"
                />
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


export default MyCustomers;