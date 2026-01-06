

interface createUserInterface {
    id : string,
    email : string,
    password : string,
    first_name : string,
    last_name : string,
    alpha_api_key  : string,
    google_id? : string,
    oauth_provider? : string,
}
interface signInInterface{
    email : string,
    password : string
}



export {createUserInterface, signInInterface} 