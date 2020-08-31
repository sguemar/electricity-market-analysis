from flask import jsonify

from . import public_bp
from app.company.models import Company, Offer, OfferType, OfferFeature


@public_bp.route("/get-all-trading-companies")
def get_all_trading_companies():
	companies = __get_all_trading_companies()
	return jsonify(companies)


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