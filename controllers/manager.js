const Manager = require('../models/manager')
const User = require('../models/user')
var bcrypt = require('bcryptjs');
const service = require('../services')

function registerManager (req, res) {
  
    const user = new User(req.body);
    user['typeUser'] = 'manager';
    user['contrasenia'] = bcrypt.hashSync(req.body.contrasenia, 10),

    user.save(( err, userSaved ) => {

        if (err) return res.status(500).send({ message: `Error al crear el usuario: ${err}` })
        
        let managerData = {
            esAdmin: true,
            role: 'superadmin',
            user: userSaved._id
        }
    
        const manager = new Manager(managerData)
        
        manager.save(( err, managerSaved ) => {

            if (err) return res.status(500).send({ message: `Error al crear el usuario: ${err}` })

            return res.status(201).send({message: 'Registro exitoso', status: true, data: managerSaved})
        
        })

    })
 
}

function getManager (req, res) {

    Manager.findById(req.params.id).populate('user').exec((err, manager) => {

        if (err) return res.status(500).send({ message: `Error en el servidor ${err}`, status: false })

        return res.status(201).send({message: 'Petición exitosa', data: manager, status: true})
        
    })
  
}

function getManagers (_, res) {

    Manager.find().populate('user').exec((err, managers) => {

        if(err) return res.status(500).send({ message: `Error en el sistema`, status: false })

        return res.status(201).send({message: 'Listado de administradores', status: true, data: managers})

    })

}

function login (req, res) {

    User.findOne({correo: req.body.correo}, (err, user) => {
  
      if(err) return res.status(500).send({message: `Error en el servidor ${err}`, status: false})
  
      if(!user) return res.status(404).send({message: `Credenciales incorrectas - correo electrónico`, status: false})
  
      if(!bcrypt.compareSync(req.body.contrasenia, user.contrasenia)) return res.status(404).send({message: 'Credenciales incorrectas - contraseña', status: false})
  
      Manager.findOne({user: user._id}).populate('user').exec((err, manager) => {
          
        if (err) return res.status(500).send({message: `Error en el servidor`, status: false})

        return res.status(201).send({message: 'Peticion exitosa', status: true, data: manager, token: service.createToken(manager)})
        
      })
      
    })
  
}

module.exports = {

    getManager,
    getManagers,
    registerManager,
    login

}