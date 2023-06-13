import { createContext } from "react";

export const FacekiContext = createContext({
    faceki_payload: {},
    setFacekiPayload: (data?:any) => { },
  });