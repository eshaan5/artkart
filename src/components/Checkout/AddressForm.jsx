import React, { useEffect, useState } from 'react'
import { InputLabel, Typography, Grid, Button, MenuItem, Select } from '@material-ui/core'
import { useForm, FormProvider } from 'react-hook-form'
import FormInput from './CustomTextField'

import { commerce } from '../../lib/commerce'
import { Link } from 'react-router-dom'

const AddressForm = ({ checkoutToken, next }) => {

    const [shippingCountries, setShippingCountries] = useState([])
    const [shippingCountry, setShippingCountry] = useState('')

    const [shippingSubdivisions, setShippingSubdivisions] = useState([])
    const [shippingSubdivision, setShippingSubdivision] = useState('')

    const [shippingOptions, setShippingOptions] = useState([])
    const [shippingOption, setShippingOption] = useState('')

    const methods = useForm()

    const countries = Object.entries(shippingCountries).map(([code, name]) => ({id: code, label: name}))
    const subdivisions = Object.entries(shippingSubdivisions).map(([code, name]) => ({id: code, label: name}))
    const options = shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` }))

    const fetchShippingCountries = async (checkoutTokenId) => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId)

        setShippingCountries(countries)
        setShippingCountry(Object.keys(countries)[0])
    }

    const fetchSubdivisions = async (countryCode) => {
        const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode)

        setShippingSubdivisions(subdivisions)
        setShippingSubdivision(Object.keys(subdivisions)[0])
    }

    const fetchShippingOptions = async (checkoutTokenId, country, state = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, state })

        setShippingOptions(options)
        setShippingOption(options[0].id)
    }

    useEffect(() => {
        fetchShippingCountries(checkoutToken.id)
    }, [])

    useEffect(() => {
        if (shippingCountry) fetchSubdivisions(shippingCountry)
    }, [shippingCountry])

    useEffect(() => {
        if(shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision)
    }, [shippingSubdivision])

  return (
    <>
        <Typography variant='h6' gutterBottom>Shipping Address</Typography>
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit((data) => next({...data, shippingCountry, shippingSubdivision, shippingOption}))}>
                <Grid container spacing={3}>
                    <FormInput name='firstName' label='First Name' />
                    <FormInput name='lastName' label='Last Name' />
                    <FormInput name='address' label='Address' />
                    <FormInput name='city' label='City' />
                    <FormInput name='pin' label='Pin Code' />

                    <Grid item xs={12} sm={6}>
                        <InputLabel>Country</InputLabel>
                        <Select fullWidth value={shippingCountry} onChange={(e) => setShippingCountry(e.target.value)}>
                            {countries.map((country) => (
                                 <MenuItem key={country.id} value={country.id}>
                                 {country.label}
                             </MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <InputLabel>State</InputLabel>
                        <Select fullWidth value={shippingSubdivision} onChange={(e) => setShippingSubdivision(e.target.value)}>
                            {subdivisions.map((subdivision) => (
                                <MenuItem key={subdivision.id} value={subdivision.id}>
                                {subdivision.label}
                            </MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <InputLabel>Shipping Options</InputLabel>
                        <Select fullWidth value={shippingOption} onChange={(e) => e.target.value}>
                        {options.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                {option.label}
                            </MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    <FormInput name='email' label='Email' />
                </Grid>
                <br />
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button component={Link} to='/cart' variant='outlined'>Back to Cart</Button>
                    <Button type='submit' variant='contained' color='primary'>Proceed</Button>
                </div>
            </form>
        </FormProvider>
    </>
  )
}

export default AddressForm