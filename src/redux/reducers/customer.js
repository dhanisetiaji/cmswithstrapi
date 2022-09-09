const initialState = {
    loading: false,
    GetData: {
        data: [],
        meta: {
            pagination: {
                pageCount: 0
            }
        }
    },
    GetErr: {},
    PostData: {},
}

const Fetch = (state = initialState, action) => {
    switch (action.type) {
        case "GET_REQUEST":
            return { ...state, loading: true }
        case "GET_ERR":
            return { ...state, loading: false, GetErr: action.payload }
        case "GET_DATA":
            return { ...state, loading: false, GetData: action.payload }
        case "POST_DATA":
            return { ...state, loading: false, PostData: action.payload }
        default:
            return state
    }
}

export default Fetch