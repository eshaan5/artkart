import React, { useState, useEffect } from 'react'    // useEffect - to fetch the products immidiately when application loads
import Products from './components/Products/Products'
import Navbar from './components/Navbar/Navbar'

import { commerce } from './lib/commerce'
import Cart from './components/Cart/Cart'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Checkout from './components/Checkout/CheckoutForm/Checkout'

// import { Navbar, Products } from './components'   // we can do this coz of index file in components

const App = () => {

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({})
  const [order, setOrder] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const [search, setSearch] = useState('')

  const fetchProducts = async () => {
    const { data } = await commerce.products.list()

    setProducts(data);
  }

  const fetchCart = async () => {
    setCart(await commerce.cart.retrieve())
  }

  const onSearch = (e) => {
    setSearch(e.target.value)
}

const filtered = products.filter((product) => {
  return product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase())
})


  const addToCart = async (productId, quantity) => {
    const response = await commerce.cart.add(productId, quantity)

    setCart(response.cart)
  }

  const updateQty = async (productId, quantity) => {
    const response = await commerce.cart.update(productId, { quantity })

    setCart(response.cart)
  }

  const deleteFromCart = async (productId) => {
    const resposne = await commerce.cart.remove(productId)

    setCart(resposne.cart)
  }

  const emptyCart = async () => {
    const response = await commerce.cart.empty()

    setCart(response.cart)
  }

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh()

    setCart(newCart)
  }

  const captureCheckout = async (checkoutTokenId, newOrder) => {
    try {
      const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder)

      setOrder(incomingOrder)
      console.log(incomingOrder)
      refreshCart()
    } catch (error) {
      setErrorMessage(error.data.error.message)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCart()
  }, [])

  return (
    <Router basename={process.env.PUBLIC_URL}>
    <div>
      <Navbar totalItems={cart.total_items} onSearch={onSearch} search={search} />
      <Routes>

        <Route exact path='/' element={<Products products = {filtered} addToCart = {addToCart} />} />

        <Route exact path='/cart' element={
        <Cart
        cart={cart}
        updateQty={updateQty}
        deleteFromCart={deleteFromCart}
        emptyCart={emptyCart} />} />

        <Route exact path='/checkout' element={<Checkout
        cart={cart} 
        order={order}
        onCaptureCheckout={captureCheckout}
        error={errorMessage}
        />} />

      </Routes>
      </div>
      </Router>
  )
}

export default App