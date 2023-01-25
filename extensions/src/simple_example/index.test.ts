import { createTestSuite } from "$testing";
import Extension from '.';

createTestSuite({ Extension, __dirname },
  {
    unitTests: {
      log: [({ expect }) => {
        const input = "some string";
        let count = 0;
        const { log } = console;
        console.log = (message) => {
          expect(message).toBe(input);
          count++;
        };

        return {
          input,
          after: () => {
            expect(count).toBe(1);
            console.log = log;
          }
        }
      }],
      dummyUI: {
        async after({ ui: { findByText, component: { displayText } }, testHelper: { expect } }) {
          const msg = displayText as string;
          const text = await findByText(msg);
          expect(text).not.toBe(undefined);
          expect(text.innerHTML).toBe(msg);
        }
      },
      counterUI: {
        async after({ extension, ui: { findByText }, testHelper: { expect, fireEvent, updateHTMLInputValue } }) {
          const texts = ["Add 1", "Add", "Reset"];
          const buttons = await Promise.all(texts.map(text => findByText(text)));
          for (const button of buttons) {
            expect(button).not.toBe(undefined);
          }

          const [addOne, addValue, reset] = buttons;
          const valueInput = addValue.nextElementSibling as HTMLInputElement;
          expect(valueInput).not.toBe(undefined);
          expect(valueInput.tagName).toBe("INPUT");

          expect(extension.count).toBe(0);
          for (let index = 0; index < 5; index++) {
            await fireEvent.click(addOne);
            expect(extension.count).toBe(index + 1);
          }

          await fireEvent.click(reset);
          expect(extension.count).toBe(0);

          let valueToAdd = 11;
          await updateHTMLInputValue(valueInput, `${valueToAdd}`);
          await fireEvent.click(addValue);
          expect(extension.count).toBe(valueToAdd);
        }
      },

    },
    integrationTests: undefined
  });