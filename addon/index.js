import templateOnly from '@ember/component/template-only';
import { modifier } from 'ember-modifier';
import { helper } from '@ember/component/helper';
import { setComponentTemplate } from '@ember/component';

export function asHelper(_, __, desc) {
  return {
    get() {
      let _this = this;
      return helper(function (positional) {
        return desc.value.call(_this, ...positional);
      });
    },
  };
}

export function asComponent(_, __, desc) {
  return {
    value: setComponentTemplate(desc.initializer(), templateOnly()),
  };
}

export function asModifier(_, __, desc) {
  return {
    get() {
      let _this = this;
      return modifier(function (element, positional) {
        return desc.value.call(_this, ...[element, ...positional]);
      });
    },
  };
}
