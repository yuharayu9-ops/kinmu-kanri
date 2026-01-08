"use client";
import React, { useState, useEffect } from 'react';

const API_URL = "https://script.google.com/macros/s/AKfycbwQotnZVnBN54-aAgzhxWHtLsXu1BJPooDJLxLcA88WVHoPadWkzyZ5N2_L5aTVTu5cRQ/exec";

export default function PalAttendanceSystem() {
  const [role, setRole] = useState("staff");
  const [staffs, setStaffs] = useState<string[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  
  const [applyType, setApplyType] = useState("有給");
  const [applyDate, setApplyDate] = useState("");
  const [applyDetail, setApplyDetail] = useState("");

  useEffect(() => {
    fetch(`${API_URL}?action=getStaffList`).then(res => res.json()).then(data => {
      setStaffs(data);
      if (data.length > 0) setSelectedStaff(data[0]);
    });
  }, []);

  const handleAction = async (actionType: string, value: string) => {
    setIsSending(true);
    setStatusMessage("送信中...");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "submitApply",
          name: selectedStaff,
          type: actionType,
          kigou: value,
          date: applyDate || new Date().toLocaleDateString('ja-JP'),
          detail: applyDetail
        })
      });
      if (res.ok) {
        setStatusMessage(`✅ 送信完了しました`);
        setTimeout(() => setStatusMessage(""), 5000);
        setApplyDetail("");
      }
    } catch (e) {
      setStatusMessage("❌ 失敗しました");
    } finally {
      setIsSending(false);
    }
  };

  // スタイル設定（文字を大きく、見やすく）
  const labelStyle = { fontSize: '20px', fontWeight: 'bold' as const, display: 'block', marginBottom: '8px' };
  const inputStyle = { width: '100%', padding: '15px', fontSize: '20px', borderRadius: '8px', border: '2px solid #ccc', marginBottom: '20px' };
  const btnLarge = { padding: '25px', fontSize: '24px', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 'bold' as const, cursor: 'pointer' };

  return (
    <div style={{ maxWidth: '600px', margin: '10px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 4px 30px rgba(0,0,0,0.15)', fontFamily: 'sans-serif' }}>
      
      <header style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '3px solid #eee', paddingBottom: '10px' }}>
        <h1 style={{ fontSize: '26px', margin: '0 0 10px 0', color: '#333' }}>ぱる 勤務・申請</h1>
        <div style={{ color: '#059669', fontSize: '20px', fontWeight: 'bold', minHeight: '30px' }}>{statusMessage}</div>
        
        <div style={{ textAlign: 'right' }}>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ fontSize: '16px', padding: '5px' }}>
            <option value="staff">職員用</option>
            <option value="admin">管理者用</option>
          </select>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={labelStyle}>自分の名前を選択：</label>
        <select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)} style={inputStyle}>
          {staffs.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {role === "staff" ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <button onClick={() => handleAction("打刻", "出勤")} disabled={isSending} style={{ ...btnLarge, backgroundColor: '#2563eb' }}>出勤</button>
              <button onClick={() => handleAction("打刻", "退勤")} disabled={isSending} style={{ ...btnLarge, backgroundColor: '#4b5563' }}>退勤</button>
            </div>
            
            <div style={{ border: '3px solid #e5e7eb', padding: '20px', borderRadius: '15px', backgroundColor: '#fefefe' }}>
              <h3 style={{ fontSize: '22px', marginTop: 0, color: '#059669', borderBottom: '2px solid #059669' }}>休み・変更・残業の申請</h3>
              
              <label style={labelStyle}>申請の種類：</label>
              <select value={applyType} onChange={(e) => setApplyType(e.target.value)} style={inputStyle}>
                <option value="有給">有給休暇（年）</option>
                <option value="勤務変更">勤務の変更</option>
                <option value="超勤">残業（超勤）</option>
              </select>

              <label style={labelStyle}>対象の日付：</label>
              <input type="date" value={applyDate} onChange={(e) => setApplyDate(e.target.value)} style={inputStyle} />

              <label style={labelStyle}>{applyType === "超勤" ? "理由と時間（例：会議 1時間）" : "内容（例：Aから年へ）"}:</label>
              <input type="text" value={applyDetail} onChange={(e) => setApplyDetail(e.target.value)} placeholder="ここに入力" style={inputStyle} />

              <button onClick={() => handleAction("申請", applyType)} disabled={isSending} style={{ ...btnLarge, width: '100%', backgroundColor: '#059669' }}>申請を送信する</button>
            </div>
          </>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '22px' }}>管理者メニュー</h3>
            <button onClick={() => alert('スプレッドシートに新しい月のシートを作成します')} style={{ ...btnLarge, width: '100%', backgroundColor: '#059669', marginBottom: '20px' }}>
              次月の勤務表を自動作成
            </button>
            <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.5' }}>
              ※「承認待ち」シートを確認して、主任・課長・施設長の順に「済」を入力してください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
