
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DiscountTableProps {
  faixaConsumo: string;
  fidelidade: string;
  anosFidelidade?: string;
}

const DiscountTable = ({ faixaConsumo, fidelidade, anosFidelidade }: DiscountTableProps) => {
  const getDescontoOptions = () => {
    const options = {
      '400-599': { sem: 13, com: { '1': 15, '2': 20 } },
      '600-1099': { sem: 15, com: { '1': 18, '2': 20 } },
      '1100-3099': { sem: 18, com: { '1': 20, '2': 22 } },
      '3100-7000': { sem: 20, com: { '1': 22, '2': 25 } },
      '7000+': { sem: 22, com: { '1': 25, '2': 27 } }
    };

    return options[faixaConsumo as keyof typeof options] || options['400-599'];
  };

  const descontoOptions = getDescontoOptions();
  
  const getCurrentDiscount = () => {
    if (fidelidade === 'sem') {
      return descontoOptions.sem;
    } else if (fidelidade === 'com' && anosFidelidade) {
      return descontoOptions.com[anosFidelidade as '1' | '2'];
    }
    return 0;
  };

  const currentDiscount = getCurrentDiscount();

  const getFaixaDisplay = (faixa: string) => {
    const displays = {
      '400-599': '400 kWh a 599 kWh',
      '600-1099': '600 kWh a 1099 kWh',
      '1100-3099': '1100 kWh a 3099 kWh',
      '3100-7000': '3100 kWh a 7000 kWh',
      '7000+': 'Maior que 7099 kWh'
    };
    return displays[faixa as keyof typeof displays] || faixa;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg text-green-700">Tabela Demonstrativa de Desconto</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Faixa de Consumo</TableHead>
              <TableHead>Sem Fidelidade</TableHead>
              <TableHead>1 Ano de Fidelidade</TableHead>
              <TableHead>2 Anos de Fidelidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries({
              '400-599': { sem: 13, com: { '1': 15, '2': 20 } },
              '600-1099': { sem: 15, com: { '1': 18, '2': 20 } },
              '1100-3099': { sem: 18, com: { '1': 20, '2': 22 } },
              '3100-7000': { sem: 20, com: { '1': 22, '2': 25 } },
              '7000+': { sem: 22, com: { '1': 25, '2': 27 } }
            }).map(([faixa, valores]) => (
              <TableRow 
                key={faixa}
                className={faixa === faixaConsumo ? 'bg-green-50 border-l-4 border-green-500' : ''}
              >
                <TableCell className="font-medium">
                  {getFaixaDisplay(faixa)}
                </TableCell>
                <TableCell className={
                  faixa === faixaConsumo && fidelidade === 'sem' 
                    ? 'bg-green-100 font-bold text-green-700' 
                    : ''
                }>
                  {valores.sem}%
                </TableCell>
                <TableCell className={
                  faixa === faixaConsumo && fidelidade === 'com' && anosFidelidade === '1'
                    ? 'bg-green-100 font-bold text-green-700' 
                    : ''
                }>
                  {valores.com['1']}%
                </TableCell>
                <TableCell className={
                  faixa === faixaConsumo && fidelidade === 'com' && anosFidelidade === '2'
                    ? 'bg-green-100 font-bold text-green-700' 
                    : ''
                }>
                  {valores.com['2']}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {faixaConsumo && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">Sua Seleção Atual:</h4>
            <div className="text-sm text-green-700">
              <p><strong>Faixa:</strong> {getFaixaDisplay(faixaConsumo)}</p>
              <p><strong>Tipo:</strong> {fidelidade === 'sem' ? 'Sem Fidelidade' : `Com Fidelidade (${anosFidelidade} ano${anosFidelidade === '1' ? '' : 's'})`}</p>
              <p><strong>Desconto:</strong> <span className="text-lg font-bold text-green-600">{currentDiscount}%</span></p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiscountTable;
