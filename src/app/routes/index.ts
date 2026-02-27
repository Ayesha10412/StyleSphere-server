import { Router } from 'express'
import app from '../../app'
export const router=Router()
const mmoduleRoutes=[
{
    path:"/",
    route:app
}
]
mmoduleRoutes.forEach((route)=>{
    router.use(route.path,route.route)
})