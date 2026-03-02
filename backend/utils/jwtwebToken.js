import jwt from "jsonwebtoken"

const jwtToken = (userId , res)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'30d'
    })
    const isProd = process.env.NODE_ENV === 'production';
    // for development running on different port, allow cross-site cookie
    res.cookie('jwt', token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: isProd ? 'strict' : 'none',
        secure: isProd // secure required for sameSite=none
    })
}

export default jwtToken