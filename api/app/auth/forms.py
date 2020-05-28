from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField, BooleanField, HiddenField, SelectField, IntegerField
from wtforms.validators import DataRequired, Email, EqualTo, Optional, Length, NumberRange


class CustomerSignUpForm(FlaskForm):

    form_type = HiddenField()
    
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
            DataRequired(message="Debes introducir tu NIF"),
            Length(min=9, max=9, message="Debes introducir un NIF válido")
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


class CompanySignUpForm(FlaskForm):

    form_type = HiddenField()

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

    cif = StringField(
        "CIF",
        validators=[
            DataRequired(message="Debes introducir tu CIF"),
            Length(min=9, max=9, message="Debes introducir un CIF válido")
        ],
        render_kw={"placeholder": "CIF"}
    )

    name = StringField(
        "Nombre",
        validators=[
            DataRequired(message="Debes introducir tu nombre")
        ],
        render_kw={"placeholder": "Nombre"}
    )

    address = StringField(
        "Dirección",
        validators=[
            DataRequired(message="Debes introducir tu dirección")
        ],
        render_kw={"placeholder": "Dirección"}
    )

    url = StringField(
        "URL",
        validators=[Optional()],
        render_kw={"placeholder": "URL"}
    )

    email = StringField(
        "Email",
        validators=[
            Email(message="Debes introducir un email válido"), Optional()
        ],
        render_kw={"placeholder": "Email"}
    )

    company_type = SelectField(
        "Tipo de empresa",
        choices=[
            ("0", "Comercializadora"),
            ("1", "Distribuidora")
        ],
        validators=[
            DataRequired(message="Debes elegir tu tipo de empresa"),
        ],
        render_kw={"placeholder": "Tipo de empresa"}
    )

    phone = IntegerField(
        "Teléfono",
        validators=[
            DataRequired(message="Debes introducir un número de teléfono"),
            NumberRange(min=100000000, max=999999999, message="El teléfono debe contener 9 cifras")
        ],
        render_kw={"placeholder": "Teléfono"}
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
