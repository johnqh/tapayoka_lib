/**
 * @fileoverview Offering weekly-schedule helpers.
 * @description Day list, availability filtering, default-entry construction, and
 * validation for editing a single day of an offering's schedule. Shared by the
 * web and RN vendor apps.
 */

import type { DailySchedule, DayOfWeek } from '@sudobility/tapayoka_types';

/** Days of the week, Monday-first. */
export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/** Days not already scheduled (available to add). */
export function getAvailableScheduleDays(usedDays: DayOfWeek[]): DayOfWeek[] {
  return DAYS_OF_WEEK.filter(d => !usedDays.includes(d));
}

/** A default new day entry (first available day, 09:00–17:00). */
export function makeDefaultDailySchedule(usedDays: DayOfWeek[]): DailySchedule {
  return {
    dayOfWeek: getAvailableScheduleDays(usedDays)[0] ?? 'Monday',
    startTime: '09:00',
    endTime: '17:00',
  };
}

/** Whether a day entry has all required fields set. */
export function canSaveDailySchedule(
  draft: DailySchedule | null | undefined
): boolean {
  return (
    !!draft &&
    !!draft.dayOfWeek &&
    !!draft.startTime.trim() &&
    !!draft.endTime.trim()
  );
}
