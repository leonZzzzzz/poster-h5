let Utils = {
  /**
   * 正则验证手机号
   */
  checkPhone(phone) {
    const reg = /^1[3456789]\d{9}$/
    return reg.test(phone)
  },
  /**
   * 正则验证邮箱
   */
  checkEmail(email) {
    const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
    return reg.test(email)
  }
}

export default Utils