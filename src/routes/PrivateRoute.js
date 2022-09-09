import { useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate()
    const { isLogin } = useSelector((s) => s.auth)

    useEffect(() => {
        if (!isLogin) {
            navigate('/auth')
        }
    }, [isLogin]) // eslint-disable-line react-hooks/exhaustive-deps

    return (children)
}

export default PrivateRoute