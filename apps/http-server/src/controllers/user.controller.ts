import { Request, Response } from "express";

const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password } = req.body();
        if (!username || !password) {
            return res.status(403).json({
                error: "invalid request,username and password required"
            })
        }
        // check  db 
        // generate token
    } catch (error) {
        console.log(error);
    }
}

 const signup = async (req:Request,res:Response):Promise<any>=>{
  try {  
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        error:"Signup failed! |Internal server error"
    })
  }
}

const room = async(req:Request,res:Response)=>{
    try {
        res.json({
            roomId:123 
        })
    } catch (error) {
        console.log(error);
    } 
}

export {
    login,
    signup,
    room
}