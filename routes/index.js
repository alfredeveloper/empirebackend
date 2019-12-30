
const express = require('express')
const userCtrl = require('../controllers/user')
const clientController = require('../controllers/client')
const managerController = require('../controllers/manager')
const requestController = require('../controllers/request')

const auth = require('../middlewares/auth')
const api = express.Router()

// usuario

api.post('/login', clientController.login)
api.post('/login/admin', clientController.loginAdmin)
api.post('/logout', userCtrl.logout)

// cliente
api.get('/clients/:id', clientController.getClient);
api.get('/clients', clientController.getClients);
api.post('/clients', clientController.registerClient);
api.put('/clients', clientController.updateClient);
api.put('/clients/status', clientController.updateStatus);
api.put('/change/password', clientController.changePassword);
api.post('/send/code', clientController.sendCode);
api.post('/save/moment/natural', clientController.updateMomentNatural)
api.post('/save/moment/juridical', clientController.updateMomentJuridical)
api.get('/get/data/natural/:id', clientController.getDataNatural)
api.get('/get/data/juridical/:id', clientController.getDataJuridical)

// administrador
api.get('/managers/:id', managerController.getManager);
api.post('/managers', managerController.registerManager);

// request
api.get('/requests', requestController.getRequests);
api.post('/requests', requestController.registerRequest);
api.put('/requests', requestController.changeStatusRequest);

module.exports = api
