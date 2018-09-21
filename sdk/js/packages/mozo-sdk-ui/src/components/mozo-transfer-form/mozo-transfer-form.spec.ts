import { TestWindow } from '@stencil/core/testing';
import { MozoTransferForm } from './mozo-transfer-form';

describe('mozo-transfer-form', () => {
  it('should build', () => {
    expect(new MozoTransferForm()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: HTMLMozoTransferFormElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [MozoTransferForm],
        html: '<mozo-transfer-form></mozo-transfer-form>'
      });
    });

    // it('should work without parameters', () => {
    //   expect(element.textContent.trim()).toEqual('Hello, World! I\'m');
    // });

    // it('should work with a test name', async () => {
    //   element.test = 'Peter';
    //   await testWindow.flush();
    //   expect(element.textContent.trim()).toEqual('Hello, World! I\'m Peter');
    // });

    // it('should work with a test2 name', async () => {
    //   element.test2 = 'Parker';
    //   await testWindow.flush();
    //   expect(element.textContent.trim()).toEqual('Hello, World! I\'m  Parker');
    // });

    // it('should work with both a test and a test2 name', async () => {
    //   element.test = 'Peter';
    //   element.test2 = 'Parker';
    //   await testWindow.flush();
    //   expect(element.textContent.trim()).toEqual('Hello, World! I\'m Peter Parker');
    // });
  });
});
