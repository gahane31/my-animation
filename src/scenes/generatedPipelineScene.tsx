/** @jsxImportSource @motion-canvas/2d/lib */
import {Line, Node, Rect, makeScene2D, Txt} from '@motion-canvas/2d';
import {all, createRef} from '@motion-canvas/core';
import {StyleTokens} from '../config/styleTokens.js';
import {
  createRuntimeLogger,
  createSceneState,
  executeScene,
  validateSceneForRuntime,
} from '../motion/sceneExecutor.js';
import {advanceTimeline, createTimelineState, waitUntil} from '../motion/timeline.js';
import type {MotionRenderSpec} from '../motion/types.js';

const renderSpec = {
  "duration": 60,
  "scenes": [
    {
      "id": "s1-baseline-direct",
      "start": 0,
      "end": 6,
      "narration": "Users send requests straight to a worker, and work starts immediately.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "icon": "users",
          "position": {
            "x": 50,
            "y": 12.32
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 162,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.897944098839728,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 57.455999999999996,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "sourceEntityId": "worker",
          "label": "Worker",
          "icon": "cpu",
          "position": {
            "x": 50,
            "y": 68.18
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 162,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.897944098839728,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 57.455999999999996,
            "fontWeight": 600,
            "status": "active"
          }
        }
      ],
      "entities": [
        {
          "id": "users",
          "type": "users_cluster",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Users",
          "icon": "users",
          "layout": {
            "x": 50,
            "y": 12.32
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Worker",
          "icon": "cpu",
          "layout": {
            "x": 50,
            "y": 68.18
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_worker_request",
          "from": "users",
          "to": "worker",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_worker_request_fwd",
          "from": "users",
          "to": "worker",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "worker",
        "zoom": 1
      },
      "directives": {
        "camera": {
          "mode": "follow_action",
          "zoom": "wide",
          "active_zone": "upper_third",
          "reserve_bottom_percent": 25
        },
        "visual": {
          "theme": "default",
          "background_texture": "grid",
          "glow_strength": "soft"
        },
        "motion": {
          "entry_style": "draw_in",
          "pacing": "balanced"
        },
        "flow": {
          "renderer": "hybrid"
        }
      },
      "source": {
        "entities": [
          {
            "id": "users",
            "type": "users_cluster",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Users",
            "icon": "users",
            "layout": {
              "x": 50,
              "y": 12.32
            }
          },
          {
            "id": "worker",
            "type": "worker",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Worker",
            "icon": "cpu",
            "layout": {
              "x": 50,
              "y": 68.18
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_worker_request",
            "from": "users",
            "to": "worker",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_worker_request_fwd",
            "from": "users",
            "to": "worker",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "worker",
          "zoom": 1
        }
      },
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "users"
          },
          {
            "type": "entity_added",
            "entityId": "worker"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_users_to_worker_request"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_users_to_worker_request_fwd"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": null,
            "to": {
              "mode": "focus",
              "target": "worker",
              "zoom": 1
            }
          }
        ]
      },
      "hierarchyTransition": null,
      "plan": {
        "phaseOrder": [
          "removals",
          "moves",
          "additions",
          "connections",
          "interactions",
          "camera"
        ],
        "removals": [],
        "moves": [],
        "additions": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "add",
            "enter": "zoom_in"
          },
          {
            "entityId": "worker",
            "elementIds": [
              "worker"
            ],
            "action": "add",
            "enter": "zoom_in"
          }
        ],
        "connections": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "connect",
            "connectionId": "c_users_to_worker_request"
          },
          {
            "entityId": "worker",
            "elementIds": [
              "worker"
            ],
            "action": "connect",
            "connectionId": "c_users_to_worker_request"
          }
        ],
        "interactions": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_worker_request_fwd"
          },
          {
            "entityId": "worker",
            "elementIds": [
              "worker"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_worker_request_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "users",
            "action": "add",
            "delay": 1.7999999999999998,
            "duration": 0.54,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "isPrimary": false
          },
          {
            "entityId": "worker",
            "action": "add",
            "delay": 1.882,
            "duration": 0.62,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_users_to_worker_request",
            "delay": 0.504,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "users",
            "type": "users_cluster",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Users",
            "icon": "users",
            "layout": {
              "x": 50,
              "y": 12.32
            }
          },
          {
            "id": "worker",
            "type": "worker",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Worker",
            "icon": "cpu",
            "layout": {
              "x": 50,
              "y": 68.18
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [],
        "updatedEntities": [],
        "addedConnections": [
          {
            "id": "c_users_to_worker_request",
            "from": "users",
            "to": "worker",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [],
        "addedInteractions": [
          {
            "id": "i_c_users_to_worker_request_fwd",
            "from": "users",
            "to": "worker",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": null,
          "to": {
            "mode": "focus",
            "target": "worker",
            "zoom": 1
          }
        }
      }
    },
    {
      "id": "s2-spike-overload",
      "start": 6,
      "end": 12,
      "narration": "A traffic spike hits, and the worker overloads under the burst.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "icon": "users",
          "position": {
            "x": 50,
            "y": 12.32
          },
          "visualStyle": {
            "size": 162,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.897944098839728,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 57.455999999999996,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "sourceEntityId": "worker",
          "label": "Worker",
          "icon": "cpu",
          "position": {
            "x": 50,
            "y": 68.18
          },
          "visualStyle": {
            "size": 162,
            "opacity": 1,
            "color": "#EF4444",
            "strokeWidth": 2.897944098839728,
            "strokeColor": "#EF4444",
            "glow": false,
            "glowColor": "#EF4444",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 57.455999999999996,
            "fontWeight": 600,
            "status": "overloaded"
          }
        }
      ],
      "entities": [
        {
          "id": "users",
          "type": "users_cluster",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Users",
          "icon": "users",
          "layout": {
            "x": 50,
            "y": 12.32
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "count": 1,
          "importance": "primary",
          "status": "overloaded",
          "label": "Worker",
          "icon": "cpu",
          "layout": {
            "x": 50,
            "y": 68.18
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_worker_request",
          "from": "users",
          "to": "worker",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_worker_request_fwd",
          "from": "users",
          "to": "worker",
          "type": "burst",
          "intensity": "high"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "worker",
        "zoom": 1.1
      },
      "directives": {
        "camera": {
          "mode": "follow_action",
          "zoom": "medium",
          "active_zone": "upper_third",
          "reserve_bottom_percent": 25
        },
        "visual": {
          "theme": "default",
          "background_texture": "grid",
          "glow_strength": "soft"
        },
        "motion": {
          "entry_style": "draw_in",
          "pacing": "balanced"
        },
        "flow": {
          "renderer": "hybrid"
        }
      },
      "source": {
        "entities": [
          {
            "id": "users",
            "type": "users_cluster",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Users",
            "icon": "users",
            "layout": {
              "x": 50,
              "y": 12.32
            }
          },
          {
            "id": "worker",
            "type": "worker",
            "count": 1,
            "importance": "primary",
            "status": "overloaded",
            "label": "Worker",
            "icon": "cpu",
            "layout": {
              "x": 50,
              "y": 68.18
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_worker_request",
            "from": "users",
            "to": "worker",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_worker_request_fwd",
            "from": "users",
            "to": "worker",
            "type": "burst",
            "intensity": "high"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "worker",
          "zoom": 1.1
        }
      },
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_status_changed",
            "entityId": "worker",
            "from": "active",
            "to": "overloaded"
          }
        ],
        "connectionDiffs": [],
        "interactionDiffs": [
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_users_to_worker_request_fwd",
            "from": "medium",
            "to": "high"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "worker",
              "zoom": 1
            },
            "to": {
              "mode": "focus",
              "target": "worker",
              "zoom": 1.1
            }
          }
        ]
      },
      "hierarchyTransition": null,
      "plan": {
        "phaseOrder": [
          "removals",
          "moves",
          "additions",
          "connections",
          "interactions",
          "camera"
        ],
        "removals": [],
        "moves": [],
        "additions": [],
        "connections": [],
        "interactions": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_worker_request_fwd"
          },
          {
            "entityId": "worker",
            "elementIds": [
              "worker"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_worker_request_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [],
        "connections": [],
        "camera": null
      },
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [],
        "removedEntities": [],
        "movedEntities": [],
        "updatedEntities": [
          {
            "id": "worker",
            "changes": {
              "status": {
                "from": "active",
                "to": "overloaded"
              }
            }
          }
        ],
        "addedConnections": [],
        "removedConnections": [],
        "addedInteractions": [],
        "removedInteractions": [],
        "interactionIntensityChanged": [
          {
            "id": "i_c_users_to_worker_request_fwd",
            "from": "medium",
            "to": "high"
          }
        ],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "worker",
            "zoom": 1
          },
          "to": {
            "mode": "focus",
            "target": "worker",
            "zoom": 1.1
          }
        }
      }
    },
    {
      "id": "s3-insert-queue-buffer",
      "start": 12,
      "end": 18,
      "narration": "A message queue is inserted, so requests become queued tasks.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "icon": "users",
          "position": {
            "x": 50,
            "y": 9.66
          },
          "visualStyle": {
            "size": 149.4,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.7829653249726274,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 52.987199999999994,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "message_queue",
          "type": "message_queue",
          "sourceEntityId": "message_queue",
          "label": "Message Queue",
          "icon": "inbox",
          "position": {
            "x": 50,
            "y": 40.25
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 149.4,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.7829653249726274,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 52.987199999999994,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "sourceEntityId": "worker",
          "label": "Worker",
          "icon": "cpu",
          "position": {
            "x": 50,
            "y": 70.84
          },
          "visualStyle": {
            "size": 149.4,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.7829653249726274,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 52.987199999999994,
            "fontWeight": 600,
            "status": "active"
          }
        }
      ],
      "entities": [
        {
          "id": "users",
          "type": "users_cluster",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Users",
          "icon": "users",
          "layout": {
            "x": 50,
            "y": 9.66
          }
        },
        {
          "id": "message_queue",
          "type": "message_queue",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Message Queue",
          "icon": "inbox",
          "layout": {
            "x": 50,
            "y": 40.25
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Worker",
          "icon": "cpu",
          "layout": {
            "x": 50,
            "y": 70.84
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_queue_ingestion",
          "from": "users",
          "to": "message_queue",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_queue_to_worker_dispatch",
          "from": "message_queue",
          "to": "worker",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_queue_ingestion_fwd",
          "from": "users",
          "to": "message_queue",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_queue_to_worker_dispatch_fwd",
          "from": "message_queue",
          "to": "worker",
          "type": "broadcast",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "message_queue",
        "zoom": 1
      },
      "directives": {
        "camera": {
          "mode": "follow_action",
          "zoom": "wide",
          "active_zone": "upper_third",
          "reserve_bottom_percent": 25
        },
        "visual": {
          "theme": "default",
          "background_texture": "grid",
          "glow_strength": "soft"
        },
        "motion": {
          "entry_style": "draw_in",
          "pacing": "balanced"
        },
        "flow": {
          "renderer": "hybrid"
        }
      },
      "source": {
        "entities": [
          {
            "id": "users",
            "type": "users_cluster",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Users",
            "icon": "users",
            "layout": {
              "x": 50,
              "y": 9.66
            }
          },
          {
            "id": "message_queue",
            "type": "message_queue",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Message Queue",
            "icon": "inbox",
            "layout": {
              "x": 50,
              "y": 40.25
            }
          },
          {
            "id": "worker",
            "type": "worker",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Worker",
            "icon": "cpu",
            "layout": {
              "x": 50,
              "y": 70.84
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_queue_ingestion",
            "from": "users",
            "to": "message_queue",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_queue_to_worker_dispatch",
            "from": "message_queue",
            "to": "worker",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_queue_ingestion_fwd",
            "from": "users",
            "to": "message_queue",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_queue_to_worker_dispatch_fwd",
            "from": "message_queue",
            "to": "worker",
            "type": "broadcast",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "message_queue",
          "zoom": 1
        }
      },
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "message_queue"
          },
          {
            "type": "entity_moved",
            "entityId": "users",
            "from": {
              "x": 50,
              "y": 12.32
            },
            "to": {
              "x": 50,
              "y": 9.66
            }
          },
          {
            "type": "entity_moved",
            "entityId": "worker",
            "from": {
              "x": 50,
              "y": 68.18
            },
            "to": {
              "x": 50,
              "y": 70.84
            }
          },
          {
            "type": "entity_status_changed",
            "entityId": "worker",
            "from": "overloaded",
            "to": "active"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "worker",
            "from": "primary",
            "to": "secondary"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_users_to_queue_ingestion"
          },
          {
            "type": "connection_added",
            "connectionId": "c_queue_to_worker_dispatch"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_users_to_worker_request"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_users_to_queue_ingestion_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_queue_to_worker_dispatch_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_users_to_worker_request_fwd"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "worker",
              "zoom": 1.1
            },
            "to": {
              "mode": "focus",
              "target": "message_queue",
              "zoom": 1
            }
          }
        ]
      },
      "hierarchyTransition": null,
      "plan": {
        "phaseOrder": [
          "removals",
          "moves",
          "additions",
          "connections",
          "interactions",
          "camera"
        ],
        "removals": [],
        "moves": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "move"
          },
          {
            "entityId": "worker",
            "elementIds": [
              "worker"
            ],
            "action": "move"
          }
        ],
        "additions": [
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue"
            ],
            "action": "add",
            "enter": "zoom_in",
            "cleanup": false
          }
        ],
        "connections": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "connect",
            "connectionId": "c_users_to_worker_request",
            "cleanup": false
          },
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue"
            ],
            "action": "connect",
            "connectionId": "c_queue_to_worker_dispatch",
            "cleanup": false
          },
          {
            "entityId": "worker",
            "elementIds": [
              "worker"
            ],
            "action": "connect",
            "connectionId": "c_users_to_worker_request",
            "cleanup": false
          }
        ],
        "interactions": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_worker_request_fwd",
            "cleanup": false
          },
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue"
            ],
            "action": "interact",
            "interactionId": "i_c_queue_to_worker_dispatch_fwd",
            "cleanup": false
          },
          {
            "entityId": "worker",
            "elementIds": [
              "worker"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_worker_request_fwd",
            "cleanup": false
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "users",
            "action": "move",
            "delay": 0.6000000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "worker",
            "action": "move",
            "delay": 0.68,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "message_queue",
            "action": "add",
            "delay": 1.8499999999999999,
            "duration": 0.62,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_users_to_queue_ingestion",
            "delay": 0.504,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "connectionId": "c_queue_to_worker_dispatch",
            "delay": 0.584,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "connectionId": "c_users_to_worker_request",
            "delay": 0.664,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "message_queue",
            "type": "message_queue",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Message Queue",
            "icon": "inbox",
            "layout": {
              "x": 50,
              "y": 40.25
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "users",
            "from": {
              "x": 50,
              "y": 12.32
            },
            "to": {
              "x": 50,
              "y": 9.66
            }
          },
          {
            "id": "worker",
            "from": {
              "x": 50,
              "y": 68.18
            },
            "to": {
              "x": 50,
              "y": 70.84
            }
          }
        ],
        "updatedEntities": [
          {
            "id": "worker",
            "changes": {
              "status": {
                "from": "overloaded",
                "to": "active"
              },
              "importance": {
                "from": "primary",
                "to": "secondary"
              }
            }
          }
        ],
        "addedConnections": [
          {
            "id": "c_users_to_queue_ingestion",
            "from": "users",
            "to": "message_queue",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_queue_to_worker_dispatch",
            "from": "message_queue",
            "to": "worker",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [
          {
            "id": "c_users_to_worker_request",
            "from": "users",
            "to": "worker",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "addedInteractions": [
          {
            "id": "i_c_users_to_queue_ingestion_fwd",
            "from": "users",
            "to": "message_queue",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_queue_to_worker_dispatch_fwd",
            "from": "message_queue",
            "to": "worker",
            "type": "broadcast",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_users_to_worker_request_fwd",
            "from": "users",
            "to": "worker",
            "type": "burst",
            "intensity": "high"
          }
        ],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "worker",
            "zoom": 1.1
          },
          "to": {
            "mode": "focus",
            "target": "message_queue",
            "zoom": 1
          }
        }
      }
    },
    {
      "id": "s4-burst-piles-into-queue",
      "start": 18,
      "end": 24,
      "narration": "The burst piles up safely inside the queue as a growing backlog.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "icon": "users",
          "position": {
            "x": 50,
            "y": 9.66
          },
          "visualStyle": {
            "size": 149.4,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.7829653249726274,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 52.987199999999994,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "message_queue",
          "type": "message_queue",
          "sourceEntityId": "message_queue",
          "label": "Message Queue",
          "icon": "inbox",
          "position": {
            "x": 50,
            "y": 40.25
          },
          "visualStyle": {
            "size": 149.4,
            "opacity": 1,
            "color": "#EF4444",
            "strokeWidth": 2.7829653249726274,
            "strokeColor": "#EF4444",
            "glow": false,
            "glowColor": "#EF4444",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 52.987199999999994,
            "fontWeight": 600,
            "status": "overloaded"
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "sourceEntityId": "worker",
          "label": "Worker",
          "icon": "cpu",
          "position": {
            "x": 50,
            "y": 70.84
          },
          "visualStyle": {
            "size": 149.4,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.7829653249726274,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 52.987199999999994,
            "fontWeight": 600,
            "status": "active"
          }
        }
      ],
      "entities": [
        {
          "id": "users",
          "type": "users_cluster",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Users",
          "icon": "users",
          "layout": {
            "x": 50,
            "y": 9.66
          }
        },
        {
          "id": "message_queue",
          "type": "message_queue",
          "count": 1,
          "importance": "primary",
          "status": "overloaded",
          "label": "Message Queue",
          "icon": "inbox",
          "layout": {
            "x": 50,
            "y": 40.25
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Worker",
          "icon": "cpu",
          "layout": {
            "x": 50,
            "y": 70.84
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_queue_ingestion",
          "from": "users",
          "to": "message_queue",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_queue_to_worker_dispatch",
          "from": "message_queue",
          "to": "worker",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_queue_ingestion_fwd",
          "from": "users",
          "to": "message_queue",
          "type": "burst",
          "intensity": "high"
        },
        {
          "id": "i_c_queue_to_worker_dispatch_fwd",
          "from": "message_queue",
          "to": "worker",
          "type": "broadcast",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "message_queue",
        "zoom": 1.1
      },
      "directives": {
        "camera": {
          "mode": "follow_action",
          "zoom": "medium",
          "active_zone": "upper_third",
          "reserve_bottom_percent": 25
        },
        "visual": {
          "theme": "default",
          "background_texture": "grid",
          "glow_strength": "soft"
        },
        "motion": {
          "entry_style": "draw_in",
          "pacing": "balanced"
        },
        "flow": {
          "renderer": "hybrid"
        }
      },
      "source": {
        "entities": [
          {
            "id": "users",
            "type": "users_cluster",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Users",
            "icon": "users",
            "layout": {
              "x": 50,
              "y": 9.66
            }
          },
          {
            "id": "message_queue",
            "type": "message_queue",
            "count": 1,
            "importance": "primary",
            "status": "overloaded",
            "label": "Message Queue",
            "icon": "inbox",
            "layout": {
              "x": 50,
              "y": 40.25
            }
          },
          {
            "id": "worker",
            "type": "worker",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Worker",
            "icon": "cpu",
            "layout": {
              "x": 50,
              "y": 70.84
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_queue_ingestion",
            "from": "users",
            "to": "message_queue",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_queue_to_worker_dispatch",
            "from": "message_queue",
            "to": "worker",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_queue_ingestion_fwd",
            "from": "users",
            "to": "message_queue",
            "type": "burst",
            "intensity": "high"
          },
          {
            "id": "i_c_queue_to_worker_dispatch_fwd",
            "from": "message_queue",
            "to": "worker",
            "type": "broadcast",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "message_queue",
          "zoom": 1.1
        }
      },
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_status_changed",
            "entityId": "message_queue",
            "from": "active",
            "to": "overloaded"
          }
        ],
        "connectionDiffs": [],
        "interactionDiffs": [
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_users_to_queue_ingestion_fwd",
            "from": "medium",
            "to": "high"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "message_queue",
              "zoom": 1
            },
            "to": {
              "mode": "focus",
              "target": "message_queue",
              "zoom": 1.1
            }
          }
        ]
      },
      "hierarchyTransition": null,
      "plan": {
        "phaseOrder": [
          "removals",
          "moves",
          "additions",
          "connections",
          "interactions",
          "camera"
        ],
        "removals": [],
        "moves": [],
        "additions": [],
        "connections": [],
        "interactions": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_queue_ingestion_fwd"
          },
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_queue_ingestion_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [],
        "connections": [],
        "camera": null
      },
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [],
        "removedEntities": [],
        "movedEntities": [],
        "updatedEntities": [
          {
            "id": "message_queue",
            "changes": {
              "status": {
                "from": "active",
                "to": "overloaded"
              }
            }
          }
        ],
        "addedConnections": [],
        "removedConnections": [],
        "addedInteractions": [],
        "removedInteractions": [],
        "interactionIntensityChanged": [
          {
            "id": "i_c_users_to_queue_ingestion_fwd",
            "from": "medium",
            "to": "high"
          }
        ],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "message_queue",
            "zoom": 1
          },
          "to": {
            "mode": "focus",
            "target": "message_queue",
            "zoom": 1.1
          }
        }
      }
    },
    {
      "id": "s5-workers-pull-steady",
      "start": 24,
      "end": 30,
      "narration": "Workers pull from the queue at a steady, controlled rate.",
      "elements": [
        {
          "id": "message_queue",
          "type": "message_queue",
          "sourceEntityId": "message_queue",
          "label": "Message Queue",
          "icon": "inbox",
          "position": {
            "x": 50,
            "y": 12.32
          },
          "visualStyle": {
            "size": 162,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.897944098839728,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 57.455999999999996,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "sourceEntityId": "worker",
          "label": "Worker",
          "icon": "cpu",
          "position": {
            "x": 50,
            "y": 68.18
          },
          "visualStyle": {
            "size": 162,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.897944098839728,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 57.455999999999996,
            "fontWeight": 600,
            "status": "active"
          }
        }
      ],
      "entities": [
        {
          "id": "message_queue",
          "type": "message_queue",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Message Queue",
          "icon": "inbox",
          "layout": {
            "x": 50,
            "y": 12.32
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Worker",
          "icon": "cpu",
          "layout": {
            "x": 50,
            "y": 68.18
          }
        }
      ],
      "connections": [
        {
          "id": "c_queue_to_worker_dispatch",
          "from": "message_queue",
          "to": "worker",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_queue_to_worker_dispatch_fwd",
          "from": "message_queue",
          "to": "worker",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "message_queue",
        "zoom": 1.18
      },
      "directives": {
        "camera": {
          "mode": "follow_action",
          "zoom": "tight",
          "active_zone": "upper_third",
          "reserve_bottom_percent": 25
        },
        "visual": {
          "theme": "default",
          "background_texture": "grid",
          "glow_strength": "soft"
        },
        "motion": {
          "entry_style": "draw_in",
          "pacing": "balanced"
        },
        "flow": {
          "renderer": "hybrid"
        }
      },
      "source": {
        "entities": [
          {
            "id": "message_queue",
            "type": "message_queue",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Message Queue",
            "icon": "inbox",
            "layout": {
              "x": 50,
              "y": 12.32
            }
          },
          {
            "id": "worker",
            "type": "worker",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Worker",
            "icon": "cpu",
            "layout": {
              "x": 50,
              "y": 68.18
            }
          }
        ],
        "connections": [
          {
            "id": "c_queue_to_worker_dispatch",
            "from": "message_queue",
            "to": "worker",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_queue_to_worker_dispatch_fwd",
            "from": "message_queue",
            "to": "worker",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "message_queue",
          "zoom": 1.18
        }
      },
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_removed",
            "entityId": "users"
          },
          {
            "type": "entity_moved",
            "entityId": "message_queue",
            "from": {
              "x": 50,
              "y": 40.25
            },
            "to": {
              "x": 50,
              "y": 12.32
            }
          },
          {
            "type": "entity_moved",
            "entityId": "worker",
            "from": {
              "x": 50,
              "y": 70.84
            },
            "to": {
              "x": 50,
              "y": 68.18
            }
          },
          {
            "type": "entity_status_changed",
            "entityId": "message_queue",
            "from": "overloaded",
            "to": "active"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_removed",
            "connectionId": "c_users_to_queue_ingestion"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_removed",
            "interactionId": "i_c_users_to_queue_ingestion_fwd"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "message_queue",
              "zoom": 1.1
            },
            "to": {
              "mode": "focus",
              "target": "message_queue",
              "zoom": 1.18
            }
          }
        ]
      },
      "hierarchyTransition": null,
      "plan": {
        "phaseOrder": [
          "removals",
          "moves",
          "additions",
          "connections",
          "interactions",
          "camera"
        ],
        "removals": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "remove",
            "exit": "zoom_out",
            "cleanup": true
          }
        ],
        "moves": [
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue"
            ],
            "action": "move"
          },
          {
            "entityId": "worker",
            "elementIds": [
              "worker"
            ],
            "action": "move"
          }
        ],
        "additions": [],
        "connections": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "connect",
            "connectionId": "c_users_to_queue_ingestion"
          },
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue"
            ],
            "action": "connect",
            "connectionId": "c_users_to_queue_ingestion"
          }
        ],
        "interactions": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_queue_ingestion_fwd"
          },
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_queue_ingestion_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "users",
            "action": "remove",
            "delay": 0,
            "duration": 0.9,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "message_queue",
            "action": "move",
            "delay": 0.6000000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "worker",
            "action": "move",
            "delay": 0.68,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "connections": [
          {
            "connectionId": "c_users_to_queue_ingestion",
            "delay": 0.504,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [],
        "removedEntities": [
          {
            "id": "users",
            "type": "users_cluster",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Users",
            "icon": "users",
            "layout": {
              "x": 50,
              "y": 9.66
            }
          }
        ],
        "movedEntities": [
          {
            "id": "message_queue",
            "from": {
              "x": 50,
              "y": 40.25
            },
            "to": {
              "x": 50,
              "y": 12.32
            }
          },
          {
            "id": "worker",
            "from": {
              "x": 50,
              "y": 70.84
            },
            "to": {
              "x": 50,
              "y": 68.18
            }
          }
        ],
        "updatedEntities": [
          {
            "id": "message_queue",
            "changes": {
              "status": {
                "from": "overloaded",
                "to": "active"
              }
            }
          }
        ],
        "addedConnections": [],
        "removedConnections": [
          {
            "id": "c_users_to_queue_ingestion",
            "from": "users",
            "to": "message_queue",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "addedInteractions": [],
        "removedInteractions": [
          {
            "id": "i_c_users_to_queue_ingestion_fwd",
            "from": "users",
            "to": "message_queue",
            "type": "burst",
            "intensity": "high"
          }
        ],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "message_queue",
            "zoom": 1.1
          },
          "to": {
            "mode": "focus",
            "target": "message_queue",
            "zoom": 1.18
          }
        }
      }
    },
    {
      "id": "s6-scale-queue-brokers",
      "start": 30,
      "end": 36,
      "narration": "We scale out the message queue so buffering capacity grows.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "icon": "users",
          "position": {
            "x": 50,
            "y": 9.66
          },
          "visualStyle": {
            "size": 122.4,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.5189712185731703,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 43.4112,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "message_queue_1",
          "type": "message_queue",
          "sourceEntityId": "message_queue",
          "icon": "inbox",
          "position": {
            "x": 27.635555555555552,
            "y": 40.25
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 122.4,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.5189712185731703,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 43.4112,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "message_queue",
          "type": "message_queue",
          "sourceEntityId": "message_queue",
          "label": "Message Queue",
          "icon": "inbox",
          "position": {
            "x": 50,
            "y": 40.25
          },
          "visualStyle": {
            "size": 122.4,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.5189712185731703,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 43.4112,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "message_queue_3",
          "type": "message_queue",
          "sourceEntityId": "message_queue",
          "icon": "inbox",
          "position": {
            "x": 72.36444444444444,
            "y": 40.25
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 122.4,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.5189712185731703,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 43.4112,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "sourceEntityId": "worker",
          "label": "Worker",
          "icon": "cpu",
          "position": {
            "x": 50,
            "y": 70.84
          },
          "visualStyle": {
            "size": 122.4,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.5189712185731703,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 43.4112,
            "fontWeight": 600,
            "status": "active"
          }
        }
      ],
      "entities": [
        {
          "id": "users",
          "type": "users_cluster",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Users",
          "icon": "users",
          "layout": {
            "x": 50,
            "y": 9.66
          }
        },
        {
          "id": "message_queue",
          "type": "message_queue",
          "count": 3,
          "importance": "primary",
          "status": "active",
          "label": "Message Queue",
          "icon": "inbox",
          "layout": {
            "x": 50,
            "y": 40.25
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Worker",
          "icon": "cpu",
          "layout": {
            "x": 50,
            "y": 70.84
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_queue_ingestion",
          "from": "users",
          "to": "message_queue",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_queue_to_worker_dispatch",
          "from": "message_queue",
          "to": "worker",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_queue_ingestion_fwd",
          "from": "users",
          "to": "message_queue",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_queue_to_worker_dispatch_fwd",
          "from": "message_queue",
          "to": "worker",
          "type": "broadcast",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "message_queue",
        "zoom": 1
      },
      "directives": {
        "camera": {
          "mode": "follow_action",
          "zoom": "wide",
          "active_zone": "upper_third",
          "reserve_bottom_percent": 25
        },
        "visual": {
          "theme": "default",
          "background_texture": "grid",
          "glow_strength": "soft"
        },
        "motion": {
          "entry_style": "draw_in",
          "pacing": "balanced"
        },
        "flow": {
          "renderer": "hybrid"
        }
      },
      "source": {
        "entities": [
          {
            "id": "users",
            "type": "users_cluster",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Users",
            "icon": "users",
            "layout": {
              "x": 50,
              "y": 9.66
            }
          },
          {
            "id": "message_queue",
            "type": "message_queue",
            "count": 3,
            "importance": "primary",
            "status": "active",
            "label": "Message Queue",
            "icon": "inbox",
            "layout": {
              "x": 50,
              "y": 40.25
            }
          },
          {
            "id": "worker",
            "type": "worker",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Worker",
            "icon": "cpu",
            "layout": {
              "x": 50,
              "y": 70.84
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_queue_ingestion",
            "from": "users",
            "to": "message_queue",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_queue_to_worker_dispatch",
            "from": "message_queue",
            "to": "worker",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_queue_ingestion_fwd",
            "from": "users",
            "to": "message_queue",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_queue_to_worker_dispatch_fwd",
            "from": "message_queue",
            "to": "worker",
            "type": "broadcast",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "message_queue",
          "zoom": 1
        }
      },
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "users"
          },
          {
            "type": "entity_moved",
            "entityId": "message_queue",
            "from": {
              "x": 50,
              "y": 12.32
            },
            "to": {
              "x": 50,
              "y": 40.25
            }
          },
          {
            "type": "entity_moved",
            "entityId": "worker",
            "from": {
              "x": 50,
              "y": 68.18
            },
            "to": {
              "x": 50,
              "y": 70.84
            }
          },
          {
            "type": "entity_count_changed",
            "entityId": "message_queue",
            "from": 1,
            "to": 3
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_users_to_queue_ingestion"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_users_to_queue_ingestion_fwd"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "message_queue",
              "zoom": 1.18
            },
            "to": {
              "mode": "focus",
              "target": "message_queue",
              "zoom": 1
            }
          }
        ]
      },
      "hierarchyTransition": null,
      "plan": {
        "phaseOrder": [
          "removals",
          "moves",
          "additions",
          "connections",
          "interactions",
          "camera"
        ],
        "removals": [],
        "moves": [
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue_1",
              "message_queue",
              "message_queue_3"
            ],
            "action": "move"
          },
          {
            "entityId": "worker",
            "elementIds": [
              "worker"
            ],
            "action": "move"
          }
        ],
        "additions": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "add",
            "enter": "zoom_in"
          },
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue_1",
              "message_queue",
              "message_queue_3"
            ],
            "action": "add",
            "enter": "zoom_in"
          }
        ],
        "connections": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "connect",
            "connectionId": "c_users_to_queue_ingestion"
          },
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue_1",
              "message_queue",
              "message_queue_3"
            ],
            "action": "connect",
            "connectionId": "c_users_to_queue_ingestion"
          }
        ],
        "interactions": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_queue_ingestion_fwd"
          },
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue_1",
              "message_queue",
              "message_queue_3"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_queue_ingestion_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "message_queue",
            "action": "move",
            "delay": 0.6000000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "worker",
            "action": "move",
            "delay": 0.68,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "users",
            "action": "add",
            "delay": 1.7999999999999998,
            "duration": 0.54,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "isPrimary": false
          }
        ],
        "connections": [
          {
            "connectionId": "c_users_to_queue_ingestion",
            "delay": 0.504,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "users",
            "type": "users_cluster",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Users",
            "icon": "users",
            "layout": {
              "x": 50,
              "y": 9.66
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "message_queue",
            "from": {
              "x": 50,
              "y": 12.32
            },
            "to": {
              "x": 50,
              "y": 40.25
            }
          },
          {
            "id": "worker",
            "from": {
              "x": 50,
              "y": 68.18
            },
            "to": {
              "x": 50,
              "y": 70.84
            }
          }
        ],
        "updatedEntities": [
          {
            "id": "message_queue",
            "changes": {
              "count": {
                "from": 1,
                "to": 3
              }
            }
          }
        ],
        "addedConnections": [
          {
            "id": "c_users_to_queue_ingestion",
            "from": "users",
            "to": "message_queue",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [],
        "addedInteractions": [
          {
            "id": "i_c_users_to_queue_ingestion_fwd",
            "from": "users",
            "to": "message_queue",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "message_queue",
            "zoom": 1.18
          },
          "to": {
            "mode": "focus",
            "target": "message_queue",
            "zoom": 1
          }
        }
      }
    },
    {
      "id": "s7-retry-to-dlq",
      "start": 36,
      "end": 42,
      "narration": "Failed tasks are retried, and stubborn ones go to a dead letter queue.",
      "elements": [
        {
          "id": "message_queue",
          "type": "message_queue",
          "sourceEntityId": "message_queue",
          "label": "Message Queue",
          "icon": "inbox",
          "position": {
            "x": 50,
            "y": 7.664999999999999
          },
          "visualStyle": {
            "size": 135,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.645448922205832,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 47.879999999999995,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "sourceEntityId": "worker",
          "label": "Worker",
          "icon": "cpu",
          "position": {
            "x": 50,
            "y": 29.38833333333334
          },
          "visualStyle": {
            "size": 135,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.645448922205832,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 47.879999999999995,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "retry_policy",
          "type": "retry_policy",
          "sourceEntityId": "retry_policy",
          "label": "Retry Policy",
          "icon": "rotate-cw",
          "position": {
            "x": 50,
            "y": 51.11166666666668
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 135,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.645448922205832,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 47.879999999999995,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "dead_letter_queue",
          "type": "dead_letter_queue",
          "sourceEntityId": "dead_letter_queue",
          "label": "Dead Letter Queue",
          "icon": "archive",
          "position": {
            "x": 50,
            "y": 72.83500000000001
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 135,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.645448922205832,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 47.879999999999995,
            "fontWeight": 600,
            "status": "active"
          }
        }
      ],
      "entities": [
        {
          "id": "message_queue",
          "type": "message_queue",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Message Queue",
          "icon": "inbox",
          "layout": {
            "x": 50,
            "y": 7.664999999999999
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Worker",
          "icon": "cpu",
          "layout": {
            "x": 50,
            "y": 29.38833333333334
          }
        },
        {
          "id": "retry_policy",
          "type": "retry_policy",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Retry Policy",
          "icon": "rotate-cw",
          "layout": {
            "x": 50,
            "y": 51.11166666666668
          }
        },
        {
          "id": "dead_letter_queue",
          "type": "dead_letter_queue",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Dead Letter Queue",
          "icon": "archive",
          "layout": {
            "x": 50,
            "y": 72.83500000000001
          }
        }
      ],
      "connections": [
        {
          "id": "c_queue_to_worker_dispatch",
          "from": "message_queue",
          "to": "worker",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_worker_to_retry_policy_retry",
          "from": "worker",
          "to": "retry_policy",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_retry_policy_to_dlq_retry",
          "from": "retry_policy",
          "to": "dead_letter_queue",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_worker_to_dlq_async_event",
          "from": "worker",
          "to": "dead_letter_queue",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_queue_to_worker_dispatch_fwd",
          "from": "message_queue",
          "to": "worker",
          "type": "broadcast",
          "intensity": "medium"
        },
        {
          "id": "i_c_worker_to_retry_policy_retry_fwd",
          "from": "worker",
          "to": "retry_policy",
          "type": "burst",
          "intensity": "medium"
        },
        {
          "id": "i_c_retry_policy_to_dlq_retry_fwd",
          "from": "retry_policy",
          "to": "dead_letter_queue",
          "type": "burst",
          "intensity": "low"
        },
        {
          "id": "i_c_worker_to_dlq_async_event_fwd",
          "from": "worker",
          "to": "dead_letter_queue",
          "type": "broadcast",
          "intensity": "low"
        }
      ],
      "sourceCamera": {
        "mode": "wide",
        "zoom": 1
      },
      "directives": {
        "camera": {
          "mode": "follow_action",
          "zoom": "wide",
          "active_zone": "upper_third",
          "reserve_bottom_percent": 25
        },
        "visual": {
          "theme": "default",
          "background_texture": "grid",
          "glow_strength": "soft"
        },
        "motion": {
          "entry_style": "draw_in",
          "pacing": "balanced"
        },
        "flow": {
          "renderer": "hybrid"
        }
      },
      "source": {
        "entities": [
          {
            "id": "message_queue",
            "type": "message_queue",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Message Queue",
            "icon": "inbox",
            "layout": {
              "x": 50,
              "y": 7.664999999999999
            }
          },
          {
            "id": "worker",
            "type": "worker",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Worker",
            "icon": "cpu",
            "layout": {
              "x": 50,
              "y": 29.38833333333334
            }
          },
          {
            "id": "retry_policy",
            "type": "retry_policy",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Retry Policy",
            "icon": "rotate-cw",
            "layout": {
              "x": 50,
              "y": 51.11166666666668
            }
          },
          {
            "id": "dead_letter_queue",
            "type": "dead_letter_queue",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Dead Letter Queue",
            "icon": "archive",
            "layout": {
              "x": 50,
              "y": 72.83500000000001
            }
          }
        ],
        "connections": [
          {
            "id": "c_queue_to_worker_dispatch",
            "from": "message_queue",
            "to": "worker",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_worker_to_retry_policy_retry",
            "from": "worker",
            "to": "retry_policy",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_retry_policy_to_dlq_retry",
            "from": "retry_policy",
            "to": "dead_letter_queue",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_worker_to_dlq_async_event",
            "from": "worker",
            "to": "dead_letter_queue",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_queue_to_worker_dispatch_fwd",
            "from": "message_queue",
            "to": "worker",
            "type": "broadcast",
            "intensity": "medium"
          },
          {
            "id": "i_c_worker_to_retry_policy_retry_fwd",
            "from": "worker",
            "to": "retry_policy",
            "type": "burst",
            "intensity": "medium"
          },
          {
            "id": "i_c_retry_policy_to_dlq_retry_fwd",
            "from": "retry_policy",
            "to": "dead_letter_queue",
            "type": "burst",
            "intensity": "low"
          },
          {
            "id": "i_c_worker_to_dlq_async_event_fwd",
            "from": "worker",
            "to": "dead_letter_queue",
            "type": "broadcast",
            "intensity": "low"
          }
        ],
        "camera": {
          "mode": "wide",
          "zoom": 1
        }
      },
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "retry_policy"
          },
          {
            "type": "entity_added",
            "entityId": "dead_letter_queue"
          },
          {
            "type": "entity_removed",
            "entityId": "users"
          },
          {
            "type": "entity_moved",
            "entityId": "message_queue",
            "from": {
              "x": 50,
              "y": 40.25
            },
            "to": {
              "x": 50,
              "y": 7.664999999999999
            }
          },
          {
            "type": "entity_moved",
            "entityId": "worker",
            "from": {
              "x": 50,
              "y": 70.84
            },
            "to": {
              "x": 50,
              "y": 29.38833333333334
            }
          },
          {
            "type": "entity_count_changed",
            "entityId": "message_queue",
            "from": 3,
            "to": 1
          },
          {
            "type": "entity_importance_changed",
            "entityId": "message_queue",
            "from": "primary",
            "to": "secondary"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_worker_to_retry_policy_retry"
          },
          {
            "type": "connection_added",
            "connectionId": "c_retry_policy_to_dlq_retry"
          },
          {
            "type": "connection_added",
            "connectionId": "c_worker_to_dlq_async_event"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_users_to_queue_ingestion"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_worker_to_retry_policy_retry_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_retry_policy_to_dlq_retry_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_worker_to_dlq_async_event_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_users_to_queue_ingestion_fwd"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "message_queue",
              "zoom": 1
            },
            "to": {
              "mode": "wide",
              "zoom": 1
            }
          }
        ]
      },
      "hierarchyTransition": null,
      "plan": {
        "phaseOrder": [
          "removals",
          "moves",
          "additions",
          "connections",
          "interactions",
          "camera"
        ],
        "removals": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "remove",
            "exit": "zoom_out",
            "cleanup": true
          },
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue_1",
              "message_queue_3"
            ],
            "action": "remove",
            "exit": "zoom_out",
            "cleanup": true
          }
        ],
        "moves": [
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue"
            ],
            "action": "move"
          },
          {
            "entityId": "worker",
            "elementIds": [
              "worker"
            ],
            "action": "move"
          }
        ],
        "additions": [
          {
            "entityId": "retry_policy",
            "elementIds": [
              "retry_policy"
            ],
            "action": "add",
            "enter": "zoom_in"
          },
          {
            "entityId": "dead_letter_queue",
            "elementIds": [
              "dead_letter_queue"
            ],
            "action": "add",
            "enter": "zoom_in",
            "cleanup": false
          }
        ],
        "connections": [
          {
            "entityId": "worker",
            "elementIds": [
              "worker"
            ],
            "action": "connect",
            "connectionId": "c_worker_to_dlq_async_event",
            "cleanup": false
          },
          {
            "entityId": "retry_policy",
            "elementIds": [
              "retry_policy"
            ],
            "action": "connect",
            "connectionId": "c_retry_policy_to_dlq_retry",
            "cleanup": false
          },
          {
            "entityId": "dead_letter_queue",
            "elementIds": [
              "dead_letter_queue"
            ],
            "action": "connect",
            "connectionId": "c_worker_to_dlq_async_event",
            "cleanup": false
          },
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "connect",
            "connectionId": "c_users_to_queue_ingestion"
          },
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue"
            ],
            "action": "connect",
            "connectionId": "c_users_to_queue_ingestion"
          }
        ],
        "interactions": [
          {
            "entityId": "worker",
            "elementIds": [
              "worker"
            ],
            "action": "interact",
            "interactionId": "i_c_worker_to_dlq_async_event_fwd",
            "cleanup": false
          },
          {
            "entityId": "retry_policy",
            "elementIds": [
              "retry_policy"
            ],
            "action": "interact",
            "interactionId": "i_c_retry_policy_to_dlq_retry_fwd",
            "cleanup": false
          },
          {
            "entityId": "dead_letter_queue",
            "elementIds": [
              "dead_letter_queue"
            ],
            "action": "interact",
            "interactionId": "i_c_worker_to_dlq_async_event_fwd",
            "cleanup": false
          },
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_queue_ingestion_fwd"
          },
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_queue_ingestion_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "users",
            "action": "remove",
            "delay": 0,
            "duration": 0.9,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "message_queue",
            "action": "move",
            "delay": 0.6000000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "worker",
            "action": "move",
            "delay": 0.68,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "retry_policy",
            "action": "add",
            "delay": 1.7999999999999998,
            "duration": 0.54,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "isPrimary": false
          },
          {
            "entityId": "dead_letter_queue",
            "action": "add",
            "delay": 1.882,
            "duration": 0.62,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_worker_to_retry_policy_retry",
            "delay": 0.504,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "connectionId": "c_retry_policy_to_dlq_retry",
            "delay": 0.584,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "connectionId": "c_worker_to_dlq_async_event",
            "delay": 0.664,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "connectionId": "c_users_to_queue_ingestion",
            "delay": 0.744,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "retry_policy",
            "type": "retry_policy",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Retry Policy",
            "icon": "rotate-cw",
            "layout": {
              "x": 50,
              "y": 51.11166666666668
            }
          },
          {
            "id": "dead_letter_queue",
            "type": "dead_letter_queue",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Dead Letter Queue",
            "icon": "archive",
            "layout": {
              "x": 50,
              "y": 72.83500000000001
            }
          }
        ],
        "removedEntities": [
          {
            "id": "users",
            "type": "users_cluster",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Users",
            "icon": "users",
            "layout": {
              "x": 50,
              "y": 9.66
            }
          }
        ],
        "movedEntities": [
          {
            "id": "message_queue",
            "from": {
              "x": 50,
              "y": 40.25
            },
            "to": {
              "x": 50,
              "y": 7.664999999999999
            }
          },
          {
            "id": "worker",
            "from": {
              "x": 50,
              "y": 70.84
            },
            "to": {
              "x": 50,
              "y": 29.38833333333334
            }
          }
        ],
        "updatedEntities": [
          {
            "id": "message_queue",
            "changes": {
              "count": {
                "from": 3,
                "to": 1
              },
              "importance": {
                "from": "primary",
                "to": "secondary"
              }
            }
          }
        ],
        "addedConnections": [
          {
            "id": "c_worker_to_retry_policy_retry",
            "from": "worker",
            "to": "retry_policy",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_retry_policy_to_dlq_retry",
            "from": "retry_policy",
            "to": "dead_letter_queue",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_worker_to_dlq_async_event",
            "from": "worker",
            "to": "dead_letter_queue",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [
          {
            "id": "c_users_to_queue_ingestion",
            "from": "users",
            "to": "message_queue",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "addedInteractions": [
          {
            "id": "i_c_worker_to_retry_policy_retry_fwd",
            "from": "worker",
            "to": "retry_policy",
            "type": "burst",
            "intensity": "medium"
          },
          {
            "id": "i_c_retry_policy_to_dlq_retry_fwd",
            "from": "retry_policy",
            "to": "dead_letter_queue",
            "type": "burst",
            "intensity": "low"
          },
          {
            "id": "i_c_worker_to_dlq_async_event_fwd",
            "from": "worker",
            "to": "dead_letter_queue",
            "type": "broadcast",
            "intensity": "low"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_users_to_queue_ingestion_fwd",
            "from": "users",
            "to": "message_queue",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "message_queue",
            "zoom": 1
          },
          "to": {
            "mode": "wide",
            "zoom": 1
          }
        }
      }
    },
    {
      "id": "s8-backlog-drains",
      "start": 42,
      "end": 48,
      "narration": "The spike ends, and the queue backlog drains smoothly over time.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "icon": "users",
          "position": {
            "x": 50,
            "y": 7.664999999999999
          },
          "visualStyle": {
            "size": 135,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.645448922205832,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 47.879999999999995,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "message_queue",
          "type": "message_queue",
          "sourceEntityId": "message_queue",
          "label": "Message Queue",
          "icon": "inbox",
          "position": {
            "x": 50,
            "y": 29.38833333333334
          },
          "visualStyle": {
            "size": 135,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.645448922205832,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 47.879999999999995,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "sourceEntityId": "worker",
          "label": "Worker",
          "icon": "cpu",
          "position": {
            "x": 50,
            "y": 51.11166666666668
          },
          "visualStyle": {
            "size": 135,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.645448922205832,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 47.879999999999995,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "dead_letter_queue",
          "type": "dead_letter_queue",
          "sourceEntityId": "dead_letter_queue",
          "label": "Dead Letter Queue",
          "icon": "archive",
          "position": {
            "x": 50,
            "y": 72.83500000000001
          },
          "visualStyle": {
            "size": 135,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.645448922205832,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 47.879999999999995,
            "fontWeight": 600,
            "status": "active"
          }
        }
      ],
      "entities": [
        {
          "id": "users",
          "type": "users_cluster",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Users",
          "icon": "users",
          "layout": {
            "x": 50,
            "y": 7.664999999999999
          }
        },
        {
          "id": "message_queue",
          "type": "message_queue",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Message Queue",
          "icon": "inbox",
          "layout": {
            "x": 50,
            "y": 29.38833333333334
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Worker",
          "icon": "cpu",
          "layout": {
            "x": 50,
            "y": 51.11166666666668
          }
        },
        {
          "id": "dead_letter_queue",
          "type": "dead_letter_queue",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Dead Letter Queue",
          "icon": "archive",
          "layout": {
            "x": 50,
            "y": 72.83500000000001
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_queue_ingestion",
          "from": "users",
          "to": "message_queue",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_queue_to_worker_dispatch",
          "from": "message_queue",
          "to": "worker",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_worker_to_dlq_async_event",
          "from": "worker",
          "to": "dead_letter_queue",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_queue_ingestion_fwd",
          "from": "users",
          "to": "message_queue",
          "type": "flow",
          "intensity": "low"
        },
        {
          "id": "i_c_queue_to_worker_dispatch_fwd",
          "from": "message_queue",
          "to": "worker",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_worker_to_dlq_async_event_fwd",
          "from": "worker",
          "to": "dead_letter_queue",
          "type": "broadcast",
          "intensity": "low"
        }
      ],
      "sourceCamera": {
        "mode": "wide",
        "zoom": 1
      },
      "directives": {
        "camera": {
          "mode": "follow_action",
          "zoom": "wide",
          "active_zone": "upper_third",
          "reserve_bottom_percent": 25
        },
        "visual": {
          "theme": "default",
          "background_texture": "grid",
          "glow_strength": "soft"
        },
        "motion": {
          "entry_style": "draw_in",
          "pacing": "balanced"
        },
        "flow": {
          "renderer": "hybrid"
        }
      },
      "source": {
        "entities": [
          {
            "id": "users",
            "type": "users_cluster",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Users",
            "icon": "users",
            "layout": {
              "x": 50,
              "y": 7.664999999999999
            }
          },
          {
            "id": "message_queue",
            "type": "message_queue",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Message Queue",
            "icon": "inbox",
            "layout": {
              "x": 50,
              "y": 29.38833333333334
            }
          },
          {
            "id": "worker",
            "type": "worker",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Worker",
            "icon": "cpu",
            "layout": {
              "x": 50,
              "y": 51.11166666666668
            }
          },
          {
            "id": "dead_letter_queue",
            "type": "dead_letter_queue",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Dead Letter Queue",
            "icon": "archive",
            "layout": {
              "x": 50,
              "y": 72.83500000000001
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_queue_ingestion",
            "from": "users",
            "to": "message_queue",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_queue_to_worker_dispatch",
            "from": "message_queue",
            "to": "worker",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_worker_to_dlq_async_event",
            "from": "worker",
            "to": "dead_letter_queue",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_queue_ingestion_fwd",
            "from": "users",
            "to": "message_queue",
            "type": "flow",
            "intensity": "low"
          },
          {
            "id": "i_c_queue_to_worker_dispatch_fwd",
            "from": "message_queue",
            "to": "worker",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_worker_to_dlq_async_event_fwd",
            "from": "worker",
            "to": "dead_letter_queue",
            "type": "broadcast",
            "intensity": "low"
          }
        ],
        "camera": {
          "mode": "wide",
          "zoom": 1
        }
      },
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "users"
          },
          {
            "type": "entity_removed",
            "entityId": "retry_policy"
          },
          {
            "type": "entity_moved",
            "entityId": "message_queue",
            "from": {
              "x": 50,
              "y": 7.664999999999999
            },
            "to": {
              "x": 50,
              "y": 29.38833333333334
            }
          },
          {
            "type": "entity_moved",
            "entityId": "worker",
            "from": {
              "x": 50,
              "y": 29.38833333333334
            },
            "to": {
              "x": 50,
              "y": 51.11166666666668
            }
          },
          {
            "type": "entity_importance_changed",
            "entityId": "message_queue",
            "from": "secondary",
            "to": "primary"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "dead_letter_queue",
            "from": "primary",
            "to": "secondary"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_users_to_queue_ingestion"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_worker_to_retry_policy_retry"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_retry_policy_to_dlq_retry"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_users_to_queue_ingestion_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_worker_to_retry_policy_retry_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_retry_policy_to_dlq_retry_fwd"
          }
        ],
        "cameraDiffs": []
      },
      "hierarchyTransition": null,
      "plan": {
        "phaseOrder": [
          "removals",
          "moves",
          "additions",
          "connections",
          "interactions",
          "camera"
        ],
        "removals": [
          {
            "entityId": "retry_policy",
            "elementIds": [
              "retry_policy"
            ],
            "action": "remove",
            "exit": "zoom_out",
            "cleanup": true
          }
        ],
        "moves": [
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue"
            ],
            "action": "move"
          },
          {
            "entityId": "worker",
            "elementIds": [
              "worker"
            ],
            "action": "move"
          }
        ],
        "additions": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "add",
            "enter": "zoom_in"
          },
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue"
            ],
            "action": "add",
            "enter": "zoom_in"
          }
        ],
        "connections": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "connect",
            "connectionId": "c_users_to_queue_ingestion"
          },
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue"
            ],
            "action": "connect",
            "connectionId": "c_users_to_queue_ingestion"
          },
          {
            "entityId": "worker",
            "elementIds": [
              "worker"
            ],
            "action": "connect",
            "connectionId": "c_worker_to_retry_policy_retry"
          },
          {
            "entityId": "retry_policy",
            "elementIds": [
              "retry_policy"
            ],
            "action": "connect",
            "connectionId": "c_retry_policy_to_dlq_retry",
            "cleanup": false
          },
          {
            "entityId": "dead_letter_queue",
            "elementIds": [
              "dead_letter_queue"
            ],
            "action": "connect",
            "connectionId": "c_retry_policy_to_dlq_retry"
          }
        ],
        "interactions": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_queue_ingestion_fwd"
          },
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_queue_ingestion_fwd"
          },
          {
            "entityId": "worker",
            "elementIds": [
              "worker"
            ],
            "action": "interact",
            "interactionId": "i_c_worker_to_retry_policy_retry_fwd"
          },
          {
            "entityId": "retry_policy",
            "elementIds": [
              "retry_policy"
            ],
            "action": "interact",
            "interactionId": "i_c_retry_policy_to_dlq_retry_fwd",
            "cleanup": false
          },
          {
            "entityId": "dead_letter_queue",
            "elementIds": [
              "dead_letter_queue"
            ],
            "action": "interact",
            "interactionId": "i_c_retry_policy_to_dlq_retry_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "retry_policy",
            "action": "remove",
            "delay": 0,
            "duration": 0.9,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "message_queue",
            "action": "move",
            "delay": 0.6000000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "worker",
            "action": "move",
            "delay": 0.68,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "users",
            "action": "add",
            "delay": 1.7999999999999998,
            "duration": 0.54,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "isPrimary": false
          },
          {
            "entityId": "message_queue",
            "action": "add",
            "delay": 1.882,
            "duration": 0.62,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_users_to_queue_ingestion",
            "delay": 0.504,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "connectionId": "c_worker_to_retry_policy_retry",
            "delay": 0.584,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "connectionId": "c_retry_policy_to_dlq_retry",
            "delay": 0.664,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "users",
            "type": "users_cluster",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Users",
            "icon": "users",
            "layout": {
              "x": 50,
              "y": 7.664999999999999
            }
          }
        ],
        "removedEntities": [
          {
            "id": "retry_policy",
            "type": "retry_policy",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Retry Policy",
            "icon": "rotate-cw",
            "layout": {
              "x": 50,
              "y": 51.11166666666668
            }
          }
        ],
        "movedEntities": [
          {
            "id": "message_queue",
            "from": {
              "x": 50,
              "y": 7.664999999999999
            },
            "to": {
              "x": 50,
              "y": 29.38833333333334
            }
          },
          {
            "id": "worker",
            "from": {
              "x": 50,
              "y": 29.38833333333334
            },
            "to": {
              "x": 50,
              "y": 51.11166666666668
            }
          }
        ],
        "updatedEntities": [
          {
            "id": "message_queue",
            "changes": {
              "importance": {
                "from": "secondary",
                "to": "primary"
              }
            }
          },
          {
            "id": "dead_letter_queue",
            "changes": {
              "importance": {
                "from": "primary",
                "to": "secondary"
              }
            }
          }
        ],
        "addedConnections": [
          {
            "id": "c_users_to_queue_ingestion",
            "from": "users",
            "to": "message_queue",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [
          {
            "id": "c_worker_to_retry_policy_retry",
            "from": "worker",
            "to": "retry_policy",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_retry_policy_to_dlq_retry",
            "from": "retry_policy",
            "to": "dead_letter_queue",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "addedInteractions": [
          {
            "id": "i_c_users_to_queue_ingestion_fwd",
            "from": "users",
            "to": "message_queue",
            "type": "flow",
            "intensity": "low"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_worker_to_retry_policy_retry_fwd",
            "from": "worker",
            "to": "retry_policy",
            "type": "burst",
            "intensity": "medium"
          },
          {
            "id": "i_c_retry_policy_to_dlq_retry_fwd",
            "from": "retry_policy",
            "to": "dead_letter_queue",
            "type": "burst",
            "intensity": "low"
          }
        ],
        "interactionIntensityChanged": [],
        "cameraChanged": null
      }
    },
    {
      "id": "s9-recap-decouple",
      "start": 48,
      "end": 54,
      "narration": "The queue decouples the bursty users from steady workers with buffering.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "icon": "users",
          "position": {
            "x": 50,
            "y": 9.66
          },
          "visualStyle": {
            "size": 149.4,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.7829653249726274,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 52.987199999999994,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "message_queue",
          "type": "message_queue",
          "sourceEntityId": "message_queue",
          "label": "Message Queue",
          "icon": "inbox",
          "position": {
            "x": 50,
            "y": 40.25
          },
          "visualStyle": {
            "size": 149.4,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.7829653249726274,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 52.987199999999994,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "sourceEntityId": "worker",
          "label": "Worker",
          "icon": "cpu",
          "position": {
            "x": 50,
            "y": 70.84
          },
          "visualStyle": {
            "size": 149.4,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.7829653249726274,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 52.987199999999994,
            "fontWeight": 600,
            "status": "active"
          }
        }
      ],
      "entities": [
        {
          "id": "users",
          "type": "users_cluster",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Users",
          "icon": "users",
          "layout": {
            "x": 50,
            "y": 9.66
          }
        },
        {
          "id": "message_queue",
          "type": "message_queue",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Message Queue",
          "icon": "inbox",
          "layout": {
            "x": 50,
            "y": 40.25
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Worker",
          "icon": "cpu",
          "layout": {
            "x": 50,
            "y": 70.84
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_queue_ingestion",
          "from": "users",
          "to": "message_queue",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_queue_to_worker_dispatch",
          "from": "message_queue",
          "to": "worker",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_queue_ingestion_fwd",
          "from": "users",
          "to": "message_queue",
          "type": "burst",
          "intensity": "high"
        },
        {
          "id": "i_c_queue_to_worker_dispatch_fwd",
          "from": "message_queue",
          "to": "worker",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "wide",
        "zoom": 1
      },
      "directives": {
        "camera": {
          "mode": "wide_recap",
          "zoom": "wide",
          "active_zone": "upper_third",
          "reserve_bottom_percent": 25
        },
        "visual": {
          "theme": "default",
          "background_texture": "grid",
          "glow_strength": "soft"
        },
        "motion": {
          "entry_style": "draw_in",
          "pacing": "balanced"
        },
        "flow": {
          "renderer": "dashed"
        }
      },
      "source": {
        "entities": [
          {
            "id": "users",
            "type": "users_cluster",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Users",
            "icon": "users",
            "layout": {
              "x": 50,
              "y": 9.66
            }
          },
          {
            "id": "message_queue",
            "type": "message_queue",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Message Queue",
            "icon": "inbox",
            "layout": {
              "x": 50,
              "y": 40.25
            }
          },
          {
            "id": "worker",
            "type": "worker",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Worker",
            "icon": "cpu",
            "layout": {
              "x": 50,
              "y": 70.84
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_queue_ingestion",
            "from": "users",
            "to": "message_queue",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_queue_to_worker_dispatch",
            "from": "message_queue",
            "to": "worker",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_queue_ingestion_fwd",
            "from": "users",
            "to": "message_queue",
            "type": "burst",
            "intensity": "high"
          },
          {
            "id": "i_c_queue_to_worker_dispatch_fwd",
            "from": "message_queue",
            "to": "worker",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "wide",
          "zoom": 1
        }
      },
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_removed",
            "entityId": "dead_letter_queue"
          },
          {
            "type": "entity_moved",
            "entityId": "users",
            "from": {
              "x": 50,
              "y": 7.664999999999999
            },
            "to": {
              "x": 50,
              "y": 9.66
            }
          },
          {
            "type": "entity_moved",
            "entityId": "message_queue",
            "from": {
              "x": 50,
              "y": 29.38833333333334
            },
            "to": {
              "x": 50,
              "y": 40.25
            }
          },
          {
            "type": "entity_moved",
            "entityId": "worker",
            "from": {
              "x": 50,
              "y": 51.11166666666668
            },
            "to": {
              "x": 50,
              "y": 70.84
            }
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_removed",
            "connectionId": "c_worker_to_dlq_async_event"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_removed",
            "interactionId": "i_c_worker_to_dlq_async_event_fwd"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_users_to_queue_ingestion_fwd",
            "from": "low",
            "to": "high"
          }
        ],
        "cameraDiffs": []
      },
      "hierarchyTransition": null,
      "plan": {
        "phaseOrder": [
          "removals",
          "moves",
          "additions",
          "connections",
          "interactions",
          "camera"
        ],
        "removals": [
          {
            "entityId": "dead_letter_queue",
            "elementIds": [
              "dead_letter_queue"
            ],
            "action": "remove",
            "exit": "zoom_out",
            "cleanup": true
          }
        ],
        "moves": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "move"
          },
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue"
            ],
            "action": "move"
          },
          {
            "entityId": "worker",
            "elementIds": [
              "worker"
            ],
            "action": "move"
          }
        ],
        "additions": [],
        "connections": [
          {
            "entityId": "worker",
            "elementIds": [
              "worker"
            ],
            "action": "connect",
            "connectionId": "c_worker_to_dlq_async_event"
          },
          {
            "entityId": "dead_letter_queue",
            "elementIds": [
              "dead_letter_queue"
            ],
            "action": "connect",
            "connectionId": "c_worker_to_dlq_async_event"
          }
        ],
        "interactions": [
          {
            "entityId": "worker",
            "elementIds": [
              "worker"
            ],
            "action": "interact",
            "interactionId": "i_c_worker_to_dlq_async_event_fwd"
          },
          {
            "entityId": "dead_letter_queue",
            "elementIds": [
              "dead_letter_queue"
            ],
            "action": "interact",
            "interactionId": "i_c_worker_to_dlq_async_event_fwd"
          },
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_queue_ingestion_fwd"
          },
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_queue_ingestion_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "dead_letter_queue",
            "action": "remove",
            "delay": 0,
            "duration": 0.9,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "users",
            "action": "move",
            "delay": 0.6000000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "message_queue",
            "action": "move",
            "delay": 0.68,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "worker",
            "action": "move",
            "delay": 0.7600000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "connections": [
          {
            "connectionId": "c_worker_to_dlq_async_event",
            "delay": 0.504,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [],
        "removedEntities": [
          {
            "id": "dead_letter_queue",
            "type": "dead_letter_queue",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Dead Letter Queue",
            "icon": "archive",
            "layout": {
              "x": 50,
              "y": 72.83500000000001
            }
          }
        ],
        "movedEntities": [
          {
            "id": "users",
            "from": {
              "x": 50,
              "y": 7.664999999999999
            },
            "to": {
              "x": 50,
              "y": 9.66
            }
          },
          {
            "id": "message_queue",
            "from": {
              "x": 50,
              "y": 29.38833333333334
            },
            "to": {
              "x": 50,
              "y": 40.25
            }
          },
          {
            "id": "worker",
            "from": {
              "x": 50,
              "y": 51.11166666666668
            },
            "to": {
              "x": 50,
              "y": 70.84
            }
          }
        ],
        "updatedEntities": [],
        "addedConnections": [],
        "removedConnections": [
          {
            "id": "c_worker_to_dlq_async_event",
            "from": "worker",
            "to": "dead_letter_queue",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "addedInteractions": [],
        "removedInteractions": [
          {
            "id": "i_c_worker_to_dlq_async_event_fwd",
            "from": "worker",
            "to": "dead_letter_queue",
            "type": "broadcast",
            "intensity": "low"
          }
        ],
        "interactionIntensityChanged": [
          {
            "id": "i_c_users_to_queue_ingestion_fwd",
            "from": "low",
            "to": "high"
          }
        ],
        "cameraChanged": null
      }
    },
    {
      "id": "s10-ending-rule-of-thumb",
      "start": 54,
      "end": 60,
      "narration": "When traffic surges, buffer in a queue and let workers pull steadily.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "icon": "users",
          "position": {
            "x": 50,
            "y": 9.66
          },
          "visualStyle": {
            "size": 149.4,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.7829653249726274,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 52.987199999999994,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "message_queue",
          "type": "message_queue",
          "sourceEntityId": "message_queue",
          "label": "Message Queue",
          "icon": "inbox",
          "position": {
            "x": 50,
            "y": 40.25
          },
          "visualStyle": {
            "size": 149.4,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.7829653249726274,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 52.987199999999994,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "sourceEntityId": "worker",
          "label": "Worker",
          "icon": "cpu",
          "position": {
            "x": 50,
            "y": 70.84
          },
          "visualStyle": {
            "size": 149.4,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.7829653249726274,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 52.987199999999994,
            "fontWeight": 600,
            "status": "active"
          }
        }
      ],
      "entities": [
        {
          "id": "users",
          "type": "users_cluster",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Users",
          "icon": "users",
          "layout": {
            "x": 50,
            "y": 9.66
          }
        },
        {
          "id": "message_queue",
          "type": "message_queue",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Message Queue",
          "icon": "inbox",
          "layout": {
            "x": 50,
            "y": 40.25
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Worker",
          "icon": "cpu",
          "layout": {
            "x": 50,
            "y": 70.84
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_queue_ingestion",
          "from": "users",
          "to": "message_queue",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_queue_to_worker_dispatch",
          "from": "message_queue",
          "to": "worker",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_queue_ingestion_fwd",
          "from": "users",
          "to": "message_queue",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_queue_to_worker_dispatch_fwd",
          "from": "message_queue",
          "to": "worker",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "wide",
        "zoom": 1
      },
      "directives": {
        "camera": {
          "mode": "wide_recap",
          "zoom": "wide",
          "active_zone": "upper_third",
          "reserve_bottom_percent": 25
        },
        "visual": {
          "theme": "default",
          "background_texture": "grid",
          "glow_strength": "soft"
        },
        "motion": {
          "entry_style": "draw_in",
          "pacing": "balanced"
        },
        "flow": {
          "renderer": "dashed"
        }
      },
      "source": {
        "entities": [
          {
            "id": "users",
            "type": "users_cluster",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Users",
            "icon": "users",
            "layout": {
              "x": 50,
              "y": 9.66
            }
          },
          {
            "id": "message_queue",
            "type": "message_queue",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Message Queue",
            "icon": "inbox",
            "layout": {
              "x": 50,
              "y": 40.25
            }
          },
          {
            "id": "worker",
            "type": "worker",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Worker",
            "icon": "cpu",
            "layout": {
              "x": 50,
              "y": 70.84
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_queue_ingestion",
            "from": "users",
            "to": "message_queue",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_queue_to_worker_dispatch",
            "from": "message_queue",
            "to": "worker",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_queue_ingestion_fwd",
            "from": "users",
            "to": "message_queue",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_queue_to_worker_dispatch_fwd",
            "from": "message_queue",
            "to": "worker",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "wide",
          "zoom": 1
        }
      },
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_importance_changed",
            "entityId": "message_queue",
            "from": "primary",
            "to": "secondary"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "worker",
            "from": "secondary",
            "to": "primary"
          }
        ],
        "connectionDiffs": [],
        "interactionDiffs": [
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_users_to_queue_ingestion_fwd",
            "from": "high",
            "to": "medium"
          }
        ],
        "cameraDiffs": []
      },
      "hierarchyTransition": null,
      "plan": {
        "phaseOrder": [
          "removals",
          "moves",
          "additions",
          "connections",
          "interactions",
          "camera"
        ],
        "removals": [],
        "moves": [],
        "additions": [
          {
            "entityId": "worker",
            "elementIds": [
              "worker"
            ],
            "action": "add",
            "enter": "zoom_in"
          }
        ],
        "connections": [],
        "interactions": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_queue_ingestion_fwd"
          },
          {
            "entityId": "message_queue",
            "elementIds": [
              "message_queue"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_queue_ingestion_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "worker",
            "action": "add",
            "delay": 1.8499999999999999,
            "duration": 0.62,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [],
        "camera": null
      },
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [],
        "removedEntities": [],
        "movedEntities": [],
        "updatedEntities": [
          {
            "id": "message_queue",
            "changes": {
              "importance": {
                "from": "primary",
                "to": "secondary"
              }
            }
          },
          {
            "id": "worker",
            "changes": {
              "importance": {
                "from": "secondary",
                "to": "primary"
              }
            }
          }
        ],
        "addedConnections": [],
        "removedConnections": [],
        "addedInteractions": [],
        "removedInteractions": [],
        "interactionIntensityChanged": [
          {
            "id": "i_c_users_to_queue_ingestion_fwd",
            "from": "high",
            "to": "medium"
          }
        ],
        "cameraChanged": null
      }
    }
  ]
} as unknown as MotionRenderSpec;
const TIMELINE_EPSILON = 0.001;
const DEFAULT_VISUAL_DIRECTIVES = {
  theme: 'default',
  background_texture: 'grid',
  glow_strength: 'soft',
} as const;

const resolveVisualDirectives = (scene: MotionRenderSpec['scenes'][number]) =>
  scene.directives?.visual ?? DEFAULT_VISUAL_DIRECTIVES;

const resolveBackdropColor = (theme: 'default' | 'neon'): string =>
  theme === 'default' ? '#070B12' : StyleTokens.colors.background;

const resolveGridOpacity = (
  visual: typeof DEFAULT_VISUAL_DIRECTIVES,
): number => {
  if (visual.background_texture === 'none') {
    return 0;
  }

  if (visual.theme === 'default') {
    return visual.glow_strength === 'soft' ? 0.026 : 0.036;
  }

  return visual.glow_strength === 'soft' ? 0.04 : 0.056;
};

export default makeScene2D(function* (view) {
  const caption = createRef<Txt>();
  view.fill(StyleTokens.colors.background);
  const backdrop = new Rect({
    width: 1080,
    height: 1920,
    fill: StyleTokens.colors.background,
    zIndex: -300,
  });
  view.add(backdrop);
  const world = new Node({zIndex: 0});
  view.add(world);
  const gridLayer = new Node({
    opacity: 0.05,
    zIndex: -200,
  });
  const gridSpacing = 140;

  for (let x = -540; x <= 540; x += gridSpacing) {
    gridLayer.add(
      new Line({
        points: [[x, -960], [x, 960]],
        stroke: '#3B4252',
        lineWidth: 1,
        opacity: 0.45,
      }),
    );
  }

  for (let y = -960; y <= 960; y += gridSpacing) {
    gridLayer.add(
      new Line({
        points: [[-540, y], [540, y]],
        stroke: '#303646',
        lineWidth: 1,
        opacity: 0.35,
      }),
    );
  }
  view.add(gridLayer);

  view.add(
    <Txt
      ref={caption}
      y={-420}
      fill={StyleTokens.colors.text}
      fontFamily={StyleTokens.text.fontFamily}
      fontSize={StyleTokens.text.fontSizeSecondary}
      fontWeight={StyleTokens.text.fontWeight}
      opacity={0}
      maxWidth={1500}
      textAlign={'center'}
    />,
  );

  const logger = createRuntimeLogger('runtime');
  const timeline = createTimelineState(0);
  const sceneState = createSceneState({
    caption: caption(),
    logger,
  });
  sceneState.camera.originX = world.x();
  sceneState.camera.originY = world.y();
  sceneState.camera.x = sceneState.camera.originX;
  sceneState.camera.y = sceneState.camera.originY;
  const sceneThread = (function* sceneLoopThread() {
    for (const scene of renderSpec.scenes) {
      const sceneDuration = scene.end - scene.start;

      if (sceneDuration <= 0) {
        throw new Error(`Invalid scene duration: ${scene.id}`);
      }

      validateSceneForRuntime(scene, logger);

      yield* waitUntil(timeline, scene.start, logger);
      const visual = resolveVisualDirectives(scene);
      yield* all(
        backdrop.fill(resolveBackdropColor(visual.theme), 0.12),
        gridLayer.opacity(resolveGridOpacity(visual), 0.12),
      );
      yield* executeScene(world, scene, sceneState);
      advanceTimeline(timeline, sceneState.lastExecutionDuration);
      yield* waitUntil(timeline, scene.end, logger);

      sceneState.sceneIndex += 1;
    }
  })();

  const backgroundDriftThread = (function* backgroundDrift() {
    const cycle = 8;
    let elapsed = 0;

    while (elapsed < renderSpec.duration) {
      const step = Math.min(cycle, renderSpec.duration - elapsed);
      if (gridLayer.opacity() > 0.001) {
        yield* gridLayer.y(14, step / 2).to(0, step / 2);
      } else {
        yield* gridLayer.y(0, step);
      }
      elapsed += step;
    }
  })();

  yield* all(sceneThread, backgroundDriftThread);

  if (Math.abs(timeline.current - renderSpec.duration) > TIMELINE_EPSILON) {
    logger.warn('Timeline mismatch', {
      expected: renderSpec.duration,
      actual: timeline.current,
    });
  }
});
