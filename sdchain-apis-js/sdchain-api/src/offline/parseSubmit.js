function parseSubmit (result) {
  return {
    hash:result.tx_json.hash,
    resultType: result.engine_result,
    resultMessage: result.engine_result_message
  }
}

module.exports = parseSubmit
