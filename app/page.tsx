"use client";
import React, { useState, useEffect } from 'react';

const API_URL = "https://script.google.com/macros/s/AKfycbwQotnZVnBN54-aAgzhxWHtLsXu1BJPooDJLxLcA88WVHoPadWkzyZ5N2_L5aTVTu5cRQ/exec";

export default function PalAttendanceSystem() {
  const [role, setRole] = useState("staff");
  const [staffs, setStaffs] = useState<string[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [isSending, setIsSending] = useState(false); // 送信中フラグ
  const [statusMessage, setStatusMessage] = useState(""); // 完了メッセージ

  useEffect(() => {
    fetch(`${API_URL}?action=getStaffList`)
      .then(res => res.json())
      .then(data => {
        setStaffs(data);
        if (data.length > 0) setSelectedStaff(data[0]);
      });
  }, []);

  const handleApply = async (type: string, kigou: string) => {
    setIsSending(true);
    setStatusMessage("送信中...");
    
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "submitApply",
          name: selectedStaff,
          type: type,
          kigou: kigou,
          date: new Date().toLocaleString('ja-JP') // 時間まで送る
        })
      });
      if (res.ok) {
        setStatusMessage(`✅ ${selectedStaff}さんの「${kigou}」を記録しました`);
        // 3秒後にメッセージを消す
        setTimeout(() => setStatusMessage(""), 3000);
      }
    } catch (e) {
      setStatusMessage("❌ 送信に失敗しました。電波の良い場所でやり直してください。");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', color: '#333' }}>ぱる 勤務管理</h1>
        <div style={{ color: '#059669', fontWeight: 'bold', height: '24px' }}>{statusMessage}</div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label>職員名：
          <select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)} disabled={isSending} style={{ width: '100%', padding: '10px' }}>
            {staffs.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button 
            onClick={() => handleApply("打刻", "出勤")} 
            disabled={isSending}
            style={{ padding: '20px', backgroundColor: isSending ? '#ccc' : '#2563eb', color: 'white', borderRadius: '10px', border: 'none', fontWeight: 'bold' }}
          >
            出勤
          </button>
          <button 
            onClick={() => handleApply("打刻", "退勤")} 
            disabled={isSending}
            style={{ padding: '20px', backgroundColor: isSending ? '#ccc' : '#64748b', color: 'white', borderRadius: '10px', border: 'none', fontWeight: 'bold' }}
          >
            退勤
          </button>
        </div>
      </div>
      {/* 以前のコードの管理者メニューなどは適宜残してください */}
    </div>
  );
}
