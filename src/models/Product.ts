import mongoose, { Model } from 'mongoose'

interface DocumentResult<T> {
  _doc: T;
}


interface IProduct extends DocumentResult<IProduct> {
  name: string
  price: number
  description: string
  category: string
  rating: number
  supply: number
}

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String,
    category: String,
    rating: Number,
    supply: Number,
  },
  { timestamps: true }
)

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', ProductSchema)
export default Product
