import { getCustomers } from '@/app/actions/customer';
import { AddCustomerDialog } from '@/components/AddCustomerDialog';
import { ClickableCustomerRow } from '@/components/ClickableCustomerRow';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q || '';
  const customers = await getCustomers(query);

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">顧客管理</h1>
          <p className="text-muted-foreground mt-1">
            ジムを利用するお客様の情報を管理します
          </p>
        </div>
        <AddCustomerDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>お客様一覧</CardTitle>
          <CardDescription>
            全 {customers.length} 名の登録があります。クリックすると詳細と来店記録を確認できます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="mb-6 flex gap-2">
            <Input 
              name="q" 
              defaultValue={query} 
              placeholder="名前、管理番号、メール、電話、来店日..." 
              className="max-w-sm"
            />
            <button type="submit" className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 text-sm font-medium transition-colors">
              検索
            </button>
          </form>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">管理番号</TableHead>
                  <TableHead className="min-w-[150px]">お名前</TableHead>
                  <TableHead>直近の来店日</TableHead>
                  <TableHead>来店回数</TableHead>
                  <TableHead className="min-w-[150px]">フリガナ</TableHead>
                  <TableHead>会員種別</TableHead>
                  <TableHead className="min-w-[150px]">電話番号</TableHead>
                  <TableHead>初回来店日</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      {query ? '該当するお客様が見つかりません。' : 'まだお客様の登録がありません。'}
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer, index) => (
                    <ClickableCustomerRow key={customer.id} customer={customer} index={index} />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
