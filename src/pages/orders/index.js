import React, { useEffect, useState } from 'react'
import MetaTags from '../components/Metatags'
import Navbar from '../components/Navbar'
import { uid } from 'uid'
import { RiSearch2Line } from 'react-icons/ri'
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useSearchParams } from "react-router-dom"
import './orders.scss'
import { addOrder, GetOrder, getCustomerData, getPackageData, getOrderDetail, delOrder } from '../../redux/actions/order'

const IndexOrders = () => {
    const dispatch = useDispatch()
    const [query, setQuery] = useSearchParams()

    const [params, setParams] = useState({
        search: query.get('search') ?? '',
        pageSize: 5,
        page: query.get('page') ?? 1,
    })
    const [formData, setFormData] = useState({
        invoiceNumber: `INV${uid(10)}`,
        customerId: '',
        totalPrice: '0',
        travelsPackageId: '',
    }), [detail, setDetail] = useState({})



    const { GetAuth } = useSelector(state => state.auth)
    const { DataCustomer, DataPackage, GetData, PostData, loading, DataDetail } = useSelector(state => state.order)

    useEffect(() => {
        dispatch(getCustomerData(GetAuth.jwt))
        dispatch(getPackageData(GetAuth.jwt))
        dispatch(GetOrder(params, GetAuth.jwt))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, params, PostData])

    let totalPage = Array(GetData.meta.pagination.pageCount).fill() ?? []

    const handlePackage = async (e) => {
        e.preventDefault()
        const value = e.target.value
        const findPackage = await DataPackage.data.find((item) => item.id === parseInt(value))
        setFormData(prevData => ({
            ...prevData,
            travelsPackageId: value,
            totalPrice: findPackage.attributes.pricePackage
        }))
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        dispatch(addOrder(formData, GetAuth.jwt))
        setTimeout(() => {
            document.getElementById('formAdd').reset()
            setFormData({
                invoiceNumber: `INV${uid(10)}`,
                customerId: '',
                totalPrice: '0',
                travelsPackageId: '',
            })
        }, 1000)
    }

    const deleteHandler = async (id) => {
        dispatch(getOrderDetail(id, GetAuth.jwt))
        const idDetail = DataDetail.data[0]?.id ?? ''
        console.log(idDetail, 'asdasdasdkjaskdj');
        if (idDetail === '') {
            alert('Error, please try again')
        } else {
            dispatch(delOrder(idDetail, id, GetAuth.jwt))
        }
    }

    const detailHandler = async (item) => {
        document.getElementById('modal-title').innerHTML = 'Detail Orders'
        dispatch(getOrderDetail(item.id, GetAuth.jwt))
        setDetail({
            invoiceNumber: item.attributes.invoiceNumber,
            customerId: item.attributes.customerId.data.id,
            totalPrice: item.attributes.totalPrice,
            nameCustomer: item.attributes.customerId.data.attributes.nameCustomer,
            detail: DataDetail.data[0].attributes.travelsPackageId.data.attributes.namePackage,
        })
    }

    const searchHandler = (e) => {
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
        <MetaTags title={'Orders'} />
        <div className="container">
            <Navbar />
            <div className="row justify-content-center ">
                <div className="col-md-10 ">
                    <div className="card my-3 shadow">
                        <div className="card-header">
                            <h3 className="text-black">Orders</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={e => handleAdd(e)} id='formAdd'>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Invoice Number</label>
                                            <input type="text" value={formData.invoiceNumber} className="form-control" disabled />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label>Package</label>
                                            <select className="form-control" onChange={(e) => handlePackage(e)} required>
                                                <option value='' >Select Package</option>
                                                {DataPackage.data.map((item, index) => (
                                                    <option key={index} value={item.id}>{item.attributes.namePackage}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Customer</label>
                                            <select className="form-control" onChange={(e) => setFormData(prevData => ({ ...prevData, customerId: e.target.value }))} required>
                                                <option value='' >Select Customer</option>
                                                {DataCustomer.data.map((item, index) => (
                                                    <option key={index} value={item.id}>{item.attributes.nameCustomer}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label>Price</label>
                                            <input type="number" className="form-control" value={formData.totalPrice} disable />
                                        </div>
                                        <div className="text-end mr-3">
                                            {loading ? <button className="btn btn-primary text-white" disabled>Wait ...</button> : <button className="btn btn-primary text-white">Order</button>}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-10">
                    <div className="main-content shadow">
                        <div className="card">
                            <div className="card-body">
                                <div className="search-box">
                                    <button className="btn-search"><RiSearch2Line /></button>
                                    <input type="text" className="input-search" onChange={(e) => searchHandler(e)} placeholder="Search By Invoice..." />
                                </div>
                                <div className="table-responsive">
                                    <table className='table table-striped table-hover'>
                                        <thead>
                                            <tr>
                                                <th scope='col'>No Invoice</th>
                                                <th scope='col'>Name Customer</th>
                                                <th scope='col'>Price</th>
                                                <th scope='col'>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? <tr><td colSpan='6' className='text-center'>Loading...</td></tr> : !GetData.data.length ? <tr><td colSpan='6' className='text-center'>Empty Data</td></tr> : GetData.data.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.attributes.invoiceNumber}</td>
                                                        <td>{item.attributes.customerId?.data.attributes.nameCustomer}</td>
                                                        <td>{item.attributes.totalPrice}</td>
                                                        <td>
                                                            <div className='d-flex'>
                                                                <button className='btn btn-success mx-2' data-bs-toggle="modal" data-bs-target="#modaldetail" onClick={() => detailHandler(item)}><AiOutlineEye className='text-white' /></button>
                                                                <button className='btn btn-danger' onClick={() => deleteHandler(item.id)}><AiOutlineDelete /></button>
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
        <div className="modal fade" id="modaldetail" tabIndex="-1" aria-labelledby="modaldetail" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modal-title">Modal title</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="InputTitle" className="form-label">Invoice Number</label>
                                <input type="text" className="form-control" id="InputTitle" value={detail.invoiceNumber} disabled />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="InputTitle" className="form-label">Name Customer</label>
                                <input type="text" className="form-control" id="InputTitle" value={detail.nameCustomer} disabled />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="InputTitle" className="form-label">Name Package</label>
                                <input type="text" className="form-control" id="InputTitle" value={detail.detail} disabled />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="InputTitle" className="form-label">Total Price</label>
                                <input type="text" className="form-control" id="InputTitle" value={detail.totalPrice} disabled />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </>)
}

export default IndexOrders