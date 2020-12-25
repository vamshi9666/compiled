import { Global } from '@compiled/react';
import { colors } from 'module-a';

export default {
  title: 'global/global',
};

export const GlobalObject = () => (
  <div key="obj">
    <Global styles={{ h1: { fontSize: 30, color: colors.primary } }} />
    <h1>Styled from global object</h1>
  </div>
);

export const GlobalTemplateLiteral = () => (
  <div key="temp">
    <Global
      styles={`
        h2 {
          font-size: 20px;
          color: ${colors.danger};
        }
      `}
    />
    <h2>Styled from global template literal</h2>
  </div>
);

export const GlobalArray = () => (
  <div key="arr">
    <Global
      styles={[
        `
        h3 {
          font-size: 15px;
        }
      `,
        {
          h3: {
            border: `2px solid ${colors.danger}`,
          },
        },
      ]}
    />
    <h3>Styled from global array</h3>
  </div>
);
