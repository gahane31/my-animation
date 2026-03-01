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
  "duration": 40,
  "scenes": [
    {
      "id": "s1-hook-same-seat",
      "start": 0,
      "end": 4,
      "narration": "Two users tap the same seat, and both requests hit the booking server.",
      "camera": "focus",
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
          "id": "booking_server",
          "type": "server",
          "sourceEntityId": "booking_server",
          "label": "Booking Server",
          "icon": "server",
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
          "count": 2,
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
          "id": "booking_server",
          "type": "server",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Booking Server",
          "icon": "server",
          "layout": {
            "x": 50,
            "y": 68.18
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_booking_server",
          "from": "users",
          "to": "booking_server",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_booking_server_fwd",
          "from": "users",
          "to": "booking_server",
          "type": "flow",
          "intensity": "high"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "booking_server",
        "zoom": 1.2
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
          "entry_style": "elastic_pop",
          "pacing": "reel_fast"
        },
        "flow": {
          "renderer": "packets"
        }
      },
      "source": {
        "entities": [
          {
            "id": "users",
            "type": "users_cluster",
            "count": 2,
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
            "id": "booking_server",
            "type": "server",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Booking Server",
            "icon": "server",
            "layout": {
              "x": 50,
              "y": 68.18
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_booking_server",
            "from": "users",
            "to": "booking_server",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_booking_server_fwd",
            "from": "users",
            "to": "booking_server",
            "type": "flow",
            "intensity": "high"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "booking_server",
          "zoom": 1.2
        }
      },
      "motionPersonality": "ENERGETIC",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "users"
          },
          {
            "type": "entity_added",
            "entityId": "booking_server"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_users_to_booking_server"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_users_to_booking_server_fwd"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": null,
            "to": {
              "mode": "focus",
              "target": "booking_server",
              "zoom": 1.2
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
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
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
            "connectionId": "c_users_to_booking_server"
          },
          {
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "connect",
            "connectionId": "c_users_to_booking_server"
          }
        ],
        "interactions": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_booking_server_fwd"
          },
          {
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_booking_server_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "users",
            "action": "add",
            "delay": 0.12,
            "duration": 0.28,
            "easing": "cubic-bezier(0.4,0,0.2,1)",
            "isPrimary": false
          },
          {
            "entityId": "booking_server",
            "action": "add",
            "delay": 0.2,
            "duration": 0.32,
            "easing": "cubic-bezier(0.4,0,0.2,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_users_to_booking_server",
            "delay": 0.54,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": {
        "targetId": "booking_server",
        "targetElementId": "booking_server",
        "zoom": 1.2,
        "duration": 0.55,
        "easing": "cubic-bezier(0.2,0,0,1)",
        "motionType": "focus_primary"
      },
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "users",
            "type": "users_cluster",
            "count": 2,
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
            "id": "booking_server",
            "type": "server",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Booking Server",
            "icon": "server",
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
            "id": "c_users_to_booking_server",
            "from": "users",
            "to": "booking_server",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [],
        "addedInteractions": [
          {
            "id": "i_c_users_to_booking_server_fwd",
            "from": "users",
            "to": "booking_server",
            "type": "flow",
            "intensity": "high"
          }
        ],
        "removedInteractions": [],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": null,
          "to": {
            "mode": "focus",
            "target": "booking_server",
            "zoom": 1.2
          }
        }
      }
    },
    {
      "id": "s2-problem-race-to-db",
      "start": 4,
      "end": 8,
      "narration": "Without a guard, both server calls try to write the same seat in the database.",
      "camera": "focus",
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
          "id": "booking_server",
          "type": "server",
          "sourceEntityId": "booking_server",
          "label": "Booking Server",
          "icon": "server",
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
          "id": "seat_db",
          "type": "primary_database",
          "sourceEntityId": "seat_db",
          "label": "Seat Database",
          "icon": "database",
          "position": {
            "x": 50,
            "y": 70.84
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
        }
      ],
      "entities": [
        {
          "id": "users",
          "type": "users_cluster",
          "count": 2,
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
          "id": "booking_server",
          "type": "server",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Booking Server",
          "icon": "server",
          "layout": {
            "x": 50,
            "y": 40.25
          }
        },
        {
          "id": "seat_db",
          "type": "primary_database",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Seat Database",
          "icon": "database",
          "layout": {
            "x": 50,
            "y": 70.84
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_booking_server",
          "from": "users",
          "to": "booking_server",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_booking_server_to_seat_db",
          "from": "booking_server",
          "to": "seat_db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_booking_server_fwd",
          "from": "users",
          "to": "booking_server",
          "type": "flow",
          "intensity": "high"
        },
        {
          "id": "i_c_booking_server_to_seat_db_fwd",
          "from": "booking_server",
          "to": "seat_db",
          "type": "burst",
          "intensity": "high"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "seat_db",
        "zoom": 1.16
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
          "background_texture": "none",
          "glow_strength": "soft"
        },
        "motion": {
          "entry_style": "draw_in",
          "pacing": "reel_fast"
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
            "count": 2,
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
            "id": "booking_server",
            "type": "server",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Booking Server",
            "icon": "server",
            "layout": {
              "x": 50,
              "y": 40.25
            }
          },
          {
            "id": "seat_db",
            "type": "primary_database",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Seat Database",
            "icon": "database",
            "layout": {
              "x": 50,
              "y": 70.84
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_booking_server",
            "from": "users",
            "to": "booking_server",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_booking_server_to_seat_db",
            "from": "booking_server",
            "to": "seat_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_booking_server_fwd",
            "from": "users",
            "to": "booking_server",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_booking_server_to_seat_db_fwd",
            "from": "booking_server",
            "to": "seat_db",
            "type": "burst",
            "intensity": "high"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "seat_db",
          "zoom": 1.16
        }
      },
      "motionPersonality": "ENERGETIC",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "seat_db"
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
            "entityId": "booking_server",
            "from": {
              "x": 50,
              "y": 68.18
            },
            "to": {
              "x": 50,
              "y": 40.25
            }
          },
          {
            "type": "entity_importance_changed",
            "entityId": "booking_server",
            "from": "primary",
            "to": "secondary"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_booking_server_to_seat_db"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_booking_server_to_seat_db_fwd"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "booking_server",
              "zoom": 1.2
            },
            "to": {
              "mode": "focus",
              "target": "seat_db",
              "zoom": 1.16
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
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "move"
          }
        ],
        "additions": [
          {
            "entityId": "seat_db",
            "elementIds": [
              "seat_db"
            ],
            "action": "add",
            "enter": "zoom_in",
            "cleanup": false
          }
        ],
        "connections": [
          {
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "connect",
            "connectionId": "c_booking_server_to_seat_db"
          },
          {
            "entityId": "seat_db",
            "elementIds": [
              "seat_db"
            ],
            "action": "connect",
            "connectionId": "c_booking_server_to_seat_db"
          }
        ],
        "interactions": [
          {
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "interact",
            "interactionId": "i_c_booking_server_to_seat_db_fwd"
          },
          {
            "entityId": "seat_db",
            "elementIds": [
              "seat_db"
            ],
            "action": "interact",
            "interactionId": "i_c_booking_server_to_seat_db_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "users",
            "action": "move",
            "delay": 0.4,
            "duration": 0.34,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "booking_server",
            "action": "move",
            "delay": 0.42000000000000004,
            "duration": 0.34,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "seat_db",
            "action": "add",
            "delay": 0.6570000000000001,
            "duration": 0.260983296,
            "easing": "cubic-bezier(0.4,0,0.2,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_booking_server_to_seat_db",
            "delay": 0.54,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": {
        "targetId": "seat_db",
        "targetElementId": "seat_db",
        "zoom": 2.8,
        "duration": 0.26,
        "holdDuration": 0.6,
        "easing": "cubic-bezier(0.16,1,0.3,1)",
        "motionType": "introduce_primary"
      },
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "seat_db",
            "type": "primary_database",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Seat Database",
            "icon": "database",
            "layout": {
              "x": 50,
              "y": 70.84
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
            "id": "booking_server",
            "from": {
              "x": 50,
              "y": 68.18
            },
            "to": {
              "x": 50,
              "y": 40.25
            }
          }
        ],
        "updatedEntities": [
          {
            "id": "booking_server",
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
            "id": "c_booking_server_to_seat_db",
            "from": "booking_server",
            "to": "seat_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [],
        "addedInteractions": [
          {
            "id": "i_c_booking_server_to_seat_db_fwd",
            "from": "booking_server",
            "to": "seat_db",
            "type": "burst",
            "intensity": "high"
          }
        ],
        "removedInteractions": [],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "booking_server",
            "zoom": 1.2
          },
          "to": {
            "mode": "focus",
            "target": "seat_db",
            "zoom": 1.16
          }
        }
      }
    },
    {
      "id": "s3-solution-seat-lock",
      "start": 8,
      "end": 12,
      "narration": "An authorization lock sits before the database, so only one request enters.",
      "camera": "focus",
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
          "id": "booking_server",
          "type": "server",
          "sourceEntityId": "booking_server",
          "label": "Booking Server",
          "icon": "server",
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
          "id": "seat_lock",
          "type": "authorization_lock",
          "sourceEntityId": "seat_lock",
          "label": "Seat Lock",
          "icon": "lock",
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
          "id": "seat_db",
          "type": "primary_database",
          "sourceEntityId": "seat_db",
          "label": "Seat Database",
          "icon": "database",
          "position": {
            "x": 50,
            "y": 72.83500000000001
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
        }
      ],
      "entities": [
        {
          "id": "users",
          "type": "users_cluster",
          "count": 2,
          "importance": "secondary",
          "status": "active",
          "label": "Users",
          "icon": "users",
          "layout": {
            "x": 50,
            "y": 7.664999999999999
          }
        },
        {
          "id": "booking_server",
          "type": "server",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Booking Server",
          "icon": "server",
          "layout": {
            "x": 50,
            "y": 29.38833333333334
          }
        },
        {
          "id": "seat_lock",
          "type": "authorization_lock",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Seat Lock",
          "icon": "lock",
          "layout": {
            "x": 50,
            "y": 51.11166666666668
          }
        },
        {
          "id": "seat_db",
          "type": "primary_database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Seat Database",
          "icon": "database",
          "layout": {
            "x": 50,
            "y": 72.83500000000001
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_booking_server",
          "from": "users",
          "to": "booking_server",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_booking_server_to_seat_lock",
          "from": "booking_server",
          "to": "seat_lock",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_seat_lock_to_seat_db",
          "from": "seat_lock",
          "to": "seat_db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_booking_server_fwd",
          "from": "users",
          "to": "booking_server",
          "type": "flow",
          "intensity": "high"
        },
        {
          "id": "i_c_booking_server_to_seat_lock_fwd",
          "from": "booking_server",
          "to": "seat_lock",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_seat_lock_to_seat_db_fwd",
          "from": "seat_lock",
          "to": "seat_db",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "seat_lock",
        "zoom": 1.12
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
          "pacing": "reel_fast"
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
            "count": 2,
            "importance": "secondary",
            "status": "active",
            "label": "Users",
            "icon": "users",
            "layout": {
              "x": 50,
              "y": 7.664999999999999
            }
          },
          {
            "id": "booking_server",
            "type": "server",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Booking Server",
            "icon": "server",
            "layout": {
              "x": 50,
              "y": 29.38833333333334
            }
          },
          {
            "id": "seat_lock",
            "type": "authorization_lock",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Seat Lock",
            "icon": "lock",
            "layout": {
              "x": 50,
              "y": 51.11166666666668
            }
          },
          {
            "id": "seat_db",
            "type": "primary_database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Seat Database",
            "icon": "database",
            "layout": {
              "x": 50,
              "y": 72.83500000000001
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_booking_server",
            "from": "users",
            "to": "booking_server",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_booking_server_to_seat_lock",
            "from": "booking_server",
            "to": "seat_lock",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_seat_lock_to_seat_db",
            "from": "seat_lock",
            "to": "seat_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_booking_server_fwd",
            "from": "users",
            "to": "booking_server",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_booking_server_to_seat_lock_fwd",
            "from": "booking_server",
            "to": "seat_lock",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_seat_lock_to_seat_db_fwd",
            "from": "seat_lock",
            "to": "seat_db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "seat_lock",
          "zoom": 1.12
        }
      },
      "motionPersonality": "ENERGETIC",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "seat_lock"
          },
          {
            "type": "entity_moved",
            "entityId": "users",
            "from": {
              "x": 50,
              "y": 9.66
            },
            "to": {
              "x": 50,
              "y": 7.664999999999999
            }
          },
          {
            "type": "entity_moved",
            "entityId": "booking_server",
            "from": {
              "x": 50,
              "y": 40.25
            },
            "to": {
              "x": 50,
              "y": 29.38833333333334
            }
          },
          {
            "type": "entity_moved",
            "entityId": "seat_db",
            "from": {
              "x": 50,
              "y": 70.84
            },
            "to": {
              "x": 50,
              "y": 72.83500000000001
            }
          },
          {
            "type": "entity_status_changed",
            "entityId": "seat_db",
            "from": "active",
            "to": "normal"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "seat_db",
            "from": "primary",
            "to": "secondary"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_booking_server_to_seat_lock"
          },
          {
            "type": "connection_added",
            "connectionId": "c_seat_lock_to_seat_db"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_booking_server_to_seat_db"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_booking_server_to_seat_lock_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_seat_lock_to_seat_db_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_booking_server_to_seat_db_fwd"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "seat_db",
              "zoom": 1.16
            },
            "to": {
              "mode": "focus",
              "target": "seat_lock",
              "zoom": 1.12
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
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "move"
          },
          {
            "entityId": "seat_db",
            "elementIds": [
              "seat_db"
            ],
            "action": "move"
          }
        ],
        "additions": [
          {
            "entityId": "seat_lock",
            "elementIds": [
              "seat_lock"
            ],
            "action": "add",
            "enter": "zoom_in",
            "cleanup": false
          }
        ],
        "connections": [
          {
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "connect",
            "connectionId": "c_booking_server_to_seat_db",
            "cleanup": false
          },
          {
            "entityId": "seat_lock",
            "elementIds": [
              "seat_lock"
            ],
            "action": "connect",
            "connectionId": "c_seat_lock_to_seat_db",
            "cleanup": false
          },
          {
            "entityId": "seat_db",
            "elementIds": [
              "seat_db"
            ],
            "action": "connect",
            "connectionId": "c_booking_server_to_seat_db",
            "cleanup": false
          }
        ],
        "interactions": [
          {
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "interact",
            "interactionId": "i_c_booking_server_to_seat_db_fwd",
            "cleanup": false
          },
          {
            "entityId": "seat_lock",
            "elementIds": [
              "seat_lock"
            ],
            "action": "interact",
            "interactionId": "i_c_seat_lock_to_seat_db_fwd",
            "cleanup": false
          },
          {
            "entityId": "seat_db",
            "elementIds": [
              "seat_db"
            ],
            "action": "interact",
            "interactionId": "i_c_booking_server_to_seat_db_fwd",
            "cleanup": false
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "users",
            "action": "move",
            "delay": 0.4,
            "duration": 0.34,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "booking_server",
            "action": "move",
            "delay": 0.42000000000000004,
            "duration": 0.34,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "seat_db",
            "action": "move",
            "delay": 0.44,
            "duration": 0.34,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "seat_lock",
            "action": "add",
            "delay": 0.677,
            "duration": 0.32,
            "easing": "cubic-bezier(0.4,0,0.2,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_booking_server_to_seat_lock",
            "delay": 0.54,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_seat_lock_to_seat_db",
            "delay": 0.56,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_booking_server_to_seat_db",
            "delay": 0.5800000000000001,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": {
        "targetId": "seat_lock",
        "targetElementId": "seat_lock",
        "zoom": 2.5,
        "duration": 0.26,
        "holdDuration": 0.6,
        "easing": "cubic-bezier(0.16,1,0.3,1)",
        "motionType": "introduce_primary"
      },
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "seat_lock",
            "type": "authorization_lock",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Seat Lock",
            "icon": "lock",
            "layout": {
              "x": 50,
              "y": 51.11166666666668
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "users",
            "from": {
              "x": 50,
              "y": 9.66
            },
            "to": {
              "x": 50,
              "y": 7.664999999999999
            }
          },
          {
            "id": "booking_server",
            "from": {
              "x": 50,
              "y": 40.25
            },
            "to": {
              "x": 50,
              "y": 29.38833333333334
            }
          },
          {
            "id": "seat_db",
            "from": {
              "x": 50,
              "y": 70.84
            },
            "to": {
              "x": 50,
              "y": 72.83500000000001
            }
          }
        ],
        "updatedEntities": [
          {
            "id": "seat_db",
            "changes": {
              "status": {
                "from": "active",
                "to": "normal"
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
            "id": "c_booking_server_to_seat_lock",
            "from": "booking_server",
            "to": "seat_lock",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_seat_lock_to_seat_db",
            "from": "seat_lock",
            "to": "seat_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [
          {
            "id": "c_booking_server_to_seat_db",
            "from": "booking_server",
            "to": "seat_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "addedInteractions": [
          {
            "id": "i_c_booking_server_to_seat_lock_fwd",
            "from": "booking_server",
            "to": "seat_lock",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_seat_lock_to_seat_db_fwd",
            "from": "seat_lock",
            "to": "seat_db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_booking_server_to_seat_db_fwd",
            "from": "booking_server",
            "to": "seat_db",
            "type": "burst",
            "intensity": "high"
          }
        ],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "seat_db",
            "zoom": 1.16
          },
          "to": {
            "mode": "focus",
            "target": "seat_lock",
            "zoom": 1.12
          }
        }
      }
    },
    {
      "id": "s4-escalation-allow-block",
      "start": 12,
      "end": 16,
      "narration": "The lock allows the first user and blocks the second user for that seat.",
      "camera": "focus",
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
          "id": "booking_server",
          "type": "server",
          "sourceEntityId": "booking_server",
          "label": "Booking Server",
          "icon": "server",
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
          "id": "seat_lock",
          "type": "authorization_lock",
          "sourceEntityId": "seat_lock",
          "label": "Seat Lock",
          "icon": "lock",
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
          "id": "seat_db",
          "type": "primary_database",
          "sourceEntityId": "seat_db",
          "label": "Seat Database",
          "icon": "database",
          "position": {
            "x": 50,
            "y": 72.83500000000001
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
        }
      ],
      "entities": [
        {
          "id": "users",
          "type": "users_cluster",
          "count": 2,
          "importance": "secondary",
          "status": "active",
          "label": "Users",
          "icon": "users",
          "layout": {
            "x": 50,
            "y": 7.664999999999999
          }
        },
        {
          "id": "booking_server",
          "type": "server",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Booking Server",
          "icon": "server",
          "layout": {
            "x": 50,
            "y": 29.38833333333334
          }
        },
        {
          "id": "seat_lock",
          "type": "authorization_lock",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Seat Lock",
          "icon": "lock",
          "layout": {
            "x": 50,
            "y": 51.11166666666668
          }
        },
        {
          "id": "seat_db",
          "type": "primary_database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Seat Database",
          "icon": "database",
          "layout": {
            "x": 50,
            "y": 72.83500000000001
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_booking_server",
          "from": "users",
          "to": "booking_server",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_booking_server_to_seat_lock",
          "from": "booking_server",
          "to": "seat_lock",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_seat_lock_to_seat_db",
          "from": "seat_lock",
          "to": "seat_db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_booking_server_fwd",
          "from": "users",
          "to": "booking_server",
          "type": "flow",
          "intensity": "high"
        },
        {
          "id": "i_c_booking_server_to_seat_lock_fwd",
          "from": "booking_server",
          "to": "seat_lock",
          "type": "flow",
          "intensity": "high"
        },
        {
          "id": "i_c_seat_lock_to_seat_db_fwd",
          "from": "seat_lock",
          "to": "seat_db",
          "type": "flow",
          "intensity": "high"
        },
        {
          "id": "i_c_seat_lock_to_seat_db_blocked",
          "from": "seat_lock",
          "to": "seat_db",
          "type": "blocked",
          "intensity": "high"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "seat_lock",
        "zoom": 1.14
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
          "background_texture": "none",
          "glow_strength": "soft"
        },
        "motion": {
          "entry_style": "drop_bounce",
          "pacing": "reel_fast"
        },
        "flow": {
          "renderer": "packets"
        }
      },
      "source": {
        "entities": [
          {
            "id": "users",
            "type": "users_cluster",
            "count": 2,
            "importance": "secondary",
            "status": "active",
            "label": "Users",
            "icon": "users",
            "layout": {
              "x": 50,
              "y": 7.664999999999999
            }
          },
          {
            "id": "booking_server",
            "type": "server",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Booking Server",
            "icon": "server",
            "layout": {
              "x": 50,
              "y": 29.38833333333334
            }
          },
          {
            "id": "seat_lock",
            "type": "authorization_lock",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Seat Lock",
            "icon": "lock",
            "layout": {
              "x": 50,
              "y": 51.11166666666668
            }
          },
          {
            "id": "seat_db",
            "type": "primary_database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Seat Database",
            "icon": "database",
            "layout": {
              "x": 50,
              "y": 72.83500000000001
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_booking_server",
            "from": "users",
            "to": "booking_server",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_booking_server_to_seat_lock",
            "from": "booking_server",
            "to": "seat_lock",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_seat_lock_to_seat_db",
            "from": "seat_lock",
            "to": "seat_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_booking_server_fwd",
            "from": "users",
            "to": "booking_server",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_booking_server_to_seat_lock_fwd",
            "from": "booking_server",
            "to": "seat_lock",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_seat_lock_to_seat_db_fwd",
            "from": "seat_lock",
            "to": "seat_db",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_seat_lock_to_seat_db_blocked",
            "from": "seat_lock",
            "to": "seat_db",
            "type": "blocked",
            "intensity": "high"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "seat_lock",
          "zoom": 1.14
        }
      },
      "motionPersonality": "ENERGETIC",
      "diff": {
        "entityDiffs": [],
        "connectionDiffs": [],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_seat_lock_to_seat_db_blocked"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_booking_server_to_seat_lock_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_seat_lock_to_seat_db_fwd",
            "from": "medium",
            "to": "high"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "seat_lock",
              "zoom": 1.12
            },
            "to": {
              "mode": "focus",
              "target": "seat_lock",
              "zoom": 1.14
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
            "entityId": "seat_lock",
            "elementIds": [
              "seat_lock"
            ],
            "action": "interact",
            "interactionId": "i_c_seat_lock_to_seat_db_fwd",
            "cleanup": false
          },
          {
            "entityId": "seat_db",
            "elementIds": [
              "seat_db"
            ],
            "action": "interact",
            "interactionId": "i_c_seat_lock_to_seat_db_fwd",
            "cleanup": false
          },
          {
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "interact",
            "interactionId": "i_c_booking_server_to_seat_lock_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [],
        "connections": [],
        "camera": null
      },
      "cameraPlan": {
        "targetId": "seat_lock",
        "targetElementId": "seat_lock",
        "zoom": 1.14,
        "duration": 0.55,
        "easing": "cubic-bezier(0.2,0,0,1)",
        "motionType": "focus_primary"
      },
      "sceneDiff": {
        "addedEntities": [],
        "removedEntities": [],
        "movedEntities": [],
        "updatedEntities": [],
        "addedConnections": [],
        "removedConnections": [],
        "addedInteractions": [
          {
            "id": "i_c_seat_lock_to_seat_db_blocked",
            "from": "seat_lock",
            "to": "seat_db",
            "type": "blocked",
            "intensity": "high"
          }
        ],
        "removedInteractions": [],
        "interactionIntensityChanged": [
          {
            "id": "i_c_booking_server_to_seat_lock_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "id": "i_c_seat_lock_to_seat_db_fwd",
            "from": "medium",
            "to": "high"
          }
        ],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "seat_lock",
            "zoom": 1.12
          },
          "to": {
            "mode": "focus",
            "target": "seat_lock",
            "zoom": 1.14
          }
        }
      }
    },
    {
      "id": "s5-solution-hold-in-cache",
      "start": 16,
      "end": 20,
      "narration": "The server writes a short seat hold into cache before confirming in the database.",
      "camera": "focus",
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
          "id": "booking_server",
          "type": "server",
          "sourceEntityId": "booking_server",
          "label": "Booking Server",
          "icon": "server",
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
          "id": "seat_cache",
          "type": "cache",
          "sourceEntityId": "seat_cache",
          "label": "Seat Hold Cache",
          "icon": "memory-stick",
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
          "id": "seat_db",
          "type": "primary_database",
          "sourceEntityId": "seat_db",
          "label": "Seat Database",
          "icon": "database",
          "position": {
            "x": 50,
            "y": 72.83500000000001
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
        }
      ],
      "entities": [
        {
          "id": "users",
          "type": "users_cluster",
          "count": 2,
          "importance": "secondary",
          "status": "active",
          "label": "Users",
          "icon": "users",
          "layout": {
            "x": 50,
            "y": 7.664999999999999
          }
        },
        {
          "id": "booking_server",
          "type": "server",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Booking Server",
          "icon": "server",
          "layout": {
            "x": 50,
            "y": 29.38833333333334
          }
        },
        {
          "id": "seat_cache",
          "type": "cache",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Seat Hold Cache",
          "icon": "memory-stick",
          "layout": {
            "x": 50,
            "y": 51.11166666666668
          }
        },
        {
          "id": "seat_db",
          "type": "primary_database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Seat Database",
          "icon": "database",
          "layout": {
            "x": 50,
            "y": 72.83500000000001
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_booking_server",
          "from": "users",
          "to": "booking_server",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_booking_server_to_seat_cache",
          "from": "booking_server",
          "to": "seat_cache",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_booking_server_to_seat_db",
          "from": "booking_server",
          "to": "seat_db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_booking_server_fwd",
          "from": "users",
          "to": "booking_server",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_booking_server_to_seat_cache_fwd",
          "from": "booking_server",
          "to": "seat_cache",
          "type": "burst",
          "intensity": "high"
        },
        {
          "id": "i_c_booking_server_to_seat_db_fwd",
          "from": "booking_server",
          "to": "seat_db",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "seat_cache",
        "zoom": 1.12
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
          "pacing": "reel_fast"
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
            "count": 2,
            "importance": "secondary",
            "status": "active",
            "label": "Users",
            "icon": "users",
            "layout": {
              "x": 50,
              "y": 7.664999999999999
            }
          },
          {
            "id": "booking_server",
            "type": "server",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Booking Server",
            "icon": "server",
            "layout": {
              "x": 50,
              "y": 29.38833333333334
            }
          },
          {
            "id": "seat_cache",
            "type": "cache",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Seat Hold Cache",
            "icon": "memory-stick",
            "layout": {
              "x": 50,
              "y": 51.11166666666668
            }
          },
          {
            "id": "seat_db",
            "type": "primary_database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Seat Database",
            "icon": "database",
            "layout": {
              "x": 50,
              "y": 72.83500000000001
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_booking_server",
            "from": "users",
            "to": "booking_server",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_booking_server_to_seat_cache",
            "from": "booking_server",
            "to": "seat_cache",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_booking_server_to_seat_db",
            "from": "booking_server",
            "to": "seat_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_booking_server_fwd",
            "from": "users",
            "to": "booking_server",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_booking_server_to_seat_cache_fwd",
            "from": "booking_server",
            "to": "seat_cache",
            "type": "burst",
            "intensity": "high"
          },
          {
            "id": "i_c_booking_server_to_seat_db_fwd",
            "from": "booking_server",
            "to": "seat_db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "seat_cache",
          "zoom": 1.12
        }
      },
      "motionPersonality": "ENERGETIC",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "seat_cache"
          },
          {
            "type": "entity_removed",
            "entityId": "seat_lock"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_booking_server_to_seat_cache"
          },
          {
            "type": "connection_added",
            "connectionId": "c_booking_server_to_seat_db"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_booking_server_to_seat_lock"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_seat_lock_to_seat_db"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_booking_server_to_seat_cache_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_booking_server_to_seat_db_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_booking_server_to_seat_lock_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_seat_lock_to_seat_db_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_seat_lock_to_seat_db_blocked"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_users_to_booking_server_fwd",
            "from": "high",
            "to": "medium"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "seat_lock",
              "zoom": 1.14
            },
            "to": {
              "mode": "focus",
              "target": "seat_cache",
              "zoom": 1.12
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
            "entityId": "seat_lock",
            "elementIds": [
              "seat_lock"
            ],
            "action": "remove",
            "exit": "zoom_out",
            "cleanup": true
          }
        ],
        "moves": [],
        "additions": [
          {
            "entityId": "seat_cache",
            "elementIds": [
              "seat_cache"
            ],
            "action": "add",
            "enter": "zoom_in",
            "cleanup": false
          }
        ],
        "connections": [
          {
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "connect",
            "connectionId": "c_booking_server_to_seat_lock",
            "cleanup": false
          },
          {
            "entityId": "seat_cache",
            "elementIds": [
              "seat_cache"
            ],
            "action": "connect",
            "connectionId": "c_booking_server_to_seat_cache"
          },
          {
            "entityId": "seat_db",
            "elementIds": [
              "seat_db"
            ],
            "action": "connect",
            "connectionId": "c_seat_lock_to_seat_db",
            "cleanup": false
          },
          {
            "entityId": "seat_lock",
            "elementIds": [
              "seat_lock"
            ],
            "action": "connect",
            "connectionId": "c_seat_lock_to_seat_db",
            "cleanup": false
          }
        ],
        "interactions": [
          {
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_booking_server_fwd",
            "cleanup": false
          },
          {
            "entityId": "seat_cache",
            "elementIds": [
              "seat_cache"
            ],
            "action": "interact",
            "interactionId": "i_c_booking_server_to_seat_cache_fwd"
          },
          {
            "entityId": "seat_db",
            "elementIds": [
              "seat_db"
            ],
            "action": "interact",
            "interactionId": "i_c_seat_lock_to_seat_db_blocked",
            "cleanup": false
          },
          {
            "entityId": "seat_lock",
            "elementIds": [
              "seat_lock"
            ],
            "action": "interact",
            "interactionId": "i_c_seat_lock_to_seat_db_blocked",
            "cleanup": false
          },
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_booking_server_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "seat_lock",
            "action": "remove",
            "delay": 0,
            "duration": 0.28,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "seat_cache",
            "action": "add",
            "delay": 0.53,
            "duration": 0.32,
            "easing": "cubic-bezier(0.4,0,0.2,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_booking_server_to_seat_cache",
            "delay": 0.54,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_booking_server_to_seat_db",
            "delay": 0.56,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_booking_server_to_seat_lock",
            "delay": 0.5800000000000001,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_seat_lock_to_seat_db",
            "delay": 0.6000000000000001,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": {
        "targetId": "seat_cache",
        "targetElementId": "seat_cache",
        "zoom": 2.5,
        "duration": 0.26,
        "holdDuration": 0.6,
        "easing": "cubic-bezier(0.16,1,0.3,1)",
        "motionType": "introduce_primary"
      },
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "seat_cache",
            "type": "cache",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Seat Hold Cache",
            "icon": "memory-stick",
            "layout": {
              "x": 50,
              "y": 51.11166666666668
            }
          }
        ],
        "removedEntities": [
          {
            "id": "seat_lock",
            "type": "authorization_lock",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Seat Lock",
            "icon": "lock",
            "layout": {
              "x": 50,
              "y": 51.11166666666668
            }
          }
        ],
        "movedEntities": [],
        "updatedEntities": [],
        "addedConnections": [
          {
            "id": "c_booking_server_to_seat_cache",
            "from": "booking_server",
            "to": "seat_cache",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_booking_server_to_seat_db",
            "from": "booking_server",
            "to": "seat_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [
          {
            "id": "c_booking_server_to_seat_lock",
            "from": "booking_server",
            "to": "seat_lock",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_seat_lock_to_seat_db",
            "from": "seat_lock",
            "to": "seat_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "addedInteractions": [
          {
            "id": "i_c_booking_server_to_seat_cache_fwd",
            "from": "booking_server",
            "to": "seat_cache",
            "type": "burst",
            "intensity": "high"
          },
          {
            "id": "i_c_booking_server_to_seat_db_fwd",
            "from": "booking_server",
            "to": "seat_db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_booking_server_to_seat_lock_fwd",
            "from": "booking_server",
            "to": "seat_lock",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_seat_lock_to_seat_db_fwd",
            "from": "seat_lock",
            "to": "seat_db",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_seat_lock_to_seat_db_blocked",
            "from": "seat_lock",
            "to": "seat_db",
            "type": "blocked",
            "intensity": "high"
          }
        ],
        "interactionIntensityChanged": [
          {
            "id": "i_c_users_to_booking_server_fwd",
            "from": "high",
            "to": "medium"
          }
        ],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "seat_lock",
            "zoom": 1.14
          },
          "to": {
            "mode": "focus",
            "target": "seat_cache",
            "zoom": 1.12
          }
        }
      }
    },
    {
      "id": "s6-expansion-atomic-check-set",
      "start": 20,
      "end": 24,
      "narration": "The server does one atomic cache check-and-set, so only one hold exists.",
      "camera": "focus",
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
          "id": "booking_server",
          "type": "server",
          "sourceEntityId": "booking_server",
          "label": "Booking Server",
          "icon": "server",
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
          "id": "seat_cache",
          "type": "cache",
          "sourceEntityId": "seat_cache",
          "label": "Seat Hold Cache",
          "icon": "memory-stick",
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
          "count": 2,
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
          "id": "booking_server",
          "type": "server",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Booking Server",
          "icon": "server",
          "layout": {
            "x": 50,
            "y": 40.25
          }
        },
        {
          "id": "seat_cache",
          "type": "cache",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Seat Hold Cache",
          "icon": "memory-stick",
          "layout": {
            "x": 50,
            "y": 70.84
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_booking_server",
          "from": "users",
          "to": "booking_server",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_booking_server_to_seat_cache",
          "from": "booking_server",
          "to": "seat_cache",
          "direction": "bidirectional",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_booking_server_fwd",
          "from": "users",
          "to": "booking_server",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_booking_server_to_seat_cache_fwd",
          "from": "booking_server",
          "to": "seat_cache",
          "type": "ping",
          "intensity": "high"
        },
        {
          "id": "i_c_booking_server_to_seat_cache_rev",
          "from": "seat_cache",
          "to": "booking_server",
          "type": "ping",
          "intensity": "high"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "seat_cache",
        "zoom": 1.18
      },
      "directives": {
        "camera": {
          "mode": "follow_action",
          "zoom": "tight",
          "active_zone": "center",
          "reserve_bottom_percent": 25
        },
        "visual": {
          "theme": "default",
          "background_texture": "none",
          "glow_strength": "soft"
        },
        "motion": {
          "entry_style": "elastic_pop",
          "pacing": "reel_fast"
        },
        "flow": {
          "renderer": "packets"
        }
      },
      "source": {
        "entities": [
          {
            "id": "users",
            "type": "users_cluster",
            "count": 2,
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
            "id": "booking_server",
            "type": "server",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Booking Server",
            "icon": "server",
            "layout": {
              "x": 50,
              "y": 40.25
            }
          },
          {
            "id": "seat_cache",
            "type": "cache",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Seat Hold Cache",
            "icon": "memory-stick",
            "layout": {
              "x": 50,
              "y": 70.84
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_booking_server",
            "from": "users",
            "to": "booking_server",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_booking_server_to_seat_cache",
            "from": "booking_server",
            "to": "seat_cache",
            "direction": "bidirectional",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_booking_server_fwd",
            "from": "users",
            "to": "booking_server",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_booking_server_to_seat_cache_fwd",
            "from": "booking_server",
            "to": "seat_cache",
            "type": "ping",
            "intensity": "high"
          },
          {
            "id": "i_c_booking_server_to_seat_cache_rev",
            "from": "seat_cache",
            "to": "booking_server",
            "type": "ping",
            "intensity": "high"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "seat_cache",
          "zoom": 1.18
        }
      },
      "motionPersonality": "ENERGETIC",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_removed",
            "entityId": "seat_db"
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
            "entityId": "booking_server",
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
            "entityId": "seat_cache",
            "from": {
              "x": 50,
              "y": 51.11166666666668
            },
            "to": {
              "x": 50,
              "y": 70.84
            }
          },
          {
            "type": "entity_status_changed",
            "entityId": "users",
            "from": "active",
            "to": "normal"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_removed",
            "connectionId": "c_booking_server_to_seat_db"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_booking_server_to_seat_cache_rev"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_booking_server_to_seat_db_fwd"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "seat_cache",
              "zoom": 1.12
            },
            "to": {
              "mode": "focus",
              "target": "seat_cache",
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
            "entityId": "seat_db",
            "elementIds": [
              "seat_db"
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
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "move"
          },
          {
            "entityId": "seat_cache",
            "elementIds": [
              "seat_cache"
            ],
            "action": "move"
          }
        ],
        "additions": [],
        "connections": [
          {
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "connect",
            "connectionId": "c_booking_server_to_seat_db"
          },
          {
            "entityId": "seat_db",
            "elementIds": [
              "seat_db"
            ],
            "action": "connect",
            "connectionId": "c_booking_server_to_seat_db"
          }
        ],
        "interactions": [
          {
            "entityId": "seat_cache",
            "elementIds": [
              "seat_cache"
            ],
            "action": "interact",
            "interactionId": "i_c_booking_server_to_seat_cache_rev"
          },
          {
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "interact",
            "interactionId": "i_c_booking_server_to_seat_db_fwd",
            "cleanup": false
          },
          {
            "entityId": "seat_db",
            "elementIds": [
              "seat_db"
            ],
            "action": "interact",
            "interactionId": "i_c_booking_server_to_seat_db_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "seat_db",
            "action": "remove",
            "delay": 0,
            "duration": 0.28,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "users",
            "action": "move",
            "delay": 0.4,
            "duration": 0.34,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "booking_server",
            "action": "move",
            "delay": 0.42000000000000004,
            "duration": 0.34,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "seat_cache",
            "action": "move",
            "delay": 0.44,
            "duration": 0.34,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          }
        ],
        "connections": [
          {
            "connectionId": "c_booking_server_to_seat_db",
            "delay": 0.54,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": {
        "targetId": "seat_cache",
        "targetElementId": "seat_cache",
        "zoom": 1.18,
        "duration": 0.55,
        "easing": "cubic-bezier(0.2,0,0,1)",
        "motionType": "focus_primary"
      },
      "sceneDiff": {
        "addedEntities": [],
        "removedEntities": [
          {
            "id": "seat_db",
            "type": "primary_database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Seat Database",
            "icon": "database",
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
            "id": "booking_server",
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
            "id": "seat_cache",
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
        "updatedEntities": [
          {
            "id": "users",
            "changes": {
              "status": {
                "from": "active",
                "to": "normal"
              }
            }
          }
        ],
        "addedConnections": [],
        "removedConnections": [
          {
            "id": "c_booking_server_to_seat_db",
            "from": "booking_server",
            "to": "seat_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "addedInteractions": [
          {
            "id": "i_c_booking_server_to_seat_cache_rev",
            "from": "seat_cache",
            "to": "booking_server",
            "type": "ping",
            "intensity": "high"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_booking_server_to_seat_db_fwd",
            "from": "booking_server",
            "to": "seat_db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "seat_cache",
            "zoom": 1.12
          },
          "to": {
            "mode": "focus",
            "target": "seat_cache",
            "zoom": 1.18
          }
        }
      }
    },
    {
      "id": "s7-escalation-surge-scale-lock-layer",
      "start": 24,
      "end": 28,
      "narration": "During a booking surge, traffic fans out to multiple lock instances sharing cache.",
      "camera": "focus",
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
          "id": "seat_lock",
          "type": "authorization_lock",
          "sourceEntityId": "seat_lock",
          "label": "Seat Lock",
          "icon": "lock",
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
          "id": "seat_cache",
          "type": "cache",
          "sourceEntityId": "seat_cache",
          "label": "Seat Hold Cache",
          "icon": "memory-stick",
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
          "count": 6,
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
          "id": "seat_lock",
          "type": "authorization_lock",
          "count": 3,
          "importance": "primary",
          "status": "active",
          "label": "Seat Lock",
          "icon": "lock",
          "layout": {
            "x": 50,
            "y": 40.25
          }
        },
        {
          "id": "seat_cache",
          "type": "cache",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Seat Hold Cache",
          "icon": "memory-stick",
          "layout": {
            "x": 50,
            "y": 70.84
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_seat_lock",
          "from": "users",
          "to": "seat_lock",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_seat_lock_to_seat_cache",
          "from": "seat_lock",
          "to": "seat_cache",
          "direction": "bidirectional",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_seat_lock_fwd",
          "from": "users",
          "to": "seat_lock",
          "type": "burst",
          "intensity": "high"
        },
        {
          "id": "i_c_seat_lock_to_seat_cache_fwd",
          "from": "seat_lock",
          "to": "seat_cache",
          "type": "ping",
          "intensity": "high"
        },
        {
          "id": "i_c_seat_lock_to_seat_cache_rev",
          "from": "seat_cache",
          "to": "seat_lock",
          "type": "ping",
          "intensity": "high"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "seat_lock",
        "zoom": 1.16
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
          "entry_style": "drop_bounce",
          "pacing": "reel_fast"
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
            "count": 6,
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
            "id": "seat_lock",
            "type": "authorization_lock",
            "count": 3,
            "importance": "primary",
            "status": "active",
            "label": "Seat Lock",
            "icon": "lock",
            "layout": {
              "x": 50,
              "y": 40.25
            }
          },
          {
            "id": "seat_cache",
            "type": "cache",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Seat Hold Cache",
            "icon": "memory-stick",
            "layout": {
              "x": 50,
              "y": 70.84
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_seat_lock",
            "from": "users",
            "to": "seat_lock",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_seat_lock_to_seat_cache",
            "from": "seat_lock",
            "to": "seat_cache",
            "direction": "bidirectional",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_seat_lock_fwd",
            "from": "users",
            "to": "seat_lock",
            "type": "burst",
            "intensity": "high"
          },
          {
            "id": "i_c_seat_lock_to_seat_cache_fwd",
            "from": "seat_lock",
            "to": "seat_cache",
            "type": "ping",
            "intensity": "high"
          },
          {
            "id": "i_c_seat_lock_to_seat_cache_rev",
            "from": "seat_cache",
            "to": "seat_lock",
            "type": "ping",
            "intensity": "high"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "seat_lock",
          "zoom": 1.16
        }
      },
      "motionPersonality": "ENERGETIC",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "seat_lock"
          },
          {
            "type": "entity_removed",
            "entityId": "booking_server"
          },
          {
            "type": "entity_count_changed",
            "entityId": "users",
            "from": 2,
            "to": 6
          },
          {
            "type": "entity_status_changed",
            "entityId": "users",
            "from": "normal",
            "to": "active"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "seat_cache",
            "from": "primary",
            "to": "secondary"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_users_to_seat_lock"
          },
          {
            "type": "connection_added",
            "connectionId": "c_seat_lock_to_seat_cache"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_users_to_booking_server"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_booking_server_to_seat_cache"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_users_to_seat_lock_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_seat_lock_to_seat_cache_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_seat_lock_to_seat_cache_rev"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_users_to_booking_server_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_booking_server_to_seat_cache_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_booking_server_to_seat_cache_rev"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "seat_cache",
              "zoom": 1.18
            },
            "to": {
              "mode": "focus",
              "target": "seat_lock",
              "zoom": 1.16
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
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "remove",
            "exit": "zoom_out",
            "cleanup": true
          }
        ],
        "moves": [],
        "additions": [
          {
            "entityId": "seat_lock",
            "elementIds": [
              "seat_lock"
            ],
            "action": "add",
            "enter": "zoom_in"
          },
          {
            "entityId": "users",
            "elementIds": [
              "users"
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
            "connectionId": "c_users_to_booking_server",
            "cleanup": false
          },
          {
            "entityId": "seat_lock",
            "elementIds": [
              "seat_lock"
            ],
            "action": "connect",
            "connectionId": "c_seat_lock_to_seat_cache",
            "cleanup": false
          },
          {
            "entityId": "seat_cache",
            "elementIds": [
              "seat_cache"
            ],
            "action": "connect",
            "connectionId": "c_booking_server_to_seat_cache",
            "cleanup": false
          },
          {
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "connect",
            "connectionId": "c_booking_server_to_seat_cache",
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
            "interactionId": "i_c_users_to_booking_server_fwd",
            "cleanup": false
          },
          {
            "entityId": "seat_lock",
            "elementIds": [
              "seat_lock"
            ],
            "action": "interact",
            "interactionId": "i_c_seat_lock_to_seat_cache_rev",
            "cleanup": false
          },
          {
            "entityId": "seat_cache",
            "elementIds": [
              "seat_cache"
            ],
            "action": "interact",
            "interactionId": "i_c_booking_server_to_seat_cache_rev",
            "cleanup": false
          },
          {
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "interact",
            "interactionId": "i_c_booking_server_to_seat_cache_rev",
            "cleanup": false
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "booking_server",
            "action": "remove",
            "delay": 0,
            "duration": 0.28,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "seat_lock",
            "action": "add",
            "delay": 0.53,
            "duration": 0.32,
            "easing": "cubic-bezier(0.4,0,0.2,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_users_to_seat_lock",
            "delay": 0.54,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_seat_lock_to_seat_cache",
            "delay": 0.56,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_users_to_booking_server",
            "delay": 0.5800000000000001,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_booking_server_to_seat_cache",
            "delay": 0.6000000000000001,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": {
        "targetId": "seat_lock",
        "targetElementId": "seat_lock",
        "zoom": 2.8,
        "duration": 0.26,
        "holdDuration": 0.6,
        "easing": "cubic-bezier(0.16,1,0.3,1)",
        "motionType": "introduce_primary"
      },
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "seat_lock",
            "type": "authorization_lock",
            "count": 3,
            "importance": "primary",
            "status": "active",
            "label": "Seat Lock",
            "icon": "lock",
            "layout": {
              "x": 50,
              "y": 40.25
            }
          }
        ],
        "removedEntities": [
          {
            "id": "booking_server",
            "type": "server",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Booking Server",
            "icon": "server",
            "layout": {
              "x": 50,
              "y": 40.25
            }
          }
        ],
        "movedEntities": [],
        "updatedEntities": [
          {
            "id": "users",
            "changes": {
              "status": {
                "from": "normal",
                "to": "active"
              },
              "count": {
                "from": 2,
                "to": 6
              }
            }
          },
          {
            "id": "seat_cache",
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
            "id": "c_users_to_seat_lock",
            "from": "users",
            "to": "seat_lock",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_seat_lock_to_seat_cache",
            "from": "seat_lock",
            "to": "seat_cache",
            "direction": "bidirectional",
            "style": "solid"
          }
        ],
        "removedConnections": [
          {
            "id": "c_users_to_booking_server",
            "from": "users",
            "to": "booking_server",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_booking_server_to_seat_cache",
            "from": "booking_server",
            "to": "seat_cache",
            "direction": "bidirectional",
            "style": "solid"
          }
        ],
        "addedInteractions": [
          {
            "id": "i_c_users_to_seat_lock_fwd",
            "from": "users",
            "to": "seat_lock",
            "type": "burst",
            "intensity": "high"
          },
          {
            "id": "i_c_seat_lock_to_seat_cache_fwd",
            "from": "seat_lock",
            "to": "seat_cache",
            "type": "ping",
            "intensity": "high"
          },
          {
            "id": "i_c_seat_lock_to_seat_cache_rev",
            "from": "seat_cache",
            "to": "seat_lock",
            "type": "ping",
            "intensity": "high"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_users_to_booking_server_fwd",
            "from": "users",
            "to": "booking_server",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_booking_server_to_seat_cache_fwd",
            "from": "booking_server",
            "to": "seat_cache",
            "type": "ping",
            "intensity": "high"
          },
          {
            "id": "i_c_booking_server_to_seat_cache_rev",
            "from": "seat_cache",
            "to": "booking_server",
            "type": "ping",
            "intensity": "high"
          }
        ],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "seat_cache",
            "zoom": 1.18
          },
          "to": {
            "mode": "focus",
            "target": "seat_lock",
            "zoom": 1.16
          }
        }
      }
    },
    {
      "id": "s8-solution-payment-then-commit",
      "start": 28,
      "end": 32,
      "narration": "After a hold, payment service confirms, and the database commits the seat.",
      "camera": "focus",
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
          "id": "booking_server",
          "type": "server",
          "sourceEntityId": "booking_server",
          "label": "Booking Server",
          "icon": "server",
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
          "id": "payment_service",
          "type": "payment_service",
          "sourceEntityId": "payment_service",
          "label": "Payment Service",
          "icon": "credit-card",
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
          "id": "seat_db",
          "type": "primary_database",
          "sourceEntityId": "seat_db",
          "label": "Seat Database",
          "icon": "database",
          "position": {
            "x": 50,
            "y": 72.83500000000001
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
        }
      ],
      "entities": [
        {
          "id": "users",
          "type": "users_cluster",
          "count": 2,
          "importance": "secondary",
          "status": "active",
          "label": "Users",
          "icon": "users",
          "layout": {
            "x": 50,
            "y": 7.664999999999999
          }
        },
        {
          "id": "booking_server",
          "type": "server",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Booking Server",
          "icon": "server",
          "layout": {
            "x": 50,
            "y": 29.38833333333334
          }
        },
        {
          "id": "payment_service",
          "type": "payment_service",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Payment Service",
          "icon": "credit-card",
          "layout": {
            "x": 50,
            "y": 51.11166666666668
          }
        },
        {
          "id": "seat_db",
          "type": "primary_database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Seat Database",
          "icon": "database",
          "layout": {
            "x": 50,
            "y": 72.83500000000001
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_booking_server",
          "from": "users",
          "to": "booking_server",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_booking_server_to_payment_service",
          "from": "booking_server",
          "to": "payment_service",
          "direction": "bidirectional",
          "style": "solid"
        },
        {
          "id": "c_booking_server_to_seat_db",
          "from": "booking_server",
          "to": "seat_db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_booking_server_fwd",
          "from": "users",
          "to": "booking_server",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_booking_server_to_payment_service_fwd",
          "from": "booking_server",
          "to": "payment_service",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_booking_server_to_payment_service_rev",
          "from": "payment_service",
          "to": "booking_server",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_booking_server_to_seat_db_fwd",
          "from": "booking_server",
          "to": "seat_db",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "payment_service",
        "zoom": 1.12
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
          "background_texture": "none",
          "glow_strength": "soft"
        },
        "motion": {
          "entry_style": "draw_in",
          "pacing": "reel_fast"
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
            "count": 2,
            "importance": "secondary",
            "status": "active",
            "label": "Users",
            "icon": "users",
            "layout": {
              "x": 50,
              "y": 7.664999999999999
            }
          },
          {
            "id": "booking_server",
            "type": "server",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Booking Server",
            "icon": "server",
            "layout": {
              "x": 50,
              "y": 29.38833333333334
            }
          },
          {
            "id": "payment_service",
            "type": "payment_service",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Payment Service",
            "icon": "credit-card",
            "layout": {
              "x": 50,
              "y": 51.11166666666668
            }
          },
          {
            "id": "seat_db",
            "type": "primary_database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Seat Database",
            "icon": "database",
            "layout": {
              "x": 50,
              "y": 72.83500000000001
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_booking_server",
            "from": "users",
            "to": "booking_server",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_booking_server_to_payment_service",
            "from": "booking_server",
            "to": "payment_service",
            "direction": "bidirectional",
            "style": "solid"
          },
          {
            "id": "c_booking_server_to_seat_db",
            "from": "booking_server",
            "to": "seat_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_booking_server_fwd",
            "from": "users",
            "to": "booking_server",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_booking_server_to_payment_service_fwd",
            "from": "booking_server",
            "to": "payment_service",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_booking_server_to_payment_service_rev",
            "from": "payment_service",
            "to": "booking_server",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_booking_server_to_seat_db_fwd",
            "from": "booking_server",
            "to": "seat_db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "payment_service",
          "zoom": 1.12
        }
      },
      "motionPersonality": "ENERGETIC",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "booking_server"
          },
          {
            "type": "entity_added",
            "entityId": "payment_service"
          },
          {
            "type": "entity_added",
            "entityId": "seat_db"
          },
          {
            "type": "entity_removed",
            "entityId": "seat_lock"
          },
          {
            "type": "entity_removed",
            "entityId": "seat_cache"
          },
          {
            "type": "entity_moved",
            "entityId": "users",
            "from": {
              "x": 50,
              "y": 9.66
            },
            "to": {
              "x": 50,
              "y": 7.664999999999999
            }
          },
          {
            "type": "entity_count_changed",
            "entityId": "users",
            "from": 6,
            "to": 2
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_users_to_booking_server"
          },
          {
            "type": "connection_added",
            "connectionId": "c_booking_server_to_payment_service"
          },
          {
            "type": "connection_added",
            "connectionId": "c_booking_server_to_seat_db"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_users_to_seat_lock"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_seat_lock_to_seat_cache"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_users_to_booking_server_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_booking_server_to_payment_service_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_booking_server_to_payment_service_rev"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_booking_server_to_seat_db_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_users_to_seat_lock_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_seat_lock_to_seat_cache_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_seat_lock_to_seat_cache_rev"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "seat_lock",
              "zoom": 1.16
            },
            "to": {
              "mode": "focus",
              "target": "payment_service",
              "zoom": 1.12
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
            "entityId": "seat_lock",
            "elementIds": [
              "seat_lock"
            ],
            "action": "remove",
            "exit": "zoom_out",
            "cleanup": true
          },
          {
            "entityId": "seat_cache",
            "elementIds": [
              "seat_cache"
            ],
            "action": "remove",
            "exit": "zoom_out",
            "cleanup": true
          },
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
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "move"
          }
        ],
        "additions": [
          {
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "add",
            "enter": "zoom_in"
          },
          {
            "entityId": "payment_service",
            "elementIds": [
              "payment_service"
            ],
            "action": "add",
            "enter": "zoom_in",
            "cleanup": false
          },
          {
            "entityId": "seat_db",
            "elementIds": [
              "seat_db"
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
            "connectionId": "c_users_to_seat_lock",
            "cleanup": false
          },
          {
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "connect",
            "connectionId": "c_booking_server_to_seat_db",
            "cleanup": false
          },
          {
            "entityId": "payment_service",
            "elementIds": [
              "payment_service"
            ],
            "action": "connect",
            "connectionId": "c_booking_server_to_payment_service"
          },
          {
            "entityId": "seat_db",
            "elementIds": [
              "seat_db"
            ],
            "action": "connect",
            "connectionId": "c_booking_server_to_seat_db"
          },
          {
            "entityId": "seat_lock",
            "elementIds": [
              "seat_lock"
            ],
            "action": "connect",
            "connectionId": "c_seat_lock_to_seat_cache",
            "cleanup": false
          },
          {
            "entityId": "seat_cache",
            "elementIds": [
              "seat_cache"
            ],
            "action": "connect",
            "connectionId": "c_seat_lock_to_seat_cache"
          }
        ],
        "interactions": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_seat_lock_fwd",
            "cleanup": false
          },
          {
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "interact",
            "interactionId": "i_c_booking_server_to_seat_db_fwd",
            "cleanup": false
          },
          {
            "entityId": "payment_service",
            "elementIds": [
              "payment_service"
            ],
            "action": "interact",
            "interactionId": "i_c_booking_server_to_payment_service_rev",
            "cleanup": false
          },
          {
            "entityId": "seat_db",
            "elementIds": [
              "seat_db"
            ],
            "action": "interact",
            "interactionId": "i_c_booking_server_to_seat_db_fwd"
          },
          {
            "entityId": "seat_lock",
            "elementIds": [
              "seat_lock"
            ],
            "action": "interact",
            "interactionId": "i_c_seat_lock_to_seat_cache_rev",
            "cleanup": false
          },
          {
            "entityId": "seat_cache",
            "elementIds": [
              "seat_cache"
            ],
            "action": "interact",
            "interactionId": "i_c_seat_lock_to_seat_cache_rev",
            "cleanup": false
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "seat_lock",
            "action": "remove",
            "delay": 0,
            "duration": 0.28,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "seat_cache",
            "action": "remove",
            "delay": 0.02,
            "duration": 0.28,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "users",
            "action": "move",
            "delay": 0.4,
            "duration": 0.34,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "booking_server",
            "action": "add",
            "delay": 0.5870000000000001,
            "duration": 0.28,
            "easing": "cubic-bezier(0.4,0,0.2,1)",
            "isPrimary": false
          },
          {
            "entityId": "seat_db",
            "action": "add",
            "delay": 0.6170000000000001,
            "duration": 0.28,
            "easing": "cubic-bezier(0.4,0,0.2,1)",
            "isPrimary": false
          },
          {
            "entityId": "payment_service",
            "action": "add",
            "delay": 0.6970000000000001,
            "duration": 0.32,
            "easing": "cubic-bezier(0.4,0,0.2,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_users_to_booking_server",
            "delay": 0.54,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_booking_server_to_payment_service",
            "delay": 0.56,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_booking_server_to_seat_db",
            "delay": 0.5800000000000001,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_users_to_seat_lock",
            "delay": 0.6000000000000001,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_seat_lock_to_seat_cache",
            "delay": 0.62,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": {
        "targetId": "payment_service",
        "targetElementId": "payment_service",
        "zoom": 2.5,
        "duration": 0.26,
        "holdDuration": 0.6,
        "easing": "cubic-bezier(0.16,1,0.3,1)",
        "motionType": "introduce_primary"
      },
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "booking_server",
            "type": "server",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Booking Server",
            "icon": "server",
            "layout": {
              "x": 50,
              "y": 29.38833333333334
            }
          },
          {
            "id": "payment_service",
            "type": "payment_service",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Payment Service",
            "icon": "credit-card",
            "layout": {
              "x": 50,
              "y": 51.11166666666668
            }
          },
          {
            "id": "seat_db",
            "type": "primary_database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Seat Database",
            "icon": "database",
            "layout": {
              "x": 50,
              "y": 72.83500000000001
            }
          }
        ],
        "removedEntities": [
          {
            "id": "seat_lock",
            "type": "authorization_lock",
            "count": 3,
            "importance": "primary",
            "status": "active",
            "label": "Seat Lock",
            "icon": "lock",
            "layout": {
              "x": 50,
              "y": 40.25
            }
          },
          {
            "id": "seat_cache",
            "type": "cache",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Seat Hold Cache",
            "icon": "memory-stick",
            "layout": {
              "x": 50,
              "y": 70.84
            }
          }
        ],
        "movedEntities": [
          {
            "id": "users",
            "from": {
              "x": 50,
              "y": 9.66
            },
            "to": {
              "x": 50,
              "y": 7.664999999999999
            }
          }
        ],
        "updatedEntities": [
          {
            "id": "users",
            "changes": {
              "count": {
                "from": 6,
                "to": 2
              }
            }
          }
        ],
        "addedConnections": [
          {
            "id": "c_users_to_booking_server",
            "from": "users",
            "to": "booking_server",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_booking_server_to_payment_service",
            "from": "booking_server",
            "to": "payment_service",
            "direction": "bidirectional",
            "style": "solid"
          },
          {
            "id": "c_booking_server_to_seat_db",
            "from": "booking_server",
            "to": "seat_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [
          {
            "id": "c_users_to_seat_lock",
            "from": "users",
            "to": "seat_lock",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_seat_lock_to_seat_cache",
            "from": "seat_lock",
            "to": "seat_cache",
            "direction": "bidirectional",
            "style": "solid"
          }
        ],
        "addedInteractions": [
          {
            "id": "i_c_users_to_booking_server_fwd",
            "from": "users",
            "to": "booking_server",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_booking_server_to_payment_service_fwd",
            "from": "booking_server",
            "to": "payment_service",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_booking_server_to_payment_service_rev",
            "from": "payment_service",
            "to": "booking_server",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_booking_server_to_seat_db_fwd",
            "from": "booking_server",
            "to": "seat_db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_users_to_seat_lock_fwd",
            "from": "users",
            "to": "seat_lock",
            "type": "burst",
            "intensity": "high"
          },
          {
            "id": "i_c_seat_lock_to_seat_cache_fwd",
            "from": "seat_lock",
            "to": "seat_cache",
            "type": "ping",
            "intensity": "high"
          },
          {
            "id": "i_c_seat_lock_to_seat_cache_rev",
            "from": "seat_cache",
            "to": "seat_lock",
            "type": "ping",
            "intensity": "high"
          }
        ],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "seat_lock",
            "zoom": 1.16
          },
          "to": {
            "mode": "focus",
            "target": "payment_service",
            "zoom": 1.12
          }
        }
      }
    },
    {
      "id": "s9-climax-timeout-release",
      "start": 32,
      "end": 36,
      "narration": "If payment fails, the cache hold expires, and the seat becomes available again.",
      "camera": "focus",
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
            "color": "#34D399",
            "strokeWidth": 2.645448922205832,
            "strokeColor": "#34D399",
            "glow": true,
            "glowColor": "#34D399",
            "glowBlur": 25.35,
            "textColor": "#E8F6FF",
            "fontSize": 47.879999999999995,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "payment_service",
          "type": "payment_service",
          "sourceEntityId": "payment_service",
          "label": "Payment Service",
          "icon": "credit-card",
          "position": {
            "x": 50,
            "y": 29.38833333333334
          },
          "visualStyle": {
            "size": 135,
            "opacity": 1,
            "color": "#FB923C",
            "strokeWidth": 2.645448922205832,
            "strokeColor": "#FB923C",
            "glow": true,
            "glowColor": "#FB923C",
            "glowBlur": 33.15,
            "textColor": "#E8F6FF",
            "fontSize": 47.879999999999995,
            "fontWeight": 600,
            "status": "error"
          }
        },
        {
          "id": "seat_cache",
          "type": "cache",
          "sourceEntityId": "seat_cache",
          "label": "Seat Hold Cache",
          "icon": "memory-stick",
          "position": {
            "x": 50,
            "y": 51.11166666666668
          },
          "visualStyle": {
            "size": 135,
            "opacity": 1,
            "color": "#FB923C",
            "strokeWidth": 2.645448922205832,
            "strokeColor": "#FB923C",
            "glow": true,
            "glowColor": "#FB923C",
            "glowBlur": 33.15,
            "textColor": "#E8F6FF",
            "fontSize": 47.879999999999995,
            "fontWeight": 600,
            "status": "error"
          }
        },
        {
          "id": "seat_db",
          "type": "primary_database",
          "sourceEntityId": "seat_db",
          "label": "Seat Database",
          "icon": "database",
          "position": {
            "x": 50,
            "y": 72.83500000000001
          },
          "visualStyle": {
            "size": 135,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.645448922205832,
            "strokeColor": "#35C4C8",
            "glow": true,
            "glowColor": "#35C4C8",
            "glowBlur": 25.35,
            "textColor": "#E8F6FF",
            "fontSize": 47.879999999999995,
            "fontWeight": 600,
            "status": "normal"
          }
        }
      ],
      "entities": [
        {
          "id": "users",
          "type": "users_cluster",
          "count": 2,
          "importance": "secondary",
          "status": "active",
          "label": "Users",
          "icon": "users",
          "layout": {
            "x": 50,
            "y": 7.664999999999999
          }
        },
        {
          "id": "payment_service",
          "type": "payment_service",
          "count": 1,
          "importance": "secondary",
          "status": "error",
          "label": "Payment Service",
          "icon": "credit-card",
          "layout": {
            "x": 50,
            "y": 29.38833333333334
          }
        },
        {
          "id": "seat_cache",
          "type": "cache",
          "count": 1,
          "importance": "primary",
          "status": "error",
          "label": "Seat Hold Cache",
          "icon": "memory-stick",
          "layout": {
            "x": 50,
            "y": 51.11166666666668
          }
        },
        {
          "id": "seat_db",
          "type": "primary_database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Seat Database",
          "icon": "database",
          "layout": {
            "x": 50,
            "y": 72.83500000000001
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_payment_service",
          "from": "users",
          "to": "payment_service",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_payment_service_to_seat_cache",
          "from": "payment_service",
          "to": "seat_cache",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_seat_cache_to_seat_db",
          "from": "seat_cache",
          "to": "seat_db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_payment_service_fwd",
          "from": "users",
          "to": "payment_service",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_payment_service_to_seat_cache_blocked",
          "from": "payment_service",
          "to": "seat_cache",
          "type": "blocked",
          "intensity": "high"
        },
        {
          "id": "i_c_seat_cache_to_seat_db_fwd",
          "from": "seat_cache",
          "to": "seat_db",
          "type": "burst",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "seat_cache",
        "zoom": 1.14
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
          "glow_strength": "strong"
        },
        "motion": {
          "entry_style": "elastic_pop",
          "pacing": "reel_fast"
        },
        "flow": {
          "renderer": "packets"
        }
      },
      "source": {
        "entities": [
          {
            "id": "users",
            "type": "users_cluster",
            "count": 2,
            "importance": "secondary",
            "status": "active",
            "label": "Users",
            "icon": "users",
            "layout": {
              "x": 50,
              "y": 7.664999999999999
            }
          },
          {
            "id": "payment_service",
            "type": "payment_service",
            "count": 1,
            "importance": "secondary",
            "status": "error",
            "label": "Payment Service",
            "icon": "credit-card",
            "layout": {
              "x": 50,
              "y": 29.38833333333334
            }
          },
          {
            "id": "seat_cache",
            "type": "cache",
            "count": 1,
            "importance": "primary",
            "status": "error",
            "label": "Seat Hold Cache",
            "icon": "memory-stick",
            "layout": {
              "x": 50,
              "y": 51.11166666666668
            }
          },
          {
            "id": "seat_db",
            "type": "primary_database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Seat Database",
            "icon": "database",
            "layout": {
              "x": 50,
              "y": 72.83500000000001
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_payment_service",
            "from": "users",
            "to": "payment_service",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_payment_service_to_seat_cache",
            "from": "payment_service",
            "to": "seat_cache",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_seat_cache_to_seat_db",
            "from": "seat_cache",
            "to": "seat_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_payment_service_fwd",
            "from": "users",
            "to": "payment_service",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_payment_service_to_seat_cache_blocked",
            "from": "payment_service",
            "to": "seat_cache",
            "type": "blocked",
            "intensity": "high"
          },
          {
            "id": "i_c_seat_cache_to_seat_db_fwd",
            "from": "seat_cache",
            "to": "seat_db",
            "type": "burst",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "seat_cache",
          "zoom": 1.14
        }
      },
      "motionPersonality": "ENERGETIC",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "seat_cache"
          },
          {
            "type": "entity_removed",
            "entityId": "booking_server"
          },
          {
            "type": "entity_moved",
            "entityId": "payment_service",
            "from": {
              "x": 50,
              "y": 51.11166666666668
            },
            "to": {
              "x": 50,
              "y": 29.38833333333334
            }
          },
          {
            "type": "entity_status_changed",
            "entityId": "payment_service",
            "from": "active",
            "to": "error"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "payment_service",
            "from": "primary",
            "to": "secondary"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_users_to_payment_service"
          },
          {
            "type": "connection_added",
            "connectionId": "c_payment_service_to_seat_cache"
          },
          {
            "type": "connection_added",
            "connectionId": "c_seat_cache_to_seat_db"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_users_to_booking_server"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_booking_server_to_payment_service"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_booking_server_to_seat_db"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_users_to_payment_service_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_payment_service_to_seat_cache_blocked"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_seat_cache_to_seat_db_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_users_to_booking_server_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_booking_server_to_payment_service_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_booking_server_to_payment_service_rev"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_booking_server_to_seat_db_fwd"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "payment_service",
              "zoom": 1.12
            },
            "to": {
              "mode": "focus",
              "target": "seat_cache",
              "zoom": 1.14
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
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "remove",
            "exit": "zoom_out",
            "cleanup": true
          }
        ],
        "moves": [
          {
            "entityId": "payment_service",
            "elementIds": [
              "payment_service"
            ],
            "action": "move"
          }
        ],
        "additions": [
          {
            "entityId": "seat_cache",
            "elementIds": [
              "seat_cache"
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
            "connectionId": "c_users_to_booking_server",
            "cleanup": false
          },
          {
            "entityId": "payment_service",
            "elementIds": [
              "payment_service"
            ],
            "action": "connect",
            "connectionId": "c_booking_server_to_payment_service",
            "cleanup": false
          },
          {
            "entityId": "seat_cache",
            "elementIds": [
              "seat_cache"
            ],
            "action": "connect",
            "connectionId": "c_seat_cache_to_seat_db",
            "cleanup": false
          },
          {
            "entityId": "seat_db",
            "elementIds": [
              "seat_db"
            ],
            "action": "connect",
            "connectionId": "c_booking_server_to_seat_db",
            "cleanup": false
          },
          {
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "connect",
            "connectionId": "c_booking_server_to_seat_db",
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
            "interactionId": "i_c_users_to_booking_server_fwd",
            "cleanup": false
          },
          {
            "entityId": "payment_service",
            "elementIds": [
              "payment_service"
            ],
            "action": "interact",
            "interactionId": "i_c_booking_server_to_payment_service_rev",
            "cleanup": false
          },
          {
            "entityId": "seat_cache",
            "elementIds": [
              "seat_cache"
            ],
            "action": "interact",
            "interactionId": "i_c_seat_cache_to_seat_db_fwd",
            "cleanup": false
          },
          {
            "entityId": "seat_db",
            "elementIds": [
              "seat_db"
            ],
            "action": "interact",
            "interactionId": "i_c_booking_server_to_seat_db_fwd",
            "cleanup": false
          },
          {
            "entityId": "booking_server",
            "elementIds": [
              "booking_server"
            ],
            "action": "interact",
            "interactionId": "i_c_booking_server_to_seat_db_fwd",
            "cleanup": false
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "booking_server",
            "action": "remove",
            "delay": 0,
            "duration": 0.28,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "payment_service",
            "action": "move",
            "delay": 0.4,
            "duration": 0.34,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "seat_cache",
            "action": "add",
            "delay": 0.6370000000000001,
            "duration": 0.32,
            "easing": "cubic-bezier(0.4,0,0.2,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_users_to_payment_service",
            "delay": 0.54,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_payment_service_to_seat_cache",
            "delay": 0.56,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_seat_cache_to_seat_db",
            "delay": 0.5800000000000001,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_users_to_booking_server",
            "delay": 0.6000000000000001,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_booking_server_to_payment_service",
            "delay": 0.62,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_booking_server_to_seat_db",
            "delay": 0.64,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": {
        "targetId": "seat_cache",
        "targetElementId": "seat_cache",
        "zoom": 2.5,
        "duration": 0.26,
        "holdDuration": 0.6,
        "easing": "cubic-bezier(0.16,1,0.3,1)",
        "motionType": "introduce_primary"
      },
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "seat_cache",
            "type": "cache",
            "count": 1,
            "importance": "primary",
            "status": "error",
            "label": "Seat Hold Cache",
            "icon": "memory-stick",
            "layout": {
              "x": 50,
              "y": 51.11166666666668
            }
          }
        ],
        "removedEntities": [
          {
            "id": "booking_server",
            "type": "server",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Booking Server",
            "icon": "server",
            "layout": {
              "x": 50,
              "y": 29.38833333333334
            }
          }
        ],
        "movedEntities": [
          {
            "id": "payment_service",
            "from": {
              "x": 50,
              "y": 51.11166666666668
            },
            "to": {
              "x": 50,
              "y": 29.38833333333334
            }
          }
        ],
        "updatedEntities": [
          {
            "id": "payment_service",
            "changes": {
              "status": {
                "from": "active",
                "to": "error"
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
            "id": "c_users_to_payment_service",
            "from": "users",
            "to": "payment_service",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_payment_service_to_seat_cache",
            "from": "payment_service",
            "to": "seat_cache",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_seat_cache_to_seat_db",
            "from": "seat_cache",
            "to": "seat_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [
          {
            "id": "c_users_to_booking_server",
            "from": "users",
            "to": "booking_server",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_booking_server_to_payment_service",
            "from": "booking_server",
            "to": "payment_service",
            "direction": "bidirectional",
            "style": "solid"
          },
          {
            "id": "c_booking_server_to_seat_db",
            "from": "booking_server",
            "to": "seat_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "addedInteractions": [
          {
            "id": "i_c_users_to_payment_service_fwd",
            "from": "users",
            "to": "payment_service",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_payment_service_to_seat_cache_blocked",
            "from": "payment_service",
            "to": "seat_cache",
            "type": "blocked",
            "intensity": "high"
          },
          {
            "id": "i_c_seat_cache_to_seat_db_fwd",
            "from": "seat_cache",
            "to": "seat_db",
            "type": "burst",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_users_to_booking_server_fwd",
            "from": "users",
            "to": "booking_server",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_booking_server_to_payment_service_fwd",
            "from": "booking_server",
            "to": "payment_service",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_booking_server_to_payment_service_rev",
            "from": "payment_service",
            "to": "booking_server",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_booking_server_to_seat_db_fwd",
            "from": "booking_server",
            "to": "seat_db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "payment_service",
            "zoom": 1.12
          },
          "to": {
            "mode": "focus",
            "target": "seat_cache",
            "zoom": 1.14
          }
        }
      }
    },
    {
      "id": "s10-recap-one-winner",
      "start": 36,
      "end": 40,
      "narration": "Lock plus cache hold ensures one winner, and the database stays consistent.",
      "camera": "wide",
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
          "id": "seat_lock",
          "type": "authorization_lock",
          "sourceEntityId": "seat_lock",
          "label": "Seat Lock",
          "icon": "lock",
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
          "id": "seat_cache",
          "type": "cache",
          "sourceEntityId": "seat_cache",
          "label": "Seat Hold Cache",
          "icon": "memory-stick",
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
          "id": "seat_db",
          "type": "primary_database",
          "sourceEntityId": "seat_db",
          "label": "Seat Database",
          "icon": "database",
          "position": {
            "x": 50,
            "y": 72.83500000000001
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
        }
      ],
      "entities": [
        {
          "id": "users",
          "type": "users_cluster",
          "count": 2,
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
          "id": "seat_lock",
          "type": "authorization_lock",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Seat Lock",
          "icon": "lock",
          "layout": {
            "x": 50,
            "y": 29.38833333333334
          }
        },
        {
          "id": "seat_cache",
          "type": "cache",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Seat Hold Cache",
          "icon": "memory-stick",
          "layout": {
            "x": 50,
            "y": 51.11166666666668
          }
        },
        {
          "id": "seat_db",
          "type": "primary_database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Seat Database",
          "icon": "database",
          "layout": {
            "x": 50,
            "y": 72.83500000000001
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_seat_lock",
          "from": "users",
          "to": "seat_lock",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_seat_lock_to_seat_cache",
          "from": "seat_lock",
          "to": "seat_cache",
          "direction": "bidirectional",
          "style": "solid"
        },
        {
          "id": "c_seat_cache_to_seat_db",
          "from": "seat_cache",
          "to": "seat_db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_seat_lock_fwd",
          "from": "users",
          "to": "seat_lock",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_seat_lock_to_seat_cache_fwd",
          "from": "seat_lock",
          "to": "seat_cache",
          "type": "ping",
          "intensity": "medium"
        },
        {
          "id": "i_c_seat_lock_to_seat_cache_rev",
          "from": "seat_cache",
          "to": "seat_lock",
          "type": "ping",
          "intensity": "medium"
        },
        {
          "id": "i_c_seat_cache_to_seat_db_fwd",
          "from": "seat_cache",
          "to": "seat_db",
          "type": "burst",
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
          "active_zone": "center",
          "reserve_bottom_percent": 25
        },
        "visual": {
          "theme": "default",
          "background_texture": "none",
          "glow_strength": "soft"
        },
        "motion": {
          "entry_style": "draw_in",
          "pacing": "reel_fast"
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
            "count": 2,
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
            "id": "seat_lock",
            "type": "authorization_lock",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Seat Lock",
            "icon": "lock",
            "layout": {
              "x": 50,
              "y": 29.38833333333334
            }
          },
          {
            "id": "seat_cache",
            "type": "cache",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Seat Hold Cache",
            "icon": "memory-stick",
            "layout": {
              "x": 50,
              "y": 51.11166666666668
            }
          },
          {
            "id": "seat_db",
            "type": "primary_database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Seat Database",
            "icon": "database",
            "layout": {
              "x": 50,
              "y": 72.83500000000001
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_seat_lock",
            "from": "users",
            "to": "seat_lock",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_seat_lock_to_seat_cache",
            "from": "seat_lock",
            "to": "seat_cache",
            "direction": "bidirectional",
            "style": "solid"
          },
          {
            "id": "c_seat_cache_to_seat_db",
            "from": "seat_cache",
            "to": "seat_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_seat_lock_fwd",
            "from": "users",
            "to": "seat_lock",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_seat_lock_to_seat_cache_fwd",
            "from": "seat_lock",
            "to": "seat_cache",
            "type": "ping",
            "intensity": "medium"
          },
          {
            "id": "i_c_seat_lock_to_seat_cache_rev",
            "from": "seat_cache",
            "to": "seat_lock",
            "type": "ping",
            "intensity": "medium"
          },
          {
            "id": "i_c_seat_cache_to_seat_db_fwd",
            "from": "seat_cache",
            "to": "seat_db",
            "type": "burst",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "wide",
          "zoom": 1
        }
      },
      "motionPersonality": "ENERGETIC",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "seat_lock"
          },
          {
            "type": "entity_removed",
            "entityId": "payment_service"
          },
          {
            "type": "entity_status_changed",
            "entityId": "users",
            "from": "active",
            "to": "normal"
          },
          {
            "type": "entity_status_changed",
            "entityId": "seat_cache",
            "from": "error",
            "to": "active"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "seat_cache",
            "from": "primary",
            "to": "secondary"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_users_to_seat_lock"
          },
          {
            "type": "connection_added",
            "connectionId": "c_seat_lock_to_seat_cache"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_users_to_payment_service"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_payment_service_to_seat_cache"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_users_to_seat_lock_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_seat_lock_to_seat_cache_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_seat_lock_to_seat_cache_rev"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_users_to_payment_service_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_payment_service_to_seat_cache_blocked"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "seat_cache",
              "zoom": 1.14
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
            "entityId": "payment_service",
            "elementIds": [
              "payment_service"
            ],
            "action": "remove",
            "exit": "zoom_out",
            "cleanup": true
          }
        ],
        "moves": [],
        "additions": [
          {
            "entityId": "seat_lock",
            "elementIds": [
              "seat_lock"
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
            "connectionId": "c_users_to_payment_service",
            "cleanup": false
          },
          {
            "entityId": "seat_lock",
            "elementIds": [
              "seat_lock"
            ],
            "action": "connect",
            "connectionId": "c_seat_lock_to_seat_cache",
            "cleanup": false
          },
          {
            "entityId": "seat_cache",
            "elementIds": [
              "seat_cache"
            ],
            "action": "connect",
            "connectionId": "c_payment_service_to_seat_cache",
            "cleanup": false
          },
          {
            "entityId": "payment_service",
            "elementIds": [
              "payment_service"
            ],
            "action": "connect",
            "connectionId": "c_payment_service_to_seat_cache",
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
            "interactionId": "i_c_users_to_payment_service_fwd",
            "cleanup": false
          },
          {
            "entityId": "seat_lock",
            "elementIds": [
              "seat_lock"
            ],
            "action": "interact",
            "interactionId": "i_c_seat_lock_to_seat_cache_rev",
            "cleanup": false
          },
          {
            "entityId": "seat_cache",
            "elementIds": [
              "seat_cache"
            ],
            "action": "interact",
            "interactionId": "i_c_payment_service_to_seat_cache_blocked",
            "cleanup": false
          },
          {
            "entityId": "payment_service",
            "elementIds": [
              "payment_service"
            ],
            "action": "interact",
            "interactionId": "i_c_payment_service_to_seat_cache_blocked",
            "cleanup": false
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "payment_service",
            "action": "remove",
            "delay": 0,
            "duration": 0.28,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "seat_lock",
            "action": "add",
            "delay": 0.53,
            "duration": 0.32,
            "easing": "cubic-bezier(0.4,0,0.2,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_users_to_seat_lock",
            "delay": 0.54,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_seat_lock_to_seat_cache",
            "delay": 0.56,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_users_to_payment_service",
            "delay": 0.5800000000000001,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_payment_service_to_seat_cache",
            "delay": 0.6000000000000001,
            "duration": 0.2,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": {
        "zoom": 1,
        "duration": 0.45,
        "easing": "cubic-bezier(0.2,0,0,1)",
        "motionType": "expand_architecture"
      },
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "seat_lock",
            "type": "authorization_lock",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Seat Lock",
            "icon": "lock",
            "layout": {
              "x": 50,
              "y": 29.38833333333334
            }
          }
        ],
        "removedEntities": [
          {
            "id": "payment_service",
            "type": "payment_service",
            "count": 1,
            "importance": "secondary",
            "status": "error",
            "label": "Payment Service",
            "icon": "credit-card",
            "layout": {
              "x": 50,
              "y": 29.38833333333334
            }
          }
        ],
        "movedEntities": [],
        "updatedEntities": [
          {
            "id": "users",
            "changes": {
              "status": {
                "from": "active",
                "to": "normal"
              }
            }
          },
          {
            "id": "seat_cache",
            "changes": {
              "status": {
                "from": "error",
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
            "id": "c_users_to_seat_lock",
            "from": "users",
            "to": "seat_lock",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_seat_lock_to_seat_cache",
            "from": "seat_lock",
            "to": "seat_cache",
            "direction": "bidirectional",
            "style": "solid"
          }
        ],
        "removedConnections": [
          {
            "id": "c_users_to_payment_service",
            "from": "users",
            "to": "payment_service",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_payment_service_to_seat_cache",
            "from": "payment_service",
            "to": "seat_cache",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "addedInteractions": [
          {
            "id": "i_c_users_to_seat_lock_fwd",
            "from": "users",
            "to": "seat_lock",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_seat_lock_to_seat_cache_fwd",
            "from": "seat_lock",
            "to": "seat_cache",
            "type": "ping",
            "intensity": "medium"
          },
          {
            "id": "i_c_seat_lock_to_seat_cache_rev",
            "from": "seat_cache",
            "to": "seat_lock",
            "type": "ping",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_users_to_payment_service_fwd",
            "from": "users",
            "to": "payment_service",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_payment_service_to_seat_cache_blocked",
            "from": "payment_service",
            "to": "seat_cache",
            "type": "blocked",
            "intensity": "high"
          }
        ],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "seat_cache",
            "zoom": 1.14
          },
          "to": {
            "mode": "wide",
            "zoom": 1
          }
        }
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
