import { Link } from "react-router-dom";

export function Sidebar(){
    return(
        <aside className="flex w-64 flex-col border-r border-border bg-card p-4" >
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">FitPlan</h1>
            </div>
        <nav  className="flex flex-1 flex-col gap-2">
            <Link  className="rounded-xl px-4 py-3 text-muted transition hover:bg-surface hover:text-white" to="/dashboard">Przegląd</Link>
            <Link  className="rounded-xl px-4 py-3 text-muted transition hover:bg-surface hover:text-white" to="/calendar">Kalendarz</Link>
            <Link  className="rounded-xl px-4 py-3 text-muted transition hover:bg-surface hover:text-white" to="/plan">Mój Plan</Link>
            <Link  className="rounded-xl px-4 py-3 text-muted transition hover:bg-surface hover:text-white" to="/history">Historia</Link>
            <Link  className="rounded-xl px-4 py-3 text-muted transition hover:bg-surface hover:text-white" to="/progress">Postępy</Link>
            <Link  className="rounded-xl px-4 py-3 text-muted transition hover:bg-surface hover:text-white" to="/profile">Profil</Link>
    
        </nav>
        <button>Wyloguj się</button>
        </aside>
    )
}