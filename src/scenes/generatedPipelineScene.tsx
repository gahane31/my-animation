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
      "id": "s1",
      "start": 0,
      "end": 6,
      "narration": "A Users cluster sends steady API requests straight into one Server, and the Server talks to a Database to answer them.",
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
          "id": "app_server",
          "type": "server",
          "sourceEntityId": "app_server",
          "label": "Server",
          "icon": "server",
          "position": {
            "x": 50,
            "y": 40.25
          },
          "enter": "zoom_in",
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
          "id": "app_db",
          "type": "database",
          "sourceEntityId": "app_db",
          "label": "Database",
          "icon": "database",
          "position": {
            "x": 50,
            "y": 70.84
          },
          "enter": "zoom_in",
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
        }
      ],
      "entities": [
        {
          "id": "users",
          "type": "users_cluster",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Users",
          "icon": "users",
          "layout": {
            "x": 50,
            "y": 9.66
          }
        },
        {
          "id": "app_server",
          "type": "server",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Server",
          "icon": "server",
          "layout": {
            "x": 50,
            "y": 40.25
          }
        },
        {
          "id": "app_db",
          "type": "database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Database",
          "icon": "database",
          "layout": {
            "x": 50,
            "y": 70.84
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_server",
          "from": "users",
          "to": "app_server",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_server_to_db",
          "from": "app_server",
          "to": "app_db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_server_fwd",
          "from": "users",
          "to": "app_server",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_server_to_db_fwd",
          "from": "app_server",
          "to": "app_db",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "users",
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
            "importance": "primary",
            "status": "active",
            "label": "Users",
            "icon": "users",
            "layout": {
              "x": 50,
              "y": 9.66
            }
          },
          {
            "id": "app_server",
            "type": "server",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Server",
            "icon": "server",
            "layout": {
              "x": 50,
              "y": 40.25
            }
          },
          {
            "id": "app_db",
            "type": "database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Database",
            "icon": "database",
            "layout": {
              "x": 50,
              "y": 70.84
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_server",
            "from": "users",
            "to": "app_server",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_server_to_db",
            "from": "app_server",
            "to": "app_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_server_fwd",
            "from": "users",
            "to": "app_server",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_server_to_db_fwd",
            "from": "app_server",
            "to": "app_db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "users",
          "zoom": 1
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
            "entityId": "app_server"
          },
          {
            "type": "entity_added",
            "entityId": "app_db"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_users_to_server"
          },
          {
            "type": "connection_added",
            "connectionId": "c_server_to_db"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_users_to_server_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_server_to_db_fwd"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": null,
            "to": {
              "mode": "focus",
              "target": "users",
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
            "entityId": "app_server",
            "elementIds": [
              "app_server"
            ],
            "action": "add",
            "enter": "zoom_in"
          },
          {
            "entityId": "app_db",
            "elementIds": [
              "app_db"
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
            "connectionId": "c_users_to_server"
          },
          {
            "entityId": "app_server",
            "elementIds": [
              "app_server"
            ],
            "action": "connect",
            "connectionId": "c_server_to_db",
            "cleanup": false
          },
          {
            "entityId": "app_db",
            "elementIds": [
              "app_db"
            ],
            "action": "connect",
            "connectionId": "c_server_to_db"
          }
        ],
        "interactions": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_server_fwd"
          },
          {
            "entityId": "app_server",
            "elementIds": [
              "app_server"
            ],
            "action": "interact",
            "interactionId": "i_c_server_to_db_fwd",
            "cleanup": false
          },
          {
            "entityId": "app_db",
            "elementIds": [
              "app_db"
            ],
            "action": "interact",
            "interactionId": "i_c_server_to_db_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "app_db",
            "action": "add",
            "delay": 0.32399999999999995,
            "duration": 0.54,
            "easing": "cubic-bezier(0.4,0,0.2,1)",
            "isPrimary": false
          },
          {
            "entityId": "app_server",
            "action": "add",
            "delay": 0.354,
            "duration": 0.54,
            "easing": "cubic-bezier(0.4,0,0.2,1)",
            "isPrimary": false
          },
          {
            "entityId": "users",
            "action": "add",
            "delay": 0.43399999999999994,
            "duration": 0.62,
            "easing": "cubic-bezier(0.4,0,0.2,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_users_to_server",
            "delay": 0.504,
            "duration": 0.42,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_server_to_db",
            "delay": 0.544,
            "duration": 0.42,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
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
            "importance": "primary",
            "status": "active",
            "label": "Users",
            "icon": "users",
            "layout": {
              "x": 50,
              "y": 9.66
            }
          },
          {
            "id": "app_server",
            "type": "server",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Server",
            "icon": "server",
            "layout": {
              "x": 50,
              "y": 40.25
            }
          },
          {
            "id": "app_db",
            "type": "database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Database",
            "icon": "database",
            "layout": {
              "x": 50,
              "y": 70.84
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [],
        "updatedEntities": [],
        "addedConnections": [
          {
            "id": "c_users_to_server",
            "from": "users",
            "to": "app_server",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_server_to_db",
            "from": "app_server",
            "to": "app_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [],
        "addedInteractions": [
          {
            "id": "i_c_users_to_server_fwd",
            "from": "users",
            "to": "app_server",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_server_to_db_fwd",
            "from": "app_server",
            "to": "app_db",
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
            "target": "users",
            "zoom": 1
          }
        }
      }
    },
    {
      "id": "s2",
      "start": 6,
      "end": 12,
      "narration": "The same Users cluster now sends a burst of requests that overwhelms the single Server, and the Database becomes a bottleneck behind it.",
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
          "id": "app_server",
          "type": "server",
          "sourceEntityId": "app_server",
          "label": "Server",
          "icon": "server",
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
          "id": "app_db",
          "type": "database",
          "sourceEntityId": "app_db",
          "label": "Database",
          "icon": "database",
          "position": {
            "x": 50,
            "y": 70.84
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
          "id": "app_server",
          "type": "server",
          "count": 1,
          "importance": "primary",
          "status": "overloaded",
          "label": "Server",
          "icon": "server",
          "layout": {
            "x": 50,
            "y": 40.25
          }
        },
        {
          "id": "app_db",
          "type": "database",
          "count": 1,
          "importance": "secondary",
          "status": "overloaded",
          "label": "Database",
          "icon": "database",
          "layout": {
            "x": 50,
            "y": 70.84
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_server",
          "from": "users",
          "to": "app_server",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_server_to_db",
          "from": "app_server",
          "to": "app_db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_server_fwd",
          "from": "users",
          "to": "app_server",
          "type": "burst",
          "intensity": "high"
        },
        {
          "id": "i_c_server_to_db_fwd",
          "from": "app_server",
          "to": "app_db",
          "type": "flow",
          "intensity": "high"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "app_server",
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
            "id": "app_server",
            "type": "server",
            "count": 1,
            "importance": "primary",
            "status": "overloaded",
            "label": "Server",
            "icon": "server",
            "layout": {
              "x": 50,
              "y": 40.25
            }
          },
          {
            "id": "app_db",
            "type": "database",
            "count": 1,
            "importance": "secondary",
            "status": "overloaded",
            "label": "Database",
            "icon": "database",
            "layout": {
              "x": 50,
              "y": 70.84
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_server",
            "from": "users",
            "to": "app_server",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_server_to_db",
            "from": "app_server",
            "to": "app_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_server_fwd",
            "from": "users",
            "to": "app_server",
            "type": "burst",
            "intensity": "high"
          },
          {
            "id": "i_c_server_to_db_fwd",
            "from": "app_server",
            "to": "app_db",
            "type": "flow",
            "intensity": "high"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "app_server",
          "zoom": 1.1
        }
      },
      "motionPersonality": "ENERGETIC",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_importance_changed",
            "entityId": "users",
            "from": "primary",
            "to": "secondary"
          },
          {
            "type": "entity_status_changed",
            "entityId": "app_server",
            "from": "normal",
            "to": "overloaded"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "app_server",
            "from": "secondary",
            "to": "primary"
          },
          {
            "type": "entity_status_changed",
            "entityId": "app_db",
            "from": "normal",
            "to": "overloaded"
          }
        ],
        "connectionDiffs": [],
        "interactionDiffs": [
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_users_to_server_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_server_to_db_fwd",
            "from": "medium",
            "to": "high"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "users",
              "zoom": 1
            },
            "to": {
              "mode": "focus",
              "target": "app_server",
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
        "additions": [
          {
            "entityId": "app_server",
            "elementIds": [
              "app_server"
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
            "interactionId": "i_c_users_to_server_fwd"
          },
          {
            "entityId": "app_server",
            "elementIds": [
              "app_server"
            ],
            "action": "interact",
            "interactionId": "i_c_server_to_db_fwd",
            "cleanup": false
          },
          {
            "entityId": "app_db",
            "elementIds": [
              "app_db"
            ],
            "action": "interact",
            "interactionId": "i_c_server_to_db_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "app_server",
            "action": "add",
            "delay": 0.37399999999999994,
            "duration": 0.62,
            "easing": "cubic-bezier(0.4,0,0.2,1)",
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
            "id": "users",
            "changes": {
              "importance": {
                "from": "primary",
                "to": "secondary"
              }
            }
          },
          {
            "id": "app_server",
            "changes": {
              "status": {
                "from": "normal",
                "to": "overloaded"
              },
              "importance": {
                "from": "secondary",
                "to": "primary"
              }
            }
          },
          {
            "id": "app_db",
            "changes": {
              "status": {
                "from": "normal",
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
            "id": "i_c_users_to_server_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "id": "i_c_server_to_db_fwd",
            "from": "medium",
            "to": "high"
          }
        ],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "users",
            "zoom": 1
          },
          "to": {
            "mode": "focus",
            "target": "app_server",
            "zoom": 1.1
          }
        }
      }
    },
    {
      "id": "s3",
      "start": 12,
      "end": 18,
      "narration": "A Rate Limiter is inserted between Users and the Server so only a controlled number of requests per time window can pass through.",
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
          "id": "edge_rate_limiter",
          "type": "rate_limiter",
          "sourceEntityId": "edge_rate_limiter",
          "label": "Rate Limiter",
          "icon": "timer",
          "position": {
            "x": 50,
            "y": 29.38833333333334
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
          "id": "app_server",
          "type": "server",
          "sourceEntityId": "app_server",
          "label": "Server",
          "icon": "server",
          "position": {
            "x": 50,
            "y": 51.11166666666668
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
          "id": "app_db",
          "type": "database",
          "sourceEntityId": "app_db",
          "label": "Database",
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
          "count": 1,
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
          "id": "edge_rate_limiter",
          "type": "rate_limiter",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Rate Limiter",
          "icon": "timer",
          "layout": {
            "x": 50,
            "y": 29.38833333333334
          }
        },
        {
          "id": "app_server",
          "type": "server",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Server",
          "icon": "server",
          "layout": {
            "x": 50,
            "y": 51.11166666666668
          }
        },
        {
          "id": "app_db",
          "type": "database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Database",
          "icon": "database",
          "layout": {
            "x": 50,
            "y": 72.83500000000001
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_limiter",
          "from": "users",
          "to": "edge_rate_limiter",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_limiter_to_server",
          "from": "edge_rate_limiter",
          "to": "app_server",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_server_to_db",
          "from": "app_server",
          "to": "app_db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_limiter_fwd",
          "from": "users",
          "to": "edge_rate_limiter",
          "type": "flow",
          "intensity": "high"
        },
        {
          "id": "i_c_limiter_to_server_fwd",
          "from": "edge_rate_limiter",
          "to": "app_server",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_server_to_db_fwd",
          "from": "app_server",
          "to": "app_db",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "edge_rate_limiter",
        "zoom": 1.08
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
              "y": 7.664999999999999
            }
          },
          {
            "id": "edge_rate_limiter",
            "type": "rate_limiter",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Rate Limiter",
            "icon": "timer",
            "layout": {
              "x": 50,
              "y": 29.38833333333334
            }
          },
          {
            "id": "app_server",
            "type": "server",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Server",
            "icon": "server",
            "layout": {
              "x": 50,
              "y": 51.11166666666668
            }
          },
          {
            "id": "app_db",
            "type": "database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Database",
            "icon": "database",
            "layout": {
              "x": 50,
              "y": 72.83500000000001
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_limiter",
            "from": "users",
            "to": "edge_rate_limiter",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_limiter_to_server",
            "from": "edge_rate_limiter",
            "to": "app_server",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_server_to_db",
            "from": "app_server",
            "to": "app_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_limiter_fwd",
            "from": "users",
            "to": "edge_rate_limiter",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_limiter_to_server_fwd",
            "from": "edge_rate_limiter",
            "to": "app_server",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_server_to_db_fwd",
            "from": "app_server",
            "to": "app_db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "edge_rate_limiter",
          "zoom": 1.08
        }
      },
      "motionPersonality": "ENERGETIC",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "edge_rate_limiter"
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
            "entityId": "app_server",
            "from": {
              "x": 50,
              "y": 40.25
            },
            "to": {
              "x": 50,
              "y": 51.11166666666668
            }
          },
          {
            "type": "entity_moved",
            "entityId": "app_db",
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
            "entityId": "app_server",
            "from": "overloaded",
            "to": "normal"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "app_server",
            "from": "primary",
            "to": "secondary"
          },
          {
            "type": "entity_status_changed",
            "entityId": "app_db",
            "from": "overloaded",
            "to": "normal"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_users_to_limiter"
          },
          {
            "type": "connection_added",
            "connectionId": "c_limiter_to_server"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_users_to_server"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_users_to_limiter_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_limiter_to_server_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_users_to_server_fwd"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_server_to_db_fwd",
            "from": "high",
            "to": "medium"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "app_server",
              "zoom": 1.1
            },
            "to": {
              "mode": "focus",
              "target": "edge_rate_limiter",
              "zoom": 1.08
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
            "entityId": "app_server",
            "elementIds": [
              "app_server"
            ],
            "action": "move"
          },
          {
            "entityId": "app_db",
            "elementIds": [
              "app_db"
            ],
            "action": "move"
          }
        ],
        "additions": [
          {
            "entityId": "edge_rate_limiter",
            "elementIds": [
              "edge_rate_limiter"
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
            "connectionId": "c_users_to_server",
            "cleanup": false
          },
          {
            "entityId": "edge_rate_limiter",
            "elementIds": [
              "edge_rate_limiter"
            ],
            "action": "connect",
            "connectionId": "c_limiter_to_server",
            "cleanup": false
          },
          {
            "entityId": "app_server",
            "elementIds": [
              "app_server"
            ],
            "action": "connect",
            "connectionId": "c_users_to_server",
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
            "interactionId": "i_c_users_to_server_fwd",
            "cleanup": false
          },
          {
            "entityId": "edge_rate_limiter",
            "elementIds": [
              "edge_rate_limiter"
            ],
            "action": "interact",
            "interactionId": "i_c_limiter_to_server_fwd",
            "cleanup": false
          },
          {
            "entityId": "app_server",
            "elementIds": [
              "app_server"
            ],
            "action": "interact",
            "interactionId": "i_c_server_to_db_fwd",
            "cleanup": false
          },
          {
            "entityId": "app_db",
            "elementIds": [
              "app_db"
            ],
            "action": "interact",
            "interactionId": "i_c_server_to_db_fwd"
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
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "app_server",
            "action": "move",
            "delay": 0.6400000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "app_db",
            "action": "move",
            "delay": 0.68,
            "duration": 0.95,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "edge_rate_limiter",
            "action": "add",
            "delay": 0.37399999999999994,
            "duration": 0.62,
            "easing": "cubic-bezier(0.4,0,0.2,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_users_to_limiter",
            "delay": 0.504,
            "duration": 0.42,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_limiter_to_server",
            "delay": 0.544,
            "duration": 0.42,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_users_to_server",
            "delay": 0.584,
            "duration": 0.42,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "edge_rate_limiter",
            "type": "rate_limiter",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Rate Limiter",
            "icon": "timer",
            "layout": {
              "x": 50,
              "y": 29.38833333333334
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
            "id": "app_server",
            "from": {
              "x": 50,
              "y": 40.25
            },
            "to": {
              "x": 50,
              "y": 51.11166666666668
            }
          },
          {
            "id": "app_db",
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
            "id": "app_server",
            "changes": {
              "status": {
                "from": "overloaded",
                "to": "normal"
              },
              "importance": {
                "from": "primary",
                "to": "secondary"
              }
            }
          },
          {
            "id": "app_db",
            "changes": {
              "status": {
                "from": "overloaded",
                "to": "normal"
              }
            }
          }
        ],
        "addedConnections": [
          {
            "id": "c_users_to_limiter",
            "from": "users",
            "to": "edge_rate_limiter",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_limiter_to_server",
            "from": "edge_rate_limiter",
            "to": "app_server",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [
          {
            "id": "c_users_to_server",
            "from": "users",
            "to": "app_server",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "addedInteractions": [
          {
            "id": "i_c_users_to_limiter_fwd",
            "from": "users",
            "to": "edge_rate_limiter",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_limiter_to_server_fwd",
            "from": "edge_rate_limiter",
            "to": "app_server",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_users_to_server_fwd",
            "from": "users",
            "to": "app_server",
            "type": "burst",
            "intensity": "high"
          }
        ],
        "interactionIntensityChanged": [
          {
            "id": "i_c_server_to_db_fwd",
            "from": "high",
            "to": "medium"
          }
        ],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "app_server",
            "zoom": 1.1
          },
          "to": {
            "mode": "focus",
            "target": "edge_rate_limiter",
            "zoom": 1.08
          }
        }
      }
    },
    {
      "id": "s4",
      "start": 18,
      "end": 24,
      "narration": "Some requests flow from the Rate Limiter to the Server while extra requests are visibly blocked at the Rate Limiter instead of reaching the Database.",
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
          "id": "edge_rate_limiter",
          "type": "rate_limiter",
          "sourceEntityId": "edge_rate_limiter",
          "label": "Rate Limiter",
          "icon": "timer",
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
          },
          "effects": [
            "focus"
          ]
        },
        {
          "id": "app_server",
          "type": "server",
          "sourceEntityId": "app_server",
          "label": "Server",
          "icon": "server",
          "position": {
            "x": 50,
            "y": 51.11166666666668
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
          "id": "app_db",
          "type": "database",
          "sourceEntityId": "app_db",
          "label": "Database",
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
          "count": 1,
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
          "id": "edge_rate_limiter",
          "type": "rate_limiter",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Rate Limiter",
          "icon": "timer",
          "layout": {
            "x": 50,
            "y": 29.38833333333334
          }
        },
        {
          "id": "app_server",
          "type": "server",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Server",
          "icon": "server",
          "layout": {
            "x": 50,
            "y": 51.11166666666668
          }
        },
        {
          "id": "app_db",
          "type": "database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Database",
          "icon": "database",
          "layout": {
            "x": 50,
            "y": 72.83500000000001
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_limiter",
          "from": "users",
          "to": "edge_rate_limiter",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_limiter_to_server",
          "from": "edge_rate_limiter",
          "to": "app_server",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_server_to_db",
          "from": "app_server",
          "to": "app_db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_limiter_fwd",
          "from": "users",
          "to": "edge_rate_limiter",
          "type": "burst",
          "intensity": "high"
        },
        {
          "id": "i_c_limiter_to_server_fwd",
          "from": "edge_rate_limiter",
          "to": "app_server",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_server_to_db_fwd",
          "from": "app_server",
          "to": "app_db",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "edge_rate_limiter",
        "zoom": 1.08
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
              "y": 7.664999999999999
            }
          },
          {
            "id": "edge_rate_limiter",
            "type": "rate_limiter",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Rate Limiter",
            "icon": "timer",
            "layout": {
              "x": 50,
              "y": 29.38833333333334
            }
          },
          {
            "id": "app_server",
            "type": "server",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Server",
            "icon": "server",
            "layout": {
              "x": 50,
              "y": 51.11166666666668
            }
          },
          {
            "id": "app_db",
            "type": "database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Database",
            "icon": "database",
            "layout": {
              "x": 50,
              "y": 72.83500000000001
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_limiter",
            "from": "users",
            "to": "edge_rate_limiter",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_limiter_to_server",
            "from": "edge_rate_limiter",
            "to": "app_server",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_server_to_db",
            "from": "app_server",
            "to": "app_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_limiter_fwd",
            "from": "users",
            "to": "edge_rate_limiter",
            "type": "burst",
            "intensity": "high"
          },
          {
            "id": "i_c_limiter_to_server_fwd",
            "from": "edge_rate_limiter",
            "to": "app_server",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_server_to_db_fwd",
            "from": "app_server",
            "to": "app_db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "edge_rate_limiter",
          "zoom": 1.08
        }
      },
      "motionPersonality": "ENERGETIC",
      "diff": {
        "entityDiffs": [],
        "connectionDiffs": [],
        "interactionDiffs": [],
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
        "additions": [],
        "connections": [],
        "interactions": []
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
        "updatedEntities": [],
        "addedConnections": [],
        "removedConnections": [],
        "addedInteractions": [],
        "removedInteractions": [],
        "interactionIntensityChanged": [],
        "cameraChanged": null
      }
    },
    {
      "id": "s5",
      "start": 24,
      "end": 30,
      "narration": "An API Gateway appears in front of the Rate Limiter so all client traffic enters through one managed API entry point.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "icon": "users",
          "position": {
            "x": 74,
            "y": 7
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
          "id": "edge_api_gateway",
          "type": "api_gateway",
          "sourceEntityId": "edge_api_gateway",
          "label": "API Gateway",
          "icon": "route",
          "position": {
            "x": 26,
            "y": 23.625
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
          "id": "edge_rate_limiter",
          "type": "rate_limiter",
          "sourceEntityId": "edge_rate_limiter",
          "label": "Rate Limiter",
          "icon": "timer",
          "position": {
            "x": 74,
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
          "id": "app_server",
          "type": "server",
          "sourceEntityId": "app_server",
          "label": "Server",
          "icon": "server",
          "position": {
            "x": 26,
            "y": 56.875
          },
          "visualStyle": {
            "size": 122.4,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.5189712185731703,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 43.4112,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_db",
          "type": "database",
          "sourceEntityId": "app_db",
          "label": "Database",
          "icon": "database",
          "position": {
            "x": 74,
            "y": 73.5
          },
          "visualStyle": {
            "size": 122.4,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.5189712185731703,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 43.4112,
            "fontWeight": 600,
            "status": "normal"
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
            "x": 74,
            "y": 7
          }
        },
        {
          "id": "edge_api_gateway",
          "type": "api_gateway",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "API Gateway",
          "icon": "route",
          "layout": {
            "x": 26,
            "y": 23.625
          }
        },
        {
          "id": "edge_rate_limiter",
          "type": "rate_limiter",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Rate Limiter",
          "icon": "timer",
          "layout": {
            "x": 74,
            "y": 40.25
          }
        },
        {
          "id": "app_server",
          "type": "server",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Server",
          "icon": "server",
          "layout": {
            "x": 26,
            "y": 56.875
          }
        },
        {
          "id": "app_db",
          "type": "database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Database",
          "icon": "database",
          "layout": {
            "x": 74,
            "y": 73.5
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_gateway",
          "from": "users",
          "to": "edge_api_gateway",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_gateway_to_limiter",
          "from": "edge_api_gateway",
          "to": "edge_rate_limiter",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_limiter_to_server",
          "from": "edge_rate_limiter",
          "to": "app_server",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_server_to_db",
          "from": "app_server",
          "to": "app_db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_gateway_fwd",
          "from": "users",
          "to": "edge_api_gateway",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_gateway_to_limiter_fwd",
          "from": "edge_api_gateway",
          "to": "edge_rate_limiter",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_limiter_to_server_fwd",
          "from": "edge_rate_limiter",
          "to": "app_server",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_server_to_db_fwd",
          "from": "app_server",
          "to": "app_db",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "edge_api_gateway",
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
              "x": 74,
              "y": 7
            }
          },
          {
            "id": "edge_api_gateway",
            "type": "api_gateway",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "API Gateway",
            "icon": "route",
            "layout": {
              "x": 26,
              "y": 23.625
            }
          },
          {
            "id": "edge_rate_limiter",
            "type": "rate_limiter",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Rate Limiter",
            "icon": "timer",
            "layout": {
              "x": 74,
              "y": 40.25
            }
          },
          {
            "id": "app_server",
            "type": "server",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Server",
            "icon": "server",
            "layout": {
              "x": 26,
              "y": 56.875
            }
          },
          {
            "id": "app_db",
            "type": "database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Database",
            "icon": "database",
            "layout": {
              "x": 74,
              "y": 73.5
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_gateway",
            "from": "users",
            "to": "edge_api_gateway",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_gateway_to_limiter",
            "from": "edge_api_gateway",
            "to": "edge_rate_limiter",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_limiter_to_server",
            "from": "edge_rate_limiter",
            "to": "app_server",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_server_to_db",
            "from": "app_server",
            "to": "app_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_gateway_fwd",
            "from": "users",
            "to": "edge_api_gateway",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_gateway_to_limiter_fwd",
            "from": "edge_api_gateway",
            "to": "edge_rate_limiter",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_limiter_to_server_fwd",
            "from": "edge_rate_limiter",
            "to": "app_server",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_server_to_db_fwd",
            "from": "app_server",
            "to": "app_db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "edge_api_gateway",
          "zoom": 1
        }
      },
      "motionPersonality": "ENERGETIC",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "edge_api_gateway"
          },
          {
            "type": "entity_moved",
            "entityId": "users",
            "from": {
              "x": 50,
              "y": 7.664999999999999
            },
            "to": {
              "x": 74,
              "y": 7
            }
          },
          {
            "type": "entity_moved",
            "entityId": "edge_rate_limiter",
            "from": {
              "x": 50,
              "y": 29.38833333333334
            },
            "to": {
              "x": 74,
              "y": 40.25
            }
          },
          {
            "type": "entity_moved",
            "entityId": "app_server",
            "from": {
              "x": 50,
              "y": 51.11166666666668
            },
            "to": {
              "x": 26,
              "y": 56.875
            }
          },
          {
            "type": "entity_moved",
            "entityId": "app_db",
            "from": {
              "x": 50,
              "y": 72.83500000000001
            },
            "to": {
              "x": 74,
              "y": 73.5
            }
          },
          {
            "type": "entity_importance_changed",
            "entityId": "edge_rate_limiter",
            "from": "primary",
            "to": "secondary"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_users_to_gateway"
          },
          {
            "type": "connection_added",
            "connectionId": "c_gateway_to_limiter"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_users_to_limiter"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_users_to_gateway_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_gateway_to_limiter_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_users_to_limiter_fwd"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "edge_rate_limiter",
              "zoom": 1.08
            },
            "to": {
              "mode": "focus",
              "target": "edge_api_gateway",
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
            "entityId": "edge_rate_limiter",
            "elementIds": [
              "edge_rate_limiter"
            ],
            "action": "move"
          },
          {
            "entityId": "app_server",
            "elementIds": [
              "app_server"
            ],
            "action": "move"
          },
          {
            "entityId": "app_db",
            "elementIds": [
              "app_db"
            ],
            "action": "move"
          }
        ],
        "additions": [
          {
            "entityId": "edge_api_gateway",
            "elementIds": [
              "edge_api_gateway"
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
            "connectionId": "c_users_to_limiter",
            "cleanup": false
          },
          {
            "entityId": "edge_api_gateway",
            "elementIds": [
              "edge_api_gateway"
            ],
            "action": "connect",
            "connectionId": "c_gateway_to_limiter",
            "cleanup": false
          },
          {
            "entityId": "edge_rate_limiter",
            "elementIds": [
              "edge_rate_limiter"
            ],
            "action": "connect",
            "connectionId": "c_users_to_limiter",
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
            "interactionId": "i_c_users_to_limiter_fwd",
            "cleanup": false
          },
          {
            "entityId": "edge_api_gateway",
            "elementIds": [
              "edge_api_gateway"
            ],
            "action": "interact",
            "interactionId": "i_c_gateway_to_limiter_fwd",
            "cleanup": false
          },
          {
            "entityId": "edge_rate_limiter",
            "elementIds": [
              "edge_rate_limiter"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_limiter_fwd",
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
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "edge_rate_limiter",
            "action": "move",
            "delay": 0.6400000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "app_server",
            "action": "move",
            "delay": 0.68,
            "duration": 0.95,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "app_db",
            "action": "move",
            "delay": 0.7200000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "edge_api_gateway",
            "action": "add",
            "delay": 0.37399999999999994,
            "duration": 0.62,
            "easing": "cubic-bezier(0.4,0,0.2,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_users_to_gateway",
            "delay": 0.504,
            "duration": 0.42,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_gateway_to_limiter",
            "delay": 0.544,
            "duration": 0.42,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_users_to_limiter",
            "delay": 0.584,
            "duration": 0.42,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "edge_api_gateway",
            "type": "api_gateway",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "API Gateway",
            "icon": "route",
            "layout": {
              "x": 26,
              "y": 23.625
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "users",
            "from": {
              "x": 50,
              "y": 7.664999999999999
            },
            "to": {
              "x": 74,
              "y": 7
            }
          },
          {
            "id": "edge_rate_limiter",
            "from": {
              "x": 50,
              "y": 29.38833333333334
            },
            "to": {
              "x": 74,
              "y": 40.25
            }
          },
          {
            "id": "app_server",
            "from": {
              "x": 50,
              "y": 51.11166666666668
            },
            "to": {
              "x": 26,
              "y": 56.875
            }
          },
          {
            "id": "app_db",
            "from": {
              "x": 50,
              "y": 72.83500000000001
            },
            "to": {
              "x": 74,
              "y": 73.5
            }
          }
        ],
        "updatedEntities": [
          {
            "id": "edge_rate_limiter",
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
            "id": "c_users_to_gateway",
            "from": "users",
            "to": "edge_api_gateway",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_gateway_to_limiter",
            "from": "edge_api_gateway",
            "to": "edge_rate_limiter",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [
          {
            "id": "c_users_to_limiter",
            "from": "users",
            "to": "edge_rate_limiter",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "addedInteractions": [
          {
            "id": "i_c_users_to_gateway_fwd",
            "from": "users",
            "to": "edge_api_gateway",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_gateway_to_limiter_fwd",
            "from": "edge_api_gateway",
            "to": "edge_rate_limiter",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_users_to_limiter_fwd",
            "from": "users",
            "to": "edge_rate_limiter",
            "type": "burst",
            "intensity": "high"
          }
        ],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "edge_rate_limiter",
            "zoom": 1.08
          },
          "to": {
            "mode": "focus",
            "target": "edge_api_gateway",
            "zoom": 1
          }
        }
      }
    },
    {
      "id": "s6",
      "start": 30,
      "end": 36,
      "narration": "Even with the Rate Limiter, allowed traffic still spikes, so the Server shows overload again as it tries to keep up.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "icon": "users",
          "position": {
            "x": 74,
            "y": 7
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
          "id": "edge_api_gateway",
          "type": "api_gateway",
          "sourceEntityId": "edge_api_gateway",
          "label": "API Gateway",
          "icon": "route",
          "position": {
            "x": 26,
            "y": 23.625
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
          "id": "edge_rate_limiter",
          "type": "rate_limiter",
          "sourceEntityId": "edge_rate_limiter",
          "label": "Rate Limiter",
          "icon": "timer",
          "position": {
            "x": 74,
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
          "id": "app_server",
          "type": "server",
          "sourceEntityId": "app_server",
          "label": "Server",
          "icon": "server",
          "position": {
            "x": 26,
            "y": 56.875
          },
          "visualStyle": {
            "size": 122.4,
            "opacity": 1,
            "color": "#EF4444",
            "strokeWidth": 2.5189712185731703,
            "strokeColor": "#EF4444",
            "glow": false,
            "glowColor": "#EF4444",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 43.4112,
            "fontWeight": 600,
            "status": "overloaded"
          }
        },
        {
          "id": "app_db",
          "type": "database",
          "sourceEntityId": "app_db",
          "label": "Database",
          "icon": "database",
          "position": {
            "x": 74,
            "y": 73.5
          },
          "visualStyle": {
            "size": 122.4,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.5189712185731703,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 43.4112,
            "fontWeight": 600,
            "status": "normal"
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
            "x": 74,
            "y": 7
          }
        },
        {
          "id": "edge_api_gateway",
          "type": "api_gateway",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "API Gateway",
          "icon": "route",
          "layout": {
            "x": 26,
            "y": 23.625
          }
        },
        {
          "id": "edge_rate_limiter",
          "type": "rate_limiter",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Rate Limiter",
          "icon": "timer",
          "layout": {
            "x": 74,
            "y": 40.25
          }
        },
        {
          "id": "app_server",
          "type": "server",
          "count": 1,
          "importance": "primary",
          "status": "overloaded",
          "label": "Server",
          "icon": "server",
          "layout": {
            "x": 26,
            "y": 56.875
          }
        },
        {
          "id": "app_db",
          "type": "database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Database",
          "icon": "database",
          "layout": {
            "x": 74,
            "y": 73.5
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_gateway",
          "from": "users",
          "to": "edge_api_gateway",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_gateway_to_limiter",
          "from": "edge_api_gateway",
          "to": "edge_rate_limiter",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_limiter_to_server",
          "from": "edge_rate_limiter",
          "to": "app_server",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_server_to_db",
          "from": "app_server",
          "to": "app_db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_gateway_fwd",
          "from": "users",
          "to": "edge_api_gateway",
          "type": "burst",
          "intensity": "high"
        },
        {
          "id": "i_c_gateway_to_limiter_fwd",
          "from": "edge_api_gateway",
          "to": "edge_rate_limiter",
          "type": "flow",
          "intensity": "high"
        },
        {
          "id": "i_c_limiter_to_server_fwd",
          "from": "edge_rate_limiter",
          "to": "app_server",
          "type": "burst",
          "intensity": "high"
        },
        {
          "id": "i_c_server_to_db_fwd",
          "from": "app_server",
          "to": "app_db",
          "type": "flow",
          "intensity": "high"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "app_server",
        "zoom": 1.04
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
              "x": 74,
              "y": 7
            }
          },
          {
            "id": "edge_api_gateway",
            "type": "api_gateway",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "API Gateway",
            "icon": "route",
            "layout": {
              "x": 26,
              "y": 23.625
            }
          },
          {
            "id": "edge_rate_limiter",
            "type": "rate_limiter",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Rate Limiter",
            "icon": "timer",
            "layout": {
              "x": 74,
              "y": 40.25
            }
          },
          {
            "id": "app_server",
            "type": "server",
            "count": 1,
            "importance": "primary",
            "status": "overloaded",
            "label": "Server",
            "icon": "server",
            "layout": {
              "x": 26,
              "y": 56.875
            }
          },
          {
            "id": "app_db",
            "type": "database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Database",
            "icon": "database",
            "layout": {
              "x": 74,
              "y": 73.5
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_gateway",
            "from": "users",
            "to": "edge_api_gateway",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_gateway_to_limiter",
            "from": "edge_api_gateway",
            "to": "edge_rate_limiter",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_limiter_to_server",
            "from": "edge_rate_limiter",
            "to": "app_server",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_server_to_db",
            "from": "app_server",
            "to": "app_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_gateway_fwd",
            "from": "users",
            "to": "edge_api_gateway",
            "type": "burst",
            "intensity": "high"
          },
          {
            "id": "i_c_gateway_to_limiter_fwd",
            "from": "edge_api_gateway",
            "to": "edge_rate_limiter",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_limiter_to_server_fwd",
            "from": "edge_rate_limiter",
            "to": "app_server",
            "type": "burst",
            "intensity": "high"
          },
          {
            "id": "i_c_server_to_db_fwd",
            "from": "app_server",
            "to": "app_db",
            "type": "flow",
            "intensity": "high"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "app_server",
          "zoom": 1.04
        }
      },
      "motionPersonality": "ENERGETIC",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_importance_changed",
            "entityId": "edge_api_gateway",
            "from": "primary",
            "to": "secondary"
          },
          {
            "type": "entity_status_changed",
            "entityId": "app_server",
            "from": "normal",
            "to": "overloaded"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "app_server",
            "from": "secondary",
            "to": "primary"
          }
        ],
        "connectionDiffs": [],
        "interactionDiffs": [
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_users_to_gateway_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_gateway_to_limiter_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_limiter_to_server_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_server_to_db_fwd",
            "from": "medium",
            "to": "high"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "edge_api_gateway",
              "zoom": 1
            },
            "to": {
              "mode": "focus",
              "target": "app_server",
              "zoom": 1.04
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
            "entityId": "app_server",
            "elementIds": [
              "app_server"
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
            "interactionId": "i_c_users_to_gateway_fwd"
          },
          {
            "entityId": "edge_api_gateway",
            "elementIds": [
              "edge_api_gateway"
            ],
            "action": "interact",
            "interactionId": "i_c_gateway_to_limiter_fwd",
            "cleanup": false
          },
          {
            "entityId": "edge_rate_limiter",
            "elementIds": [
              "edge_rate_limiter"
            ],
            "action": "interact",
            "interactionId": "i_c_limiter_to_server_fwd",
            "cleanup": false
          },
          {
            "entityId": "app_server",
            "elementIds": [
              "app_server"
            ],
            "action": "interact",
            "interactionId": "i_c_server_to_db_fwd",
            "cleanup": false
          },
          {
            "entityId": "app_db",
            "elementIds": [
              "app_db"
            ],
            "action": "interact",
            "interactionId": "i_c_server_to_db_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "app_server",
            "action": "add",
            "delay": 0.37399999999999994,
            "duration": 0.62,
            "easing": "cubic-bezier(0.4,0,0.2,1)",
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
            "id": "edge_api_gateway",
            "changes": {
              "importance": {
                "from": "primary",
                "to": "secondary"
              }
            }
          },
          {
            "id": "app_server",
            "changes": {
              "status": {
                "from": "normal",
                "to": "overloaded"
              },
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
            "id": "i_c_users_to_gateway_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "id": "i_c_gateway_to_limiter_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "id": "i_c_limiter_to_server_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "id": "i_c_server_to_db_fwd",
            "from": "medium",
            "to": "high"
          }
        ],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "edge_api_gateway",
            "zoom": 1
          },
          "to": {
            "mode": "focus",
            "target": "app_server",
            "zoom": 1.04
          }
        }
      }
    },
    {
      "id": "s7",
      "start": 36,
      "end": 42,
      "narration": "A Load Balancer is added after the Rate Limiter and the Server scales out so requests fan out across multiple servers before hitting the Database.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "icon": "users",
          "position": {
            "x": 74,
            "y": 7
          },
          "visualStyle": {
            "size": 95.4,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.223856110453192,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 33.8352,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "edge_api_gateway",
          "type": "api_gateway",
          "sourceEntityId": "edge_api_gateway",
          "label": "API Gateway",
          "icon": "route",
          "position": {
            "x": 26,
            "y": 23.3
          },
          "visualStyle": {
            "size": 95.4,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.223856110453192,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 33.8352,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "edge_rate_limiter",
          "type": "rate_limiter",
          "sourceEntityId": "edge_rate_limiter",
          "label": "Rate Limiter",
          "icon": "timer",
          "position": {
            "x": 74,
            "y": 39.6
          },
          "visualStyle": {
            "size": 95.4,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.223856110453192,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 33.8352,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "edge_load_balancer",
          "type": "load_balancer",
          "sourceEntityId": "edge_load_balancer",
          "label": "Load Balancer",
          "icon": "shuffle",
          "position": {
            "x": 26,
            "y": 55.900000000000006
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 95.4,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.223856110453192,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 33.8352,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "app_server_1",
          "type": "server",
          "sourceEntityId": "app_server",
          "icon": "server",
          "position": {
            "x": 25.80648148148148,
            "y": 72.2
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 95.4,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.223856110453192,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 33.8352,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_server",
          "type": "server",
          "sourceEntityId": "app_server",
          "label": "Server",
          "icon": "server",
          "position": {
            "x": 50,
            "y": 72.2
          },
          "visualStyle": {
            "size": 95.4,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.223856110453192,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 33.8352,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_server_3",
          "type": "server",
          "sourceEntityId": "app_server",
          "icon": "server",
          "position": {
            "x": 74.19351851851852,
            "y": 72.2
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 95.4,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.223856110453192,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 33.8352,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_db",
          "type": "database",
          "sourceEntityId": "app_db",
          "label": "Database",
          "icon": "database",
          "position": {
            "x": 74,
            "y": 88.5
          },
          "visualStyle": {
            "size": 95.4,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.223856110453192,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 33.8352,
            "fontWeight": 600,
            "status": "normal"
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
            "x": 74,
            "y": 7
          }
        },
        {
          "id": "edge_api_gateway",
          "type": "api_gateway",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "API Gateway",
          "icon": "route",
          "layout": {
            "x": 26,
            "y": 23.3
          }
        },
        {
          "id": "edge_rate_limiter",
          "type": "rate_limiter",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Rate Limiter",
          "icon": "timer",
          "layout": {
            "x": 74,
            "y": 39.6
          }
        },
        {
          "id": "edge_load_balancer",
          "type": "load_balancer",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Load Balancer",
          "icon": "shuffle",
          "layout": {
            "x": 26,
            "y": 55.900000000000006
          }
        },
        {
          "id": "app_server",
          "type": "server",
          "count": 3,
          "importance": "secondary",
          "status": "normal",
          "label": "Server",
          "icon": "server",
          "layout": {
            "x": 50,
            "y": 72.2
          }
        },
        {
          "id": "app_db",
          "type": "database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Database",
          "icon": "database",
          "layout": {
            "x": 74,
            "y": 88.5
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_gateway",
          "from": "users",
          "to": "edge_api_gateway",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_gateway_to_limiter",
          "from": "edge_api_gateway",
          "to": "edge_rate_limiter",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_limiter_to_lb",
          "from": "edge_rate_limiter",
          "to": "edge_load_balancer",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_lb_to_server",
          "from": "edge_load_balancer",
          "to": "app_server",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_server_to_db",
          "from": "app_server",
          "to": "app_db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_gateway_fwd",
          "from": "users",
          "to": "edge_api_gateway",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_gateway_to_limiter_fwd",
          "from": "edge_api_gateway",
          "to": "edge_rate_limiter",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_limiter_to_lb_fwd",
          "from": "edge_rate_limiter",
          "to": "edge_load_balancer",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_lb_to_server_fwd",
          "from": "edge_load_balancer",
          "to": "app_server",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_server_to_db_fwd",
          "from": "app_server",
          "to": "app_db",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "edge_load_balancer",
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
              "x": 74,
              "y": 7
            }
          },
          {
            "id": "edge_api_gateway",
            "type": "api_gateway",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "API Gateway",
            "icon": "route",
            "layout": {
              "x": 26,
              "y": 23.3
            }
          },
          {
            "id": "edge_rate_limiter",
            "type": "rate_limiter",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Rate Limiter",
            "icon": "timer",
            "layout": {
              "x": 74,
              "y": 39.6
            }
          },
          {
            "id": "edge_load_balancer",
            "type": "load_balancer",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Load Balancer",
            "icon": "shuffle",
            "layout": {
              "x": 26,
              "y": 55.900000000000006
            }
          },
          {
            "id": "app_server",
            "type": "server",
            "count": 3,
            "importance": "secondary",
            "status": "normal",
            "label": "Server",
            "icon": "server",
            "layout": {
              "x": 50,
              "y": 72.2
            }
          },
          {
            "id": "app_db",
            "type": "database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Database",
            "icon": "database",
            "layout": {
              "x": 74,
              "y": 88.5
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_gateway",
            "from": "users",
            "to": "edge_api_gateway",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_gateway_to_limiter",
            "from": "edge_api_gateway",
            "to": "edge_rate_limiter",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_limiter_to_lb",
            "from": "edge_rate_limiter",
            "to": "edge_load_balancer",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_lb_to_server",
            "from": "edge_load_balancer",
            "to": "app_server",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_server_to_db",
            "from": "app_server",
            "to": "app_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_gateway_fwd",
            "from": "users",
            "to": "edge_api_gateway",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_gateway_to_limiter_fwd",
            "from": "edge_api_gateway",
            "to": "edge_rate_limiter",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_limiter_to_lb_fwd",
            "from": "edge_rate_limiter",
            "to": "edge_load_balancer",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_lb_to_server_fwd",
            "from": "edge_load_balancer",
            "to": "app_server",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_server_to_db_fwd",
            "from": "app_server",
            "to": "app_db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "edge_load_balancer",
          "zoom": 1
        }
      },
      "motionPersonality": "ENERGETIC",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "edge_load_balancer"
          },
          {
            "type": "entity_moved",
            "entityId": "edge_api_gateway",
            "from": {
              "x": 26,
              "y": 23.625
            },
            "to": {
              "x": 26,
              "y": 23.3
            }
          },
          {
            "type": "entity_moved",
            "entityId": "edge_rate_limiter",
            "from": {
              "x": 74,
              "y": 40.25
            },
            "to": {
              "x": 74,
              "y": 39.6
            }
          },
          {
            "type": "entity_moved",
            "entityId": "app_server",
            "from": {
              "x": 26,
              "y": 56.875
            },
            "to": {
              "x": 50,
              "y": 72.2
            }
          },
          {
            "type": "entity_moved",
            "entityId": "app_db",
            "from": {
              "x": 74,
              "y": 73.5
            },
            "to": {
              "x": 74,
              "y": 88.5
            }
          },
          {
            "type": "entity_count_changed",
            "entityId": "app_server",
            "from": 1,
            "to": 3
          },
          {
            "type": "entity_status_changed",
            "entityId": "app_server",
            "from": "overloaded",
            "to": "normal"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "app_server",
            "from": "primary",
            "to": "secondary"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_limiter_to_lb"
          },
          {
            "type": "connection_added",
            "connectionId": "c_lb_to_server"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_limiter_to_server"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_limiter_to_lb_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_lb_to_server_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_limiter_to_server_fwd"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_users_to_gateway_fwd",
            "from": "high",
            "to": "medium"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_gateway_to_limiter_fwd",
            "from": "high",
            "to": "medium"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_server_to_db_fwd",
            "from": "high",
            "to": "medium"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "app_server",
              "zoom": 1.04
            },
            "to": {
              "mode": "focus",
              "target": "edge_load_balancer",
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
            "entityId": "edge_api_gateway",
            "elementIds": [
              "edge_api_gateway"
            ],
            "action": "move"
          },
          {
            "entityId": "edge_rate_limiter",
            "elementIds": [
              "edge_rate_limiter"
            ],
            "action": "move"
          },
          {
            "entityId": "app_server",
            "elementIds": [
              "app_server_1",
              "app_server",
              "app_server_3"
            ],
            "action": "move"
          },
          {
            "entityId": "app_db",
            "elementIds": [
              "app_db"
            ],
            "action": "move"
          }
        ],
        "additions": [
          {
            "entityId": "edge_load_balancer",
            "elementIds": [
              "edge_load_balancer"
            ],
            "action": "add",
            "enter": "zoom_in",
            "cleanup": false
          },
          {
            "entityId": "app_server",
            "elementIds": [
              "app_server_1",
              "app_server",
              "app_server_3"
            ],
            "action": "add",
            "enter": "zoom_in"
          }
        ],
        "connections": [
          {
            "entityId": "edge_rate_limiter",
            "elementIds": [
              "edge_rate_limiter"
            ],
            "action": "connect",
            "connectionId": "c_limiter_to_server",
            "cleanup": false
          },
          {
            "entityId": "edge_load_balancer",
            "elementIds": [
              "edge_load_balancer"
            ],
            "action": "connect",
            "connectionId": "c_lb_to_server",
            "cleanup": false
          },
          {
            "entityId": "app_server",
            "elementIds": [
              "app_server_1",
              "app_server",
              "app_server_3"
            ],
            "action": "connect",
            "connectionId": "c_limiter_to_server",
            "cleanup": false
          }
        ],
        "interactions": [
          {
            "entityId": "edge_rate_limiter",
            "elementIds": [
              "edge_rate_limiter"
            ],
            "action": "interact",
            "interactionId": "i_c_gateway_to_limiter_fwd",
            "cleanup": false
          },
          {
            "entityId": "edge_load_balancer",
            "elementIds": [
              "edge_load_balancer"
            ],
            "action": "interact",
            "interactionId": "i_c_lb_to_server_fwd",
            "cleanup": false
          },
          {
            "entityId": "app_server",
            "elementIds": [
              "app_server_1",
              "app_server",
              "app_server_3"
            ],
            "action": "interact",
            "interactionId": "i_c_server_to_db_fwd",
            "cleanup": false
          },
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "interact",
            "interactionId": "i_c_users_to_gateway_fwd"
          },
          {
            "entityId": "edge_api_gateway",
            "elementIds": [
              "edge_api_gateway"
            ],
            "action": "interact",
            "interactionId": "i_c_gateway_to_limiter_fwd",
            "cleanup": false
          },
          {
            "entityId": "app_db",
            "elementIds": [
              "app_db"
            ],
            "action": "interact",
            "interactionId": "i_c_server_to_db_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "edge_api_gateway",
            "action": "move",
            "delay": 0.6000000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "edge_rate_limiter",
            "action": "move",
            "delay": 0.6400000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "app_server",
            "action": "move",
            "delay": 0.68,
            "duration": 0.95,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "app_db",
            "action": "move",
            "delay": 0.7200000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "edge_load_balancer",
            "action": "add",
            "delay": 0.37399999999999994,
            "duration": 0.62,
            "easing": "cubic-bezier(0.4,0,0.2,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_limiter_to_lb",
            "delay": 0.504,
            "duration": 0.42,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_lb_to_server",
            "delay": 0.544,
            "duration": 0.42,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "connectionId": "c_limiter_to_server",
            "delay": 0.584,
            "duration": 0.42,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "edge_load_balancer",
            "type": "load_balancer",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Load Balancer",
            "icon": "shuffle",
            "layout": {
              "x": 26,
              "y": 55.900000000000006
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "edge_api_gateway",
            "from": {
              "x": 26,
              "y": 23.625
            },
            "to": {
              "x": 26,
              "y": 23.3
            }
          },
          {
            "id": "edge_rate_limiter",
            "from": {
              "x": 74,
              "y": 40.25
            },
            "to": {
              "x": 74,
              "y": 39.6
            }
          },
          {
            "id": "app_server",
            "from": {
              "x": 26,
              "y": 56.875
            },
            "to": {
              "x": 50,
              "y": 72.2
            }
          },
          {
            "id": "app_db",
            "from": {
              "x": 74,
              "y": 73.5
            },
            "to": {
              "x": 74,
              "y": 88.5
            }
          }
        ],
        "updatedEntities": [
          {
            "id": "app_server",
            "changes": {
              "status": {
                "from": "overloaded",
                "to": "normal"
              },
              "count": {
                "from": 1,
                "to": 3
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
            "id": "c_limiter_to_lb",
            "from": "edge_rate_limiter",
            "to": "edge_load_balancer",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_lb_to_server",
            "from": "edge_load_balancer",
            "to": "app_server",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [
          {
            "id": "c_limiter_to_server",
            "from": "edge_rate_limiter",
            "to": "app_server",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "addedInteractions": [
          {
            "id": "i_c_limiter_to_lb_fwd",
            "from": "edge_rate_limiter",
            "to": "edge_load_balancer",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_lb_to_server_fwd",
            "from": "edge_load_balancer",
            "to": "app_server",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_limiter_to_server_fwd",
            "from": "edge_rate_limiter",
            "to": "app_server",
            "type": "burst",
            "intensity": "high"
          }
        ],
        "interactionIntensityChanged": [
          {
            "id": "i_c_users_to_gateway_fwd",
            "from": "high",
            "to": "medium"
          },
          {
            "id": "i_c_gateway_to_limiter_fwd",
            "from": "high",
            "to": "medium"
          },
          {
            "id": "i_c_server_to_db_fwd",
            "from": "high",
            "to": "medium"
          }
        ],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "app_server",
            "zoom": 1.04
          },
          "to": {
            "mode": "focus",
            "target": "edge_load_balancer",
            "zoom": 1
          }
        }
      }
    },
    {
      "id": "s8",
      "start": 42,
      "end": 48,
      "narration": "A Cache is added next to the Rate Limiter so the Rate Limiter can store counters and enforce the same limit consistently for all incoming requests.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "icon": "users",
          "position": {
            "x": 74,
            "y": 7
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "edge_api_gateway",
          "type": "api_gateway",
          "sourceEntityId": "edge_api_gateway",
          "label": "API Gateway",
          "icon": "route",
          "position": {
            "x": 26,
            "y": 20.583333333333336
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "edge_rate_limiter",
          "type": "rate_limiter",
          "sourceEntityId": "edge_rate_limiter",
          "label": "Rate Limiter",
          "icon": "timer",
          "position": {
            "x": 74,
            "y": 34.16666666666667
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "limiter_cache",
          "type": "cache",
          "sourceEntityId": "limiter_cache",
          "label": "Cache",
          "icon": "memory-stick",
          "position": {
            "x": 26,
            "y": 47.75
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "edge_load_balancer",
          "type": "load_balancer",
          "sourceEntityId": "edge_load_balancer",
          "label": "Load Balancer",
          "icon": "shuffle",
          "position": {
            "x": 74,
            "y": 61.333333333333336
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "app_server_1",
          "type": "server",
          "sourceEntityId": "app_server",
          "icon": "server",
          "position": {
            "x": 26.71944444444444,
            "y": 74.91666666666667
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_server",
          "type": "server",
          "sourceEntityId": "app_server",
          "label": "Server",
          "icon": "server",
          "position": {
            "x": 50,
            "y": 74.91666666666667
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_server_3",
          "type": "server",
          "sourceEntityId": "app_server",
          "icon": "server",
          "position": {
            "x": 73.28055555555557,
            "y": 74.91666666666667
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_db",
          "type": "database",
          "sourceEntityId": "app_db",
          "label": "Database",
          "icon": "database",
          "position": {
            "x": 26,
            "y": 88.5
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "normal"
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
            "x": 74,
            "y": 7
          }
        },
        {
          "id": "edge_api_gateway",
          "type": "api_gateway",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "API Gateway",
          "icon": "route",
          "layout": {
            "x": 26,
            "y": 20.583333333333336
          }
        },
        {
          "id": "edge_rate_limiter",
          "type": "rate_limiter",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Rate Limiter",
          "icon": "timer",
          "layout": {
            "x": 74,
            "y": 34.16666666666667
          }
        },
        {
          "id": "limiter_cache",
          "type": "cache",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Cache",
          "icon": "memory-stick",
          "layout": {
            "x": 26,
            "y": 47.75
          }
        },
        {
          "id": "edge_load_balancer",
          "type": "load_balancer",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Load Balancer",
          "icon": "shuffle",
          "layout": {
            "x": 74,
            "y": 61.333333333333336
          }
        },
        {
          "id": "app_server",
          "type": "server",
          "count": 3,
          "importance": "secondary",
          "status": "normal",
          "label": "Server",
          "icon": "server",
          "layout": {
            "x": 50,
            "y": 74.91666666666667
          }
        },
        {
          "id": "app_db",
          "type": "database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Database",
          "icon": "database",
          "layout": {
            "x": 26,
            "y": 88.5
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_gateway",
          "from": "users",
          "to": "edge_api_gateway",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_gateway_to_limiter",
          "from": "edge_api_gateway",
          "to": "edge_rate_limiter",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_limiter_to_cache",
          "from": "edge_rate_limiter",
          "to": "limiter_cache",
          "direction": "bidirectional",
          "style": "solid"
        },
        {
          "id": "c_limiter_to_lb",
          "from": "edge_rate_limiter",
          "to": "edge_load_balancer",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_lb_to_server",
          "from": "edge_load_balancer",
          "to": "app_server",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_server_to_db",
          "from": "app_server",
          "to": "app_db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_gateway_fwd",
          "from": "users",
          "to": "edge_api_gateway",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_gateway_to_limiter_fwd",
          "from": "edge_api_gateway",
          "to": "edge_rate_limiter",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_limiter_to_cache_fwd",
          "from": "edge_rate_limiter",
          "to": "limiter_cache",
          "type": "ping",
          "intensity": "medium"
        },
        {
          "id": "i_c_limiter_to_cache_rev",
          "from": "limiter_cache",
          "to": "edge_rate_limiter",
          "type": "ping",
          "intensity": "medium"
        },
        {
          "id": "i_c_limiter_to_lb_fwd",
          "from": "edge_rate_limiter",
          "to": "edge_load_balancer",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_lb_to_server_fwd",
          "from": "edge_load_balancer",
          "to": "app_server",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_server_to_db_fwd",
          "from": "app_server",
          "to": "app_db",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "limiter_cache",
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
              "x": 74,
              "y": 7
            }
          },
          {
            "id": "edge_api_gateway",
            "type": "api_gateway",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "API Gateway",
            "icon": "route",
            "layout": {
              "x": 26,
              "y": 20.583333333333336
            }
          },
          {
            "id": "edge_rate_limiter",
            "type": "rate_limiter",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Rate Limiter",
            "icon": "timer",
            "layout": {
              "x": 74,
              "y": 34.16666666666667
            }
          },
          {
            "id": "limiter_cache",
            "type": "cache",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Cache",
            "icon": "memory-stick",
            "layout": {
              "x": 26,
              "y": 47.75
            }
          },
          {
            "id": "edge_load_balancer",
            "type": "load_balancer",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Load Balancer",
            "icon": "shuffle",
            "layout": {
              "x": 74,
              "y": 61.333333333333336
            }
          },
          {
            "id": "app_server",
            "type": "server",
            "count": 3,
            "importance": "secondary",
            "status": "normal",
            "label": "Server",
            "icon": "server",
            "layout": {
              "x": 50,
              "y": 74.91666666666667
            }
          },
          {
            "id": "app_db",
            "type": "database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Database",
            "icon": "database",
            "layout": {
              "x": 26,
              "y": 88.5
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_gateway",
            "from": "users",
            "to": "edge_api_gateway",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_gateway_to_limiter",
            "from": "edge_api_gateway",
            "to": "edge_rate_limiter",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_limiter_to_cache",
            "from": "edge_rate_limiter",
            "to": "limiter_cache",
            "direction": "bidirectional",
            "style": "solid"
          },
          {
            "id": "c_limiter_to_lb",
            "from": "edge_rate_limiter",
            "to": "edge_load_balancer",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_lb_to_server",
            "from": "edge_load_balancer",
            "to": "app_server",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_server_to_db",
            "from": "app_server",
            "to": "app_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_gateway_fwd",
            "from": "users",
            "to": "edge_api_gateway",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_gateway_to_limiter_fwd",
            "from": "edge_api_gateway",
            "to": "edge_rate_limiter",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_limiter_to_cache_fwd",
            "from": "edge_rate_limiter",
            "to": "limiter_cache",
            "type": "ping",
            "intensity": "medium"
          },
          {
            "id": "i_c_limiter_to_cache_rev",
            "from": "limiter_cache",
            "to": "edge_rate_limiter",
            "type": "ping",
            "intensity": "medium"
          },
          {
            "id": "i_c_limiter_to_lb_fwd",
            "from": "edge_rate_limiter",
            "to": "edge_load_balancer",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_lb_to_server_fwd",
            "from": "edge_load_balancer",
            "to": "app_server",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_server_to_db_fwd",
            "from": "app_server",
            "to": "app_db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "limiter_cache",
          "zoom": 1
        }
      },
      "motionPersonality": "ENERGETIC",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "limiter_cache"
          },
          {
            "type": "entity_moved",
            "entityId": "edge_api_gateway",
            "from": {
              "x": 26,
              "y": 23.3
            },
            "to": {
              "x": 26,
              "y": 20.583333333333336
            }
          },
          {
            "type": "entity_moved",
            "entityId": "edge_rate_limiter",
            "from": {
              "x": 74,
              "y": 39.6
            },
            "to": {
              "x": 74,
              "y": 34.16666666666667
            }
          },
          {
            "type": "entity_moved",
            "entityId": "edge_load_balancer",
            "from": {
              "x": 26,
              "y": 55.900000000000006
            },
            "to": {
              "x": 74,
              "y": 61.333333333333336
            }
          },
          {
            "type": "entity_moved",
            "entityId": "app_server",
            "from": {
              "x": 50,
              "y": 72.2
            },
            "to": {
              "x": 50,
              "y": 74.91666666666667
            }
          },
          {
            "type": "entity_moved",
            "entityId": "app_db",
            "from": {
              "x": 74,
              "y": 88.5
            },
            "to": {
              "x": 26,
              "y": 88.5
            }
          },
          {
            "type": "entity_importance_changed",
            "entityId": "edge_load_balancer",
            "from": "primary",
            "to": "secondary"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_limiter_to_cache"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_limiter_to_cache_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_limiter_to_cache_rev"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "edge_load_balancer",
              "zoom": 1
            },
            "to": {
              "mode": "focus",
              "target": "limiter_cache",
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
            "entityId": "edge_api_gateway",
            "elementIds": [
              "edge_api_gateway"
            ],
            "action": "move"
          },
          {
            "entityId": "edge_rate_limiter",
            "elementIds": [
              "edge_rate_limiter"
            ],
            "action": "move"
          },
          {
            "entityId": "edge_load_balancer",
            "elementIds": [
              "edge_load_balancer"
            ],
            "action": "move"
          },
          {
            "entityId": "app_server",
            "elementIds": [
              "app_server_1",
              "app_server",
              "app_server_3"
            ],
            "action": "move"
          },
          {
            "entityId": "app_db",
            "elementIds": [
              "app_db"
            ],
            "action": "move"
          }
        ],
        "additions": [
          {
            "entityId": "limiter_cache",
            "elementIds": [
              "limiter_cache"
            ],
            "action": "add",
            "enter": "zoom_in",
            "cleanup": false
          }
        ],
        "connections": [
          {
            "entityId": "edge_rate_limiter",
            "elementIds": [
              "edge_rate_limiter"
            ],
            "action": "connect",
            "connectionId": "c_limiter_to_cache"
          },
          {
            "entityId": "limiter_cache",
            "elementIds": [
              "limiter_cache"
            ],
            "action": "connect",
            "connectionId": "c_limiter_to_cache"
          }
        ],
        "interactions": [
          {
            "entityId": "edge_rate_limiter",
            "elementIds": [
              "edge_rate_limiter"
            ],
            "action": "interact",
            "interactionId": "i_c_limiter_to_cache_rev",
            "cleanup": false
          },
          {
            "entityId": "limiter_cache",
            "elementIds": [
              "limiter_cache"
            ],
            "action": "interact",
            "interactionId": "i_c_limiter_to_cache_rev",
            "cleanup": false
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "edge_api_gateway",
            "action": "move",
            "delay": 0.6000000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "edge_rate_limiter",
            "action": "move",
            "delay": 0.6400000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "edge_load_balancer",
            "action": "move",
            "delay": 0.68,
            "duration": 0.95,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "app_server",
            "action": "move",
            "delay": 0.7200000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "app_db",
            "action": "move",
            "delay": 0.7600000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          },
          {
            "entityId": "limiter_cache",
            "action": "add",
            "delay": 0.37399999999999994,
            "duration": 0.62,
            "easing": "cubic-bezier(0.4,0,0.2,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_limiter_to_cache",
            "delay": 0.504,
            "duration": 0.42,
            "easing": "cubic-bezier(0.4,0,0.2,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "limiter_cache",
            "type": "cache",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Cache",
            "icon": "memory-stick",
            "layout": {
              "x": 26,
              "y": 47.75
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "edge_api_gateway",
            "from": {
              "x": 26,
              "y": 23.3
            },
            "to": {
              "x": 26,
              "y": 20.583333333333336
            }
          },
          {
            "id": "edge_rate_limiter",
            "from": {
              "x": 74,
              "y": 39.6
            },
            "to": {
              "x": 74,
              "y": 34.16666666666667
            }
          },
          {
            "id": "edge_load_balancer",
            "from": {
              "x": 26,
              "y": 55.900000000000006
            },
            "to": {
              "x": 74,
              "y": 61.333333333333336
            }
          },
          {
            "id": "app_server",
            "from": {
              "x": 50,
              "y": 72.2
            },
            "to": {
              "x": 50,
              "y": 74.91666666666667
            }
          },
          {
            "id": "app_db",
            "from": {
              "x": 74,
              "y": 88.5
            },
            "to": {
              "x": 26,
              "y": 88.5
            }
          }
        ],
        "updatedEntities": [
          {
            "id": "edge_load_balancer",
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
            "id": "c_limiter_to_cache",
            "from": "edge_rate_limiter",
            "to": "limiter_cache",
            "direction": "bidirectional",
            "style": "solid"
          }
        ],
        "removedConnections": [],
        "addedInteractions": [
          {
            "id": "i_c_limiter_to_cache_fwd",
            "from": "edge_rate_limiter",
            "to": "limiter_cache",
            "type": "ping",
            "intensity": "medium"
          },
          {
            "id": "i_c_limiter_to_cache_rev",
            "from": "limiter_cache",
            "to": "edge_rate_limiter",
            "type": "ping",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "edge_load_balancer",
            "zoom": 1
          },
          "to": {
            "mode": "focus",
            "target": "limiter_cache",
            "zoom": 1
          }
        }
      }
    },
    {
      "id": "s9",
      "start": 48,
      "end": 54,
      "narration": "During a burst, the API Gateway feeds the Rate Limiter, allowed requests flow to the Load Balancer, and traffic stays smooth across the scaled Servers and the Database.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "icon": "users",
          "position": {
            "x": 74,
            "y": 7
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "edge_api_gateway",
          "type": "api_gateway",
          "sourceEntityId": "edge_api_gateway",
          "label": "API Gateway",
          "icon": "route",
          "position": {
            "x": 26,
            "y": 20.583333333333336
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "edge_rate_limiter",
          "type": "rate_limiter",
          "sourceEntityId": "edge_rate_limiter",
          "label": "Rate Limiter",
          "icon": "timer",
          "position": {
            "x": 74,
            "y": 34.16666666666667
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "limiter_cache",
          "type": "cache",
          "sourceEntityId": "limiter_cache",
          "label": "Cache",
          "icon": "memory-stick",
          "position": {
            "x": 26,
            "y": 47.75
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "edge_load_balancer",
          "type": "load_balancer",
          "sourceEntityId": "edge_load_balancer",
          "label": "Load Balancer",
          "icon": "shuffle",
          "position": {
            "x": 74,
            "y": 61.333333333333336
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "app_server_1",
          "type": "server",
          "sourceEntityId": "app_server",
          "icon": "server",
          "position": {
            "x": 26.71944444444444,
            "y": 74.91666666666667
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_server",
          "type": "server",
          "sourceEntityId": "app_server",
          "label": "Server",
          "icon": "server",
          "position": {
            "x": 50,
            "y": 74.91666666666667
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_server_3",
          "type": "server",
          "sourceEntityId": "app_server",
          "icon": "server",
          "position": {
            "x": 73.28055555555557,
            "y": 74.91666666666667
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_db",
          "type": "database",
          "sourceEntityId": "app_db",
          "label": "Database",
          "icon": "database",
          "position": {
            "x": 26,
            "y": 88.5
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "normal"
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
            "x": 74,
            "y": 7
          }
        },
        {
          "id": "edge_api_gateway",
          "type": "api_gateway",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "API Gateway",
          "icon": "route",
          "layout": {
            "x": 26,
            "y": 20.583333333333336
          }
        },
        {
          "id": "edge_rate_limiter",
          "type": "rate_limiter",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Rate Limiter",
          "icon": "timer",
          "layout": {
            "x": 74,
            "y": 34.16666666666667
          }
        },
        {
          "id": "limiter_cache",
          "type": "cache",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Cache",
          "icon": "memory-stick",
          "layout": {
            "x": 26,
            "y": 47.75
          }
        },
        {
          "id": "edge_load_balancer",
          "type": "load_balancer",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Load Balancer",
          "icon": "shuffle",
          "layout": {
            "x": 74,
            "y": 61.333333333333336
          }
        },
        {
          "id": "app_server",
          "type": "server",
          "count": 3,
          "importance": "secondary",
          "status": "normal",
          "label": "Server",
          "icon": "server",
          "layout": {
            "x": 50,
            "y": 74.91666666666667
          }
        },
        {
          "id": "app_db",
          "type": "database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Database",
          "icon": "database",
          "layout": {
            "x": 26,
            "y": 88.5
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_gateway",
          "from": "users",
          "to": "edge_api_gateway",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_gateway_to_limiter",
          "from": "edge_api_gateway",
          "to": "edge_rate_limiter",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_limiter_to_cache",
          "from": "edge_rate_limiter",
          "to": "limiter_cache",
          "direction": "bidirectional",
          "style": "solid"
        },
        {
          "id": "c_limiter_to_lb",
          "from": "edge_rate_limiter",
          "to": "edge_load_balancer",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_lb_to_server",
          "from": "edge_load_balancer",
          "to": "app_server",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_server_to_db",
          "from": "app_server",
          "to": "app_db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_gateway_fwd",
          "from": "users",
          "to": "edge_api_gateway",
          "type": "burst",
          "intensity": "high"
        },
        {
          "id": "i_c_gateway_to_limiter_fwd",
          "from": "edge_api_gateway",
          "to": "edge_rate_limiter",
          "type": "burst",
          "intensity": "high"
        },
        {
          "id": "i_c_limiter_to_cache_fwd",
          "from": "edge_rate_limiter",
          "to": "limiter_cache",
          "type": "ping",
          "intensity": "high"
        },
        {
          "id": "i_c_limiter_to_cache_rev",
          "from": "limiter_cache",
          "to": "edge_rate_limiter",
          "type": "ping",
          "intensity": "high"
        },
        {
          "id": "i_c_limiter_to_lb_fwd",
          "from": "edge_rate_limiter",
          "to": "edge_load_balancer",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_lb_to_server_fwd",
          "from": "edge_load_balancer",
          "to": "app_server",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_server_to_db_fwd",
          "from": "app_server",
          "to": "app_db",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "edge_rate_limiter",
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
              "x": 74,
              "y": 7
            }
          },
          {
            "id": "edge_api_gateway",
            "type": "api_gateway",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "API Gateway",
            "icon": "route",
            "layout": {
              "x": 26,
              "y": 20.583333333333336
            }
          },
          {
            "id": "edge_rate_limiter",
            "type": "rate_limiter",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Rate Limiter",
            "icon": "timer",
            "layout": {
              "x": 74,
              "y": 34.16666666666667
            }
          },
          {
            "id": "limiter_cache",
            "type": "cache",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Cache",
            "icon": "memory-stick",
            "layout": {
              "x": 26,
              "y": 47.75
            }
          },
          {
            "id": "edge_load_balancer",
            "type": "load_balancer",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Load Balancer",
            "icon": "shuffle",
            "layout": {
              "x": 74,
              "y": 61.333333333333336
            }
          },
          {
            "id": "app_server",
            "type": "server",
            "count": 3,
            "importance": "secondary",
            "status": "normal",
            "label": "Server",
            "icon": "server",
            "layout": {
              "x": 50,
              "y": 74.91666666666667
            }
          },
          {
            "id": "app_db",
            "type": "database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Database",
            "icon": "database",
            "layout": {
              "x": 26,
              "y": 88.5
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_gateway",
            "from": "users",
            "to": "edge_api_gateway",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_gateway_to_limiter",
            "from": "edge_api_gateway",
            "to": "edge_rate_limiter",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_limiter_to_cache",
            "from": "edge_rate_limiter",
            "to": "limiter_cache",
            "direction": "bidirectional",
            "style": "solid"
          },
          {
            "id": "c_limiter_to_lb",
            "from": "edge_rate_limiter",
            "to": "edge_load_balancer",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_lb_to_server",
            "from": "edge_load_balancer",
            "to": "app_server",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_server_to_db",
            "from": "app_server",
            "to": "app_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_gateway_fwd",
            "from": "users",
            "to": "edge_api_gateway",
            "type": "burst",
            "intensity": "high"
          },
          {
            "id": "i_c_gateway_to_limiter_fwd",
            "from": "edge_api_gateway",
            "to": "edge_rate_limiter",
            "type": "burst",
            "intensity": "high"
          },
          {
            "id": "i_c_limiter_to_cache_fwd",
            "from": "edge_rate_limiter",
            "to": "limiter_cache",
            "type": "ping",
            "intensity": "high"
          },
          {
            "id": "i_c_limiter_to_cache_rev",
            "from": "limiter_cache",
            "to": "edge_rate_limiter",
            "type": "ping",
            "intensity": "high"
          },
          {
            "id": "i_c_limiter_to_lb_fwd",
            "from": "edge_rate_limiter",
            "to": "edge_load_balancer",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_lb_to_server_fwd",
            "from": "edge_load_balancer",
            "to": "app_server",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_server_to_db_fwd",
            "from": "app_server",
            "to": "app_db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "edge_rate_limiter",
          "zoom": 1
        }
      },
      "motionPersonality": "ENERGETIC",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_importance_changed",
            "entityId": "edge_rate_limiter",
            "from": "secondary",
            "to": "primary"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "limiter_cache",
            "from": "primary",
            "to": "secondary"
          }
        ],
        "connectionDiffs": [],
        "interactionDiffs": [
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_users_to_gateway_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_gateway_to_limiter_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_limiter_to_cache_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_limiter_to_cache_rev",
            "from": "medium",
            "to": "high"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "limiter_cache",
              "zoom": 1
            },
            "to": {
              "mode": "focus",
              "target": "edge_rate_limiter",
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
            "entityId": "edge_rate_limiter",
            "elementIds": [
              "edge_rate_limiter"
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
            "interactionId": "i_c_users_to_gateway_fwd"
          },
          {
            "entityId": "edge_api_gateway",
            "elementIds": [
              "edge_api_gateway"
            ],
            "action": "interact",
            "interactionId": "i_c_gateway_to_limiter_fwd",
            "cleanup": false
          },
          {
            "entityId": "edge_rate_limiter",
            "elementIds": [
              "edge_rate_limiter"
            ],
            "action": "interact",
            "interactionId": "i_c_limiter_to_cache_rev",
            "cleanup": false
          },
          {
            "entityId": "limiter_cache",
            "elementIds": [
              "limiter_cache"
            ],
            "action": "interact",
            "interactionId": "i_c_limiter_to_cache_rev",
            "cleanup": false
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "edge_rate_limiter",
            "action": "add",
            "delay": 0.37399999999999994,
            "duration": 0.62,
            "easing": "cubic-bezier(0.4,0,0.2,1)",
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
            "id": "edge_rate_limiter",
            "changes": {
              "importance": {
                "from": "secondary",
                "to": "primary"
              }
            }
          },
          {
            "id": "limiter_cache",
            "changes": {
              "importance": {
                "from": "primary",
                "to": "secondary"
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
            "id": "i_c_users_to_gateway_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "id": "i_c_gateway_to_limiter_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "id": "i_c_limiter_to_cache_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "id": "i_c_limiter_to_cache_rev",
            "from": "medium",
            "to": "high"
          }
        ],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "limiter_cache",
            "zoom": 1
          },
          "to": {
            "mode": "focus",
            "target": "edge_rate_limiter",
            "zoom": 1
          }
        }
      }
    },
    {
      "id": "s10",
      "start": 54,
      "end": 60,
      "narration": "The final stack shows Users entering an API Gateway, then a Rate Limiter with a Cache for counters, then a Load Balancer spreading requests across Servers that read and write the Database.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "icon": "users",
          "position": {
            "x": 74,
            "y": 7
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "edge_api_gateway",
          "type": "api_gateway",
          "sourceEntityId": "edge_api_gateway",
          "label": "API Gateway",
          "icon": "route",
          "position": {
            "x": 26,
            "y": 20.583333333333336
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "edge_rate_limiter",
          "type": "rate_limiter",
          "sourceEntityId": "edge_rate_limiter",
          "label": "Rate Limiter",
          "icon": "timer",
          "position": {
            "x": 74,
            "y": 34.16666666666667
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "limiter_cache",
          "type": "cache",
          "sourceEntityId": "limiter_cache",
          "label": "Cache",
          "icon": "memory-stick",
          "position": {
            "x": 26,
            "y": 47.75
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "edge_load_balancer",
          "type": "load_balancer",
          "sourceEntityId": "edge_load_balancer",
          "label": "Load Balancer",
          "icon": "shuffle",
          "position": {
            "x": 74,
            "y": 61.333333333333336
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#34D399",
            "glow": false,
            "glowColor": "#34D399",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "app_server_1",
          "type": "server",
          "sourceEntityId": "app_server",
          "icon": "server",
          "position": {
            "x": 26.71944444444444,
            "y": 74.91666666666667
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_server",
          "type": "server",
          "sourceEntityId": "app_server",
          "label": "Server",
          "icon": "server",
          "position": {
            "x": 50,
            "y": 74.91666666666667
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_server_3",
          "type": "server",
          "sourceEntityId": "app_server",
          "icon": "server",
          "position": {
            "x": 73.28055555555557,
            "y": 74.91666666666667
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_db",
          "type": "database",
          "sourceEntityId": "app_db",
          "label": "Database",
          "icon": "database",
          "position": {
            "x": 26,
            "y": 88.5
          },
          "visualStyle": {
            "size": 91.8,
            "opacity": 1,
            "color": "#1F314D",
            "strokeWidth": 2.181493066686209,
            "strokeColor": "#35C4C8",
            "glow": false,
            "glowColor": "#35C4C8",
            "glowBlur": 0,
            "textColor": "#E8F6FF",
            "fontSize": 32.5584,
            "fontWeight": 600,
            "status": "normal"
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
            "x": 74,
            "y": 7
          }
        },
        {
          "id": "edge_api_gateway",
          "type": "api_gateway",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "API Gateway",
          "icon": "route",
          "layout": {
            "x": 26,
            "y": 20.583333333333336
          }
        },
        {
          "id": "edge_rate_limiter",
          "type": "rate_limiter",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Rate Limiter",
          "icon": "timer",
          "layout": {
            "x": 74,
            "y": 34.16666666666667
          }
        },
        {
          "id": "limiter_cache",
          "type": "cache",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Cache",
          "icon": "memory-stick",
          "layout": {
            "x": 26,
            "y": 47.75
          }
        },
        {
          "id": "edge_load_balancer",
          "type": "load_balancer",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Load Balancer",
          "icon": "shuffle",
          "layout": {
            "x": 74,
            "y": 61.333333333333336
          }
        },
        {
          "id": "app_server",
          "type": "server",
          "count": 3,
          "importance": "secondary",
          "status": "normal",
          "label": "Server",
          "icon": "server",
          "layout": {
            "x": 50,
            "y": 74.91666666666667
          }
        },
        {
          "id": "app_db",
          "type": "database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Database",
          "icon": "database",
          "layout": {
            "x": 26,
            "y": 88.5
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_to_gateway",
          "from": "users",
          "to": "edge_api_gateway",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_gateway_to_limiter",
          "from": "edge_api_gateway",
          "to": "edge_rate_limiter",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_limiter_to_cache",
          "from": "edge_rate_limiter",
          "to": "limiter_cache",
          "direction": "bidirectional",
          "style": "solid"
        },
        {
          "id": "c_limiter_to_lb",
          "from": "edge_rate_limiter",
          "to": "edge_load_balancer",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_lb_to_server",
          "from": "edge_load_balancer",
          "to": "app_server",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_server_to_db",
          "from": "app_server",
          "to": "app_db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_to_gateway_fwd",
          "from": "users",
          "to": "edge_api_gateway",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_gateway_to_limiter_fwd",
          "from": "edge_api_gateway",
          "to": "edge_rate_limiter",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_limiter_to_cache_fwd",
          "from": "edge_rate_limiter",
          "to": "limiter_cache",
          "type": "ping",
          "intensity": "medium"
        },
        {
          "id": "i_c_limiter_to_cache_rev",
          "from": "limiter_cache",
          "to": "edge_rate_limiter",
          "type": "ping",
          "intensity": "medium"
        },
        {
          "id": "i_c_limiter_to_lb_fwd",
          "from": "edge_rate_limiter",
          "to": "edge_load_balancer",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_lb_to_server_fwd",
          "from": "edge_load_balancer",
          "to": "app_server",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_server_to_db_fwd",
          "from": "app_server",
          "to": "app_db",
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
            "status": "active",
            "label": "Users",
            "icon": "users",
            "layout": {
              "x": 74,
              "y": 7
            }
          },
          {
            "id": "edge_api_gateway",
            "type": "api_gateway",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "API Gateway",
            "icon": "route",
            "layout": {
              "x": 26,
              "y": 20.583333333333336
            }
          },
          {
            "id": "edge_rate_limiter",
            "type": "rate_limiter",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Rate Limiter",
            "icon": "timer",
            "layout": {
              "x": 74,
              "y": 34.16666666666667
            }
          },
          {
            "id": "limiter_cache",
            "type": "cache",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Cache",
            "icon": "memory-stick",
            "layout": {
              "x": 26,
              "y": 47.75
            }
          },
          {
            "id": "edge_load_balancer",
            "type": "load_balancer",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Load Balancer",
            "icon": "shuffle",
            "layout": {
              "x": 74,
              "y": 61.333333333333336
            }
          },
          {
            "id": "app_server",
            "type": "server",
            "count": 3,
            "importance": "secondary",
            "status": "normal",
            "label": "Server",
            "icon": "server",
            "layout": {
              "x": 50,
              "y": 74.91666666666667
            }
          },
          {
            "id": "app_db",
            "type": "database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Database",
            "icon": "database",
            "layout": {
              "x": 26,
              "y": 88.5
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_to_gateway",
            "from": "users",
            "to": "edge_api_gateway",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_gateway_to_limiter",
            "from": "edge_api_gateway",
            "to": "edge_rate_limiter",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_limiter_to_cache",
            "from": "edge_rate_limiter",
            "to": "limiter_cache",
            "direction": "bidirectional",
            "style": "solid"
          },
          {
            "id": "c_limiter_to_lb",
            "from": "edge_rate_limiter",
            "to": "edge_load_balancer",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_lb_to_server",
            "from": "edge_load_balancer",
            "to": "app_server",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_server_to_db",
            "from": "app_server",
            "to": "app_db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_to_gateway_fwd",
            "from": "users",
            "to": "edge_api_gateway",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_gateway_to_limiter_fwd",
            "from": "edge_api_gateway",
            "to": "edge_rate_limiter",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_limiter_to_cache_fwd",
            "from": "edge_rate_limiter",
            "to": "limiter_cache",
            "type": "ping",
            "intensity": "medium"
          },
          {
            "id": "i_c_limiter_to_cache_rev",
            "from": "limiter_cache",
            "to": "edge_rate_limiter",
            "type": "ping",
            "intensity": "medium"
          },
          {
            "id": "i_c_limiter_to_lb_fwd",
            "from": "edge_rate_limiter",
            "to": "edge_load_balancer",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_lb_to_server_fwd",
            "from": "edge_load_balancer",
            "to": "app_server",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_server_to_db_fwd",
            "from": "app_server",
            "to": "app_db",
            "type": "flow",
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
        "entityDiffs": [],
        "connectionDiffs": [],
        "interactionDiffs": [
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_users_to_gateway_fwd",
            "from": "high",
            "to": "medium"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_gateway_to_limiter_fwd",
            "from": "high",
            "to": "medium"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_limiter_to_cache_fwd",
            "from": "high",
            "to": "medium"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_limiter_to_cache_rev",
            "from": "high",
            "to": "medium"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "edge_rate_limiter",
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
            "interactionId": "i_c_users_to_gateway_fwd"
          },
          {
            "entityId": "edge_api_gateway",
            "elementIds": [
              "edge_api_gateway"
            ],
            "action": "interact",
            "interactionId": "i_c_gateway_to_limiter_fwd",
            "cleanup": false
          },
          {
            "entityId": "edge_rate_limiter",
            "elementIds": [
              "edge_rate_limiter"
            ],
            "action": "interact",
            "interactionId": "i_c_limiter_to_cache_rev",
            "cleanup": false
          },
          {
            "entityId": "limiter_cache",
            "elementIds": [
              "limiter_cache"
            ],
            "action": "interact",
            "interactionId": "i_c_limiter_to_cache_rev",
            "cleanup": false
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
        "updatedEntities": [],
        "addedConnections": [],
        "removedConnections": [],
        "addedInteractions": [],
        "removedInteractions": [],
        "interactionIntensityChanged": [
          {
            "id": "i_c_users_to_gateway_fwd",
            "from": "high",
            "to": "medium"
          },
          {
            "id": "i_c_gateway_to_limiter_fwd",
            "from": "high",
            "to": "medium"
          },
          {
            "id": "i_c_limiter_to_cache_fwd",
            "from": "high",
            "to": "medium"
          },
          {
            "id": "i_c_limiter_to_cache_rev",
            "from": "high",
            "to": "medium"
          }
        ],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "edge_rate_limiter",
            "zoom": 1
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
