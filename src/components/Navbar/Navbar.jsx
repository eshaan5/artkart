import React from 'react'
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography } from '@material-ui/core' // Badge is for number of notifications
import { ShoppingCart } from '@material-ui/icons'

import { Link, useLocation } from 'react-router-dom'

import logo from '../../assets/artkart.png'
import useStyles from './styles'

const Navbar = ({ totalItems }) => {

    const classes = useStyles();
    const location = useLocation();

  return (
    <>
      <AppBar position='fixed' className={classes.appBar} color = 'inherit'>
        <Toolbar>
          <Typography component={Link} to='/' variant='h6' className={classes.title} color='inherit'>
            <img src={logo} alt='ArtKart' height='25px' className = {classes.image} />
            ArtKart
          </Typography>
          <div className={classes.grow}></div>  {/* For middle part */}

          {location.pathname === '/' ? (
          <div className={classes.button}>
            <IconButton component={Link} to='/cart' aria-label='Show Cart items' color='inherit'>
              <Badge badgeContent={totalItems} color='secondary'>
                <ShoppingCart />
              </Badge>
            </IconButton>
          </div>) : null
}
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Navbar