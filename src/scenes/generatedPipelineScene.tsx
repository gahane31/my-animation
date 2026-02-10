import {makeScene2D, Txt} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';
import {
  createRuntimeLogger,
  createSceneState,
  executeScene,
  validateSceneForRuntime,
} from '../motion/sceneExecutor.js';
import {REEL_SAFE_OFFSET_Y} from '../motion/positioning.js';
import {advanceTimeline, createTimelineState, waitUntil} from '../motion/timeline.js';
import type {MotionRenderSpec} from '../motion/types.js';

const renderSpec: MotionRenderSpec = {
  "duration": 60,
  "scenes": [
    {
      "id": "s1_hook_counter_crash",
      "start": 0,
      "end": 2,
      "narration": "Your app works at 10 users. Then 1 million show up. What breaks first?",
      "camera": "zoom_in",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "position": {
            "x": 12,
            "y": 52
          },
          "enter": "zoom_in",
          "effects": [
            "focus"
          ]
        },
        {
          "id": "app_server_1",
          "type": "server",
          "position": {
            "x": 52,
            "y": 58
          },
          "enter": "zoom_in",
          "effects": [
            "focus",
            "zoom_in"
          ]
        }
      ]
    },
    {
      "id": "s2_setup_bottleneck_moves",
      "start": 2,
      "end": 5,
      "narration": "Scaling is just moving bottlenecks. One by one. Fast.",
      "camera": "pan_up",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "position": {
            "x": 12,
            "y": 52
          },
          "effects": [
            "focus"
          ]
        },
        {
          "id": "app_server_1",
          "type": "server",
          "position": {
            "x": 52,
            "y": 58
          },
          "effects": [
            "pan_up"
          ]
        }
      ]
    },
    {
      "id": "s3_problem_single_server_overheat",
      "start": 5,
      "end": 9,
      "narration": "First bottleneck: one server. CPU spikes. Requests pile up.",
      "camera": "focus",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "position": {
            "x": 12,
            "y": 52
          },
          "effects": [
            "pan_down"
          ]
        },
        {
          "id": "app_server_1",
          "type": "server",
          "position": {
            "x": 52,
            "y": 58
          },
          "effects": [
            "zoom_in",
            "focus"
          ]
        }
      ]
    },
    {
      "id": "s4_solution_lb_and_scale_out",
      "start": 9,
      "end": 11,
      "narration": "Fix: add a load balancer.",
      "camera": "zoom_out",
      "elements": [
        {
          "id": "lb_1",
          "type": "load_balancer",
          "position": {
            "x": 33,
            "y": 62
          },
          "enter": "zoom_in",
          "effects": [
            "focus"
          ]
        },
        {
          "id": "app_server_1",
          "type": "server",
          "position": {
            "x": 50,
            "y": 54
          },
          "effects": [
            "zoom_out"
          ]
        }
      ]
    },
    {
      "id": "s5_solution_more_app_servers",
      "start": 11,
      "end": 13,
      "narration": "Then scale out app servers. Traffic splits cleanly—now you can breathe.",
      "camera": "wide",
      "elements": [
        {
          "id": "app_server_2",
          "type": "server",
          "position": {
            "x": 58,
            "y": 60
          },
          "enter": "zoom_in",
          "effects": [
            "focus"
          ]
        },
        {
          "id": "app_server_3",
          "type": "server",
          "position": {
            "x": 58,
            "y": 48
          },
          "enter": "zoom_in",
          "effects": [
            "focus"
          ]
        },
        {
          "id": "lb_1",
          "type": "load_balancer",
          "position": {
            "x": 33,
            "y": 62
          },
          "effects": [
            "wide"
          ]
        }
      ]
    },
    {
      "id": "s6_problem_db_melts",
      "start": 13,
      "end": 17,
      "narration": "New bottleneck: the database. Every click hits it. It melts—too many connections.",
      "camera": "pan_down",
      "elements": [
        {
          "id": "db_primary",
          "type": "database",
          "position": {
            "x": 82,
            "y": 72
          },
          "enter": "zoom_in",
          "effects": [
            "zoom_in",
            "focus"
          ]
        },
        {
          "id": "app_server_1",
          "type": "server",
          "position": {
            "x": 50,
            "y": 54
          },
          "effects": [
            "pan_down"
          ]
        }
      ]
    },
    {
      "id": "s7_solution_add_cache",
      "start": 17,
      "end": 19.5,
      "narration": "Fix: cache hot data.",
      "camera": "focus",
      "elements": [
        {
          "id": "cache_1",
          "type": "cache",
          "position": {
            "x": 76,
            "y": 40
          },
          "enter": "zoom_in",
          "effects": [
            "focus"
          ]
        },
        {
          "id": "db_primary",
          "type": "database",
          "position": {
            "x": 82,
            "y": 72
          },
          "effects": [
            "zoom_out"
          ]
        }
      ]
    },
    {
      "id": "s8_solution_reads_hit_cache",
      "start": 19.5,
      "end": 22,
      "narration": "Most reads never touch the database—DB cools down.",
      "camera": "zoom_out",
      "elements": [
        {
          "id": "cache_1",
          "type": "cache",
          "position": {
            "x": 76,
            "y": 40
          },
          "effects": [
            "wide"
          ]
        },
        {
          "id": "db_primary",
          "type": "database",
          "position": {
            "x": 82,
            "y": 72
          },
          "effects": [
            "focus"
          ]
        }
      ]
    },
    {
      "id": "s9_escalation_writes_still_hurt",
      "start": 22,
      "end": 27,
      "narration": "But writes still hurt. One DB can’t handle everything.",
      "camera": "zoom_in",
      "elements": [
        {
          "id": "db_primary",
          "type": "database",
          "position": {
            "x": 82,
            "y": 72
          },
          "effects": [
            "zoom_in",
            "focus"
          ]
        },
        {
          "id": "cache_1",
          "type": "cache",
          "position": {
            "x": 76,
            "y": 40
          },
          "effects": [
            "pan_down"
          ]
        }
      ]
    },
    {
      "id": "s10_solution_read_replicas",
      "start": 27,
      "end": 30,
      "narration": "Fix: add read replicas for reads.",
      "camera": "wide",
      "elements": [
        {
          "id": "db_replica_1",
          "type": "database",
          "position": {
            "x": 74,
            "y": 62
          },
          "enter": "zoom_in",
          "effects": [
            "focus"
          ]
        },
        {
          "id": "db_replica_2",
          "type": "database",
          "position": {
            "x": 90,
            "y": 62
          },
          "enter": "zoom_in",
          "effects": [
            "focus"
          ]
        },
        {
          "id": "db_primary",
          "type": "database",
          "position": {
            "x": 82,
            "y": 76
          },
          "effects": [
            "wide"
          ]
        }
      ]
    },
    {
      "id": "s11_solution_shard_writes",
      "start": 30,
      "end": 33,
      "narration": "Then shard for writes—split the data.",
      "camera": "pan_up",
      "elements": [
        {
          "id": "db_shard_am",
          "type": "database",
          "position": {
            "x": 74,
            "y": 78
          },
          "enter": "zoom_in",
          "effects": [
            "focus"
          ]
        },
        {
          "id": "db_shard_nz",
          "type": "database",
          "position": {
            "x": 90,
            "y": 78
          },
          "enter": "zoom_in",
          "effects": [
            "focus"
          ]
        },
        {
          "id": "db_primary",
          "type": "database",
          "position": {
            "x": 82,
            "y": 76
          },
          "exit": "zoom_out"
        }
      ]
    },
    {
      "id": "s12_problem_traffic_spikes",
      "start": 33,
      "end": 38,
      "narration": "Next bottleneck: spikes. A million users don’t arrive smoothly—think Black Friday.",
      "camera": "zoom_in",
      "elements": [
        {
          "id": "users",
          "type": "users_cluster",
          "position": {
            "x": 12,
            "y": 52
          },
          "effects": [
            "zoom_in",
            "focus"
          ]
        },
        {
          "id": "lb_1",
          "type": "load_balancer",
          "position": {
            "x": 33,
            "y": 62
          },
          "effects": [
            "focus"
          ]
        },
        {
          "id": "app_server_2",
          "type": "server",
          "position": {
            "x": 58,
            "y": 60
          },
          "effects": [
            "pan_up"
          ]
        }
      ]
    },
    {
      "id": "s13_solution_add_queue",
      "start": 38,
      "end": 41,
      "narration": "Fix: queue it.",
      "camera": "pan_down",
      "elements": [
        {
          "id": "queue_1",
          "type": "queue",
          "position": {
            "x": 60,
            "y": 84
          },
          "enter": "zoom_in",
          "effects": [
            "focus"
          ]
        },
        {
          "id": "app_server_1",
          "type": "server",
          "position": {
            "x": 50,
            "y": 54
          },
          "effects": [
            "pan_down"
          ]
        }
      ]
    },
    {
      "id": "s14_solution_workers_process_jobs",
      "start": 41,
      "end": 44,
      "narration": "Background workers chew through jobs safely—app stays responsive.",
      "camera": "focus",
      "elements": [
        {
          "id": "worker_1",
          "type": "worker",
          "position": {
            "x": 82,
            "y": 90
          },
          "enter": "zoom_in",
          "effects": [
            "focus"
          ]
        },
        {
          "id": "worker_2",
          "type": "worker",
          "position": {
            "x": 92,
            "y": 90
          },
          "enter": "zoom_in",
          "effects": [
            "focus"
          ]
        },
        {
          "id": "queue_1",
          "type": "queue",
          "position": {
            "x": 60,
            "y": 84
          },
          "effects": [
            "wide"
          ]
        }
      ]
    },
    {
      "id": "s15_expansion_add_cdn_global",
      "start": 44,
      "end": 47,
      "narration": "Now go global: put static stuff on a CDN.",
      "camera": "pan_up",
      "elements": [
        {
          "id": "cdn_1",
          "type": "cdn",
          "position": {
            "x": 28,
            "y": 30
          },
          "enter": "zoom_in",
          "effects": [
            "focus"
          ]
        },
        {
          "id": "users",
          "type": "users_cluster",
          "position": {
            "x": 12,
            "y": 52
          },
          "effects": [
            "pan_up"
          ]
        }
      ]
    },
    {
      "id": "s16_expansion_latency_drops",
      "start": 47,
      "end": 50,
      "narration": "Keep users close—latency drops.",
      "camera": "zoom_out",
      "elements": [
        {
          "id": "cdn_1",
          "type": "cdn",
          "position": {
            "x": 28,
            "y": 30
          },
          "effects": [
            "wide"
          ]
        },
        {
          "id": "lb_1",
          "type": "load_balancer",
          "position": {
            "x": 33,
            "y": 62
          },
          "effects": [
            "zoom_out"
          ]
        }
      ]
    },
    {
      "id": "s17_climax_stack_reveal_part1",
      "start": 50,
      "end": 53,
      "narration": "Here’s the 1-million-user stack: load balancer, app fleet, cache, sharded DB...",
      "title": "1M-USER STACK",
      "camera": "wide",
      "elements": [
        {
          "id": "lb_1",
          "type": "load_balancer",
          "position": {
            "x": 33,
            "y": 62
          },
          "effects": [
            "focus"
          ]
        },
        {
          "id": "app_server_1",
          "type": "server",
          "position": {
            "x": 50,
            "y": 54
          },
          "effects": [
            "focus"
          ]
        },
        {
          "id": "cache_1",
          "type": "cache",
          "position": {
            "x": 76,
            "y": 40
          },
          "effects": [
            "focus"
          ]
        },
        {
          "id": "db_shard_am",
          "type": "database",
          "position": {
            "x": 74,
            "y": 78
          },
          "effects": [
            "focus"
          ]
        },
        {
          "id": "db_shard_nz",
          "type": "database",
          "position": {
            "x": 90,
            "y": 78
          },
          "effects": [
            "focus"
          ]
        }
      ]
    },
    {
      "id": "s18_climax_stack_reveal_part2",
      "start": 53,
      "end": 56,
      "narration": "...plus queue, workers, CDN, and monitoring.",
      "camera": "zoom_out",
      "elements": [
        {
          "id": "queue_1",
          "type": "queue",
          "position": {
            "x": 60,
            "y": 84
          },
          "effects": [
            "focus"
          ]
        },
        {
          "id": "worker_1",
          "type": "worker",
          "position": {
            "x": 82,
            "y": 90
          },
          "effects": [
            "focus"
          ]
        },
        {
          "id": "cdn_1",
          "type": "cdn",
          "position": {
            "x": 28,
            "y": 30
          },
          "effects": [
            "focus"
          ]
        },
        {
          "id": "users",
          "type": "users_cluster",
          "position": {
            "x": 12,
            "y": 52
          },
          "effects": [
            "wide"
          ]
        }
      ]
    },
    {
      "id": "s19_recap_bottleneck_hops",
      "start": 56,
      "end": 58.5,
      "narration": "Scale rule: fix one bottleneck… and the next one appears.",
      "camera": "pan_down",
      "elements": [
        {
          "id": "lb_1",
          "type": "load_balancer",
          "position": {
            "x": 33,
            "y": 62
          },
          "effects": [
            "focus"
          ]
        },
        {
          "id": "cache_1",
          "type": "cache",
          "position": {
            "x": 76,
            "y": 40
          },
          "effects": [
            "focus"
          ]
        },
        {
          "id": "db_shard_am",
          "type": "database",
          "position": {
            "x": 74,
            "y": 78
          },
          "effects": [
            "focus"
          ]
        },
        {
          "id": "queue_1",
          "type": "queue",
          "position": {
            "x": 60,
            "y": 84
          },
          "effects": [
            "focus"
          ]
        },
        {
          "id": "cdn_1",
          "type": "cdn",
          "position": {
            "x": 28,
            "y": 30
          },
          "effects": [
            "focus"
          ]
        }
      ]
    },
    {
      "id": "s20_ending_multiregion_failover",
      "start": 58.5,
      "end": 60,
      "narration": "Want the next step? Multi-region failover.",
      "title": "NEXT: FAILOVER",
      "camera": "wide",
      "elements": [
        {
          "id": "cdn_1",
          "type": "cdn",
          "position": {
            "x": 28,
            "y": 30
          },
          "effects": [
            "wide"
          ]
        },
        {
          "id": "lb_1",
          "type": "load_balancer",
          "position": {
            "x": 33,
            "y": 62
          },
          "effects": [
            "focus"
          ]
        }
      ]
    }
  ]
};
const TIMELINE_EPSILON = 0.001;

export default makeScene2D(function* (view) {
  const caption = createRef<Txt>();

  view.add(
    <Txt
      ref={caption}
      y={-420}
      fill={'#e2e8f0'}
      fontFamily={'JetBrains Mono'}
      fontSize={36}
      opacity={0}
      maxWidth={1500}
      textAlign={'center'}
    />,
  );

  view.x(0);
  view.y(REEL_SAFE_OFFSET_Y);

  const logger = createRuntimeLogger('runtime');
  const timeline = createTimelineState(0);
  const sceneState = createSceneState({
    caption: caption(),
    logger,
  });

  for (const scene of renderSpec.scenes) {
    const sceneDuration = scene.end - scene.start;

    if (sceneDuration <= 0) {
      throw new Error(`Invalid scene duration: ${scene.id}`);
    }

    validateSceneForRuntime(scene, logger);

    yield* waitUntil(timeline, scene.start, logger);
    yield* executeScene(view, scene, sceneState);
    advanceTimeline(timeline, sceneDuration);

    sceneState.sceneIndex += 1;
  }

  if (Math.abs(timeline.current - renderSpec.duration) > TIMELINE_EPSILON) {
    logger.warn('Timeline mismatch', {
      expected: renderSpec.duration,
      actual: timeline.current,
    });
  }
});
