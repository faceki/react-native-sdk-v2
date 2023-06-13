import APIService from './httpService'


export const getKycRules = async()=>{

   return await APIService.get("/kycrules/api/kycrules")

}
export const postMultiKYC = async(formData:FormData)=>{

   return await APIService.post("/kycverify/api/kycverify/multi-kyc-verification",formData,{headers:{'Content-Type': 'multipart/form-data'}})

}