import postcss from 'postcss';
import { extractCssVariables } from '../extract-css-variables';

const transform = (css: TemplateStringsArray) => {
  const result = postcss([extractCssVariables()]).process(css[0], {
    from: undefined,
  });

  return result.css;
};

describe('discard dupicates plugin', () => {
  it('should remove suffix and prefix', () => {
    const actual = transform`
      content: "var(--hello-world)";
    `;

    expect(actual).toMatchInlineSnapshot(`
      "
            content: var(--hello-world);
          "
    `);
  });
});
