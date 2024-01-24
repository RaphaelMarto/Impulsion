export interface StatisticData {
    avgView:number;
    avgLike:number;
    totLike:number;
    totView:number;
    mostLike: {
      nbLike: number | null;
      musicName: string | null;
    };
    mostView: {
      nbView: number | null;
      musicName: string | null;
    };
  }