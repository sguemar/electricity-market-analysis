import React, { useState, useEffect, useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import {
	makeStyles,
	Container,
	Typography,
	Box,
	Card,
	CardContent,
	CardActions,
	Button,
	Grid,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	CircularProgress
} from '@material-ui/core';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { createNotification } from 'react-redux-notify';
import {
  successCreateOfferNotification,
} from '../../redux/constants/notifications';
import { connect } from 'react-redux';


const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
	},
	cardActions: {
		justifyContent: 'center'
	},
  createOfferButton: {
    backgroundColor: '#39b856',
    "&:hover": {
      backgroundColor: '#28a745'
    }
  },
}));

const CreateOffer = ({ createNotification }) => {

	const history = useHistory();
	const classes = useStyles();
	const cookies = new Cookies();
	const csrfAccessToken = cookies.get('csrf_access_token');

	const [loading, setLoading] = useState(false);
	const [offersTypes, setOffersTypes] = useState([]);
	const [offerRateName, setOfferRateName] = useState('Tarifa general');

	const initialOfferData = {
		offerRate: 1,
		fixedTerm: '',
		variableTerm: '',
		tip: '',
		valley: '',
		superValley: '',
		characteristic1: '',
		characteristic2: '',
		characteristic3: '',
	};

	const [offerData, dispatchOfferData] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		initialOfferData
	);

	const [formErrorState, dispatchFormErrorState] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		initialOfferData
	);

	const handleCreateOffer = async () => {
		dispatchFormErrorState(initialOfferData);
		try {
			await axios.post(
				'/api/company/create-offer',
				offerData,
				{ headers: { 'X-CSRF-TOKEN': csrfAccessToken, } },
			);
			createNotification(successCreateOfferNotification);
			history.push('/offers');
		} catch (error) {
			const errors = error.response.data;
			for (const key in errors)
				dispatchFormErrorState({ [key]: errors[key][0] });
		}
	}

	const handleChange = event => {
		const { name, value } = event.target;
		dispatchOfferData({ [name]: value });
		if (name === "offerRate")
			if (value !== '') {
				setOfferRateName(offersTypes[value - 1].name);
			}
			else {
				setOfferRateName("");
			}
	};

	const handleCancelCreateOffer = () => history.push('/offers');

	const getOffersTypes = async () => {
		setLoading(true);
		try {
			const response = await axios.get('/api/company/get-offers-types');
			const offersTypes = response.data;
			setOffersTypes(offersTypes);
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		getOffersTypes();
	}, [])

	return (
		<Container maxWidth="md">
			<Box my={4}>
				<Typography variant="h4" align="center">Nueva oferta</Typography>
			</Box>
			{loading
				?
				<Box display="flex" justifyContent="center">
					<CircularProgress />
				</Box>
				:
				<Card>
					<CardContent>
						<form noValidate>
							<Grid container alignItems="center" spacing={4}>
								<Grid item xs={12} sm={4}>
									<FormControl required fullWidth className={classes.formControl}>
										<InputLabel id="offer-select-rate">Tarifa</InputLabel>
										<Select
											labelId="offer-select-rate"
											id="offer-select-rate"
											value={offerData.offerRate}
											name="offerRate"
											onChange={handleChange}
											label="offer-rate"
										>
											{offersTypes.map(offerType => {
												return (
													<MenuItem key={offerType.id} value={offerType.id}>{offerType.rate}</MenuItem>
												);
											})}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={8}>
									<TextField
										id="rate-name"
										label="Nombre tarifa"
										value={offerRateName}
										disabled
										fullWidth
									/>
								</Grid>
								<Grid
									item
									xs={12}
									sm={
										offerRateName.includes("general") || offerRateName.length === 0 ? 6 :
											offerRateName.includes("discriminación") ? 4 : 3
									}>
									<TextField
										fullWidth
										required
										id="fixed-term"
										name="fixedTerm"
										label="Término potencia"
										onChange={handleChange}
										value={offerData.fixedTerm || ''}
										error={formErrorState.fixedTerm ? true : false}
										helperText={formErrorState.fixedTerm || "€/kW día"}
									/>
								</Grid>
								{offerRateName.includes("general") || offerRateName.length === 0 ?
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											required
											id="variable-term"
											name="variableTerm"
											label="Término energía"
											onChange={handleChange}
											value={offerData.variableTerm || ''}
											error={formErrorState.variableTerm ? true : false}
											helperText={formErrorState.variableTerm || "€/kWh"}
										/>
									</Grid>
									:
									<>
										<Grid item xs={12} sm={
											offerRateName.includes("discriminación") ? 4 : 3
										}>
											<TextField
												fullWidth
												required
												id="tip"
												name="tip"
												label="Punta"
												onChange={handleChange}
												value={offerData.tip || ''}
												error={formErrorState.tip ? true : false}
												helperText={formErrorState.tip || "€/kWh"}
											/>
										</Grid>
										<Grid item xs={12} sm={
											offerRateName.includes("discriminación") ? 4 : 3
										}>
											<TextField
												fullWidth
												required
												id="valley"
												name="valley"
												label="Valle"
												onChange={handleChange}
												value={offerData.valley || ''}
												error={formErrorState.valley ? true : false}
												helperText={formErrorState.valley || "€/kWh"}
											/>
										</Grid>
										{offerRateName.includes("supervalle") &&
											<Grid item xs={12} sm={3}>
												<TextField
													fullWidth
													required
													id="super-valley"
													name="superValley"
													label="Super valle"
													onChange={handleChange}
													value={offerData.superValley || ''}
													error={formErrorState.superValley ? true : false}
													helperText={formErrorState.superValley || "€/kWh"}
												/>
											</Grid>
										}
									</>
								}
								<Grid item xs={12}>
									<TextField
										id="characteristic-1"
										label="Característica 1"
										name="characteristic1"
										onChange={handleChange}
										value={offerData.characteristic1}
										fullWidth
										error={formErrorState.characteristic1 ? true : false}
										helperText={formErrorState.characteristic1}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										id="characteristic-2"
										label="Característica 2"
										name="characteristic2"
										onChange={handleChange}
										value={offerData.characteristic2}
										fullWidth
										error={formErrorState.characteristic2 ? true : false}
										helperText={formErrorState.characteristic2}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										id="characteristic-3"
										label="Característica 3"
										name="characteristic3"
										onChange={handleChange}
										value={offerData.characteristic3}
										fullWidth
										error={formErrorState.characteristic3 ? true : false}
										helperText={formErrorState.characteristic3}
									/>
								</Grid>
							</Grid>
						</form>
					</CardContent>
					<CardActions className={classes.cardActions}>
						<Button className={classes.createOfferButton} onClick={handleCreateOffer}>Crear oferta</Button>
						<Button size="medium" variant="contained" disableElevation onClick={handleCancelCreateOffer}>Cancelar</Button>
					</CardActions>
				</Card>
			}
		</Container>
	);
}

const mapDispatchToProps = dispatch => ({
	createNotification: (config) => {
		dispatch(createNotification(config))
	}
})

export default connect(
	null,
	mapDispatchToProps
)(CreateOffer);