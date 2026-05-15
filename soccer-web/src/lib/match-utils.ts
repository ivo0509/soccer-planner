/**
 * Match state and capacity utilities
 */

export type MatchState = "upcoming" | "current" | "past";
export type CapacityStatus = "full" | "under" | "over";

/**
 * Determines if a match is upcoming, current, or past
 * - upcoming: start time not yet reached
 * - current: started but less than 1 hour has passed
 * - past: more than 1 hour since start time
 */
export function getMatchState(
  startDate: Date,
  startTime: string
): MatchState {
  const [hours, minutes] = startTime.split(":").map(Number);
  const matchStart = new Date(startDate);
  matchStart.setHours(hours, minutes, 0, 0);

  const now = new Date();
  const timeDiff = now.getTime() - matchStart.getTime();
  const hoursPassed = timeDiff / (1000 * 60 * 60);

  if (timeDiff < 0) {
    return "upcoming";
  } else if (hoursPassed < 1) {
    return "current";
  } else {
    return "past";
  }
}

/**
 * Determines if a match is active (can be joined/unjoined)
 * - Active if it's upcoming or current AND not canceled
 */
export function isMatchActive(
  state: MatchState,
  canceled: boolean
): boolean {
  return !canceled && (state === "upcoming" || state === "current");
}

/**
 * Determines the capacity status of a match
 */
export function getCapacityStatus(
  currentCount: number,
  capacity: number
): CapacityStatus {
  if (currentCount > capacity) {
    return "over";
  } else if (currentCount === capacity) {
    return "full";
  } else {
    return "under";
  }
}

/**
 * Formats a time string (HH:MM) for display
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
}

/**
 * Formats a date and time for display
 */
export function formatDateTime(date: Date, time: string): string {
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = formatTime(time);
  return `${dateStr} at ${timeStr}`;
}

/**
 * Gets the display label for match state
 */
export function getStateLabel(
  state: MatchState,
  canceled: boolean
): string {
  if (canceled) {
    return "Canceled";
  }
  switch (state) {
    case "upcoming":
      return "Upcoming";
    case "current":
      return "Current";
    case "past":
      return "Past";
  }
}

/**
 * Gets the display label for capacity status
 */
export function getCapacityLabel(status: CapacityStatus): string {
  switch (status) {
    case "full":
      return "Full Capacity";
    case "under":
      return "Under Capacity";
    case "over":
      return "Over Capacity";
  }
}
