import mongoose, { Model } from 'mongoose'

interface IMonthylData {
  month: string,
  totalSales: number,
  totalUnits: number,
}

interface IDailyData {
  date: string,
  totalSales: number,
  totalUnits: number,
}

interface IProductStat {
  _id?: string
  productId: string
  yearlySalesTotal: number
  yearlyTotalSoldUnits: number
  year: number
  monthlyData: IMonthylData[]
  dailyData: IDailyData[]
}


const ProductStatSchema = new mongoose.Schema(
  {
    productId: String,
    yearlySalesTotal: Number,
    yearlyTotalSoldUnits: Number,
    year: Number,
    monthlyData: [
      {
        month: String,
        totalSales: Number,
        totalUnits: Number,
      },
    ],
    dailyData: [
      {
        date: String,
        totalSales: Number,
        totalUnits: Number,
      },
    ],
  },
  { timestamps: true }
)

const ProductStat: Model<IProductStat> = mongoose.model<IProductStat>('ProductStat', ProductStatSchema)
export default ProductStat
