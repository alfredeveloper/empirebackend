const Client = require('../models/client')
const User = require('../models/user')
const ClientNatural = require('../models/client_natural')
const ClientJuridical = require('../models/client_juridical')
const MomentDataNaturalSchema = require('../models/moment_data_natural')
const MomentDataJuridicalSchema = require('../models/moment_data_juridical')
const Request = require('../models/request')
const service = require('../services')
var bcrypt = require('bcryptjs');
let nodeMailer = require('nodemailer');

function registerClient(req, res) {
  
  const user = new User(req.body);
  user['typeUser'] = 'client';
  user['status'] = 'ingresado';
  user['momentContrasenia'] =req.body.tipoCliente + Math.floor((Math.random()*1000000000)+1).toString()
  // user['con'] = bcrypt.hashSync(req.body.contrasenia, 10),

  user.save(( err, userSaved ) => {

    if (err) return res.status(500).send({ message: `Error al crear el usuario: ${err}` })
    
    let clientData = {
      esCliente: true,
      user: userSaved._id,
      code: Math.floor((Math.random()*1000000000)+1),
    }
    
    const client = new Client(clientData)
    
    client.save(( err, clientSaved ) => {

        if (err) return res.status(500).send({ message: `Error al crear el usuario: ${err}` })

        if (req.body.tipoCliente == 'juridical') {

            let clientJuridicalData = {
                razonSocial: req.body.razonSocial,
                ruc: req.body.ruc,
                nombreComercial: req.body.nombreComercial,
                correo: req.body.correo,
                client: clientSaved._id,
            }
            
            const clientJuridical = new ClientJuridical(clientJuridicalData)

            clientJuridical.save((err, juridicalSaved) => {

                if (err) return res.status(500).send({message: 'Error en el servidor', status: false})
                
                

                return res.status(201).send({message: 'Nueva persona jurídica', data: {user: userSaved, client: clientSaved, juridical: juridicalSaved}, status: true})

            })
        } else if(req.body.tipoCliente == 'natural') {

            let clientNaturalData = {
                
                client: clientSaved._id,
            }
            
            const clientNatural = new ClientNatural(clientNaturalData)

            clientNatural.save((err, naturalSaved) => {
                if(err) return res.status(500).send({message: 'Error en el servido', status: false})

                

                return res.status(201).send({message: 'Nueva persona natural', data: {user: userSaved, client: clientSaved, natural: naturalSaved}, status: true})
            })
        }

    })

  })
  
}

function getClient (req, res) {

  Client.findById(req.params.id).populate('user').exec((err, client) => {

    if (err) return res.status(500).send({ message: `Error en el servidor ${err}`, status: false })
  
    return res.status(201).send({message: 'Petición exitosa', data: client, status: true})
      
  })
  
}

function getClients (_, res ) {

  ClientNatural.find().populate({path: 'client', populate: {path: 'user'}}).exec((err, clientNaturals) => {

    if (err) return res.status(500).send({message: `Error en el servidor ${err}`, status: false})

    ClientJuridical.find().populate({path: 'client', populate: {path: 'user'}}).exec((err, clientJuridicals) => {
  
      if (err) return res.status(500).send({message: `Error en el servidor ${err}`, status: false})
  
      return res.status(201).send({message: 'Petición exitosa', data: {natural: clientNaturals, juridical: clientJuridicals}, status: true})
  
    })

  })

}

function updateClient ( req, res ) {
  
  Client.findOne({_id: req.body.id}).populate('user').exec((err, client) => {

    if (err) return res.status(500).send({message: `Error en el servidor ${err}`, status: false})

    if(client.user.status == 'ingresado') {
      if(req.body.typeClient == 'natural') {

        console.log('cliente: ', client.user)
        User.findOne({_id: client.user}, (err, user) => {
          console.log('usuario: ', user)
          
          if (err) return res.status(500).send({message: `Error en el servidor ${err}`, status: false})
          
          user.apellidoPaterno = req.body.apellidoPaterno;
          user.apellidoMaterno = req.body.apellidoMaterno;
          user.nombres = req.body.nombres;
          user.departamento = req.body.departamento;
          user.provincia = req.body.provincia;
          user.distrito = req.body.distrito;
          user.direccion = req.body.direccion;
          user.genero = req.body.genero;
          user.tipoDocumento = req.body.tipoDocumento;
          user.numdoc = req.body.numdoc;
          user.fechaNacimiento = req.body.fechaNacimiento;
          user.correo = req.body.correo;
          user.telefono = req.body.telefono;
          user.ocupacion = req.body.ocupacion;
          user.centroLaboral = req.body.centroLaboral;
          user.status = 'en evaluacion';
          user.save();

          return res.status(201).send({message: `Peticion exitosa`, status: true, data: user })
        
        })
      } else {

        User.findOne({_id: client._id}, (err, user) => {
          
          if (err) return res.status(500).send({message: `Error en el servidor ${err}`, status: false})
          
          client.apellidoPaterno = req.body.apellidoPaterno;
          client.apellidoMaterno = req.body.apellidoMaterno;
          client.nombres = req.body.nombres;
          client.departamento = req.body.departamento;
          client.provincia = req.body.provincia;
          client.distrito = req.body.distrito;
          client.direccion = req.body.direccion;
          client.genero = req.body.genero;
          client.tipoDocumento = req.body.tipoDocumento;
          client.numdoc = req.body.numdoc;
          client.fechaNacimiento = req.body.fechaNacimiento;
          client.correo = req.body.correo;
          client.telefono = req.body.telefono;
          client.ocupacion = req.body.ocupacion;
          client.centroLaboral = req.body.centroLaboral;
          client.contrasenia = bcrypt.hashSync(req.body.contrasenia, 10);          
          user.status = 'en evaluacion';
          user.save();

          ClientJuridical.findOne({client: client._id}, (err, clientJuridical) => {

            clientJuridical.razonSocial = req.body.razonSocial;
            clientJuridical.ruc = req.body.ruc;
            clientJuridical.partidaRegistral = req.body.partidaRegistral;
            clientJuridical.departamento = req.body.departamento;
            clientJuridical.provincia = req.body.provincia;
            clientJuridical.distrito = req.body.distrito;
            clientJuridical.direccion = req.body.direccion;
            clientJuridical.sede_registral = req.body.sede_registral;
            clientJuridical.correo = req.body.correo;
            clientJuridical.nombreComercial = req.body.nombreComercial;
            clientJuridical.telefono = req.body.telefono;

            clientJuridical.save();

            return res.status(201).send({message: `Peticion exitosa`, status: true, data: user })

          })
        })

      }

      
    }else {
      return res.status(201).send({message: 'cliente registrado', status: true})
    }
  })

}

function changePassword ( req, res ) {
  User.findOne({_id: req.body.id}, (err, user) => {

    if(err) return res.status(500).send({message: `Error en el servidor ${err}`, status: false});

    if(user.contrasenia == undefined || user.contrasenia == null || user.contrasenia == ""){
      
      user.contrasenia = bcrypt.hashSync(req.body.contrasenia, 10);
      user.save();
      
      return res.status(201).send({message: 'Contraseña modificada', status: true, data: user})
    }else {
      return res.status(201).send({message: 'No se pudo, Contraseña ya modificada', status: true, data: user})
    }

  })
}

function login (req, res) {

  User.findOne({correo: req.body.correo}, (err, user) => {

    if(err) return res.status(500).send({message: `Error en el servidor ${err}`, status: false})

    if(!user) return res.status(404).send({message: `Credenciales incorrectas - correo electrónico`, status: false})

    console.log(user.contrasenia)
    if(user.contrasenia == undefined || user.contrasenia == null || user.contrasenia == 'undefined') {
      if(user.momentContrasenia == req.body.contrasenia) {
    
        return res.status(201).send({message: 'Peticion exitosa', status: true, data: user})
        
      }else {
        
        return res.status(404).send({message: 'Las credenciales no coinciden', status: false})
    
      }
    }

    if(!bcrypt.compareSync(req.body.contrasenia, user.contrasenia)) return res.status(404).send({message: 'Credenciales incorrectas - contraseña', status: false})

    return res.status(201).send({message: 'Peticion exitosa', status: true, data: user})

  })

}

function loginAdmin (req, res) {

  User.findOne({correo: req.body.correo}, (err, user) => {

    if(err) return res.status(500).send({message: `Error en el servidor ${err}`, status: false})

    if(!user) return res.status(404).send({message: `Credenciales incorrectas - correo electrónico`, status: false})

    if(!bcrypt.compareSync(req.body.contrasenia, user.contrasenia)) return res.status(404).send({message: 'Credenciales incorrectas - contraseña', status: false})

    return res.status(201).send({message: 'Peticion exitosa', status: true, data: user})
    
  })

}

function sendCode (req, res) {

  Client.findOne({code: req.body.code}, (err, client) => {

    if(err) return res.status(500).send({message: 'Error en el servidor', status: false})

    if(client) {
      return res.status(201).send({message: 'Cliente existente', status: true, data: client})

    } else {
      return res.status(404).send({message: 'No se encontro al cliente', status: false})

    }

  })

}

function updateStatus (req, res) {

  User.findOne({_id: req.body.id}, (err, user) => {

    if(err) return res.status(500).send({message: 'Error en el servidor', status: false})

    user.status = req.body.status
    user.save()

    if(req.body.status == 'aceptado') {
      let transporter = nodeMailer.createTransport({
        sendmail: true,
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            // should be replaced with real sender's account
            user: 'mifarmatest@gmail.com',
            pass: 'mifarmatest123456'
        }
      });
      let mailOptions = {
          // should be replaced with real recipient's account
          to: user.correo,
          subject: "Credenciales - Empire",
          text: `  usuario: ${user.correo} - contraseña: ${user.momentContrasenia}`,
          html: `<p>Bienvenido a Empire <b>${user.nombres}</b>, le otorgamos sus credenciales: </p>
          <b>Usuario: ${user.correo}</b> <br>
          <b>Contraseña: ${user.momentContrasenia}</b>
          `                
        };
      console.log('magsdgasdg', mailOptions)
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
      });
    } else if (req.body.status == 'rechazado') {

      let transporter = nodeMailer.createTransport({
        sendmail: true,
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            // should be replaced with real sender's account
            user: 'mifarmatest@gmail.com',
            pass: 'mifarmatest123456'
        }
      });
      let mailOptions = {
          // should be replaced with real recipient's account
          to: user.correo,
          subject: "Credenciales - Empire",
          text: `  usuario: ${user.correo} - contraseña: ${user.momentContrasenia}`,
          html: `<p>Hola <b>${user.nombres}</b>, su cuenta no ha sido aceptada. </p>`                
        };
      console.log('magsdgasdg', mailOptions)
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
      });

    }
    
    return res.status(201).send({message: 'Estado actualizado', status: true, data: user})

  })

}

function updateMomentNatural (req, res) {
  
  const natural = new MomentDataNaturalSchema(req.body)

  natural.save((err, naturalSaved)=> {

    if(err) return res.status(500).send({message: `Error en el servidor ${err}`, status: false})

    let data = {
      ticket: Math.floor((Math.random()*100000)+1),
      solicitud: 'Solicitud de Actualizacion de datos',
      fecha_solicitud: Date.now(),
      fecha_respuesta: Date.now(),
      resultado: 'pendiente',
      client: req.body.id
    }

    let request = new Request(data)
    request.save((err, requestSaved) => {

      if(err) return res.status(500).send({message: `Error en el servidor ${err}`, status: false})

      return res.status(201).send({message: 'Datos momentáneos de Persona Natural Registrado', status: true, data: naturalSaved})
    })

  })

}

function updateMomentJuridical (req, res) {

  const juridical = MomentDataJuridicalSchema(req.body)

  juridical.save((err, juridicalSaved) => {

    if(err) return res.status(500).send({message: `Error en el servidor ${err}`, status: false})

  
    let data = {
      ticket: Math.floor((Math.random()*100000)+1),
      solicitud: 'Solicitud de Actualizacion de datos',
      fecha_solicitud: Date.now(),
      fecha_respuesta: Date.now(),
      resultado: 'pendiente',
      client: req.body.id
    }

    let request = new Request(data)

    Request.save((err, requestSaved) => {

      if(err) return res.status(500).send({message: `Error en el servidor ${err}`, status: false})

      return res.status(201).send({message: 'Datos momentáneos de Persona Jurídica Registrado', status: true, data: juridicalSaved})
    
    })


  })

}

function getDataNatural(req, res) {

  ClientNatural.findOne({_id: req.params.id}).populate({path: 'client', populate: {path: 'user'}}).exec((err, data)=> {

    if(err) return res.status(500).send({message: `Error en el servidor ${err}`, status: false})

    return res.status(201).send({message: 'Persona natural encontrada', status: true, data})

  })

}

function getDataJuridical(req, res) {

  ClientJuridical.findOne({_id: req.params.id}).populate({path: 'client', populate: {path: 'user'}}).exec((err, data)=> {

    if(err) return res.status(500).send({message: `Error en el servidor ${err}`, status: false})

    return res.status(201).send({message: 'Persona Juridica encontrada', status: true, data})

  })

}

module.exports = {

  getClient,
  getClients,
  updateClient,
  registerClient,
  login,
  loginAdmin,
  sendCode,
  updateStatus,
  changePassword,
  updateMomentNatural,
  updateMomentJuridical,
  getDataNatural,
  getDataJuridical

}