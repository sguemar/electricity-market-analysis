import React from 'react';
import CheckCircleSharpIcon from '@material-ui/icons/CheckCircleSharp';
import { NOTIFICATION_TYPE_SUCCESS  } from 'react-redux-notify';

export const successSignUpNotification = {
  message: '¡Te has registrado correctamente!',
  type: NOTIFICATION_TYPE_SUCCESS,
  duration: 5000,
  canDismiss: true,
  icon: <CheckCircleSharpIcon />,
}