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

  const cardStyle: React.CSSProperties = {
    maxWidth: '400px', margin: '40px auto', backgroundColor: 'white', 
    borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden',
    fontFamily: 'sans-serif'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '20px' }}>
      <div style={cardStyle}>
        <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '20px', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Clock size={24} /> ぱる勤務管理システム
          </h1>
        </div>
        
        <div style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>{time || "00:00:00"}</div>
          <div style={{ fontSize: '18px', color: '#6b7280', marginBottom: '32px' }}>2026年1月5日</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <button 
              onClick={() => setStatus("出勤中")}
              style={{ height: '110px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
            >
              <LogIn size={32} /> 出勤
            </button>
            <button 
              onClick={() => setStatus("退勤済み")}
              style={{ height: '110px', backgroundColor: '#f43f5e', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
            >
              <LogOut size={32} /> 退勤
            </button>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '16px' }}>
              現在の状態: <span style={{ color: status === '出勤中' ? '#059669' : '#1f2937', fontWeight: 'bold' }}>{status}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
