import { describe, it, expect, beforeEach } from 'vitest';
import { useServicesStore } from '../business/stores/useServicesStore';
import type { Service } from '@sudobility/tapayoka_types';

const mockService = (id: string, type: 'TRIGGER' | 'FIXED' | 'VARIABLE' = 'FIXED'): Service => ({
  id,
  entityId: 'entity-1',
  name: `Service ${id}`,
  description: null,
  type,
  priceCents: 100,
  fixedMinutes: type === 'FIXED' ? 30 : null,
  minutesPer25c: type === 'VARIABLE' ? 5 : null,
  active: true,
  createdAt: null,
  updatedAt: null,
});

describe('useServicesStore', () => {
  beforeEach(() => {
    useServicesStore.getState().reset();
  });

  it('starts empty', () => {
    const state = useServicesStore.getState();
    expect(state.services).toEqual([]);
    expect(state.isLoaded).toBe(false);
  });

  it('setServices sets data and marks loaded', () => {
    const services = [mockService('s1'), mockService('s2', 'VARIABLE')];
    useServicesStore.getState().setServices(services, 'my-entity');
    const state = useServicesStore.getState();
    expect(state.services).toHaveLength(2);
    expect(state.isLoaded).toBe(true);
    expect(state.entitySlug).toBe('my-entity');
  });

  it('addService appends', () => {
    useServicesStore.getState().setServices([mockService('s1')], 'e');
    useServicesStore.getState().addService(mockService('s2'));
    expect(useServicesStore.getState().services).toHaveLength(2);
  });

  it('updateService merges updates', () => {
    useServicesStore.getState().setServices([mockService('s1')], 'e');
    useServicesStore.getState().updateService('s1', { name: 'Renamed', priceCents: 200 });
    const svc = useServicesStore.getState().services[0];
    expect(svc.name).toBe('Renamed');
    expect(svc.priceCents).toBe(200);
  });

  it('removeService removes by id', () => {
    useServicesStore.getState().setServices([mockService('s1'), mockService('s2')], 'e');
    useServicesStore.getState().removeService('s1');
    expect(useServicesStore.getState().services).toHaveLength(1);
    expect(useServicesStore.getState().services[0].id).toBe('s2');
  });

  it('reset clears state', () => {
    useServicesStore.getState().setServices([mockService('s1')], 'e');
    useServicesStore.getState().reset();
    expect(useServicesStore.getState().services).toEqual([]);
    expect(useServicesStore.getState().isLoaded).toBe(false);
  });
});
