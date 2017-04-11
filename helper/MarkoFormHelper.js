/*
* @Author: Matteo Zambon
* @Date:   2017-04-05 17:42:42
* @Last Modified by:   Matteo Zambon
* @Last Modified time: 2017-04-10 16:38:30
*/

'use strict'

const uuidV4 = require('uuid/v4')
const validator = require('validator')
const EventEmitter = require('events')

class MarkoFormHelper extends EventEmitter {
  constructor() {
    super()

    this._debug = false
    this._forms = {}
  }

  set debug(newDebug) {
    this._debug = newDebug
  }
  get debug() {
    return this._debug
  }

  newFormName() {
    return uuidV4()
  }

  updateFormField(formName, fieldName, attrs) {
    this._forms[formName] = this._forms[formName] || {}
    this._forms[formName][fieldName] = this._forms[formName][fieldName] || {}

    this._forms[formName][fieldName] = attrs

    if(attrs.during === 'onChange' || attrs.during === 'onBlur') {
      const formValid = this.isFormValid(formName)

      this._emitFormValidated(formName, formValid)
    }

    this._emitFormFieldChange(formName, fieldName, attrs)
  }

  validateFormField(validationRules, value) {
    let isValid = true

    if(validationRules) {
      for(const v in validationRules) {
        const rule = validationRules[v]

        const ruleFn = rule.fn
        const ruleArgs = [
          value,
          rule.attrs
        ]

        isValid = isValid * validator[ruleFn].apply(null, ruleArgs)
      }
    }

    return Boolean(isValid)
  }

  isFormValid(formName) {
    const form = this._forms[formName]
    let isValid = true

    for(const k in form) {
      const field = form[k]

      isValid = isValid * field.valid
    }

    return Boolean(isValid)
  }

  _emitFormFieldChange(formName, fieldName, attrs) {
    const eventName = [
      formName,
      fieldName,
      'change'
    ].join('.')

    this.emit(eventName, attrs)
  }

  _emitFormValidated(formName, formValid) {
    const eventName = [
      formName,
      'validated'
    ].join('.')

    this.emit(eventName, formValid)
  }
}

module.exports = MarkoFormHelper
