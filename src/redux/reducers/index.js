import { combineReducers } from 'redux'
import Auth from './auth'
import Package from './package'
import Customer from './customer'
import Order from './order'
const rootReducers = combineReducers({
    auth: Auth,
    package: Package,
    customer: Customer,
    order: Order
})
export default rootReducers