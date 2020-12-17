import { plugin } from 'postcss';
import { parse } from 'postcss-values-parser';

/**
 * We look for any CSS variables that we have placed from interpolations.
 * `{var(--hello-world)}` => `true`
 *
 * @param value
 */
const hasPlacedCssVariable = (value: string): boolean => {
  return !!value.match(/\(var\(--.+\)\)/);
};

/**
 * Will return any prefix, suffix, the new CSS variable name, and CSS variable value.
 *
 * @param value
 */
const extractCssVariableData = (value: string) => {
  const data = value.match(/(^.+\()|(var\(--.+\))|(\).+$)/g);

  console.log(data);

  return {};
};

/**
 * PostCSS plugin which will remove prefix' & suffix' around css variables
 * and then callback with them.
 */
export const extractCssVariables = plugin<{ callback: (sheet: string) => void }>(
  'extract-css-variables',
  () => {
    return (root) => {
      root.walkDecls((decl) => {
        const value = parse(decl.value);

        value.walk((node) => {
          if (node.type === 'quoted' && hasPlacedCssVariable(node.value)) {
            extractCssVariableData(node.value);
          }
        });
      });
    };
  }
);
