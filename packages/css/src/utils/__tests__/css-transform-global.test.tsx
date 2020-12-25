import { transformGlobalCss } from '../css-transform-global';

describe('#css-transform', () => {
  it('should parent root selector', () => {
    const css = transformGlobalCss(`
      h1 {
        font-size: 20px;
      }
    `);

    expect(css).toMatchInlineSnapshot(`":root h1{font-size:20px}"`);
  });
});
