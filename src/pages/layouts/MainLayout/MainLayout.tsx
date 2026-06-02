import { Header } from "./Header";
import { Sidebar } from "./Sidebar";


type Props={
    children: React.ReactNode
}

export function MainLayout({children}: Props){
return(
    <div className="min-h-screen bg-card text-white">
        <div className="flex min-h-screen">
            <Sidebar/>
            <div className="flex flex-1 flex-col">
            <Header userName="Jan" />
            <main className="flex-1 bg-card p-6">
                {children}
            </main>
            </div>
        </div> 
    </div>
)
}