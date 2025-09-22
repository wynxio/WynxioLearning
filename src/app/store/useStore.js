// store/useCounterStore.js
import { create } from 'zustand'

const useAppStore = create((set) => ({
  isLogined: false,
  isStudentLogined:false,
  student_auth_name: '',
  student_skills: [],
  student_team: '',
  
  auth_name: '' ,
  role: '',

  // Single function to set login data
  setLogin: (role,name) =>
    set({
      isLogined: true,
      auth_name: name,
      role:role
    }),
 setStudentLogin: (name,skills,team) =>
    set({
      isStudentLogined: true,
      student_auth_name: name ,
      student_skills:skills,
      student_team:team
    }),
  // Logout function
  setLogout: () =>
    set({
      isLogined: false,
      auth_name: '',
      role: ''
    }),
  setStudentLogout: () =>
    set({
      isStudentLogined: false,
      student_auth_name: '' ,
      student_skills:[]
    })
    
}))

export default useAppStore
