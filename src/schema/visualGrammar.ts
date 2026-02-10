export enum ComponentType {
  UsersCluster = 'users_cluster',
  Server = 'server',
  LoadBalancer = 'load_balancer',
  Database = 'database',
  Cache = 'cache',
  Queue = 'queue',
  Cdn = 'cdn',
  Worker = 'worker',
}

export enum AnimationType {
  ZoomIn = 'zoom_in',
  ZoomOut = 'zoom_out',
  PanDown = 'pan_down',
  PanUp = 'pan_up',
  Focus = 'focus',
  Wide = 'wide',
}

export enum CameraActionType {
  ZoomIn = 'zoom_in',
  ZoomOut = 'zoom_out',
  PanDown = 'pan_down',
  PanUp = 'pan_up',
  Focus = 'focus',
  Wide = 'wide',
}

export const ALL_COMPONENT_TYPES = Object.values(ComponentType);
export const ALL_ANIMATION_TYPES = Object.values(AnimationType);
export const ALL_CAMERA_ACTIONS = Object.values(CameraActionType);
