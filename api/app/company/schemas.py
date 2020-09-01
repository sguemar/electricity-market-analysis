from marshmallow import Schema, fields, validate


class CompanySchema(Schema):
	name = fields.Str(
		required=True,
		error_messages={"required": "Introduce el nombre de la empresa"},
		validate=[
			validate.Length(
				max=255,
				error="Campo demasiado largo"
			)
		]
	)
	cif = fields.Str(
		required=True,
		error_messages={"required": "Introduce el cif de la empresa"},
		validate=[
      validate.Regexp(
        r"^[a-zA-Z]\d{8}$",
				error="Introduce un cif válido"
			)
		]
	)
	url = fields.Str(
		validate=[
			validate.Length(
				max=255,
				error="Campo demasiado largo"
			)
		]
  )
	email = fields.Email(error_messages={"invalid": "Introduce un email válido"})
	phone = fields.Str(
    required=True,
		error_messages={"required": "Introduce el teléfono de la empresa"},
		validate=[
      validate.Regexp(
        r"^\d{9}$",
				error="Introduce un teléfono válido"
			)
		]
  )


class ProfileCompanySchema(Schema):
	name = fields.Str(
		required=True,
		error_messages={"required": "Introduce el nombre de la empresa"},
		validate=[
			validate.Length(
				max=255,
				error="Campo demasiado largo"
			)
		]
	)
	url = fields.Str(
		validate=[
			validate.Length(
				max=255,
				error="Campo demasiado largo"
			)
		]
  )
	email = fields.Email(error_messages={"invalid": "Introduce un email válido"})
	phone = fields.Str(
    required=True,
		error_messages={"required": "Introduce el teléfono de la empresa"},
		validate=[
      validate.Regexp(
        r"^\d{9}$",
				error="Introduce un teléfono válido"
			)
		]
  )
	address = fields.Str(
    required=True,
		error_messages={"required": "Introduce la dirección de la empresa"},
		validate=[
			validate.Length(
				max=255,
				error="Campo demasiado largo"
			)
		]
  )


class GeneralOfferSchema(Schema):
	fixedTerm = fields.Float(
		required=True,
		error_messages={
			"required": "Debes introducir un valor numérico",
			"invalid": "Debes introducir un valor numérico"
		},
	)
	variableTerm = fields.Float(
		required=True,
		error_messages={
			"required": "Debes introducir un valor numérico",
			"invalid": "Debes introducir un valor numérico"
		},
	)


class HourlyOfferSchema(Schema):
	fixedTerm = fields.Float(
		required=True,
		error_messages={
			"required": "Debes introducir un valor numérico",
			"invalid": "Debes introducir un valor numérico"
		},
	)
	tip = fields.Float(
		required=True,
		error_messages={
			"required": "Debes introducir un valor numérico",
			"invalid": "Debes introducir un valor numérico"
		},
	)
	valley = fields.Float(
		required=True,
		error_messages={
			"required": "Debes introducir un valor numérico",
			"invalid": "Debes introducir un valor numérico"
		},
	)


class SuperValleyOfferSchema(Schema):
	fixedTerm = fields.Float(
		required=True,
		error_messages={
			"required": "Debes introducir un valor numérico",
			"invalid": "Debes introducir un valor numérico"
		},
	)
	tip = fields.Float(
		required=True,
		error_messages={
			"required": "Debes introducir un valor numérico",
			"invalid": "Debes introducir un valor numérico"
		},
	)
	valley = fields.Float(
		required=True,
		error_messages={
			"required": "Debes introducir un valor numérico",
			"invalid": "Debes introducir un valor numérico"
		},
	)
	superValley = fields.Float(
		required=True,
		error_messages={
			"required": "Debes introducir un valor numérico",
			"invalid": "Debes introducir un valor numérico"
		},
	)


class OfferFeaturesSchema(Schema):
	characteristic1 = fields.Str(
		validate=[
			validate.Length(
				max=255,
				error="Campo demasiado largo"
			)
		]
	)
	characteristic2 = fields.Str(
		validate=[
			validate.Length(
				max=255,
				error="Campo demasiado largo"
			)
		]
	)
	characteristic3 = fields.Str(
		validate=[
			validate.Length(
				max=255,
				error="Campo demasiado largo"
			)
		]
	)