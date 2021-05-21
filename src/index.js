const express = require('express')
require('./db/mongoose')
const productsRoutes = require('./routes/products')
const categoriesRoutes = require('./routes/categories')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(categoriesRoutes)
app.use(productsRoutes)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

