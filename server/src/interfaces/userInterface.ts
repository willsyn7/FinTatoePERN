

interface createUserInterface {
    id : string,
    email : string,
    password : string,
    first_name : string,
    last_name : string,
    alpha_api_key  : string,
}
interface signInInterface{
    email : string,
    password : string
}



export {createUserInterface, signInInterface} 