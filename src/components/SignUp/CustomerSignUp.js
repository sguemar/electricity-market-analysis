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

const CustomerSignUp = ({ createNotification }) => {
  const classes = useStyles();
  const history = useHistory();

  const initialFormState = {
    username: '',
    password: '',
    passwordconfirmation: '',
    name: '',
    surname: '',
    nif: '',
    email: ''
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
      await axios.post('/api/auth/signup-customer', formState);
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
          Particulares
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
                id="surname"
                label="Apellidos"
                name="surname"
                onChange={handleChange}
                error={formErrorState.surname ? true : false}
                helperText={formErrorState.surname}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="nif"
                label="NIF"
                name="nif"
                onChange={handleChange}
                error={formErrorState.nif ? true : false}
                helperText={formErrorState.nif}
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
                to="/signup-company"
                className="MuiTypography-root
                           MuiLink-root
                           MuiLink-underlineHover 
                           MuiTypography-body2 
                           MuiTypography-colorPrimary">
                ¿Eres una empresa? Regístrate
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

export default connect(null, mapDispatchToProps)(CustomerSignUp);