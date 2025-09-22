let  SkillsList=[
    {id:1,name:"HTML"},
    {id:2,name:"CSS"},
    {id:3,name:"JavaScript"},
    {id:4,name:"React"},
    {id:5,name:"Redux"},
    {id:6,name:"Zustand"},
    {id:7,name:"NodeJS"},
    {id:8,name:"ExpressJS"},
    {id:9,name:"MongoDB"},
]

export default SkillsList;

export function encryptRedirectUrl(url) {
  if (!url) return "";
  return Buffer.from(url).toString("base64");
}

export function decryptRedirectUrl(encoded) {
  if (!encoded) return "";
  return Buffer.from(encoded, "base64").toString("utf-8");
}
