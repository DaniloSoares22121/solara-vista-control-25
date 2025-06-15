
import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RateioSubscriber } from "@/hooks/useRateio";

interface AssinanteItem extends RateioSubscriber {
  selecionado: boolean;
  valor: string; // percentual ou prioridade informado
}

interface Props {
  assinantes: AssinanteItem[];
  onSelect: (assinantes: AssinanteItem[]) => void;
  tipoRateio: "porcentagem" | "prioridade";
}

export const AdicionarAssinantesRateio: React.FC<Props> = ({ assinantes, onSelect, tipoRateio }) => {
  const handleChange = (index: number, checked: boolean) => {
    const atual = assinantes.map((a, i) => 
      i === index ? { ...a, selecionado: checked } : a
    );
    onSelect(atual);
  };

  const handleValorChange = (index: number, valor: string) => {
    const atual = assinantes.map((a, i) => 
      i === index ? { ...a, valor } : a
    );
    onSelect(atual);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>Nome</TableHead>
            <TableHead>UC</TableHead>
            <TableHead>Consumo</TableHead>
            <TableHead>
              {tipoRateio === "porcentagem" ? "% Rateio" : "Prioridade"}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assinantes.map((assinante, index) => (
            <TableRow key={assinante.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={assinante.selecionado}
                  onChange={(e) => handleChange(index, e.target.checked)}
                  className="accent-primary"
                />
              </TableCell>
              <TableCell>{assinante.nome}</TableCell>
              <TableCell>{assinante.uc}</TableCell>
              <TableCell>{assinante.consumo}</TableCell>
              <TableCell>
                {assinante.selecionado && (
                  <Input
                    type="number"
                    min="0"
                    value={assinante.valor}
                    onChange={(e) => handleValorChange(index, e.target.value)}
                    placeholder={tipoRateio === "porcentagem" ? "Ex: 20" : "Ex: 1"}
                    className="w-24"
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
