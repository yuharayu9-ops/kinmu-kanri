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
  const [statusMessage, setStatusMessage] = useState("");
  const [applyType, setApplyType] = useState("有給");
  const [applyDate, setApplyDate] = useState("");
  const [applyDetail, setApplyDetail] = useState("");
  
  // 管理者が操作する対象月（デフォルトは今月）
  const now = new Date();
  const yearShort = String(now.getFullYear()).substring(2);
  const monthShort = ("0" + (now.getMonth() + 1)).slice(-2);
  const [adminMonth, setAdminMonth] = useState(yearShort + monthShort);

  const locations = ["事務所", "星の村", "カラフル", "プリズム", "ヘルパー(外)"];

  useEffect(() => {
    fetch(`${API_URL}?action=getStaffList`)
      .then(res => res.json())
      .then(data => {
        setStaffs(data);
        if (data.length > 0) setSelectedStaff(data[0]);
      })
      .catch(() => setStatusMessage("❌ 名簿読み込み失敗"));
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
    setStatusMessage("送信中...");
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
      if (res.ok) {
        setStatusMessage(`✅ 完了: ${value}`);
        setTimeout(() => setStatusMessage(""), 5000);
        setApplyDetail("");
      }
    } catch (e) { setStatusMessage("❌ 送信エラー"); }
    finally { setIsSending(false); }
  };

  const labelStyle = { fontSize: '24px', fontWeight: 'bold' as const, display: 'block', marginBottom: '10px' };
  const inputStyle = { width: '100%', padding: '18px', fontSize: '24px', borderRadius: '12px', border: '3px solid #ccc', marginBottom: '25px' };
  const btnLarge = { padding: '25px', fontSize: '28px', color: 'white', borderRadius: '15px', border: 'none', fontWeight: 'bold' as const, cursor: 'pointer' };

  return (
    <div style={{ maxWidth: '650px', margin: '10px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '30px', boxShadow: '0 4px 40px rgba(0,0,0,0.2)', fontFamily: 'sans-serif' }}>
      
      <header style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '4px solid #eee' }}>
        <h1 style={{ fontSize: '32px' }}>ぱる 勤怠・申請</h1>
        <div style={{ color: '#059669', fontSize: '22px', fontWeight: 'bold', minHeight: '35px' }}>{statusMessage}</div>
        <div style={{ textAlign: 'right' }}>
          <select value={role} onChange={handleRoleChange} style={{ fontSize: '18px', padding: '5px' }}>
            <option value="staff">職員画面</option>
            <option value="admin">管理者画面</option>
          </select>
        </div>
      </header>

      {role === "staff" ? (
        <div>
          <label style={labelStyle}>名前：</label>
          <select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)} style={inputStyle}>
            {staffs.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <label style={labelStyle}>場所：</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)} style={{ ...inputStyle, backgroundColor: '#fff9e6' }}>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '40px' }}>
            <button onClick={() => handleAction("打刻", "出勤")} disabled={isSending} style={{ ...btnLarge, backgroundColor: '#1d4ed8' }}>出勤</button>
            <button onClick={() => handleAction("打刻", "退勤")} disabled={isSending} style={{ ...btnLarge, backgroundColor: '#374151' }}>退勤</button>
          </div>
          
          <div style={{ border: '4px solid #f3f4f6', padding: '20px', borderRadius: '20px', backgroundColor: '#fafafa' }}>
            <h3 style={{ fontSize: '28px', color: '#047857', borderBottom: '3px solid #047857' }}>各種申請</h3>
            <label style={labelStyle}>種類：</label>
            <select value={applyType} onChange={(e) => setApplyType(e.target.value)} style={inputStyle}>
              <option value="有給">有給休暇（年）</option>
              <option value="勤務変更">勤務変更</option>
              <option value="超勤">残業（超勤）</option>
            </select>
            <label style={labelStyle}>日付：</label>
            <input type="date" value={applyDate} onChange={(e) => setApplyDate(e.target.value)} style={inputStyle} />
            <label style={labelStyle}>理由・内容：</label>
            <input type="text" value={applyDetail} onChange={(e) => setApplyDetail(e.target.value)} placeholder="例：Aから年へ" style={inputStyle} />
            <button onClick={() => handleAction("申請", applyType)} disabled={isSending} style={{ ...btnLarge, width: '100%', backgroundColor: '#047857' }}>申請送信</button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '30px', color: '#dc2626' }}>管理者メニュー</h3>
          <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '15px', border: '2px solid #ccc' }}>
            <label style={labelStyle}>操作対象月（例: 2602）</label>
            <input type="text" value={adminMonth} onChange={(e) => setAdminMonth(e.target.value)} style={inputStyle} />
            
            <button onClick={() => handleAction("createSheet", "事前作成", { action: "createSheet", month: adminMonth })} disabled={isSending} style={{ ...btnLarge, width: '100%', backgroundColor: '#059669', marginBottom: '20px' }}>
              {adminMonth} 勤務表(予定)を事前作成
            </button>
            <button onClick={() => handleAction("syncActual", "実績反映", { action: "syncActual", month: adminMonth })} disabled={isSending} style={{ ...btnLarge, width: '100%', backgroundColor: '#1d4ed8' }}>
              {adminMonth} 実績を勤務表に反映
            </button>
          </div>
          <p style={{ fontSize: '18px', marginTop: '15px' }}>※作成ボタンは承認済みの有給を自動で反映します。</p>
        </div>
      )}
    </div>
  );
}
