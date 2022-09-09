import React, { useEffect, useState } from 'react'
import MetaTags from '../components/Metatags'
import Navbar from '../components/Navbar'
import './customers.scss'
import { RiSearch2Line } from 'react-icons/ri'
import { FiEdit } from 'react-icons/fi'
import { AiOutlineDelete } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useSearchParams } from "react-router-dom"
import { addCustomer, delCustomer, editCustomer, GetCustomer } from '../../redux/actions/customer'

const IndexCustomers = () => {
    const dispatch = useDispatch()
    const [query, setQuery] = useSearchParams()

    const [params, setParams] = useState({
        search: query.get('search') ?? '',
        pageSize: 5,
        page: query.get('page') ?? 1,
    })
    const [formData, setFormData] = useState({
        nameCustomer: '',
        emailCustomer: '',
        phoneCustomer: '',
        addressCustomer: '',
    })

    const { GetData, loading, PostData } = useSelector((s) => s.customer)
    const { GetAuth } = useSelector((s) => s.auth)

    useEffect(() => {
        dispatch(GetCustomer(params, GetAuth.jwt))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, params, PostData])

    let totalPage = Array(GetData.meta.pagination.pageCount).fill() ?? []

    const addHandler = async () => {
        document.getElementById('modal-title').innerHTML = 'Add Customer'
        setFormData({
            nameCustomer: '',
            emailCustomer: '',
            phoneCustomer: '',
            addressCustomer: '',
        })
    }

    const editHandler = async (item) => {
        document.getElementById('modal-title').innerHTML = 'Edit Customer'
        setFormData({
            id: item.id,
            nameCustomer: item.attributes.nameCustomer,
            emailCustomer: item.attributes.emailCustomer,
            phoneCustomer: item.attributes.phoneCustomer,
            addressCustomer: item.attributes.addressCustomer
        })

    }

    const movieHandler = async (e) => {
        e.preventDefault()
        try {
            if (!formData.id) {
                dispatch(addCustomer(formData, GetAuth.jwt))
            } else {
                dispatch(editCustomer(formData, GetAuth.jwt))
            }
        } catch (error) {

        }
    }

    const deleteHandler = async (id) => {
        dispatch(delCustomer(id, GetAuth.jwt))
    }

    const searchHandler = async (e) => {
        e.preventDefault()
        const search = e.target.value
        setParams(prevData => ({ ...prevData, search: search }))
        query.set('search', search)
        setQuery(query)
    }

    const paginationHandler = async (number) => {
        setParams(prevState => ({ ...prevState, page: number }))
        query.set('page', number)
        setQuery(query)
    }

    return (<>
        <MetaTags title={'Customers'} />
        <div className="container">
            <Navbar />
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="main-content shadow">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body d-flex justify-content-between">
                                        <h3 className='fw-bold p-auto'>Customers</h3>
                                        <button className='btn btn-primary text-white' data-bs-toggle="modal" data-bs-target="#modalmovie" onClick={() => addHandler()}>Add</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="search-box">
                                            <button className="btn-search"><RiSearch2Line /></button>
                                            <input type="text" className="input-search" onChange={(e) => searchHandler(e)} placeholder="Type to Search..." />
                                        </div>
                                        <div className="table-responsive">
                                            <table className='table table-striped table-hover'>
                                                <thead>
                                                    <tr>
                                                        <th scope='col'>Name</th>
                                                        <th scope='col'>Email</th>
                                                        <th scope='col'>Phone</th>
                                                        <th scope='col'>Address</th>
                                                        <th scope='col'>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {loading ? <tr><td colSpan='6' className='text-center'>Loading...</td></tr> : !GetData.data.length ? <tr><td colSpan='6' className='text-center'>Empty Data</td></tr> : GetData.data.map((data, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{data.attributes.nameCustomer}</td>
                                                                <td>{data.attributes.emailCustomer}</td>
                                                                <td>{data.attributes.phoneCustomer}</td>
                                                                <td>{data.attributes.addressCustomer}</td>
                                                                <td>
                                                                    <div className='d-flex'>
                                                                        <button className='btn btn-primary mx-2 px-3 py-2' data-bs-toggle="modal" data-bs-target="#modalmovie" onClick={() => editHandler(data)}><FiEdit className='text-white' /></button>
                                                                        <button className='btn btn-danger' onClick={() => deleteHandler(data.id)}><AiOutlineDelete /></button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                        <nav aria-label="pagination">
                                            <ul className="pagination justify-content-center">
                                                {loading ? (<>
                                                    <li className="page-item disabled">
                                                        <Link className="page-link" to={'/'} tabIndex="-1" aria-disabled="true">Loading...</Link>
                                                    </li>
                                                </>
                                                ) : totalPage.map((item, index) => {
                                                    let number = index + 1
                                                    let page = parseInt(params.page)
                                                    return (
                                                        <li className={page === number ? 'page-item active' : 'page-item'} key={index}>
                                                            <button className="page-link" onClick={() => paginationHandler(number)}>{number}</button>
                                                        </li>
                                                    )
                                                })}

                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="modal fade" id="modalmovie" tabIndex="-1" aria-labelledby="modalmovie" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modal-title">Modal title</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form id='form' encType='multipart/form-data' onSubmit={(e) => movieHandler(e)}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="InputTitle" className="form-label">Name</label>
                                <input type="text" className="form-control" id="InputTitle" value={formData.nameCustomer} onChange={(e) => {
                                    setFormData(prevState => ({ ...prevState, nameCustomer: e.target.value }))
                                }} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="InputTitle" className="form-label">Email</label>
                                <input type="email" className="form-control" id="InputTitle" value={formData.emailCustomer} onChange={(e) => {
                                    setFormData(prevState => ({ ...prevState, emailCustomer: e.target.value }))
                                }} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="InputTitle" className="form-label">Phone</label>
                                <input type="number" className="form-control" id="InputTitle" value={formData.phoneCustomer} onChange={(e) => {
                                    setFormData(prevState => ({ ...prevState, phoneCustomer: e.target.value }))
                                }} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="InputDescription" className="form-label">Address</label>
                                <textarea rows={5} className="form-control" id="InputDescription" value={formData.addressCustomer} onChange={(e) => {
                                    setFormData(prevState => ({ ...prevState, addressCustomer: e.target.value }))
                                }} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary text-white" onClick={(e) => movieHandler(e)} data-bs-dismiss="modal">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>)
}

export default IndexCustomers