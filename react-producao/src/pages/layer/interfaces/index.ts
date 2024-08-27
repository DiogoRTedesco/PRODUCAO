export interface ListProd {
    NmObj: string;
    Qt: number;
}

export interface ProductionData {
    Dias: string;
    Inteiras?: number;
    Total: number;
}
export interface ProductionChartProps {
    data: ProductionData[];
  }