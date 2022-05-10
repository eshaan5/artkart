import React from 'react'
import { Typography, Divider, Button } from '@material-ui/core'
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import Review from './Review'

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)        // key

const PaymentForm = ({ shippingData ,checkoutToken, backStep, onCaptureCheckout, nextStep }) => {

  const handleSubmit = async (event, elements, stripe) => {
      event.preventDefault()

      if(!stripe || !elements) return

      const cardElement = elements.getElement(CardElement)

      const { error, paymentMethod } = await stripe.createPaymentMethod({type: 'card', card: cardElement})

      if(error)
      console.log(error)

      else{
        const orderData = {
          line_items: checkoutToken.line_items,
          customer: {firstname: shippingData.firstName, lastname: shippingData.lastName, email: shippingData.email},
          shipping: {name: 'Primary', street: shippingData.address, town_city: shippingData.city, state: shippingData.shippingSubdivision, pin: shippingData.pin, country: shippingData.shippingCountry},
          fulfillment: { shipping_method: shippingData.shippingOption },
          payment: {
        gateway: 'test_gateway',
        card: {
          number: '4242 4242 4242 4242',
          expiry_month: '01',
          expiry_year: '2023',
          cvc: '123',
          postal_zip_code: '94103',
        },
      },
      
        }
        onCaptureCheckout(checkoutToken.id, orderData)

        nextStep()
      }
  }

  return (
    <>
      { checkoutToken && <Review checkoutToken={checkoutToken} />}
      <Divider />
      <Typography variant='h6' gutterBottom style={{margin: '20px 0'}}>Payment Method</Typography>

      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {({ elements, stripe }) => (
              <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
                <CardElement />
                <br /><br />
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <Button variant='outlined' onClick={backStep}>Back</Button>
                  <Button type='submit' variant='contained' disabled={!stripe} color='primary'>Pay {checkoutToken.live.subtotal.formatted_with_symbol}</Button>
                </div>
              </form>
          )}
        </ElementsConsumer>
      </Elements>
    </>
  )
}

export default PaymentForm