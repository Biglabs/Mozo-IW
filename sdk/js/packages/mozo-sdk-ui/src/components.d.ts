/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */

import '@stencil/core';

declare global {
  namespace JSX {
    interface Element {}
    export interface IntrinsicElements {}
  }
  namespace JSXElements {}

  interface HTMLElement {
    componentOnReady?: () => Promise<this | null>;
  }

  interface HTMLStencilElement extends HTMLElement {
    componentOnReady(): Promise<this>;

    forceUpdate(): void;
  }

  interface HTMLAttributes {}
}


declare global {

  namespace StencilComponents {
    interface MozoMessageTransferSuccess {
      'hash': string;
      'transferMozo': (e: any) => Promise<void>;
    }
  }

  interface HTMLMozoMessageTransferSuccessElement extends StencilComponents.MozoMessageTransferSuccess, HTMLStencilElement {}

  var HTMLMozoMessageTransferSuccessElement: {
    prototype: HTMLMozoMessageTransferSuccessElement;
    new (): HTMLMozoMessageTransferSuccessElement;
  };
  interface HTMLElementTagNameMap {
    'mozo-message-transfer-success': HTMLMozoMessageTransferSuccessElement;
  }
  interface ElementTagNameMap {
    'mozo-message-transfer-success': HTMLMozoMessageTransferSuccessElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'mozo-message-transfer-success': JSXElements.MozoMessageTransferSuccessAttributes;
    }
  }
  namespace JSXElements {
    export interface MozoMessageTransferSuccessAttributes extends HTMLAttributes {
      'hash'?: string;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface MozoModal {
      'closeModal': () => void;
      'content': HTMLElement;
      'createModal': (modalContent: any) => Promise<void>;
      'openModal': () => void;
      'title': string;
    }
  }

  interface HTMLMozoModalElement extends StencilComponents.MozoModal, HTMLStencilElement {}

  var HTMLMozoModalElement: {
    prototype: HTMLMozoModalElement;
    new (): HTMLMozoModalElement;
  };
  interface HTMLElementTagNameMap {
    'mozo-modal': HTMLMozoModalElement;
  }
  interface ElementTagNameMap {
    'mozo-modal': HTMLMozoModalElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'mozo-modal': JSXElements.MozoModalAttributes;
    }
  }
  namespace JSXElements {
    export interface MozoModalAttributes extends HTMLAttributes {
      'content'?: HTMLElement;
      'title'?: string;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface MozoTransferForm {
      'amount': number;
      'toAddress': string;
      'transferMozo': (e: any) => Promise<void>;
    }
  }

  interface HTMLMozoTransferFormElement extends StencilComponents.MozoTransferForm, HTMLStencilElement {}

  var HTMLMozoTransferFormElement: {
    prototype: HTMLMozoTransferFormElement;
    new (): HTMLMozoTransferFormElement;
  };
  interface HTMLElementTagNameMap {
    'mozo-transfer-form': HTMLMozoTransferFormElement;
  }
  interface ElementTagNameMap {
    'mozo-transfer-form': HTMLMozoTransferFormElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'mozo-transfer-form': JSXElements.MozoTransferFormAttributes;
    }
  }
  namespace JSXElements {
    export interface MozoTransferFormAttributes extends HTMLAttributes {
      'amount'?: number;
      'toAddress'?: string;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface MozoTransfer {
      'amount': number;
      'toAddress': string;
      'transferMozo': (e: any) => Promise<void>;
      'value': string;
    }
  }

  interface HTMLMozoTransferElement extends StencilComponents.MozoTransfer, HTMLStencilElement {}

  var HTMLMozoTransferElement: {
    prototype: HTMLMozoTransferElement;
    new (): HTMLMozoTransferElement;
  };
  interface HTMLElementTagNameMap {
    'mozo-transfer': HTMLMozoTransferElement;
  }
  interface ElementTagNameMap {
    'mozo-transfer': HTMLMozoTransferElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'mozo-transfer': JSXElements.MozoTransferAttributes;
    }
  }
  namespace JSXElements {
    export interface MozoTransferAttributes extends HTMLAttributes {
      'amount'?: number;
      'toAddress'?: string;
      'value'?: string;
    }
  }
}


declare global {

  namespace StencilComponents {
    interface MyComponent {
      'first': string;
      'last': string;
    }
  }

  interface HTMLMyComponentElement extends StencilComponents.MyComponent, HTMLStencilElement {}

  var HTMLMyComponentElement: {
    prototype: HTMLMyComponentElement;
    new (): HTMLMyComponentElement;
  };
  interface HTMLElementTagNameMap {
    'my-component': HTMLMyComponentElement;
  }
  interface ElementTagNameMap {
    'my-component': HTMLMyComponentElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'my-component': JSXElements.MyComponentAttributes;
    }
  }
  namespace JSXElements {
    export interface MyComponentAttributes extends HTMLAttributes {
      'first'?: string;
      'last'?: string;
    }
  }
}

declare global { namespace JSX { interface StencilJSX {} } }

export declare function defineCustomElements(window: any): void;