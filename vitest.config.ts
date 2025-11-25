import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        '**/*.spec.ts', 
        '**/*.stub.ts', 
        'src/main.ts', 
        'src/app/app.config.ts',
        'src/app/app.routes.ts',
      ],
    },
  },
});
