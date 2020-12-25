import * as t from '@babel/types';
import { NodePath } from '@babel/core';
import { compiledTemplate, transformItemCss } from '../utils/ast-builders';
import { buildCss } from '../utils/css-builders';
import { getJsxAttributeExpression, buildCodeFrameError } from '../utils/ast';
import { Metadata } from '../types';

const getStylesProp = (path: NodePath<t.JSXOpeningElement>) => {
  const stylesProp = path.node.attributes.find((attr): attr is t.JSXAttribute => {
    if (t.isJSXAttribute(attr) && attr.name.name === 'styles') {
      return true;
    }

    return false;
  });

  return stylesProp;
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
  const css = buildCss(styles, meta);

  if (css.css.length === 0) {
    path.parentPath.replaceWith(t.nullLiteral());
    return;
  }

  if (css.variables.length > 0) {
    throw buildCodeFrameError(
      `Global component doesn't support dynamic CSS please refactor it to be static`,
      css.variables[0].expression,
      meta.parentPath
    );
  }

  const transformedCSS = transformItemCss(css);

  path.parentPath.replaceWith(compiledTemplate(undefined, transformedCSS.sheets, meta));
}
