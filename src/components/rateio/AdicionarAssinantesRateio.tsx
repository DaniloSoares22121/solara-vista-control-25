
import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RateioSubscriber } from "@/hooks/useRateio";
import { User, Zap, Percent, Hash } from "lucide-react";

interface AssinanteItem extends RateioSubscriber {
  selecionado: boolean;
  valor: string;
}

interface Props {
  assinantes: AssinanteItem[];
  onSelect: (assinantes: AssinanteItem[]) => void;
  tipoRateio: "porcentagem" | "prioridade";
  disabled?: boolean;
}

export const AdicionarAssinantesRateio: React.FC<Props> = ({ assinantes, onSelect, tipoRateio, disabled }) => {
  const handleSelectChange = (index: number, checked: boolean) => {
    const atualizados = assinantes.map((a, i) => 
      i === index ? { ...a, selecionado: checked, valor: checked ? a.valor : "" } : a
    );
    onSelect(atualizados);
  };

  const handleValorChange = (index: number, valor: string) => {
    const atualizados = assinantes.map((a, i) =>
      i === index ? { ...a, valor } : a
    );
    onSelect(atualizados);
  };

  const selecionados = assinantes.filter(a => a.selecionado);

  return (
    <div className="space-y-6">
      {/* Resumo */}
      {selecionados.length > 0 && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="font-medium">{selecionados.length} assinante{selecionados.length !== 1 ? 's' : ''} selecionado{selecionados.length !== 1 ? 's' : ''}</span>
              </div>
              {tipoRateio === "porcentagem" && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Percent className="h-3 w-3" />
                  {selecionados.reduce((acc, curr) => acc + Number(curr.valor || 0), 0)}% total
                </Badge>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Tabela */}
      <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Assinante
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  UC
                </div>
              </TableHead>
              <TableHead>Consumo</TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-2">
                  {tipoRateio === "porcentagem" ? <Percent className="h-4 w-4" /> : <Hash className="h-4 w-4" />}
                  {tipoRateio === "porcentagem" ? "Porcentagem" : "Prioridade"}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assinantes.map((assinante, idx) => (
              <TableRow 
                key={assinante.id} 
                className={`transition-colors ${assinante.selecionado ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'}`}
              >
                <TableCell>
                  <Checkbox
                    checked={assinante.selecionado}
                    onCheckedChange={(checked) => handleSelectChange(idx, checked as boolean)}
                    disabled={disabled}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{assinante.nome}</span>
                    <span className="text-xs text-muted-foreground">
                      ID: {assinante.id.slice(0, 8)}...
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {assinante.uc}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-green-600">
                    {assinante.consumo}
                  </span>
                </TableCell>
                <TableCell>
                  {assinante.selecionado ? (
                    <div className="flex justify-center">
                      <div className="relative">
                        <Input
                          type="number"
                          min="0"
                          step={tipoRateio === "porcentagem" ? "0.1" : "1"}
                          value={assinante.valor}
                          onChange={e => handleValorChange(idx, e.target.value)}
                          placeholder={tipoRateio === "porcentagem" ? "0.0" : "1"}
                          className="w-20 text-center"
                          disabled={disabled}
                        />
                        <div className="absolute right-2 top-2 text-xs text-muted-foreground">
                          {tipoRateio === "porcentagem" ? "%" : "#"}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">—</div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {assinantes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Nenhum assinante disponível</p>
        </div>
      )}
    </div>
  );
};
