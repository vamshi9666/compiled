import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import nested from 'postcss-nested';
import whitespace from 'postcss-normalize-whitespace';
import { normalizeCSS } from '../plugins/normalize-css';

/**
 * Will transform CSS into a global sheet.
 *
 * @param css CSS string
 */
export const transformGlobalCss = (css: string): string => {
  const globalCSS = `:root { ${css} }`;

  const result = postcss([nested(), ...normalizeCSS(), autoprefixer(), whitespace]).process(
    globalCSS,
    {
      from: undefined,
    }
  );

  return result.css;
};
