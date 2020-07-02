function handleError(info, req, res, next) {
  console.error(info.e.stack);
  console.error(info.e.message);
  res.status(info.status).send({ msg: info.msg, error: info.e.message });
}

module.exports = handleError;