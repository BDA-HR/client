import type { UUID } from "crypto";
import type { BaseDto } from "../../hr/BaseDto";

export type { UUID };
export interface PolicyRuleCondListDto extends BaseDto {
  field: string;
  operator: string;
  value: string;
  policyAssRuleId: UUID;

  fieldStr: string;
  operatorStr: string;
  ruleName: string;
}

export interface PolicyRuleCondAddDto {
  field: string;
  operator: string;
  value: string;
  policyAssRuleId: UUID;
}

export interface PolicyRuleCondModDto {
  id: UUID;
  field: string;
  operator: string;
  value: string;
  rowVersion: string;
}