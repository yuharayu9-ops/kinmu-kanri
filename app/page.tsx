"use client";
import React, { useState, useEffect } from 'react';

// 先ほど取得したApps ScriptのURLをここに入れます
const API_URL = "https://script.google.com/macros/s/AKfycbwQotnZVnBN54-aAgzhxWHtLsXu1BJPooDJLxLcA88WVHoPadWkzyZ5N2_L5aTVTu5cRQ/exec";

export default function PalAttendanceSystem() {
  const [role, setRole] = useState("staff");
  const [staffs, setStaffs] = useState<string[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [targetMonth, setTargetMonth] = useState("2601"); // 勤務表コード

  // 勤務記号（エクセル準拠）
  const kigouList = ["Ｓ", "A", "Ｂ", "C", "D", "E", "休", "年", "特", "欠", "Ｒ", "a", "ｂ", "ｃ", "ｄ", "e", "ｐ"];

  // 起動時にスプレッドシートから名簿を取得（C列の順番を維持）
  useEffect(() => {
    fetch(`${API_URL}?action=getStaffList`)
      .then(res => res.json())
      .then(data => {
        setStaffs(data);
        if (data.length > 0) setSelectedStaff(data[0]);
      });
  }, []);

  const handleApply = async (type: string, kigou: string) => {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "submitApply",
        name: selectedStaff,
        month: targetMonth,
        type: type,
        kigou: kigou,
        date: new Date().toLocaleDateString()
      })
    });
    if (res.ok) alert("申請が送信されました（承認ルートへ）");
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', borderBottom: '2px solid #eee', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', color: '#333' }}>ぱる 勤務管理システム</h1>
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ marginBottom: '10px' }}>
          <option value="staff">職員（申請・打刻）</option>
          <option value="admin">管理者（作成・承認）</option>
        </select>
      </header>

      {role === "staff" ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label>職員名：
            <select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)} style={{ width: '100%', padding: '10px' }}>
              {staffs.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button onClick={() => handleApply("打刻", "出勤")} style={{ padding: '20px', backgroundColor: '#2563eb', color: 'white', borderRadius: '10px', border: 'none', fontWeight: 'bold' }}>出勤</button>
            <button onClick={() => handleApply("打刻", "退勤")} style={{ padding: '20px', backgroundColor: '#64748b', color: 'white', borderRadius: '10px', border: 'none', fontWeight: 'bold' }}>退勤</button>
          </div>
          <hr />
          <h3>休み・勤務変更申請</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '5px' }}>
            {kigouList.map(k => (
              <button key={k} onClick={() => handleApply("申請", k)} style={{ padding: '10px 5px', backgroundColor: '#f3f4f6', border: '1px solid #ddd', borderRadius: '5px' }}>{k}</button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h3>管理者メニュー</h3>
          <button onClick={() => alert('スプレッドシートに名簿順で新しい勤務表シートを作成します')} style={{ width: '100%', padding: '15px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px' }}>
            {targetMonth} 勤務表シート新規作成
          </button>
          <p style={{ fontSize: '12px', marginTop: '10px', color: '#666' }}>※「名簿」シートを更新すれば、退職者や順番も自動で反映されます。</p>
        </div>
      )}
    </div>
  );
}
