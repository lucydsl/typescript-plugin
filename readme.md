> *Note*: This is a work-in-progress and doesn't work yet.

# TypeScript Language Service Plugin for Lucy

## Installation

Use the plugin by adding it to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "plugins": [{ "name": "@lucy/typescript-plugin" }]
  }
}
```