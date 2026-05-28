import type { Product } from 'src/preload/types'

export const fourPeriodProduct: Product = {
  id: 'prod-001',
  name: 'Test Product A',
  period: 4,
  lowestLevel: 1,
  mps: [50, 60, 55, 70],
  parts: [
    {
      id: 'root-001',
      name: 'Test Product A',
      amount: 1,
      level: 0,
      parent: '',
      inventoryRecord: {
        onHand: 0,
        leadTime: 0,
        orderCost: 0,
        holdingCost: 0,
        orderQuantity: 100,
        orderPeriod: 1,
        scheduleReceipt: [
          { period: 1, amount: 0 },
          { period: 2, amount: 0 },
          { period: 3, amount: 0 },
          { period: 4, amount: 0 }
        ]
      }
    },
    {
      id: 'part-001',
      name: 'Raw Material X',
      amount: 2,
      level: 1,
      parent: 'root-001',
      inventoryRecord: {
        onHand: 40,
        leadTime: 1,
        orderCost: 50000,
        holdingCost: 1000,
        orderQuantity: 150,
        orderPeriod: 2,
        scheduleReceipt: [
          { period: 1, amount: 0 },
          { period: 2, amount: 0 },
          { period: 3, amount: 0 },
          { period: 4, amount: 0 }
        ]
      }
    }
  ],
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01')
}

export const eightPeriodProduct: Product = {
  id: 'prod-002',
  name: 'Test Product B',
  period: 8,
  lowestLevel: 1,
  mps: [100, 80, 90, 110, 95, 85, 105, 75],
  parts: [
    {
      id: 'root-002',
      name: 'Test Product B',
      amount: 1,
      level: 0,
      parent: '',
      inventoryRecord: {
        onHand: 0,
        leadTime: 0,
        orderCost: 0,
        holdingCost: 0,
        orderQuantity: 100,
        orderPeriod: 1,
        scheduleReceipt: [
          { period: 1, amount: 0 },
          { period: 2, amount: 0 },
          { period: 3, amount: 0 },
          { period: 4, amount: 0 },
          { period: 5, amount: 0 },
          { period: 6, amount: 0 },
          { period: 7, amount: 0 },
          { period: 8, amount: 0 }
        ]
      }
    },
    {
      id: 'part-002',
      name: 'Component Y',
      amount: 1,
      level: 1,
      parent: 'root-002',
      inventoryRecord: {
        onHand: 30,
        leadTime: 2,
        orderCost: 75000,
        holdingCost: 500,
        orderQuantity: 200,
        orderPeriod: 3,
        scheduleReceipt: [
          { period: 1, amount: 20 },
          { period: 2, amount: 0 },
          { period: 3, amount: 10 },
          { period: 4, amount: 0 },
          { period: 5, amount: 0 },
          { period: 6, amount: 0 },
          { period: 7, amount: 0 },
          { period: 8, amount: 0 }
        ]
      }
    }
  ],
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01')
}

export const zeroCostProduct: Product = {
  id: 'prod-003',
  name: 'Zero Cost Product',
  period: 4,
  lowestLevel: 1,
  mps: [30, 40, 35, 45],
  parts: [
    {
      id: 'root-003',
      name: 'Zero Cost Product',
      amount: 1,
      level: 0,
      parent: '',
      inventoryRecord: {
        onHand: 0,
        leadTime: 0,
        orderCost: 0,
        holdingCost: 0,
        orderQuantity: 100,
        orderPeriod: 1,
        scheduleReceipt: [
          { period: 1, amount: 0 },
          { period: 2, amount: 0 },
          { period: 3, amount: 0 },
          { period: 4, amount: 0 }
        ]
      }
    },
    {
      id: 'part-003',
      name: 'Material Z',
      amount: 1,
      level: 1,
      parent: 'root-003',
      inventoryRecord: {
        onHand: 10,
        leadTime: 0,
        orderCost: 0,
        holdingCost: 0,
        orderQuantity: 100,
        orderPeriod: 2,
        scheduleReceipt: [
          { period: 1, amount: 0 },
          { period: 2, amount: 0 },
          { period: 3, amount: 0 },
          { period: 4, amount: 0 }
        ]
      }
    }
  ],
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01')
}

export const rootOnlyProduct: Product = {
  id: 'prod-004',
  name: 'Root Only',
  period: 4,
  lowestLevel: 0,
  mps: [10, 20, 30, 40],
  parts: [
    {
      id: 'root-004',
      name: 'Root Only',
      amount: 1,
      level: 0,
      parent: '',
      inventoryRecord: {
        onHand: 0,
        leadTime: 0,
        orderCost: 0,
        holdingCost: 0,
        orderQuantity: 100,
        orderPeriod: 1,
        scheduleReceipt: []
      }
    }
  ],
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01')
}
