'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { addVisitRecord } from '@/app/actions/customer';

export function AddVisitRecordDialog({ customerId }: { customerId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const result = await addVisitRecord(customerId, formData);
    setLoading(false);
    if (result.success) {
      setOpen(false);
    } else {
      alert(result.error || '記録の保存に失敗しました');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
        来店記録を追加
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="add-visit-description">
        <DialogHeader>
          <DialogTitle>来店・セッション記録の追加</DialogTitle>
          <DialogDescription id="add-visit-description">
            本日のトレーニング内容や、お客様の様子を記録してください。
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="visitDateTime">来店日時</Label>
            <Input 
              id="visitDateTime" 
              name="visitDateTime" 
              type="datetime-local" 
              defaultValue={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="staff">担当スタッフ</Label>
            <Input id="staff" name="staff" placeholder="スタッフ名" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="trainingDetails">トレーニング内容</Label>
            <Textarea 
              id="trainingDetails" 
              name="trainingDetails" 
              placeholder="ベンチプレス 20kg 10回3セット、スクワット等" 
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bodyMetrics">身体指標（体重・体脂肪など）</Label>
            <Input id="bodyMetrics" name="bodyMetrics" placeholder="体重: 60kg, 体脂肪: 20%" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="condition">今回の状態・フィードバック</Label>
            <Textarea 
              id="condition" 
              name="condition" 
              placeholder="少しお疲れの様子。筋肉痛あり等" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nextSteps">次回への課題・申し送り</Label>
            <Textarea 
              id="nextSteps" 
              name="nextSteps" 
              placeholder="次回は下半身メインで追い込む" 
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? '保存中...' : '記録する'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
