"use client";
import React, { useState, useEffect } from 'react';

const API_URL = "https://script.google.com/macros/s/AKfycbwQotnZVnBN54-aAgzhxWHtLsXu1BJPooDJLxLcA88WVHoPadWkzyZ5N2_L5aTVTu5cRQ/exec";

// 役職ごとのパスワード設定
const PASSWORDS = {
  shunin: "shunin123", // 主任
  kachou: "kachou456", // 課長
  shocho: "shocho789"  // 所長（施設長）
};

export default function PalAttendanceSystem() {
  const [role, setRole] = useState("staff");
  const [staffs, setStaffs] = useState<string[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [location, setLocation] = useState("事務所");
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("準備完了");
  
  const [applyType, setApplyType] = useState("有給");
  const [applyDate, setApplyDate] = useState("");
  const [applyDetail, setApplyDetail] = useState("");
  
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const [adminMonth, setAdminMonth] = useState(String(nextMonth.getFullYear()).substring(2) + ("0" + (nextMonth.getMonth() + 1)).slice(-2));

  const locations = ["事務所", "星の村", "カラフル", "プリズム", "ヘルパー(外)"];

  useEffect(() => {
    fetch(`${API_URL}?action=getStaffList`).then(res => res.json()).then(data => {
      setStaffs(data);
      if (data.length > 0) setSelectedStaff(data[0]);
    });
  }, []);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    if (newRole !== "staff") {
      const pass = prompt(`${newRole}のパスワードを入力してください`);
      if (pass === (PASSWORDS as any)[newRole]) {
        setRole(newRole);
      } else {
        alert("パスワードが違います");
        setRole("staff");
      }
    } else {
      setRole("staff");
    }
  };

  const handleAction = async (actionType: string, value: string, extra: any = {}) => {
    setIsSending(true);
    setStatusMessage("⏳ 通信中...");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          action: extra.action || actionType,
          type: actionType,
          name: selectedStaff,
          role: role, // 誰が送ったか
          kigou: value,
          location: location,
          date: applyDate || new Date().toLocaleDateString('ja-JP'),
          detail: applyDetail,
          month: extra.month || adminMonth,
          ...extra
        })
      });
      const result = await res.text();
      setStatusMessage(res.ok ? `✅ 完了: ${value}` : `⚠️ 失敗: ${result}`);
      if (res.ok) setApplyDetail("");
    } catch (e) { setStatusMessage("❌ エラーが発生しました"); }
    finally { setIsSending(false); }
  };

  // 文字をさらに大きく調整
  const labelStyle = { fontSize: '26px', fontWeight: 'bold' as const, display: 'block', marginBottom: '12px' };
  const inputStyle = { width: '100%', padding: '22px', fontSize: '26px', borderRadius: '15px', border: '3px solid #ccc', marginBottom: '30px' };
  const btnLarge = { padding: '28px', fontSize: '30px', color: 'white', borderRadius: '20px', border: 'none', fontWeight: 'bold' as const, cursor: 'pointer' };

  return (
    <div style={{ maxWidth: '650px', margin: '10px auto', padding: '25px', backgroundColor: '#fff', borderRadius: '30px', boxShadow: '0 4px 40px rgba(0,0,0,0.2)' }}>
      
      <header style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '5px solid #eee' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>ぱる 勤怠・申請</h1>
        <div style={{ backgroundColor: '#f0fdf4', padding: '15px', color: '#166534', fontSize: '22px', fontWeight: 'bold', borderRadius: '10px' }}>{statusMessage}</div>
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <select value={role} onChange={handleRoleChange} style={{ fontSize: '20px', padding: '8px' }}>
            <option value="staff">職員（打刻・申請）</option>
            <option value="shunin">主任（作成・反映）</option>
            <option value="kachou">課長（承認用）</option>
            <option value="shocho">所長（最終承認）</option>
          </select>
        </div>
      </header>

      {role === "staff" ? (
        <div>
          <label style={labelStyle}>名前を選択：</label>
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

          <div style={{ border: '5px solid #e5e7eb', padding: '25px', borderRadius: '25px', backgroundColor: '#f9fafb' }}>
            <h3 style={{ fontSize: '30px', color: '#047857', marginTop: 0 }}>休み・残業の申請</h3>
            <label style={labelStyle}>申請の種類：</label>
            <select value={applyType} onChange={(e) => setApplyType(e.target.value)} style={inputStyle}>
              <option value="有給">有給休暇</option>
              <option value="勤務変更">勤務変更</option>
              <option value="超勤">残業(超勤)</option>
            </select>
            <label style={labelStyle}>該当日：</label>
            <input type="date" value={applyDate} onChange={(e) => setApplyDate(e.target.value)} style={inputStyle} />
            <label style={labelStyle}>内容・理由：</label>
            <input type="text" value={applyDetail} onChange={(e) => setApplyDetail(e.target.value)} placeholder="例：Aから年へ" style={inputStyle} />
            <button onClick={() => handleAction("申請", applyType)} disabled={isSending} style={{ ...btnLarge, width: '100%', backgroundColor: '#047857' }}>申請を送信</button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', color: '#dc2626' }}>{role.toUpperCase()} 管理画面</h2>
          <div style={{ backgroundColor: '#f3f4f6', padding: '25px', borderRadius: '20px', border: '3px solid #ccc' }}>
            <label style={labelStyle}>対象月：</label>
            <input type="text" value={adminMonth} onChange={(e) => setAdminMonth(e.target.value)} style={inputStyle} />
            
            {role === "shunin" && (
              <>
                <button onClick={() => handleAction("createSheet", "シート作成", { action: "createSheet", month: adminMonth })} style={{ ...btnLarge, width: '100%', backgroundColor: '#059669', marginBottom: '20px' }}>{adminMonth} シート作成</button>
                <button onClick={() => handleAction("syncActual", "実績反映", { action: "syncActual", month: adminMonth })} style={{ ...btnLarge, width: '100%', backgroundColor: '#1d4ed8' }}>実績・有給反映</button>
              </>
            )}
            {(role === "kachou" || role === "shocho") && (
              <p style={{ fontSize: '24px', padding: '20px' }}>
                スプレッドシートの「承認待ち」を確認し、各セルを編集してください。<br/>
                （アプリからの直接承認機能は、要望に応じて追加可能です）
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
