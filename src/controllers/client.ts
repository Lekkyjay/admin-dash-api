import { Request, Response } from 'express'
import Product from '../models/Product'
import ProductStat from '../models/ProductStat'
import User from '../models/User'
import Transaction from '../models/Transaction'
import { countryToAlpha2, countryToAlpha3 } from 'country-to-iso'
// import getCountryIso3 from 'country-iso-2-to-3'  

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find()

    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({ productId: product._id })
        return {
          ...product._doc,
          stat,
        }
      })
    )

    res.status(200).json(productsWithStats)
  } catch (error: any) {
    res.status(404).json({ message: error.message })
  }
}

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await User.find({ role: 'user' }).select('-password')
    res.status(200).json(customers)
  } catch (error: any) {
    res.status(404).json({ message: error.message })
  }
}

export const getTransactions = async (req: Request, res: Response) => {
  try {
    // sort should look like this: { 'field': 'userId', 'sort': 'desc'}
    const { page = 1, pageSize = 20, sort = null, search = '' } = req.query

    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort as string)
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = 'asc' ? 1 : -1),
      }

      return sortFormatted
    }
    const sortFormatted = Boolean(sort) ? generateSort() : {}

    const transactions = await Transaction.find({
      $or: [
        { cost: { $regex: new RegExp(search as string, 'i') } },
        { userId: { $regex: new RegExp(search as string, 'i') } },
      ],
    })
      // .sort(sortFormatted)
      .sort({})
      .skip(Number(page) * Number(pageSize))
      .limit(Number(pageSize))

    const total = await Transaction.countDocuments({
      name: { $regex: search, $options: 'i' },
    })

    res.status(200).json({
      transactions,
      total,
    })
  } catch (error: any) {
    res.status(404).json({ message: error.message })
  }
}

interface ISO3 {
  countryISO3: number
}

export const getGeography = async (req: Request, res: Response) => {
  try {
    const users = await User.find()

    const mappedLocations = users.reduce((acc, { country }) => {
      // const countryISO3 = getCountryIso3(country)
      const countryISO3 = countryToAlpha2(country as string)
      if (!acc[countryISO3 as keyof ISO3]) {
        acc[countryISO3 as keyof ISO3] = 0
      }
      acc[countryISO3 as keyof ISO3]++
      return acc
    }, {} as ISO3)

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count }
      }
    )

    res.status(200).json(formattedLocations)
  } catch (error: any) {
    res.status(404).json({ message: error.message })
  }
}
