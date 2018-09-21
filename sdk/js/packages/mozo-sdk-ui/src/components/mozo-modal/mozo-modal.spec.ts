import { TestWindow } from '@stencil/core/testing';
import { MozoModal } from './mozo-modal';

describe('mozo-modal', () => {
  it('should build', () => {
    expect(new MozoModal()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: HTMLMozoModalElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [MozoModal],
        html: '<mozo-modal></mozo-modal>'
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
