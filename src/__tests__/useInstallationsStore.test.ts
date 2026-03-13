import { describe, it, expect, beforeEach } from 'vitest';
import { useInstallationsStore } from '../business/stores/useInstallationsStore';
import type { Installation } from '@sudobility/tapayoka_types';

const mockInstallation = (id: string, type: 'TRIGGER' | 'FIXED' | 'VARIABLE' = 'FIXED'): Installation => ({
  id,
  entityId: 'entity-1',
  name: `Installation ${id}`,
  description: null,
  type,
  priceCents: 100,
  fixedMinutes: type === 'FIXED' ? 30 : null,
  minutesPer25c: type === 'VARIABLE' ? 5 : null,
  active: true,
  createdAt: null,
  updatedAt: null,
});

describe('useInstallationsStore', () => {
  beforeEach(() => {
    useInstallationsStore.getState().reset();
  });

  it('starts empty', () => {
    const state = useInstallationsStore.getState();
    expect(state.installations).toEqual([]);
    expect(state.isLoaded).toBe(false);
  });

  it('setInstallations sets data and marks loaded', () => {
    const installations = [mockInstallation('s1'), mockInstallation('s2', 'VARIABLE')];
    useInstallationsStore.getState().setInstallations(installations, 'my-entity');
    const state = useInstallationsStore.getState();
    expect(state.installations).toHaveLength(2);
    expect(state.isLoaded).toBe(true);
    expect(state.entitySlug).toBe('my-entity');
  });

  it('addInstallation appends', () => {
    useInstallationsStore.getState().setInstallations([mockInstallation('s1')], 'e');
    useInstallationsStore.getState().addInstallation(mockInstallation('s2'));
    expect(useInstallationsStore.getState().installations).toHaveLength(2);
  });

  it('updateInstallation merges updates', () => {
    useInstallationsStore.getState().setInstallations([mockInstallation('s1')], 'e');
    useInstallationsStore.getState().updateInstallation('s1', { name: 'Renamed', priceCents: 200 });
    const inst = useInstallationsStore.getState().installations[0];
    expect(inst.name).toBe('Renamed');
    expect(inst.priceCents).toBe(200);
  });

  it('removeInstallation removes by id', () => {
    useInstallationsStore.getState().setInstallations([mockInstallation('s1'), mockInstallation('s2')], 'e');
    useInstallationsStore.getState().removeInstallation('s1');
    expect(useInstallationsStore.getState().installations).toHaveLength(1);
    expect(useInstallationsStore.getState().installations[0].id).toBe('s2');
  });

  it('reset clears state', () => {
    useInstallationsStore.getState().setInstallations([mockInstallation('s1')], 'e');
    useInstallationsStore.getState().reset();
    expect(useInstallationsStore.getState().installations).toEqual([]);
    expect(useInstallationsStore.getState().isLoaded).toBe(false);
  });
});
