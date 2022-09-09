import React, { useEffect, useState } from 'react'
import './style.scss'
import { useDispatch, useSelector } from 'react-redux'
import { GetAuthLogin } from '../../redux/actions/auth'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [formData, setFormData] = useState()

    const { loading, isLogin } = useSelector((s) => s.auth)

    useEffect(() => {
        if (isLogin) {
            navigate('/', { replace: true })
        }
    }, [isLogin]) // eslint-disable-line 

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(GetAuthLogin(formData))
    }

    return (<>
        <div className="container">
            <div className='row justify-content-center heigh100'>
                <div className="col-md-6 align-self-center pb-4">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="text-center">CMS</h3>
                        </div>
                        <div className="card-body shadow py-5">
                            <form onSubmit={e => handleSubmit(e)}>
                                <div className="form-group mb-3">
                                    {/* <label htmlFor="email">Email</label> */}
                                    <input type="email" onChange={(e) => setFormData(prevData => ({ ...prevData, identifier: e.target.value }))} className="form-control" id="email" placeholder="Enter email" required />
                                </div>
                                <div className="form-group mb-3">
                                    {/* <label htmlFor="password">Password</label> */}
                                    <input type="password" onChange={(e) => setFormData(prevData => ({ ...prevData, password: e.target.value }))} className="form-control" id="password" placeholder="Password" required />
                                </div>
                                {!loading ? <button type="submit" className="btn btn-primary w-100">Login</button> : <button type="submit" className="btn btn-primary w-100" disabled>Wait...</button>}
                            </form>
                            <div className="text-center mt-3 mb-0">e:admin@email.com | p:12345678</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

export default Login