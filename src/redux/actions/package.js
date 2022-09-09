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

export const delPackage = (id, token) => {
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
                    url: `${urlAPI}/travels-packages/${id}`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }).then((res) => {
                    toast.success(`Delete package success!`, {
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
                    toast.error(`Erorr, Delete package failed!`, {
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

export const editPackage = (form, token, image) => {
    return (dispatch) => {
        dispatch(GeRequest())
        axios({
            method: "PUT",
            data: {
                "data": {
                    "namePackage": form.namePackage,
                    "descriptionsPackage": form.descriptionPackage,
                    "pricePackage": form.pricePackage
                }
            },
            url: `${urlAPI}/travels-packages/${form.id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    if (image === undefined) {
                        toast.success(`Edit package success!`, {
                            position: "top-left",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        dispatch(PostData(res.data))
                    } else {
                        //del image
                        if (form.imageId === undefined) {
                            image.set('refId', form.id);
                            image.set('ref', 'api::travels-package.travels-package');
                            image.set('field', 'image');
                            axios({
                                method: "POST",
                                data: image,
                                url: `${urlAPI}/upload`,
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                    'Authorization': `Bearer ${token}`
                                }
                            })
                                .then((res) => {
                                    if (res.status === 200) {
                                        toast.success(`Edit package success!`, {
                                            position: "top-left",
                                            autoClose: 5000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                        });
                                    }
                                    dispatch(PostData(res.data))
                                })
                        } else {
                            axios({
                                method: "DELETE",
                                url: `${urlAPI}/upload/files/${form.imageId}`,
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                }
                            }).then((ress) => {
                                image.set('refId', form.id);
                                image.set('ref', 'api::travels-package.travels-package');
                                image.set('field', 'image');
                                axios({
                                    method: "POST",
                                    data: image,
                                    url: `${urlAPI}/upload`,
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                        'Authorization': `Bearer ${token}`
                                    }
                                })
                                    .then((res) => {
                                        if (res.status === 200) {
                                            toast.success(`Edit package success!`, {
                                                position: "top-left",
                                                autoClose: 5000,
                                                hideProgressBar: false,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                                progress: undefined,
                                            });
                                        }
                                        dispatch(PostData(res.data))
                                    })

                            })
                        }
                    }

                }
            })
    }
}

export const addPackage = (form, token, image) => {
    return (dispatch) => {
        dispatch(GeRequest())
        axios({
            method: "POST",
            data: {
                "data": {
                    "namePackage": form.namePackage,
                    "descriptionsPackage": form.descriptionPackage,
                    "pricePackage": form.pricePackage
                }
            },
            url: `${urlAPI}/travels-packages`,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    //link image
                    if (image === undefined) {
                        toast.success(`Add package success!`, {
                            position: "top-left",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        dispatch(PostData(res.data))
                    } else {
                        image.set('refId', res.data.data.id);
                        image.set('ref', 'api::travels-package.travels-package');
                        image.set('field', 'image');
                        axios({
                            method: "POST",
                            data: image,
                            url: `${urlAPI}/upload`,
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'Authorization': `Bearer ${token}`
                            }
                        })
                            .then((res) => {
                                if (res.status === 200) {
                                    toast.success(`Add package success!`, {
                                        position: "top-left",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                    });
                                }
                                dispatch(PostData(res.data))
                            })
                    }
                }
            })
            .catch((err) => {
                if (err.response.data.error.status === 400) {
                    toast.error(`Erorr, Add package failed!`, {
                        position: "top-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
                dispatch(GeErr(err))
            })
    }
}

export const GetPackage = (data, token) => {
    return (dispatch) => {
        dispatch(GeRequest())
        axios({
            method: "GET",
            url: `${urlAPI}/travels-packages?populate=*&pagination[page]=${data.page}&pagination[pageSize]=${data.pageSize}&sort[createdAt]=desc&filters[namePackage][$contains]=${data.search}`,
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