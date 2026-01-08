"use client";
import React, { useState, useEffect } from 'react';

const API_URL = "https://script.google.com/macros/s/AKfycbwQotnZVnBN54-aAgzhxWHtLsXu1BJPooDJLxLcA88WVHoPadWkzyZ5N2_L5aTVTu5cRQ/exec";
const ADMIN_PASSWORD = "paladmin2026"; 

export default function PalAttendanceSystem() {
  const [role, setRole] = useState("staff");
  const [staffs, setStaffs] = useState<string[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [location, setLocation] = useState("事務所"); // 初期値
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  
  const [applyType, setApplyType] = useState("有給");
  const [applyDate, setApplyDate] = useState("");
  const [applyDetail, setApplyDetail] = useState("");

  const locations = ["事務所", "星の村", "カラフル", "プリズム", "ヘルパー(外)"];

  useEffect(() => {
    fetch(`${API_URL}?action=getStaffList`).then(res => res.json()).then(data => {
      setStaffs(data);
      if (data.length > 0) setSelectedStaff(data[0]);
    });
  }, []);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "admin") {
      const pass = prompt("管理者パスワードを入力してください");
      if (pass === ADMIN_PASSWORD) setRole("admin");
      else { alert("パスワードが違います"); setRole("staff"); }
    } else { setRole("staff"); }
  };

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
          location: location, // 場所情報を追加
          date: applyDate || new Date().toLocaleString('ja-JP'),
          detail: applyDetail
        })
      });
      if (res.ok) {
        setStatusMessage(`✅ ${value}記録完了 (${location})`);
        setTimeout(() => setStatusMessage(""), 5000);
        setApplyDetail("");
      }
    } catch (e) { setStatusMessage("❌ 失敗しました"); }
    finally { setIsSending(false); }
  };

  const labelStyle = { fontSize: '22px', fontWeight: 'bold' as const, display: 'block', marginBottom: '10px' };
  const inputStyle = { width: '100%', padding: '18px', fontSize: '22px', borderRadius: '10px', border: '3px solid #ccc', marginBottom: '25px' };
  const btnLarge = { padding: '25px', fontSize: '26px', color: 'white', borderRadius: '15px', border: 'none', fontWeight: 'bold' as const };

  return (
    <div style={{ maxWidth: '600px', margin: '10px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '25px', boxShadow: '0 4px 40px rgba(0,0,0,0.2)' }}>
      <header style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h1 style={{ fontSize: '30px', color: '#1a1a1a' }}>ぱる 勤務・申請</h1>
        <div style={{ color: '#059669', fontSize: '22px', fontWeight: 'bold', minHeight: '35px' }}>{statusMessage}</div>
        <div style={{ textAlign: 'right' }}><select value={role} onChange={handleRoleChange} style={{ fontSize: '18px' }}><option value="staff">職員用</option><option value="admin">管理者用</option></select></div>
      </header>

      <label style={labelStyle}>名前を選択：</label>
      <select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)} style={inputStyle}>
        {staffs.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      {role === "staff" ? (
        <>
          <label style={labelStyle}>勤務場所（直行直帰など）：</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)} style={{ ...inputStyle, backgroundColor: '#fff9e6', borderColor: '#f59e0b' }}>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '35px' }}>
            <button onClick={() => handleAction("打刻", "出勤")} disabled={isSending} style={{ ...btnLarge, backgroundColor: '#1d4ed8' }}>出勤</button>
            <button onClick={() => handleAction("打刻", "退勤")} disabled={isSending} style={{ ...btnLarge, backgroundColor: '#374151' }}>退勤</button>
          </div>
          
          <div style={{ border: '4px solid #f3f4f6', padding: '25px', borderRadius: '20px', backgroundColor: '#fafafa' }}>
            <h3 style={{ fontSize: '26px', color: '#047857' }}>各種申請（有給・残業）</h3>
            <label style={labelStyle}>申請種別：</label>
            <select value={applyType} onChange={(e) => setApplyType(e.target.value)} style={inputStyle}>
              <option value="有給">有給休暇（年）</option>
              <option value="勤務変更">勤務の変更</option>
              <option value="超勤">残業（超勤）</option>
            </select>
            <label style={labelStyle}>日付：</label>
            <input type="date" value={applyDate} onChange={(e) => setApplyDate(e.target.value)} style={inputStyle} />
            <label style={labelStyle}>内容・理由：</label>
            <input type="text" value={applyDetail} onChange={(e) => setApplyDetail(e.target.value)} placeholder="例：星の村へ直行" style={inputStyle} />
            <button onClick={() => handleAction("申請", applyType)} disabled={isSending} style={{ ...btnLarge, width: '100%', backgroundColor: '#047857' }}>申請を送る</button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '28px', color: '#dc2626' }}>管理者メニュー</h3>
          <button style={{ ...btnLarge, width: '100%', backgroundColor: '#dc2626' }}>勤務表を自動作成</button>
        </div>
      )}
    </div>
  );
}
