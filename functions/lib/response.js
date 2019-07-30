module.exports.sendSuccess = (responseObject, responseMessage) =>
  responseObject.send({ success: responseMessage });

module.exports.sendError = (responseObject, responseMessage, log, status=200) =>
  responseObject.status(status).send({ error: { msg: responseMessage }, log });