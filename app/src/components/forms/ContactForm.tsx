"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, User, Phone, Mail, MessageSquare, CheckCircle, Loader2 } from "lucide-react";
import { leadSchema, type LeadFormData } from "@/lib/validations/leads";

interface LeadFormProps {
  landId: string;
  landTitle: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function LeadForm({ landId, landTitle }: LeadFormProps) {
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
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          land_id: landId,
          ...data,
          elapsedTime,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Eroare la trimiterea cererii.");
      }

      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "A apărut o eroare neașteptată."
      );
    }
  };

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl border border-border shadow-sm p-8 text-center">
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-emerald-500" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">
          Cerere trimisă cu succes!
        </h3>
        <p className="text-sm text-muted leading-relaxed mb-5">
          Mulțumim pentru interesul acordat. Te vom contacta în cel mai scurt
          timp posibil cu informații despre acest hectar.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm font-semibold text-primary hover:text-accent transition-colors cursor-pointer"
        >
          Trimite o altă cerere
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light px-7 py-6">
        <h3 className="text-lg font-bold text-white">
          Solicită informații
        </h3>
        <p className="text-xs text-white/80 mt-1.5">
          Completează formularul și te contactăm noi
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-6">
        {/* Hidden land reference */}
        <input type="hidden" value={landId} />

        {/* Referencing the land */}
        <div className="px-4 py-3 bg-surface rounded-xl border border-border">
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">
            Hectar de interes
          </p>
          <p className="text-xs font-medium text-foreground line-clamp-2 leading-relaxed">
            {landTitle}
          </p>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label
            htmlFor="lead-form-name"
            className="block text-[11px] font-semibold text-foreground/70 uppercase tracking-wider mb-2"
          >
            Nume complet *
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light pointer-events-none" />
            <input
              id="lead-form-name"
              type="text"
              {...register("nume_client")}
              maxLength={70}
              placeholder="ex: Ion Popescu"
              className={`w-full site-input-padding pr-4 py-3 bg-surface rounded-xl text-sm font-medium text-foreground placeholder:text-muted-light border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                errors.nume_client ? "border-red-500" : "border-border"
              }`}
            />
          </div>
          {errors.nume_client && (
            <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tight">{errors.nume_client.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label
            htmlFor="lead-form-phone"
            className="block text-[11px] font-semibold text-foreground/70 uppercase tracking-wider mb-2"
          >
            Telefon *
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light pointer-events-none" />
            <input
              id="lead-form-phone"
              type="tel"
              {...register("telefon")}
              onChange={(e) => {
                const sanitized = e.target.value.replace(/[^0-9+\s]/g, "");
                e.target.value = sanitized;
                register("telefon").onChange(e);
              }}
              maxLength={20}
              placeholder="ex: 0722 123 456"
              className={`w-full site-input-padding pr-4 py-3 bg-surface rounded-xl text-sm font-medium text-foreground placeholder:text-muted-light border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                errors.telefon ? "border-red-500" : "border-border"
              }`}
            />
          </div>
          {errors.telefon && (
            <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tight">{errors.telefon.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="lead-form-email"
            className="block text-[11px] font-semibold text-foreground/70 uppercase tracking-wider mb-2"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light pointer-events-none" />
            <input
              id="lead-form-email"
              type="email"
              {...register("email")}
              maxLength={100}
              placeholder="ex: ion@email.com"
              className={`w-full site-input-padding pr-4 py-3 bg-surface rounded-xl text-sm font-medium text-foreground placeholder:text-muted-light border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                errors.email ? "border-red-500" : "border-border"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tight">{errors.email.message}</p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label
            htmlFor="lead-form-message"
            className="block text-[11px] font-semibold text-foreground/70 uppercase tracking-wider mb-2"
          >
            Mesaj
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-muted-light pointer-events-none" />
            <textarea
              id="lead-form-message"
              {...register("mesaj")}
              rows={3}
              maxLength={500}
              placeholder="Doresc mai multe informații despre acest hectar..."
              className={`w-full pl-11 pr-4 py-3 bg-surface rounded-xl text-sm font-medium text-foreground placeholder:text-muted-light border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none ${
                errors.mesaj ? "border-red-500" : "border-border"
              }`}
            />
          </div>
          {errors.mesaj && (
            <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tight">{errors.mesaj.message}</p>
          )}
        </div>

        {/* Error message */}
        {status === "error" && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-xs font-medium text-red-600">{errorMessage}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-light transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
              <span>Se trimite...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 flex-shrink-0" />
              <span>Trimite cererea</span>
            </>
          )}
        </button>

        <p className="text-[10px] text-muted text-center leading-relaxed pt-1">
          Prin trimiterea formularului, ești de acord cu prelucrarea datelor tale
          personale conform politicii de confidențialitate.
        </p>
      </form>
    </div>
  );
}
