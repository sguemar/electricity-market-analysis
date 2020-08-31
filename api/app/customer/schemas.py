from marshmallow import Schema, fields, validate


class CustomerSchema(Schema):
	name = fields.Str(
		required=True,
		error_messages={"required": "Introduce tu nombre"},
		validate=[
			validate.Length(
				max=255,
				error="Campo demasiado largo"
			)
		]
	)
	surname = fields.Str(
		required=True,
		error_messages={"required": "Introduce tus apellidos"},
		validate=[
			validate.Length(
				max=255,
				error="Campo demasiado largo"
			)
		]
	)
	nif = fields.Str(
		required=True,
		error_messages={"required": "Introduce tu nif"},
		validate=[
			validate.Regexp(
        r"^\d{8}[a-zA-Z]$",
				error="Introduce un nif válido"
			)
		]
  )
	email = fields.Email(error_messages={"invalid": "Introduce un email válido"})


class ProfileCustomerSchema(Schema):
	name = fields.Str(
		required=True,
		error_messages={"required": "Introduce tu nombre"},
		validate=[
			validate.Length(
				max=255,
				error="Campo demasiado largo"
			)
		]
	)
	surname = fields.Str(
		required=True,
		error_messages={"required": "Introduce tus apellidos"},
		validate=[
			validate.Length(
				max=255,
				error="Campo demasiado largo"
			)
		]
	)
	email = fields.Email(error_messages={"invalid": "Introduce un email válido"})