
const User = require('../models/user')
const Manager = require('../models/manager')
const Client = require('../models/client')
const service = require('../services')
var bcrypt = require('bcryptjs');

function getUsers(_, res) {
  User.find((err, users) => {
    
      if (err) return res.status(500).send({ message: `Error en el servidor: ${err}` })
      
      return res.status(201).send({
        message: "Usuarios encontrados",
        status: true,
        data: users
      })

  })
}

function getUser(req, res) {

  User.findById( req.params.id, ( err, user ) => {

    if (err) return res.status(500).send({ message: `Error en el servidor: ${err}` })
    return res.status(201).send({
      message: "Usuario encontrado",
      status: true,
      data: user
    })

  });

}

function loginUser(req, res) {

  // let doc = await User.findOneAndUpdate( {email: req.body.email, password: req.body.password }, {'$set': {mobile_token: req.body.mobile_token}}, { new: true }, ( err, userUpdated ))
  User.findOne({email: req.body.email}, (err, user) => {
    
    if(err) return res.status(500).send({message: `Error en el servidor ${err}`, status: false})
    
    if(!user) return res.status(404).send({message: `Credenciales incorrectas - correo electrónico`, status: false})
    
    if(!bcrypt.compareSync(req.body.password, user.password)) return res.status(404).send({message: 'Credenciales incorrectas - contraseña', status: false})
    
    user.mobile_token = req.body.mobile_token
    user.save()
    
    if ( user.typeUser == 'client' ) {
      
      Client.findOne( {user: user._id }, ( err, client ) => {
        
        if(err) return res.status(500).send({ message: `Error en la peticion ${err}`})
        
        return res.status(201).send({message: `Login exitoso`})
      })
      
    } else if ( user.typeUser == 'manager' ) {
      Manager.findOne({user: user._id}, (err, manager) => {
        if(err) return res.status(500).send({ message: `Error en la peticion ${err}`})
        
        return res.status(201).send({ message: 'Inicio de sesión exitoso', data: { user, manager }, token: service.createToken(user), status: true })
      })
      
      
    }
    
  })
  
}

function logout(req, res) {
  
  User.findById( req.body.user_id, ( err, user ) => {

    if (err) return res.status(500).send({ message: `Error al crear el usuario: ${err}` })

    if(user.role == 'driver') {
      
      Driver.findOneAndUpdate( {user: user._id }, {'$set': {status: 'offline'}}, { new: true }, ( err, driver ) => {
        
        if (err) return res.status(500).send({ message: `Error al crear el usuario: ${err}` })
        
        return res.status(201).send({ 
          message: 'Sesion cerrada', 
          status: true,
          data: driver
        })
        
      });

    } else if(user.role == 'client') {
      
      Client.findOne({user: user._id}, (err, client) => {

        if (err) return res.status(500).send({ message: `Error al crear el usuario: ${err}` })

        client.status = 'offline'
        client.save()

        return res.status(201).send({
          message: 'Sesion cerrada',
          status: true,
          data: client
        })
      })
    
    } else if(user.role == 'manager') {
      
      Manager.findOne({user: user._id}, (err, manager) => {

        if (err) return res.status(500).send({ message: `Error al crear el usuario: ${err}` })

        manager.status = 'offline'
        manager.save()

        return res.status(201).send({
          message: 'Sesion cerrada',
          status: true,
          data: manager
        })
      })
    
    }

  });

}


module.exports = {
  getUser,
  getUsers,
  loginUser,
  logout
}
