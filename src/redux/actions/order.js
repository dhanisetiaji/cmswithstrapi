import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";

const urlAPI = process.env.REACT_APP_API_URL;

const GeRequest = () => {
    return {
        type: "GET_REQUEST"
    };
}

const GetData = (data) => {
    return {
        type: "GET_DATA",
        payload: data
    };
};

const PostData = (data) => {
    return {
        type: "POST_DATA",
        payload: data
    };
};

const GeErr = (err) => {
    return {
        type: "GET_ERR",
        payload: err
    };
}
const GetCustomerData = (data) => {
    return {
        type: "GET_CUSTOMER_DATA",
        payload: data
    };
}

const GetPackageData = (data) => {
    return {
        type: "GET_PACKAGE_DATA",
        payload: data
    };
}

const GetOrderDetail = (data) => {
    return {
        type: "GET_ORDER_DETAIL",
        payload: data
    };
}

export const getOrderDetail = (id, token) => {
    return (dispatch) => {
        dispatch(GeRequest())
        axios({
            method: "GET",
            url: `${urlAPI}/order-details?populate=%2A&filters[orderId][0]=${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((res) => {
            dispatch(GetOrderDetail(res.data))
        }).catch((err) => {
            dispatch(GeErr(err))
        })
    }
}

export const getCustomerData = (token) => {
    return (dispatch) => {
        dispatch(GeRequest())
        axios({
            method: "GET",
            url: `${urlAPI}/customers`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((res) => {
            dispatch(GetCustomerData(res.data))
        }).catch((err) => {
            dispatch(GeErr(err))
        })
    }
}

export const getPackageData = (token) => {
    return (dispatch) => {
        dispatch(GeRequest())
        axios({
            method: "GET",
            url: `${urlAPI}/travels-packages`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((res) => {
            dispatch(GetPackageData(res.data))
        }).catch((err) => {
            dispatch(GeErr(err))
        })
    }
}

export const delOrder = (iddetail, id, token) => {
    return (dispatch) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios({
                    method: "DELETE",
                    url: `${urlAPI}/order-details/${iddetail}`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }).then((res) => {
                    if (res.status === 200) {
                        axios({
                            method: "DELETE",
                            url: `${urlAPI}/orders/${id}`,
                            headers: {
                                Authorization: `Bearer ${token}`,
                            }
                        })
                            .then((result) => {
                                toast.success(`Delete customer success!`, {
                                    position: "top-left",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                });
                                dispatch(PostData(result.data))
                            })
                    }
                }).catch((err) => {
                    toast.error(`Erorr, Delete customer failed!`, {
                        position: "top-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                })
            }

        })
    }
}



export const addOrder = (form, token) => {
    return (dispatch) => {
        dispatch(GeRequest())
        axios({
            method: "POST",
            data: {
                "data": {
                    "customerId": form.customerId,
                    "invoiceNumber": form.invoiceNumber,
                    "totalPrice": form.totalPrice,
                }
            },
            url: `${urlAPI}/orders`,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    axios({
                        method: "POST",
                        data: {
                            "data": {
                                "orderId": res.data.data.id,
                                "travelsPackageId": form.travelsPackageId,
                                "price": form.totalPrice,
                            }
                        },
                        url: `${urlAPI}/order-details`,
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then((result) => {
                            if (result.status === 200) {
                                toast.success(`Order success!`, {
                                    position: "top-left",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                });
                                dispatch(PostData(res.data))
                            }
                        })
                }
            })
            .catch((err) => {
                toast.error('Error, Order failed!', {
                    position: "top-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                dispatch(GeErr(err.response.data))
            })
    }
}

export const GetOrder = (data, token) => {
    return (dispatch) => {
        dispatch(GeRequest())
        axios({
            method: "GET",
            url: `${urlAPI}/orders?populate=*&pagination[page]=${data.page}&pagination[pageSize]=${data.pageSize}&sort[createdAt]=desc&filters[invoiceNumber][$contains]=${data.search}`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => {
                dispatch(GetData(res.data))
            })
            .catch((err) => {
                dispatch(GeErr(err.response.data))
            })
    }

}