/** @jsxImportSource @motion-canvas/2d/lib */
import {makeScene2D, Txt} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';
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
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "position": {
            "x": 50,
            "y": 28.06
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 130.5,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 3.612478373637689,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 73.94
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 130.5,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 3.612478373637689,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 28.06
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
            "y": 73.94
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
      "interactions": [],
      "sourceCamera": {
        "mode": "wide",
        "zoom": 1
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
              "y": 28.06
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
              "y": 73.94
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
        "interactions": [],
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
        "interactionDiffs": [],
        "cameraDiffs": [
          {
            "type": "camera_changed",
            "from": null,
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
        "interactions": []
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "users",
            "action": "add",
            "delay": 1.7999999999999998,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "isPrimary": false
          },
          {
            "entityId": "app",
            "action": "add",
            "delay": 1.98,
            "duration": 1.05,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_users_app_req",
            "delay": 3,
            "duration": 0.8,
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
            "layout": {
              "x": 50,
              "y": 28.06
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
              "y": 73.94
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
        "addedInteractions": [],
        "removedInteractions": [],
        "interactionIntensityChanged": [],
        "cameraChanged": {
          "from": null,
          "to": {
            "mode": "wide",
            "zoom": 1
          }
        }
      }
    },
    {
      "id": "scene_02",
      "start": 6,
      "end": 12,
      "narration": "Users go to the Server, and the Server reads and writes to a single Database.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "position": {
            "x": 50,
            "y": 23.62
          },
          "visualStyle": {
            "size": 115.2,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 3.394112549695428,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 51
          },
          "visualStyle": {
            "size": 115.2,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 3.394112549695428,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 78.38
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 115.2,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 3.394112549695428,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 23.62
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
            "y": 51
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
            "y": 78.38
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
      "interactions": [],
      "sourceCamera": {
        "mode": "wide",
        "zoom": 1
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
              "y": 23.62
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
              "y": 51
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
              "y": 78.38
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
        "interactions": [],
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
            "entityId": "db"
          },
          {
            "type": "entity_moved",
            "entityId": "users",
            "from": {
              "x": 50,
              "y": 28.06
            },
            "to": {
              "x": 50,
              "y": 23.62
            }
          },
          {
            "type": "entity_moved",
            "entityId": "app",
            "from": {
              "x": 50,
              "y": 73.94
            },
            "to": {
              "x": 50,
              "y": 51
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
        "interactions": []
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
            "delay": 0.68,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "db",
            "action": "add",
            "delay": 1.9,
            "duration": 1.05,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_app_db_req",
            "delay": 3,
            "duration": 0.8,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": null,
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
              "y": 78.38
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "users",
            "from": {
              "x": 50,
              "y": 28.06
            },
            "to": {
              "x": 50,
              "y": 23.62
            }
          },
          {
            "id": "app",
            "from": {
              "x": 50,
              "y": 73.94
            },
            "to": {
              "x": 50,
              "y": 51
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
        "addedInteractions": [],
        "removedInteractions": [],
        "interactionIntensityChanged": [],
        "cameraChanged": null
      }
    },
    {
      "id": "scene_03",
      "start": 12,
      "end": 18,
      "narration": "A Load Balancer sits between Users and the Server, but there is still only one Server behind it.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "position": {
            "x": 50,
            "y": 19.18
          },
          "visualStyle": {
            "size": 102.6,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 3.2031234756093934,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 40.39333333333333
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 102.6,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 3.2031234756093934,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 61.60666666666666
          },
          "visualStyle": {
            "size": 102.6,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 3.2031234756093934,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 82.82
          },
          "visualStyle": {
            "size": 102.6,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 3.2031234756093934,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 19.18
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
            "y": 40.39333333333333
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
            "y": 61.60666666666666
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
            "y": 82.82
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
      "interactions": [],
      "sourceCamera": {
        "mode": "wide",
        "zoom": 1
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
              "y": 19.18
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
              "y": 40.39333333333333
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
              "y": 61.60666666666666
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
              "y": 82.82
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
        "interactions": [],
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
            "entityId": "lb"
          },
          {
            "type": "entity_moved",
            "entityId": "users",
            "from": {
              "x": 50,
              "y": 23.62
            },
            "to": {
              "x": 50,
              "y": 19.18
            }
          },
          {
            "type": "entity_moved",
            "entityId": "app",
            "from": {
              "x": 50,
              "y": 51
            },
            "to": {
              "x": 50,
              "y": 61.60666666666666
            }
          },
          {
            "type": "entity_moved",
            "entityId": "db",
            "from": {
              "x": 50,
              "y": 78.38
            },
            "to": {
              "x": 50,
              "y": 82.82
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
        "interactions": []
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
            "delay": 0.68,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "db",
            "action": "move",
            "delay": 0.7600000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "lb",
            "action": "add",
            "delay": 1.9,
            "duration": 1.05,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_users_lb_req",
            "delay": 3,
            "duration": 0.8,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "connectionId": "c_lb_app_req",
            "delay": 3.08,
            "duration": 0.8,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "connectionId": "c_users_app_req",
            "delay": 3.16,
            "duration": 0.8,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
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
              "y": 40.39333333333333
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "users",
            "from": {
              "x": 50,
              "y": 23.62
            },
            "to": {
              "x": 50,
              "y": 19.18
            }
          },
          {
            "id": "app",
            "from": {
              "x": 50,
              "y": 51
            },
            "to": {
              "x": 50,
              "y": 61.60666666666666
            }
          },
          {
            "id": "db",
            "from": {
              "x": 50,
              "y": 78.38
            },
            "to": {
              "x": 50,
              "y": 82.82
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
        "addedInteractions": [],
        "removedInteractions": [],
        "interactionIntensityChanged": [],
        "cameraChanged": null
      }
    },
    {
      "id": "scene_04",
      "start": 18,
      "end": 24,
      "narration": "The Load Balancer distributes Users across three Servers that all talk to the same Database.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "position": {
            "x": 50,
            "y": 19.18
          },
          "visualStyle": {
            "size": 81,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.846049894151541,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 40.39333333333333
          },
          "visualStyle": {
            "size": 81,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.846049894151541,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 61.60666666666666
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 81,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.846049894151541,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 61.60666666666666
          },
          "visualStyle": {
            "size": 81,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.846049894151541,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 61.60666666666666
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 81,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.846049894151541,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 82.82
          },
          "visualStyle": {
            "size": 81,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.846049894151541,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 19.18
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
            "y": 40.39333333333333
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
            "y": 61.60666666666666
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
            "y": 82.82
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
      "interactions": [],
      "sourceCamera": {
        "mode": "wide",
        "zoom": 1
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
              "y": 19.18
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
              "y": 40.39333333333333
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
              "y": 61.60666666666666
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
              "y": 82.82
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
        "interactions": [],
        "camera": {
          "mode": "wide",
          "zoom": 1
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
            "delay": 1.9,
            "duration": 1.05,
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
        "cameraChanged": null
      }
    },
    {
      "id": "scene_05",
      "start": 24,
      "end": 30,
      "narration": "Each Server checks a Cache before going to the Database for data.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "position": {
            "x": 50,
            "y": 14
          },
          "visualStyle": {
            "size": 72,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.6832815729997477,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 32.5
          },
          "visualStyle": {
            "size": 72,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.6832815729997477,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 51
          },
          "visualStyle": {
            "size": 72,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.6832815729997477,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 51
          },
          "visualStyle": {
            "size": 72,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.6832815729997477,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 51
          },
          "visualStyle": {
            "size": 72,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.6832815729997477,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 69.5
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 72,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.6832815729997477,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 88
          },
          "visualStyle": {
            "size": 72,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.6832815729997477,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 14
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
            "y": 32.5
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
            "y": 51
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
            "y": 69.5
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
            "y": 88
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
      "interactions": [],
      "sourceCamera": {
        "mode": "wide",
        "zoom": 1
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
              "y": 14
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
              "y": 32.5
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
              "y": 51
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
              "y": 69.5
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
              "y": 88
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
        "interactions": [],
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
            "entityId": "cache"
          },
          {
            "type": "entity_moved",
            "entityId": "users",
            "from": {
              "x": 50,
              "y": 19.18
            },
            "to": {
              "x": 50,
              "y": 14
            }
          },
          {
            "type": "entity_moved",
            "entityId": "lb",
            "from": {
              "x": 50,
              "y": 40.39333333333333
            },
            "to": {
              "x": 50,
              "y": 32.5
            }
          },
          {
            "type": "entity_moved",
            "entityId": "app",
            "from": {
              "x": 50,
              "y": 61.60666666666666
            },
            "to": {
              "x": 50,
              "y": 51
            }
          },
          {
            "type": "entity_moved",
            "entityId": "db",
            "from": {
              "x": 50,
              "y": 82.82
            },
            "to": {
              "x": 50,
              "y": 88
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
        "interactions": []
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
            "delay": 0.68,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "app",
            "action": "move",
            "delay": 0.7600000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "db",
            "action": "move",
            "delay": 0.8400000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "cache",
            "action": "add",
            "delay": 1.9,
            "duration": 1.05,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_app_cache_lookup",
            "delay": 3,
            "duration": 0.8,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": null,
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
              "y": 69.5
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "users",
            "from": {
              "x": 50,
              "y": 19.18
            },
            "to": {
              "x": 50,
              "y": 14
            }
          },
          {
            "id": "lb",
            "from": {
              "x": 50,
              "y": 40.39333333333333
            },
            "to": {
              "x": 50,
              "y": 32.5
            }
          },
          {
            "id": "app",
            "from": {
              "x": 50,
              "y": 61.60666666666666
            },
            "to": {
              "x": 50,
              "y": 51
            }
          },
          {
            "id": "db",
            "from": {
              "x": 50,
              "y": 82.82
            },
            "to": {
              "x": 50,
              "y": 88
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
        "addedInteractions": [],
        "removedInteractions": [],
        "interactionIntensityChanged": [],
        "cameraChanged": null
      }
    },
    {
      "id": "scene_06",
      "start": 30,
      "end": 36,
      "narration": "A CDN serves many requests directly, and the remaining traffic goes from Users to the Load Balancer and then to the Servers.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "position": {
            "x": 50,
            "y": 14
          },
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 28.8
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 43.6
          },
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 58.400000000000006
          },
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 58.400000000000006
          },
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 58.400000000000006
          },
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 73.2
          },
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 88
          },
          "visualStyle": {
            "size": 64.8,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.545584412271571,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 14
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
            "y": 28.8
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
            "y": 43.6
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
            "y": 58.400000000000006
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
            "y": 73.2
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
            "y": 88
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
      "interactions": [],
      "sourceCamera": {
        "mode": "wide",
        "zoom": 1
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
              "y": 14
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
              "y": 28.8
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
              "y": 43.6
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
              "y": 58.400000000000006
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
              "y": 73.2
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
              "y": 88
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
        "interactions": [],
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
            "entityId": "cdn"
          },
          {
            "type": "entity_moved",
            "entityId": "lb",
            "from": {
              "x": 50,
              "y": 32.5
            },
            "to": {
              "x": 50,
              "y": 43.6
            }
          },
          {
            "type": "entity_moved",
            "entityId": "app",
            "from": {
              "x": 50,
              "y": 51
            },
            "to": {
              "x": 50,
              "y": 58.400000000000006
            }
          },
          {
            "type": "entity_moved",
            "entityId": "cache",
            "from": {
              "x": 50,
              "y": 69.5
            },
            "to": {
              "x": 50,
              "y": 73.2
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
        "interactions": []
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
            "delay": 0.68,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "cache",
            "action": "move",
            "delay": 0.7600000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "cdn",
            "action": "add",
            "delay": 1.9,
            "duration": 1.05,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_users_cdn_fetch",
            "delay": 3,
            "duration": 0.8,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": null,
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
              "y": 28.8
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "lb",
            "from": {
              "x": 50,
              "y": 32.5
            },
            "to": {
              "x": 50,
              "y": 43.6
            }
          },
          {
            "id": "app",
            "from": {
              "x": 50,
              "y": 51
            },
            "to": {
              "x": 50,
              "y": 58.400000000000006
            }
          },
          {
            "id": "cache",
            "from": {
              "x": 50,
              "y": 69.5
            },
            "to": {
              "x": 50,
              "y": 73.2
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
        "addedInteractions": [],
        "removedInteractions": [],
        "interactionIntensityChanged": [],
        "cameraChanged": null
      }
    },
    {
      "id": "scene_07",
      "start": 36,
      "end": 42,
      "narration": "Servers handle user requests quickly and push slow tasks into a Queue instead of doing them inline.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "position": {
            "x": 50,
            "y": 14
          },
          "visualStyle": {
            "size": 60.3,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.455605831561735,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 26.333333333333336
          },
          "visualStyle": {
            "size": 60.3,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.455605831561735,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 38.66666666666667
          },
          "visualStyle": {
            "size": 60.3,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.455605831561735,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 51
          },
          "visualStyle": {
            "size": 60.3,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.455605831561735,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 51
          },
          "visualStyle": {
            "size": 60.3,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.455605831561735,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 51
          },
          "visualStyle": {
            "size": 60.3,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.455605831561735,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 63.333333333333336
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 60.3,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.455605831561735,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 75.66666666666667
          },
          "visualStyle": {
            "size": 60.3,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.455605831561735,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 88
          },
          "visualStyle": {
            "size": 60.3,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.455605831561735,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 14
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
            "y": 26.333333333333336
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
            "y": 38.66666666666667
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
            "y": 51
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
            "y": 63.333333333333336
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
            "y": 75.66666666666667
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
            "y": 88
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
      "interactions": [],
      "sourceCamera": {
        "mode": "wide",
        "zoom": 1
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
              "y": 14
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
              "y": 26.333333333333336
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
              "y": 38.66666666666667
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
              "y": 51
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
              "y": 63.333333333333336
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
              "y": 75.66666666666667
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
              "y": 88
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
        "interactions": [],
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
            "entityId": "queue"
          },
          {
            "type": "entity_moved",
            "entityId": "cdn",
            "from": {
              "x": 50,
              "y": 28.8
            },
            "to": {
              "x": 50,
              "y": 26.333333333333336
            }
          },
          {
            "type": "entity_moved",
            "entityId": "lb",
            "from": {
              "x": 50,
              "y": 43.6
            },
            "to": {
              "x": 50,
              "y": 38.66666666666667
            }
          },
          {
            "type": "entity_moved",
            "entityId": "app",
            "from": {
              "x": 50,
              "y": 58.400000000000006
            },
            "to": {
              "x": 50,
              "y": 51
            }
          },
          {
            "type": "entity_moved",
            "entityId": "cache",
            "from": {
              "x": 50,
              "y": 73.2
            },
            "to": {
              "x": 50,
              "y": 75.66666666666667
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
        "interactions": []
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
            "delay": 0.68,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "app",
            "action": "move",
            "delay": 0.7600000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "cache",
            "action": "move",
            "delay": 0.8400000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "queue",
            "action": "add",
            "delay": 1.9,
            "duration": 1.05,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_app_queue_dispatch",
            "delay": 3,
            "duration": 0.8,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": null,
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
              "y": 63.333333333333336
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "cdn",
            "from": {
              "x": 50,
              "y": 28.8
            },
            "to": {
              "x": 50,
              "y": 26.333333333333336
            }
          },
          {
            "id": "lb",
            "from": {
              "x": 50,
              "y": 43.6
            },
            "to": {
              "x": 50,
              "y": 38.66666666666667
            }
          },
          {
            "id": "app",
            "from": {
              "x": 50,
              "y": 58.400000000000006
            },
            "to": {
              "x": 50,
              "y": 51
            }
          },
          {
            "id": "cache",
            "from": {
              "x": 50,
              "y": 73.2
            },
            "to": {
              "x": 50,
              "y": 75.66666666666667
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
        "addedInteractions": [],
        "removedInteractions": [],
        "interactionIntensityChanged": [],
        "cameraChanged": null
      }
    },
    {
      "id": "scene_08",
      "start": 42,
      "end": 48,
      "narration": "Workers pull jobs from the Queue and update the Database while Servers stay focused on fast responses.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "position": {
            "x": 50,
            "y": 14
          },
          "visualStyle": {
            "size": 55.8,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.3622023622035435,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 24.57142857142857
          },
          "visualStyle": {
            "size": 55.8,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.3622023622035435,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 35.14285714285714
          },
          "visualStyle": {
            "size": 55.8,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.3622023622035435,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 45.714285714285715
          },
          "visualStyle": {
            "size": 55.8,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.3622023622035435,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 45.714285714285715
          },
          "visualStyle": {
            "size": 55.8,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.3622023622035435,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 45.714285714285715
          },
          "visualStyle": {
            "size": 55.8,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.3622023622035435,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 56.285714285714285
          },
          "visualStyle": {
            "size": 55.8,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.3622023622035435,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 66.85714285714286
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 55.8,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.3622023622035435,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 77.42857142857143
          },
          "visualStyle": {
            "size": 55.8,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.3622023622035435,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 88
          },
          "visualStyle": {
            "size": 55.8,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.3622023622035435,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 14
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
            "y": 24.57142857142857
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
            "y": 35.14285714285714
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
            "y": 45.714285714285715
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
            "y": 56.285714285714285
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
            "y": 66.85714285714286
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
            "y": 77.42857142857143
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
            "y": 88
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
      "interactions": [],
      "sourceCamera": {
        "mode": "wide",
        "zoom": 1
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
              "y": 14
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
              "y": 24.57142857142857
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
              "y": 35.14285714285714
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
              "y": 45.714285714285715
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
              "y": 56.285714285714285
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
              "y": 66.85714285714286
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
              "y": 77.42857142857143
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
              "y": 88
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
        "interactions": [],
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
            "entityId": "worker"
          },
          {
            "type": "entity_moved",
            "entityId": "cdn",
            "from": {
              "x": 50,
              "y": 26.333333333333336
            },
            "to": {
              "x": 50,
              "y": 24.57142857142857
            }
          },
          {
            "type": "entity_moved",
            "entityId": "lb",
            "from": {
              "x": 50,
              "y": 38.66666666666667
            },
            "to": {
              "x": 50,
              "y": 35.14285714285714
            }
          },
          {
            "type": "entity_moved",
            "entityId": "app",
            "from": {
              "x": 50,
              "y": 51
            },
            "to": {
              "x": 50,
              "y": 45.714285714285715
            }
          },
          {
            "type": "entity_moved",
            "entityId": "queue",
            "from": {
              "x": 50,
              "y": 63.333333333333336
            },
            "to": {
              "x": 50,
              "y": 56.285714285714285
            }
          },
          {
            "type": "entity_moved",
            "entityId": "cache",
            "from": {
              "x": 50,
              "y": 75.66666666666667
            },
            "to": {
              "x": 50,
              "y": 77.42857142857143
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
        "interactions": []
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
            "delay": 0.68,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "app",
            "action": "move",
            "delay": 0.7600000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "queue",
            "action": "move",
            "delay": 0.8400000000000001,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "cache",
            "action": "move",
            "delay": 0.9200000000000002,
            "duration": 0.95,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "entityId": "worker",
            "action": "add",
            "delay": 1.9,
            "duration": 1.05,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_queue_worker_dispatch",
            "delay": 3,
            "duration": 0.8,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "connectionId": "c_worker_db_commit",
            "delay": 3.08,
            "duration": 0.8,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "connectionId": "c_app_db_req",
            "delay": 3.16,
            "duration": 0.8,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": null,
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
              "y": 66.85714285714286
            }
          }
        ],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "cdn",
            "from": {
              "x": 50,
              "y": 26.333333333333336
            },
            "to": {
              "x": 50,
              "y": 24.57142857142857
            }
          },
          {
            "id": "lb",
            "from": {
              "x": 50,
              "y": 38.66666666666667
            },
            "to": {
              "x": 50,
              "y": 35.14285714285714
            }
          },
          {
            "id": "app",
            "from": {
              "x": 50,
              "y": 51
            },
            "to": {
              "x": 50,
              "y": 45.714285714285715
            }
          },
          {
            "id": "queue",
            "from": {
              "x": 50,
              "y": 63.333333333333336
            },
            "to": {
              "x": 50,
              "y": 56.285714285714285
            }
          },
          {
            "id": "cache",
            "from": {
              "x": 50,
              "y": 75.66666666666667
            },
            "to": {
              "x": 50,
              "y": 77.42857142857143
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
        "addedInteractions": [],
        "removedInteractions": [],
        "interactionIntensityChanged": [],
        "cameraChanged": null
      }
    },
    {
      "id": "scene_09",
      "start": 48,
      "end": 54,
      "narration": "Servers and Workers write to a primary Database and read from a second Database replica to spread load.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "position": {
            "x": 50,
            "y": 14
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 24.57142857142857
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 35.14285714285714
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 45.714285714285715
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 45.714285714285715
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 45.714285714285715
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 56.285714285714285
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 66.85714285714286
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 77.42857142857143
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 85
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 91
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.264950330581225,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 14
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
            "y": 24.57142857142857
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
            "y": 35.14285714285714
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
            "y": 45.714285714285715
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
            "y": 56.285714285714285
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
            "y": 66.85714285714286
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
            "y": 77.42857142857143
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
            "y": 88
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
      "interactions": [],
      "sourceCamera": {
        "mode": "wide",
        "zoom": 1
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
              "y": 14
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
              "y": 24.57142857142857
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
              "y": 35.14285714285714
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
              "y": 45.714285714285715
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
              "y": 56.285714285714285
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
              "y": 66.85714285714286
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
              "y": 77.42857142857143
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
              "y": 88
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
        "interactions": [],
        "camera": {
          "mode": "wide",
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
        "interactions": []
      },
      "animationPlan": {
        "entities": [
          {
            "entityId": "db",
            "action": "add",
            "delay": 1.9,
            "duration": 1.05,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_app_db_req",
            "delay": 3,
            "duration": 0.8,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "connectionId": "c_app_queue_dispatch",
            "delay": 3.08,
            "duration": 0.8,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": null,
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
        "addedInteractions": [],
        "removedInteractions": [],
        "interactionIntensityChanged": [],
        "cameraChanged": null
      }
    },
    {
      "id": "scene_10",
      "start": 54,
      "end": 60,
      "narration": "The final stack shows Users hitting a CDN, then a Load Balancer, then multiple Servers using a Cache, with a Queue and multiple Workers feeding updates into replicated Databases.",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "sourceEntityId": "users",
          "label": "Users",
          "position": {
            "x": 50,
            "y": 14
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 24.57142857142857
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 35.14285714285714
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 45.714285714285715
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 45.714285714285715
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 45.714285714285715
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 56.285714285714285
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 66.85714285714286
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 77.42857142857143
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 77.42857142857143
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 77.42857142857143
          },
          "enter": "zoom_in",
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 85
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 91
          },
          "visualStyle": {
            "size": 52,
            "opacity": 1,
            "color": "#4F8CFF",
            "strokeWidth": 2.244994432064365,
            "strokeColor": "#94A3B8",
            "glow": false,
            "glowColor": "#4F8CFF",
            "glowBlur": 0,
            "textColor": "#E6EDF3",
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
            "y": 14
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
            "y": 24.57142857142857
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
            "y": 35.14285714285714
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
            "y": 45.714285714285715
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
            "y": 56.285714285714285
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
            "y": 66.85714285714286
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
            "y": 77.42857142857143
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
            "y": 88
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
      "interactions": [],
      "sourceCamera": {
        "mode": "wide",
        "zoom": 1
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
              "y": 14
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
              "y": 24.57142857142857
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
              "y": 35.14285714285714
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
              "y": 45.714285714285715
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
              "y": 56.285714285714285
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
              "y": 66.85714285714286
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
              "y": 77.42857142857143
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
              "y": 88
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
        "interactions": [],
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
              "y": 77.42857142857143
            },
            "to": {
              "x": 50,
              "y": 56.285714285714285
            }
          },
          {
            "type": "entity_moved",
            "entityId": "queue",
            "from": {
              "x": 50,
              "y": 56.285714285714285
            },
            "to": {
              "x": 50,
              "y": 66.85714285714286
            }
          },
          {
            "type": "entity_moved",
            "entityId": "worker",
            "from": {
              "x": 50,
              "y": 66.85714285714286
            },
            "to": {
              "x": 50,
              "y": 77.42857142857143
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
        "interactions": []
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
          },
          {
            "entityId": "lb",
            "action": "add",
            "delay": 1.9,
            "duration": 1.05,
            "easing": "cubic-bezier(0.2,0,0,1)",
            "scale": 1.2,
            "isPrimary": true
          }
        ],
        "connections": [
          {
            "connectionId": "c_app_queue_dispatch",
            "delay": 3,
            "duration": 0.8,
            "easing": "cubic-bezier(0.2,0,0,1)"
          },
          {
            "connectionId": "c_app_db_req",
            "delay": 3.08,
            "duration": 0.8,
            "easing": "cubic-bezier(0.2,0,0,1)"
          }
        ],
        "camera": null
      },
      "cameraPlan": null,
      "sceneDiff": {
        "addedEntities": [],
        "removedEntities": [],
        "movedEntities": [
          {
            "id": "cache",
            "from": {
              "x": 50,
              "y": 77.42857142857143
            },
            "to": {
              "x": 50,
              "y": 56.285714285714285
            }
          },
          {
            "id": "queue",
            "from": {
              "x": 50,
              "y": 56.285714285714285
            },
            "to": {
              "x": 50,
              "y": 66.85714285714286
            }
          },
          {
            "id": "worker",
            "from": {
              "x": 50,
              "y": 66.85714285714286
            },
            "to": {
              "x": 50,
              "y": 77.42857142857143
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
        "addedInteractions": [],
        "removedInteractions": [],
        "interactionIntensityChanged": [],
        "cameraChanged": null
      }
    }
  ]
} as unknown as MotionRenderSpec;
const TIMELINE_EPSILON = 0.001;

export default makeScene2D(function* (view) {
  const caption = createRef<Txt>();
  view.fill(StyleTokens.colors.background);

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
  sceneState.camera.originX = view.x();
  sceneState.camera.originY = view.y();
  sceneState.camera.x = sceneState.camera.originX;
  sceneState.camera.y = sceneState.camera.originY;

  for (const scene of renderSpec.scenes) {
    const sceneDuration = scene.end - scene.start;

    if (sceneDuration <= 0) {
      throw new Error(`Invalid scene duration: ${scene.id}`);
    }

    validateSceneForRuntime(scene, logger);

    yield* waitUntil(timeline, scene.start, logger);
    yield* executeScene(view, scene, sceneState);
    advanceTimeline(timeline, sceneState.lastExecutionDuration);
    yield* waitUntil(timeline, scene.end, logger);

    sceneState.sceneIndex += 1;
  }

  if (Math.abs(timeline.current - renderSpec.duration) > TIMELINE_EPSILON) {
    logger.warn('Timeline mismatch', {
      expected: renderSpec.duration,
      actual: timeline.current,
    });
  }
});
