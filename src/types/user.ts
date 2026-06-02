export type UserRole = "user" | "admin";
export type User={
    userName: string,
    avatarUrl?:string,
    email: string,
    

    role:UserRole
}