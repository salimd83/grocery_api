function handleError(info, req, res, next) {
  if(!info.e) {
    // for general error
    console.error(info);
    res.status(500);
  }
  console.error(info.e.stack);
  console.error(info.e.message);
  res.status(info.status).send({ msg: info.msg, error: info.e.message });
}

module.exports = handleError;