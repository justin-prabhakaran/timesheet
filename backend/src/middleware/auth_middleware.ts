
import express from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
    id: string;
    role: string;
    iat: number;
    exp: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
            }
        }
    }
}

const authMiddleware = (req:express.Request, res: express.Response, next: express.NextFunction) => {

    try {
        const header = req.headers.authorization;
        if(!header || !header.startsWith("Bearer ")){
            return res.status(401).send("Not authorized to authenticate");
        }

        const token = header.split(" ")[1];

        const decoded = jwt.verify(token, process.env.SECRET_KEY || "secret") as DecodedToken;

        req.user = {
            id : decoded.id,
            role : decoded.role
        }

        next();
    }catch (e){

        console.error(e);

        if (e instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token expired" });
        }
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        }

        return res.status(401).json({error : "Unauthorized access token"});
    }
}

export default authMiddleware;