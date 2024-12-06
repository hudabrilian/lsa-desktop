import {
  LTCTable,
  LUCTable,
  MRPTableData,
  PPBTable,
  RecapCost,
  RecapData,
  RecapPOR
} from '@renderer/types'
import { mean, sum } from 'mathjs'
import { Part, Product } from 'src/preload/types'

export const LFL = ({ product, part }: { product: Product; part: Part }): MRPTableData => {
  const { inventoryRecord: ir } = part
  const jip = product.mps

  const data: MRPTableData = {
    gr: [0],
    sr: [0],
    poh: Array(product.period + 1).fill(0),
    nr: Array(product.period + 1).fill(0),
    pop: Array(product.period + 1).fill(0),
    por: Array(product.period + 1).fill(0),
    frequency: 0
  }

  data.gr.push(...jip.map((j) => j * part.amount))
  data.sr.push(...ir.scheduleReceipt.map((i) => i.amount))

  data.poh[0] = ir.onHand

  for (let i = 1; i <= product.period; i++) {
    data.nr[i] = data.gr[i] - data.sr[i] - data.poh[i]
    data.pop[i] = data.nr[i]
    data.poh[i] = data.sr[i] + data.pop[i] - data.gr[i]
    data.frequency++
  }

  for (let i = 1; i <= product.period; i++) {
    const indexToAccess = i + ir.leadTime
    data.por[i] = indexToAccess < data.pop.length ? data.pop[indexToAccess] : 0
  }

  return data
}

export const EOQ = ({
  product,
  part
}: {
  product: Product
  part: Part
}): MRPTableData & { inventory: number; demand: number; eoqValue: number } => {
  const { inventoryRecord: ir } = part
  const jip = product.mps

  const data: MRPTableData = {
    gr: [0],
    sr: [0],
    poh: Array(product.period + 1).fill(0),
    nr: Array(product.period + 1).fill(0),
    pop: Array(product.period + 1).fill(0),
    por: Array(product.period + 1).fill(0),
    frequency: 0
  }

  if (!ir.orderCost) {
    data.gr = Array(product.period + 1).fill(0)
    data.sr = Array(product.period + 1).fill(0)

    return {
      ...data,
      inventory: 0,
      demand: 0,
      eoqValue: 0
    }
  }

  let inventory = 0

  data.poh[0] = ir.onHand

  data.gr.push(...jip.map((j) => j * part.amount))
  data.sr.push(...ir.scheduleReceipt.map((i) => i.amount))

  const calcGr = data.gr.slice(1)
  const calcSr = data.sr.slice(1)

  const demand = sum(calcGr) - sum(calcSr)

  const eoqValue = Math.ceil(
    Math.sqrt((2 * (demand / product.period) * ir.orderCost) / ir.holdingCost)
  )

  for (let i = 1; i <= product.period; i++) {
    const n = data.gr[i] - data.sr[i] - data.poh[i - 1]

    if (n <= 0) {
      data.nr[i] = 0
      data.pop[i] = 0
    } else {
      data.nr[i] = n
      let a = 0

      do {
        a++
        data.pop[i] = eoqValue * a
      } while (eoqValue * a < data.nr[i])
      data.frequency++
    }

    data.poh[i] = data.poh[i - 1] + data.sr[i] + data.pop[i] - data.gr[i]
    inventory += data.poh[i]
  }

  for (let i = 1; i <= product.period; i++) {
    data.por[i] = data.pop[i + ir.leadTime] || 0
  }

  return {
    ...data,
    inventory,
    demand,
    eoqValue
  }
}

export const POQ = ({
  product,
  part
}: {
  product: Product
  part: Part
}): MRPTableData & { demand: number; poqValue: number } => {
  const { inventoryRecord: ir } = part
  const jip = product.mps

  const data: MRPTableData = {
    gr: [0],
    sr: [0],
    poh: Array(product.period + 1).fill(0),
    nr: Array(product.period + 1).fill(0),
    pop: Array(product.period + 1).fill(0),
    por: Array(product.period + 1).fill(0),
    frequency: 0
  }

  if (!ir.orderCost) {
    data.gr = Array(product.period + 1).fill(0)
    data.sr = Array(product.period + 1).fill(0)

    return {
      ...data,
      demand: 0,
      poqValue: 0
    }
  }

  data.poh[0] = ir.onHand

  data.gr.push(...jip.map((j) => j * part.amount))
  data.sr.push(...ir.scheduleReceipt.map((i) => i.amount))

  for (let i = 1; i <= product.period; i++) {
    data.nr[i] = data.gr[i] - data.sr[i] - data.poh[i - 1]
  }

  const demand = sum(data.gr) - sum(data.sr)
  const averageDemand = mean(demand)

  const poqValue = Math.ceil(
    Math.sqrt((2 * ir.orderCost) / ((ir.holdingCost * averageDemand) / product.period))
  )

  let i: number = 1
  do {
    let popValue: number = 0
    if (data.nr[i] > 0) {
      if (i + poqValue - 1 > product.period) {
        for (let a = i; a <= product.period; a++) {
          popValue += data.nr[a]
        }
        data.pop[i] = popValue
      } else {
        for (let a = i; a <= i + poqValue - 1; a++) {
          popValue += data.nr[a]
        }
        data.pop[i] = popValue
      }

      i = i + poqValue
      data.frequency++
    } else {
      i = i + 1
    }
  } while (i <= product.period)

  for (let i = 1; i <= product.period; i++) {
    data.poh[i] = data.poh[i - 1] + data.sr[i] + data.pop[i] - data.gr[i]
    data.por[i] = data.pop[i + ir.leadTime] || 0
  }

  return {
    ...data,
    demand,
    poqValue
  }
}

export const FOQ = ({ product, part }: { product: Product; part: Part }): MRPTableData => {
  const { inventoryRecord: ir } = part
  const jip = product.mps

  const data: MRPTableData = {
    gr: [0],
    sr: [0],
    poh: Array(product.period + 1).fill(0),
    nr: Array(product.period + 1).fill(0),
    pop: Array(product.period + 1).fill(0),
    por: Array(product.period + 1).fill(0),
    frequency: 0
  }

  data.poh[0] = ir.onHand

  data.gr.push(...jip.map((j) => j * part.amount))
  data.sr.push(...ir.scheduleReceipt.map((i) => i.amount))

  for (let i = 1; i <= product.period; i++) {
    const tempNr = data.gr[i] - data.sr[i] - data.poh[i - 1]
    if (tempNr <= 0) {
      data.nr[i] = 0
      data.pop[i] = 0
    } else {
      data.nr[i] = tempNr
      let a = 0
      do {
        a = a + 1
        data.pop[i] = ir.orderQuantity * a
      } while (ir.orderQuantity * a < data.nr[i])
      data.frequency++
    }
    data.poh[i] = data.poh[i - 1] + data.sr[i] + data.pop[i] - data.gr[i]
  }

  for (let i = 1; i <= product.period; i++) {
    data.poh[i] = data.poh[i - 1] + data.sr[i] + data.pop[i] - data.gr[i]
    data.por[i] = data.pop[i + ir.leadTime] || 0
  }

  return data
}

export const FPR = ({ product, part }: { product: Product; part: Part }): MRPTableData => {
  const { inventoryRecord: ir } = part
  const jip = product.mps

  const data: MRPTableData = {
    gr: [0],
    sr: [0],
    poh: Array(product.period + 1).fill(0),
    nr: Array(product.period + 1).fill(0),
    pop: Array(product.period + 1).fill(0),
    por: Array(product.period + 1).fill(0),
    frequency: 0
  }

  data.poh[0] = ir.onHand

  data.gr.push(...jip.map((j) => j * part.amount))
  data.sr.push(...ir.scheduleReceipt.map((i) => i.amount))

  for (let i = 1; i <= product.period; i++) {
    const tempNr = data.gr[i] - data.sr[i] - data.poh[i - 1]
    if (tempNr <= 0) {
      data.nr[i] = 0
      data.poh[i] = data.poh[i - 1] + data.sr[i] - data.gr[i]
    } else {
      data.nr[i] = tempNr
      data.poh[i] = 0
    }
  }

  const periodOrder = ir.orderPeriod < 1 ? 1 : ir.orderPeriod
  let i: number = 1
  do {
    let popValue: number = 0

    if (data.nr[i] > 0) {
      if (i + periodOrder - 1 > product.period) {
        for (let a = i; a <= product.period; a++) {
          popValue += data.nr[a]
        }
        data.pop[i] = popValue
      } else {
        for (let a = i; a <= i + periodOrder - 1; a++) {
          popValue += data.nr[a]
        }
        data.pop[i] = popValue
      }

      i = i + periodOrder
      data.frequency++
    } else {
      i = i + 1
    }
  } while (i <= product.period)

  for (let i = 1; i <= product.period; i++) {
    data.poh[i] = data.poh[i - 1] + data.sr[i] + data.pop[i] - data.gr[i]
    data.por[i] = data.pop[i + ir.leadTime] || 0
  }

  return data
}

export const LUC = ({
  product,
  part
}: {
  product: Product
  part: Part
}): MRPTableData & {
  lucTable: LUCTable
} => {
  const { inventoryRecord: ir } = part
  const jip = product.mps

  const data: MRPTableData = {
    gr: [0],
    sr: [0],
    poh: Array(product.period + 1).fill(0),
    nr: Array(product.period + 1).fill(0),
    pop: Array(product.period + 1).fill(0),
    por: Array(product.period + 1).fill(0),
    frequency: 0
  }

  data.poh[0] = ir.onHand

  data.gr.push(...jip.map((j) => j * part.amount))
  data.sr.push(...ir.scheduleReceipt.map((i) => i.amount))

  for (let i = 1; i <= product.period; i++) {
    data.nr[i] = data.gr[i] - data.sr[i] - data.poh[i - 1]
  }

  const lucTable: {
    demand: number[]
    cumulativeDemand: number[]
    totalHoldingCost: number[]
    cumulativeHoldingCost: number[]
    totalUnitCost: number[]
  } = {
    demand: Array(product.period + 1).fill(0),
    cumulativeDemand: Array(product.period + 1).fill(0),
    totalHoldingCost: Array(product.period + 1).fill(0),
    cumulativeHoldingCost: Array(product.period + 1).fill(0),
    totalUnitCost: Array(product.period + 1).fill(0)
  }

  const lucTableRender: LUCTable = {
    n: [],
    t: [],
    demand: [],
    cumulativeDemand: [],
    totalHoldingCost: [],
    cumulativeHoldingCost: [],
    totalUnitCost: []
  }

  let n: number = 1
  let t: number = 1
  let T: number = 1

  do {
    if (data.nr[t] === 0) {
      t = t + 1
      n = n + 1
    } else {
      lucTable.demand[T] = data.nr[t - 1 + T]
      for (let a = 1; a <= t + T - 1; a++) {
        lucTable.cumulativeDemand[T] = lucTable.cumulativeDemand[T - 1] + lucTable.demand[T]
      }
      lucTable.totalHoldingCost[T] = (T - 1) * lucTable.demand[T] * ir.holdingCost
      for (let a = 1; a <= t + T - 1; a++) {
        lucTable.cumulativeHoldingCost[T] =
          lucTable.cumulativeHoldingCost[T - 1] + lucTable.totalHoldingCost[T]
      }
      lucTable.totalUnitCost[T] =
        (ir.orderCost + lucTable.cumulativeHoldingCost[T]) / lucTable.cumulativeDemand[T]

      if (lucTableRender.n[lucTableRender.n.length - 1] === n) {
        lucTableRender.n.push(0)
        lucTableRender.t.push(0)
        lucTableRender.demand.push(0)
        lucTableRender.cumulativeDemand.push(0)
        lucTableRender.totalHoldingCost.push(0)
        lucTableRender.cumulativeHoldingCost.push(0)
        lucTableRender.totalUnitCost.push(0)
      }

      lucTableRender.n.push(n)
      lucTableRender.t.push(T)
      lucTableRender.demand.push(lucTable.demand[T])
      lucTableRender.cumulativeDemand.push(lucTable.cumulativeDemand[T])
      lucTableRender.totalHoldingCost.push(lucTable.totalHoldingCost[T])
      lucTableRender.cumulativeHoldingCost.push(lucTable.cumulativeHoldingCost[T])
      lucTableRender.totalUnitCost.push(lucTable.totalUnitCost[T])

      if (T === 1) {
        if (n < product.period) {
          T = T + 1
          n = n + 1
        } else {
          data.pop[t] = data.nr[t]
          n = n + 1
          T = 1
          t = n
          data.frequency++
        }
      } else {
        if (lucTable.totalUnitCost[T] <= lucTable.totalUnitCost[T - 1]) {
          if (n < product.period) {
            T = T + 1
            n = n + 1
          } else {
            data.pop[t] = lucTable.cumulativeDemand[T]
            n = n + 1
            T = 1
            t = n
            data.frequency++
          }
        } else {
          data.pop[t] = lucTable.cumulativeDemand[T - 1]
          T = 1
          t = n
          data.frequency++
        }
      }
    }
  } while (n <= product.period)

  for (let i = 1; i <= product.period; i++) {
    data.poh[i] = data.poh[i - 1] + data.sr[i] + data.pop[i] - data.gr[i]
    data.por[i] = data.pop[i + ir.leadTime] || 0
  }

  return {
    ...data,
    lucTable: lucTableRender
  }
}

export const LTC = ({
  product,
  part
}: {
  product: Product
  part: Part
}): MRPTableData & {
  ltcTable: LTCTable
} => {
  const { inventoryRecord: ir } = part
  const jip = product.mps

  const data: MRPTableData = {
    gr: [0],
    sr: [0],
    poh: Array(product.period + 1).fill(0),
    nr: Array(product.period + 1).fill(0),
    pop: Array(product.period + 1).fill(0),
    por: Array(product.period + 1).fill(0),
    frequency: 0
  }

  data.poh[0] = ir.onHand

  data.gr.push(...jip.map((j) => j * part.amount))
  data.sr.push(...ir.scheduleReceipt.map((i) => i.amount))

  for (let i = 1; i <= product.period; i++) {
    const tempNr = data.gr[i] - data.sr[i] - data.poh[i - 1]
    data.nr[i] = tempNr <= 0 ? 0 : tempNr
    data.poh[i] = tempNr <= 0 ? data.poh[i - 1] + data.sr[i] - data.gr[i] : 0
  }

  const ltcTable: {
    demand: number[]
    cumulativeDemand: number[]
    totalHoldingCost: number[]
    cumulativeHoldingCost: number[]
    totalCostPeriod: number[]
  } = {
    demand: Array(product.period + 1).fill(0),
    cumulativeDemand: Array(product.period + 1).fill(0),
    totalHoldingCost: Array(product.period + 1).fill(0),
    cumulativeHoldingCost: Array(product.period + 1).fill(0),
    totalCostPeriod: Array(product.period + 1).fill(0)
  }

  const ltcTableRender: LTCTable = {
    n: [],
    t: [],
    demand: [],
    cumulativeDemand: [],
    totalHoldingCost: [],
    cumulativeHoldingCost: [],
    totalCostPeriod: []
  }

  let n: number = 1
  let t: number = 1
  let T: number = 1

  do {
    if (data.nr[t] === 0) {
      t = t + 1
      n = n + 1
    } else {
      ltcTable.demand[T] = data.nr[t - 1 + T]
      for (let a = 1; a <= t + T - 1; a++) {
        ltcTable.cumulativeDemand[T] = ltcTable.cumulativeDemand[T - 1] + ltcTable.demand[T]
      }
      ltcTable.totalHoldingCost[T] = (T - 1) * ltcTable.demand[T] * ir.holdingCost
      for (let a = 1; a <= t + T - 1; a++) {
        ltcTable.cumulativeHoldingCost[T] =
          ltcTable.cumulativeHoldingCost[T - 1] + ltcTable.totalHoldingCost[T]
      }
      ltcTable.totalCostPeriod[T] = (ir.orderCost + ltcTable.cumulativeHoldingCost[T]) / T

      if (ltcTableRender.n[ltcTableRender.n.length - 1] === n) {
        ltcTableRender.n.push(0)
        ltcTableRender.t.push(0)
        ltcTableRender.demand.push(0)
        ltcTableRender.cumulativeDemand.push(0)
        ltcTableRender.totalHoldingCost.push(0)
        ltcTableRender.cumulativeHoldingCost.push(0)
        ltcTableRender.totalCostPeriod.push(0)
      }

      ltcTableRender.n.push(n)
      ltcTableRender.t.push(T)
      ltcTableRender.demand.push(ltcTable.demand[T])
      ltcTableRender.cumulativeDemand.push(ltcTable.cumulativeDemand[T])
      ltcTableRender.totalHoldingCost.push(ltcTable.totalHoldingCost[T])
      ltcTableRender.cumulativeHoldingCost.push(ltcTable.cumulativeHoldingCost[T])
      ltcTableRender.totalCostPeriod.push(ltcTable.totalCostPeriod[T])

      if (T === 1) {
        if (n < product.period) {
          T = T + 1
          n = n + 1
        } else {
          data.pop[t] = data.nr[t]
          n = n + 1
          T = 1
          t = n
          data.frequency++
        }
      } else {
        if (ltcTable.totalCostPeriod[T] <= ltcTable.totalCostPeriod[T - 1]) {
          if (n < product.period) {
            T = T + 1
            n = n + 1
          } else {
            data.pop[t] = ltcTable.cumulativeDemand[T]
            n = n + 1
            T = 1
            t = n
            data.frequency++
          }
        } else {
          data.pop[t] = ltcTable.cumulativeDemand[T - 1]
          T = 1
          t = n
          data.frequency++
        }
      }
    }
  } while (n <= product.period)

  for (let i = 1; i <= product.period; i++) {
    data.poh[i] = data.poh[i - 1] + data.sr[i] + data.pop[i] - data.gr[i]
    data.por[i] = data.pop[i + ir.leadTime] || 0
  }

  return {
    ...data,
    ltcTable: ltcTableRender
  }
}

export const PPB = ({
  product,
  part
}: {
  product: Product
  part: Part
}): MRPTableData & {
  epp: number
  ppbTable: PPBTable
} => {
  const { inventoryRecord: ir } = part
  const jip = product.mps

  const data: MRPTableData = {
    gr: [0],
    sr: [0],
    poh: Array(product.period + 1).fill(0),
    nr: Array(product.period + 1).fill(0),
    pop: Array(product.period + 1).fill(0),
    por: Array(product.period + 1).fill(0),
    frequency: 0
  }

  data.poh[0] = ir.onHand

  data.gr.push(...jip.map((j) => j * part.amount))
  data.sr.push(...ir.scheduleReceipt.map((i) => i.amount))

  for (let i = 1; i <= product.period; i++) {
    const tempNr = data.gr[i] - data.sr[i] - data.poh[i - 1]
    data.nr[i] = tempNr <= 0 ? 0 : tempNr
    data.poh[i] = tempNr <= 0 ? data.poh[i - 1] + data.sr[i] - data.gr[i] : 0
  }

  const ppbTable: {
    demand: number[]
    cumulativeDemand: number[]
    pp: number[]
    app: number[]
  } = {
    demand: Array(product.period + 1).fill(0),
    cumulativeDemand: Array(product.period + 1).fill(0),
    pp: Array(product.period + 1).fill(0),
    app: Array(product.period + 1).fill(0)
  }

  const ppbTableRender: PPBTable = {
    n: [],
    t: [],
    demand: [],
    cumulativeDemand: [],
    pp: [],
    app: []
  }

  const epp = ir.orderCost / ir.holdingCost
  let n: number = 1
  let t: number = 1
  let T: number = 1

  do {
    if (data.nr[t] === 0) {
      t = t + 1
      n = n + 1
    } else {
      ppbTable.demand[T] = data.nr[t + T - 1]
      for (let a = 1; a <= t + T - 1; a++) {
        ppbTable.cumulativeDemand[T] = ppbTable.cumulativeDemand[T - 1] + ppbTable.demand[T]
      }
      ppbTable.pp[T] = (T - 1) * ppbTable.demand[T]
      for (let a = 1; a <= T; a++) {
        ppbTable.app[T] = ppbTable.app[T - 1] + ppbTable.pp[T]
      }

      if (ppbTableRender.n[ppbTableRender.n.length - 1] === n) {
        ppbTableRender.n.push(0)
        ppbTableRender.t.push(0)
        ppbTableRender.demand.push(0)
        ppbTableRender.cumulativeDemand.push(0)
        ppbTableRender.pp.push(0)
        ppbTableRender.app.push(0)
      }

      ppbTableRender.n.push(n)
      ppbTableRender.t.push(T)
      ppbTableRender.demand.push(ppbTable.demand[T])
      ppbTableRender.cumulativeDemand.push(ppbTable.cumulativeDemand[T])
      ppbTableRender.pp.push(ppbTable.pp[T])
      ppbTableRender.app.push(ppbTable.app[T])

      if (ppbTable.app[T] <= epp) {
        if (n < product.period) {
          T = T + 1
          n = n + 1
        } else {
          data.pop[t] = ppbTable.cumulativeDemand[T]
          n = n + 1
          T = 1
          t = n
          data.frequency++
        }
      } else {
        if (T === 1) {
          data.pop[t] = ppbTable.cumulativeDemand[T]
          n = n + 1
          t = t + 1
        } else {
          data.pop[t] = ppbTable.cumulativeDemand[T - 1]
          T = 1
          t = n
        }
        data.frequency++
      }
    }
  } while (n <= product.period)

  for (let i = 1; i <= product.period; i++) {
    data.poh[i] = data.poh[i - 1] + data.sr[i] + data.pop[i] - data.gr[i]
    data.por[i] = data.pop[i + ir.leadTime] || 0
  }

  return {
    ...data,
    epp,
    ppbTable: ppbTableRender
  }
}

export const WWA = ({
  product,
  part
}: {
  product: Product
  part: Part
}): MRPTableData & {
  zTable: number[][]
  fTable: number[][]
} => {
  const { inventoryRecord: ir } = part
  const jip = product.mps

  const data: MRPTableData = {
    gr: [0],
    sr: [0],
    poh: Array(product.period + 1).fill(0),
    nr: Array(product.period + 1).fill(0),
    pop: Array(product.period + 1).fill(0),
    por: Array(product.period + 1).fill(0),
    frequency: 0
  }

  data.poh[0] = ir.onHand

  data.gr.push(...jip.map((j) => j * part.amount))
  data.sr.push(...ir.scheduleReceipt.map((i) => i.amount))

  for (let i = 1; i <= product.period; i++) {
    const tempNr = data.gr[i] - data.sr[i] - data.poh[i - 1]
    data.nr[i] = tempNr <= 0 ? 0 : tempNr
    data.poh[i] = tempNr <= 0 ? data.poh[i - 1] + data.sr[i] - data.gr[i] : 0
  }

  // Tabel z(c, e)
  const z: number[][] = Array.from({ length: product.period + 1 }, () =>
    Array(product.period + 1).fill(0)
  )

  let c = 1
  let e = 1

  do {
    z[c][0] = c
    if (c === e) {
      z[c][e] = ir.orderCost
      if (e < product.period) {
        // Changed the condition to '<' instead of '<='
        c = 1
        e = e + 1
      } else {
        // Adjusted the condition to break the loop when e reaches product.period
        break
      }
    } else {
      z[c][e] = (e - c) * data.nr[e] * ir.holdingCost + z[c][e - 1]
      c = c + 1
      // Moved the check for e to be inside the else block
      if (c > product.period) {
        // Reset c when it exceeds product.period
        c = 1
        e = e + 1
      }
    }
  } while (e <= product.period)

  //   Tabel f(c, e)
  const f: number[][] = Array.from({ length: product.period + 1 }, () =>
    Array(product.period + 1).fill(0)
  )
  const R = Array(product.period + 1).fill(0)
  const fmin = Array(product.period + 1).fill(0)

  c = 1
  e = 1

  fmin[0] = 0
  R[0] = 1

  do {
    f[c][0] = c
    if (data.nr[e] === 0) {
      fmin[e] = fmin[e - 1]
      R[e] = R[e - 1]
      c = 1
      e = e + 1
    } else {
      f[c][e] = z[c][e] + fmin[c - 1]
      if (c === e) {
        if (c === 1) {
          fmin[e] = f[c][e]
          R[e] = c
          c = 1
          e = e + 1
        } else {
          if (f[c][e] < fmin[e]) {
            fmin[e] = f[c][e]
            R[e] = c
          }
          c = 1
          e = e + 1
        }
      } else {
        if (c === 1) {
          fmin[e] = f[c][e]
          R[e] = c
          c = c + 1
        } else {
          if (f[c][e] < fmin[e]) {
            fmin[e] = f[c][e]
            R[e] = c
          }
          c = c + 1
        }
      }
    }
  } while (e <= product.period)

  e = product.period
  let t = R[e]
  let popValue = 0

  while (t !== 1 && e >= 1) {
    popValue = 0
    t = R[e]

    for (let a = t; a <= e; a++) {
      popValue += data.nr[a]
    }

    data.pop[t] = popValue

    if (data.pop[t] > 0) data.frequency++

    if (t > 1) {
      e = t - 1
    }
  }

  for (let i = 1; i <= product.period; i++) {
    data.poh[i] = data.poh[i - 1] + data.sr[i] + data.pop[i] - data.gr[i]
    data.por[i] = data.pop[i + ir.leadTime] || 0
  }

  z.shift()
  f.shift()

  return {
    ...data,
    zTable: z,
    fTable: f
  }
}

export function recapData({ product, part }: { product: Product; part: Part }): RecapData[] {
  const dataLFL = LFL({ product, part })
  const dataEOQ = EOQ({ product, part })
  const dataPOQ = POQ({ product, part })
  const dataFOQ = FOQ({ product, part })
  const dataFPR = FPR({ product, part })
  const dataLUC = LUC({ product, part })
  const dataLTC = LTC({ product, part })
  const dataPPB = PPB({ product, part })
  const dataWWA = WWA({ product, part })

  dataLFL.poh[0] = 0
  dataEOQ.poh[0] = 0
  dataPOQ.poh[0] = 0
  dataFOQ.poh[0] = 0
  dataFPR.poh[0] = 0
  dataLUC.poh[0] = 0
  dataLTC.poh[0] = 0
  dataPPB.poh[0] = 0
  dataWWA.poh[0] = 0

  const data: RecapData[] = [
    {
      method: 'LFL',
      orderCost: part.inventoryRecord.orderCost * dataLFL.frequency,
      holdingCost: part.inventoryRecord.holdingCost * sum(dataLFL.poh),
      totalCost:
        part.inventoryRecord.orderCost * dataLFL.frequency +
        part.inventoryRecord.holdingCost * sum(dataLFL.poh),
      inventory: sum(dataLFL.poh) / product.period
    },
    {
      method: 'EOQ',
      orderCost: part.inventoryRecord.orderCost * dataEOQ.frequency,
      holdingCost: part.inventoryRecord.holdingCost * dataEOQ.inventory,
      totalCost:
        part.inventoryRecord.orderCost * dataEOQ.frequency +
        part.inventoryRecord.holdingCost * dataEOQ.inventory,
      inventory: dataEOQ.inventory / product.period
    },
    {
      method: 'POQ',
      orderCost: part.inventoryRecord.orderCost * dataPOQ.frequency,
      holdingCost: part.inventoryRecord.holdingCost * sum(dataPOQ.poh),
      totalCost:
        part.inventoryRecord.orderCost * dataPOQ.frequency +
        part.inventoryRecord.holdingCost * sum(dataPOQ.poh),
      inventory: sum(dataPOQ.poh) / product.period
    },
    {
      method: 'FOQ',
      orderCost: part.inventoryRecord.orderCost * dataFOQ.frequency,
      holdingCost: part.inventoryRecord.holdingCost * sum(dataFOQ.poh),
      totalCost:
        part.inventoryRecord.orderCost * dataFOQ.frequency +
        part.inventoryRecord.holdingCost * sum(dataFOQ.poh),
      inventory: sum(dataFOQ.poh) / product.period
    },
    {
      method: 'FPR',
      orderCost: part.inventoryRecord.orderCost * dataFPR.frequency,
      holdingCost: part.inventoryRecord.holdingCost * sum(dataFPR.poh),
      totalCost:
        part.inventoryRecord.orderCost * dataFPR.frequency +
        part.inventoryRecord.holdingCost * sum(dataFPR.poh),
      inventory: sum(dataFPR.poh) / product.period
    },
    {
      method: 'LUC',
      orderCost: part.inventoryRecord.orderCost * dataLUC.frequency,
      holdingCost: part.inventoryRecord.holdingCost * sum(dataLUC.poh),
      totalCost:
        part.inventoryRecord.orderCost * dataLUC.frequency +
        part.inventoryRecord.holdingCost * sum(dataLUC.poh),
      inventory: sum(dataLUC.poh) / product.period
    },
    {
      method: 'LTC',
      orderCost: part.inventoryRecord.orderCost * dataLTC.frequency,
      holdingCost: part.inventoryRecord.holdingCost * sum(dataLTC.poh),
      totalCost:
        part.inventoryRecord.orderCost * dataLTC.frequency +
        part.inventoryRecord.holdingCost * sum(dataLTC.poh),
      inventory: sum(dataLTC.poh) / product.period
    },
    {
      method: 'PPB',
      orderCost: part.inventoryRecord.orderCost * dataPPB.frequency,
      holdingCost: part.inventoryRecord.holdingCost * sum(dataPPB.poh),
      totalCost:
        part.inventoryRecord.orderCost * dataPPB.frequency +
        part.inventoryRecord.holdingCost * sum(dataPPB.poh),
      inventory: sum(dataPPB.poh) / product.period
    },
    {
      method: 'WWA',
      orderCost: part.inventoryRecord.orderCost * dataWWA.frequency,
      holdingCost: part.inventoryRecord.holdingCost * sum(dataWWA.poh),
      totalCost:
        part.inventoryRecord.orderCost * dataWWA.frequency +
        part.inventoryRecord.holdingCost * sum(dataWWA.poh),
      inventory: sum(dataWWA.poh) / product.period
    }
  ]

  return data
}

export function recapCostData({ product }: { product: Product }): RecapCost[] {
  const data: RecapCost[] = []

  product.parts.map((part) => {
    const recap = recapData({
      product,
      part
    })

    const lowest = recap.reduce((min, b) => Math.min(min, b.totalCost), recap[0].totalCost)

    data.push({
      name: part.name,
      level: part.level,
      cost: lowest
    })
  })

  data.sort((a, b) => a.level - b.level)

  return data
}

export function selectedPOR({ product, part }: { product: Product; part: Part }): number[] {
  const data = recapData({ product, part })

  const selectedMethod = data
    .filter((d) => d.totalCost === Math.min(...data.map((item) => item.totalCost)))
    .map((d) => ({ method: d.method }))[0].method

  let por: number[] = []

  switch (selectedMethod) {
    case 'LFL':
      por = LFL({ product, part }).por
      break
    case 'EOQ':
      por = EOQ({ product, part }).por
      break
    case 'POQ':
      por = POQ({ product, part }).por
      break
    case 'FOQ':
      por = FOQ({ product, part }).por
      break
    case 'FPR':
      por = FPR({ product, part }).por
      break
    case 'LUC':
      por = LUC({ product, part }).por
      break
    case 'LTC':
      por = LTC({ product, part }).por
      break
    case 'PPB':
      por = PPB({ product, part }).por
      break
    case 'WWA':
      por = WWA({ product, part }).por
      break
    default:
      break
  }

  return por
}

export function recapPORData({ product }: { product: Product }): RecapPOR[] {
  const data: RecapPOR[] = []

  product.parts.map((part) => {
    const por = selectedPOR({
      product,
      part
    })

    por.shift()

    data.push({
      name: part.name,
      level: part.level,
      por
    })
  })

  data.sort((a, b) => a.level - b.level)

  return data
}

export function exploding({ product, part }: { product: Product; part: Part }): {
  partParent: Part
  por: number[]
  gr: number[]
} {
  const partParent = product.parts.find((p) => p.id === part.parent)!

  const por = selectedPOR({ product, part: partParent })

  por.shift()

  const gr: number[] = []
  gr.push(...product.mps.map((j) => j * part.amount))

  return {
    partParent,
    por,
    gr
  }
}
