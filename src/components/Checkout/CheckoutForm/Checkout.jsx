import React, { useEffect, useState } from 'react'
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline } from '@material-ui/core'

import useStyles from './styles'

import AddressForm from '../AddressForm'
import PaymentForm from '../PaymentForm'

import { commerce } from '../../../lib/commerce'

import { Link, useNavigate } from 'react-router-dom'

const steps = ['Shipping Address', 'Payment']

const Checkout = ({ cart, onCaptureCheckout, error, order }) => {

    const [activeStep, setActiveStep] = useState(0)
    const [checkoutToken, setcheckoutToken] = useState(null)
    const [shippingData, setShippingData] = useState({})
    const classes = useStyles()
    const navigate = useNavigate()

    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart '})

                setcheckoutToken(token)
            } catch (error) {
               navigate('/') 
            }
        }

        generateToken()
    }, [])

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1) // this way we're not mutating the old state
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)

    const next = (data) => {
        setShippingData(data)

        nextStep()
    }

    const Form = () => !activeStep ? <AddressForm checkoutToken={checkoutToken} next={next} /> : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} backStep={backStep} onCaptureCheckout={onCaptureCheckout} nextStep={nextStep} />

    let Confirmation = () => order.customer ? (
        <>
            <div>
                <Typography variant='h5'>Thanks for your visit at ArtKart, {order.customer.firstname} {order.customer.lastname}</Typography>
                <Divider className={classes.divider} />
                <Typography variant='subtitle2'>Order Ref: {order.customer_reference}</Typography>
                <Typography variant='subtitle1'>Check your email for further details!</Typography>
            </div>
            <br />
            <Button variant='outlined' type='button' component={Link} to='/'>Back to ArtKart</Button>
        </>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    )

    if(error){
        <>
            <Typography variant='h5'>Error: {error}</Typography>
            <br />
            <Button variant='outlined' type='button' component={Link} to='/'>Back to ArtKart</Button>
        </>
    }

    // Render JSX then useEffect

  return (
    <>
        <CssBaseline />           {/* To align form */}
        <div className={classes.toolbar} />
        <main className={classes.layout}>
            <Paper className={classes.paper}>
                <Typography variant='h4' align='center'>Checkout!</Typography>
                <Stepper className={classes.stepper} activeStep={activeStep}>
                    {steps.map((step) => (
                        <Step key={step}>
                            <StepLabel>{step}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
            </Paper>
        </main>
    </>
  )
}

export default Checkout