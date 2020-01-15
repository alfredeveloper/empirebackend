
const User = require('../models/user')
const Request = require('../models/request')
const Manager = require('../models/manager')
const Client = require('../models/client')
const ClientJuridical = require('../models/client_juridical')
const MomentDataNatural = require('../models/moment_data_natural')
const MomentDataJuridical = require('../models/moment_data_juridical')
let nodeMailer = require('nodemailer');

function registerRequest( req, res ) {

    const request = new Request(req.body)
    request['ticket'] = Math.floor((Math.random()*100000)+1)

    request.save((err, requestSaved) => {

        if(err) return res.status(500).send({message: `Error en el servidor ${err}`, status: false})
        
        return res.status(201).send({message: `Solicitud registrada`, status: true, data: requestSaved})

    })

}

function getRequests(_, res) {
  
    Request.find().populate({path: 'client', populate: {path: 'user'}}).exec((err, requests) => {

        if(err) return res.status(500).send({message: `Error en el servidor`, status: false})

        let natural = [];
        let juridical = [];
        let accepteds = [];
        let rejecteds = [];

        requests.forEach(element => {
            if(element.client.typeClient == 'natural') {
                if(element.resultado == 'pendiente') {
                    natural.push(element)
                }
            }else {
                if(element.resultado == 'pendiente') {
                    juridical.push(element)
                }
            }
            if(element.resultado == 'aprobado') {
                accepteds.push(element)
            }

            if(element.resultado == 'rechazado') {
                rejecteds.push(element)
            }
        });

        return res.status(201).send({message: `Listado de Solicitudes`, status: true, data: {natural, juridical, aceptados: accepteds, rechazados: rejecteds}})

    })

}

function changeStatusRequest(req, res) {

    Request.findOne({_id: req.body.requestId}).populate({path: 'client', populate: {path: 'user'}}).exec((err, request) => {
        
        if(err) return res.status(500).send({message: `Error en el servidor`, status: false})
        
        request.resultado = req.body.resultado

        request.save();

        if(req.body.resultado == 'aprobado') {
            
            if(request.client.typeClient == 'natural') {
                MomentDataNatural.find({client: request.client._id}, (err, clientNatural) => {
                    if(err) return res.status(500).send({message: `Error en el servidor`, status: false})
                    
                    User.findOne({_id: request.client.user._id}, (err, user) => {
                        if(err) return res.status(500).send({message: `Error en el servidor`, status: false})

                        user.nombres = clientNatural[clientNatural.length - 1].nombres;
                        user.apellidoPaterno = clientNatural[clientNatural.length - 1].apellidoPaterno;
                        user.apellidoMaterno = clientNatural[clientNatural.length - 1].apellidoMaterno;
                        user.departamento = clientNatural[clientNatural.length - 1].departamento;
                        user.provincia = clientNatural[clientNatural.length - 1].provincia;
                        user.distrito = clientNatural[clientNatural.length - 1].distrito;
                        user.direccion = clientNatural[clientNatural.length - 1].direccion;
                        user.tipoDocumento = clientNatural[clientNatural.length - 1].tipoDocumento;
                        user.numDocumento = clientNatural[clientNatural.length - 1].numDocumento;
                        user.fechaNacimiento = clientNatural[clientNatural.length - 1].fechaNacimiento;
                        user.genero = clientNatural[clientNatural.length - 1].genero;
                        user.telefono = clientNatural[clientNatural.length - 1].telefono;
                        user.ocupacion = clientNatural[clientNatural.length - 1].ocupacion;
                        user.centroLaboral = clientNatural[clientNatural.length - 1].centroLaboral;

                        user.save()

                        console.log('actualizacion realizada')
                    })
                })
            } else {
                MomentDataJuridical.find({client: request.client._id}, (err, clientJuridicalMoment) => {
                    if(err) return res.status(500).send({message: `Error en el servidor`, status: false})
                    
                    ClientJuridical.findOne({client: clientJuridicalMoment[clientJuridicalMoment.length - 1].client}, (err, clientJuridical) => {
                        if(err) return res.status(500).send({message: `Error en el servidor`, status: false})
                        clientJuridical.razonSocial = clientJuridicalMoment.razonSocial
                        clientJuridical.ruc = clientJuridicalMoment.ruc
                        clientJuridical.partidaRegistral = clientJuridicalMoment.partidaRegistral
                        clientJuridical.departamento = clientJuridicalMoment.departamento
                        clientJuridical.provincia = clientJuridicalMoment.provincia
                        clientJuridical.distrito = clientJuridicalMoment.distrito
                        clientJuridical.direccion = clientJuridicalMoment.direccion
                        clientJuridical.sede_registral = clientJuridicalMoment.sede_registral
                        clientJuridical.nombreComercial = clientJuridicalMoment.nombreComercial
                        clientJuridical.telefono = clientJuridicalMoment.telefono

                       clientJuridical.save();

                        User.findOne({_id: request.client.user._id}, (err, user) => {
                            if(err) return res.status(500).send({message: `Error en el servidor`, status: false})
    
                            user.nombres = clientJuridicalMoment[clientJuridicalMoment.length - 1].nombres;
                            user.apellidoPaterno = clientJuridicalMoment[clientJuridicalMoment.length - 1].apellidoPaterno;
                            user.apellidoMaterno = clientJuridicalMoment[clientJuridicalMoment.length - 1].apellidoMaterno;
                            user.departamento = clientJuridicalMoment[clientJuridicalMoment.length - 1].departamento;
                            user.provincia = clientJuridicalMoment[clientJuridicalMoment.length - 1].provincia;
                            user.distrito = clientJuridicalMoment[clientJuridicalMoment.length - 1].distrito;
                            user.direccion = clientJuridicalMoment[clientJuridicalMoment.length - 1].direccion;
                            user.tipoDocumento = clientJuridicalMoment[clientJuridicalMoment.length - 1].tipoDocumento;
                            user.numDocumento = clientJuridicalMoment[clientJuridicalMoment.length - 1].numDocumento;
                            user.fechaNacimiento = clientJuridicalMoment[clientJuridicalMoment.length - 1].fechaNacimiento;
                            user.genero = clientJuridicalMoment[clientJuridicalMoment.length - 1].genero;
                            user.telefono = clientJuridicalMoment[clientJuridicalMoment.length - 1].telefono;
                            user.ocupacion = clientJuridicalMoment[clientJuridicalMoment.length - 1].ocupacion;
                            user.centroLaboral = clientJuridicalMoment[clientJuridicalMoment.length - 1].centroLaboral;
    
                            user.save()
    
                        })
                    })

                })
            }

            // enviar correo
            let transporter = nodeMailer.createTransport({
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
                  to: request.client.user.correo,
                  subject: "Credenciales - Empire",
                  text: `  usuario: ${request.client.user.correo} - contraseña: ${request.client.user.momentContrasenia}`,
                  html: `<p>Hola <b>${request.client.user.nombres}</b>, su solicitud de actualizacio de datos ha sido aceptada. </p>`                
                };
              console.log('magsdgasdg', mailOptions)
              transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                      return console.log(error);
                  }
                  console.log('Message %s sent: %s', info.messageId, info.response);
              }); 
        }else {

            let transporter = nodeMailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'mifarmatest@gmail.com',
                    pass: 'mifarmatest123456'
                }
              });
              let mailOptions = {
                  to: request.client.user.correo,
                  subject: "Credenciales - Empire",
                  text: `  usuario: ${request.client.user.correo} - contraseña: ${request.client.user.momentContrasenia}`,
                  html: `<p>Hola <b>${request.client.user.nombres}</b>, su cuenta no ha sido rechazada. </p>`                
                };
              transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                      return console.log(error);
                  }
                  console.log('Message %s sent: %s', info.messageId, info.response);
              });

        }
        return res.status(201).send({message: `Estado actualizado`, status: true, data: request})

    })

} 



module.exports = {
    registerRequest,
    getRequests,
    changeStatusRequest
}
