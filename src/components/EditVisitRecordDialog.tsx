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
import { updateVisitRecord, deleteVisitRecord } from '@/app/actions/customer';
import { PencilIcon, TrashIcon } from 'lucide-react';

export function EditVisitRecordDialog({ record, customerId }: { record: any, customerId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const result = await updateVisitRecord(record.id, customerId, formData);
    setLoading(false);
    if (result.success) {
      setOpen(false);
    } else {
      alert(result.error || '保存に失敗しました');
    }
  }

  async function handleDelete() {
    if (window.confirm('この来店記録を本当に削除しますか？この操作は取り消せません。')) {
      setIsDeleting(true);
      const result = await deleteVisitRecord(record.id, customerId);
      setIsDeleting(false);
      if (result.success) {
        setOpen(false);
      } else {
        alert(result.error || '削除に失敗しました');
      }
    }
  }

  const defaultDate = record.visitDateTime 
    ? new Date(new Date(record.visitDateTime).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    : '';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 text-muted-foreground">
        <PencilIcon className="h-4 w-4" />
        <span className="sr-only">編集</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="edit-visit-description">
        <DialogHeader>
          <DialogTitle>来店・セッション記録の編集</DialogTitle>
          <DialogDescription id="edit-visit-description">
            記録の内容を修正できます。
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-visitDateTime">来店日時</Label>
            <Input 
              id="edit-visitDateTime" 
              name="visitDateTime" 
              type="datetime-local" 
              defaultValue={defaultDate}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-staff">担当スタッフ</Label>
            <Input id="edit-staff" name="staff" defaultValue={record.staff || ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-trainingDetails">トレーニング内容</Label>
            <Textarea 
              id="edit-trainingDetails" 
              name="trainingDetails" 
              rows={3}
              defaultValue={record.trainingDetails || ''}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-bodyMetrics">身体指標（体重・体脂肪など）</Label>
            <Input id="edit-bodyMetrics" name="bodyMetrics" defaultValue={record.bodyMetrics || ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-condition">今回の状態・フィードバック</Label>
            <Textarea 
              id="edit-condition" 
              name="condition" 
              defaultValue={record.condition || ''}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-nextSteps">次回への課題・申し送り</Label>
            <Textarea 
              id="edit-nextSteps" 
              name="nextSteps" 
              defaultValue={record.nextSteps || ''}
            />
          </div>
          <div className="flex justify-between mt-4 items-center">
            <Button 
              type="button" 
              variant="destructive" 
              size="sm" 
              onClick={handleDelete}
              disabled={loading || isDeleting}
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              削除
            </Button>
            <Button type="submit" disabled={loading || isDeleting}>
              {loading ? '保存中...' : '更新する'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
