export interface Branch {
  id: string;
  name: string;
  nameAm: string;
  code: string;
  location: string;
  openDate: string;
  branchType: BranchType;
  branchStat: BranchStat;
  compId: string;
  compName: string;
  compNameAm: string;
  rowVersion?: string;
}

export enum BranchType {
  HeadOff = "Head Office",
  RegOff = "Regional",
  LocOff = "Local",
  VirOff = "Virtual"
}

export enum BranchStat {
  Active = "Active",
  InAct = "Inactive",
  UndCon = "Under construction"
}