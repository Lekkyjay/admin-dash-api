import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import clientRoutes from './routes/client'
import generalRoutes from './routes/general'
import managementRoutes from './routes/management'
import salesRoutes from './routes/sales'

// data imports
import User from './models/User'
import Product from './models/Product'
import ProductStat from './models/ProductStat'
import Transaction from './models/Transaction'
import OverallStat from './models/OverallStat'
import AffiliateStat from './models/AffiliateStat'
import { 
  dataUser,
  dataProduct,
  dataProductStat,
  dataTransaction,
  dataOverallStat,
  dataAffiliateStat,
} from './data/index'

/* CONFIGURATION */
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

/* ROUTES */
app.use('/client', clientRoutes)
app.use('/general', generalRoutes)
app.use('/management', managementRoutes)
app.use('/sales', salesRoutes)

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000

mongoose.set('strictQuery', false)
mongoose
  .connect(process.env.MONGODB_URL as string)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server listening on Port: ${PORT}`))

    /* ONLY ADD DATA ONE TIME */
    // AffiliateStat.insertMany(dataAffiliateStat)
    // OverallStat.insertMany(dataOverallStat)
    // Product.insertMany(dataProduct)
    // ProductStat.insertMany(dataProductStat)
    // Transaction.insertMany(dataTransaction)
    // User.insertMany(dataUser)
  })
  .catch((error) => console.log(`${error} did not connect`))
