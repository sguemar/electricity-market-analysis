from create_companies import create_companies
from create_offers_types import create_offers_types


if __name__ == "__main__":
  print("Creando tipos de oferta...")
  create_offers_types()
  print("Tipos de oferta creados con éxito.")
  print("Creando empresas y ofertas simuladas...")
  create_companies()
  print("Empresas y ofertas simuladas creadas con éxito.")
