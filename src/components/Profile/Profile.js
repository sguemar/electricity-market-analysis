import React, { useEffect, useReducer } from 'react';
import { connect } from 'react-redux';
import {
  Typography,
  Container,
  Avatar,
  makeStyles,
  Grid,
  TextField,
  Button
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Cookies from 'universal-cookie';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.dark,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Profile = ({ type }) => {
  const classes = useStyles();
  const cookies = new Cookies();
  const csrfAccessToken = cookies.get('csrf_access_token');

  const initialUserData = {
    name: '',
    surname: '',
    password: '',
    passwordconfirmation: '',
    email: '',
  };

  const [userData, dispatchUserData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialUserData
  );

  const [formErrorState, dispatchFormErrorState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialUserData
  );

  const handleChange = event => {
    const { name, value } = event.target;
    dispatchUserData({ [name]: value });
  };

  const handleSubmit = async (e) => {
    dispatchFormErrorState(initialUserData);
    e.preventDefault();
    try {
      await axios.put(
        '/api/customer/update-profile',
        userData,
        { headers: { 'X-CSRF-TOKEN': csrfAccessToken } }
      );
    } catch (error) {
      const errors = error.response.data;
      for (const key in errors)
        dispatchFormErrorState({ [key]: errors[key][0] });
    }
  }

  const getProfileData = async () => {
    if (type === 1) {
      const response = await axios.get('/api/customer/get-profile-data');
      dispatchUserData(response.data);
    }
  }

  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <Container maxWidth="sm">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AccountCircleIcon />
        </Avatar>
        <Typography variant="h4" align="center">Mi perfil</Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Nombre"
                name="name"
                value={userData.name || ''}
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
                value={userData.surname || ''}
                onChange={handleChange}
                error={formErrorState.surname ? true : false}
                helperText={formErrorState.surname}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                type="password"
                fullWidth
                id="password"
                label="Contraseña"
                name="password"
                onChange={handleChange}
                error={formErrorState.password ? true : false}
                helperText={formErrorState.password || "Si se deja vacío no se cambiará"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                type="password"
                fullWidth
                id="passwordconfirmation"
                label="Confirme contraseña"
                name="passwordconfirmation"
                onChange={handleChange}
                error={formErrorState.passwordconfirmation ? true : false}
                helperText={formErrorState.passwordconfirmation}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                type="email"
                fullWidth
                id="email"
                label="Email"
                name="email"
                value={userData.email || ''}
                onChange={handleChange}
                error={formErrorState.email ? true : false}
                helperText={formErrorState.email}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSubmit}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

const mapStateToProps = state => {
  const { authentication } = state;
  return authentication.loggedUser;
};

export default connect(mapStateToProps)(Profile);