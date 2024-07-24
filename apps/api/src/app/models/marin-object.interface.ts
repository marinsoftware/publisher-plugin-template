export interface MarinSingleObj {
  parentId: string;
  id: string;
  status: string;
  name: string;
  properties: { name: string, value: string }[];
}

export interface MarinResponse {
  requestResult: string;
  objects: MarinSingleResponse[];
}

export interface MarinFailedResponse {
  requestResult: string;
  details: string;
}


export interface MarinSingleResponse {
  status: string;
  details: string;
  object: MarinSingleObj;
}
