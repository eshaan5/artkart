import React from "react";
import { Grid, Paper, Typography } from "@material-ui/core";

import Product from "./Product/Product";
import useStyles from './styles'

import styled from 'styled-components'


const Products = ({ products, addToCart }) => {

    const classes = useStyles()

    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />            {/* For space b/w navbar & products */}
            
        <Grid container justify="center" spacing={4}>      {/* similar to justify-content: center */}
            {products.map((product) => {
                return (
                    <Grid item key = {product.id} xs = {12} sm = {6} md = {4} lg = {3}>
                    <Product product = { product } addToCart = {addToCart} />     {/* props */}
                    </Grid>
                )
            })}
        </Grid>
    </main> 
    )
}

export default Products