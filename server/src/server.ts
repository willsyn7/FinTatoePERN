import express ,{Request, Response, NextFunction} from 'express';
import { dbConnection } from './config/db';
const port = 8080;
import { userController } from './controller/user.controller';
import { authMiddleware } from './middleware/auth.middleware';
import alphaVantageController from './controller/alphaVantageController';
import oauthController from './controller/oauthController';
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));

// Connect to database asynchronously without blocking server startup
dbConnection().catch(err => {
  console.error('Database connection failed:', err.message);
});



app.get('/test1', (req : Request,res : Response,next : NextFunction) => {
    res.status(200).json({message : `Hello World`})

})


//User Authentication Routes
app.post('/auth/signup', userController.createUser);
app.post('/auth/login', userController.logIn);
app.post('/auth/test-login', userController.testLogin); // TEST ONLY - to get firesbase id
app.post('/auth/logout', authMiddleware.verifyToken, userController.logOut);

// Google OAuth Routes
app.get('/auth/google', oauthController.googleAuth);
app.get('/auth/google/callback', oauthController.googleCallback);
app.post('/auth/google/revoke', oauthController.revokeGoogleAuth);

// GitHub OAuth Routes
app.get('/auth/github', oauthController.githubAuth);
app.get('/auth/github/callback', oauthController.githubCallback);
app.post('/auth/github/revoke', oauthController.revokeGithubAuth);

// Alpha Vantage Routes
app.get('/api/news', authMiddleware.verifyToken, alphaVantageController.queryNews);
app.get('/api/stock/:symbol', authMiddleware.verifyToken, alphaVantageController.getStockQuote);
app.get('/api/company/:symbol', authMiddleware.verifyToken, alphaVantageController.getCompanyOverview);



app.use((req : any ,res : any) => {
    res.status(404).json({message : `Error 404 Bad Request`})
});


app.listen(port,()=> {
    console.log(`port is running on ${port}`);

})