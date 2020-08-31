from marshmallow import Schema, fields, validate, validates_schema, ValidationError


class UserSchema(Schema):
	username = fields.Str(
		required=True,
		error_messages={"required": "Introduce un nombre de usuario"},
		validate=[
			validate.Length(
				max=255,
				error="Nombre de usuario no disponible"
			)
		]
	)
	password = fields.Str(
		required=True,
		error_messages={"required": "Introduce una contraseña"},
		validate=[
			validate.Length(
				min=8,
				error="La contraseña debe tener al menos {min} caracteres"
			),
			validate.Length(
				max=255,
				error="Contraseña demasiado larga"
			)
		]
	)

	passwordconfirmation = fields.Str(
		required=True,
		error_messages={"required": "Repite la contraseña"},
	)

	@validates_schema
	def validate_passwords(self, data, **kwargs):
		if data["password"] != data["passwordconfirmation"]:
			raise ValidationError("Las contraseñas no coinciden", "passwordconfirmation")


class ProfileUserSchema(Schema):
	password = fields.Str(
		required=True,
		error_messages={"required": "Introduce una contraseña"},
		validate=[
			validate.Length(
				min=8,
				error="La contraseña debe tener al menos {min} caracteres"
			),
			validate.Length(
				max=255,
				error="Contraseña demasiado larga"
			)
		]
	)

	passwordconfirmation = fields.Str(
		required=True,
		error_messages={"required": "Repite la contraseña"},
	)