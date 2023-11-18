export interface IParamsPost {
  page: number;
  limit: number;
  reportStatus: string | undefined;
  accountId: string | undefined;
  searchKey: string;
}

export interface IParamsInfluencer {
  page: number;
  limit: number;
}

export interface IDataPost {
  accountId: string;
  caption: string;
  countReport: string;
  createdAt: string;
  durationSeconds: number;
  fileType: string;
  id: string;
  size: number;
  snapPrice: string;
  thumbnailUrl: string;
  url: string;
}
