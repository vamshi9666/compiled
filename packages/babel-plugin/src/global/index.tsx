import * as t from '@babel/types';
import { NodePath } from '@babel/core';
import { transformGlobalCss } from '@compiled/css';
import { compiledTemplate } from '../utils/ast-builders';
import { buildCss, getItemCss } from '../utils/css-builders';
import { CSSOutput } from '../utils/types';
import { getJsxAttributeExpression, buildCodeFrameError } from '../utils/ast';
import { Metadata } from '../types';

/**
 * Returns a `styles` prop if one is found.
 *
 * @param path
 */
const getStylesProp = (path: NodePath<t.JSXOpeningElement>) => {
  const stylesProp = path.node.attributes.find((attr): attr is t.JSXAttribute => {
    if (t.isJSXAttribute(attr) && attr.name.name === 'styles') {
      return true;
    }

    return false;
  });

  return stylesProp;
};

/**
 * Combines all CSS sheets into one.
 *
 * @param cssOutput
 * @param meta
 */
const mergeCSSOutput = (cssOutput: CSSOutput, meta: Metadata): string => {
  let CSS = '';

  cssOutput.css.forEach((item) => {
    CSS += getItemCss(item);

    if (item.type !== 'unconditional') {
      throw buildCodeFrameError(
        "Global component doesn't support conditional CSS rules",
        item.expression,
        meta.parentPath
      );
    }
  });

  return CSS;
};

export function visitGlobalPath(path: NodePath<t.JSXOpeningElement>, meta: Metadata): void {
  if (!t.isJSXIdentifier(path.node.name) || path.node.name.name !== 'Global') {
    return;
  }

  const stylesProp = getStylesProp(path);
  if (!stylesProp) {
    path.parentPath.replaceWith(t.nullLiteral());
    return;
  }

  const styles = getJsxAttributeExpression(stylesProp);
  const rawCSS = buildCss(styles, meta);

  if (rawCSS.css.length === 0) {
    path.parentPath.replaceWith(t.nullLiteral());
    return;
  }

  if (rawCSS.variables.length > 0) {
    throw buildCodeFrameError(
      `Global component doesn't support dynamic CSS declarations`,
      rawCSS.variables[0].expression,
      meta.parentPath
    );
  }

  const CSS = transformGlobalCss(mergeCSSOutput(rawCSS, meta));

  path.parentPath.replaceWith(compiledTemplate(undefined, [CSS], meta));
}
