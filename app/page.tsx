"use client";
import React, { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut } from 'lucide-react';

export default function AttendanceSystem() {
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("未打刻");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('ja-JP'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto', backgroundColor: 'white', borderRadius: '12px', shadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '20px', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Clock size={24} /> ぱる勤務管理システム
          </h1>
        </div>
        
        <div style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>{time || "読み込み中..."}</div>
          <div style={{ fontSize: '18px', color: '#6b7280', marginBottom: '30px' }}>2026年1月5日</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
            <button 
              onClick={() => setStatus("出勤中")}
              style={{ height: '100px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <LogIn size={28} /> 出勤
            </button>
            <button 
              onClick={() => setStatus("退勤済み")}
              style={{ height: '100px', backgroundColor: '#f43f5e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <LogOut size={28} /> 退勤
            </button>
          </div>

          <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <p style={{ margin: 0, color: '#4b5563' }}>現在の状態: <strong>{status}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
