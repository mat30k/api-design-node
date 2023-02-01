import jwt from "jsonwebtoken"

export const createJWT = (user) => {
    const token = jwt.sign({
        id: user.id, 
        username: user.username
    }, 
    process.env.JWT_SECRET
    );
    return token;
}

export const protect = (req, res, next) => {
    const bearer = req.headers.authorization; 

    if(!bearer || !bearer.startsWith("Bearer ")) {
        return res.status(401).json({message: "Unauthorized"})
    }

    const [, token] = bearer.split("Bearer ");
    if(!token){
        return res.status(401).json({message: "Missing token"});
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next(); 
        return; 
    } catch (error) {
        console.error("Error: ", error.message);
        res.status(401).json({message: "Unauthorized"});
        return; 
    }
}