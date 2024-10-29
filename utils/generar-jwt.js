import jwt from 'jsonwebtoken'

const generarJwt = (uid, name) => {

    const payload = { uid, name }

    const JWT_SEED_SECRET = process.env.JWT_SEED_SECRET

    const options = { expiresIn: '4h' }
    // https://www.npmjs.com/package/jsonwebtoken

    const promesa = new Promise((res, rej) => {

        // jwt.sign(<payload>, <semilla-secret>, options, callback)
        jwt.sign(payload,JWT_SEED_SECRET, options, 
            (err, token) => {

                if ( err ) {
                    console.log(err)
                    rej(`No se pudo generar el token ${err}`)
                }

                res(token)
            }
        )
    })

    return promesa

}

export default generarJwt