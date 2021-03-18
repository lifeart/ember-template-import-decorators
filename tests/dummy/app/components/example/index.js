import Component from '@glimmer/component';
import { hbs as tpl } from 'ember-cli-htmlbars';
import {
  asHelper,
  asModifier,
  asComponent,
  asResource,
} from 'ember-template-import-decorators';
import { tracked } from '@glimmer/tracking';

export default class ExampleComponent extends Component {
  constructor() {
    super(...arguments);
    setInterval(() => {
      this.helloCounter++;
      console.log('trigger revalidation');
      console.log(this.helloCounter);
    }, 5000);
  }

  @asHelper
  uppercase(a) {
    return a.toUpperCase();
  }

  @asComponent
  GreetingComponent = tpl`<h1 ...attributes>{{@greeting}}</h1>`;

  @asModifier
  changeBackground(element, color) {
    element.style.backgroundColor = color;
  }

  @tracked helloCounter = 0;

  @asResource
  sayHello() {
    // here we use all tracked data
    let value = Date.now() + this.helloCounter;
    // here logic, based on collected tracked data;
    return async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 10000)
      );
      console.log('async function executed');
      return value;
    };
  }
}
