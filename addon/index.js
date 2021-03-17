import templateOnly from '@ember/component/template-only';
import { modifier } from 'ember-modifier';
import { helper } from '@ember/component/helper';
import { setComponentTemplate } from '@ember/component';
import { tracked } from '@glimmer/tracking';

class ResourceCell {
  constructor(fn) {
    this.fn = fn;
  }
  @tracked value;
  revision = -1;
  revalidate() {
    let revalidate = this.fn();
    if (this.revision !== 0) {
      Promise.resolve(revalidate).then((cb) => {
        cb().then((value) => {
          this.revision = 0;
          this.value = value;
        });
      });
    }
    return this.value;
  }
}

export function asResource(_, key, desc) {
  let cells = new WeakMap();
  return {
    get() {
      let _this = this;
      if (!cells.has(this)) {
        cells.set(this, {});
      }
      let cellScope = cells.get(this);
      if (!(key in cellScope)) {
        let cell_ = new ResourceCell(() => {
          let revalidate = desc.value.call(_this);
          return revalidate;
        });
        cellScope[key] = cell_;
      }
      let cell = cellScope[key];
      try {
        return cell.revalidate();
      } finally {
        cell.revision++;
      }
    },
  };
}

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
