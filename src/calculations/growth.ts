import { DepositType } from "../types/deposit-type";

export interface SimParams {
  capital: number;
  monthlyAmount: number;
  annualRate: number;
  duration: number;
  depositType: DepositType;
  dynamicIncrease: number;
  tax: number;
}

export interface GrowthPoint {
  year: number;
  einzahlung: number;
  zinsen: number;
  kontostand: number;
}

export interface SimResult {
  points: GrowthPoint[];
  final?: GrowthPoint;
  totalTax: number;
  monthlyRate: number;
}

export function calculateGrowthFunction({
  capital,
  monthlyAmount,
  annualRate,
  duration,
  depositType,
  dynamicIncrease,
  tax,
}: SimParams): SimResult {
  const monthlyRate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;
  const months = duration * 12;

  let total = capital;
  let totalEinzahlung = capital;
  let yearTax = 0;

  const points: GrowthPoint[] = [];

  let totalTax = 0;

  for (let month = 1; month <= months; month++) {
    if (tax) {
      const interest = total * monthlyRate;
      const taxAmount = interest * (tax / 100);
      total += interest - taxAmount;
      yearTax += taxAmount;
      totalTax += taxAmount;
    } else {
      total *= 1 + monthlyRate;
    }

    switch (depositType) {
      case DepositType.Monthly:
        total += monthlyAmount;
        totalEinzahlung += monthlyAmount;
        break;
      case DepositType.Yearly:
        if (month % 12 === 0) {
          total += monthlyAmount;
          totalEinzahlung += monthlyAmount;
        }
        break;
    }

    if (month % 12 === 0) {
      const year = month / 12;

      const roundedTotal = parseFloat(total.toFixed(2));
      const roundedEinzahlung = parseFloat(totalEinzahlung.toFixed(2));
      const roundedZinsen = parseFloat(
        (roundedTotal - roundedEinzahlung).toFixed(2),
      );

      points.push({
        year,
        einzahlung: roundedEinzahlung,
        zinsen: roundedZinsen,
        kontostand: roundedTotal,
      });

      if (dynamicIncrease && month % 12 === 0) {
        monthlyAmount *= 1 + dynamicIncrease / 100;
      }
    }
  }

  return { points, final: points[points.length - 1], totalTax, monthlyRate };
}
