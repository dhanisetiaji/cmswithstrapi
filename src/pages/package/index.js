import React, { useEffect, useState } from 'react'
import './package.scss'
import Navbar from '../components/Navbar'
import { RiSearch2Line } from 'react-icons/ri'
import { FiEdit } from 'react-icons/fi'
import { AiOutlineDelete } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { addPackage, delPackage, editPackage, GetPackage } from '../../redux/actions/package'
import { Link, useSearchParams } from "react-router-dom"
import MetaTags from '../components/Metatags'

const URL = process.env.REACT_APP_URL

const IndexPackage = () => {
    const dispatch = useDispatch()
    const [query, setQuery] = useSearchParams()

    const [params, setParams] = useState({
        search: query.get('search') ?? '',
        pageSize: 5,
        page: query.get('page') ?? 1,
    })
    const [formData, setFormData] = useState({
        namePackage: '',
        pricePackage: '',
        descriptionPackage: '',
    })
    // [refetch, setRefetch] = useState(false)

    const { GetData, loading, PostData } = useSelector((s) => s.package)
    const { GetAuth } = useSelector((s) => s.auth)
    // console.log(GetData.data[0].attributes.image.data.attributes.url, 'asdsa');
    // console.log(URL)

    useEffect(() => {
        dispatch(GetPackage(params, GetAuth.jwt))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, params, PostData])

    let totalPage = Array(GetData.meta.pagination.pageCount).fill() ?? []

    const addHandler = async () => {
        document.getElementById('modal-title').innerHTML = 'Add Travel Package'
        setFormData({
            namePackage: '',
            pricePackage: '',
            descriptionPackage: '',
        })
    }

    const editHandler = async (item) => {
        document.getElementById('modal-title').innerHTML = 'Edit Travel Package'
        setFormData({
            id: item.id,
            namePackage: item.attributes.namePackage,
            pricePackage: item.attributes.pricePackage,
            descriptionPackage: item.attributes.descriptionsPackage,
            imageId: item.attributes.image.data?.id,
        })
    }

    const bodyFormData = new FormData()
    bodyFormData.set('files', formData.image)

    const movieHandler = async (e) => {
        e.preventDefault()
        try {
            if (!formData.id) {
                // console.log(formData.image, 'type');
                if (formData.image === undefined) {
                    dispatch(addPackage(formData, GetAuth.jwt, formData.image))
                }
                if (formData.image.type.split('/')[0] === 'image') {
                    dispatch(addPackage(formData, GetAuth.jwt, bodyFormData))
                } else {
                    alert('Please upload image file')
                }
            }
            else {
                if (formData.image === undefined) {
                    dispatch(editPackage(formData, GetAuth.jwt, formData.image))
                }
                if (formData.image.type.split('/')[0] === 'image') {
                    dispatch(editPackage(formData, GetAuth.jwt, bodyFormData))
                    // console.log(formData.imageId, 'type');
                } else {
                    alert('Please upload image file')
                }

            }
        }
        catch (error) {
            // console.log(error.response)
        }
    }

    const deleteHandler = async (id) => {
        dispatch(delPackage(id, GetAuth.jwt))
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
        <MetaTags title={'Package'} />
        <div className="container">
            <Navbar />
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="main-content shadow">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body d-flex justify-content-between">
                                        <h3 className='fw-bold p-auto'>Travels Package</h3>
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
                                                        <th scope='col'>Price</th>
                                                        <th scope='col'>Image</th>
                                                        <th scope='col'>Description</th>
                                                        <th scope='col'>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {loading ? <tr><td colSpan='6' className='text-center'>Loading...</td></tr> : !GetData.data.length ? <tr><td colSpan='6' className='text-center'>Empty Data</td></tr> : GetData.data.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{item.attributes.namePackage}</td>
                                                                <td>{item.attributes.pricePackage}</td>
                                                                <td>{item.attributes.image?.data ? <img src={`${URL}${item.attributes.image?.data.attributes.url}`} className="img-cover" alt={item.attributes.namePackage} /> : 'No Image'}</td>
                                                                <td>{item.attributes.descriptionsPackage}</td>
                                                                <td>
                                                                    <div className='d-flex'>
                                                                        <button className='btn btn-primary mx-2 px-3 py-2' data-bs-toggle="modal" data-bs-target="#modalmovie" onClick={() => editHandler(item)}><FiEdit className='text-white' /></button>
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
                                <input type="text" className="form-control" id="InputTitle" value={formData.namePackage} onChange={(e) => {
                                    setFormData(prevState => ({ ...prevState, namePackage: e.target.value }))
                                }} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="InputImage" className="form-label">Image</label>
                                <input type="file" className="form-control" id="InputImage" onChange={(e) => {
                                    setFormData(prevState => ({ ...prevState, image: e.target.files[0] }))
                                }} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="InputPrice" className="form-label">Price</label>
                                <input type="number" className="form-control" id="InputPrice" value={formData.pricePackage} onChange={(e) => {
                                    setFormData(prevState => ({ ...prevState, pricePackage: e.target.value }))
                                }} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="InputDescription" className="form-label">Description</label>
                                <textarea rows={10} className="form-control" id="InputDescription" value={formData.descriptionPackage} onChange={(e) => {
                                    setFormData(prevState => ({ ...prevState, descriptionPackage: e.target.value }))
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

export default IndexPackage