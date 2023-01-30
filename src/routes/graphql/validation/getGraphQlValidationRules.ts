import { ValidationRule } from "graphql";
import { getDepthLimitRule } from "./depthLimit";

export const getGraphQlValidationRules = (): ValidationRule[] => {
  const rules: ValidationRule[] = [];

  rules.push(getDepthLimitRule());

  return rules;
}