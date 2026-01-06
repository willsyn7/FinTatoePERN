

interface createUserDTO {
    id : number,
    email : string,
    first_name : string,
    last_name : string,
    alpha_api_key : string,
} 
interface signInDTO {
    email : string,
    password : string
}

export {createUserDTO, signInDTO}