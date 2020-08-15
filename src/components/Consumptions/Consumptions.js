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

const initialConsumptionsGraphOptions = {
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
      text: 'Consumo total (kWh)'
    }
  },
  tooltip: {
    borderRadius: 10,
    formatter: function () {
      return '<b>' + this.y + '</b> kWh';
    }
  }
};


const Consumptions = () => {
  const [loading, setLoading] = useState(false);
  const [switchButtonsState, setSwitchButtonState] = useState({
    expense: {
      monthlyButtonVariant: "contained",
      monthlyButtonColor: "primary",
      annualButtonVariant: "outlined",
      annualButtonColor: "default"
    },
    consumptions: {
      monthlyButtonVariant: "contained",
      monthlyButtonColor: "primary",
      annualButtonVariant: "outlined",
      annualButtonColor: "default"
    }
  });
  const [averages, setAverages] = useState({
    expense: {
      years: [],
      total: []
    },
    consumptions: {
      years: [],
      total: []
    }
  });
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState({
    expense: false,
    consumptions: false
  });

  const [expenseGraphOptions, setExpenseGraphOptions] = useState(initialExpenseGraphOptions);
  const [consumptionsGraphOptions, setConsumptionsGraphOptions] = useState(initialConsumptionsGraphOptions);

  const handleMonthlyExpenseGraph = () => {
    setSwitchButtonState({
      ...switchButtonsState,
      expense: {
        monthlyButtonVariant: "contained",
        monthlyButtonColor: "primary",
        annualButtonVariant: "outlined",
        annualButtonColor: "default"
      }
    });
    setMonthlyExpenseGraphData();
  }

  const handleAnnualExpenseGraph = () => {
    setSwitchButtonState({
      ...switchButtonsState,
      expense: {
        monthlyButtonVariant: "outlined",
        monthlyButtonColor: "default",
        annualButtonVariant: "contained",
        annualButtonColor: "primary"
      }
    });
    setAnnualExpenseGraphData();
  }

  const handleMonthlyConsumptionsGraph = () => {
    setSwitchButtonState({
      ...switchButtonsState,
      consumptions: {
        monthlyButtonVariant: "contained",
        monthlyButtonColor: "primary",
        annualButtonVariant: "outlined",
        annualButtonColor: "default"
      }
    }
    );
    setMonthlyConsumptionsGraphData();
  }

  const handleAnnualConsumptionsGraph = () => {
    setSwitchButtonState({
      ...switchButtonsState,
      consumptions: {
        monthlyButtonVariant: "outlined",
        monthlyButtonColor: "default",
        annualButtonVariant: "contained",
        annualButtonColor: "primary"
      }
    }
    );
    setAnnualConsumptionsGraphData();
  }

  const setMonthlyExpenseGraphData = async () => {
    const response = await axios.get('/api/customer/get-consumption-data');
    const consumptions = response.data;
    const annualAverage = getAverage(consumptions, selectedYear.expense, "total_amount_list");
    setExpenseGraphOptions({
      ...expenseGraphOptions,
      title: {
        text: 'Gasto mensual'
      },
      series: [
        {
          type: 'column',
          name: 'Año ' + selectedYear.expense,
          data: consumptions[selectedYear.expense]["total_amount_list"]
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

  const setAnnualExpenseGraphData = () => {
    setExpenseGraphOptions({
      ...expenseGraphOptions,
      title: {
        text: 'Gasto anual'
      },
      series: [
        {
          type: 'column',
          name: "Todos los años",
          data: averages.expense.years
        },
        {
          type: 'line',
          name: 'Media total',
          data: averages.expense.total
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

  const setMonthlyConsumptionsGraphData = async () => {
    const response = await axios.get('/api/customer/get-consumption-data');
    const consumptions = response.data;
    const annualAverage = getAverage(consumptions, selectedYear.consumptions, "consumed_energy_amount_list");
    setConsumptionsGraphOptions({
      ...consumptionsGraphOptions,
      title: {
        text: 'Gasto mensual'
      },
      series: [
        {
          type: 'column',
          name: 'Año ' + selectedYear.consumptions,
          data: consumptions[selectedYear.consumptions]["consumed_energy_amount_list"]
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

  const setAnnualConsumptionsGraphData = () => {
    setConsumptionsGraphOptions({
      ...consumptionsGraphOptions,
      title: {
        text: 'Consumo anual'
      },
      series: [
        {
          type: 'column',
          name: "Todos los años",
          data: averages.consumptions.years
        },
        {
          type: 'line',
          name: 'Media total',
          data: averages.consumptions.total
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

  const handleChangeYearExpense = async event => {
    const response = await axios.get('/api/customer/get-consumption-data');
    const consumptions = response.data;
    const currentSelectedYear = event.target.value;
    const annualAverage = getAverage(consumptions, currentSelectedYear, "total_amount_list");
    setSelectedYear({
      ...selectedYear,
      expense: currentSelectedYear
    });
    setExpenseGraphOptions({
      ...expenseGraphOptions,
      series: [
        {
          type: 'column',
          name: 'Año ' + currentSelectedYear,
          data: consumptions[currentSelectedYear]["total_amount_list"]
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

  const handleChangeYearConsumptions = async event => {
    const response = await axios.get('/api/customer/get-consumption-data');
    const consumptions = response.data;
    const currentSelectedYear = event.target.value;
    const annualAverage = getAverage(consumptions, currentSelectedYear, "consumed_energy_amount_list");
    setSelectedYear({
      ...selectedYear,
      consumptions: currentSelectedYear
    })
    setConsumptionsGraphOptions({
      ...consumptionsGraphOptions,
      series: [
        {
          type: 'column',
          name: 'Año ' + currentSelectedYear,
          data: consumptions[currentSelectedYear]["consumed_energy_amount_list"]
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
      const expenseAnnualAverage = getAverage(consumptions, maxYear, "total_amount_list");
      const consumptionsAnnualAverage = getAverage(consumptions, maxYear, "consumed_energy_amount_list");
      setExpenseGraphOptions({
        ...expenseGraphOptions,
        title: {
          text: 'Gasto mensual'
        },
        series: [
          {
            type: 'column',
            name: 'Año ' + maxYear,
            data: consumptions[maxYear]["total_amount_list"],
            color: "#8eb7ff",
          },
          {
            type: 'line',
            name: 'Media anual',
            data: expenseAnnualAverage,
            color: "#000000",
          }
        ],
        xAxis: {
          title: {
            text: 'Mes'
          },
          categories: months
        }
      });
      setConsumptionsGraphOptions({
        ...consumptionsGraphOptions,
        title: {
          text: 'Consumo mensual'
        },
        series: [
          {
            type: 'column',
            name: 'Año ' + maxYear,
            data: consumptions[maxYear]["total_amount_list"],
            color: "#9aff8e",
          },
          {
            type: 'line',
            name: 'Media anual',
            data: consumptionsAnnualAverage,
            color: "#000000",
          }
        ],
        xAxis: {
          title: {
            text: 'Mes'
          },
          categories: months
        }
      });
      const expenseYearsAverage = [];
      const consumptionsYearsAverage = [];
      let dataFiltered = [];
      for (let year in consumptions) {
        dataFiltered = consumptions[year]["total_amount_list"].filter(element => element !== 0);
        expenseYearsAverage.push(Math.round((dataFiltered.reduce((a, b) => a + b, 0) / dataFiltered.length) * 100) / 100);
        dataFiltered = consumptions[year]["consumed_energy_amount_list"].filter(element => element !== 0);
        consumptionsYearsAverage.push(Math.round((dataFiltered.reduce((a, b) => a + b, 0) / dataFiltered.length) * 100) / 100);
      }
      const totalExpenseYearsAverage = Math.round((expenseYearsAverage.reduce((a, b) => a + b, 0) / expenseYearsAverage.length) * 100) / 100;
      const totalConsumptionsYearsAverage = Math.round((consumptionsYearsAverage.reduce((a, b) => a + b, 0) / consumptionsYearsAverage.length) * 100) / 100;
      setAverages({
        ...averages,
        expense: {
          years: expenseYearsAverage,
          total: new Array(yearsList.length).fill(totalExpenseYearsAverage)
        },
        consumptions: {
          years: consumptionsYearsAverage,
          total: new Array(yearsList.length).fill(totalConsumptionsYearsAverage)
        }
      });
      setSelectedYear({
        expense: maxYear,
        consumptions: maxYear
      })
      setYears(yearsList);
    }
    setLoading(false);
  }

  useEffect(() => {
    getConsumptions();
  }, []);

  const getAverage = (consumptions, year, type) => {
    const data = consumptions[year][type].filter(element => element !== 0);
    const average = Math.round((data.reduce((a, b) => a + b, 0) / data.length) * 100) / 100;
    return new Array(12).fill(average);
  }

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
                      variant={switchButtonsState.expense.monthlyButtonVariant}
                      color={switchButtonsState.expense.monthlyButtonColor}
                      onClick={handleMonthlyExpenseGraph}
                    >
                      Mensual
                  </Button>
                    <Button
                      variant={switchButtonsState.expense.annualButtonVariant}
                      color={switchButtonsState.expense.annualButtonColor}
                      onClick={handleAnnualExpenseGraph}
                    >
                      Anual
                  </Button>
                  </ButtonGroup>
                </Box>
                {switchButtonsState.expense.monthlyButtonColor === "primary" ?
                  <TextField
                    id="outlined-select-year"
                    select
                    label="Año"
                    value={selectedYear.expense}
                    onChange={handleChangeYearExpense}
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
              <HighchartsReact
                highcharts={Highcharts}
                options={consumptionsGraphOptions}
              />
              <Box mt={2} display="flex" alignItems="center">
                <Box mr={2}>
                  <ButtonGroup variant="outlined" size="large">
                    <Button
                      variant={switchButtonsState.consumptions.monthlyButtonVariant}
                      color={switchButtonsState.consumptions.monthlyButtonColor}
                      onClick={handleMonthlyConsumptionsGraph}
                    >
                      Mensual
                  </Button>
                    <Button
                      variant={switchButtonsState.consumptions.annualButtonVariant}
                      color={switchButtonsState.consumptions.annualButtonColor}
                      onClick={handleAnnualConsumptionsGraph}
                    >
                      Anual
                  </Button>
                  </ButtonGroup>
                </Box>
                {switchButtonsState.consumptions.monthlyButtonColor === "primary" ?
                  <TextField
                    id="outlined-select-year"
                    select
                    label="Año"
                    value={selectedYear.consumptions}
                    onChange={handleChangeYearConsumptions}
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