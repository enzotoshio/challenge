require('pubsub-js');

import {
  getElement,
  append,
  createElement,
  createText,
  on
} from './utils';
import { resource } from './resource';

const config = {};
const user = {};
const view = {
  init,
  setListeners,
  getMessage,
  addMessage,
  publishMessage
}

export { view };

function init(viewConfig) {
  setConfig(viewConfig);
  setListeners();

  Object.assign(user, resource.getUser());
}

function setListeners() {
  const sendButton = getElement(config.button);

  on(sendButton, 'click', publishMessage);
  on(window, 'keypress', (e) => {
    if (e.which == 13) {
        e.preventDefault();
        publishMessage();
    }
  });
}

function setConfig(viewConfig) {
  Object.assign(config, viewConfig);
}

function getMessage() {
  const text = getElement(config.textBox).value;

  return { text, user };
}

function addMessage(message) {
  const element = createElement('li');
  const text = `${message.user.name}: ${message.text}`;
  const textNode = createText(text);

  append(element, textNode);

  append(config.container, element);
}

function publishMessage() {
  const message = getMessage();

  getElement(config.textBox).value = '';

  PubSub.publish('message:sent', message);
}
