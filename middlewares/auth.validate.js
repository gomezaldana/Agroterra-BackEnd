import jwt from 'jsonwebtoken'

const authValidate = (req, res, next) => {

    // x-token -> header
    const token = req.header('x-token')

    if ( !token ) {
        return res.status(401).json({
            msg: 'No llegó el token'
        })
    }

    try {

        const objVerificacion = jwt.verify(token, process.env.JWT_SEED_SECRET)
        console.log(objVerificacion)
        const { uid, name } = objVerificacion

        req.uid = uid
        req.name = name

        next()
        
    } catch (error) {
        
        return res.status(401).json({
            msg: 'Token inválido'
        })
    }

}

export default authValidate