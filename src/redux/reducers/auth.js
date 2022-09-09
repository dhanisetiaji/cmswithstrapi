const initialState = {
    loading: false,
    GetAuth: {},
    isLogin: false,
    GetAuthErr: {},
}

const Fetch = (state = initialState, action) => {
    switch (action.type) {
        case "GET_AUTH_REQUEST":
            return { ...state, loading: true }
        case "GET_AUTH_ERR":
            return { ...state, loading: false, isLogin: false, GetAuthErr: action.payload }
        case "GET_AUTH":
            return { ...state, loading: false, isLogin: true, GetAuth: action.payload }
        case 'AUTH_LOGOUT':
            return {
                ...state, loading: false, isLogin: false, GetAuth: { data: { token: null } }
            }
        default:
            return state
    }
}

export default Fetch