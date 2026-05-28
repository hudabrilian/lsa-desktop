import { describe, it, expect } from 'vitest'
import {
  LFL,
  EOQ,
  POQ,
  FOQ,
  FPR,
  LUC,
  LTC,
  PPB,
  WWA,
  recapData,
  recapCostData,
  selectedPOR,
  recapPORData,
  exploding
} from '@renderer/utils/mrp'
import { fourPeriodProduct, eightPeriodProduct, zeroCostProduct } from './fixtures/products'
import type { MRPTableData } from '@renderer/types'

function assertValidMRPTable(
  data: MRPTableData,
  period: number,
  label: string,
  leadTime: number = 1
): void {
  const expectedLength = period + 1

  it(`${label}: returns correct structure`, () => {
    expect(data).toBeDefined()
    expect(data).toHaveProperty('gr')
    expect(data).toHaveProperty('sr')
    expect(data).toHaveProperty('poh')
    expect(data).toHaveProperty('nr')
    expect(data).toHaveProperty('pop')
    expect(data).toHaveProperty('por')
    expect(data).toHaveProperty('frequency')
  })

  it(`${label}: arrays have expected length (period + 1 = ${expectedLength})`, () => {
    expect(data.gr).toHaveLength(expectedLength)
    expect(data.sr).toHaveLength(expectedLength)
    expect(data.poh).toHaveLength(expectedLength)
    expect(data.nr).toHaveLength(expectedLength)
    expect(data.pop).toHaveLength(expectedLength)
    expect(data.por).toHaveLength(expectedLength)
  })

  it(`${label}: first element of gr is 0 (index 0 is unused)`, () => {
    expect(data.gr[0]).toBe(0)
  })

  it(`${label}: first element of sr is 0 (index 0 is unused)`, () => {
    expect(data.sr[0]).toBe(0)
  })

  it(`${label}: frequency is non-negative`, () => {
    expect(data.frequency).toBeGreaterThanOrEqual(0)
  })

  it(`${label}: no NaN or Infinity values`, () => {
    const allValues = [
      ...data.gr,
      ...data.sr,
      ...data.poh,
      ...data.nr,
      ...data.pop,
      ...data.por,
      data.frequency
    ]
    for (const val of allValues) {
      expect(Number.isFinite(val)).toBe(true)
    }
  })

  it(`${label}: POR at period i equals POP at period (i + leadTime) or 0 if out of range`, () => {
    for (let i = 1; i <= period; i++) {
      const expectedPor = data.pop[i + leadTime] || 0
      expect(data.por[i]).toBe(expectedPor)
    }
  })
}

// ---------------------------------------------------------------------------
// LFL
// ---------------------------------------------------------------------------
describe('LFL (Lot For Lot)', () => {
  const part = fourPeriodProduct.parts[1]

  it('computes correctly for known inputs', () => {
    const data = LFL({ product: fourPeriodProduct, part })
    const mps = fourPeriodProduct.mps
    const amount = part.amount
    const onHand = part.inventoryRecord.onHand

    expect(data.gr[1]).toBe(mps[0] * amount)
    expect(data.gr[2]).toBe(mps[1] * amount)
    expect(data.gr[3]).toBe(mps[2] * amount)
    expect(data.gr[4]).toBe(mps[3] * amount)

    expect(data.poh[0]).toBe(onHand)

    for (let i = 1; i <= 4; i++) {
      const nr = Math.max(0, data.gr[i] - data.sr[i] - data.poh[i - 1])
      expect(data.nr[i]).toBe(nr)
      expect(data.pop[i]).toBe(nr)
    }

    expect(data.frequency).toBeGreaterThanOrEqual(1)
  })

  it('handles zero-cost product without throwing', () => {
    const part = zeroCostProduct.parts[1]
    const data = LFL({ product: zeroCostProduct, part })
    expect(data.gr).toHaveLength(zeroCostProduct.period + 1)
    expect(data.frequency).toBeGreaterThanOrEqual(0)
  })
})

// ---------------------------------------------------------------------------
// EOQ
// ---------------------------------------------------------------------------
describe('EOQ (Economic Order Quantity)', () => {
  const part = fourPeriodProduct.parts[1]

  it('computes EOQ value greater than 0 when costs are positive', () => {
    const data = EOQ({ product: fourPeriodProduct, part })
    expect(data.eoqValue).toBeGreaterThan(0)
    expect(data.demand).toBeGreaterThan(0)
    expect(data.inventory).toBeGreaterThanOrEqual(0)
  })

  it('returns zeros when orderCost is 0', () => {
    const data = EOQ({ product: zeroCostProduct, part: zeroCostProduct.parts[1] })
    expect(data.eoqValue).toBe(0)
    expect(data.demand).toBe(0)
    expect(data.inventory).toBe(0)
    expect(data.frequency).toBe(0)
  })

  it('calculates demand as sum(GR) - sum(SR)', () => {
    const data = EOQ({ product: fourPeriodProduct, part })
    const gr = data.gr.slice(1)
    const sr = data.sr.slice(1)
    const sumGR = gr.reduce((a, b) => a + b, 0)
    const sumSR = sr.reduce((a, b) => a + b, 0)
    expect(data.demand).toBe(sumGR - sumSR)
  })
})

// ---------------------------------------------------------------------------
// POQ
// ---------------------------------------------------------------------------
describe('POQ (Period Order Quantity)', () => {
  const part = fourPeriodProduct.parts[1]

  it('computes POQ value greater than 0 when costs are positive', () => {
    const data = POQ({ product: fourPeriodProduct, part })
    expect(data.poqValue).toBeGreaterThan(0)
    expect(data.demand).toBeGreaterThan(0)
  })

  it('returns zeros when orderCost is 0', () => {
    const data = POQ({ product: zeroCostProduct, part: zeroCostProduct.parts[1] })
    expect(data.poqValue).toBe(0)
    expect(data.demand).toBe(0)
    expect(data.frequency).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// FOQ
// ---------------------------------------------------------------------------
describe('FOQ (Fixed Order Quantity)', () => {
  const part = fourPeriodProduct.parts[1]

  it('POP is a multiple of orderQuantity when NR > 0', () => {
    const data = FOQ({ product: fourPeriodProduct, part })
    for (let i = 1; i <= 4; i++) {
      if (data.nr[i] > 0) {
        expect(data.pop[i] % part.inventoryRecord.orderQuantity).toBe(0)
        expect(data.pop[i]).toBeGreaterThanOrEqual(data.nr[i])
      }
    }
  })
})

// ---------------------------------------------------------------------------
// FPR
// ---------------------------------------------------------------------------
describe('FPR (Fixed Period Replenishment)', () => {
  const part = fourPeriodProduct.parts[1]

  it('groups NR over orderPeriod consecutive periods', () => {
    const data = FPR({ product: fourPeriodProduct, part })
    const periodOrder = part.inventoryRecord.orderPeriod
    expect(periodOrder).toBeGreaterThan(0)

    let i = 1
    while (i <= 4) {
      if (data.nr[i] > 0) {
        let sumNR = 0
        const end = Math.min(i + periodOrder - 1, 4)
        for (let j = i; j <= end; j++) {
          sumNR += data.nr[j]
        }
        expect(data.pop[i]).toBe(sumNR)
        break
      }
      i++
    }
  })
})

// ---------------------------------------------------------------------------
// LUC
// ---------------------------------------------------------------------------
describe('LUC (Least Unit Cost)', () => {
  const part = fourPeriodProduct.parts[1]

  it('returns lucTable with matching array lengths', () => {
    const data = LUC({ product: fourPeriodProduct, part })
    expect(data.lucTable).toBeDefined()
    expect(data.lucTable.n.length).toBe(data.lucTable.t.length)
    expect(data.lucTable.demand.length).toBe(data.lucTable.t.length)
    expect(data.lucTable.cumulativeDemand.length).toBe(data.lucTable.t.length)
    expect(data.lucTable.totalHoldingCost.length).toBe(data.lucTable.t.length)
    expect(data.lucTable.cumulativeHoldingCost.length).toBe(data.lucTable.t.length)
    expect(data.lucTable.totalUnitCost.length).toBe(data.lucTable.t.length)
  })

  it('Total Unit Cost (TUC) is never negative when computed', () => {
    const data = LUC({ product: fourPeriodProduct, part })
    for (const tuc of data.lucTable.totalUnitCost) {
      if (tuc > 0) {
        expect(tuc).toBeGreaterThan(0)
      } else {
        expect(tuc).toBeGreaterThanOrEqual(0)
      }
    }
  })
})

// ---------------------------------------------------------------------------
// LTC
// ---------------------------------------------------------------------------
describe('LTC (Least Total Cost)', () => {
  const part = fourPeriodProduct.parts[1]

  it('returns ltcTable with matching array lengths', () => {
    const data = LTC({ product: fourPeriodProduct, part })
    expect(data.ltcTable).toBeDefined()
    expect(data.ltcTable.n.length).toBe(data.ltcTable.t.length)
    expect(data.ltcTable.demand.length).toBe(data.ltcTable.t.length)
    expect(data.ltcTable.cumulativeDemand.length).toBe(data.ltcTable.t.length)
    expect(data.ltcTable.totalHoldingCost.length).toBe(data.ltcTable.t.length)
    expect(data.ltcTable.cumulativeHoldingCost.length).toBe(data.ltcTable.t.length)
    expect(data.ltcTable.totalCostPeriod.length).toBe(data.ltcTable.t.length)
  })

  it('Total Cost Per Period (TCP) is never negative', () => {
    const data = LTC({ product: fourPeriodProduct, part })
    for (const tcp of data.ltcTable.totalCostPeriod) {
      expect(tcp).toBeGreaterThanOrEqual(0)
    }
  })
})

// ---------------------------------------------------------------------------
// PPB
// ---------------------------------------------------------------------------
describe('PPB (Part Period Balancing)', () => {
  const part = fourPeriodProduct.parts[1]

  it('returns ppbTable with matching array lengths', () => {
    const data = PPB({ product: fourPeriodProduct, part })
    expect(data.ppbTable).toBeDefined()
    expect(data.epp).toBeGreaterThan(0)
    expect(data.ppbTable.n.length).toBe(data.ppbTable.t.length)
    expect(data.ppbTable.demand.length).toBe(data.ppbTable.t.length)
    expect(data.ppbTable.cumulativeDemand.length).toBe(data.ppbTable.t.length)
    expect(data.ppbTable.pp.length).toBe(data.ppbTable.t.length)
    expect(data.ppbTable.app.length).toBe(data.ppbTable.t.length)
  })

  it('EPP (Economic Part Period) is orderCost / holdingCost', () => {
    const data = PPB({ product: fourPeriodProduct, part })
    const expectedEPP = part.inventoryRecord.orderCost / part.inventoryRecord.holdingCost
    expect(data.epp).toBe(expectedEPP)
  })
})

// ---------------------------------------------------------------------------
// WWA
// ---------------------------------------------------------------------------
describe('WWA (Wagner Whitin Algorithm)', () => {
  const part = fourPeriodProduct.parts[1]

  it('returns zTable and fTable as 2D arrays', () => {
    const data = WWA({ product: fourPeriodProduct, part })
    expect(data.zTable).toBeDefined()
    expect(data.fTable).toBeDefined()
    expect(data.zTable.length).toBeGreaterThan(0)
    expect(data.fTable.length).toBeGreaterThan(0)

    for (const row of data.zTable) {
      expect(Array.isArray(row)).toBe(true)
    }
    for (const row of data.fTable) {
      expect(Array.isArray(row)).toBe(true)
    }
  })

  it('zTable and fTable contain only finite numbers', () => {
    const data = WWA({ product: fourPeriodProduct, part })
    for (const row of data.zTable) {
      for (const val of row) {
        expect(Number.isFinite(val)).toBe(true)
      }
    }
    for (const row of data.fTable) {
      for (const val of row) {
        expect(Number.isFinite(val)).toBe(true)
      }
    }
  })
})

// ---------------------------------------------------------------------------
// Edge cases across all methods
// ---------------------------------------------------------------------------
describe('All methods on 8-period product with SR', () => {
  const methods: [
    string,
    (args: {
      product: typeof eightPeriodProduct
      part: typeof eightPeriodProduct extends { parts: (infer U)[] } ? U : never
    }) => MRPTableData
  ][] = [
    ['LFL', LFL],
    ['EOQ', EOQ],
    ['POQ', POQ],
    ['FOQ', FOQ],
    ['FPR', FPR],
    ['LUC', LUC],
    ['LTC', LTC],
    ['PPB', PPB],
    ['WWA', WWA]
  ]

  for (const [name, fn] of methods) {
    const part = eightPeriodProduct.parts[1]
    const data = fn({ product: eightPeriodProduct, part })

    assertValidMRPTable(
      data,
      eightPeriodProduct.period,
      `${name} (8-period)`,
      part.inventoryRecord.leadTime
    )
  }
})

// ---------------------------------------------------------------------------
// Zero-cost edge cases
// ---------------------------------------------------------------------------
describe('Zero cost edge cases', () => {
  const part = zeroCostProduct.parts[1]

  it('EOQ returns zeros when orderCost is 0', () => {
    const data = EOQ({ product: zeroCostProduct, part })
    expect(data.eoqValue).toBe(0)
    expect(data.demand).toBe(0)
    expect(data.inventory).toBe(0)
  })

  it('POQ returns zeros when orderCost is 0', () => {
    const data = POQ({ product: zeroCostProduct, part })
    expect(data.poqValue).toBe(0)
    expect(data.demand).toBe(0)
  })

  it('All methods handle zero costs without throwing', () => {
    const methods = [LFL, EOQ, POQ, FOQ, FPR, LUC, LTC, PPB, WWA]
    for (const fn of methods) {
      const data = fn({ product: zeroCostProduct, part })
      expect(data.gr).toHaveLength(zeroCostProduct.period + 1)
      expect(data.sr).toHaveLength(zeroCostProduct.period + 1)
    }
  })
})

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------
describe('recapData', () => {
  const part = fourPeriodProduct.parts[1]
  const data = recapData({ product: fourPeriodProduct, part })

  it('returns all 9 methods', () => {
    expect(data).toHaveLength(9)
    const methods = data.map((d) => d.method)
    expect(methods).toContain('LFL')
    expect(methods).toContain('EOQ')
    expect(methods).toContain('POQ')
    expect(methods).toContain('FOQ')
    expect(methods).toContain('FPR')
    expect(methods).toContain('LUC')
    expect(methods).toContain('LTC')
    expect(methods).toContain('PPB')
    expect(methods).toContain('WWA')
  })

  it('each entry has positive costs', () => {
    for (const entry of data) {
      expect(entry.totalCost).toBeGreaterThanOrEqual(0)
      expect(entry.orderCost).toBeGreaterThanOrEqual(0)
      expect(entry.holdingCost).toBeGreaterThanOrEqual(0)
    }
  })
})

describe('recapCostData', () => {
  const data = recapCostData({ product: fourPeriodProduct })

  it('returns entries sorted by level', () => {
    for (let i = 1; i < data.length; i++) {
      expect(data[i].level).toBeGreaterThanOrEqual(data[i - 1].level)
    }
  })

  it('each entry has a valid name and cost', () => {
    for (const entry of data) {
      expect(entry.name).toBeTruthy()
      expect(entry.cost).toBeGreaterThanOrEqual(0)
    }
  })
})

describe('selectedPOR', () => {
  const part = fourPeriodProduct.parts[1]
  const por = selectedPOR({ product: fourPeriodProduct, part })

  it('returns array with length period + 1', () => {
    expect(por).toHaveLength(fourPeriodProduct.period + 1)
  })

  it('all values are finite', () => {
    for (const val of por) {
      expect(Number.isFinite(val)).toBe(true)
    }
  })
})

describe('recapPORData', () => {
  const data = recapPORData({ product: fourPeriodProduct })

  it('returns entries sorted by level', () => {
    for (let i = 1; i < data.length; i++) {
      expect(data[i].level).toBeGreaterThanOrEqual(data[i - 1].level)
    }
  })

  it('each entry has POR array of correct length', () => {
    for (const entry of data) {
      expect(entry.por).toHaveLength(fourPeriodProduct.period)
    }
  })
})

describe('exploding', () => {
  const part = fourPeriodProduct.parts[1]
  const result = exploding({ product: fourPeriodProduct, part })

  it('returns parent part and arrays', () => {
    expect(result.partParent).toBeDefined()
    expect(result.por).toHaveLength(fourPeriodProduct.period)
    expect(result.gr).toHaveLength(fourPeriodProduct.period)
  })

  it('parent part is the root part', () => {
    expect(result.partParent.id).toBe('root-001')
  })

  it('all values are finite', () => {
    for (const val of result.por) {
      expect(Number.isFinite(val)).toBe(true)
    }
    for (const val of result.gr) {
      expect(Number.isFinite(val)).toBe(true)
    }
  })
})
