import React from 'react';
import {
	Carousel,
	Card,
	CardDeck
} from 'react-bootstrap';

import {
	CompareArrows,
	Search,
	PriorityHigh,
	People
} from '@material-ui/icons';

import GraphDown from './../../svg/graph-down.svg';
import TextFile from './../../svg/text-file.svg';

import './home.css';


const Home = () =>
	<>
		<Carousel>
			<Carousel.Item>
				<Carousel.Caption className="text-left">
					<h3>AME</h3>
					<p>es una aplicación web que automatiza y resume la información de tus facturas de la luz para una mejor comprensión</p>
				</Carousel.Caption>
			</Carousel.Item>
			<Carousel.Item>
				<Carousel.Caption>
					<h3>Guarda tus facturas</h3>
					<p>Sube tus facturas a la plataforma y podrás consultarlas en cualquier momento</p>
				</Carousel.Caption>
			</Carousel.Item>
			<Carousel.Item>
				<Carousel.Caption className="text-right">
					<h3>Comprende los recibos</h3>
					<p>El sistema analizará tus informes y obtendrás un estudio sencillo de la información que contienen</p>
				</Carousel.Caption>
			</Carousel.Item>
		</Carousel>

		<div className="display-2">Clientes</div>

		<CardDeck className="mx-0">
			<Card data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
				<img src={TextFile} alt="Text file" />
				<Card.Text>
					Gestiona y revisa todas tus facturas registradas
				</Card.Text>
			</Card>
			<Card data-aos="fade-up" data-aos-delay="300" data-aos-duration="1000">
				<img src={GraphDown} alt="Graph down" />
				<Card.Text>
					Observa el análisis de tu consumo a lo largo del tiempo
				</Card.Text>
			</Card>
			<Card data-aos="fade-up" data-aos-delay="400" data-aos-duration="1000">
				<CompareArrows />
				<Card.Text>
					Compara ofertas de diferentes compañías eléctricas
				</Card.Text>
			</Card>
		</CardDeck>

		<Carousel>
			<Carousel.Item>
				<Carousel.Caption className="text-left">
					<h3>AME</h3>
					<p>te ayudará a encontrar nuevos clientes a través de su red de usuarios y empresas</p>
				</Carousel.Caption>
			</Carousel.Item>
			<Carousel.Item>
				<Carousel.Caption>
					<h3>Avisos de clientes</h3>
					<p>La aplicación te alertará en caso de encontrar posibles compradores</p>
				</Carousel.Caption>
			</Carousel.Item>
			<Carousel.Item>
				<Carousel.Caption className="text-right">
					<h3>Crea tus propias ofertas</h3>
					<p>Añade y publica ofertas enviándolas directamente a tus clientes.</p>
				</Carousel.Caption>
			</Carousel.Item>
		</Carousel>

		<div className="display-2">Empresas</div>

		<CardDeck className="mx-0">
			<Card data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
				<Search />
				<Card.Text>
					Realiza un análisis del mercado
				</Card.Text>
			</Card>
			<Card data-aos="fade-up" data-aos-delay="300" data-aos-duration="1000">
				<PriorityHigh />
				<Card.Text>
					Obtén avisos de clientes potenciales
				</Card.Text>
			</Card>
			<Card data-aos="fade-up" data-aos-delay="400" data-aos-duration="1000">
				<People />
				<Card.Text>
					Capta nuevos clientes enviando tus ofertas
				</Card.Text>
			</Card>
		</CardDeck>
	</>

export default Home;