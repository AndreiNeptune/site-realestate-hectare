"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Send, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  Loader2, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { leadSchema, type LeadFormData } from "@/lib/validations/leads";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const mountTime = useRef<number>(Date.now());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      nume_client: "",
      telefon: "",
      email: "",
      mesaj: "",
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    setStatus("submitting");
    setErrorMessage("");

    const elapsedTime = Date.now() - mountTime.current;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          elapsedTime,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Eroare la trimiterea mesajului.");
      }

      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "A apărut o eroare. Vă rugăm să încercați mai târziu."
      );
    }
  };

  return (
    <main className="min-h-screen bg-surface">
      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />

      {/* Hero Section */}
      <div className="bg-primary-dark pt-32 pb-24 text-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 animate-pulse-glow" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="site-main-container relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/15 mb-8">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-[11px] font-bold text-white/90 uppercase tracking-widest">
              Suntem aici pentru tine
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight mb-6 leading-tight site-text-center">
            Contactează <span className="gradient-text">HectarExpert</span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg max-w-2xl site-mx-auto leading-relaxed site-text-center">
            Aveți întrebări despre un hectar anume sau doriți să listați propria proprietate? 
            Echipa noastră de experți vă stă la dispoziție.
          </p>
        </div>
      </div>

      <section className="py-20 lg:py-32 site-main-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-12 text-center lg:text-left">
            <div>
              <h2 className="text-2xl font-black text-foreground mb-10 tracking-tight">Informații de Contact</h2>
              <div className="flex flex-col gap-10">
                <div className="flex items-center gap-7 group">
                  <div className="w-14 h-14 bg-white rounded-2xl border border-border shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-muted-light uppercase tracking-widest mb-1.5">Telefon Direct</p>
                    <p className="text-xl font-black text-foreground hover:text-primary transition-colors cursor-pointer whitespace-nowrap leading-none">0700 000 000</p>
                    <p className="text-xs text-muted-light mt-1.5">Luni - Vineri, 09:00 - 18:00</p>
                  </div>
                </div>

                <div className="flex items-center gap-7 group">
                  <div className="w-14 h-14 bg-white rounded-2xl border border-border shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-muted-light uppercase tracking-widest mb-1.5">Email Suport</p>
                    <p className="text-xl font-black text-foreground hover:text-primary transition-colors cursor-pointer leading-none">contact@hectarexpert.ro</p>
                  </div>
                </div>

                <div className="flex items-center gap-7 group">
                  <div className="w-14 h-14 bg-white rounded-2xl border border-border shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-muted-light uppercase tracking-widest mb-1.5">Sediul Central</p>
                    <p className="text-xl font-black text-foreground leading-none">București, România</p>
                    <p className="text-xs text-muted-light mt-1.5">Sector 1, Zona Herăstrău</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border">
              <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-6">Urmărește-ne</h3>
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <a href="#" className="w-10 h-10 bg-white border border-border rounded-xl flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-all shadow-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-border rounded-xl flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-all shadow-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              </div>
            </div>

            <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100 relative overflow-hidden group hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
              <ShieldCheck className="absolute top-1/2 right-0 w-40 h-40 text-emerald-500/5 -translate-y-1/2 translate-x-1/4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700" />
              <h3 className="text-lg font-black text-emerald-800 mb-2 relative z-10">Garanția Siguranței</h3>
              <p className="text-sm text-emerald-700/80 leading-relaxed mb-4 relative z-10">
                Fiecare hectar de pe platformă este verificat de consultanții noștri juridici înainte de listare.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest group-hover:gap-3 transition-all">
                Află mai multe <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5 p-8 sm:p-12 relative">
              {status === "success" ? (
                <div className="py-12 text-center animate-slide-up">
                  <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-4">Mesaj Trimis cu Succes!</h3>
                  <p className="text-muted text-base leading-relaxed max-w-sm mx-auto mb-10">
                    Mulțumim pentru interes! Un expert HectarExpert vă va contacta în cel mai scurt timp posibil.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-8 py-4 bg-primary text-white text-sm font-black rounded-2xl hover:bg-primary-light transition-all shadow-lg shadow-primary/20 flex items-center gap-2 mx-auto"
                  >
                    Trimite un alt mesaj <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-10 text-center lg:text-left">
                    <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mb-3">Trimite-ne un Mesaj</h2>
                    <p className="text-muted text-sm sm:text-base">Completați formularul de mai jos și echipa noastră vă va răspunde prompt.</p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-muted uppercase tracking-widest ml-1">Nume Complet *</label>
                        <div className="relative group">
                          <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-light group-focus-within:text-primary transition-colors pointer-events-none" />
                          <input
                            type="text"
                            {...register("nume_client")}
                            maxLength={70}
                            placeholder="ex: Ion Popescu"
                            className={`site-input-pl-fixed w-full pr-4 py-4 bg-surface rounded-2xl text-sm font-semibold text-foreground placeholder:text-muted-light border focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all ${
                              errors.nume_client ? "border-red-500" : "border-border"
                            }`}
                          />
                        </div>
                        {errors.nume_client && (
                          <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tight">{errors.nume_client.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-muted uppercase tracking-widest ml-1">Telefon *</label>
                        <div className="relative group">
                          <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-light group-focus-within:text-primary transition-colors pointer-events-none" />
                          <input
                            type="tel"
                            {...register("telefon")}
                            onChange={(e) => {
                              const sanitized = e.target.value.replace(/[^0-9+\s]/g, "");
                              e.target.value = sanitized;
                              register("telefon").onChange(e);
                            }}
                            maxLength={20}
                            placeholder="ex: 07XX XXX XXX"
                            className={`site-input-pl-fixed w-full pr-4 py-4 bg-surface rounded-2xl text-sm font-semibold text-foreground placeholder:text-muted-light border focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all ${
                              errors.telefon ? "border-red-500" : "border-border"
                            }`}
                          />
                        </div>
                        {errors.telefon && (
                          <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tight">{errors.telefon.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-muted uppercase tracking-widest ml-1">Email</label>
                      <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-light group-focus-within:text-primary transition-colors pointer-events-none" />
                        <input
                          type="email"
                          {...register("email")}
                          maxLength={100}
                          placeholder="ex: contact@exemplu.ro"
                          className={`site-input-pl-fixed w-full pr-4 py-4 bg-surface rounded-2xl text-sm font-semibold text-foreground placeholder:text-muted-light border focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all ${
                            errors.email ? "border-red-500" : "border-border"
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tight">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-muted uppercase tracking-widest ml-1">Mesaj *</label>
                      <div className="relative group">
                        <MessageSquare className="absolute left-6 top-4 w-5 h-5 text-muted-light group-focus-within:text-primary transition-colors pointer-events-none" />
                        <textarea
                          {...register("mesaj")}
                          rows={5}
                          maxLength={500}
                          placeholder="Doresc mai multe detalii despre parteneriate..."
                          className={`site-input-pl-fixed w-full pr-4 py-4 bg-surface rounded-2xl text-sm font-semibold text-foreground placeholder:text-muted-light border focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none ${
                            errors.mesaj ? "border-red-500" : "border-border"
                          }`}
                        />
                      </div>
                      {errors.mesaj && (
                        <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tight">{errors.mesaj.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="w-full py-4.5 bg-primary text-white text-sm font-black rounded-2xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group/btn disabled:opacity-70"
                    >
                      {status === "submitting" ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Se trimite...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4.5 h-4.5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                          <span>Trimite Mesajul Acum</span>
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-muted text-center pt-2 px-8">
                      Prin trimiterea acestui formular, sunteți de acord cu prelucrarea datelor cu caracter personal conform politicii HectarExpert.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Segment (Simple Decorative) */}
      <div className="site-main-container pb-20">
        <div className="h-[400px] w-full bg-border/20 rounded-[3rem] border border-border flex items-center justify-center relative overflow-hidden">
          <MapPin className="w-12 h-12 text-primary/20 absolute z-0" />
          <p className="text-sm font-bold text-muted relative z-10 tracking-widest uppercase">Hartă hartă sediu central în curând</p>
        </div>
      </div>
    </main>
  );
}
