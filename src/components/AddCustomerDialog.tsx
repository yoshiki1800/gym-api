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
import { createCustomer } from '@/app/actions/customer';

export function AddCustomerDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const result = await createCustomer(formData);
    setLoading(false);
    if (result.success) {
      setOpen(false);
    } else {
      alert(result.error || '保存に失敗しました');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
        新規顧客の登録
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle>新規顧客の登録</DialogTitle>
          <DialogDescription id="dialog-description">
            お客様の基本情報を入力してください。「保存」をクリックすると登録され、管理番号が自動で割り当てられます。
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">お名前 <span className="text-red-500">*</span></Label>
            <Input id="name" name="name" required placeholder="山田 太郎" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="furigana">フリガナ</Label>
            <Input id="furigana" name="furigana" placeholder="ヤマダ タロウ" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">電話番号</Label>
            <Input id="phone" name="phone" type="tel" placeholder="090-1234-5678" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" name="email" type="email" placeholder="taro@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="joinDate">初回来店日（入会日）</Label>
            <Input id="joinDate" name="joinDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="membershipPlan">会員種別</Label>
            <Select name="membershipPlan" defaultValue="体験">
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
            <Label htmlFor="initialGoals">入会時の目標</Label>
            <Input id="initialGoals" name="initialGoals" placeholder="ダイエット、筋力アップなど" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">備考</Label>
            <Textarea id="notes" name="notes" placeholder="ケガの履歴や配慮事項など" />
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? '保存中...' : '登録する'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
