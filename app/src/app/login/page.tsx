import { login } from './actions'
import { MapPin } from 'lucide-react'

export default async function LoginPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-gray-50/50 to-gray-50/50 pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10 px-4">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <div className="p-8 pb-6 text-center border-b border-gray-50">
            <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-xl mb-4">
              <MapPin className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              HectarExpert Admin
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Introdu credențialele pentru a accesa panoul
            </p>
          </div>
          
          <div className="p-8">
            <form className="space-y-5" action={login}>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@exemplu.ro"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700" htmlFor="password">
                  Parolă
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                  required
                />
              </div>

              {searchParams?.message && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                  {searchParams.message}
                </div>
              )}

              <button
                type="submit"
                className="w-full relative py-2.5 bg-[#1F2937] hover:bg-[#111827] text-white rounded-xl text-sm font-medium transition-all shadow-sm active:scale-[0.98] group overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Log in
                </span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              </button>
            </form>
          </div>
          <div className="bg-gray-50/50 px-8 py-4 text-center border-t border-gray-100">
             <p className="text-xs text-gray-400">
               Securizat. Numai pentru utilizatori autorizați.
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}
