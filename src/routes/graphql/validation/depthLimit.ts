import { ValidationRule } from 'graphql';
import * as depthLimit from 'graphql-depth-limit';

export const getDepthLimitRule = (): ValidationRule => {
  const DEPTH_LIMIT = 6;
  const validationRule = depthLimit(DEPTH_LIMIT);

  return validationRule;
};
