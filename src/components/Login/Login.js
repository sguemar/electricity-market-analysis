import React, { useState, useReducer } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Avatar,
  Button,
  TextField,
  Box,
  Grid,
  Typography,
  makeStyles,
  Container
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import axios from 'axios';
import { login } from '../../redux/actions/authentication';


const Login = ({ login }) => {

  const initialState = {
    username: '',
    password: '',
  };
  const reducer = (state, newState) => ({ ...state, ...newState })
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = event => {
    const { name, value } = event.target;
    dispatch({ [name]: value });
  };

  const [displayAlert, setDisplayAlert] = useState('none');
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    let data = {
      username: state.username,
      password: state.password
    };
    try {
      await axios.post('/api/auth/login', data);
      let user = { username: state.username };
      login(user);
      history.push('/');
    } catch (error) {
      console.log("error", error);
      setDisplayAlert('block');
    }
  }

  const classes = useStyles();

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Inicia sesión
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Usuario"
            name="username"
            autoFocus
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            onChange={handleChange}
          />
          <Box display={displayAlert}>
            <Alert severity="error">El usuario o la contraseña no son correctos</ Alert>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Inicia sesión
          </Button>
          <Grid container>
            <Grid item>
              <Link 
                to="/signup"
                className="MuiTypography-root
                           MuiLink-root
                           MuiLink-underlineHover 
                           MuiTypography-body2 
                           MuiTypography-colorPrimary">
                ¿Aún no tienes cuenta? Regístrate
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default connect(
  null,
  { login }
)(Login);