
import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { RateioSubscriber } from "@/hooks/useRateio";

interface AssinanteItem extends RateioSubscriber {
  selecionado: boolean;
  valor: string;            // valor informado (porcentagem ou prioridade)
}

interface Props {
  assinantes: AssinanteItem[];
  onSelect: (assinantes: AssinanteItem[]) => void;
  tipoRateio: "porcentagem" | "prioridade";
  disabled?: boolean;
}

export const AdicionarAssinantesRateio: React.FC<Props> = ({ assinantes, onSelect, tipoRateio, disabled }) => {
  // Seleção para adicionar/remover assinantes no rateio
  const handleSelectChange = (index: number, checked: boolean) => {
    const atualizados = assinantes.map((a, i) => 
      i === index ? { ...a, selecionado: checked, valor: checked ? a.valor : "" } : a
    );
    onSelect(atualizados);
  };

  // Atualizar valor do rateio (porcentagem/prioridade)
  const handleValorChange = (index: number, valor: string) => {
    const atualizados = assinantes.map((a, i) =>
      i === index ? { ...a, valor } : a
    );
    onSelect(atualizados);
  };

  return (
    <div className="overflow-auto">
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
          {assinantes.map((assinante, idx) => (
            <TableRow key={assinante.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={assinante.selecionado}
                  onChange={e => handleSelectChange(idx, e.target.checked)}
                  disabled={disabled}
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
                    step={tipoRateio === "porcentagem" ? "any" : "1"}
                    value={assinante.valor}
                    onChange={e => handleValorChange(idx, e.target.value)}
                    placeholder={tipoRateio === "porcentagem" ? "Ex: 20" : "Ex: 1"}
                    className="w-24"
                    disabled={disabled}
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
