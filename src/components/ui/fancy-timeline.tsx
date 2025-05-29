// src/components/FancyTimeline.tsx
import * as React from "react";
import { ShoppingCart, Truck, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  historico?: Array<{
    etapa: string;
    status: "done" | "waiting" | "error";
  }>;
}

interface Props {
  transaction: Transaction;
}

export function FancyTimeline({ transaction }: Props) {
  const iconsMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Capturado: ShoppingCart,
    Validado:  Truck,
    Publicado: FileText,
  };

  return (
    <div className="flex items-center">
      {/* linha antes do primeiro ícone */}
      <div className="flex-1 h-px bg-gray-200"></div>
      {transaction.historico?.map((step: { etapa: string; status: string }, i: React.Key | null | undefined) => {
        const Icon = iconsMap[step.etapa] || FileText;

        // defina angulos e cores conforme status
        const gradient =
          step.status === "done"
            ? "conic-gradient(#38a169 0deg 360deg)"
            : step.status === "waiting"
            ? "conic-gradient(#38a169 0deg 45deg, #dd6b20 45deg 90deg, #e2e8f0 90deg 360deg)"
            : "conic-gradient(#e53e3e 0deg 360deg)";

        return (
          <React.Fragment key={i}>
            {/* circulo */}
            <div className="relative flex-none w-12 h-12 mx-2">
              <div className="absolute inset-0 rounded-full border border-gray-200" />
              <div
                className="absolute inset-[2px] rounded-full"
                style={{ background: gradient }}
              />
              <div className="relative z-10 w-full h-full bg-white rounded-full flex items-center justify-center">
                <Icon className="w-6 h-6 text-gray-700" />
              </div>
            </div>

            {/* label */}
            <div className="absolute mt-14 text-xs text-center w-16 left-1/2 transform -translate-x-1/2">
              {step.etapa}
            </div>

            {/* linha após o ícone */}
            <div className="flex-1 h-px bg-gray-200"></div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
