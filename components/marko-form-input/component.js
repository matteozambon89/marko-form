/*
* @Author: Matteo Zambon
* @Date:   2017-04-04 16:56:00
* @Last Modified by:   Matteo Zambon
* @Last Modified time: 2017-04-10 18:43:16
*/

'use strict'

const markoFormHelper = require('../../helper')
const extend = require('extend-object')

module.exports = {
  onCreate(input) {
    const state = {}

    if(!input.formName) {
      throw new Error('Form name is mandatory')
    }
    if(!input.name) {
      throw new Error('Name is mandatory')
    }

    // Normalize debug
    state.debug = input.debug || false

    // Set class
    state.class = input['*'].class || {}

    // Set style
    state.style = input['*'].style || {}

    state.value = input['*'].value || ''

    // Set attrs
    state.attrs = extend({}, input['*'])

    delete state.attrs.class
    delete state.attrs.style
    delete state.attrs.validationRules

    state.attrs.name = input.name

    this.$name = input.name
    this.$formName = input.formName
    this.$validationRules = input.validationRules
    this.$value = state.attrs.value

    this.state = state

    this._logLine('[marko-form-input] onCreate')
  },
  onMount() {
    this._logLine('[marko-form-input] onMount')

    const el = this.getEl('marko-form-input')
    const value = el.value

    this.$pristine = true
    this.$dirty = false
    this.$valid = markoFormHelper.validateFormField(this.$validationRules, value)

    this._emitChange('onMount', value)
  },
  onRender(out) {
    this._logLine('[marko-form-input] onRender')
  },
  onUpdate() {
    this._logLine('[marko-form-input] onUpdate')
    this._logLine(this)
  },
  onDestroy() {
    this._logLine('[marko-form-input] onDestroy')
  },
  /* form events */
  onFocus(e) {
    this._logLine('[marko-form-input] onFocus')
    this._logLine(e)

    if(!this.el) {
      return
    }

    const el = this.getEl('marko-form-input')
    const value = el.value

    this._emitChange('onFocus', value)
  },
  onInput(e) {
    this._logLine('[marko-form-input] onInput')
    this._logLine(e)

    if(!this.el) {
      return
    }

    const el = this.getEl('marko-form-input')
    const value = el.value

    this.$pristine = false
    this.$dirty = (value !== this.$value)
    this.$valid = markoFormHelper.validateFormField(this.$validationRules, value)

    this._emitChange('onInput', value)
  },
  onChange(e) {
    this._logLine('[marko-form-input] onChange')
    this._logLine(e)

    if(!this.el) {
      return
    }

    const el = this.getEl('marko-form-input')
    const value = el.value

    this.$pristine = false
    this.$dirty = (value !== this.$value)
    this.$valid = markoFormHelper.validateFormField(this.$validationRules, value)

    this._emitChange('onChange', value)
  },
  onBlur(e) {
    this._logLine('[marko-form-input] onBlur')
    this._logLine(e)

    if(!this.el) {
      return
    }

    const el = this.getEl('marko-form-input')
    const value = el.value

    this.$pristine = false
    this.$dirty = (value !== this.$value)
    this.$valid = markoFormHelper.validateFormField(this.$validationRules, value)

    this._emitChange('onBlur', value)
  },
  onInvalid(e) {
    this._logLine('[marko-form-input] onInvalid')
    this._logLine(e)

    if(!this.el) {
      return
    }

    const el = this.getEl('marko-form-input')
    const value = el.value

    this.$pristine = false
    this.$dirty = (value !== this.$value)
    this.$valid = false

    this._emitChange('onInvalid', value)
  },
  onReset(e) {
    this._logLine('[marko-form-input] onReset')
    this._logLine(e)

    this.$pristine = true
    this.$dirty = false
    this.$valid = markoFormHelper.validateFormField(this.$validationRules, this.$value)

    this._emitChange('onReset', this.$value)
  },
  /* internal */
  _emitChange(action, value) {
    this._logLine('[marko-form-input] _emitChange')
    this._logLine(action)
    this._logLine(value)

    const e = {
      'pristine': this.$pristine,
      'dirty': this.$dirty,
      'valid': this.$valid,
      'currentValue': value,
      'originalValue': this.$value,
      'formName': this.$formName,
      'fieldName': this.$name,
      'during': action
    }

    this.emit('change', e)

    markoFormHelper.updateFormField(e.formName, e.fieldName, e)
  },
  _logLine(line) {
    if(this.state.debug) {
      /* eslint-disable */
      console.log(line)
      /* eslint-enable */
    }
  }
}
