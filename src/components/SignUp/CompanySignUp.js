import React, { useReducer } from 'react';
import { connect } from 'react-redux';
import {
  Avatar,
  Button,
  TextField,
  Grid,
  makeStyles,
  Typography,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { createNotification } from 'react-redux-notify';
import { successSignUpNotification } from '../../redux/constants/notifications';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const CompanySignUp = ({ createNotification }) => {
  const classes = useStyles();
  const history = useHistory();

  const initialFormState = {
    username: '',
    password: '',
    passwordconfirmation: '',
    name: '',
    cif: '',
    companytype: '0',
    url: '',
    email: '',
    phone: '',
    address: ''
  };

  const [formState, dispatchFormState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialFormState
  );

  const handleChange = event => {
    const { name, value } = event.target;
    dispatchFormState({ [name]: value });
  };

  const [formErrorState, dispatchFormErrorState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialFormState
  );

  async function handleSubmit(e) {
    dispatchFormErrorState(initialFormState);
    e.preventDefault();
    try {
      await axios.post('/api/auth/signup-company', formState);
      createNotification(successSignUpNotification);
      history.push('/login');
    } catch (error) {
      const errors = error.response.data;
      for (const key in errors)
        dispatchFormErrorState({ [key]: errors[key][0] });
    }
  }

  return (
    <Container maxWidth="sm">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h4">
          Empresas
        </Typography>
        <Typography component="h2" variant="h5">
          Crea una cuenta
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="username"
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Nombre de usuario"
                autoFocus
                onChange={handleChange}
                error={formErrorState.username ? true : false}
                helperText={formErrorState.username}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                type="password"
                required
                fullWidth
                id="password"
                label="Contraseña"
                name="password"
                onChange={handleChange}
                error={formErrorState.password ? true : false}
                helperText={formErrorState.password}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                type="password"
                required
                fullWidth
                id="passwordconfirmation"
                label="Confirme contraseña"
                name="passwordconfirmation"
                onChange={handleChange}
                error={formErrorState.passwordconfirmation ? true : false}
                helperText={formErrorState.passwordconfirmation}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Nombre"
                name="name"
                onChange={handleChange}
                error={formErrorState.name ? true : false}
                helperText={formErrorState.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="cif"
                label="CIF"
                name="cif"
                onChange={handleChange}
                error={formErrorState.cif ? true : false}
                helperText={formErrorState.cif}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" className={classes.formControl}>
                <InputLabel id="select-company-type-label">Tipo de empresa</InputLabel>
                <Select
                  labelId="select-company-type-label"
                  id="companytype"
                  name="companytype"
                  defaultValue="0"
                  value={formState.companyType}
                  label="Tipo de empresa"
                  onChange={handleChange}
                >
                  <MenuItem selected value="0">Comercializadora</MenuItem>
                  <MenuItem value="1">Distribuidora</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                id="url"
                label="URL"
                name="url"
                onChange={handleChange}
                error={formErrorState.url ? true : false}
                helperText={formErrorState.url}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                type="email"
                fullWidth
                id="email"
                label="Email"
                name="email"
                onChange={handleChange}
                error={formErrorState.email ? true : false}
                helperText={formErrorState.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="phone"
                label="Teléfono"
                name="phone"
                onChange={handleChange}
                error={formErrorState.phone ? true : false}
                helperText={formErrorState.phone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="address"
                label="Dirección"
                name="address"
                onChange={handleChange}
                error={formErrorState.address ? true : false}
                helperText={formErrorState.address}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Regístrate
          </Button>
          <Grid container justify="space-between">
            <Grid item>
              <Link
                to="/signup-customer"
                className="MuiTypography-root
                           MuiLink-root
                           MuiLink-underlineHover 
                           MuiTypography-body2 
                           MuiTypography-colorPrimary">
                ¿Eres un particular? Regístrate
              </Link>
            </Grid>
            <Grid item>
              <Link
                to="/login"
                className="MuiTypography-root
                           MuiLink-root
                           MuiLink-underlineHover 
                           MuiTypography-body2 
                           MuiTypography-colorPrimary">
                ¿Ya tienes una cuenta? Inicia sesión
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

const mapDispatchToProps = dispatch => ({
  createNotification: (config) => {
    dispatch(createNotification(config))
  },
})

export default connect(null, mapDispatchToProps)(CompanySignUp);