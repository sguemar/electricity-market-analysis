import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import mapDataSpain from './mapDataSpain';
import {
  Pagination
} from '@material-ui/lab';

// Load Highcharts modules
require('highcharts/modules/map')(Highcharts);

const initialHistoricalGraphOptions = {
  series: [],
  xAxis: {
    title: {
      style: {
        fontSize: '14px',
      },
    },
  },
  yAxis: {
    title: {
      style: {
        fontSize: '14px',
      },
      text: 'Precio (€)'
    }
  },
  tooltip: {
    borderRadius: 10,
    formatter: function () {
      return '<b>' + this.y + '</b> €';
    }
  }
};

const CompaniesPerRegion = () => {

  const [mapOptions, setMapOptions] = useState({
    chart: {
      height: 550,
      borderColor: '#000000',
      borderWidth: 1,
    },
    title: {
      text: "Mapa de España"
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom'
      }
    },
    colorAxis: {
      min: 0,
      minColor: '#EEEEFF',
      maxColor: '#000022',
      stops: [
        [0, '#EFEFFF'],
        [0.67, '#4444FF'],
        [1, '#000022']
      ]
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'middle',
      borderWidth: 1,
      backgroundColor: 'rgba(255,255,255,0.85)',
      floating: true,
      y: 50
    },
    plotOptions: {
      map: {
        events: {
          click: (e) => {
            setSelectedRegion(e.point.name);
            setCompaniesPage(1);
          }
        },
      },
    },
    series: [
      {
        mapData: mapDataSpain,
        name: "España",
        data: [],
        states: {
          hover: {
            color: '#BADA55'
          }
        },
        dataLabels: {
          enabled: true,
          format: '{point.name}'
        }
      }
    ]
  });
  const [selectedRegion, setSelectedRegion] = useState('');
  const [historicalPrices, setHistoricalPrices] = useState({});
  const [historicalGraphOptions, setHistoricalGraphOptions] = useState(initialHistoricalGraphOptions);
  const [companies, setCompanies] = useState([]);
  const [companiesPage, setCompaniesPage] = useState(1);
  const [companiesCount, setCompaniesCount] = useState(0);
  const [companiesList, setCompaniesList] = useState('');
  const handleCompaniesPageChange = (event, value) => setCompaniesPage(value);


  const getAllCompanies = async () => {
    try {
      const response = await axios.get('/api/public/get-all-companies');
      setCompanies(response.data.companies_result);
      setMapOptions({
        ...mapOptions,
        series: [{
          data: response.data.regions_result,
        }]
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getHistocalPrices = async () => {
    try {
      const response = await axios.get('/api/public/get-historical-prices');
      setHistoricalPrices(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCompanies();
    getHistocalPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (companies.length !== 0) {
      let filteredCompanies = companies;
      if (selectedRegion !== '')
        filteredCompanies = companies.filter(company =>
          company.address === selectedRegion
        );
      setCompaniesCount(Math.ceil(filteredCompanies.length / 3));
      const endIndex = companiesPage * 3;
      const paginatedCompanies = filteredCompanies.slice(endIndex - 3, endIndex);
      setCompaniesList(paginatedCompanies.map(company => {
        return (
          <Box mb={2} key={company.user_id}>
            <Card>
              <List>
                <Grid container spacing={2}>
                  <Grid item>
                    <ListItem>
                      <ListItemText primary="CIF" secondary={company.cif || "-"} />
                    </ListItem>
                  </Grid>
                  <Grid item>
                    <ListItem>
                      <ListItemText primary="Nombre" secondary={company.name || "-"} />
                    </ListItem>
                  </Grid>
                  <Grid item>
                    <ListItem>
                      <ListItemText primary="Dirección" secondary={company.address || "-"} />
                    </ListItem>
                  </Grid>
                  <Grid item>
                    <ListItem>
                      <ListItemText primary="Email" secondary={company.email || "-"} />
                    </ListItem>
                  </Grid>
                  <Grid item>
                    <ListItem>
                      <ListItemText primary="URL" secondary={company.url || "-"} />
                    </ListItem>
                  </Grid>
                  <Grid item>
                    <ListItem>
                      <ListItemText primary="Teléfono" secondary={company.phone || "-"} />
                    </ListItem>
                  </Grid>
                  <Grid item>
                    <ListItem>
                      <ListItemText primary="Tipo de empresa" secondary={company.company_type === 1 ? "Distribuidora" : "Comercializadora"} />
                    </ListItem>
                  </Grid>
                </Grid>
              </List>
            </Card>
          </Box>
        );
      }));
    }
  }, [
    selectedRegion,
    companiesPage
  ]);

  useEffect(() => {
    if (selectedRegion !== '') {
      let seriesData = historicalGraphOptions.series;
      if (seriesData.length === 3)
        seriesData.shift();
      seriesData.push({
        type: 'line',
        name: selectedRegion,
        data: Object.values(historicalPrices[selectedRegion])
      });
      setHistoricalGraphOptions({
        ...historicalGraphOptions,
        title: {
          text: "Media de precios anuales"
        },
        series: seriesData,
        xAxis: {
          categories: Object.keys(historicalPrices[selectedRegion])
        }
      });
    }
  }, [
    selectedRegion
  ]);

  return (
    <Container maxWidth="xl">
      <Box my={4}>
        <Typography variant="h4" align="center">Empresas por región</Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box>
            <HighchartsReact
              options={mapOptions}
              constructorType={'mapChart'}
              highcharts={Highcharts}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            {selectedRegion !== ''
              ?
              <>
                {companiesList.length !== 0
                  ?
                  <>
                    {companiesList}
                    <Box mt={4} display="flex" justifyContent="center">
                      <Pagination color="primary" page={companiesPage} count={companiesCount} onChange={handleCompaniesPageChange} />
                    </Box>
                  </>
                  :
                  <Typography variant="h5" align="center">Actualmente no existen empresas en esta región</Typography>
                }
              </>
              :
              <Typography variant="h5" align="center">Elige una región para ver sus empresas</Typography>
            }
          </Box>
        </Grid>
        <Grid item xs={12}>
          {historicalGraphOptions.series.length !== 0
            ?
            <HighchartsReact
              highcharts={Highcharts}
              options={historicalGraphOptions}
            />
            :
            <Typography variant="h6" align="center">Elige una o varias regiones para visualizar sus precios en el tiempo.</Typography>
          }
        </Grid>
      </Grid>
    </Container>
  );
};


export default CompaniesPerRegion;