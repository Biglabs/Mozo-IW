import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'mozo-sdk-ui',
  bundles: [
    { components: ['my-component'] },
    { components: ['mozo-transfer'] }
  ],
  globalStyle: 'src/styles/app.scss',
  plugins: [
    sass()
  ],
  outputTargets: [
    {
      type: 'dist'
    },
    {
      type: 'www',
      serviceWorker: {
        globPatterns: [
          '**/*.{js,css,json,html,ico,png}'
        ]
      }
    }
  ]
};
