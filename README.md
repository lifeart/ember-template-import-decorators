ember-template-import-decorators
==============================================================================

This is list of useful decorators for template-imports in Ember.
It's created as easy to use "bridge" from primitives to handy DX implementation.

Compatibility
------------------------------------------------------------------------------

* Ember.js v3.16 or above
* Ember CLI v2.13 or above
* Node.js v10 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-template-import-decorators
```



Limitations
------------------------------------------------------------------------------

* Named arguments not supported for helpers, modifiers
* For components, only 'template-only' glimmer components supported

Usage
------------------------------------------------------------------------------


// my-component.js
```js
import Component from "@glimmer/component";
import { hbs } from "ember-cli-htmlbars";
import { asHelper, asModifier, asComponent } from "ember-template-import-decorators";

export default class ExampleComponent extends Component {
  @asHelper
  uppercase(a) {
    return a.toUpperCase();
  }

  @asComponent
  GreetingComponent = hbs`<h1 ...attributes>{{@greeting}}</h1>`;

  @asModifier
  changeBackground(element, color) {
    element.style.backgroundColor = color;
  }
}
```

// my-component.hbs
```hbs
  <this.GreetingComponent 
    @greeting={{this.uppercase "Hello"}} 
    {{this.changeBackground "green"}}
  />
```



Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
