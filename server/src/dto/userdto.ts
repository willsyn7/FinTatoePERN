

interface createUserDTO {
    id : number,
    email : string,
    firs_Name : string,
    last_Name : string,
} 
interface signInDTO {
    email : string,
    password : string
}

export {createUserDTO, signInDTO}