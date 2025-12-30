import {Request, Response, NextFunction} from 'express';
import { createUserInterface, signInInterface } from '../interfaces/userInterface';
import { createUserDTO , signInDTO } from '../dto/userdto';
import { userService } from '../service/user.service';



// interface createUserInterface {
//     id : string,
//     email : string,
//     password : string,
//     first_Name : string,
//     last_Name : string
// }
// interface signInInterface{
//     email : string,
//     password : string
// }



const userController  = {
//Request <Route Paramters, ResBody, REqBody, ReqQuery>
  createUser : async (req : Request<{}, {}, createUserInterface>,res : Response,next : NextFunction) => {
    try{
      const {email, password , first_Name, last_Name } = req.body;

      const user = await userService.createUser({
        email,
        password,
        first_Name,
        last_Name
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });

    }catch(error){
      console.log(error)
      next(error);
    }
  },
  logIn : async (req : Request<{}, {}, signInInterface>,res : Response,next : NextFunction) => {
    try{
      const {email, password} = req.body;
        const user = await userService.loginUser(email, password);

      res.status(200).json({
        success: true,
         message: 'User successfully logged in',
        data: user
      });

    }catch(error){
      console.log(error);
      next(error);
    }

  }
}

export {userController}