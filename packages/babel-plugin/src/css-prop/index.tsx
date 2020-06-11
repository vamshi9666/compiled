import * as t from '@babel/types';
import { NodePath } from '@babel/core';
import { buildCompiledComponent } from '../utils/ast-builders';
import { buildCss } from '../utils/css-builders';

const extractFromCssProp = (
  node: t.StringLiteral | t.JSXElement | t.JSXFragment | t.JSXExpressionContainer
) => {
  if (t.isStringLiteral(node)) {
    return buildCss(node);
  }

  if (t.isJSXExpressionContainer(node) && t.isObjectExpression(node.expression)) {
    return buildCss(node.expression);
  }

  return undefined;
};

export const visitCssPropPath = (path: NodePath<t.JSXOpeningElement>) => {
  let cssPropIndex = -1;
  const cssProp = path.node.attributes.find((attr, index): attr is t.JSXAttribute => {
    if (t.isJSXAttribute(attr) && attr.name.name === 'css') {
      cssPropIndex = index;
      return true;
    }

    return false;
  });

  if (!cssProp || !cssProp.value) {
    return;
  }

  // Remove css prop
  path.node.attributes.splice(cssPropIndex, 1);

  const extractedCss = extractFromCssProp(cssProp.value);
  if (extractedCss === undefined) {
    throw path.buildCodeFrameError('Css prop value not allowed.');
  }

  path.parentPath.replaceWith(
    buildCompiledComponent({
      css: extractedCss,
      node: path.parentPath.node as t.JSXElement,
    })
  );
};
