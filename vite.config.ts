import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

// JavaScript on purpose: the same runner is used directly by npm scripts.
// @ts-expect-error No declaration file is needed for this development-only script.
import { runExampleTests } from './scripts/example-test-runner.mjs';

const TEST_ENDPOINT = '/__atmaterialform/tests/run';
const MAX_REQUEST_BYTES = 8 * 1024;

const isLoopbackAddress = (address?: string | null) => (
  !address
  || address === '127.0.0.1'
  || address === '::1'
  || address === '::ffff:127.0.0.1'
);

const exampleTestRunnerPlugin = (): Plugin => {
  let activeRun = false;

  return {
    name: 'atmaterialform-example-test-runner',
    apply: 'serve',

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const requestUrl = new URL(req.url || '/', 'http://localhost');

        if (requestUrl.pathname !== TEST_ENDPOINT) {
          next();
          return;
        }

        res.setHeader('content-type', 'application/json; charset=utf-8');
        res.setHeader('cache-control', 'no-store');

        if (!isLoopbackAddress(req.socket.remoteAddress)) {
          res.statusCode = 403;
          res.end(JSON.stringify({
            error: 'The example test runner is only available from the local development server.',
          }));
          return;
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed.' }));
          return;
        }

        if (activeRun) {
          res.statusCode = 409;
          res.end(JSON.stringify({
            error: 'Another example test is already running. Finish that run before starting another.',
          }));
          return;
        }

        let rawBody = '';

        try {
          for await (const chunk of req) {
            rawBody += chunk.toString();

            if (Buffer.byteLength(rawBody, 'utf8') > MAX_REQUEST_BYTES) {
              res.statusCode = 413;
              res.end(JSON.stringify({ error: 'Request body is too large.' }));
              return;
            }
          }

          const body = JSON.parse(rawBody || '{}') as {
            action?: unknown;
            exampleId?: unknown;
          };

          if (
            typeof body.exampleId !== 'string'
            || (
              body.action !== 'regression'
              && body.action !== 'performance'
              && body.action !== 'visual-update'
            )
          ) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid example test request.' }));
            return;
          }

          activeRun = true;

          // Do not reuse the playground dev-server URL here. The spawned
          // Playwright process owns an isolated Vite test server (4173), just
          // like the CLI suites do. This keeps UI-triggered tests independent
          // from whatever port the main playground happens to use.
          const result = await runExampleTests({
            exampleId: body.exampleId,
            kind: body.action,
          });

          // A failed test is a valid runner result, not an HTTP transport error.
          // Keep the response successful so the browser console does not show
          // a noisy 422 while the UI can still display status: "failed".
          res.statusCode = 200;
          res.end(JSON.stringify(result));
        } catch (error) {
          res.statusCode = 500;
          res.end(JSON.stringify({
            error: error instanceof Error ? error.message : String(error),
          }));
        } finally {
          activeRun = false;
        }
      });
    },
  };
};

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    exampleTestRunnerPlugin(),
  ],

  server: {
    hmr: true,
    open: mode !== 'test',
  },

  resolve: {
    tsconfigPaths: true,
  },

  build: {
    sourcemap: true,
  },
}));
