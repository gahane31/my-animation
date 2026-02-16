import {
  DesignedMomentsVideoSchema,
  type DesignedMoment,
  type DesignedMomentsVideo,
  type Moment,
  type MomentsVideo,
} from '../schema/moment.schema.js';
import {selectTemplate} from '../design/templateSelector.js';
import {applyLayoutToMoment} from '../design/layoutEngine.js';
import type {Logger} from '../pipeline/logger.js';
import {silentLogger} from '../pipeline/logger.js';

export interface DesignDirector {
  refineMoments(momentsVideo: MomentsVideo): DesignedMomentsVideo;
}

export interface DesignDirectorDependencies {
  logger?: Logger;
}

export const createDesignDirector = (
  dependencies: DesignDirectorDependencies = {},
): DesignDirector => {
  const logger = dependencies.logger ?? silentLogger;

  const refineMoments = (momentsVideo: MomentsVideo): DesignedMomentsVideo => {
    logger.info('Design director: applying deterministic layout', {
      duration: momentsVideo.duration,
      moments: momentsVideo.moments.length,
    });

    const sortedMoments = [...momentsVideo.moments].sort((left, right) => left.start - right.start);
    const designedMomentList: DesignedMoment[] = [];

    let previousMoment: Moment | undefined;
    let previousDesignedMoment: DesignedMoment | undefined;

    for (const moment of sortedMoments) {
      const templateId = moment.template ?? selectTemplate(moment, previousMoment);

      logger.info('Design director: template selected', {
        momentId: moment.id,
        templateId,
      });

      const designedMoment = applyLayoutToMoment(
        {
          ...moment,
          template: templateId,
        },
        {
          templateId,
          previousMoment: previousDesignedMoment,
        },
      );

      designedMomentList.push(designedMoment);
      previousMoment = {
        ...moment,
        template: templateId,
      };
      previousDesignedMoment = designedMoment;
    }

    const designedMomentsVideo = {
      ...momentsVideo,
      moments: designedMomentList,
    };

    const validated = DesignedMomentsVideoSchema.parse(designedMomentsVideo);

    logger.info('Design director: layout complete', {
      moments: validated.moments.length,
    });

    return validated;
  };

  return {
    refineMoments,
  };
};
