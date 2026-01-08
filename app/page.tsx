"use client";
import React, { useState, useEffect } from 'react';

const API_URL = "https://script.google.com/macros/s/AKfycbwQotnZVnBN54-aAgzhxWHtLsXu1BJPooDJLxLcA88WVHoPadWkzyZ5N2_L5aTVTu5cRQ/exec";
const ADMIN_PASSWORD = "paladmin2026"; 

export default function PalAttendanceSystem() {
  const [role, setRole] = useState("staff");
  const [staffs, setStaffs] = useState<string[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [location, setLocation] = useState("事務所");
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("システム準備完了");
  const [applyType, setApplyType] = useState("有給");
  const [applyDate, setApplyDate] = useState("");
  const [applyDetail, setApplyDetail] = useState("");
  
  // デフォルトを翌月に設定（1月なら2602）
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextYearShort = String(nextMonth.getFullYear()).substring(2);
  const nextMonthShort = ("0" + (nextMonth.getMonth() + 1)).slice(-2);
  const [adminMonth, setAdminMonth] = useState(nextYearShort + nextMonthShort);

  const locations = ["事務所", "星の村", "カラフル", "プリズム", "ヘルパー(外)"];

  useEffect(() => {
    fetch(`${API_URL}?action=getStaffList`)
      .then(res => res.json())
      .then(data => {
        setStaffs(data);
        if (data.length > 0) setSelectedStaff(data[0]);
      })
      .catch(() => setStatusMessage("❌ 名簿読み込み失敗：GASの設定を確認してください"));
  }, []);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "admin") {
      const pass = prompt("管理者パスワードを入力してください");
      if (pass === ADMIN_PASSWORD) setRole("admin");
      else { alert("パスワードが違います"); setRole("staff"); }
    } else { setRole("staff"); }
  };

  const handleAction = async (actionType: string, value: string, extra: any = {}) => {
    setIsSending(true);
    setStatusMessage("⏳ 通信中... お待ちください");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          action: extra.action || actionType,
          type: actionType,
          name: selectedStaff,
          kigou: value,
          location: location,
          date: applyDate || new Date().toLocaleDateString('ja-JP'),
          detail: applyDetail,
          month: extra.month || adminMonth,
          ...extra
        })
      });
      const resultText = await res.text();
      if (res.ok && resultText.includes("Success")) {
        setStatusMessage(`✅ 成功しました！: ${value}`);
        setApplyDetail("");
      } else {
        setStatusMessage(`⚠️ 失敗: ${resultText}`);
      }
    } catch (e) { 
      setStatusMessage("❌ 通信エラー：ネット接続かGASの公開設定を確認してください"); 
    } finally { 
      setIsSending(false); 
    }
  };

  const labelStyle = { fontSize: '24px', fontWeight: 'bold' as const, display: 'block', marginBottom: '10px' };
  const inputStyle = { width: '100%', padding: '18px', fontSize: '24px', borderRadius: '12px', border: '3px solid #ccc', marginBottom: '25px' };
  const btnLarge = { padding: '25px', fontSize: '28px', color: 'white', borderRadius: '15px', border: 'none', fontWeight: 'bold' as const, cursor: 'pointer', transition: '0.2s' };

  return (
    <div style={{ maxWidth: '650px', margin: '10px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '30px', boxShadow: '0 4px 40px rgba(0,0,0,0.2)', fontFamily: 'sans-serif' }}>
      
      <header style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '4px solid #eee' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>ぱる 勤怠管理</h1>
        {/* 通信状態を大きく表示 */}
        <div style={{ 
          backgroundColor: isSending ? '#fef3c7' : '#dcfce7', 
          color: isSending ? '#92400e' : '#166534',
          padding: '15px', borderRadius: '10px', fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' 
        }}>
          {statusMessage}
        </div>
        <div style={{ textAlign: 'right' }}>
          <select value={role} onChange={handleRoleChange} style={{ fontSize: '18px', padding: '5px' }}>
            <option value="staff">職員用</option>
            <option value="admin">管理者用</option>
          </select>
        </div>
      </header>

      {role === "staff" ? (
        <div>
          <label style={labelStyle}>名前：</label>
          <select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)} style={inputStyle} disabled={isSending}>
            {staffs.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <label style={labelStyle}>今日の場所：</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)} style={{ ...inputStyle, backgroundColor: '#fff9e6' }} disabled={isSending}>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '40px' }}>
            <button onClick={() => handleAction("打刻", "出勤")} disabled={isSending} style={{ ...btnLarge, backgroundColor: '#1d4ed8', opacity: isSending ? 0.6 : 1 }}>出勤</button>
            <button onClick={() => handleAction("打刻", "退勤")} disabled={isSending} style={{ ...btnLarge, backgroundColor: '#374151', opacity: isSending ? 0.6 : 1 }}>退勤</button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '30px', color: '#dc2626' }}>管理者メニュー</h3>
          <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '15px', border: '2px solid #ccc' }}>
            <label style={labelStyle}>作成・反映する月コード</label>
            <input type="text" value={adminMonth} onChange={(e) => setAdminMonth(e.target.value)} style={inputStyle} placeholder="例: 2602" />
            
            <button onClick={() => handleAction("createSheet", "シート作成", { action: "createSheet", month: adminMonth })} disabled={isSending} style={{ ...btnLarge, width: '100%', backgroundColor: '#059669', marginBottom: '20px', opacity: isSending ? 0.6 : 1 }}>
              {adminMonth} 勤務表シートを新規作成
            </button>
            <button onClick={() => handleAction("syncActual", "実績反映", { action: "syncActual", month: adminMonth })} disabled={isSending} style={{ ...btnLarge, width: '100%', backgroundColor: '#1d4ed8', opacity: isSending ? 0.6 : 1 }}>
              {adminMonth} 打刻実績を表に反映
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
