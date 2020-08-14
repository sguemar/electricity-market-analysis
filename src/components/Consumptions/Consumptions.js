import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  MenuItem,
  Container,
  Box,
  CircularProgress,
  Button,
} from '@material-ui/core';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';


const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const initialExpenseGraphOptions = {
  series: [{
    data: []
  }],
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
      text: 'Importe total (€)'
    }
  },
  tooltip: {
    borderRadius: 10,
    formatter: function () {
      return '<b>' + this.y + '</b> €';
    }
  }
};


const Consumptions = () => {
  const [loading, setLoading] = useState(false);
  const [switchButtonsState, setSwitchButtonState] = useState({
    monthlyButtonVariant: "contained",
    monthlyButtonColor: "primary",
    annualButtonVariant: "outlined",
    annualButtonColor: "default"
  });
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');

  const [expenseGraphOptions, setExpenseGraphOptions] = useState(initialExpenseGraphOptions);

  const handleMonthlyExpenseGraph = () => {
    setSwitchButtonState({
      monthlyButtonVariant: "contained",
      monthlyButtonColor: "primary",
      annualButtonVariant: "outlined",
      annualButtonColor: "default"
    });
    setMonthlyExpenseGraphData();
  }

  const handleAnnualExpenseGraph = () => {
    setSwitchButtonState({
      monthlyButtonVariant: "outlined",
      monthlyButtonColor: "default",
      annualButtonVariant: "contained",
      annualButtonColor: "primary"
    });
    setAnnualExpenseGraphData();
  }

  const setMonthlyExpenseGraphData = async () => {
    const response = await axios.get('/api/customer/get-consumption-data');
    const consumptions = response.data;
    const data = consumptions[selectedYear].filter(element => element !== 0);
    const average = Math.round((data.reduce((a, b) => a + b, 0) / data.length) * 100) / 100;
    let annualAverage = new Array(12).fill(average);
    setSelectedYear(selectedYear);
    setExpenseGraphOptions({
      ...expenseGraphOptions,
      title: {
        text: 'Gasto mensual'
      },
      series: [
        {
          type: 'column',
          name: 'Año ' + selectedYear,
          data: consumptions[selectedYear]
        },
        {
          type: 'line',
          name: 'Media anual',
          data: annualAverage
        }
      ],
      xAxis: {
        title: {
          text: 'Mes'
        },
        categories: months
      }
    });
  }

  const setAnnualExpenseGraphData = async () => {
    const response = await axios.get('/api/customer/get-consumption-data');
    const consumptions = [];
    for (let year in response.data) {
      const dataFiltered = response.data[year].filter(element => element !== 0);
      consumptions.push(Math.round((dataFiltered.reduce((a, b) => a + b, 0) / dataFiltered.length) * 100) / 100);
    }
    const average = Math.round((consumptions.reduce((a, b) => a + b, 0) / consumptions.length) * 100) / 100;
    let totalAverage = new Array(years.length).fill(average);
    setExpenseGraphOptions({
      ...expenseGraphOptions,
      title: {
        text: 'Gasto anual'
      },
      series: [
        {
          type: 'column',
          name: "Todos los años",
          data: consumptions
        },
        {
          type: 'line',
          name: 'Media total',
          data: totalAverage
        }
      ],
      xAxis: {
        title: {
          text: 'Año'
        },
        categories: years
      }
    });
  }

  const handleChangeYear = async event => {
    const response = await axios.get('/api/customer/get-consumption-data');
    const consumptions = response.data;
    const currentSelectedYear = event.target.value;
    const data = consumptions[currentSelectedYear].filter(element => element !== 0);
    const average = Math.round((data.reduce((a, b) => a + b, 0) / data.length) * 100) / 100;
    let annualAverage = new Array(12).fill(average);
    setSelectedYear(currentSelectedYear);
    setExpenseGraphOptions({
      ...expenseGraphOptions,
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
      xAxis: {
        title: {
          text: 'Mes'
        },
        categories: months
      }
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
      const average = Math.round((data.reduce((a, b) => a + b, 0) / data.length) * 100) / 100;
      let annualAverage = new Array(12).fill(average);
      setExpenseGraphOptions({
        ...expenseGraphOptions,
        title: {
          text: 'Gasto mensual'
        },
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
        ],
        xAxis: {
          title: {
            text: 'Mes'
          },
          categories: months
        }
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
          {expenseGraphOptions.series[0].data.length !== 0 ?
            <>
              <Box my={8}>
                <Typography variant="h4" align="center">Mis consumos</Typography>
              </Box>
              <HighchartsReact
                highcharts={Highcharts}
                options={expenseGraphOptions}
              />
              <Box mt={2} display="flex" alignItems="center">
                <Box mr={2}>
                  <ButtonGroup variant="outlined" size="large">
                    <Button
                      variant={switchButtonsState.monthlyButtonVariant}
                      color={switchButtonsState.monthlyButtonColor}
                      onClick={handleMonthlyExpenseGraph}
                    >
                      Mensual
                  </Button>
                    <Button
                      variant={switchButtonsState.annualButtonVariant}
                      color={switchButtonsState.annualButtonColor}
                      onClick={handleAnnualExpenseGraph}
                    >
                      Anual
                  </Button>
                  </ButtonGroup>
                </Box>
                {switchButtonsState.monthlyButtonColor === "primary" ?
                  <TextField
                    id="outlined-select-year"
                    select
                    label="Año"
                    value={selectedYear}
                    onChange={handleChangeYear}
                    variant="outlined"
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </TextField>
                  :
                  <></>
                }
              </Box>
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