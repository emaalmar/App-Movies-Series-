/* import jwt from "jsonwebtoken"

export const authRequired = (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido" })
        }
        // console.log("Token válido:", user)
        req.user = user

    })
    next()
} */