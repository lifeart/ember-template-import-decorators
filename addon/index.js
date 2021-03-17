import templateOnly from '@ember/component/template-only';
import { modifier } from 'ember-modifier';
import { helper } from '@ember/component/helper';
import { setComponentTemplate } from '@ember/component';

export function asHelper(ctx, _, desc) {
  return {
    value: helper(function (positional) {
      return desc.value.call(ctx, ...positional);
    }),
  };
}

export function asComponent(_, __, desc) {
  return {
    value: setComponentTemplate(desc.initializer(), templateOnly()),
  };
}

export function asModifier(ctx, _, desc) {
  return {
    value: modifier(function (element, positional) {
      return desc.value.call(ctx, ...[element, ...positional]);
    }),
  };
}
