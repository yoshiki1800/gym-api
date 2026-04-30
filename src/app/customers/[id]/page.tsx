import { getCustomerById } from '@/app/actions/customer';
import { AddVisitRecordDialog } from '@/components/AddVisitRecordDialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" className="mb-4">← 一覧に戻る</Button>
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{customer.name} 様</h1>
            <p className="text-muted-foreground mt-1">
              管理番号: {customer.managementNo} | {customer.furigana} | 会員種別: {customer.membershipPlan || '未設定'}
            </p>
          </div>
          <AddVisitRecordDialog customerId={customer.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-1">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <span className="text-muted-foreground block mb-1">管理番号</span>
              <p className="font-medium">{customer.managementNo}</p>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">電話番号</span>
              <p className="font-medium">{customer.phone || '未登録'}</p>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">メールアドレス</span>
              <p className="font-medium">{customer.email || '未登録'}</p>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">初回来店日</span>
              <p className="font-medium">
                {new Date(customer.joinDate).toLocaleDateString('ja-JP')}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">入会時の目標</span>
              <p className="font-medium">{customer.initialGoals || '未登録'}</p>
            </div>
            {customer.notes && (
              <div>
                <span className="text-muted-foreground block mb-1">備考</span>
                <p className="font-medium whitespace-pre-wrap">{customer.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold border-b pb-2">来店・セッション記録 ({customer.visitRecords.length}件)</h2>
          
          {customer.visitRecords.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <p>まだ来店記録がありません。</p>
                <p className="text-sm mt-1">右上のボタンから最初の記録を追加しましょう。</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {customer.visitRecords.map((record: any) => (
                <Card key={record.id} className="overflow-hidden">
                  <div className="bg-muted/50 px-4 py-2 border-b flex justify-between items-center text-sm">
                    <span className="font-medium text-foreground">
                      {new Date(record.visitDateTime).toLocaleDateString('ja-JP', { 
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </span>
                    {record.staff && (
                      <span className="text-muted-foreground">担当: {record.staff}</span>
                    )}
                  </div>
                  <CardContent className="p-4 grid gap-4 sm:grid-cols-2 text-sm">
                    {record.trainingDetails && (
                      <div className="sm:col-span-2">
                        <span className="text-muted-foreground font-medium block mb-1">トレーニング内容</span>
                        <p className="whitespace-pre-wrap">{record.trainingDetails}</p>
                      </div>
                    )}
                    {record.bodyMetrics && (
                      <div className="sm:col-span-2">
                        <span className="text-muted-foreground font-medium block mb-1">身体指標</span>
                        <p>{record.bodyMetrics}</p>
                      </div>
                    )}
                    {record.condition && (
                      <div>
                        <span className="text-muted-foreground font-medium block mb-1">状態・フィードバック</span>
                        <p className="whitespace-pre-wrap">{record.condition}</p>
                      </div>
                    )}
                    {record.nextSteps && (
                      <div>
                        <span className="text-muted-foreground font-medium block mb-1">次回課題・申し送り</span>
                        <p className="whitespace-pre-wrap">{record.nextSteps}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
