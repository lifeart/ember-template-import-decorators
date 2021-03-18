import templateOnly from '@ember/component/template-only';
import { modifier } from 'ember-modifier';
import { helper } from '@ember/component/helper';
import { setComponentTemplate } from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { createCache, getValue } from '@glimmer/tracking/primitives/cache';
import { isDestroying, isDestroyed } from '@ember/destroyable';

// from https://github.com/pzuraq/tracked-toolbox/blob/master/addon/index.js
export function cached(target, key, value) {
  let { get, set } = value;

  let caches = new WeakMap();

  return {
    get() {
      let cache = caches.get(this);

      if (cache === undefined) {
        cache = createCache(get.bind(this));
        caches.set(this, cache);
      }

      return getValue(cache);
    },

    set,
  };
}

class ResourceCell {
  constructor(fn, ctx) {
    this.fn = fn;
    this.ctx = ctx;
  }
  @tracked value;
  iteration = 0;
  @cached get validation() {
    console.log('revoke validation');
    let revalidate = this.fn();
    try {
      return true;
    } finally {
      this.iteration++;
      let iteration = this.iteration;
      Promise.resolve(revalidate()).then((value) => {
        if (
          this.iteration === iteration &&
          !isDestroying(this.ctx) &&
          !isDestroyed(this.ctx)
        ) {
          this.value = value;
        } else {
          console.log('revisions mismatch');
        }
      });
    }
  }
  revalidate() {
    return this.validation ? this.value : undefined;
  }
}

export function asResource(_, key, desc) {
  let cells = new WeakMap();
  return {
    get() {
      let _this = this;
      if (isDestroyed(this) || isDestroying(this)) {
        return undefined;
      }
      if (!cells.has(this)) {
        cells.set(this, {});
      }
      let cellScope = cells.get(this);
      if (!(key in cellScope)) {
        let cell_ = new ResourceCell(() => {
          let revalidate = desc.value.call(_this);
          return revalidate;
        }, _this);
        cellScope[key] = cell_;
      }
      let cell = cellScope[key];
      return cell.revalidate();
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
