export type TripStage =
  | 'idle'
  | 'searching'
  | 'assigned'
  | 'arriving'
  | 'arrived'
  | 'in_trip'
  | 'completed'
  | 'cancelled';

export const tripStageLabels: Record<TripStage, string> = {
  idle: 'Ready to book',
  searching: 'Searching',
  assigned: 'Driver assigned',
  arriving: 'Driver arriving',
  arrived: 'Driver arrived',
  in_trip: 'In trip',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const tripTimeline: TripStage[] = ['searching', 'assigned', 'arriving', 'arrived', 'in_trip', 'completed'];

export function stageIndex(stage: TripStage) {
  return Math.max(0, tripTimeline.indexOf(stage));
}
