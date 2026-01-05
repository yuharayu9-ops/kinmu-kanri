"use client";
import React, { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut, Calendar, FileText, Send } from 'lucide-react';

export default function AttendanceSystem() {
  const [time, setTime] = useState("");
  const [view, setView] = useState("punch"); // punch, application, list
  const [status, setStatus] = useState("未打刻");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('ja-JP'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const cardStyle: React.CSSProperties = {
    maxWidth: '500px', margin: '20px auto', backgroundColor: 'white', 
    borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden',
    fontFamily: 'sans-serif'
  };

  const navButtonStyle = (active: boolean) => ({
    flex: 1, padding: '12px', border: 'none', backgroundColor: active ? '#2563eb' : 'white',
    color: active ? 'white' : '#64748b', cursor: 'pointer', fontWeight: 'bold',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.3s'
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '10px' }}>
      <div style={cardStyle}>
        {/* ヘッダー */}
        <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '20px', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '20px' }}>ぱる勤務管理システム</h1>
        </div>

        {/* ナビゲーション */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
          <button onClick={() => setView("punch")} style={navButtonStyle(view === "punch")}><Clock size={18}/>打刻</button>
          <button onClick={() => setView("application")} style={navButtonStyle(view === "application")}><FileText size={18}/>申請</button>
          <button onClick={() => setView("list")} style={navButtonStyle(view === "list")}><Calendar size={18}/>勤務表</button>
        </div>
        
        <div style={{ padding: '25px' }}>
          {/* 打刻画面 */}
          {view === "punch" && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1f2937' }}>{time || "00:00:00"}</div>
              <p style={{ color: '#6b7280', marginBottom: '30px' }}>2026年1月5日</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <button onClick={() => setStatus("出勤中")} style={{ height: '100px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}><LogIn size={24}/><br/>出勤</button>
                <button onClick={() => setStatus("退勤済み")} style={{ height: '100px', backgroundColor: '#f43f5e', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}><LogOut size={24}/><br/>退勤</button>
              </div>
              <p>ステータス: <strong>{status}</strong></p>
            </div>
          )}

          {/* 申請フォーム画面 */}
          {view === "application" && (
            <div>
              <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>勤務変更・休み申請</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label>申請種別
                  <select style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
                    <option>有給休暇</option>
                    <option>勤務時間変更</option>
                    <option>欠勤</option>
                    <option>その他</option>
                  </select>
                </label>
                <label>対象日
                  <input type="date" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                </label>
                <label>理由
                  <textarea style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', height: '80px' }} placeholder="理由を入力してください"></textarea>
                </label>
                <button style={{ padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Send size={18}/> 申請を送信する
                </button>
              </div>
            </div>
          )}

          {/* 勤務表画面（仮） */}
          {view === "list" && (
            <div>
              <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>1月の勤務実績</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f8fafc' }}>
                  <tr>
                    <th style={{ padding: '10px', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>日付</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>出勤</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>退勤</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ padding: '10px', borderBottom: '1px solid #f1f5f9' }}>1/5</td><td style={{ color: '#10b981' }}>08:55</td><td>17:05</td></tr>
                  <tr><td style={{ padding: '10px', borderBottom: '1px solid #f1f5f9' }}>1/4</td><td style={{ color: '#10b981' }}>09:00</td><td>17:10</td></tr>
                </tbody>
              </table>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '20px' }}>※データ保存機能は次のステップで設定します</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
