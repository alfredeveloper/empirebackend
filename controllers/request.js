
const User = require('../models/user')
const Request = require('../models/request')
const Manager = require('../models/manager')
const Client = require('../models/client')
const MomentDataNaturalSchema = require('../models/moment_data_natural')
const MomentDataJuridicalSchema = require('../models/moment_data_juridical')
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

        return res.status(201).send({message: `Listado de Solicitudes`, status: true, data: {natural: requests, juridical: requests}})

    })

}

function changeStatusRequest(req, res) {

    Request.findOne({_id: req.body.requestId}).populate({path: 'client', populate: {path: 'user'}}).exec((err, request) => {
        
        if(err) return res.status(500).send({message: `Error en el servidor`, status: false})
        
        request.resultado = req.body.resultado

        request.save();

        if(req.body.resultado == 'aprobado') {
            // actualizar data oficial
            /*
            if(req.body.typeClient == 'natural') {
                User.findOne({_id: request.client.user._id}, (err, user)=> {
                    if(err) return res.status(500).send({message: `Error en el servidor`, status: false})

                    user.nombres = req.body.nombres
                })
            }else {

            }
            */
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
