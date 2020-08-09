import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  MenuItem,
  Container,
  Box,
  CircularProgress
} from '@material-ui/core';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';


const Consumptions = () => {
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');

  const [options, setOptions] = useState(
    {
      series: [{
        data: []
      }],
      title: {
        text: 'Gasto mensual'
      },
      xAxis: {
        title: {
          style: {
            fontSize: '14px',
          },
          text: 'Mes'
        },
        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      },
      yAxis: {
        title: {
          style: {
            fontSize: '14px',
          },
          text: 'Importe total (€)'
        }
      },
      tooltip: {
        borderRadius: 10,
        formatter: function () {
          return '<b>' + this.y + '</b> €';
        }
      }
    }
  );

  const handleChangeYear = async event => {
    const response = await axios.get('/api/customer/get-consumption-data');
    const consumptions = response.data;
    const currentSelectedYear = event.target.value;
    const data = consumptions[currentSelectedYear].filter(element => element !== 0);
    const average = Math.round((data.reduce((a,b) => a + b, 0) / data.length) * 100) / 100;
    let annualAverage = new Array(12).fill(average);
    setSelectedYear(currentSelectedYear);
    setOptions({
      ...options,
      series: [
        {
          type: 'column',
          name: 'Año ' + currentSelectedYear,
          data: consumptions[currentSelectedYear]
        },
        {
          type: 'line',
          name: 'Media anual',
          data: annualAverage
        }
      ],
    });
  }

  const getConsumptions = async () => {
    setLoading(true);
    const response = await axios.get('/api/customer/get-consumption-data');
    const consumptions = response.data;
    if (Object.keys(consumptions).length !== 0) {
      const yearsList = Object.keys(consumptions);
      const maxYear = String(Math.max(...yearsList));
      const data = consumptions[maxYear].filter(element => element !== 0);
      const average = Math.round((data.reduce((a,b) => a + b, 0) / data.length) * 100) / 100;
      let annualAverage = new Array(12).fill(average);
      setOptions({
        ...options,
        series: [
          {
            type: 'column',
            name: 'Año ' + maxYear,
            data: consumptions[maxYear]
          },
          {
            type: 'line',
            name: 'Media anual',
            data: annualAverage
          }
        ]
      });
      setSelectedYear(maxYear);
      setYears(yearsList);
    }
    setLoading(false);
  }

  useEffect(() => {
    getConsumptions();
  }, []);

  return (
    <Container>
      {loading ?
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
        :
        <>
          {options.series[0].data.length !== 0 ?
            <>
              <Typography variant="h4" align="center">Mis consumos</Typography>
              <HighchartsReact
                highcharts={Highcharts}
                options={options}
              />
              <TextField
                id="outlined-select-year"
                select
                label="Año"
                value={selectedYear}
                onChange={handleChangeYear}
                helperText="Selecciona un año"
                variant="outlined"
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </>
            :
            <Typography variant="h6" align="center">Debes tener al menos una factura registrada para ver tus consumos</Typography>
          }
        </>
      }
    </Container>
  );
}

export default Consumptions;