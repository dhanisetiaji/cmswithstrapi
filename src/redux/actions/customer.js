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





export const delCustomer = (id, token) => {
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
                    url: `${urlAPI}/customers/${id}`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }).then((res) => {
                    toast.success(`Delete customer success!`, {
                        position: "top-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    dispatch(PostData(res.data))
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

export const editCustomer = (form, token) => {
    return (dispatch) => {
        dispatch(GeRequest())
        axios({
            method: "PUT",
            data: {
                "data": {
                    "nameCustomer": form.nameCustomer,
                    "emailCustomer": form.emailCustomer,
                    "phoneCustomer": form.phoneCustomer,
                    "addressCustomer": form.addressCustomer,
                }
            },
            url: `${urlAPI}/customers/${form.id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => {
                if (res.status === 200) {

                    toast.success(`Edit customer success!`, {
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
            .catch((err) => {
                if (err.response.data.error.status === 400) {
                    toast.error('Error, Email already exist!', {
                        position: "top-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else {
                    toast.error('Error, Edit customer failed!', {
                        position: "top-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
                dispatch(GeErr(err.response.data))
            })
    }
}

export const addCustomer = (form, token, image) => {
    return (dispatch) => {
        dispatch(GeRequest())
        axios({
            method: "POST",
            data: {
                "data": {
                    "nameCustomer": form.nameCustomer,
                    "emailCustomer": form.emailCustomer,
                    "phoneCustomer": form.phoneCustomer,
                    "addressCustomer": form.addressCustomer,
                }
            },
            url: `${urlAPI}/customers`,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    toast.success(`Add customer success!`, {
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
            .catch((err) => {
                if (err.response.data.error.status === 400) {
                    toast.error('Error, Email already exist!', {
                        position: "top-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else {
                    toast.error('Error, Add customer failed!', {
                        position: "top-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
                dispatch(GeErr(err.response.data))
            })
    }
}

export const GetCustomer = (data, token) => {
    return (dispatch) => {
        dispatch(GeRequest())
        axios({
            method: "GET",
            url: `${urlAPI}/customers?populate=*&pagination[page]=${data.page}&pagination[pageSize]=${data.pageSize}&sort[createdAt]=desc&filters[nameCustomer][$contains]=${data.search}`,
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