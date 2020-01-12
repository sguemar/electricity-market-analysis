from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField, BooleanField
from wtforms.validators import DataRequired, Email, EqualTo, Optional


class SignUpForm(FlaskForm):

    username = StringField(
        "Nombre de usuario",
        validators=[
            DataRequired(message="Debes introducir un nombre de usuario")
        ],
        render_kw={"placeholder": "Nombre de usuario"}
    )

    password = PasswordField(
        "Contraseña",
        validators=[
            DataRequired(message="Debes introducir una contraseña")
        ],
        render_kw={"placeholder": "Contraseña"}
    )

    password_confirmation = PasswordField(
        "Confirme la contraseña",
        validators=[
            DataRequired(message="Debes confirmar la contraseña"),
            EqualTo("password", message="Las contraseñas no coinciden")
        ],
        render_kw={"placeholder": "Confirme la contraseña"}
    )

    name = StringField(
        "Nombre",
        validators=[
            DataRequired(message="Debes introducir tu nombre")
        ],
        render_kw={"placeholder": "Nombre"}
    )

    surname = StringField(
        "Apellidos",
        validators=[
            DataRequired(message="Debes introducir tus apellidos")
        ],
        render_kw={"placeholder": "Apellidos"}
    )

    nif = StringField(
        "NIF",
        validators=[
            DataRequired(message="Debes introducir tu NIF")
        ],
        render_kw={"placeholder": "NIF"}
    )

    email = StringField(
        "Email",
        validators=[
            Email(message="Debes introducir un email válido"), Optional()
        ],
        render_kw={"placeholder": "Email"}
    )

    submit = SubmitField("Regístrate")


class LoginForm(FlaskForm):

    username = StringField(
        "Nombre de usuario",
        validators=[
            DataRequired(message="Debes introducir un nombre de usuario")
        ],
        render_kw={"placeholder": "Nombre de usuario"}
    )

    password = PasswordField(
        "Contraseña",
        validators=[DataRequired(
            message="Debes introducir una contraseña")],
        render_kw={"placeholder": "Contraseña"}
    )

    remember_me = BooleanField('Recuérdame')

    submit = SubmitField('Login')
