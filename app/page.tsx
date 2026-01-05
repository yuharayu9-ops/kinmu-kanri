"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, UserCheck, LogIn, LogOut } from 'lucide-react';

export default function AttendanceSystem() {
  const [status, setStatus] = useState("未打刻");
  const now = new Date();
  const timeString = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Clock size={24} />
            ぱる勤務管理システム
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <div className="text-5xl font-bold text-gray-800 mb-2">{timeString}</div>
            <div className="text-lg text-gray-500 font-medium">2026年1月5日</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button 
              onClick={() => setStatus("出勤中")}
              className="h-24 flex flex-col gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-lg"
            >
              <LogIn size={32} />
              出勤
            </Button>
            <Button 
              onClick={() => setStatus("退勤済み")}
              className="h-24 flex flex-col gap-2 bg-rose-500 hover:bg-rose-600 text-white text-lg"
            >
              <LogOut size={32} />
              退勤
            </Button>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <UserCheck size={20} />
              <span>現在のステータス:</span>
            </div>
            <span className={`font-bold ${status === '出勤中' ? 'text-emerald-600' : 'text-gray-500'}`}>
              {status}
            </span>
          </div>
        </CardContent>
      </Card>
      
      <p className="mt-8 text-sm text-gray-400">© 2026 ぱる勤務管理システム</p>
    </div>
  );
}
