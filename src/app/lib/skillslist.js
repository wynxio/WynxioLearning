let  SkillsList=[
    {id:1,name:"General"},
    {id:2,name:"HTML"},
    {id:3,name:"CSS"},
    {id:4,name:"JavaScript"},
    {id:5,name:"React"},
    {id:6,name:"Redux"},
    {id:7,name:"Zustand"},
    {id:8,name:"NodeJS"},
    {id:9,name:"ExpressJS"},
    {id:10,name:"MongoDB"},
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
