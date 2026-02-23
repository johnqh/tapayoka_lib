# tapayoka_lib

Business logic library with Zustand stores for Tapayoka. Wraps tapayoka_client hooks with client-side caching.

## Package: `@sudobility/tapayoka_lib` (restricted)

## Architecture

- **Stores**: Zustand stores for devices, services, orders, analytics
- **Manager hooks**: Wrap client hooks + stores for entity-scoped caching
- Pattern: manager hook fetches via client hook, syncs to store, returns store data

## Commands

```bash
bun run build && bun run typecheck && bun run lint && bun run test
```

## Peer Dependencies

tapayoka_client, tapayoka_types, @sudobility/types, react, @tanstack/react-query, zustand
