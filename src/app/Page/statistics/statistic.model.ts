export interface StatisticData {
    avgView:number;
    avgLike:number;
    totLike:number;
    totView:number;
    mostLike: {
      nbLike: number;
      musicName: string;
    };
    mostView: {
      nbView: number;
      musicName: string;
    };
  }