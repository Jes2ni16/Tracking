


const logout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userId')
        window.location.href = '/login';
}

export default logout;