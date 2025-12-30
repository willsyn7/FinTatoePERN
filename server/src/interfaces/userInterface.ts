

interface createUserInterface {
    id : string,
    email : string,
    password : string,
    first_Name : string,
    last_Name : string
}
interface signInInterface{
    email : string,
    password : string
}



export {createUserInterface, signInInterface} 