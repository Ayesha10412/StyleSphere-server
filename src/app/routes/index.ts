import { Router } from 'express'
import { userRoutes } from './user.routes'
import { authRoutes } from './auth.routes'
export const router=Router()
const moduleRoutes=[
{
    path:"/user",
    route:userRoutes
},
{
    path:"/auth",
    route:authRoutes
}
]
moduleRoutes.forEach((route)=>{
    router.use(route.path,route.route)
})