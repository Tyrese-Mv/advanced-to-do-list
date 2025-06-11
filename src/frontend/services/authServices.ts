const register = (email: string, password: string) =>{
    const userData = {
        "email" :email,
        "password":password
    }
    fetch("http://localhost:3000/register",{
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData)
    }).then((response) => response.json())
    .then((responseData) => {
        console.log("Response:", responseData);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
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