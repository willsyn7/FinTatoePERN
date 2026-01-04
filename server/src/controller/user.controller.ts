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
//Request <Route Paramters, ResBody, RErqBody, ReqQuery>
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
      const result = await userService.loginUser(email, password);

      res.status(200).json({
        success: true,
        message: 'User successfully logged in',
        data: result
      });

    }catch(error){
      console.log(error);
      next(error);
    }
  },

  logOut : async (req : Request,res : Response,next : NextFunction) => {
    try{
      // For logout with Google Identity Platform, you can revoke tokens
      // The client should also delete the token from their storage
      const userId = res.locals.user?.uid;

      if (userId) {
        await userService.revokeUserTokens(userId);
      }

      res.status(200).json({
        success: true,
        message: 'User successfully logged out'
      });

    }catch(error){
      console.log(error);
      next(error);
    }
  },

  // TEST ENDPOINT - Returns ID token directly for Postman testing
  testLogin : async (req : Request<{}, {}, signInInterface>,res : Response,next : NextFunction) => {
    try{
      const {email, password} = req.body;
      const result = await userService.loginUser(email, password);

      // Get the custom token
      const customToken = result.tokens.customToken;

      // Exchange custom token for ID token using Firebase REST API
      const firebaseWebApiKey = process.env.FIREBASE_WEB_API_KEY;

      if (!firebaseWebApiKey) {
        throw new Error('FIREBASE_WEB_API_KEY not configured');
      }

      const tokenExchangeUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${firebaseWebApiKey}`;

      const tokenResponse = await fetch(tokenExchangeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: customToken,
          returnSecureToken: true,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange custom token for ID token');
      }

      const tokenData = await tokenResponse.json();

      res.status(200).json({
        success: true,
        message: 'User successfully logged in (TEST MODE)',
        data: {
          user: result.user,
          idToken: tokenData.idToken,
          refreshToken: tokenData.refreshToken,
          expiresIn: tokenData.expiresIn,
        }
      });

    }catch(error){
      console.log(error);
      next(error);
    }
  }
}

export {userController}