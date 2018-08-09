const CompositeElement = require('fs-base/CompositeElement')

class Phone extends CompositeElement {
    get root() {
        return super.root
    }

    isValid() {
        return this.root.getAttribute("class").indexOf('invalid') < 0
    }
    get value() {
        return this.root.$('input').getAttribute('value')
    }
    set value(newValue) {
        return this.root.$('input').setValue(newValue)
    }
}

module.exports = Phone