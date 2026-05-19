import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

import {auth} from "../../firebase"

export const registerUser=async(
  email:string,
  password:string
)=>{
  return createUserWithEmailAndPassword(auth,email,password)
}