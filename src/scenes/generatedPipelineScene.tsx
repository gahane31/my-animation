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
      "narration": "Users send steady requests to one Server, and that Server reads and writes to one Database.",
      "camera": "wide",
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
          "effects": [],
          "visualStyle": {
            "size": 115.2,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 3.394112549695428,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 11.248640000000004,
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
          "effects": [],
          "visualStyle": {
            "size": 115.2,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 3.394112549695428,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 11.248640000000004,
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
          "effects": [],
          "visualStyle": {
            "size": 115.2,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 3.394112549695428,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 11.248640000000004,
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
          "importance": "primary",
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
          "importance": "secondary",
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
          "id": "c_app_db_call",
          "from": "app",
          "to": "db",
          "direction": "bidirectional",
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
          "id": "i_c_app_db_call_fwd",
          "from": "app",
          "to": "db",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_app_db_call_rev",
          "from": "db",
          "to": "app",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "app",
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
            "importance": "primary",
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
            "importance": "secondary",
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
            "id": "c_app_db_call",
            "from": "app",
            "to": "db",
            "direction": "bidirectional",
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
            "id": "i_c_app_db_call_fwd",
            "from": "app",
            "to": "db",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_app_db_call_rev",
            "from": "db",
            "to": "app",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "app",
          "zoom": 1.1
        }
      },
      "staticScene": true,
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
          },
          {
            "type": "entity_added",
            "entityId": "db"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_users_app_req"
          },
          {
            "type": "connection_added",
            "connectionId": "c_app_db_call"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_users_app_req_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_app_db_call_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_app_db_call_rev"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": null,
            "to": {
              "mode": "focus",
              "target": "app",
              "zoom": 1.1
            }
          }
        ]
      },
      "hierarchy": {
        "primaryId": "app",
        "entityStyles": {
          "users": {
            "scale": 1,
            "opacity": 0.4,
            "glow": false
          },
          "app": {
            "scale": 1.2,
            "opacity": 1,
            "glow": true
          },
          "db": {
            "scale": 1,
            "opacity": 0.4,
            "glow": false
          }
        }
      },
      "hierarchyTransition": null,
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
            "layout": {
              "x": 50,
              "y": 19.8
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
              "y": 42
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
              "y": 64.2
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
          },
          {
            "id": "c_app_db_call",
            "from": "app",
            "to": "db",
            "direction": "bidirectional",
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
          },
          {
            "id": "i_c_app_db_call_fwd",
            "from": "app",
            "to": "db",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_app_db_call_rev",
            "from": "db",
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
            "zoom": 1.1
          }
        }
      }
    },
    {
      "id": "s2",
      "start": 6,
      "end": 12,
      "narration": "The same Users now create heavier traffic, and the single Server is in overload while requests pile up before reaching the Database.",
      "camera": "wide",
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
          "effects": [],
          "visualStyle": {
            "size": 115.2,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 3.394112549695428,
            "strokeColor": "#34D399",
            "glow": true,
            "glowColor": "#34D399",
            "glowBlur": 21.632,
            "textColor": "#E8F6FF",
            "fontSize": 35.84,
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
          "effects": [],
          "visualStyle": {
            "size": 115.2,
            "opacity": 1,
            "color": "#EF4444",
            "strokeWidth": 3.394112549695428,
            "strokeColor": "#EF4444",
            "glow": true,
            "glowColor": "#EF4444",
            "glowBlur": 28.287999999999997,
            "textColor": "#E8F6FF",
            "fontSize": 35.84,
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
            "y": 64.2
          },
          "effects": [],
          "visualStyle": {
            "size": 115.2,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 3.394112549695428,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
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
          "status": "active",
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
          "importance": "primary",
          "status": "overloaded",
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
          "importance": "secondary",
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
          "id": "c_app_db_call",
          "from": "app",
          "to": "db",
          "direction": "bidirectional",
          "style": "solid"
        }
      ],
      "interactions": [
        {
          "id": "i_c_users_app_req_fwd",
          "from": "users",
          "to": "app",
          "type": "flow",
          "intensity": "high"
        },
        {
          "id": "i_c_app_db_call_fwd",
          "from": "app",
          "to": "db",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_app_db_call_rev",
          "from": "db",
          "to": "app",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "app",
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
          "theme": "default",
          "background_texture": "grid",
          "glow_strength": "strong"
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
            "count": 1,
            "importance": "secondary",
            "status": "active",
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
            "importance": "primary",
            "status": "overloaded",
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
            "importance": "secondary",
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
            "id": "c_app_db_call",
            "from": "app",
            "to": "db",
            "direction": "bidirectional",
            "style": "solid"
          }
        ],
        "interactions": [
          {
            "id": "i_c_users_app_req_fwd",
            "from": "users",
            "to": "app",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_app_db_call_fwd",
            "from": "app",
            "to": "db",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_app_db_call_rev",
            "from": "db",
            "to": "app",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "app",
          "zoom": 1.12
        }
      },
      "staticScene": true,
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_status_changed",
            "entityId": "users",
            "from": "normal",
            "to": "active"
          },
          {
            "type": "entity_status_changed",
            "entityId": "app",
            "from": "normal",
            "to": "overloaded"
          }
        ],
        "connectionDiffs": [],
        "interactionDiffs": [
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_users_app_req_fwd",
            "from": "medium",
            "to": "high"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "app",
              "zoom": 1.1
            },
            "to": {
              "mode": "focus",
              "target": "app",
              "zoom": 1.12
            }
          }
        ]
      },
      "hierarchy": {
        "primaryId": "app",
        "entityStyles": {
          "users": {
            "scale": 1,
            "opacity": 0.4,
            "glow": false
          },
          "app": {
            "scale": 1.2,
            "opacity": 1,
            "glow": true
          },
          "db": {
            "scale": 1,
            "opacity": 0.4,
            "glow": false
          }
        }
      },
      "hierarchyTransition": null,
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [],
        "removedEntities": [],
        "movedEntities": [],
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
            "id": "app",
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
            "id": "i_c_users_app_req_fwd",
            "from": "medium",
            "to": "high"
          }
        ],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "app",
            "zoom": 1.1
          },
          "to": {
            "mode": "focus",
            "target": "app",
            "zoom": 1.12
          }
        }
      }
    },
    {
      "id": "s3",
      "start": 12,
      "end": 18,
      "narration": "A Load Balancer is inserted so user requests hit the Load Balancer first and then flow down to the Server and Database.",
      "camera": "wide",
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
          "effects": [],
          "visualStyle": {
            "size": 102.6,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 3.2031234756093934,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 10.018320000000001,
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
          "effects": [],
          "visualStyle": {
            "size": 102.6,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 3.2031234756093934,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 10.018320000000001,
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
          "effects": [],
          "visualStyle": {
            "size": 102.6,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 3.2031234756093934,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 10.018320000000001,
            "textColor": "#E8F6FF",
            "fontSize": 31.919999999999998,
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
          "effects": [],
          "visualStyle": {
            "size": 102.6,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 3.2031234756093934,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 10.018320000000001,
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
          "id": "c_app_db_call",
          "from": "app",
          "to": "db",
          "direction": "bidirectional",
          "style": "solid"
        }
      ],
      "interactions": [
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
          "id": "i_c_app_db_call_fwd",
          "from": "app",
          "to": "db",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_app_db_call_rev",
          "from": "db",
          "to": "app",
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
          "entry_style": "elastic_pop",
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
            "id": "c_app_db_call",
            "from": "app",
            "to": "db",
            "direction": "bidirectional",
            "style": "solid"
          }
        ],
        "interactions": [
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
            "id": "i_c_app_db_call_fwd",
            "from": "app",
            "to": "db",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_app_db_call_rev",
            "from": "db",
            "to": "app",
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
      "staticScene": true,
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
            "entityId": "users",
            "from": "active",
            "to": "normal"
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
              "target": "app",
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
      "hierarchy": {
        "primaryId": "lb",
        "entityStyles": {
          "users": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "lb": {
            "scale": 1.2,
            "opacity": 1,
            "glow": true
          },
          "app": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "db": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          }
        }
      },
      "hierarchyTransition": null,
      "cameraPlan": null,
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
            "id": "users",
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
              "status": {
                "from": "overloaded",
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
            "intensity": "medium"
          },
          {
            "id": "i_c_lb_app_req_fwd",
            "from": "lb",
            "to": "app",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_users_app_req_fwd",
            "from": "users",
            "to": "app",
            "type": "flow",
            "intensity": "high"
          }
        ],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "app",
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
      "id": "s4",
      "start": 18,
      "end": 24,
      "narration": "The Load Balancer fans out steady requests across multiple Server instances, and each Server still talks to the same Database.",
      "camera": "wide",
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
          "effects": [],
          "visualStyle": {
            "size": 81,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.846049894151541,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 7.909200000000002,
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
          "effects": [],
          "visualStyle": {
            "size": 81,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.846049894151541,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 7.909200000000002,
            "textColor": "#E8F6FF",
            "fontSize": 25.2,
            "fontWeight": 600,
            "status": "normal"
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
          "effects": [],
          "visualStyle": {
            "size": 81,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.846049894151541,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 7.909200000000002,
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
          "effects": [],
          "visualStyle": {
            "size": 81,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.846049894151541,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 7.909200000000002,
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
          "effects": [],
          "visualStyle": {
            "size": 81,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.846049894151541,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 7.909200000000002,
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
          "effects": [],
          "visualStyle": {
            "size": 81,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.846049894151541,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 7.909200000000002,
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
          "count": 3,
          "importance": "secondary",
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
          "id": "c_app_db_call",
          "from": "app",
          "to": "db",
          "direction": "bidirectional",
          "style": "solid"
        }
      ],
      "interactions": [
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
          "id": "i_c_app_db_call_fwd",
          "from": "app",
          "to": "db",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_app_db_call_rev",
          "from": "db",
          "to": "app",
          "type": "flow",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "lb",
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
          "entry_style": "drop_bounce",
          "pacing": "balanced"
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
            "count": 3,
            "importance": "secondary",
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
            "id": "c_app_db_call",
            "from": "app",
            "to": "db",
            "direction": "bidirectional",
            "style": "solid"
          }
        ],
        "interactions": [
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
            "id": "i_c_app_db_call_fwd",
            "from": "app",
            "to": "db",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_app_db_call_rev",
            "from": "db",
            "to": "app",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "lb",
          "zoom": 1
        }
      },
      "staticScene": true,
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_count_changed",
            "entityId": "app",
            "from": 1,
            "to": 3
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
              "target": "lb",
              "zoom": 1
            }
          }
        ]
      },
      "hierarchy": {
        "primaryId": "lb",
        "entityStyles": {
          "users": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "lb": {
            "scale": 1.2,
            "opacity": 1,
            "glow": true
          },
          "app": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "db": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          }
        }
      },
      "hierarchyTransition": null,
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [],
        "removedEntities": [],
        "movedEntities": [],
        "updatedEntities": [
          {
            "id": "app",
            "changes": {
              "count": {
                "from": 1,
                "to": 3
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
            "target": "lb",
            "zoom": 1
          }
        }
      }
    },
    {
      "id": "s5",
      "start": 24,
      "end": 30,
      "narration": "With more Servers, the Database becomes the hot spot and is in overload because too many reads and writes converge on it.",
      "camera": "wide",
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
          "effects": [],
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
          "id": "lb",
          "type": "load_balancer",
          "sourceEntityId": "lb",
          "label": "Load Balancer",
          "position": {
            "x": 50,
            "y": 33.4
          },
          "effects": [],
          "visualStyle": {
            "size": 81,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.846049894151541,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 15.210000000000003,
            "textColor": "#E8F6FF",
            "fontSize": 25.2,
            "fontWeight": 600,
            "status": "normal"
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
          "effects": [],
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
          "id": "app",
          "type": "server",
          "sourceEntityId": "app",
          "label": "Server",
          "position": {
            "x": 50,
            "y": 50.599999999999994
          },
          "effects": [],
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
          "id": "app_3",
          "type": "server",
          "sourceEntityId": "app",
          "position": {
            "x": 70.54166666666666,
            "y": 50.599999999999994
          },
          "effects": [],
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
          "id": "db",
          "type": "database",
          "sourceEntityId": "db",
          "label": "Database",
          "position": {
            "x": 50,
            "y": 67.8
          },
          "effects": [],
          "visualStyle": {
            "size": 81,
            "opacity": 1,
            "color": "#EF4444",
            "strokeWidth": 2.846049894151541,
            "strokeColor": "#EF4444",
            "glow": true,
            "glowColor": "#EF4444",
            "glowBlur": 19.889999999999997,
            "textColor": "#E8F6FF",
            "fontSize": 25.2,
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
          "count": 3,
          "importance": "secondary",
          "status": "active",
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
          "importance": "primary",
          "status": "overloaded",
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
          "id": "c_app_db_call",
          "from": "app",
          "to": "db",
          "direction": "bidirectional",
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
          "id": "i_c_app_db_call_fwd",
          "from": "app",
          "to": "db",
          "type": "flow",
          "intensity": "high"
        },
        {
          "id": "i_c_app_db_call_rev",
          "from": "db",
          "to": "app",
          "type": "flow",
          "intensity": "high"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "db",
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
          "theme": "default",
          "background_texture": "grid",
          "glow_strength": "strong"
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
            "count": 1,
            "importance": "secondary",
            "status": "active",
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
            "count": 3,
            "importance": "secondary",
            "status": "active",
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
            "importance": "primary",
            "status": "overloaded",
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
            "id": "c_app_db_call",
            "from": "app",
            "to": "db",
            "direction": "bidirectional",
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
            "id": "i_c_app_db_call_fwd",
            "from": "app",
            "to": "db",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_app_db_call_rev",
            "from": "db",
            "to": "app",
            "type": "flow",
            "intensity": "high"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "db",
          "zoom": 1.08
        }
      },
      "staticScene": true,
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_status_changed",
            "entityId": "users",
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
            "type": "entity_status_changed",
            "entityId": "app",
            "from": "normal",
            "to": "active"
          },
          {
            "type": "entity_status_changed",
            "entityId": "db",
            "from": "normal",
            "to": "overloaded"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "db",
            "from": "secondary",
            "to": "primary"
          }
        ],
        "connectionDiffs": [],
        "interactionDiffs": [
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_users_lb_req_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_lb_app_req_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_app_db_call_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_app_db_call_rev",
            "from": "medium",
            "to": "high"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "lb",
              "zoom": 1
            },
            "to": {
              "mode": "focus",
              "target": "db",
              "zoom": 1.08
            }
          }
        ]
      },
      "hierarchy": {
        "primaryId": "db",
        "entityStyles": {
          "users": {
            "scale": 1,
            "opacity": 0.4,
            "glow": false
          },
          "lb": {
            "scale": 1,
            "opacity": 0.4,
            "glow": false
          },
          "app": {
            "scale": 1,
            "opacity": 0.4,
            "glow": false
          },
          "db": {
            "scale": 1.2,
            "opacity": 1,
            "glow": true
          }
        }
      },
      "hierarchyTransition": null,
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [],
        "removedEntities": [],
        "movedEntities": [],
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
          },
          {
            "id": "db",
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
            "id": "i_c_users_lb_req_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "id": "i_c_lb_app_req_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "id": "i_c_app_db_call_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "id": "i_c_app_db_call_rev",
            "from": "medium",
            "to": "high"
          }
        ],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "lb",
            "zoom": 1
          },
          "to": {
            "mode": "focus",
            "target": "db",
            "zoom": 1.08
          }
        }
      }
    },
    {
      "id": "s6",
      "start": 30,
      "end": 36,
      "narration": "A Cache is added between the Servers and the Database so many requests do a cache_lookup and return quickly without hitting the Database.",
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
          "effects": [],
          "visualStyle": {
            "size": 72,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.6832815729997477,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 7.030400000000002,
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
          "effects": [],
          "visualStyle": {
            "size": 72,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.6832815729997477,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 7.030400000000002,
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
          "effects": [],
          "visualStyle": {
            "size": 72,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.6832815729997477,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 7.030400000000002,
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
          "effects": [],
          "visualStyle": {
            "size": 72,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.6832815729997477,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 7.030400000000002,
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
          "effects": [],
          "visualStyle": {
            "size": 72,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.6832815729997477,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 7.030400000000002,
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
          "effects": [],
          "visualStyle": {
            "size": 72,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.6832815729997477,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 7.030400000000002,
            "textColor": "#E8F6FF",
            "fontSize": 22.400000000000002,
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
          "effects": [],
          "visualStyle": {
            "size": 72,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.6832815729997477,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 7.030400000000002,
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
          "status": "normal",
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
          "direction": "bidirectional",
          "style": "solid"
        },
        {
          "id": "c_cache_db_call",
          "from": "cache",
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
          "intensity": "high"
        },
        {
          "id": "i_c_app_cache_lookup_rev",
          "from": "cache",
          "to": "app",
          "type": "ping",
          "intensity": "high"
        },
        {
          "id": "i_c_cache_db_call_fwd",
          "from": "cache",
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
          "entry_style": "elastic_pop",
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
            "status": "normal",
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
            "direction": "bidirectional",
            "style": "solid"
          },
          {
            "id": "c_cache_db_call",
            "from": "cache",
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
            "intensity": "high"
          },
          {
            "id": "i_c_app_cache_lookup_rev",
            "from": "cache",
            "to": "app",
            "type": "ping",
            "intensity": "high"
          },
          {
            "id": "i_c_cache_db_call_fwd",
            "from": "cache",
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
      "staticScene": true,
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
            "entityId": "users",
            "from": "active",
            "to": "normal"
          },
          {
            "type": "entity_status_changed",
            "entityId": "app",
            "from": "active",
            "to": "normal"
          },
          {
            "type": "entity_status_changed",
            "entityId": "db",
            "from": "overloaded",
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
            "connectionId": "c_app_cache_lookup"
          },
          {
            "type": "connection_added",
            "connectionId": "c_cache_db_call"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_app_db_call"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_app_cache_lookup_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_app_cache_lookup_rev"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_cache_db_call_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_app_db_call_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_app_db_call_rev"
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
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "db",
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
      "hierarchy": {
        "primaryId": "cache",
        "entityStyles": {
          "users": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "lb": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "app": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "cache": {
            "scale": 1.2,
            "opacity": 1,
            "glow": true
          },
          "db": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          }
        }
      },
      "hierarchyTransition": null,
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "cache",
            "type": "cache",
            "count": 1,
            "importance": "primary",
            "status": "normal",
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
            "id": "users",
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
              "status": {
                "from": "active",
                "to": "normal"
              }
            }
          },
          {
            "id": "db",
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
          }
        ],
        "addedConnections": [
          {
            "id": "c_app_cache_lookup",
            "from": "app",
            "to": "cache",
            "direction": "bidirectional",
            "style": "solid"
          },
          {
            "id": "c_cache_db_call",
            "from": "cache",
            "to": "db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [
          {
            "id": "c_app_db_call",
            "from": "app",
            "to": "db",
            "direction": "bidirectional",
            "style": "solid"
          }
        ],
        "addedInteractions": [
          {
            "id": "i_c_app_cache_lookup_fwd",
            "from": "app",
            "to": "cache",
            "type": "ping",
            "intensity": "high"
          },
          {
            "id": "i_c_app_cache_lookup_rev",
            "from": "cache",
            "to": "app",
            "type": "ping",
            "intensity": "high"
          },
          {
            "id": "i_c_cache_db_call_fwd",
            "from": "cache",
            "to": "db",
            "type": "flow",
            "intensity": "low"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_app_db_call_fwd",
            "from": "app",
            "to": "db",
            "type": "flow",
            "intensity": "high"
          },
          {
            "id": "i_c_app_db_call_rev",
            "from": "db",
            "to": "app",
            "type": "flow",
            "intensity": "high"
          }
        ],
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
          }
        ],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "db",
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
      "id": "s7",
      "start": 36,
      "end": 42,
      "narration": "A Read Replica is added so Servers can send read traffic to the Read Replica while writes still go to the Primary Database.",
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
          "effects": [],
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 6.327360000000001,
            "textColor": "#E8F6FF",
            "fontSize": 20.16,
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
            "y": 24
          },
          "effects": [],
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 6.327360000000001,
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
            "y": 36
          },
          "effects": [],
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 6.327360000000001,
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
            "y": 36
          },
          "effects": [],
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 6.327360000000001,
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
            "y": 36
          },
          "effects": [],
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 6.327360000000001,
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
            "y": 48
          },
          "effects": [],
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 6.327360000000001,
            "textColor": "#E8F6FF",
            "fontSize": 20.16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "db_primary",
          "type": "primary_database",
          "sourceEntityId": "db_primary",
          "label": "Primary Database",
          "position": {
            "x": 50,
            "y": 60
          },
          "effects": [],
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 6.327360000000001,
            "textColor": "#E8F6FF",
            "fontSize": 20.16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "db_replica",
          "type": "read_replica",
          "sourceEntityId": "db_replica",
          "label": "Read Replica",
          "position": {
            "x": 50,
            "y": 72
          },
          "effects": [],
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 6.327360000000001,
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
          "id": "lb",
          "type": "load_balancer",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Load Balancer",
          "layout": {
            "x": 50,
            "y": 24
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
            "y": 36
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
            "y": 48
          }
        },
        {
          "id": "db_primary",
          "type": "primary_database",
          "count": 1,
          "importance": "primary",
          "status": "normal",
          "label": "Primary Database",
          "layout": {
            "x": 50,
            "y": 60
          }
        },
        {
          "id": "db_replica",
          "type": "read_replica",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Read Replica",
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
          "direction": "bidirectional",
          "style": "solid"
        },
        {
          "id": "c_cache_db_replica_read",
          "from": "cache",
          "to": "db_replica",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_cache_db_primary_write",
          "from": "cache",
          "to": "db_primary",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_db_primary_replication",
          "from": "db_primary",
          "to": "db_replica",
          "direction": "one_way",
          "style": "dashed"
        }
      ],
      "interactions": [
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
          "intensity": "high"
        },
        {
          "id": "i_c_app_cache_lookup_rev",
          "from": "cache",
          "to": "app",
          "type": "ping",
          "intensity": "high"
        },
        {
          "id": "i_c_cache_db_replica_read_fwd",
          "from": "cache",
          "to": "db_replica",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_cache_db_primary_write_fwd",
          "from": "cache",
          "to": "db_primary",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_db_primary_replication_fwd",
          "from": "db_primary",
          "to": "db_replica",
          "type": "broadcast",
          "intensity": "medium"
        }
      ],
      "sourceCamera": {
        "mode": "focus",
        "target": "db_primary",
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
          "entry_style": "elastic_pop",
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
              "y": 24
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
              "y": 36
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
              "y": 48
            }
          },
          {
            "id": "db_primary",
            "type": "primary_database",
            "count": 1,
            "importance": "primary",
            "status": "normal",
            "label": "Primary Database",
            "layout": {
              "x": 50,
              "y": 60
            }
          },
          {
            "id": "db_replica",
            "type": "read_replica",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Read Replica",
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
            "direction": "bidirectional",
            "style": "solid"
          },
          {
            "id": "c_cache_db_replica_read",
            "from": "cache",
            "to": "db_replica",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_cache_db_primary_write",
            "from": "cache",
            "to": "db_primary",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_db_primary_replication",
            "from": "db_primary",
            "to": "db_replica",
            "direction": "one_way",
            "style": "dashed"
          }
        ],
        "interactions": [
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
            "intensity": "high"
          },
          {
            "id": "i_c_app_cache_lookup_rev",
            "from": "cache",
            "to": "app",
            "type": "ping",
            "intensity": "high"
          },
          {
            "id": "i_c_cache_db_replica_read_fwd",
            "from": "cache",
            "to": "db_replica",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_cache_db_primary_write_fwd",
            "from": "cache",
            "to": "db_primary",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_db_primary_replication_fwd",
            "from": "db_primary",
            "to": "db_replica",
            "type": "broadcast",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "db_primary",
          "zoom": 1
        }
      },
      "staticScene": true,
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "db_primary"
          },
          {
            "type": "entity_added",
            "entityId": "db_replica"
          },
          {
            "type": "entity_removed",
            "entityId": "db"
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
              "y": 24
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
              "y": 36
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
              "y": 48
            }
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
            "connectionId": "c_cache_db_replica_read"
          },
          {
            "type": "connection_added",
            "connectionId": "c_cache_db_primary_write"
          },
          {
            "type": "connection_added",
            "connectionId": "c_db_primary_replication"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_cache_db_call"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_cache_db_replica_read_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_cache_db_primary_write_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_db_primary_replication_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_cache_db_call_fwd"
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
              "target": "db_primary",
              "zoom": 1
            }
          }
        ]
      },
      "hierarchy": {
        "primaryId": "db_primary",
        "entityStyles": {
          "users": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "lb": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "app": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "cache": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "db_primary": {
            "scale": 1.2,
            "opacity": 1,
            "glow": true
          },
          "db_replica": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          }
        }
      },
      "hierarchyTransition": null,
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "db_primary",
            "type": "primary_database",
            "count": 1,
            "importance": "primary",
            "status": "normal",
            "label": "Primary Database",
            "layout": {
              "x": 50,
              "y": 60
            }
          },
          {
            "id": "db_replica",
            "type": "read_replica",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Read Replica",
            "layout": {
              "x": 50,
              "y": 72
            }
          }
        ],
        "removedEntities": [
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
        "movedEntities": [
          {
            "id": "lb",
            "from": {
              "x": 50,
              "y": 27
            },
            "to": {
              "x": 50,
              "y": 24
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
              "y": 36
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
              "y": 48
            }
          }
        ],
        "updatedEntities": [
          {
            "id": "cache",
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
            "id": "c_cache_db_replica_read",
            "from": "cache",
            "to": "db_replica",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_cache_db_primary_write",
            "from": "cache",
            "to": "db_primary",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_db_primary_replication",
            "from": "db_primary",
            "to": "db_replica",
            "direction": "one_way",
            "style": "dashed"
          }
        ],
        "removedConnections": [
          {
            "id": "c_cache_db_call",
            "from": "cache",
            "to": "db",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "addedInteractions": [
          {
            "id": "i_c_cache_db_replica_read_fwd",
            "from": "cache",
            "to": "db_replica",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_cache_db_primary_write_fwd",
            "from": "cache",
            "to": "db_primary",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_db_primary_replication_fwd",
            "from": "db_primary",
            "to": "db_replica",
            "type": "broadcast",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_cache_db_call_fwd",
            "from": "cache",
            "to": "db",
            "type": "flow",
            "intensity": "low"
          }
        ],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "cache",
            "zoom": 1.04
          },
          "to": {
            "mode": "focus",
            "target": "db_primary",
            "zoom": 1
          }
        }
      }
    },
    {
      "id": "s8",
      "start": 42,
      "end": 48,
      "narration": "A Queue is added so the Server can enqueue bursty work and respond fast while the Queue buffers tasks instead of blocking on the Database.",
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
          "effects": [],
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 6.327360000000001,
            "textColor": "#E8F6FF",
            "fontSize": 20.16,
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
            "y": 24
          },
          "effects": [],
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 6.327360000000001,
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
            "y": 36
          },
          "effects": [],
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 6.327360000000001,
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
            "y": 36
          },
          "effects": [],
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 6.327360000000001,
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
            "y": 36
          },
          "effects": [],
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 6.327360000000001,
            "textColor": "#E8F6FF",
            "fontSize": 20.16,
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
            "y": 48
          },
          "effects": [],
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 6.327360000000001,
            "textColor": "#E8F6FF",
            "fontSize": 20.16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "db_primary",
          "type": "primary_database",
          "sourceEntityId": "db_primary",
          "label": "Primary Database",
          "position": {
            "x": 50,
            "y": 60
          },
          "effects": [],
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 6.327360000000001,
            "textColor": "#E8F6FF",
            "fontSize": 20.16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "db_replica",
          "type": "read_replica",
          "sourceEntityId": "db_replica",
          "label": "Read Replica",
          "position": {
            "x": 50,
            "y": 72
          },
          "effects": [],
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 6.327360000000001,
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
          "id": "lb",
          "type": "load_balancer",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Load Balancer",
          "layout": {
            "x": 50,
            "y": 24
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
            "y": 36
          }
        },
        {
          "id": "queue",
          "type": "queue",
          "count": 1,
          "importance": "primary",
          "status": "normal",
          "label": "Queue",
          "layout": {
            "x": 50,
            "y": 48
          }
        },
        {
          "id": "db_primary",
          "type": "primary_database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Primary Database",
          "layout": {
            "x": 50,
            "y": 60
          }
        },
        {
          "id": "db_replica",
          "type": "read_replica",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Read Replica",
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
          "id": "c_app_queue_async",
          "from": "app",
          "to": "queue",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_app_db_replica_read",
          "from": "app",
          "to": "db_replica",
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
          "id": "i_c_app_queue_async_fwd",
          "from": "app",
          "to": "queue",
          "type": "broadcast",
          "intensity": "high"
        },
        {
          "id": "i_c_app_db_replica_read_fwd",
          "from": "app",
          "to": "db_replica",
          "type": "flow",
          "intensity": "medium"
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
          "pacing": "balanced"
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
              "y": 24
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
              "y": 36
            }
          },
          {
            "id": "queue",
            "type": "queue",
            "count": 1,
            "importance": "primary",
            "status": "normal",
            "label": "Queue",
            "layout": {
              "x": 50,
              "y": 48
            }
          },
          {
            "id": "db_primary",
            "type": "primary_database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Primary Database",
            "layout": {
              "x": 50,
              "y": 60
            }
          },
          {
            "id": "db_replica",
            "type": "read_replica",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Read Replica",
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
            "id": "c_app_queue_async",
            "from": "app",
            "to": "queue",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_app_db_replica_read",
            "from": "app",
            "to": "db_replica",
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
            "id": "i_c_app_queue_async_fwd",
            "from": "app",
            "to": "queue",
            "type": "broadcast",
            "intensity": "high"
          },
          {
            "id": "i_c_app_db_replica_read_fwd",
            "from": "app",
            "to": "db_replica",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "focus",
          "target": "queue",
          "zoom": 1
        }
      },
      "staticScene": true,
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "queue"
          },
          {
            "type": "entity_removed",
            "entityId": "cache"
          },
          {
            "type": "entity_importance_changed",
            "entityId": "db_primary",
            "from": "primary",
            "to": "secondary"
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_app_queue_async"
          },
          {
            "type": "connection_added",
            "connectionId": "c_app_db_replica_read"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_app_cache_lookup"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_cache_db_replica_read"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_cache_db_primary_write"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_db_primary_replication"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_app_queue_async_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_app_db_replica_read_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_app_cache_lookup_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_app_cache_lookup_rev"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_cache_db_replica_read_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_cache_db_primary_write_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_db_primary_replication_fwd"
          }
        ],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": {
              "mode": "focus",
              "target": "db_primary",
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
      "hierarchy": {
        "primaryId": "queue",
        "entityStyles": {
          "users": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "lb": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "app": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "queue": {
            "scale": 1.2,
            "opacity": 1,
            "glow": true
          },
          "db_primary": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "db_replica": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          }
        }
      },
      "hierarchyTransition": null,
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "queue",
            "type": "queue",
            "count": 1,
            "importance": "primary",
            "status": "normal",
            "label": "Queue",
            "layout": {
              "x": 50,
              "y": 48
            }
          }
        ],
        "removedEntities": [
          {
            "id": "cache",
            "type": "cache",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Cache",
            "layout": {
              "x": 50,
              "y": 48
            }
          }
        ],
        "movedEntities": [],
        "updatedEntities": [
          {
            "id": "db_primary",
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
            "id": "c_app_queue_async",
            "from": "app",
            "to": "queue",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_app_db_replica_read",
            "from": "app",
            "to": "db_replica",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [
          {
            "id": "c_app_cache_lookup",
            "from": "app",
            "to": "cache",
            "direction": "bidirectional",
            "style": "solid"
          },
          {
            "id": "c_cache_db_replica_read",
            "from": "cache",
            "to": "db_replica",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_cache_db_primary_write",
            "from": "cache",
            "to": "db_primary",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_db_primary_replication",
            "from": "db_primary",
            "to": "db_replica",
            "direction": "one_way",
            "style": "dashed"
          }
        ],
        "addedInteractions": [
          {
            "id": "i_c_app_queue_async_fwd",
            "from": "app",
            "to": "queue",
            "type": "broadcast",
            "intensity": "high"
          },
          {
            "id": "i_c_app_db_replica_read_fwd",
            "from": "app",
            "to": "db_replica",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_app_cache_lookup_fwd",
            "from": "app",
            "to": "cache",
            "type": "ping",
            "intensity": "high"
          },
          {
            "id": "i_c_app_cache_lookup_rev",
            "from": "cache",
            "to": "app",
            "type": "ping",
            "intensity": "high"
          },
          {
            "id": "i_c_cache_db_replica_read_fwd",
            "from": "cache",
            "to": "db_replica",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_cache_db_primary_write_fwd",
            "from": "cache",
            "to": "db_primary",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_db_primary_replication_fwd",
            "from": "db_primary",
            "to": "db_replica",
            "type": "broadcast",
            "intensity": "medium"
          }
        ],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": {
            "mode": "focus",
            "target": "db_primary",
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
      "id": "s9",
      "start": 48,
      "end": 54,
      "narration": "Workers scale out to consume queue_dispatch traffic from the Queue and then worker_commit results into the Primary Database while reads stay on the Read Replica.",
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
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 5.0091600000000005,
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
            "y": 22
          },
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 5.0091600000000005,
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
            "y": 32
          },
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 5.0091600000000005,
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
            "y": 32
          },
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 5.0091600000000005,
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
            "y": 32
          },
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 5.0091600000000005,
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
            "y": 42
          },
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#34D399",
            "glow": true,
            "glowColor": "#34D399",
            "glowBlur": 5.0091600000000005,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "worker_1",
          "type": "worker",
          "sourceEntityId": "worker",
          "position": {
            "x": 38,
            "y": 52
          },
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#34D399",
            "glow": true,
            "glowColor": "#34D399",
            "glowBlur": 5.0091600000000005,
            "textColor": "#E8F6FF",
            "fontSize": 16,
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
            "y": 52
          },
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#34D399",
            "glow": true,
            "glowColor": "#34D399",
            "glowBlur": 5.0091600000000005,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "worker_3",
          "type": "worker",
          "sourceEntityId": "worker",
          "position": {
            "x": 62,
            "y": 52
          },
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#34D399",
            "glow": true,
            "glowColor": "#34D399",
            "glowBlur": 5.0091600000000005,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "active"
          }
        },
        {
          "id": "db_primary",
          "type": "primary_database",
          "sourceEntityId": "db_primary",
          "label": "Primary Database",
          "position": {
            "x": 50,
            "y": 62
          },
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 5.0091600000000005,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "db_replica",
          "type": "read_replica",
          "sourceEntityId": "db_replica",
          "label": "Read Replica",
          "position": {
            "x": 50,
            "y": 72
          },
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 5.0091600000000005,
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
            "y": 22
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
            "y": 32
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
            "y": 42
          }
        },
        {
          "id": "worker",
          "type": "worker",
          "count": 3,
          "importance": "primary",
          "status": "active",
          "label": "Worker",
          "layout": {
            "x": 50,
            "y": 52
          }
        },
        {
          "id": "db_primary",
          "type": "primary_database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Primary Database",
          "layout": {
            "x": 50,
            "y": 62
          }
        },
        {
          "id": "db_replica",
          "type": "read_replica",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Read Replica",
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
          "id": "c_app_queue_async",
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
          "id": "c_worker_db_primary_commit",
          "from": "worker",
          "to": "db_primary",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_app_db_replica_read",
          "from": "app",
          "to": "db_replica",
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
          "id": "i_c_app_queue_async_fwd",
          "from": "app",
          "to": "queue",
          "type": "broadcast",
          "intensity": "high"
        },
        {
          "id": "i_c_queue_worker_dispatch_fwd",
          "from": "queue",
          "to": "worker",
          "type": "broadcast",
          "intensity": "high"
        },
        {
          "id": "i_c_worker_db_primary_commit_fwd",
          "from": "worker",
          "to": "db_primary",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_app_db_replica_read_fwd",
          "from": "app",
          "to": "db_replica",
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
              "y": 22
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
              "y": 32
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
              "y": 42
            }
          },
          {
            "id": "worker",
            "type": "worker",
            "count": 3,
            "importance": "primary",
            "status": "active",
            "label": "Worker",
            "layout": {
              "x": 50,
              "y": 52
            }
          },
          {
            "id": "db_primary",
            "type": "primary_database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Primary Database",
            "layout": {
              "x": 50,
              "y": 62
            }
          },
          {
            "id": "db_replica",
            "type": "read_replica",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Read Replica",
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
            "id": "c_app_queue_async",
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
            "id": "c_worker_db_primary_commit",
            "from": "worker",
            "to": "db_primary",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_app_db_replica_read",
            "from": "app",
            "to": "db_replica",
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
            "id": "i_c_app_queue_async_fwd",
            "from": "app",
            "to": "queue",
            "type": "broadcast",
            "intensity": "high"
          },
          {
            "id": "i_c_queue_worker_dispatch_fwd",
            "from": "queue",
            "to": "worker",
            "type": "broadcast",
            "intensity": "high"
          },
          {
            "id": "i_c_worker_db_primary_commit_fwd",
            "from": "worker",
            "to": "db_primary",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_app_db_replica_read_fwd",
            "from": "app",
            "to": "db_replica",
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
      "staticScene": true,
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "worker"
          },
          {
            "type": "entity_moved",
            "entityId": "lb",
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
            "entityId": "app",
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
            "entityId": "queue",
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
            "entityId": "db_primary",
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
            "entityId": "queue",
            "from": "normal",
            "to": "active"
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
            "connectionId": "c_worker_db_primary_commit"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_queue_worker_dispatch_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_worker_db_primary_commit_fwd"
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
      "hierarchy": {
        "primaryId": "worker",
        "entityStyles": {
          "users": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "lb": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "app": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "queue": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "worker": {
            "scale": 1.2,
            "opacity": 1,
            "glow": true
          },
          "db_primary": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "db_replica": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          }
        }
      },
      "hierarchyTransition": null,
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "worker",
            "type": "worker",
            "count": 3,
            "importance": "primary",
            "status": "active",
            "label": "Worker",
            "layout": {
              "x": 50,
              "y": 52
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "lb",
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
            "id": "app",
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
            "id": "queue",
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
            "id": "db_primary",
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
            "id": "queue",
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
            "id": "c_worker_db_primary_commit",
            "from": "worker",
            "to": "db_primary",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "removedConnections": [],
        "addedInteractions": [
          {
            "id": "i_c_queue_worker_dispatch_fwd",
            "from": "queue",
            "to": "worker",
            "type": "broadcast",
            "intensity": "high"
          },
          {
            "id": "i_c_worker_db_primary_commit_fwd",
            "from": "worker",
            "to": "db_primary",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [],
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
      "id": "s10",
      "start": 54,
      "end": 60,
      "narration": "At 1 million users, traffic flows from Users to the Load Balancer, fans out to Servers, hits Cache for fast reads, uses Read Replicas for scale, and uses a Queue plus Workers to absorb bursts before writing to the Primary Database.",
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
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#34D399",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#34D399",
            "glow": true,
            "glowColor": "#34D399",
            "glowBlur": 4.921280000000001,
            "textColor": "#E8F6FF",
            "fontSize": 16,
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
            "y": 20.57142857142857
          },
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 4.921280000000001,
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
            "y": 29.142857142857142
          },
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 4.921280000000001,
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
            "y": 29.142857142857142
          },
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 4.921280000000001,
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
            "y": 29.142857142857142
          },
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 4.921280000000001,
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
            "y": 37.714285714285715
          },
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 4.921280000000001,
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
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 4.921280000000001,
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
            "y": 54.857142857142854
          },
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 4.921280000000001,
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
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 4.921280000000001,
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
            "y": 54.857142857142854
          },
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 4.921280000000001,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "db_primary",
          "type": "primary_database",
          "sourceEntityId": "db_primary",
          "label": "Primary Database",
          "position": {
            "x": 50,
            "y": 63.42857142857143
          },
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 4.921280000000001,
            "textColor": "#E8F6FF",
            "fontSize": 16,
            "fontWeight": 600,
            "status": "normal"
          }
        },
        {
          "id": "db_replica",
          "type": "read_replica",
          "sourceEntityId": "db_replica",
          "label": "Read Replica",
          "position": {
            "x": 50,
            "y": 72
          },
          "effects": [],
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#345F9F",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#8AA4C8",
            "glow": true,
            "glowColor": "#93C5FD",
            "glowBlur": 4.921280000000001,
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
          "id": "lb",
          "type": "load_balancer",
          "count": 1,
          "importance": "primary",
          "status": "normal",
          "label": "Load Balancer",
          "layout": {
            "x": 50,
            "y": 20.57142857142857
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
            "y": 29.142857142857142
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
          "count": 3,
          "importance": "secondary",
          "status": "normal",
          "label": "Worker",
          "layout": {
            "x": 50,
            "y": 54.857142857142854
          }
        },
        {
          "id": "db_primary",
          "type": "primary_database",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Primary Database",
          "layout": {
            "x": 50,
            "y": 63.42857142857143
          }
        },
        {
          "id": "db_replica",
          "type": "read_replica",
          "count": 1,
          "importance": "secondary",
          "status": "normal",
          "label": "Read Replica",
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
          "direction": "bidirectional",
          "style": "solid"
        },
        {
          "id": "c_cache_db_replica_read",
          "from": "cache",
          "to": "db_replica",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_app_queue_async",
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
          "id": "c_worker_db_primary_commit",
          "from": "worker",
          "to": "db_primary",
          "direction": "one_way",
          "style": "solid"
        },
        {
          "id": "c_db_primary_replication",
          "from": "db_primary",
          "to": "db_replica",
          "direction": "one_way",
          "style": "dashed"
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
          "id": "i_c_app_cache_lookup_rev",
          "from": "cache",
          "to": "app",
          "type": "ping",
          "intensity": "high"
        },
        {
          "id": "i_c_cache_db_replica_read_fwd",
          "from": "cache",
          "to": "db_replica",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_app_queue_async_fwd",
          "from": "app",
          "to": "queue",
          "type": "broadcast",
          "intensity": "high"
        },
        {
          "id": "i_c_queue_worker_dispatch_fwd",
          "from": "queue",
          "to": "worker",
          "type": "broadcast",
          "intensity": "high"
        },
        {
          "id": "i_c_worker_db_primary_commit_fwd",
          "from": "worker",
          "to": "db_primary",
          "type": "flow",
          "intensity": "medium"
        },
        {
          "id": "i_c_db_primary_replication_fwd",
          "from": "db_primary",
          "to": "db_replica",
          "type": "broadcast",
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
          "entry_style": "elastic_pop",
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
            "layout": {
              "x": 50,
              "y": 12
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
              "y": 20.57142857142857
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
              "y": 29.142857142857142
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
            "count": 3,
            "importance": "secondary",
            "status": "normal",
            "label": "Worker",
            "layout": {
              "x": 50,
              "y": 54.857142857142854
            }
          },
          {
            "id": "db_primary",
            "type": "primary_database",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Primary Database",
            "layout": {
              "x": 50,
              "y": 63.42857142857143
            }
          },
          {
            "id": "db_replica",
            "type": "read_replica",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Read Replica",
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
            "direction": "bidirectional",
            "style": "solid"
          },
          {
            "id": "c_cache_db_replica_read",
            "from": "cache",
            "to": "db_replica",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_app_queue_async",
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
            "id": "c_worker_db_primary_commit",
            "from": "worker",
            "to": "db_primary",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_db_primary_replication",
            "from": "db_primary",
            "to": "db_replica",
            "direction": "one_way",
            "style": "dashed"
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
            "id": "i_c_app_cache_lookup_rev",
            "from": "cache",
            "to": "app",
            "type": "ping",
            "intensity": "high"
          },
          {
            "id": "i_c_cache_db_replica_read_fwd",
            "from": "cache",
            "to": "db_replica",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_app_queue_async_fwd",
            "from": "app",
            "to": "queue",
            "type": "broadcast",
            "intensity": "high"
          },
          {
            "id": "i_c_queue_worker_dispatch_fwd",
            "from": "queue",
            "to": "worker",
            "type": "broadcast",
            "intensity": "high"
          },
          {
            "id": "i_c_worker_db_primary_commit_fwd",
            "from": "worker",
            "to": "db_primary",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_db_primary_replication_fwd",
            "from": "db_primary",
            "to": "db_replica",
            "type": "broadcast",
            "intensity": "medium"
          }
        ],
        "camera": {
          "mode": "wide",
          "zoom": 1
        }
      },
      "staticScene": true,
      "motionPersonality": "CALM",
      "diff": {
        "entityDiffs": [
          {
            "type": "entity_added",
            "entityId": "cache"
          },
          {
            "type": "entity_moved",
            "entityId": "lb",
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
            "entityId": "app",
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
            "entityId": "queue",
            "from": {
              "x": 50,
              "y": 42
            },
            "to": {
              "x": 50,
              "y": 46.285714285714285
            }
          },
          {
            "type": "entity_moved",
            "entityId": "worker",
            "from": {
              "x": 50,
              "y": 52
            },
            "to": {
              "x": 50,
              "y": 54.857142857142854
            }
          },
          {
            "type": "entity_moved",
            "entityId": "db_primary",
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
          }
        ],
        "connectionDiffs": [
          {
            "type": "connection_added",
            "connectionId": "c_app_cache_lookup"
          },
          {
            "type": "connection_added",
            "connectionId": "c_cache_db_replica_read"
          },
          {
            "type": "connection_added",
            "connectionId": "c_db_primary_replication"
          },
          {
            "type": "connection_removed",
            "connectionId": "c_app_db_replica_read"
          }
        ],
        "interactionDiffs": [
          {
            "type": "interaction_added",
            "interactionId": "i_c_app_cache_lookup_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_app_cache_lookup_rev"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_cache_db_replica_read_fwd"
          },
          {
            "type": "interaction_added",
            "interactionId": "i_c_db_primary_replication_fwd"
          },
          {
            "type": "interaction_removed",
            "interactionId": "i_c_app_db_replica_read_fwd"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_users_lb_req_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "type": "interaction_intensity_changed",
            "interactionId": "i_c_lb_app_req_fwd",
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
              "mode": "wide",
              "zoom": 1
            }
          }
        ]
      },
      "hierarchy": {
        "primaryId": "lb",
        "entityStyles": {
          "users": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "lb": {
            "scale": 1.2,
            "opacity": 1,
            "glow": true
          },
          "app": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "cache": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "queue": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "worker": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "db_primary": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          },
          "db_replica": {
            "scale": 1,
            "opacity": 0.55,
            "glow": false
          }
        }
      },
      "hierarchyTransition": null,
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [
          {
            "id": "cache",
            "type": "cache",
            "count": 1,
            "importance": "secondary",
            "status": "normal",
            "label": "Cache",
            "layout": {
              "x": 50,
              "y": 37.714285714285715
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "lb",
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
            "id": "app",
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
            "id": "queue",
            "from": {
              "x": 50,
              "y": 42
            },
            "to": {
              "x": 50,
              "y": 46.285714285714285
            }
          },
          {
            "id": "worker",
            "from": {
              "x": 50,
              "y": 52
            },
            "to": {
              "x": 50,
              "y": 54.857142857142854
            }
          },
          {
            "id": "db_primary",
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
          }
        ],
        "addedConnections": [
          {
            "id": "c_app_cache_lookup",
            "from": "app",
            "to": "cache",
            "direction": "bidirectional",
            "style": "solid"
          },
          {
            "id": "c_cache_db_replica_read",
            "from": "cache",
            "to": "db_replica",
            "direction": "one_way",
            "style": "solid"
          },
          {
            "id": "c_db_primary_replication",
            "from": "db_primary",
            "to": "db_replica",
            "direction": "one_way",
            "style": "dashed"
          }
        ],
        "removedConnections": [
          {
            "id": "c_app_db_replica_read",
            "from": "app",
            "to": "db_replica",
            "direction": "one_way",
            "style": "solid"
          }
        ],
        "addedInteractions": [
          {
            "id": "i_c_app_cache_lookup_fwd",
            "from": "app",
            "to": "cache",
            "type": "ping",
            "intensity": "high"
          },
          {
            "id": "i_c_app_cache_lookup_rev",
            "from": "cache",
            "to": "app",
            "type": "ping",
            "intensity": "high"
          },
          {
            "id": "i_c_cache_db_replica_read_fwd",
            "from": "cache",
            "to": "db_replica",
            "type": "flow",
            "intensity": "medium"
          },
          {
            "id": "i_c_db_primary_replication_fwd",
            "from": "db_primary",
            "to": "db_replica",
            "type": "broadcast",
            "intensity": "medium"
          }
        ],
        "removedInteractions": [
          {
            "id": "i_c_app_db_replica_read_fwd",
            "from": "app",
            "to": "db_replica",
            "type": "flow",
            "intensity": "medium"
          }
        ],
        "interactionIntensityChanged": [
          {
            "id": "i_c_users_lb_req_fwd",
            "from": "medium",
            "to": "high"
          },
          {
            "id": "i_c_lb_app_req_fwd",
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
  theme: 'neon',
  background_texture: 'grid',
  glow_strength: 'strong',
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
