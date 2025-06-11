const register = async (email: string, password: string) => {
    const userData = {
        "email": email,
        "password": password
    }
    const response = await fetch("http://localhost:3000/register", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData)
    });
    return response.json();
}

const login = async (email: string, password: string) => {
    const userData = {
        "email": email,
        "password": password
    }
    const response = await fetch("http://localhost:3000/login", {
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData)
    });
    return response.json();
}

export { register, login };