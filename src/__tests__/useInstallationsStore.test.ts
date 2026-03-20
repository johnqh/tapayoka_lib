import { describe, it, expect, beforeEach } from 'vitest';
import { useOfferingsStore } from '../business/stores/useOfferingsStore';
import type { Offering } from '@sudobility/tapayoka_types';

const mockOffering = (
  id: string,
  type: 'TRIGGER' | 'FIXED' | 'VARIABLE' = 'FIXED'
): Offering => ({
  id,
  entityId: 'entity-1',
  name: `Offering ${id}`,
  description: null,
  type,
  priceCents: 100,
  fixedMinutes: type === 'FIXED' ? 30 : null,
  minutesPer25c: type === 'VARIABLE' ? 5 : null,
  active: true,
  createdAt: null,
  updatedAt: null,
});

describe('useOfferingsStore', () => {
  beforeEach(() => {
    useOfferingsStore.getState().reset();
  });

  it('starts empty', () => {
    const state = useOfferingsStore.getState();
    expect(state.offerings).toEqual([]);
    expect(state.isLoaded).toBe(false);
  });

  it('setOfferings sets data and marks loaded', () => {
    const offerings = [mockOffering('s1'), mockOffering('s2', 'VARIABLE')];
    useOfferingsStore.getState().setOfferings(offerings, 'my-entity');
    const state = useOfferingsStore.getState();
    expect(state.offerings).toHaveLength(2);
    expect(state.isLoaded).toBe(true);
    expect(state.entitySlug).toBe('my-entity');
  });

  it('addOffering appends', () => {
    useOfferingsStore.getState().setOfferings([mockOffering('s1')], 'e');
    useOfferingsStore.getState().addOffering(mockOffering('s2'));
    expect(useOfferingsStore.getState().offerings).toHaveLength(2);
  });

  it('updateOffering merges updates', () => {
    useOfferingsStore.getState().setOfferings([mockOffering('s1')], 'e');
    useOfferingsStore
      .getState()
      .updateOffering('s1', { name: 'Renamed', priceCents: 200 });
    const inst = useOfferingsStore.getState().offerings[0];
    expect(inst.name).toBe('Renamed');
    expect(inst.priceCents).toBe(200);
  });

  it('removeOffering removes by id', () => {
    useOfferingsStore
      .getState()
      .setOfferings([mockOffering('s1'), mockOffering('s2')], 'e');
    useOfferingsStore.getState().removeOffering('s1');
    expect(useOfferingsStore.getState().offerings).toHaveLength(1);
    expect(useOfferingsStore.getState().offerings[0].id).toBe('s2');
  });

  it('reset clears state', () => {
    useOfferingsStore.getState().setOfferings([mockOffering('s1')], 'e');
    useOfferingsStore.getState().reset();
    expect(useOfferingsStore.getState().offerings).toEqual([]);
    expect(useOfferingsStore.getState().isLoaded).toBe(false);
  });
});
