'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { updateCustomer } from '@/app/actions/customer';

export function EditCustomerDialog({ customer }: { customer: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const result = await updateCustomer(customer.id, formData);
    setLoading(false);
    if (result.success) {
      setOpen(false);
    } else {
      alert(result.error || '保存に失敗しました');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3">
        編集
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="edit-customer-description">
        <DialogHeader>
          <DialogTitle>顧客情報の編集</DialogTitle>
          <DialogDescription id="edit-customer-description">
            お客様の基本情報を変更します。
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">お名前 <span className="text-red-500">*</span></Label>
            <Input id="edit-name" name="name" required defaultValue={customer.name} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-furigana">フリガナ</Label>
            <Input id="edit-furigana" name="furigana" defaultValue={customer.furigana || ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-phone">電話番号</Label>
            <Input id="edit-phone" name="phone" type="tel" defaultValue={customer.phone || ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-email">メールアドレス</Label>
            <Input id="edit-email" name="email" type="email" defaultValue={customer.email || ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-joinDate">初回来店日（入会日）</Label>
            <Input 
              id="edit-joinDate" 
              name="joinDate" 
              type="date" 
              defaultValue={customer.joinDate ? new Date(customer.joinDate).toISOString().split('T')[0] : ''} 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-membershipPlan">会員種別</Label>
            <Select name="membershipPlan" defaultValue={customer.membershipPlan || "体験"}>
              <SelectTrigger>
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="体験">体験</SelectItem>
                <SelectItem value="回数券">回数券</SelectItem>
                <SelectItem value="都度払い">都度払い</SelectItem>
                <SelectItem value="月額フルタイム">月額フルタイム</SelectItem>
                <SelectItem value="月額デイタイム">月額デイタイム</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-initialGoals">入会時の目標</Label>
            <Input id="edit-initialGoals" name="initialGoals" defaultValue={customer.initialGoals || ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-notes">備考</Label>
            <Textarea id="edit-notes" name="notes" defaultValue={customer.notes || ''} />
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? '保存中...' : '更新する'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
