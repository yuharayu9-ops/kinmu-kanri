"use client";
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, ShieldCheck, User, Send, ChevronRight } from 'lucide-react';

export default function AttendanceSystem() {
  const [role, setRole] = useState("staff"); // staff, shunin, kacho, sishitsucho
  const [view, setView] = useState("apply");
  const [selectedKigou, setSelectedKigou] = useState("A");

  // ぱる専用勤務記号リスト
  const kigouList = ["Ｓ", "Ｓ´", "A", "A´", "Ｂ", "Ｂ´", "C", "C´", "D", "D´", "E", "E´", "特", "休", "年", "欠", "Ｒ", "a", "a´", "ｂ", "ｂ´", "ｃ", "ｃ´", "ｄ", "ｄ´", "e", "e´", "ｐ", "f", "f´"];

  const containerStyle: React.CSSProperties = {
    maxWidth: '600px', margin: '20px auto', backgroundColor: '#fff', borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'sans-serif', overflow: 'hidden'
  };

  const headerStyle = {
    backgroundColor: role === 'staff' ? '#2563eb' : '#dc2626',
    color: 'white', padding: '15px', textAlign: 'center' as const
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '10px' }}>
      {/* 役割切り替え（開発用デモ） */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <select onChange={(e) => setRole(e.target.value)} style={{ padding: '5px', borderRadius: '5px' }}>
          <option value="staff">職員画面（申請）</option>
          <option value="shunin">主任画面（確認）</option>
          <option value="kacho">課長画面（承認）</option>
          <option value="sishitsucho">施設長画面（決裁）</option>
        </select>
      </div>

      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={{ fontSize: '18px', margin: 0 }}>
            ぱる勤務管理：{role === 'staff' ? '職員用' : '管理者承認用'}
          </h1>
        </div>

        <div style={{ padding: '20px' }}>
          {role === 'staff' ? (
            /* 職員用：申請画面 */
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold' }}><Send size={16}/> 勤務変更・休み申請</h2>
              <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label>対象日：<input type="date" style={{ width: '100%', padding: '10px' }} /></label>
                <label>新しい勤務記号：
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '5px', marginTop: '5px' }}>
                    {kigouList.map(k => (
                      <button key={k} onClick={() => setSelectedKigou(k)} style={{
                        padding: '8px 2px', backgroundColor: selectedKigou === k ? '#2563eb' : '#f3f4f6',
                        color: selectedKigou === k ? 'white' : 'black', border: '1px solid #ddd', borderRadius: '4px'
                      }}>{k}</button>
                    ))}
                  </div>
                </label>
                <label>理由：<textarea style={{ width: '100%', height: '60px' }} placeholder="例：有給取得のため"></textarea></label>
                <button style={{ padding: '15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>申請を送信（主任へ通知）</button>
              </div>
            </div>
          ) : (
            /* 管理者用：承認一覧画面 */
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold' }}><ShieldCheck size={16}/> 承認待ち案件一覧</h2>
              <div style={{ marginTop: '15px' }}>
                <div style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '10px', backgroundColor: '#f9fafb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>職員A：1/15 変更申請</strong>
                    <span style={{ fontSize: '12px', color: '#666' }}>2026/01/05受領</span>
                  </div>
                  <p style={{ margin: '10px 0', fontSize: '14px' }}>内容：休 → <span style={{ color: '#dc2626', fontWeight: 'bold' }}>年</span>（有給）</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{ flex: 1, padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '5px' }}>承認</button>
                    <button style={{ flex: 1, padding: '10px', backgroundColor: '#fff', color: '#666', border: '1px solid #ccc', borderRadius: '5px' }}>却下</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <p style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '20px' }}>
        ※承認完了後、スプレッドシートの2601形式シートに自動反映されます。
      </p>
    </div>
  );
}
