const Manager = require('../models/manager')
const User = require('../models/user')
var bcrypt = require('bcryptjs');

function registerManager(req, res) {
  
    const user = new User(req.body);
    user['typeUser'] = 'manager';
    user['contrasenia'] = bcrypt.hashSync(req.body.contrasenia, 10),

    user.save(( err, userSaved ) => {

        if (err) return res.status(500).send({ message: `Error al crear el usuario: ${err}` })
        
        let managerData = {
            esAdmin: false,
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

function getManager(req, res) {

    Manager.findById(req.params.id).populate('user').exec((err, manager) => {

        if (err) return res.status(500).send({ message: `Error en el servidor ${err}`, status: false })

        return res.status(201).send({message: 'Petición exitosa', data: manager, status: true})
        
    })
  
}

module.exports = {

    getManager,
    registerManager

}