/** @jsxImportSource @motion-canvas/2d/lib */
import {Line, Node, makeScene2D, Txt} from '@motion-canvas/2d';
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
      "id": "scene_01",
      "start": 0,
      "end": 6,
      "narration": "A single Users cluster sends requests to one Server.",
      "camera": "focus",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "position": {
            "x": 50,
            "y": 23.4
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 130.5,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 3.612478373637689,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 24.505000000000003,
            "textColor": "#E8F6FF",
            "fontSize": 40.6,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app",
          "type": "server",
          "sourceEntityId": "app",
          "label": "Server",
          "position": {
            "x": 50,
            "y": 60.6
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 130.5,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 3.612478373637689,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 24.505000000000003,
            "textColor": "#E8F6FF",
            "fontSize": 40.6,
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
          "status": "normal",
          "label": "Users",
          "layout": {
            "x": 50,
            "y": 23.4
          }
        },
        {
          "id": "app",
          "type": "server",
          "count": 1,
          "importance": "primary",
          "status": "normal",
          "label": "Server",
          "layout": {
            "x": 50,
            "y": 60.6
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_app_req",
          "from": "users",
          "to": "app",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_app_req_fwd",
          "from": "users",
          "to": "app",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "app",
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
          "theme": "neon",
          "background_texture": "grid",
          "glow_strength": "strong"
        },
        "motion": {
          "entry_style": "elastic_pop",
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
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Users",
            "layout": {
              "x": 50,
              "y": 23.4
            }
          },
          {
            "id": "app",
            "type": "server",
            "count": 1,
            "importance": "primary",
            "status": "normal",
            "label": "Server",
            "layout": {
              "x": 50,
              "y": 60.6
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_app_req",
            "from": "users",
            "to": "app",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_app_req_fwd",
            "from": "users",
            "to": "app",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "app",
          "zoom": 1.18
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
            "entityId": "app"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_users_app_req"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_users_app_req_fwd"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": null,
            "to": {
              "mode": "focus",
              "target": "app",
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
            "entityId": "app",
            "elementIds": [
              "app"
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
            "connectionId": "c_users_app_req"
          },
          {
            "entityId": "app",
            "elementIds": [
              "app"
            ],
            "action": "connect",
            "connectionId": "c_users_app_req"
          }
        ],
        "interactions": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "interact",
            "interactionId": "i_c_users_app_req_fwd"
          },
          {
            "entityId": "app",
            "elementIds": [
              "app"
            ],
            "action": "interact",
            "interactionId": "i_c_users_app_req_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "users",
            "action": "add",
            "delay": 0.32399999999999995,
            "duration": 0.54,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "isPrimary": false
          },
          {
            "entityId": "app",
            "action": "add",
            "delay": 0.40399999999999997,
            "duration": 0.62,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_users_app_req",
            "delay": 0.504,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": {
        "targetId": "app",
        "targetElementId": "app",
        "zoom": 1.18,
        "duration": 0.55,
        "easing": "cubic-bezier(0.2,0,0,1)",
        "motionType": "focus_primary"
      },
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "users",
            "type": "users_cluster",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Users",
            "layout": {
              "x": 50,
              "y": 23.4
            }
          },
          {
            "id": "app",
            "type": "server",
            "count": 1,
            "importance": "primary",
            "status": "normal",
            "label": "Server",
            "layout": {
              "x": 50,
              "y": 60.6
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [],
        "updatedEntities": [],
        "addedConnections": [
          {
            "id": "c_users_app_req",
            "from": "users",
            "to": "app",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [],
        "addedInteractions": [
          {
            "id": "i_c_users_app_req_fwd",
            "from": "users",
            "to": "app",
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
            "target": "app",
            "zoom": 1.18
          }
        }
      }
    },
    {
      "id": "scene_02",
      "start": 6,
      "end": 12,
      "narration": "Users go to the Server, and the Server reads and writes to a single Database.",
      "camera": "focus",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "position": {
            "x": 50,
            "y": 19.8
          },
          "visualStyle": {
            "size": 115.2,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 3.394112549695428,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 21.632,
            "textColor": "#E8F6FF",
            "fontSize": 35.84,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app",
          "type": "server",
          "sourceEntityId": "app",
          "label": "Server",
          "position": {
            "x": 50,
            "y": 42
          },
          "visualStyle": {
            "size": 115.2,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 3.394112549695428,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 21.632,
            "textColor": "#E8F6FF",
            "fontSize": 35.84,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "db",
          "type": "database",
          "sourceEntityId": "db",
          "label": "Database",
          "position": {
            "x": 50,
            "y": 64.2
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 115.2,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 3.394112549695428,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 21.632,
            "textColor": "#E8F6FF",
            "fontSize": 35.84,
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
          "status": "normal",
          "label": "Users",
          "layout": {
            "x": 50,
            "y": 19.8
          }
        },
        {
          "id": "app",
          "type": "server",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Server",
          "layout": {
            "x": 50,
            "y": 42
          }
        },
        {
          "id": "db",
          "type": "database",
          "count": 1,
          "importance": "primary",
          "status": "normal",
          "label": "Database",
          "layout": {
            "x": 50,
            "y": 64.2
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_app_req",
          "from": "users",
          "to": "app",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_app_db_req",
          "from": "app",
          "to": "db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_app_req_fwd",
          "from": "users",
          "to": "app",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_app_db_req_fwd",
          "from": "app",
          "to": "db",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "db",
        "zoom": 1.12
      },
      "directives": {
        "camera": {
          "mode": "follow_action",
          "zoom": "tight",
          "active_zone": "upper_third",
          "reserve_bottom_percent": 25
        },
        "visual": {
          "theme": "neon",
          "background_texture": "grid",
          "glow_strength": "strong"
        },
        "motion": {
          "entry_style": "elastic_pop",
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
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Users",
            "layout": {
              "x": 50,
              "y": 19.8
            }
          },
          {
            "id": "app",
            "type": "server",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Server",
            "layout": {
              "x": 50,
              "y": 42
            }
          },
          {
            "id": "db",
            "type": "database",
            "count": 1,
            "importance": "primary",
            "status": "normal",
            "label": "Database",
            "layout": {
              "x": 50,
              "y": 64.2
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_app_req",
            "from": "users",
            "to": "app",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_app_db_req",
            "from": "app",
            "to": "db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_app_req_fwd",
            "from": "users",
            "to": "app",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_app_db_req_fwd",
            "from": "app",
            "to": "db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "db",
          "zoom": 1.12
        }
      },
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "db"
          },
          {
            "type": "entity_moved",
            "entityId": "users",
            "from": {
              "x": 50,
              "y": 23.4
            },
            "to": {
              "x": 50,
              "y": 19.8
            }
          },
          {
            "type": "entity_moved",
            "entityId": "app",
            "from": {
              "x": 50,
              "y": 60.6
            },
            "to": {
              "x": 50,
              "y": 42
            }
          },
          {
            "type": "entity_importance_changed",
            "entityId": "app",
            "from": "primary",
            "to": "secondary"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_app_db_req"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_app_db_req_fwd"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "app",
              "zoom": 1.18
            },
            "to": {
              "mode": "focus",
              "target": "db",
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
            "entityId": "app",
            "elementIds": [
              "app"
            ],
            "action": "move"
          }
        ],
        "additions": [
          {
            "entityId": "db",
            "elementIds": [
              "db"
            ],
            "action": "add",
            "enter": "zoom_in",
            "cleanup": false
          }
        ],
        "connections": [
          {
            "entityId": "app",
            "elementIds": [
              "app"
            ],
            "action": "connect",
            "connectionId": "c_app_db_req"
          },
          {
            "entityId": "db",
            "elementIds": [
              "db"
            ],
            "action": "connect",
            "connectionId": "c_app_db_req"
          }
        ],
        "interactions": [
          {
            "entityId": "app",
            "elementIds": [
              "app"
            ],
            "action": "interact",
            "interactionId": "i_c_app_db_req_fwd"
          },
          {
            "entityId": "db",
            "elementIds": [
              "db"
            ],
            "action": "interact",
            "interactionId": "i_c_app_db_req_fwd"
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
            "entityId": "app",
            "action": "move",
            "delay": 0.6560000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "db",
            "action": "add",
            "delay": 0.37399999999999994,
            "duration": 0.62,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_app_db_req",
            "delay": 0.504,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": {
        "targetId": "db",
        "targetElementId": "db",
        "zoom": 1.12,
        "duration": 0.55,
        "easing": "cubic-bezier(0.2,0,0,1)",
        "motionType": "focus_primary"
      },
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "db",
            "type": "database",
            "count": 1,
            "importance": "primary",
            "status": "normal",
            "label": "Database",
            "layout": {
              "x": 50,
              "y": 64.2
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "users",
            "from": {
              "x": 50,
              "y": 23.4
            },
            "to": {
              "x": 50,
              "y": 19.8
            }
          },
          {
            "id": "app",
            "from": {
              "x": 50,
              "y": 60.6
            },
            "to": {
              "x": 50,
              "y": 42
            }
          }
        ],
        "updatedEntities": [
          {
            "id": "app",
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
            "id": "c_app_db_req",
            "from": "app",
            "to": "db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [],
        "addedInteractions": [
          {
            "id": "i_c_app_db_req_fwd",
            "from": "app",
            "to": "db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "app",
            "zoom": 1.18
          },
          "to": {
            "mode": "focus",
            "target": "db",
            "zoom": 1.12
          }
        }
      }
    },
    {
      "id": "scene_03",
      "start": 12,
      "end": 18,
      "narration": "A Load Balancer sits between Users and the Server, but there is still only one Server behind it.",
      "camera": "focus",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "position": {
            "x": 50,
            "y": 16.2
          },
          "visualStyle": {
            "size": 102.6,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 3.2031234756093934,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 19.266000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 31.919999999999998,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "lb",
          "type": "load_balancer",
          "sourceEntityId": "lb",
          "label": "Load Balancer",
          "position": {
            "x": 50,
            "y": 33.4
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 102.6,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 3.2031234756093934,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 19.266000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 31.919999999999998,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app",
          "type": "server",
          "sourceEntityId": "app",
          "label": "Server",
          "position": {
            "x": 50,
            "y": 50.599999999999994
          },
          "visualStyle": {
            "size": 102.6,
            "opacity": 1,
            "color": "#EF4444",
            "strokeWidth": 3.2031234756093934,
            "strokeColor": "#EF4444",
            "glow": true,
            "glowColor": "#EF4444",
            "glowBlur": 25.193999999999996,
            "textColor": "#E8F6FF",
            "fontSize": 31.919999999999998,
            "fontWeight": 600,
            "status": "overloaded"
          }
        },
        {
          "id": "db",
          "type": "database",
          "sourceEntityId": "db",
          "label": "Database",
          "position": {
            "x": 50,
            "y": 67.8
          },
          "visualStyle": {
            "size": 102.6,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 3.2031234756093934,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 19.266000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 31.919999999999998,
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
          "status": "normal",
          "label": "Users",
          "layout": {
            "x": 50,
            "y": 16.2
          }
        },
        {
          "id": "lb",
          "type": "load_balancer",
          "count": 1,
          "importance": "primary",
          "status": "normal",
          "label": "Load Balancer",
          "layout": {
            "x": 50,
            "y": 33.4
          }
        },
        {
          "id": "app",
          "type": "server",
          "count": 1,
          "importance": "secondary",
          "status": "overloaded",
          "label": "Server",
          "layout": {
            "x": 50,
            "y": 50.599999999999994
          }
        },
        {
          "id": "db",
          "type": "database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Database",
          "layout": {
            "x": 50,
            "y": 67.8
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_lb_req",
          "from": "users",
          "to": "lb",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_lb_app_req",
          "from": "lb",
          "to": "app",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_app_db_req",
          "from": "app",
          "to": "db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_lb_req_fwd",
          "from": "users",
          "to": "lb",
          "type": "flow",
          "intensity": "high"
        },
        {
          "id": "i_c_lb_app_req_fwd",
          "from": "lb",
          "to": "app",
          "type": "flow",
          "intensity": "high"
        },
        {
          "id": "i_c_app_db_req_fwd",
          "from": "app",
          "to": "db",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "lb",
        "zoom": 1.08
      },
      "directives": {
        "camera": {
          "mode": "follow_action",
          "zoom": "tight",
          "active_zone": "upper_third",
          "reserve_bottom_percent": 25
        },
        "visual": {
          "theme": "neon",
          "background_texture": "grid",
          "glow_strength": "strong"
        },
        "motion": {
          "entry_style": "elastic_pop",
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
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Users",
            "layout": {
              "x": 50,
              "y": 16.2
            }
          },
          {
            "id": "lb",
            "type": "load_balancer",
            "count": 1,
            "importance": "primary",
            "status": "normal",
            "label": "Load Balancer",
            "layout": {
              "x": 50,
              "y": 33.4
            }
          },
          {
            "id": "app",
            "type": "server",
            "count": 1,
            "importance": "secondary",
            "status": "overloaded",
            "label": "Server",
            "layout": {
              "x": 50,
              "y": 50.599999999999994
            }
          },
          {
            "id": "db",
            "type": "database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Database",
            "layout": {
              "x": 50,
              "y": 67.8
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_lb_req",
            "from": "users",
            "to": "lb",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_lb_app_req",
            "from": "lb",
            "to": "app",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_app_db_req",
            "from": "app",
            "to": "db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_lb_req_fwd",
            "from": "users",
            "to": "lb",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_lb_app_req_fwd",
            "from": "lb",
            "to": "app",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_app_db_req_fwd",
            "from": "app",
            "to": "db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "lb",
          "zoom": 1.08
        }
      },
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "lb"
          },
          {
            "type": "entity_moved",
            "entityId": "users",
            "from": {
              "x": 50,
              "y": 19.8
            },
            "to": {
              "x": 50,
              "y": 16.2
            }
          },
          {
            "type": "entity_moved",
            "entityId": "app",
            "from": {
              "x": 50,
              "y": 42
            },
            "to": {
              "x": 50,
              "y": 50.599999999999994
            }
          },
          {
            "type": "entity_moved",
            "entityId": "db",
            "from": {
              "x": 50,
              "y": 64.2
            },
            "to": {
              "x": 50,
              "y": 67.8
            }
          },
          {
            "type": "entity_status_changed",
            "entityId": "app",
            "from": "normal",
            "to": "overloaded"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "db",
            "from": "primary",
            "to": "secondary"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_users_lb_req"
          },
          {
            "type": "connection_added",
            "connectionId": "c_lb_app_req"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_users_app_req"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_users_lb_req_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_lb_app_req_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_users_app_req_fwd"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "db",
              "zoom": 1.12
            },
            "to": {
              "mode": "focus",
              "target": "lb",
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
            "entityId": "app",
            "elementIds": [
              "app"
            ],
            "action": "move"
          },
          {
            "entityId": "db",
            "elementIds": [
              "db"
            ],
            "action": "move"
          }
        ],
        "additions": [
          {
            "entityId": "lb",
            "elementIds": [
              "lb"
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
            "connectionId": "c_users_app_req",
            "cleanup": false
          },
          {
            "entityId": "lb",
            "elementIds": [
              "lb"
            ],
            "action": "connect",
            "connectionId": "c_lb_app_req",
            "cleanup": false
          },
          {
            "entityId": "app",
            "elementIds": [
              "app"
            ],
            "action": "connect",
            "connectionId": "c_users_app_req",
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
            "interactionId": "i_c_users_app_req_fwd",
            "cleanup": false
          },
          {
            "entityId": "lb",
            "elementIds": [
              "lb"
            ],
            "action": "interact",
            "interactionId": "i_c_lb_app_req_fwd",
            "cleanup": false
          },
          {
            "entityId": "app",
            "elementIds": [
              "app"
            ],
            "action": "interact",
            "interactionId": "i_c_users_app_req_fwd",
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
            "entityId": "app",
            "action": "move",
            "delay": 0.6560000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "db",
            "action": "move",
            "delay": 0.7120000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "lb",
            "action": "add",
            "delay": 0.37399999999999994,
            "duration": 0.62,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_users_lb_req",
            "delay": 0.504,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "connectionId": "c_lb_app_req",
            "delay": 0.56,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "connectionId": "c_users_app_req",
            "delay": 0.616,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": {
        "targetId": "lb",
        "targetElementId": "lb",
        "zoom": 1.08,
        "duration": 0.55,
        "easing": "cubic-bezier(0.2,0,0,1)",
        "motionType": "focus_primary"
      },
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "lb",
            "type": "load_balancer",
            "count": 1,
            "importance": "primary",
            "status": "normal",
            "label": "Load Balancer",
            "layout": {
              "x": 50,
              "y": 33.4
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "users",
            "from": {
              "x": 50,
              "y": 19.8
            },
            "to": {
              "x": 50,
              "y": 16.2
            }
          },
          {
            "id": "app",
            "from": {
              "x": 50,
              "y": 42
            },
            "to": {
              "x": 50,
              "y": 50.599999999999994
            }
          },
          {
            "id": "db",
            "from": {
              "x": 50,
              "y": 64.2
            },
            "to": {
              "x": 50,
              "y": 67.8
            }
          }
        ],
        "updatedEntities": [
          {
            "id": "app",
            "changes": {
              "status": {
                "from": "normal",
                "to": "overloaded"
              }
            }
          },
          {
            "id": "db",
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
            "id": "c_users_lb_req",
            "from": "users",
            "to": "lb",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_lb_app_req",
            "from": "lb",
            "to": "app",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [
          {
            "id": "c_users_app_req",
            "from": "users",
            "to": "app",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "addedInteractions": [
          {
            "id": "i_c_users_lb_req_fwd",
            "from": "users",
            "to": "lb",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_lb_app_req_fwd",
            "from": "lb",
            "to": "app",
            "type": "flow",
            "intensity": "high"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_users_app_req_fwd",
            "from": "users",
            "to": "app",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "db",
            "zoom": 1.12
          },
          "to": {
            "mode": "focus",
            "target": "lb",
            "zoom": 1.08
          }
        }
      }
    },
    {
      "id": "scene_04",
      "start": 18,
      "end": 24,
      "narration": "The Load Balancer distributes Users across three Servers that all talk to the same Database.",
      "camera": "focus",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "position": {
            "x": 50,
            "y": 16.2
          },
          "visualStyle": {
            "size": 81,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.846049894151541,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 15.210000000000003,
            "textColor": "#E8F6FF",
            "fontSize": 25.2,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "lb",
          "type": "load_balancer",
          "sourceEntityId": "lb",
          "label": "Load Balancer",
          "position": {
            "x": 50,
            "y": 33.4
          },
          "visualStyle": {
            "size": 81,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.846049894151541,
            "strokeColor": "#34D399",
            "glow": true,
            "glowColor": "#34D399",
            "glowBlur": 15.210000000000003,
            "textColor": "#E8F6FF",
            "fontSize": 25.2,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "app_1",
          "type": "server",
          "sourceEntityId": "app",
          "position": {
            "x": 29.458333333333336,
            "y": 50.599999999999994
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 81,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.846049894151541,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 15.210000000000003,
            "textColor": "#E8F6FF",
            "fontSize": 25.2,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app",
          "type": "server",
          "sourceEntityId": "app",
          "label": "Server",
          "position": {
            "x": 50,
            "y": 50.599999999999994
          },
          "visualStyle": {
            "size": 81,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.846049894151541,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 15.210000000000003,
            "textColor": "#E8F6FF",
            "fontSize": 25.2,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_3",
          "type": "server",
          "sourceEntityId": "app",
          "position": {
            "x": 70.54166666666666,
            "y": 50.599999999999994
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 81,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.846049894151541,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 15.210000000000003,
            "textColor": "#E8F6FF",
            "fontSize": 25.2,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "db",
          "type": "database",
          "sourceEntityId": "db",
          "label": "Database",
          "position": {
            "x": 50,
            "y": 67.8
          },
          "visualStyle": {
            "size": 81,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.846049894151541,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 15.210000000000003,
            "textColor": "#E8F6FF",
            "fontSize": 25.2,
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
          "status": "normal",
          "label": "Users",
          "layout": {
            "x": 50,
            "y": 16.2
          }
        },
        {
          "id": "lb",
          "type": "load_balancer",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Load Balancer",
          "layout": {
            "x": 50,
            "y": 33.4
          }
        },
        {
          "id": "app",
          "type": "server",
          "count": 3,
          "importance": "primary",
          "status": "normal",
          "label": "Server",
          "layout": {
            "x": 50,
            "y": 50.599999999999994
          }
        },
        {
          "id": "db",
          "type": "database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Database",
          "layout": {
            "x": 50,
            "y": 67.8
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_lb_req",
          "from": "users",
          "to": "lb",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_lb_app_req",
          "from": "lb",
          "to": "app",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_app_db_req",
          "from": "app",
          "to": "db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_lb_req_fwd",
          "from": "users",
          "to": "lb",
          "type": "flow",
          "intensity": "high"
        },
        {
          "id": "i_c_lb_app_req_fwd",
          "from": "lb",
          "to": "app",
          "type": "flow",
          "intensity": "high"
        },
        {
          "id": "i_c_app_db_req_fwd",
          "from": "app",
          "to": "db",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "app",
        "zoom": 1.08
      },
      "directives": {
        "camera": {
          "mode": "follow_action",
          "zoom": "tight",
          "active_zone": "upper_third",
          "reserve_bottom_percent": 25
        },
        "visual": {
          "theme": "neon",
          "background_texture": "grid",
          "glow_strength": "strong"
        },
        "motion": {
          "entry_style": "elastic_pop",
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
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Users",
            "layout": {
              "x": 50,
              "y": 16.2
            }
          },
          {
            "id": "lb",
            "type": "load_balancer",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Load Balancer",
            "layout": {
              "x": 50,
              "y": 33.4
            }
          },
          {
            "id": "app",
            "type": "server",
            "count": 3,
            "importance": "primary",
            "status": "normal",
            "label": "Server",
            "layout": {
              "x": 50,
              "y": 50.599999999999994
            }
          },
          {
            "id": "db",
            "type": "database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Database",
            "layout": {
              "x": 50,
              "y": 67.8
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_lb_req",
            "from": "users",
            "to": "lb",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_lb_app_req",
            "from": "lb",
            "to": "app",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_app_db_req",
            "from": "app",
            "to": "db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_lb_req_fwd",
            "from": "users",
            "to": "lb",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_lb_app_req_fwd",
            "from": "lb",
            "to": "app",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_app_db_req_fwd",
            "from": "app",
            "to": "db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "app",
          "zoom": 1.08
        }
      },
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_status_changed",
            "entityId": "lb",
            "from": "normal",
            "to": "active"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "lb",
            "from": "primary",
            "to": "secondary"
          },
          {
            "type": "entity_count_changed",
            "entityId": "app",
            "from": 1,
            "to": 3
          },
          {
            "type": "entity_status_changed",
            "entityId": "app",
            "from": "overloaded",
            "to": "normal"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "app",
            "from": "secondary",
            "to": "primary"
          }
        ],
        "connectionDiffs": [],
        "interactionDiffs": [],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "lb",
              "zoom": 1.08
            },
            "to": {
              "mode": "focus",
              "target": "app",
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
        "moves": [],
        "additions": [
          {
            "entityId": "app",
            "elementIds": [
              "app_1",
              "app",
              "app_3"
            ],
            "action": "add",
            "enter": "zoom_in",
            "cleanup": false
          }
        ],
        "connections": [],
        "interactions": []
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "app",
            "action": "add",
            "delay": 0.37399999999999994,
            "duration": 0.62,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [],
        "camera": null
      },
      "cameraPlan": {
        "targetId": "app",
        "targetElementId": "app",
        "zoom": 1.08,
        "duration": 0.55,
        "easing": "cubic-bezier(0.2,0,0,1)",
        "motionType": "focus_primary"
      },
      "sceneDiff": {
        "addedEntities": [],
        "removedEntities": [],
        "movedEntities": [],
        "updatedEntities": [
          {
            "id": "lb",
            "changes": {
              "status": {
                "from": "normal",
                "to": "active"
              },
              "importance": {
                "from": "primary",
                "to": "secondary"
              }
            }
          },
          {
            "id": "app",
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
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "lb",
            "zoom": 1.08
          },
          "to": {
            "mode": "focus",
            "target": "app",
            "zoom": 1.08
          }
        }
      }
    },
    {
      "id": "scene_05",
      "start": 24,
      "end": 30,
      "narration": "Each Server checks a Cache before going to the Database for data.",
      "camera": "focus",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "position": {
            "x": 50,
            "y": 12
          },
          "visualStyle": {
            "size": 72,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.6832815729997477,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 13.520000000000003,
            "textColor": "#E8F6FF",
            "fontSize": 22.400000000000002,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "lb",
          "type": "load_balancer",
          "sourceEntityId": "lb",
          "label": "Load Balancer",
          "position": {
            "x": 50,
            "y": 27
          },
          "visualStyle": {
            "size": 72,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.6832815729997477,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 13.520000000000003,
            "textColor": "#E8F6FF",
            "fontSize": 22.400000000000002,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_1",
          "type": "server",
          "sourceEntityId": "app",
          "position": {
            "x": 31.74074074074074,
            "y": 42
          },
          "visualStyle": {
            "size": 72,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.6832815729997477,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 13.520000000000003,
            "textColor": "#E8F6FF",
            "fontSize": 22.400000000000002,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app",
          "type": "server",
          "sourceEntityId": "app",
          "label": "Server",
          "position": {
            "x": 50,
            "y": 42
          },
          "visualStyle": {
            "size": 72,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.6832815729997477,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 13.520000000000003,
            "textColor": "#E8F6FF",
            "fontSize": 22.400000000000002,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_3",
          "type": "server",
          "sourceEntityId": "app",
          "position": {
            "x": 68.25925925925927,
            "y": 42
          },
          "visualStyle": {
            "size": 72,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.6832815729997477,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 13.520000000000003,
            "textColor": "#E8F6FF",
            "fontSize": 22.400000000000002,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "cache",
          "type": "cache",
          "sourceEntityId": "cache",
          "label": "Cache",
          "position": {
            "x": 50,
            "y": 57
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 72,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.6832815729997477,
            "strokeColor": "#34D399",
            "glow": true,
            "glowColor": "#34D399",
            "glowBlur": 13.520000000000003,
            "textColor": "#E8F6FF",
            "fontSize": 22.400000000000002,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "db",
          "type": "database",
          "sourceEntityId": "db",
          "label": "Database",
          "position": {
            "x": 50,
            "y": 72
          },
          "visualStyle": {
            "size": 72,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.6832815729997477,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 13.520000000000003,
            "textColor": "#E8F6FF",
            "fontSize": 22.400000000000002,
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
          "status": "normal",
          "label": "Users",
          "layout": {
            "x": 50,
            "y": 12
          }
        },
        {
          "id": "lb",
          "type": "load_balancer",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Load Balancer",
          "layout": {
            "x": 50,
            "y": 27
          }
        },
        {
          "id": "app",
          "type": "server",
          "count": 3,
          "importance": "secondary",
          "status": "normal",
          "label": "Server",
          "layout": {
            "x": 50,
            "y": 42
          }
        },
        {
          "id": "cache",
          "type": "cache",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Cache",
          "layout": {
            "x": 50,
            "y": 57
          }
        },
        {
          "id": "db",
          "type": "database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Database",
          "layout": {
            "x": 50,
            "y": 72
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_lb_req",
          "from": "users",
          "to": "lb",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_lb_app_req",
          "from": "lb",
          "to": "app",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_app_cache_lookup",
          "from": "app",
          "to": "cache",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_app_db_req",
          "from": "app",
          "to": "db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_lb_req_fwd",
          "from": "users",
          "to": "lb",
          "type": "flow",
          "intensity": "high"
        },
        {
          "id": "i_c_lb_app_req_fwd",
          "from": "lb",
          "to": "app",
          "type": "flow",
          "intensity": "high"
        },
        {
          "id": "i_c_app_cache_lookup_fwd",
          "from": "app",
          "to": "cache",
          "type": "ping",
          "intensity": "high"
        },
        {
          "id": "i_c_app_db_req_fwd",
          "from": "app",
          "to": "db",
          "type": "flow",
          "intensity": "low"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "cache",
        "zoom": 1.04
      },
      "directives": {
        "camera": {
          "mode": "follow_action",
          "zoom": "tight",
          "active_zone": "upper_third",
          "reserve_bottom_percent": 25
        },
        "visual": {
          "theme": "neon",
          "background_texture": "grid",
          "glow_strength": "strong"
        },
        "motion": {
          "entry_style": "elastic_pop",
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
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Users",
            "layout": {
              "x": 50,
              "y": 12
            }
          },
          {
            "id": "lb",
            "type": "load_balancer",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Load Balancer",
            "layout": {
              "x": 50,
              "y": 27
            }
          },
          {
            "id": "app",
            "type": "server",
            "count": 3,
            "importance": "secondary",
            "status": "normal",
            "label": "Server",
            "layout": {
              "x": 50,
              "y": 42
            }
          },
          {
            "id": "cache",
            "type": "cache",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Cache",
            "layout": {
              "x": 50,
              "y": 57
            }
          },
          {
            "id": "db",
            "type": "database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Database",
            "layout": {
              "x": 50,
              "y": 72
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_lb_req",
            "from": "users",
            "to": "lb",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_lb_app_req",
            "from": "lb",
            "to": "app",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_app_cache_lookup",
            "from": "app",
            "to": "cache",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_app_db_req",
            "from": "app",
            "to": "db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_lb_req_fwd",
            "from": "users",
            "to": "lb",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_lb_app_req_fwd",
            "from": "lb",
            "to": "app",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_app_cache_lookup_fwd",
            "from": "app",
            "to": "cache",
            "type": "ping",
            "intensity": "high"
          },
          {
            "id": "i_c_app_db_req_fwd",
            "from": "app",
            "to": "db",
            "type": "flow",
            "intensity": "low"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "cache",
          "zoom": 1.04
        }
      },
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "cache"
          },
          {
            "type": "entity_moved",
            "entityId": "users",
            "from": {
              "x": 50,
              "y": 16.2
            },
            "to": {
              "x": 50,
              "y": 12
            }
          },
          {
            "type": "entity_moved",
            "entityId": "lb",
            "from": {
              "x": 50,
              "y": 33.4
            },
            "to": {
              "x": 50,
              "y": 27
            }
          },
          {
            "type": "entity_moved",
            "entityId": "app",
            "from": {
              "x": 50,
              "y": 50.599999999999994
            },
            "to": {
              "x": 50,
              "y": 42
            }
          },
          {
            "type": "entity_moved",
            "entityId": "db",
            "from": {
              "x": 50,
              "y": 67.8
            },
            "to": {
              "x": 50,
              "y": 72
            }
          },
          {
            "type": "entity_status_changed",
            "entityId": "lb",
            "from": "active",
            "to": "normal"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "app",
            "from": "primary",
            "to": "secondary"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_app_cache_lookup"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_app_cache_lookup_fwd"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_app_db_req_fwd",
            "from": "medium",
            "to": "low"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "app",
              "zoom": 1.08
            },
            "to": {
              "mode": "focus",
              "target": "cache",
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
        "moves": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "move"
          },
          {
            "entityId": "lb",
            "elementIds": [
              "lb"
            ],
            "action": "move"
          },
          {
            "entityId": "app",
            "elementIds": [
              "app_1",
              "app",
              "app_3"
            ],
            "action": "move"
          },
          {
            "entityId": "db",
            "elementIds": [
              "db"
            ],
            "action": "move"
          }
        ],
        "additions": [
          {
            "entityId": "cache",
            "elementIds": [
              "cache"
            ],
            "action": "add",
            "enter": "zoom_in"
          }
        ],
        "connections": [
          {
            "entityId": "app",
            "elementIds": [
              "app_1",
              "app",
              "app_3"
            ],
            "action": "connect",
            "connectionId": "c_app_cache_lookup"
          },
          {
            "entityId": "cache",
            "elementIds": [
              "cache"
            ],
            "action": "connect",
            "connectionId": "c_app_cache_lookup"
          }
        ],
        "interactions": [
          {
            "entityId": "app",
            "elementIds": [
              "app_1",
              "app",
              "app_3"
            ],
            "action": "interact",
            "interactionId": "i_c_app_db_req_fwd",
            "cleanup": false
          },
          {
            "entityId": "cache",
            "elementIds": [
              "cache"
            ],
            "action": "interact",
            "interactionId": "i_c_app_cache_lookup_fwd"
          },
          {
            "entityId": "db",
            "elementIds": [
              "db"
            ],
            "action": "interact",
            "interactionId": "i_c_app_db_req_fwd"
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
            "entityId": "lb",
            "action": "move",
            "delay": 0.6560000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "app",
            "action": "move",
            "delay": 0.7120000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "db",
            "action": "move",
            "delay": 0.768,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "cache",
            "action": "add",
            "delay": 0.37399999999999994,
            "duration": 0.62,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_app_cache_lookup",
            "delay": 0.504,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": {
        "targetId": "cache",
        "targetElementId": "cache",
        "zoom": 1.04,
        "duration": 0.55,
        "easing": "cubic-bezier(0.2,0,0,1)",
        "motionType": "focus_primary"
      },
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "cache",
            "type": "cache",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Cache",
            "layout": {
              "x": 50,
              "y": 57
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "users",
            "from": {
              "x": 50,
              "y": 16.2
            },
            "to": {
              "x": 50,
              "y": 12
            }
          },
          {
            "id": "lb",
            "from": {
              "x": 50,
              "y": 33.4
            },
            "to": {
              "x": 50,
              "y": 27
            }
          },
          {
            "id": "app",
            "from": {
              "x": 50,
              "y": 50.599999999999994
            },
            "to": {
              "x": 50,
              "y": 42
            }
          },
          {
            "id": "db",
            "from": {
              "x": 50,
              "y": 67.8
            },
            "to": {
              "x": 50,
              "y": 72
            }
          }
        ],
        "updatedEntities": [
          {
            "id": "lb",
            "changes": {
              "status": {
                "from": "active",
                "to": "normal"
              }
            }
          },
          {
            "id": "app",
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
            "id": "c_app_cache_lookup",
            "from": "app",
            "to": "cache",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [],
        "addedInteractions": [
          {
            "id": "i_c_app_cache_lookup_fwd",
            "from": "app",
            "to": "cache",
            "type": "ping",
            "intensity": "high"
          }
        ],
        "removedInteractions": [],
        "interactionIntensityChanged": [
          {
            "id": "i_c_app_db_req_fwd",
            "from": "medium",
            "to": "low"
          }
        ],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "app",
            "zoom": 1.08
          },
          "to": {
            "mode": "focus",
            "target": "cache",
            "zoom": 1.04
          }
        }
      }
    },
    {
      "id": "scene_06",
      "start": 30,
      "end": 36,
      "narration": "A CDN serves many requests directly, and the remaining traffic goes from Users to the Load Balancer and then to the Servers.",
      "camera": "focus",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "position": {
            "x": 50,
            "y": 12
          },
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 12.168000000000001,
            "textColor": "#E8F6FF",
            "fontSize": 20.16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "cdn",
          "type": "cdn",
          "sourceEntityId": "cdn",
          "label": "CDN",
          "position": {
            "x": 50,
            "y": 24
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#34D399",
            "glow": true,
            "glowColor": "#34D399",
            "glowBlur": 12.168000000000001,
            "textColor": "#E8F6FF",
            "fontSize": 20.16,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "lb",
          "type": "load_balancer",
          "sourceEntityId": "lb",
          "label": "Load Balancer",
          "position": {
            "x": 50,
            "y": 36
          },
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 12.168000000000001,
            "textColor": "#E8F6FF",
            "fontSize": 20.16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_1",
          "type": "server",
          "sourceEntityId": "app",
          "position": {
            "x": 33.56666666666667,
            "y": 48
          },
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 12.168000000000001,
            "textColor": "#E8F6FF",
            "fontSize": 20.16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app",
          "type": "server",
          "sourceEntityId": "app",
          "label": "Server",
          "position": {
            "x": 50,
            "y": 48
          },
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 12.168000000000001,
            "textColor": "#E8F6FF",
            "fontSize": 20.16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_3",
          "type": "server",
          "sourceEntityId": "app",
          "position": {
            "x": 66.43333333333334,
            "y": 48
          },
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 12.168000000000001,
            "textColor": "#E8F6FF",
            "fontSize": 20.16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "cache",
          "type": "cache",
          "sourceEntityId": "cache",
          "label": "Cache",
          "position": {
            "x": 50,
            "y": 60
          },
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 12.168000000000001,
            "textColor": "#E8F6FF",
            "fontSize": 20.16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "db",
          "type": "database",
          "sourceEntityId": "db",
          "label": "Database",
          "position": {
            "x": 50,
            "y": 72
          },
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 12.168000000000001,
            "textColor": "#E8F6FF",
            "fontSize": 20.16,
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
          "status": "normal",
          "label": "Users",
          "layout": {
            "x": 50,
            "y": 12
          }
        },
        {
          "id": "cdn",
          "type": "cdn",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "CDN",
          "layout": {
            "x": 50,
            "y": 24
          }
        },
        {
          "id": "lb",
          "type": "load_balancer",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Load Balancer",
          "layout": {
            "x": 50,
            "y": 36
          }
        },
        {
          "id": "app",
          "type": "server",
          "count": 3,
          "importance": "secondary",
          "status": "normal",
          "label": "Server",
          "layout": {
            "x": 50,
            "y": 48
          }
        },
        {
          "id": "cache",
          "type": "cache",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Cache",
          "layout": {
            "x": 50,
            "y": 60
          }
        },
        {
          "id": "db",
          "type": "database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Database",
          "layout": {
            "x": 50,
            "y": 72
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_cdn_fetch",
          "from": "users",
          "to": "cdn",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_users_lb_req",
          "from": "users",
          "to": "lb",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_lb_app_req",
          "from": "lb",
          "to": "app",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_app_cache_lookup",
          "from": "app",
          "to": "cache",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_app_db_req",
          "from": "app",
          "to": "db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_cdn_fetch_fwd",
          "from": "users",
          "to": "cdn",
          "type": "flow",
          "intensity": "high"
        },
        {
          "id": "i_c_users_lb_req_fwd",
          "from": "users",
          "to": "lb",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_lb_app_req_fwd",
          "from": "lb",
          "to": "app",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_app_cache_lookup_fwd",
          "from": "app",
          "to": "cache",
          "type": "ping",
          "intensity": "medium"
        },
        {
          "id": "i_c_app_db_req_fwd",
          "from": "app",
          "to": "db",
          "type": "flow",
          "intensity": "low"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "cdn",
        "zoom": 1
      },
      "directives": {
        "camera": {
          "mode": "follow_action",
          "zoom": "tight",
          "active_zone": "upper_third",
          "reserve_bottom_percent": 25
        },
        "visual": {
          "theme": "neon",
          "background_texture": "grid",
          "glow_strength": "strong"
        },
        "motion": {
          "entry_style": "elastic_pop",
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
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Users",
            "layout": {
              "x": 50,
              "y": 12
            }
          },
          {
            "id": "cdn",
            "type": "cdn",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "CDN",
            "layout": {
              "x": 50,
              "y": 24
            }
          },
          {
            "id": "lb",
            "type": "load_balancer",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Load Balancer",
            "layout": {
              "x": 50,
              "y": 36
            }
          },
          {
            "id": "app",
            "type": "server",
            "count": 3,
            "importance": "secondary",
            "status": "normal",
            "label": "Server",
            "layout": {
              "x": 50,
              "y": 48
            }
          },
          {
            "id": "cache",
            "type": "cache",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Cache",
            "layout": {
              "x": 50,
              "y": 60
            }
          },
          {
            "id": "db",
            "type": "database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Database",
            "layout": {
              "x": 50,
              "y": 72
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_cdn_fetch",
            "from": "users",
            "to": "cdn",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_users_lb_req",
            "from": "users",
            "to": "lb",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_lb_app_req",
            "from": "lb",
            "to": "app",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_app_cache_lookup",
            "from": "app",
            "to": "cache",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_app_db_req",
            "from": "app",
            "to": "db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_cdn_fetch_fwd",
            "from": "users",
            "to": "cdn",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_users_lb_req_fwd",
            "from": "users",
            "to": "lb",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_lb_app_req_fwd",
            "from": "lb",
            "to": "app",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_app_cache_lookup_fwd",
            "from": "app",
            "to": "cache",
            "type": "ping",
            "intensity": "medium"
          },
          {
            "id": "i_c_app_db_req_fwd",
            "from": "app",
            "to": "db",
            "type": "flow",
            "intensity": "low"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "cdn",
          "zoom": 1
        }
      },
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "cdn"
          },
          {
            "type": "entity_moved",
            "entityId": "lb",
            "from": {
              "x": 50,
              "y": 27
            },
            "to": {
              "x": 50,
              "y": 36
            }
          },
          {
            "type": "entity_moved",
            "entityId": "app",
            "from": {
              "x": 50,
              "y": 42
            },
            "to": {
              "x": 50,
              "y": 48
            }
          },
          {
            "type": "entity_moved",
            "entityId": "cache",
            "from": {
              "x": 50,
              "y": 57
            },
            "to": {
              "x": 50,
              "y": 60
            }
          },
          {
            "type": "entity_status_changed",
            "entityId": "cache",
            "from": "active",
            "to": "normal"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "cache",
            "from": "primary",
            "to": "secondary"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_users_cdn_fetch"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_users_cdn_fetch_fwd"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_users_lb_req_fwd",
            "from": "high",
            "to": "medium"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_lb_app_req_fwd",
            "from": "high",
            "to": "medium"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_app_cache_lookup_fwd",
            "from": "high",
            "to": "medium"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "cache",
              "zoom": 1.04
            },
            "to": {
              "mode": "focus",
              "target": "cdn",
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
            "entityId": "lb",
            "elementIds": [
              "lb"
            ],
            "action": "move"
          },
          {
            "entityId": "app",
            "elementIds": [
              "app_1",
              "app",
              "app_3"
            ],
            "action": "move"
          },
          {
            "entityId": "cache",
            "elementIds": [
              "cache"
            ],
            "action": "move"
          }
        ],
        "additions": [
          {
            "entityId": "cdn",
            "elementIds": [
              "cdn"
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
            "connectionId": "c_users_cdn_fetch"
          },
          {
            "entityId": "cdn",
            "elementIds": [
              "cdn"
            ],
            "action": "connect",
            "connectionId": "c_users_cdn_fetch"
          }
        ],
        "interactions": [
          {
            "entityId": "users",
            "elementIds": [
              "users"
            ],
            "action": "interact",
            "interactionId": "i_c_users_lb_req_fwd",
            "cleanup": false
          },
          {
            "entityId": "cdn",
            "elementIds": [
              "cdn"
            ],
            "action": "interact",
            "interactionId": "i_c_users_cdn_fetch_fwd"
          },
          {
            "entityId": "lb",
            "elementIds": [
              "lb"
            ],
            "action": "interact",
            "interactionId": "i_c_lb_app_req_fwd",
            "cleanup": false
          },
          {
            "entityId": "app",
            "elementIds": [
              "app_1",
              "app",
              "app_3"
            ],
            "action": "interact",
            "interactionId": "i_c_app_cache_lookup_fwd",
            "cleanup": false
          },
          {
            "entityId": "cache",
            "elementIds": [
              "cache"
            ],
            "action": "interact",
            "interactionId": "i_c_app_cache_lookup_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "lb",
            "action": "move",
            "delay": 0.6000000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "app",
            "action": "move",
            "delay": 0.6560000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "cache",
            "action": "move",
            "delay": 0.7120000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "cdn",
            "action": "add",
            "delay": 0.37399999999999994,
            "duration": 0.62,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_users_cdn_fetch",
            "delay": 0.504,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": {
        "targetId": "cdn",
        "targetElementId": "cdn",
        "zoom": 1,
        "duration": 0.55,
        "easing": "cubic-bezier(0.2,0,0,1)",
        "motionType": "focus_primary"
      },
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "cdn",
            "type": "cdn",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "CDN",
            "layout": {
              "x": 50,
              "y": 24
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "lb",
            "from": {
              "x": 50,
              "y": 27
            },
            "to": {
              "x": 50,
              "y": 36
            }
          },
          {
            "id": "app",
            "from": {
              "x": 50,
              "y": 42
            },
            "to": {
              "x": 50,
              "y": 48
            }
          },
          {
            "id": "cache",
            "from": {
              "x": 50,
              "y": 57
            },
            "to": {
              "x": 50,
              "y": 60
            }
          }
        ],
        "updatedEntities": [
          {
            "id": "cache",
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
            "id": "c_users_cdn_fetch",
            "from": "users",
            "to": "cdn",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [],
        "addedInteractions": [
          {
            "id": "i_c_users_cdn_fetch_fwd",
            "from": "users",
            "to": "cdn",
            "type": "flow",
            "intensity": "high"
          }
        ],
        "removedInteractions": [],
        "interactionIntensityChanged": [
          {
            "id": "i_c_users_lb_req_fwd",
            "from": "high",
            "to": "medium"
          },
          {
            "id": "i_c_lb_app_req_fwd",
            "from": "high",
            "to": "medium"
          },
          {
            "id": "i_c_app_cache_lookup_fwd",
            "from": "high",
            "to": "medium"
          }
        ],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "cache",
            "zoom": 1.04
          },
          "to": {
            "mode": "focus",
            "target": "cdn",
            "zoom": 1
          }
        }
      }
    },
    {
      "id": "scene_07",
      "start": 36,
      "end": 42,
      "narration": "Servers handle user requests quickly and push slow tasks into a Queue instead of doing them inline.",
      "camera": "focus",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "position": {
            "x": 50,
            "y": 12
          },
          "visualStyle": {
            "size": 60.3,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.455605831561735,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 11.323,
            "textColor": "#E8F6FF",
            "fontSize": 18.759999999999998,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "cdn",
          "type": "cdn",
          "sourceEntityId": "cdn",
          "label": "CDN",
          "position": {
            "x": 50,
            "y": 22
          },
          "visualStyle": {
            "size": 60.3,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.455605831561735,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 11.323,
            "textColor": "#E8F6FF",
            "fontSize": 18.759999999999998,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "lb",
          "type": "load_balancer",
          "sourceEntityId": "lb",
          "label": "Load Balancer",
          "position": {
            "x": 50,
            "y": 32
          },
          "visualStyle": {
            "size": 60.3,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.455605831561735,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 11.323,
            "textColor": "#E8F6FF",
            "fontSize": 18.759999999999998,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_1",
          "type": "server",
          "sourceEntityId": "app",
          "position": {
            "x": 34.70787037037037,
            "y": 42
          },
          "visualStyle": {
            "size": 60.3,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.455605831561735,
            "strokeColor": "#34D399",
            "glow": true,
            "glowColor": "#34D399",
            "glowBlur": 11.323,
            "textColor": "#E8F6FF",
            "fontSize": 18.759999999999998,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "app",
          "type": "server",
          "sourceEntityId": "app",
          "label": "Server",
          "position": {
            "x": 50,
            "y": 42
          },
          "visualStyle": {
            "size": 60.3,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.455605831561735,
            "strokeColor": "#34D399",
            "glow": true,
            "glowColor": "#34D399",
            "glowBlur": 11.323,
            "textColor": "#E8F6FF",
            "fontSize": 18.759999999999998,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "app_3",
          "type": "server",
          "sourceEntityId": "app",
          "position": {
            "x": 65.29212962962963,
            "y": 42
          },
          "visualStyle": {
            "size": 60.3,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.455605831561735,
            "strokeColor": "#34D399",
            "glow": true,
            "glowColor": "#34D399",
            "glowBlur": 11.323,
            "textColor": "#E8F6FF",
            "fontSize": 18.759999999999998,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "queue",
          "type": "queue",
          "sourceEntityId": "queue",
          "label": "Queue",
          "position": {
            "x": 50,
            "y": 52
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 60.3,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.455605831561735,
            "strokeColor": "#34D399",
            "glow": true,
            "glowColor": "#34D399",
            "glowBlur": 11.323,
            "textColor": "#E8F6FF",
            "fontSize": 18.759999999999998,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "cache",
          "type": "cache",
          "sourceEntityId": "cache",
          "label": "Cache",
          "position": {
            "x": 50,
            "y": 62
          },
          "visualStyle": {
            "size": 60.3,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.455605831561735,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 11.323,
            "textColor": "#E8F6FF",
            "fontSize": 18.759999999999998,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "db",
          "type": "database",
          "sourceEntityId": "db",
          "label": "Database",
          "position": {
            "x": 50,
            "y": 72
          },
          "visualStyle": {
            "size": 60.3,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.455605831561735,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 11.323,
            "textColor": "#E8F6FF",
            "fontSize": 18.759999999999998,
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
          "status": "normal",
          "label": "Users",
          "layout": {
            "x": 50,
            "y": 12
          }
        },
        {
          "id": "cdn",
          "type": "cdn",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "CDN",
          "layout": {
            "x": 50,
            "y": 22
          }
        },
        {
          "id": "lb",
          "type": "load_balancer",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Load Balancer",
          "layout": {
            "x": 50,
            "y": 32
          }
        },
        {
          "id": "app",
          "type": "server",
          "count": 3,
          "importance": "secondary",
          "status": "active",
          "label": "Server",
          "layout": {
            "x": 50,
            "y": 42
          }
        },
        {
          "id": "queue",
          "type": "queue",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Queue",
          "layout": {
            "x": 50,
            "y": 52
          }
        },
        {
          "id": "cache",
          "type": "cache",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Cache",
          "layout": {
            "x": 50,
            "y": 62
          }
        },
        {
          "id": "db",
          "type": "database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Database",
          "layout": {
            "x": 50,
            "y": 72
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_cdn_fetch",
          "from": "users",
          "to": "cdn",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_users_lb_req",
          "from": "users",
          "to": "lb",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_lb_app_req",
          "from": "lb",
          "to": "app",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_app_queue_dispatch",
          "from": "app",
          "to": "queue",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_app_cache_lookup",
          "from": "app",
          "to": "cache",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_app_db_req",
          "from": "app",
          "to": "db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_cdn_fetch_fwd",
          "from": "users",
          "to": "cdn",
          "type": "flow",
          "intensity": "high"
        },
        {
          "id": "i_c_users_lb_req_fwd",
          "from": "users",
          "to": "lb",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_lb_app_req_fwd",
          "from": "lb",
          "to": "app",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_app_queue_dispatch_fwd",
          "from": "app",
          "to": "queue",
          "type": "broadcast",
          "intensity": "medium"
        },
        {
          "id": "i_c_app_cache_lookup_fwd",
          "from": "app",
          "to": "cache",
          "type": "ping",
          "intensity": "medium"
        },
        {
          "id": "i_c_app_db_req_fwd",
          "from": "app",
          "to": "db",
          "type": "flow",
          "intensity": "low"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "queue",
        "zoom": 1
      },
      "directives": {
        "camera": {
          "mode": "follow_action",
          "zoom": "tight",
          "active_zone": "upper_third",
          "reserve_bottom_percent": 25
        },
        "visual": {
          "theme": "neon",
          "background_texture": "grid",
          "glow_strength": "strong"
        },
        "motion": {
          "entry_style": "elastic_pop",
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
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Users",
            "layout": {
              "x": 50,
              "y": 12
            }
          },
          {
            "id": "cdn",
            "type": "cdn",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "CDN",
            "layout": {
              "x": 50,
              "y": 22
            }
          },
          {
            "id": "lb",
            "type": "load_balancer",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Load Balancer",
            "layout": {
              "x": 50,
              "y": 32
            }
          },
          {
            "id": "app",
            "type": "server",
            "count": 3,
            "importance": "secondary",
            "status": "active",
            "label": "Server",
            "layout": {
              "x": 50,
              "y": 42
            }
          },
          {
            "id": "queue",
            "type": "queue",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Queue",
            "layout": {
              "x": 50,
              "y": 52
            }
          },
          {
            "id": "cache",
            "type": "cache",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Cache",
            "layout": {
              "x": 50,
              "y": 62
            }
          },
          {
            "id": "db",
            "type": "database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Database",
            "layout": {
              "x": 50,
              "y": 72
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_cdn_fetch",
            "from": "users",
            "to": "cdn",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_users_lb_req",
            "from": "users",
            "to": "lb",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_lb_app_req",
            "from": "lb",
            "to": "app",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_app_queue_dispatch",
            "from": "app",
            "to": "queue",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_app_cache_lookup",
            "from": "app",
            "to": "cache",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_app_db_req",
            "from": "app",
            "to": "db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_cdn_fetch_fwd",
            "from": "users",
            "to": "cdn",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_users_lb_req_fwd",
            "from": "users",
            "to": "lb",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_lb_app_req_fwd",
            "from": "lb",
            "to": "app",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_app_queue_dispatch_fwd",
            "from": "app",
            "to": "queue",
            "type": "broadcast",
            "intensity": "medium"
          },
          {
            "id": "i_c_app_cache_lookup_fwd",
            "from": "app",
            "to": "cache",
            "type": "ping",
            "intensity": "medium"
          },
          {
            "id": "i_c_app_db_req_fwd",
            "from": "app",
            "to": "db",
            "type": "flow",
            "intensity": "low"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "queue",
          "zoom": 1
        }
      },
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "queue"
          },
          {
            "type": "entity_moved",
            "entityId": "cdn",
            "from": {
              "x": 50,
              "y": 24
            },
            "to": {
              "x": 50,
              "y": 22
            }
          },
          {
            "type": "entity_moved",
            "entityId": "lb",
            "from": {
              "x": 50,
              "y": 36
            },
            "to": {
              "x": 50,
              "y": 32
            }
          },
          {
            "type": "entity_moved",
            "entityId": "app",
            "from": {
              "x": 50,
              "y": 48
            },
            "to": {
              "x": 50,
              "y": 42
            }
          },
          {
            "type": "entity_moved",
            "entityId": "cache",
            "from": {
              "x": 50,
              "y": 60
            },
            "to": {
              "x": 50,
              "y": 62
            }
          },
          {
            "type": "entity_status_changed",
            "entityId": "cdn",
            "from": "active",
            "to": "normal"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "cdn",
            "from": "primary",
            "to": "secondary"
          },
          {
            "type": "entity_status_changed",
            "entityId": "app",
            "from": "normal",
            "to": "active"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_app_queue_dispatch"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_app_queue_dispatch_fwd"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "cdn",
              "zoom": 1
            },
            "to": {
              "mode": "focus",
              "target": "queue",
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
            "entityId": "cdn",
            "elementIds": [
              "cdn"
            ],
            "action": "move"
          },
          {
            "entityId": "lb",
            "elementIds": [
              "lb"
            ],
            "action": "move"
          },
          {
            "entityId": "app",
            "elementIds": [
              "app_1",
              "app",
              "app_3"
            ],
            "action": "move"
          },
          {
            "entityId": "cache",
            "elementIds": [
              "cache"
            ],
            "action": "move"
          }
        ],
        "additions": [
          {
            "entityId": "queue",
            "elementIds": [
              "queue"
            ],
            "action": "add",
            "enter": "zoom_in"
          }
        ],
        "connections": [
          {
            "entityId": "app",
            "elementIds": [
              "app_1",
              "app",
              "app_3"
            ],
            "action": "connect",
            "connectionId": "c_app_queue_dispatch"
          },
          {
            "entityId": "queue",
            "elementIds": [
              "queue"
            ],
            "action": "connect",
            "connectionId": "c_app_queue_dispatch"
          }
        ],
        "interactions": [
          {
            "entityId": "app",
            "elementIds": [
              "app_1",
              "app",
              "app_3"
            ],
            "action": "interact",
            "interactionId": "i_c_app_queue_dispatch_fwd"
          },
          {
            "entityId": "queue",
            "elementIds": [
              "queue"
            ],
            "action": "interact",
            "interactionId": "i_c_app_queue_dispatch_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "cdn",
            "action": "move",
            "delay": 0.6000000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "lb",
            "action": "move",
            "delay": 0.6560000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "app",
            "action": "move",
            "delay": 0.7120000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "cache",
            "action": "move",
            "delay": 0.768,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "queue",
            "action": "add",
            "delay": 0.37399999999999994,
            "duration": 0.62,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_app_queue_dispatch",
            "delay": 0.504,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": {
        "targetId": "queue",
        "targetElementId": "queue",
        "zoom": 1,
        "duration": 0.55,
        "easing": "cubic-bezier(0.2,0,0,1)",
        "motionType": "focus_primary"
      },
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "queue",
            "type": "queue",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Queue",
            "layout": {
              "x": 50,
              "y": 52
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "cdn",
            "from": {
              "x": 50,
              "y": 24
            },
            "to": {
              "x": 50,
              "y": 22
            }
          },
          {
            "id": "lb",
            "from": {
              "x": 50,
              "y": 36
            },
            "to": {
              "x": 50,
              "y": 32
            }
          },
          {
            "id": "app",
            "from": {
              "x": 50,
              "y": 48
            },
            "to": {
              "x": 50,
              "y": 42
            }
          },
          {
            "id": "cache",
            "from": {
              "x": 50,
              "y": 60
            },
            "to": {
              "x": 50,
              "y": 62
            }
          }
        ],
        "updatedEntities": [
          {
            "id": "cdn",
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
          },
          {
            "id": "app",
            "changes": {
              "status": {
                "from": "normal",
                "to": "active"
              }
            }
          }
        ],
        "addedConnections": [
          {
            "id": "c_app_queue_dispatch",
            "from": "app",
            "to": "queue",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [],
        "addedInteractions": [
          {
            "id": "i_c_app_queue_dispatch_fwd",
            "from": "app",
            "to": "queue",
            "type": "broadcast",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "cdn",
            "zoom": 1
          },
          "to": {
            "mode": "focus",
            "target": "queue",
            "zoom": 1
          }
        }
      }
    },
    {
      "id": "scene_08",
      "start": 42,
      "end": 48,
      "narration": "Workers pull jobs from the Queue and update the Database while Servers stay focused on fast responses.",
      "camera": "focus",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "position": {
            "x": 50,
            "y": 12
          },
          "visualStyle": {
            "size": 55.8,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.3622023622035435,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 10.478000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 17.36,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "cdn",
          "type": "cdn",
          "sourceEntityId": "cdn",
          "label": "CDN",
          "position": {
            "x": 50,
            "y": 20.57142857142857
          },
          "visualStyle": {
            "size": 55.8,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.3622023622035435,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 10.478000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 17.36,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "lb",
          "type": "load_balancer",
          "sourceEntityId": "lb",
          "label": "Load Balancer",
          "position": {
            "x": 50,
            "y": 29.142857142857142
          },
          "visualStyle": {
            "size": 55.8,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.3622023622035435,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 10.478000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 17.36,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_1",
          "type": "server",
          "sourceEntityId": "app",
          "position": {
            "x": 35.849074074074075,
            "y": 37.714285714285715
          },
          "visualStyle": {
            "size": 55.8,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.3622023622035435,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 10.478000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 17.36,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app",
          "type": "server",
          "sourceEntityId": "app",
          "label": "Server",
          "position": {
            "x": 50,
            "y": 37.714285714285715
          },
          "visualStyle": {
            "size": 55.8,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.3622023622035435,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 10.478000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 17.36,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_3",
          "type": "server",
          "sourceEntityId": "app",
          "position": {
            "x": 64.15092592592592,
            "y": 37.714285714285715
          },
          "visualStyle": {
            "size": 55.8,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.3622023622035435,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 10.478000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 17.36,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "queue",
          "type": "queue",
          "sourceEntityId": "queue",
          "label": "Queue",
          "position": {
            "x": 50,
            "y": 46.285714285714285
          },
          "visualStyle": {
            "size": 55.8,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.3622023622035435,
            "strokeColor": "#34D399",
            "glow": true,
            "glowColor": "#34D399",
            "glowBlur": 10.478000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 17.36,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "sourceEntityId": "worker",
          "label": "Worker",
          "position": {
            "x": 50,
            "y": 54.857142857142854
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 55.8,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.3622023622035435,
            "strokeColor": "#34D399",
            "glow": true,
            "glowColor": "#34D399",
            "glowBlur": 10.478000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 17.36,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "cache",
          "type": "cache",
          "sourceEntityId": "cache",
          "label": "Cache",
          "position": {
            "x": 50,
            "y": 63.42857142857143
          },
          "visualStyle": {
            "size": 55.8,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.3622023622035435,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 10.478000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 17.36,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "db",
          "type": "database",
          "sourceEntityId": "db",
          "label": "Database",
          "position": {
            "x": 50,
            "y": 72
          },
          "visualStyle": {
            "size": 55.8,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.3622023622035435,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 10.478000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 17.36,
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
          "status": "normal",
          "label": "Users",
          "layout": {
            "x": 50,
            "y": 12
          }
        },
        {
          "id": "cdn",
          "type": "cdn",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "CDN",
          "layout": {
            "x": 50,
            "y": 20.57142857142857
          }
        },
        {
          "id": "lb",
          "type": "load_balancer",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Load Balancer",
          "layout": {
            "x": 50,
            "y": 29.142857142857142
          }
        },
        {
          "id": "app",
          "type": "server",
          "count": 3,
          "importance": "secondary",
          "status": "normal",
          "label": "Server",
          "layout": {
            "x": 50,
            "y": 37.714285714285715
          }
        },
        {
          "id": "queue",
          "type": "queue",
          "count": 1,
          "importance": "secondary",
          "status": "active",
          "label": "Queue",
          "layout": {
            "x": 50,
            "y": 46.285714285714285
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "count": 1,
          "importance": "primary",
          "status": "active",
          "label": "Worker",
          "layout": {
            "x": 50,
            "y": 54.857142857142854
          }
        },
        {
          "id": "cache",
          "type": "cache",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Cache",
          "layout": {
            "x": 50,
            "y": 63.42857142857143
          }
        },
        {
          "id": "db",
          "type": "database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Database",
          "layout": {
            "x": 50,
            "y": 72
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_cdn_fetch",
          "from": "users",
          "to": "cdn",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_users_lb_req",
          "from": "users",
          "to": "lb",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_lb_app_req",
          "from": "lb",
          "to": "app",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_app_queue_dispatch",
          "from": "app",
          "to": "queue",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_queue_worker_dispatch",
          "from": "queue",
          "to": "worker",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_worker_db_commit",
          "from": "worker",
          "to": "db",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_app_cache_lookup",
          "from": "app",
          "to": "cache",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_cdn_fetch_fwd",
          "from": "users",
          "to": "cdn",
          "type": "flow",
          "intensity": "high"
        },
        {
          "id": "i_c_users_lb_req_fwd",
          "from": "users",
          "to": "lb",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_lb_app_req_fwd",
          "from": "lb",
          "to": "app",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_app_queue_dispatch_fwd",
          "from": "app",
          "to": "queue",
          "type": "broadcast",
          "intensity": "medium"
        },
        {
          "id": "i_c_queue_worker_dispatch_fwd",
          "from": "queue",
          "to": "worker",
          "type": "broadcast",
          "intensity": "medium"
        },
        {
          "id": "i_c_worker_db_commit_fwd",
          "from": "worker",
          "to": "db",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_app_cache_lookup_fwd",
          "from": "app",
          "to": "cache",
          "type": "ping",
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
          "zoom": "tight",
          "active_zone": "upper_third",
          "reserve_bottom_percent": 25
        },
        "visual": {
          "theme": "neon",
          "background_texture": "grid",
          "glow_strength": "strong"
        },
        "motion": {
          "entry_style": "elastic_pop",
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
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Users",
            "layout": {
              "x": 50,
              "y": 12
            }
          },
          {
            "id": "cdn",
            "type": "cdn",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "CDN",
            "layout": {
              "x": 50,
              "y": 20.57142857142857
            }
          },
          {
            "id": "lb",
            "type": "load_balancer",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Load Balancer",
            "layout": {
              "x": 50,
              "y": 29.142857142857142
            }
          },
          {
            "id": "app",
            "type": "server",
            "count": 3,
            "importance": "secondary",
            "status": "normal",
            "label": "Server",
            "layout": {
              "x": 50,
              "y": 37.714285714285715
            }
          },
          {
            "id": "queue",
            "type": "queue",
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Queue",
            "layout": {
              "x": 50,
              "y": 46.285714285714285
            }
          },
          {
            "id": "worker",
            "type": "worker",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Worker",
            "layout": {
              "x": 50,
              "y": 54.857142857142854
            }
          },
          {
            "id": "cache",
            "type": "cache",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Cache",
            "layout": {
              "x": 50,
              "y": 63.42857142857143
            }
          },
          {
            "id": "db",
            "type": "database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Database",
            "layout": {
              "x": 50,
              "y": 72
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_cdn_fetch",
            "from": "users",
            "to": "cdn",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_users_lb_req",
            "from": "users",
            "to": "lb",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_lb_app_req",
            "from": "lb",
            "to": "app",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_app_queue_dispatch",
            "from": "app",
            "to": "queue",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_queue_worker_dispatch",
            "from": "queue",
            "to": "worker",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_worker_db_commit",
            "from": "worker",
            "to": "db",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_app_cache_lookup",
            "from": "app",
            "to": "cache",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_cdn_fetch_fwd",
            "from": "users",
            "to": "cdn",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_users_lb_req_fwd",
            "from": "users",
            "to": "lb",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_lb_app_req_fwd",
            "from": "lb",
            "to": "app",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_app_queue_dispatch_fwd",
            "from": "app",
            "to": "queue",
            "type": "broadcast",
            "intensity": "medium"
          },
          {
            "id": "i_c_queue_worker_dispatch_fwd",
            "from": "queue",
            "to": "worker",
            "type": "broadcast",
            "intensity": "medium"
          },
          {
            "id": "i_c_worker_db_commit_fwd",
            "from": "worker",
            "to": "db",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_app_cache_lookup_fwd",
            "from": "app",
            "to": "cache",
            "type": "ping",
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
            "entityId": "worker"
          },
          {
            "type": "entity_moved",
            "entityId": "cdn",
            "from": {
              "x": 50,
              "y": 22
            },
            "to": {
              "x": 50,
              "y": 20.57142857142857
            }
          },
          {
            "type": "entity_moved",
            "entityId": "lb",
            "from": {
              "x": 50,
              "y": 32
            },
            "to": {
              "x": 50,
              "y": 29.142857142857142
            }
          },
          {
            "type": "entity_moved",
            "entityId": "app",
            "from": {
              "x": 50,
              "y": 42
            },
            "to": {
              "x": 50,
              "y": 37.714285714285715
            }
          },
          {
            "type": "entity_moved",
            "entityId": "queue",
            "from": {
              "x": 50,
              "y": 52
            },
            "to": {
              "x": 50,
              "y": 46.285714285714285
            }
          },
          {
            "type": "entity_moved",
            "entityId": "cache",
            "from": {
              "x": 50,
              "y": 62
            },
            "to": {
              "x": 50,
              "y": 63.42857142857143
            }
          },
          {
            "type": "entity_status_changed",
            "entityId": "app",
            "from": "active",
            "to": "normal"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "queue",
            "from": "primary",
            "to": "secondary"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_queue_worker_dispatch"
          },
          {
            "type": "connection_added",
            "connectionId": "c_worker_db_commit"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_app_db_req"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_queue_worker_dispatch_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_worker_db_commit_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_app_db_req_fwd"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "queue",
              "zoom": 1
            },
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
        "moves": [
          {
            "entityId": "cdn",
            "elementIds": [
              "cdn"
            ],
            "action": "move"
          },
          {
            "entityId": "lb",
            "elementIds": [
              "lb"
            ],
            "action": "move"
          },
          {
            "entityId": "app",
            "elementIds": [
              "app_1",
              "app",
              "app_3"
            ],
            "action": "move"
          },
          {
            "entityId": "queue",
            "elementIds": [
              "queue"
            ],
            "action": "move"
          },
          {
            "entityId": "cache",
            "elementIds": [
              "cache"
            ],
            "action": "move"
          }
        ],
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
        "connections": [
          {
            "entityId": "queue",
            "elementIds": [
              "queue"
            ],
            "action": "connect",
            "connectionId": "c_queue_worker_dispatch"
          },
          {
            "entityId": "worker",
            "elementIds": [
              "worker"
            ],
            "action": "connect",
            "connectionId": "c_worker_db_commit",
            "cleanup": false
          },
          {
            "entityId": "db",
            "elementIds": [
              "db"
            ],
            "action": "connect",
            "connectionId": "c_app_db_req",
            "cleanup": false
          },
          {
            "entityId": "app",
            "elementIds": [
              "app_1",
              "app",
              "app_3"
            ],
            "action": "connect",
            "connectionId": "c_app_db_req"
          }
        ],
        "interactions": [
          {
            "entityId": "queue",
            "elementIds": [
              "queue"
            ],
            "action": "interact",
            "interactionId": "i_c_queue_worker_dispatch_fwd"
          },
          {
            "entityId": "worker",
            "elementIds": [
              "worker"
            ],
            "action": "interact",
            "interactionId": "i_c_worker_db_commit_fwd",
            "cleanup": false
          },
          {
            "entityId": "db",
            "elementIds": [
              "db"
            ],
            "action": "interact",
            "interactionId": "i_c_app_db_req_fwd",
            "cleanup": false
          },
          {
            "entityId": "app",
            "elementIds": [
              "app_1",
              "app",
              "app_3"
            ],
            "action": "interact",
            "interactionId": "i_c_app_db_req_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "cdn",
            "action": "move",
            "delay": 0.6000000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "lb",
            "action": "move",
            "delay": 0.6560000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "app",
            "action": "move",
            "delay": 0.7120000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "queue",
            "action": "move",
            "delay": 0.768,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "cache",
            "action": "move",
            "delay": 0.8240000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "worker",
            "action": "add",
            "delay": 0.37399999999999994,
            "duration": 0.62,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_queue_worker_dispatch",
            "delay": 0.504,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "connectionId": "c_worker_db_commit",
            "delay": 0.56,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "connectionId": "c_app_db_req",
            "delay": 0.616,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": {
        "targetId": "worker",
        "targetElementId": "worker",
        "zoom": 1,
        "duration": 0.55,
        "easing": "cubic-bezier(0.2,0,0,1)",
        "motionType": "focus_primary"
      },
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "worker",
            "type": "worker",
            "count": 1,
            "importance": "primary",
            "status": "active",
            "label": "Worker",
            "layout": {
              "x": 50,
              "y": 54.857142857142854
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "cdn",
            "from": {
              "x": 50,
              "y": 22
            },
            "to": {
              "x": 50,
              "y": 20.57142857142857
            }
          },
          {
            "id": "lb",
            "from": {
              "x": 50,
              "y": 32
            },
            "to": {
              "x": 50,
              "y": 29.142857142857142
            }
          },
          {
            "id": "app",
            "from": {
              "x": 50,
              "y": 42
            },
            "to": {
              "x": 50,
              "y": 37.714285714285715
            }
          },
          {
            "id": "queue",
            "from": {
              "x": 50,
              "y": 52
            },
            "to": {
              "x": 50,
              "y": 46.285714285714285
            }
          },
          {
            "id": "cache",
            "from": {
              "x": 50,
              "y": 62
            },
            "to": {
              "x": 50,
              "y": 63.42857142857143
            }
          }
        ],
        "updatedEntities": [
          {
            "id": "app",
            "changes": {
              "status": {
                "from": "active",
                "to": "normal"
              }
            }
          },
          {
            "id": "queue",
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
            "id": "c_queue_worker_dispatch",
            "from": "queue",
            "to": "worker",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_worker_db_commit",
            "from": "worker",
            "to": "db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [
          {
            "id": "c_app_db_req",
            "from": "app",
            "to": "db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "addedInteractions": [
          {
            "id": "i_c_queue_worker_dispatch_fwd",
            "from": "queue",
            "to": "worker",
            "type": "broadcast",
            "intensity": "medium"
          },
          {
            "id": "i_c_worker_db_commit_fwd",
            "from": "worker",
            "to": "db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_app_db_req_fwd",
            "from": "app",
            "to": "db",
            "type": "flow",
            "intensity": "low"
          }
        ],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "queue",
            "zoom": 1
          },
          "to": {
            "mode": "focus",
            "target": "worker",
            "zoom": 1
          }
        }
      }
    },
    {
      "id": "scene_09",
      "start": 48,
      "end": 54,
      "narration": "Servers and Workers write to a primary Database and read from a second Database replica to spread load.",
      "camera": "focus",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "position": {
            "x": 50,
            "y": 12
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 9.633000000000001,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "cdn",
          "type": "cdn",
          "sourceEntityId": "cdn",
          "label": "CDN",
          "position": {
            "x": 50,
            "y": 20.57142857142857
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 9.633000000000001,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "lb",
          "type": "load_balancer",
          "sourceEntityId": "lb",
          "label": "Load Balancer",
          "position": {
            "x": 50,
            "y": 29.142857142857142
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 9.633000000000001,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_1",
          "type": "server",
          "sourceEntityId": "app",
          "position": {
            "x": 36.99027777777778,
            "y": 37.714285714285715
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 9.633000000000001,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app",
          "type": "server",
          "sourceEntityId": "app",
          "label": "Server",
          "position": {
            "x": 50,
            "y": 37.714285714285715
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 9.633000000000001,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_3",
          "type": "server",
          "sourceEntityId": "app",
          "position": {
            "x": 63.00972222222222,
            "y": 37.714285714285715
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 9.633000000000001,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "queue",
          "type": "queue",
          "sourceEntityId": "queue",
          "label": "Queue",
          "position": {
            "x": 50,
            "y": 46.285714285714285
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 9.633000000000001,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "sourceEntityId": "worker",
          "label": "Worker",
          "position": {
            "x": 50,
            "y": 54.857142857142854
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 9.633000000000001,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "cache",
          "type": "cache",
          "sourceEntityId": "cache",
          "label": "Cache",
          "position": {
            "x": 50,
            "y": 63.42857142857143
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 9.633000000000001,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "db",
          "type": "database",
          "sourceEntityId": "db",
          "label": "Database",
          "position": {
            "x": 50,
            "y": 69
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#34D399",
            "glow": true,
            "glowColor": "#34D399",
            "glowBlur": 9.633000000000001,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "db_2",
          "type": "database",
          "sourceEntityId": "db",
          "position": {
            "x": 50,
            "y": 75
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#34D399",
            "glow": true,
            "glowColor": "#34D399",
            "glowBlur": 9.633000000000001,
            "textColor": "#E8F6FF",
            "fontSize": 16,
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
          "layout": {
            "x": 50,
            "y": 12
          }
        },
        {
          "id": "cdn",
          "type": "cdn",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "CDN",
          "layout": {
            "x": 50,
            "y": 20.57142857142857
          }
        },
        {
          "id": "lb",
          "type": "load_balancer",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Load Balancer",
          "layout": {
            "x": 50,
            "y": 29.142857142857142
          }
        },
        {
          "id": "app",
          "type": "server",
          "count": 3,
          "importance": "secondary",
          "status": "normal",
          "label": "Server",
          "layout": {
            "x": 50,
            "y": 37.714285714285715
          }
        },
        {
          "id": "queue",
          "type": "queue",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Queue",
          "layout": {
            "x": 50,
            "y": 46.285714285714285
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Worker",
          "layout": {
            "x": 50,
            "y": 54.857142857142854
          }
        },
        {
          "id": "cache",
          "type": "cache",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Cache",
          "layout": {
            "x": 50,
            "y": 63.42857142857143
          }
        },
        {
          "id": "db",
          "type": "database",
          "count": 2,
          "importance": "primary",
          "status": "active",
          "label": "Database",
          "layout": {
            "x": 50,
            "y": 72
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_cdn_fetch",
          "from": "users",
          "to": "cdn",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_users_lb_req",
          "from": "users",
          "to": "lb",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_lb_app_req",
          "from": "lb",
          "to": "app",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_app_cache_lookup",
          "from": "app",
          "to": "cache",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_app_db_req",
          "from": "app",
          "to": "db",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_queue_worker_dispatch",
          "from": "queue",
          "to": "worker",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_worker_db_commit",
          "from": "worker",
          "to": "db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_cdn_fetch_fwd",
          "from": "users",
          "to": "cdn",
          "type": "flow",
          "intensity": "high"
        },
        {
          "id": "i_c_users_lb_req_fwd",
          "from": "users",
          "to": "lb",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_lb_app_req_fwd",
          "from": "lb",
          "to": "app",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_app_cache_lookup_fwd",
          "from": "app",
          "to": "cache",
          "type": "ping",
          "intensity": "medium"
        },
        {
          "id": "i_c_app_db_req_fwd",
          "from": "app",
          "to": "db",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_queue_worker_dispatch_fwd",
          "from": "queue",
          "to": "worker",
          "type": "broadcast",
          "intensity": "medium"
        },
        {
          "id": "i_c_worker_db_commit_fwd",
          "from": "worker",
          "to": "db",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "db",
        "zoom": 1
      },
      "directives": {
        "camera": {
          "mode": "follow_action",
          "zoom": "tight",
          "active_zone": "upper_third",
          "reserve_bottom_percent": 25
        },
        "visual": {
          "theme": "neon",
          "background_texture": "grid",
          "glow_strength": "strong"
        },
        "motion": {
          "entry_style": "elastic_pop",
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
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Users",
            "layout": {
              "x": 50,
              "y": 12
            }
          },
          {
            "id": "cdn",
            "type": "cdn",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "CDN",
            "layout": {
              "x": 50,
              "y": 20.57142857142857
            }
          },
          {
            "id": "lb",
            "type": "load_balancer",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Load Balancer",
            "layout": {
              "x": 50,
              "y": 29.142857142857142
            }
          },
          {
            "id": "app",
            "type": "server",
            "count": 3,
            "importance": "secondary",
            "status": "normal",
            "label": "Server",
            "layout": {
              "x": 50,
              "y": 37.714285714285715
            }
          },
          {
            "id": "queue",
            "type": "queue",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Queue",
            "layout": {
              "x": 50,
              "y": 46.285714285714285
            }
          },
          {
            "id": "worker",
            "type": "worker",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Worker",
            "layout": {
              "x": 50,
              "y": 54.857142857142854
            }
          },
          {
            "id": "cache",
            "type": "cache",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Cache",
            "layout": {
              "x": 50,
              "y": 63.42857142857143
            }
          },
          {
            "id": "db",
            "type": "database",
            "count": 2,
            "importance": "primary",
            "status": "active",
            "label": "Database",
            "layout": {
              "x": 50,
              "y": 72
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_cdn_fetch",
            "from": "users",
            "to": "cdn",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_users_lb_req",
            "from": "users",
            "to": "lb",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_lb_app_req",
            "from": "lb",
            "to": "app",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_app_cache_lookup",
            "from": "app",
            "to": "cache",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_app_db_req",
            "from": "app",
            "to": "db",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_queue_worker_dispatch",
            "from": "queue",
            "to": "worker",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_worker_db_commit",
            "from": "worker",
            "to": "db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_cdn_fetch_fwd",
            "from": "users",
            "to": "cdn",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_users_lb_req_fwd",
            "from": "users",
            "to": "lb",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_lb_app_req_fwd",
            "from": "lb",
            "to": "app",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_app_cache_lookup_fwd",
            "from": "app",
            "to": "cache",
            "type": "ping",
            "intensity": "medium"
          },
          {
            "id": "i_c_app_db_req_fwd",
            "from": "app",
            "to": "db",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_queue_worker_dispatch_fwd",
            "from": "queue",
            "to": "worker",
            "type": "broadcast",
            "intensity": "medium"
          },
          {
            "id": "i_c_worker_db_commit_fwd",
            "from": "worker",
            "to": "db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "db",
          "zoom": 1
        }
      },
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_status_changed",
            "entityId": "queue",
            "from": "active",
            "to": "normal"
          },
          {
            "type": "entity_status_changed",
            "entityId": "worker",
            "from": "active",
            "to": "normal"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "worker",
            "from": "primary",
            "to": "secondary"
          },
          {
            "type": "entity_count_changed",
            "entityId": "db",
            "from": 1,
            "to": 2
          },
          {
            "type": "entity_status_changed",
            "entityId": "db",
            "from": "normal",
            "to": "active"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "db",
            "from": "secondary",
            "to": "primary"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_app_db_req"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_app_queue_dispatch"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_app_db_req_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_app_queue_dispatch_fwd"
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
              "target": "db",
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
            "entityId": "db",
            "elementIds": [
              "db",
              "db_2"
            ],
            "action": "add",
            "enter": "zoom_in",
            "cleanup": false
          }
        ],
        "connections": [
          {
            "entityId": "app",
            "elementIds": [
              "app_1",
              "app",
              "app_3"
            ],
            "action": "connect",
            "connectionId": "c_app_queue_dispatch",
            "cleanup": false
          },
          {
            "entityId": "db",
            "elementIds": [
              "db",
              "db_2"
            ],
            "action": "connect",
            "connectionId": "c_app_db_req"
          },
          {
            "entityId": "queue",
            "elementIds": [
              "queue"
            ],
            "action": "connect",
            "connectionId": "c_app_queue_dispatch"
          }
        ],
        "interactions": [
          {
            "entityId": "app",
            "elementIds": [
              "app_1",
              "app",
              "app_3"
            ],
            "action": "interact",
            "interactionId": "i_c_app_queue_dispatch_fwd",
            "cleanup": false
          },
          {
            "entityId": "db",
            "elementIds": [
              "db",
              "db_2"
            ],
            "action": "interact",
            "interactionId": "i_c_app_db_req_fwd"
          },
          {
            "entityId": "queue",
            "elementIds": [
              "queue"
            ],
            "action": "interact",
            "interactionId": "i_c_app_queue_dispatch_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "db",
            "action": "add",
            "delay": 0.37399999999999994,
            "duration": 0.62,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_app_db_req",
            "delay": 0.504,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "connectionId": "c_app_queue_dispatch",
            "delay": 0.56,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": {
        "targetId": "db",
        "targetElementId": "db",
        "zoom": 1,
        "duration": 0.55,
        "easing": "cubic-bezier(0.2,0,0,1)",
        "motionType": "focus_primary"
      },
      "sceneDiff": {
        "addedEntities": [],
        "removedEntities": [],
        "movedEntities": [],
        "updatedEntities": [
          {
            "id": "queue",
            "changes": {
              "status": {
                "from": "active",
                "to": "normal"
              }
            }
          },
          {
            "id": "worker",
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
          },
          {
            "id": "db",
            "changes": {
              "status": {
                "from": "normal",
                "to": "active"
              },
              "count": {
                "from": 1,
                "to": 2
              },
              "importance": {
                "from": "secondary",
                "to": "primary"
              }
            }
          }
        ],
        "addedConnections": [
          {
            "id": "c_app_db_req",
            "from": "app",
            "to": "db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [
          {
            "id": "c_app_queue_dispatch",
            "from": "app",
            "to": "queue",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "addedInteractions": [
          {
            "id": "i_c_app_db_req_fwd",
            "from": "app",
            "to": "db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_app_queue_dispatch_fwd",
            "from": "app",
            "to": "queue",
            "type": "broadcast",
            "intensity": "medium"
          }
        ],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "worker",
            "zoom": 1
          },
          "to": {
            "mode": "focus",
            "target": "db",
            "zoom": 1
          }
        }
      }
    },
    {
      "id": "scene_10",
      "start": 54,
      "end": 60,
      "narration": "The final stack shows Users hitting a CDN, then a Load Balancer, then multiple Servers using a Cache, with a Queue and multiple Workers feeding updates into replicated Databases.",
      "camera": "wide",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "position": {
            "x": 50,
            "y": 12
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#34D399",
            "glow": true,
            "glowColor": "#34D399",
            "glowBlur": 9.464000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "cdn",
          "type": "cdn",
          "sourceEntityId": "cdn",
          "label": "CDN",
          "position": {
            "x": 50,
            "y": 20.57142857142857
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 9.464000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "lb",
          "type": "load_balancer",
          "sourceEntityId": "lb",
          "label": "Load Balancer",
          "position": {
            "x": 50,
            "y": 29.142857142857142
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 9.464000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_1",
          "type": "server",
          "sourceEntityId": "app",
          "position": {
            "x": 37.21851851851852,
            "y": 37.714285714285715
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 9.464000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app",
          "type": "server",
          "sourceEntityId": "app",
          "label": "Server",
          "position": {
            "x": 50,
            "y": 37.714285714285715
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 9.464000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "app_3",
          "type": "server",
          "sourceEntityId": "app",
          "position": {
            "x": 62.78148148148148,
            "y": 37.714285714285715
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 9.464000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "cache",
          "type": "cache",
          "sourceEntityId": "cache",
          "label": "Cache",
          "position": {
            "x": 50,
            "y": 46.285714285714285
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 9.464000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "queue",
          "type": "queue",
          "sourceEntityId": "queue",
          "label": "Queue",
          "position": {
            "x": 50,
            "y": 54.857142857142854
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 9.464000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "worker_1",
          "type": "worker",
          "sourceEntityId": "worker",
          "position": {
            "x": 38,
            "y": 63.42857142857143
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 9.464000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "sourceEntityId": "worker",
          "label": "Worker",
          "position": {
            "x": 50,
            "y": 63.42857142857143
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 9.464000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "worker_3",
          "type": "worker",
          "sourceEntityId": "worker",
          "position": {
            "x": 62,
            "y": 63.42857142857143
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 9.464000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "db",
          "type": "database",
          "sourceEntityId": "db",
          "label": "Database",
          "position": {
            "x": 50,
            "y": 69
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 9.464000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "db_2",
          "type": "database",
          "sourceEntityId": "db",
          "position": {
            "x": 50,
            "y": 75
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#2A4B88",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#00FFFF",
            "glow": true,
            "glowColor": "#00FFFF",
            "glowBlur": 9.464000000000002,
            "textColor": "#E8F6FF",
            "fontSize": 16,
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
          "layout": {
            "x": 50,
            "y": 12
          }
        },
        {
          "id": "cdn",
          "type": "cdn",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "CDN",
          "layout": {
            "x": 50,
            "y": 20.57142857142857
          }
        },
        {
          "id": "lb",
          "type": "load_balancer",
          "count": 1,
          "importance": "primary",
          "status": "normal",
          "label": "Load Balancer",
          "layout": {
            "x": 50,
            "y": 29.142857142857142
          }
        },
        {
          "id": "app",
          "type": "server",
          "count": 3,
          "importance": "secondary",
          "status": "normal",
          "label": "Server",
          "layout": {
            "x": 50,
            "y": 37.714285714285715
          }
        },
        {
          "id": "cache",
          "type": "cache",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Cache",
          "layout": {
            "x": 50,
            "y": 46.285714285714285
          }
        },
        {
          "id": "queue",
          "type": "queue",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Queue",
          "layout": {
            "x": 50,
            "y": 54.857142857142854
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "count": 3,
          "importance": "secondary",
          "status": "normal",
          "label": "Worker",
          "layout": {
            "x": 50,
            "y": 63.42857142857143
          }
        },
        {
          "id": "db",
          "type": "database",
          "count": 2,
          "importance": "secondary",
          "status": "normal",
          "label": "Database",
          "layout": {
            "x": 50,
            "y": 72
          }
        }
      ],
      "connections": [
        {
          "id": "c_users_cdn_fetch",
          "from": "users",
          "to": "cdn",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_users_lb_req",
          "from": "users",
          "to": "lb",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_lb_app_req",
          "from": "lb",
          "to": "app",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_app_cache_lookup",
          "from": "app",
          "to": "cache",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_app_queue_dispatch",
          "from": "app",
          "to": "queue",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_queue_worker_dispatch",
          "from": "queue",
          "to": "worker",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_worker_db_commit",
          "from": "worker",
          "to": "db",
          "direction": "one_way",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_cdn_fetch_fwd",
          "from": "users",
          "to": "cdn",
          "type": "flow",
          "intensity": "high"
        },
        {
          "id": "i_c_users_lb_req_fwd",
          "from": "users",
          "to": "lb",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_lb_app_req_fwd",
          "from": "lb",
          "to": "app",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_app_cache_lookup_fwd",
          "from": "app",
          "to": "cache",
          "type": "ping",
          "intensity": "medium"
        },
        {
          "id": "i_c_app_queue_dispatch_fwd",
          "from": "app",
          "to": "queue",
          "type": "broadcast",
          "intensity": "medium"
        },
        {
          "id": "i_c_queue_worker_dispatch_fwd",
          "from": "queue",
          "to": "worker",
          "type": "broadcast",
          "intensity": "medium"
        },
        {
          "id": "i_c_worker_db_commit_fwd",
          "from": "worker",
          "to": "db",
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
          "theme": "neon",
          "background_texture": "grid",
          "glow_strength": "strong"
        },
        "motion": {
          "entry_style": "elastic_pop",
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
            "count": 1,
            "importance": "secondary",
            "status": "active",
            "label": "Users",
            "layout": {
              "x": 50,
              "y": 12
            }
          },
          {
            "id": "cdn",
            "type": "cdn",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "CDN",
            "layout": {
              "x": 50,
              "y": 20.57142857142857
            }
          },
          {
            "id": "lb",
            "type": "load_balancer",
            "count": 1,
            "importance": "primary",
            "status": "normal",
            "label": "Load Balancer",
            "layout": {
              "x": 50,
              "y": 29.142857142857142
            }
          },
          {
            "id": "app",
            "type": "server",
            "count": 3,
            "importance": "secondary",
            "status": "normal",
            "label": "Server",
            "layout": {
              "x": 50,
              "y": 37.714285714285715
            }
          },
          {
            "id": "cache",
            "type": "cache",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Cache",
            "layout": {
              "x": 50,
              "y": 46.285714285714285
            }
          },
          {
            "id": "queue",
            "type": "queue",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Queue",
            "layout": {
              "x": 50,
              "y": 54.857142857142854
            }
          },
          {
            "id": "worker",
            "type": "worker",
            "count": 3,
            "importance": "secondary",
            "status": "normal",
            "label": "Worker",
            "layout": {
              "x": 50,
              "y": 63.42857142857143
            }
          },
          {
            "id": "db",
            "type": "database",
            "count": 2,
            "importance": "secondary",
            "status": "normal",
            "label": "Database",
            "layout": {
              "x": 50,
              "y": 72
            }
          }
        ],
        "connections": [
          {
            "id": "c_users_cdn_fetch",
            "from": "users",
            "to": "cdn",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_users_lb_req",
            "from": "users",
            "to": "lb",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_lb_app_req",
            "from": "lb",
            "to": "app",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_app_cache_lookup",
            "from": "app",
            "to": "cache",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_app_queue_dispatch",
            "from": "app",
            "to": "queue",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_queue_worker_dispatch",
            "from": "queue",
            "to": "worker",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_worker_db_commit",
            "from": "worker",
            "to": "db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_cdn_fetch_fwd",
            "from": "users",
            "to": "cdn",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_users_lb_req_fwd",
            "from": "users",
            "to": "lb",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_lb_app_req_fwd",
            "from": "lb",
            "to": "app",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_app_cache_lookup_fwd",
            "from": "app",
            "to": "cache",
            "type": "ping",
            "intensity": "medium"
          },
          {
            "id": "i_c_app_queue_dispatch_fwd",
            "from": "app",
            "to": "queue",
            "type": "broadcast",
            "intensity": "medium"
          },
          {
            "id": "i_c_queue_worker_dispatch_fwd",
            "from": "queue",
            "to": "worker",
            "type": "broadcast",
            "intensity": "medium"
          },
          {
            "id": "i_c_worker_db_commit_fwd",
            "from": "worker",
            "to": "db",
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
            "type": "entity_moved",
            "entityId": "cache",
            "from": {
              "x": 50,
              "y": 63.42857142857143
            },
            "to": {
              "x": 50,
              "y": 46.285714285714285
            }
          },
          {
            "type": "entity_moved",
            "entityId": "queue",
            "from": {
              "x": 50,
              "y": 46.285714285714285
            },
            "to": {
              "x": 50,
              "y": 54.857142857142854
            }
          },
          {
            "type": "entity_moved",
            "entityId": "worker",
            "from": {
              "x": 50,
              "y": 54.857142857142854
            },
            "to": {
              "x": 50,
              "y": 63.42857142857143
            }
          },
          {
            "type": "entity_status_changed",
            "entityId": "users",
            "from": "normal",
            "to": "active"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "lb",
            "from": "secondary",
            "to": "primary"
          },
          {
            "type": "entity_count_changed",
            "entityId": "worker",
            "from": 1,
            "to": 3
          },
          {
            "type": "entity_status_changed",
            "entityId": "db",
            "from": "active",
            "to": "normal"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "db",
            "from": "primary",
            "to": "secondary"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_app_queue_dispatch"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_app_db_req"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_app_queue_dispatch_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_app_db_req_fwd"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "db",
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
        "moves": [
          {
            "entityId": "cache",
            "elementIds": [
              "cache"
            ],
            "action": "move"
          },
          {
            "entityId": "queue",
            "elementIds": [
              "queue"
            ],
            "action": "move"
          },
          {
            "entityId": "worker",
            "elementIds": [
              "worker_1",
              "worker",
              "worker_3"
            ],
            "action": "move"
          }
        ],
        "additions": [
          {
            "entityId": "lb",
            "elementIds": [
              "lb"
            ],
            "action": "add",
            "enter": "zoom_in"
          },
          {
            "entityId": "worker",
            "elementIds": [
              "worker_1",
              "worker",
              "worker_3"
            ],
            "action": "add",
            "enter": "zoom_in"
          }
        ],
        "connections": [
          {
            "entityId": "app",
            "elementIds": [
              "app_1",
              "app",
              "app_3"
            ],
            "action": "connect",
            "connectionId": "c_app_db_req",
            "cleanup": false
          },
          {
            "entityId": "queue",
            "elementIds": [
              "queue"
            ],
            "action": "connect",
            "connectionId": "c_app_queue_dispatch"
          },
          {
            "entityId": "db",
            "elementIds": [
              "db",
              "db_2"
            ],
            "action": "connect",
            "connectionId": "c_app_db_req"
          }
        ],
        "interactions": [
          {
            "entityId": "app",
            "elementIds": [
              "app_1",
              "app",
              "app_3"
            ],
            "action": "interact",
            "interactionId": "i_c_app_db_req_fwd",
            "cleanup": false
          },
          {
            "entityId": "queue",
            "elementIds": [
              "queue"
            ],
            "action": "interact",
            "interactionId": "i_c_app_queue_dispatch_fwd"
          },
          {
            "entityId": "db",
            "elementIds": [
              "db",
              "db_2"
            ],
            "action": "interact",
            "interactionId": "i_c_app_db_req_fwd"
          }
        ]
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "cache",
            "action": "move",
            "delay": 0.6000000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "queue",
            "action": "move",
            "delay": 0.6560000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "worker",
            "action": "move",
            "delay": 0.7120000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "lb",
            "action": "add",
            "delay": 0.37399999999999994,
            "duration": 0.62,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_app_queue_dispatch",
            "delay": 0.504,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "connectionId": "c_app_db_req",
            "delay": 0.56,
            "duration": 0.42,
            "easing": "cubic-bezier(0.2,0,0,1)"
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
        "addedEntities": [],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "cache",
            "from": {
              "x": 50,
              "y": 63.42857142857143
            },
            "to": {
              "x": 50,
              "y": 46.285714285714285
            }
          },
          {
            "id": "queue",
            "from": {
              "x": 50,
              "y": 46.285714285714285
            },
            "to": {
              "x": 50,
              "y": 54.857142857142854
            }
          },
          {
            "id": "worker",
            "from": {
              "x": 50,
              "y": 54.857142857142854
            },
            "to": {
              "x": 50,
              "y": 63.42857142857143
            }
          }
        ],
        "updatedEntities": [
          {
            "id": "users",
            "changes": {
              "status": {
                "from": "normal",
                "to": "active"
              }
            }
          },
          {
            "id": "lb",
            "changes": {
              "importance": {
                "from": "secondary",
                "to": "primary"
              }
            }
          },
          {
            "id": "worker",
            "changes": {
              "count": {
                "from": 1,
                "to": 3
              }
            }
          },
          {
            "id": "db",
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
            "id": "c_app_queue_dispatch",
            "from": "app",
            "to": "queue",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [
          {
            "id": "c_app_db_req",
            "from": "app",
            "to": "db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "addedInteractions": [
          {
            "id": "i_c_app_queue_dispatch_fwd",
            "from": "app",
            "to": "queue",
            "type": "broadcast",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_app_db_req_fwd",
            "from": "app",
            "to": "db",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "db",
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

export default makeScene2D(function* (view) {
  const caption = createRef<Txt>();
  view.fill(StyleTokens.colors.background);
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
      yield* gridLayer.y(14, step / 2).to(0, step / 2);
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
