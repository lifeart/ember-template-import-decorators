import Component from '@glimmer/component';
import { hbs as tpl } from 'ember-cli-htmlbars';
import {
  asHelper,
  asModifier,
  asComponent,
} from 'ember-template-import-decorators';

export default class ExampleComponent extends Component {
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
}
