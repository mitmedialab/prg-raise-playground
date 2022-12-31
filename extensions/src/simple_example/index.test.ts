import { createTestSuite } from "$testing";
import Extension from '.';

createTestSuite({ Extension, __dirname },
  {
    unitTests: {
      log: [({ expect }) => {
        const input = "Tfst string";
        let count = 0;
        const actualConsole = console;
        console = {
          ...console,
          log: (message) => {
            expect(message).toBe(input);
            count++;
          }
        };
        return {
          input,
          after: () => {
            expect(count).toBe(1);
            console = actualConsole;
          }
        }
      }],
      dummyUI: {
        async after(extension, ui) {
          const msg = "Hello, world!";
          const text = await ui.findByText(msg);
          this.expect(text).not.toBe(undefined);
          this.expect(text.innerHTML).toBe(msg);
        }
      },
      counterUI: {
        async after(extension, { findByText }) {
          const texts = ["Add 1", "Add", "Reset"];
          const buttons = await Promise.all(texts.map(text => findByText(text)));
          for (const button of buttons) {
            this.expect(button).not.toBe(undefined);
          }

          const [addOne, addValue, reset] = buttons;
          const valueInput = addValue.nextElementSibling as HTMLInputElement;
          this.expect(valueInput).not.toBe(undefined);
          this.expect(valueInput.tagName).toBe("INPUT");

          this.expect(extension.count).toBe(0);
          for (let index = 0; index < 5; index++) {
            await this.fireEvent.click(addOne);
            this.expect(extension.count).toBe(index + 1);
          }

          await this.fireEvent.click(reset);
          this.expect(extension.count).toBe(0);

          let valueToAdd = 11;
          await this.updateInputValue(valueInput, `${valueToAdd}`);
          await this.fireEvent.click(addValue);
          this.expect(extension.count).toBe(valueToAdd);
        }
      },

    },
    integrationTests: undefined
  });