import jwt from "jsonwebtoken"

const jwtToken = (userId , res)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'30d'
    })
    const isProd = process.env.NODE_ENV === 'production';
    // for development we run front and back on localhost (different ports)
    // which counts as same‑site; use Lax so POSTs still send cookies and
    // avoid the Secure requirement which would block on http.
    const cookieOptions = {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: isProd ? 'strict' : 'lax',
        secure: isProd // secure cookies only in production
    };
    console.log('setting jwt cookie with options:', cookieOptions);
    res.cookie('jwt', token, cookieOptions);
    // log actual header value that will be sent
    const header = res.getHeader('Set-Cookie');
    console.log('Set-Cookie header value:', header);
}

export default jwtToken