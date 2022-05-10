import React from 'react'
import { Container, Button, Typography, Grid } from '@material-ui/core'

import useStyles from './styles'
import CartItem from './CartItem/CartItem'

import { Link } from 'react-router-dom'

const Cart = ({ cart, updateQty, deleteFromCart, emptyCart }) => {

    //console.log(cart)

     const classes = useStyles()

     const EmptyCart = () => (
        <Typography variant='subtitle1'>Your Cart is empty, <Link to='/' className={classes.link}>Let's Start Shopping</Link>!</Typography>
    );

    const FilledCart = () => (
            <>
                 <Grid container spacing={3}>
                     { cart.line_items.map((lineItem) => (
                        <Grid item xs={12} sm={4} key={lineItem.id}>
                         <CartItem item={lineItem} updateQty={updateQty} deleteFromCart={deleteFromCart} />
                         </Grid>
                    ))}
                 </Grid>
                 <div className={classes.cardDetails}>
                     <Typography variant='h4'>
                         Subtotal: {cart.subtotal.formatted_with_symbol}
                     </Typography>
                     <div>
                         <Button className={classes.emptyButton} variant='contained' size='large' type='button' color='secondary' onClick={emptyCart}>Empty Cart</Button>
                         <Button component={Link} to='/checkout' className={classes.checkoutButton} variant='contained' size='large' type='button' color='primary'>Checkout</Button>
                     </div>
                 </div>
             </>
     );

      if(!cart.line_items) return 'Loading...'

   return (
     <Container>
         <div className={classes.toolbar} />
         <Typography className={classes.title} variant='h3' gutterBottom >Welcome to your Cart!</Typography>

         {!cart.line_items.length ? <EmptyCart /> : <FilledCart /> }
     </Container>
   )
}

export default Cart