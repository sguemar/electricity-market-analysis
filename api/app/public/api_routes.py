from flask import jsonify

from . import public_bp
from app.company.models import Company, Offer, OfferType, OfferFeature
from .models import	TradingCompanyPrices

regions = {
	"Almería": "es-al",
	"Baleares": "es-pm",
	"Valladolid": "es-va",
	"León": "es-le",
	"Melilla": "es-me",
	"Palencia": "es-p",
	"Cantabria": "es-s",
	"Navarra": "es-na",
	"Ceuta": "es-ce",
	"Cuenca": "es-cu",
	"Álava": "es-vi",
	"Gipuzkoa": "es-ss",
	"Granada": "es-gr",
	"Murcia": "es-mu",
	"Burgos": "es-bu",
	"Salamanca": "es-sa",
	"Zamora": "es-za",
	"Huesca": "es-hu",
	"Madrid": "es-m",
	"Guadalajara": "es-gu",
	"Segovia": "es-sg",
	"Sevilla": "es-se",
	"Tarragona": "es-t",
	"Teruel": "es-te",
	"Valencia": "es-v",
	"Bizkaia": "es-bi",
	"Ourense": "es-or",
	"Lleida": "es-l",
	"Zaragoza": "es-z",
	"Girona": "es-gi",
	"Albacete": "es-ab",
	"Alicante": "es-a",
	"Ávila": "es-av",
	"Cáceres": "es-cc",
	"Toledo": "es-to",
	"Badajoz": "es-ba",
	"Córdoba": "es-co",
	"Huelva": "es-h",
	"A Coruña": "es-c",
	"Málaga": "es-ma",
	"Pontevedra": "es-po",
	"La Rioja": "es-lo",
	"Soria": "es-so",
	"Barcelona": "es-b",
	"Cádiz": "es-ca",
	"Asturias": "es-o",
	"Castellón": "es-cs",
	"Ciudad Real": "es-cr",
	"Jaén": "es-j",
	"Lugo": "es-lu",
	"Santa Cruz de Tenerife": "es-tf",
	"Las Palmas": "es-gc",
}

@public_bp.route("/get-all-trading-companies")
def get_all_trading_companies():
	companies = __get_all_trading_companies()
	return jsonify(companies)


@public_bp.route("/get-all-companies")
def get_all_companies():
	regions_result, companies_result = __get_all_companies()
	return jsonify({
		"regions_result": regions_result,
		"companies_result": companies_result
	})


@public_bp.route("/get-trading-company-offers/<string:cif>")
def get_trading_company_offers(cif):
	result = []
	offers = Offer.get_all_by_cif(cif)
	for offer in offers:
		company = Company.get_by_cif(offer.cif).to_dict()
		result.append({
			"offerInfo": __get_offer_info(offer),
			"companyInfo": company
		})
	return jsonify(result)


@public_bp.route("/get-historical-prices")
def get_historical_prices():
	historical_prices = TradingCompanyPrices.get_all()
	result = {}
	for historical_price in historical_prices:
		company = Company.get_by_cif(historical_price.cif)
		if company.address in result:
			year = historical_price.year
			if year in result[company.address]:
				year_prices = result[company.address][year]
				year_prices.append(historical_price.price)
			else:
				result[company.address][year] = [historical_price.price]
		else:
			result[company.address] = {
				historical_price.year: [historical_price.price]
			}
	for address in result:
		for year in result[address]:
			result[address][year] = round(sum(result[address][year]) / len(result[address][year]), 4)
	return result

def __get_offer_info(offer):
	result = offer.to_dict()
	offer_type = OfferType.get_by_id(offer.offer_type)
	result["rate"] = offer_type.rate
	result["name"] = offer_type.name
	offer_features = OfferFeature.get_all_by_offer_id(offer.id)
	offer_features_text = []
	for offer_feature in offer_features:
		offer_features_text.append(offer_feature.text)
	result["features"] = offer_features_text
	return result

def __get_all_trading_companies():
	result = []
	companies = Company.get_all_trading_companies()
	for company in companies:
		result.append(company.to_dict())
	return result


def __get_all_companies():
	regions_result = []
	_regions = {}
	companies_result = []
	companies = Company.get_all()
	for company in companies:
		companies_result.append(company.to_dict())
		if company.address in _regions:
			_regions[company.address] = _regions[company.address] + 1
		else:
			_regions[company.address] = 1
	for key, value in _regions.items():
		regions_result.append({
			"hc-key": regions[key],
			"value": value
		})
	return regions_result, companies_result