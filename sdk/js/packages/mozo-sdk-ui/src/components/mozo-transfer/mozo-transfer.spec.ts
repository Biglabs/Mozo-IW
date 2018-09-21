import { TestWindow } from '@stencil/core/testing';
import { MozoTransfer } from './mozo-transfer';

describe('mozo-transfer', () => {
  it('should build', () => {
    expect(new MozoTransfer()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: HTMLMozoTransferElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [MozoTransfer],
        html: '<mozo-transfer></mozo-transfer>'
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
