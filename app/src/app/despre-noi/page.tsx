import Image from 'next/image'
import HeroImage from '@/components/ui/HeroImage'
import AnimatedCounter from "@/components/ui/AnimatedCounter"
import { CheckCircle, Map, Star, Clock, Users, ShieldCheck, Target } from "lucide-react"

export default function DespreNoiPage() {
  const stats = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      value: 1200,
      suffix: "+",
      label: "Hectare verificate",
    },
    {
      icon: <Map className="w-6 h-6" />,
      value: 42,
      suffix: "",
      label: "Județe acoperite",
    },
    {
      icon: <Star className="w-6 h-6" />,
      value: 98,
      suffix: "%",
      label: "Clienți mulțumiți",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      value: 24,
      suffix: "h",
      label: "Timp mediu răspuns",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <HeroImage
          src="/about-us.png"
          alt="HectarExpert Landscape"
          fill
          className="object-cover"
          containerClassName="absolute inset-0"
          priority
          noTransition
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60 backdrop-blur-[1px]" />
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 
            className="text-4xl md:text-7xl font-black text-white tracking-tight mb-6 animate-fade-in-up"
            style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
          >
            Povestea <span className="text-secondary">HectarExpert</span>
          </h1>
          <p 
            className="text-white/95 text-lg md:text-2xl font-medium max-w-2xl mx-auto animate-fade-in-up"
            style={{ 
              animationDelay: '0.1s',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }}
          >
            Transformăm modul în care românii investesc în pământ prin transparență, tehnologie și expertiză locală.
          </p>
        </div>
      </section>

      {/* Stats Section — Synchronized with Home */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="site-main-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  {stat.icon}
                </div>
                <AnimatedCounter
                  end={stat.value}
                  suffix={stat.suffix}
                  duration={2200}
                  className="text-3xl md:text-4xl font-black text-primary mb-1 tracking-tight"
                />
                <div className="text-[10px] md:text-xs font-bold text-muted uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-surface">
        <div className="site-main-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in-left">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-foreground mb-6 tracking-tight leading-tight">
                  Misiunea noastră: Simplificăm investițiile în terenuri
                </h2>
                <p className="text-muted text-lg leading-relaxed">
                  HectarExpert a luat naștere dintr-o nevoie clară: piața terenurilor agricole și intravilane din România era fragmentată și adesea lipsită de transparență. Ne-am propus să creăm o punte digitală între vânzători corecți și investitori vizionari.
                </p>
              </div>

              <div className="grid gap-6">
                {[
                  { 
                    icon: <ShieldCheck className="w-6 h-6 text-secondary" />, 
                    title: "Transparență Totală",
                    desc: "Fiecare anunț trece printr-un proces riguros de verificare a documentelor și coordonatelor."
                  },
                  { 
                    icon: <Target className="w-6 h-6 text-secondary" />, 
                    title: "Focalizare pe Rezultate",
                    desc: "Ajutăm investitorii să găsească cele mai profitabile hectare, adaptate viziunii lor de dezvoltare."
                  },
                  { 
                    icon: <Users className="w-6 h-6 text-secondary" />, 
                    title: "Echipă de Experți",
                    desc: "Consultanții noștri au zeci de ani de experiență cumulată în topografie, geodezie și imobiliare."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-6 bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                    <div className="shrink-0">{item.icon}</div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-muted">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-fade-in-right">
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                <Image
                  src="/hero-hectare.png"
                  alt="Team working"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 bg-primary p-8 rounded-3xl shadow-xl hidden md:block">
                <div className="text-4xl font-black text-white mb-1">100%</div>
                <div className="text-white/80 text-xs font-bold uppercase tracking-widest">Integritate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="site-main-container text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-8 tracking-tight">De ce HectarExpert?</h2>
          <p className="text-muted text-lg mb-12">
            Nu suntem doar o platformă de anunțuri. Suntem partenerul tău în identificarea celor mai bune oportunități de pe piața funciară.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center max-w-xl mx-auto">
             {["Consultantă Legală", "Analiză Topografică", "Evaluare Preț Piață", "Suport Tranzacționare"].map((tag, idx) => (
               <span key={idx} className="px-4 py-2.5 bg-surface text-foreground font-bold rounded-2xl border border-border flex items-center justify-center text-center text-sm sm:text-base">
                 {tag}
               </span>
             ))}
          </div>
        </div>
      </section>
    </div>
  )
}
