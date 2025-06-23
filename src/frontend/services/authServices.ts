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
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) {
        const error = new Error(data.message || 'Login failed') as Error & { response?: { data: unknown } };
        error.response = { data };
        throw error;
    }
    return data;
}

export { register, login };