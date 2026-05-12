type HeaderProps={
    userName?:string,
    avatarUrl?:string
}

export  function Header({
    userName="Jan",
    avatarUrl,
}:HeaderProps){
return(
 <header className="flex items-center justify-between px-6 py-4">
    <div>
        <h1 className="text-lg font-semibold text-white">Cześć {userName}</h1>
        <p className="text-sm text-muted">Gotowy na kolejny trening?</p>
    </div>
<div>
{avatarUrl ? (
    <img src={avatarUrl} alt="Avatar użytkownika"   className="h-10 w-10 rounded-full object-cover" />
):(
    <div   className="h-10 w-10 rounded-full bg-surface"/>
)}
</div>
 </header>   
)
}