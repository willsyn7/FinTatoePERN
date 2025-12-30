import express ,{Request, Response, NextFunction} from 'express';
import { dbConnection } from './config/db';
const port = 8080;
import { userController } from './controller/user.controller';
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));

dbConnection();



app.get('/test1', (req : Request,res : Response,next : NextFunction) => {
    res.status(200).json({message : `Hello World`})

})


//User Stuff
app.post('/createUser', userController.createUser);


app.use((req : any ,res : any) => {
    res.status(404).json({message : `Error 404 Bad Request`})
});


app.listen(port,()=> {
    console.log(`port is running on ${port}`);

})