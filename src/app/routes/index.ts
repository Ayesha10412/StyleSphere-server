import { Router } from 'express'
import { userRoutes } from './user.routes'
import { authRoutes } from './auth.routes'
import { sellerRoutes } from './seller.routes'
export const router=Router()
const moduleRoutes=[
{
    path:"/user",
    route:userRoutes
},
{
    path:"/auth",
    route:authRoutes
},
{
    path:"/seller",
    route:sellerRoutes
}
]
moduleRoutes.forEach((route)=>{
    router.use(route.path,route.route)
})