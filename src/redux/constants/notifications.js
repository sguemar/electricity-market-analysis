import React from 'react';
import CheckCircleSharpIcon from '@material-ui/icons/CheckCircleSharp';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import { NOTIFICATION_TYPE_SUCCESS, NOTIFICATION_TYPE_ERROR } from 'react-redux-notify';

export const successSignUpNotification = {
  message: '¡Te has registrado correctamente!',
  type: NOTIFICATION_TYPE_SUCCESS,
  duration: 5000,
  canDismiss: true,
  icon: <CheckCircleSharpIcon />,
}

export const successLogInNotification = {
  message: '¡Has iniciado sesión correctamente!',
  type: NOTIFICATION_TYPE_SUCCESS,
  duration: 5000,
  canDismiss: true,
  icon: <CheckCircleSharpIcon />,
}

export const successLogOutNotification = {
  message: '¡Has cerrado sesión correctamente!',
  type: NOTIFICATION_TYPE_SUCCESS,
  duration: 5000,
  canDismiss: true,
  icon: <CheckCircleSharpIcon />,
}

export const succeessAddInvoiceNotification = {
  message: 'La factura se ha guardado correctamente',
  type: NOTIFICATION_TYPE_SUCCESS,
  duration: 5000,
  canDismiss: true,
  icon: <CheckCircleSharpIcon />,
}

export const errorAddInvoiceNotification = (message) =>
  ({
    message: message,
    type: NOTIFICATION_TYPE_ERROR,
    duration: 5000,
    canDismiss: false,
    icon: <ErrorOutlineOutlinedIcon />,
  })

export const successRemoveInvoiceNotification = {
  message: 'La factura se ha eliminado correctamente',
  type: NOTIFICATION_TYPE_SUCCESS,
  duration: 5000,
  canDismiss: false,
  icon: <CheckCircleSharpIcon />,
}

export const errorRemoveInvoiceNotification = {
  message: "Ha ocurrido un error, la factura no se ha eliminado correctamente",
  type: NOTIFICATION_TYPE_ERROR,
  duration: 5000,
  canDismiss: false,
  icon: <ErrorOutlineOutlinedIcon />,
}

export const successChangeInvoiceNotification = {
  message: 'La factura se ha cambiado correctamente',
  type: NOTIFICATION_TYPE_SUCCESS,
  duration: 5000,
  canDismiss: false,
  icon: <CheckCircleSharpIcon />,
}

export const errorChangeInvoiceNotification = {
  message: "Ha ocurrido un error, la factura no se ha cambiado correctamente",
  type: NOTIFICATION_TYPE_ERROR,
  duration: 5000,
  canDismiss: false,
  icon: <ErrorOutlineOutlinedIcon />,
}

export const successSaveProfileNotification = {
  message: 'Los datos de tu perfil se han guardado correctamente',
  type: NOTIFICATION_TYPE_SUCCESS,
  duration: 5000,
  canDismiss: true,
  icon: <CheckCircleSharpIcon />,
}

export const successDeleteAccountNotification = {
  message: 'Tu cuenta se ha borrado correctamente',
  type: NOTIFICATION_TYPE_SUCCESS,
  duration: 5000,
  canDismiss: true,
  icon: <CheckCircleSharpIcon />,
}

export const successCreateOfferNotification = {
  message: 'La oferta se ha guardado correctamente',
  type: NOTIFICATION_TYPE_SUCCESS,
  duration: 5000,
  canDismiss: true,
  icon: <CheckCircleSharpIcon />,
}

export const successEditOfferNotification = {
  message: 'La oferta se ha modificado correctamente',
  type: NOTIFICATION_TYPE_SUCCESS,
  duration: 5000,
  canDismiss: true,
  icon: <CheckCircleSharpIcon />,
}

export const successRemoveOfferNotification = {
  message: 'La oferta se ha eliminado correctamente',
  type: NOTIFICATION_TYPE_SUCCESS,
  duration: 5000,
  canDismiss: true,
  icon: <CheckCircleSharpIcon />,
}

export const errorRemoveOfferNotification = {
  message: "Ha ocurrido un error, la oferta no se ha eliminado correctamente",
  type: NOTIFICATION_TYPE_ERROR,
  duration: 5000,
  canDismiss: false,
  icon: <ErrorOutlineOutlinedIcon />,
}