"use client";
import React, { useState, useEffect } from 'react';

// ↓↓↓ ご自身の新しいGAS URLに書き換えてください ↓↓↓
const API_URL = "https://script.google.com/macros/s/AKfycbyUcxe-iznXDJufLiWuWYGw6WA_3O2NRB7Urkf1TSTFCry6SjeX6EjLzdvhlsCL4et8Pg/exec";

const PASSWORDS = { shunin: "shunin123", kachou: "kachou456", shocho: "shocho789" };

export default function PalAttendanceSystem() {
  const [role, setRole] = useState("staff");
  const [staffs, setStaffs] = useState<string[]>([]);
  const [approveList, setApproveList] = useState<any[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [location, setLocation] = useState("事務所");
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("システム準備完了");
  const [applyType, setApplyType] = useState("有給");
  const [applyDate, setApplyDate] = useState("");
  const [applyDetail, setApplyDetail] = useState("");
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("19:00");

  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const [adminMonth, setAdminMonth] = useState(String(nextMonth.getFullYear()).substring(2) + ("0" + (nextMonth.getMonth() + 1)).slice(-2));

  const loadData = () => {
    fetch(`${API_URL}?action=getStaffList`).then(res => res.json()).then(setStaffs).catch(() => setStatusMessage("❌ 取得失敗"));
    if (role !== "staff") fetch(`${API_URL}?action=getApproveList&role=${role}`).then(res => res.json()).then(setApproveList);
  };

  useEffect(() => { loadData(); }, [role]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "staff") { setRole(val); return; }
    const pass = prompt(`${val}のパスワードを入力`);
    if (pass === (PASSWORDS as any)[val]) setRole(val);
    else { alert("パスワードが違います"); setRole("staff"); }
  };

  const handleAction = async (actionType: string, value: string, extra: any = {}) => {
    setIsSending(true);
    setStatusMessage("⏳ 通信中...");
    const postData = {
      action: extra.action || actionType, type: actionType, name: selectedStaff, role,
      kigou: value, location, date: applyDate, detail: applyDetail, month: adminMonth,
      startTime: (value === "超勤" || applyType === "超勤") ? startTime : null,
      endTime: (value === "超勤" || applyType === "超勤") ? endTime : null,
      ...extra
    };
    try {
      const res = await fetch(API_URL, { method: "POST", body: JSON.stringify(postData) });
      const resultText = await res.text();
      if (resultText === "Success") { 
        setStatusMessage(`✅ ${value} 完了`); 
        loadData(); setApplyDetail(""); 
      } else {
        setStatusMessage(`⚠️ ${resultText}`);
      }
    } catch (e) { setStatusMessage("❌ 通信エラー"); }
    finally { setIsSending(false); }
  };

  const labelStyle = { fontSize: '26px', fontWeight: 'bold' as const, display: 'block', marginBottom: '10px' };
  const inputStyle = { width: '100%', padding: '20px', fontSize: '26px', borderRadius: '15px', border: '3px solid #ccc', marginBottom: '25px' };
  const btnLarge = { padding: '28px', fontSize: '30px', color: 'white', borderRadius: '20px', border: 'none', fontWeight: 'bold' as const, cursor: 'pointer' };

  return (
    <div style={{ maxWidth: '650px', margin: '10px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '30px', boxShadow: '0 4px 40px rgba(0,0,0,0.2)' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '36px' }}>ぱる 勤怠管理</h1>
        <div style={{ padding: '15px', backgroundColor: '#f0fdf4', color: '#166534', fontSize: '22px', fontWeight: 'bold', borderRadius: '10px' }}>{statusMessage}</div>
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <select value={role} onChange={handleRoleChange} style={{ fontSize: '20px', padding: '5px' }}>
            <option value="staff">職員</option>
            <option value="shunin">主任</option>
            <option value="kachou">課長</option>
            <option value="shocho">所長</option>
          </select>
        </div>
      </header>

      {role === "staff" ? (
        <div>
          <label style={labelStyle}>名前：</label>
          <select value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)} style={inputStyle}>
            <option value="">選択...</option>
            {staffs.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <label style={labelStyle}>場所：</label>
          <select value={location} onChange={e => setLocation(e.target.value)} style={{ ...inputStyle, backgroundColor: '#fff9e6' }}>
            {["事務所", "星の村", "カラフル", "プリズム", "ヘルパー(外)"].map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <button onClick={() => handleAction("打刻", "出勤")} disabled={isSending} style={{ ...btnLarge, backgroundColor: '#1d4ed8' }}>出勤</button>
            <button onClick={() => handleAction("打刻", "退勤")} disabled={isSending} style={{ ...btnLarge, backgroundColor: '#374151' }}>退勤</button>
          </div>
          <div style={{ border: '4px solid #e5e7eb', padding: '20px', borderRadius: '25px' }}>
            <h3 style={{ fontSize: '28px', color: '#047857' }}>休暇・残業申請</h3>
            <select value={applyType} onChange={e => setApplyType(e.target.value)} style={inputStyle}>
              <option value="有給">有給</option>
              <option value="勤務変更">勤務変更</option>
              <option value="超勤">残業</option>
            </select>
            {applyType === "超勤" && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{...labelStyle, fontSize:'22px'}}>残業時間：</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} style={{ ...inputStyle, marginBottom: 0 }} />
                  <span style={{ fontSize: '30px' }}>〜</span>
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} style={{ ...inputStyle, marginBottom: 0 }} />
                </div>
              </div>
            )}
            <input type="date" value={applyDate} onChange={e => setApplyDate(e.target.value)} style={inputStyle} />
            <input type="text" value={applyDetail} onChange={e => setApplyDetail(e.target.value)} placeholder="理由・内容" style={inputStyle} />
            <button onClick={() => handleAction("申請", applyType)} disabled={isSending} style={{ ...btnLarge, width: '100%', backgroundColor: '#047857' }}>申請送信</button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', color: '#dc2626' }}>{role.toUpperCase()} 管理画面</h2>
          <input type="text" value={adminMonth} onChange={e => setAdminMonth(e.target.value)} style={inputStyle} />
          {role === "shunin" && (
            <div style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
              <button onClick={() => handleAction("createSheet", "シート作成", { action: "createSheet", month: adminMonth })} style={{ ...btnLarge, backgroundColor: '#059669' }}>{adminMonth} シート作成</button>
              <button onClick={() => handleAction("syncActual", "実績反映", { action: "syncActual", month: adminMonth })} style={{ ...btnLarge, backgroundColor: '#1d4ed8' }}>実績・有給を反映</button>
            </div>
          )}
          <h3 style={{ fontSize: '28px', borderBottom: '3px solid #ccc' }}>承認待ちリスト</h3>
          {approveList.length === 0 ? <p style={{fontSize:'22px'}}>なし</p> : approveList.map(item => (
            <div key={item.sheetName + item.row} style={{ border: '2px solid #ccc', padding: '15px', borderRadius: '15px', marginBottom: '10px', textAlign: 'left' }}>
              <p style={{ fontSize: '22px' }}><b>{item.name}</b>（{item.type}）</p>
              <p style={{ fontSize: '18px', color: '#666' }}>日付: {new Date(item.date).toLocaleDateString()}</p>
              <p style={{ fontSize: '18px', marginBottom: '10px' }}>内容: {item.detail}</p>
              <button onClick={() => handleAction("approve", "承認", { action: "approve", row: item.row, sheetName: item.sheetName })} style={{ ...btnLarge, width: '100%', fontSize: '22px', backgroundColor: '#059669', padding: '15px' }}>
                {role === "shunin" ? "主任承認" : role === "kachou" ? "課長承認" : "所長承認"} 実行
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
