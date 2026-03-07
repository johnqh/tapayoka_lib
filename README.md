# @sudobility/tapayoka_lib

Business logic library for Tapayoka with Zustand stores for client-side caching.

## Installation

```bash
bun add @sudobility/tapayoka_lib
```

## Usage

```typescript
import { useDevicesManager, useOrdersManager } from '@sudobility/tapayoka_lib';

// Manager hooks fetch via client hooks, sync to Zustand stores, return cached data
const { devices, isLoading, refresh } = useDevicesManager(networkClient, baseUrl, entitySlug, token);
```

## Architecture

- **Stores**: Zustand stores for devices, services, orders, analytics
- **Manager hooks**: Wrap `tapayoka_client` hooks with entity-scoped caching
- Pattern: manager hook fetches via client hook, syncs to store, returns store data

## Development

```bash
bun run build        # Build to dist/
bun run test         # Run tests
bun run typecheck    # TypeScript check
bun run lint         # ESLint
```

## Related Packages

- `@sudobility/tapayoka_client` -- API hooks (peer dependency)
- `@sudobility/tapayoka_types` -- Type definitions
- `tapayoka_vendor_app` / `tapayoka_buyer_app_rn` -- Consumer apps

## License

BUSL-1.1
