import React from 'react';
import { Typography, Link } from '@material-ui/core'


const Footer = () =>
  <footer>
    <div className="container p-4">
      <hr />
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="/" underline="none">AME</Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </div>
  </footer>


export default Footer;