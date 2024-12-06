export interface DataTransform {
  id: string
  name: string
  amount?: number
  children?: DataTransform[]
}

export interface MRPTableData {
  gr: number[]
  sr: number[]
  poh: number[]
  nr: number[]
  pop: number[]
  por: number[]
  frequency: number
}

export interface RecapData {
  method: string
  orderCost: number
  holdingCost: number
  totalCost: number
  inventory: number
}

export interface RecapPOR {
  name: string
  level: number
  por: number[]
}

export interface RecapCost {
  name: string
  level: number
  cost: number
}

export interface LUCTable {
  n: number[]
  t: number[]
  demand: number[]
  cumulativeDemand: number[]
  totalHoldingCost: number[]
  cumulativeHoldingCost: number[]
  totalUnitCost: number[]
}

export interface LTCTable {
  n: number[]
  t: number[]
  demand: number[]
  cumulativeDemand: number[]
  totalHoldingCost: number[]
  cumulativeHoldingCost: number[]
  totalCostPeriod: number[]
}

export interface PPBTable {
  n: number[]
  t: number[]
  demand: number[]
  cumulativeDemand: number[]
  pp: number[]
  app: number[]
}
