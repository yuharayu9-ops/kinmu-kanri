"use client";
import React, { useState, useEffect } from 'react';

// 設定：Apps ScriptのURLと管理者パスワード
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

  // 今月のコード（例: 2601）を自動生成
  const now = new Date();
  const yearShort = String(now.getFullYear()).substring(2);
  const monthShort = ("0" + (now.getMonth() + 1)).slice(-2);
  const targetMonth = yearShort + monthShort;

  const locations = ["事務所", "星の村", "カラフル", "プリズム", "ヘルパー(外)"];

  // 起動時にスプレッドシートから名簿を取得
  useEffect(() => {
    fetch(`${API_URL}?action=getStaffList`)
      .then(res => res.json())
      .then(data => {
        setStaffs(data);
        if (data.length > 0) setSelectedStaff(data[0]);
      })
      .catch(() => setStatusMessage("❌ 名簿の読み込みに失敗しました"));
  }, []);

  // 管理者パスワードチェック
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    if (newRole === "admin") {
      const pass = prompt("管理者パスワードを入力してください");
      if (pass === ADMIN_PASSWORD) {
        setRole("admin");
      } else {
        alert("パスワードが違います");
        setRole("staff");
      }
    } else {
      setRole("staff");
    }
  };

  // 打刻・申請・管理者アクション送信
  const handleAction = async (actionType: string, value: string, extraData: any = {}) => {
    setIsSending(true);
    setStatusMessage("送信中...");
    
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          action: actionType, // syncActual, createSheet など
          type: actionType,   // 打刻, 申請
          name: selectedStaff,
          kigou: value,
          location: location,
          date: applyDate || new Date().toLocaleString('ja-JP'),
          detail: applyDetail,
          month: targetMonth,
          ...extraData
        })
      });
      
      if (res.ok) {
        setStatusMessage(`✅ 完了: ${value}`);
        setTimeout(() => setStatusMessage(""), 5000);
        setApplyDetail("");
      } else {
        throw new Error();
      }
    } catch (e) {
      setStatusMessage("❌ 送信エラー。電波を確認してください");
    } finally {
      setIsSending(false);
    }
  };

  // 共通スタイル（60代の職員様でも見やすいサイズ）
  const labelStyle = { fontSize: '24px', fontWeight: 'bold' as const, display: 'block', marginBottom: '10px' };
  const inputStyle = { width: '100%', padding: '20px', fontSize: '24px', borderRadius: '12px', border: '3px solid #ccc', marginBottom: '25px', backgroundColor: '#fff' };
  const btnLarge = { padding: '25px', fontSize: '28px', color: 'white', borderRadius: '15px', border: 'none', fontWeight: 'bold' as const, cursor: 'pointer', transition: '0.2s' };

  return (
    <div style={{ maxWidth: '650px', margin: '10px auto', padding: '25px', backgroundColor: '#fdfdfd', borderRadius: '30px', boxShadow: '0 10px 50px rgba(0,0,0,0.2)', fontFamily: 'sans-serif' }}>
      
      <header style={{ textAlign: 'center', marginBottom: '25px', borderBottom: '5px solid #eee', paddingBottom: '15px' }}>
        <h1 style={{ fontSize: '32px', margin: '0 0 10px 0', color: '#111' }}>ぱる 勤怠・申請</h1>
        <div style={{ color: '#059669', fontSize: '22px', fontWeight: 'bold', minHeight: '35px' }}>{statusMessage}</div>
        
        <div style={{ textAlign: 'right' }}>
          <select value={role} onChange={handleRoleChange} style={{ fontSize: '18px', padding: '10px', borderRadius: '8px' }}>
            <option value="staff">職員用画面</option>
            <option value="admin">管理者用（パスワード）</option>
          </select>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={labelStyle}>① 自分の名前を選ぶ：</label>
        <select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)} style={inputStyle}>
          {staffs.length > 0 ? staffs.map(s => <option key={s} value={s}>{s}</option>) : <option>読み込み中...</option>}
        </select>

        {role === "staff" ? (
          <>
            <label style={labelStyle}>② 今日の場所はどこ？：</label>
            <select value={location} onChange={(e) => setLocation(e.target.value)} style={{ ...inputStyle, backgroundColor: '#fff9e6', borderColor: '#f59e0b' }}>
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
              <button 
                onClick={() => handleAction("打刻", "出勤")} 
                disabled={isSending} 
                style={{ ...btnLarge, backgroundColor: '#1d4ed8', opacity: isSending ? 0.6 : 1 }}
              >
                出勤
              </button>
              <button 
                onClick={() => handleAction("打刻", "退勤")} 
                disabled={isSending} 
                style={{ ...btnLarge, backgroundColor: '#374151', opacity: isSending ? 0.6 : 1 }}
              >
                退勤
              </button>
            </div>
            
            <div style={{ border: '5px solid #f3f4f6', padding: '25px', borderRadius: '25px', backgroundColor: '#fafafa' }}>
              <h3 style={{ fontSize: '28px', color: '#047857', marginTop: 0, borderBottom: '4px solid #047857', paddingBottom: '10px' }}>休み・残業の申請</h3>
              
              <label style={{ ...labelStyle, marginTop: '20px' }}>申請の種類：</label>
              <select value={applyType} onChange={(e) => setApplyType(e.target.value)} style={inputStyle}>
                <option value="有給">有給休暇（年）</option>
                <option value="勤務変更">勤務の変更</option>
                <option value="超勤">残業（超勤）</option>
              </select>

              <label style={labelStyle}>いつですか？：</label>
              <input type="date" value={applyDate} onChange={(e) => setApplyDate(e.target.value)} style={inputStyle} />

              <label style={labelStyle}>{applyType === "超勤" ? "理由と時間：" : "内容（例：Aから年へ）"}</label>
              <input type="text" value={applyDetail} onChange={(e) => setApplyDetail(e.target.value)} placeholder="ここに入力" style={inputStyle} />

              <button 
                onClick={() => handleAction("申請", applyType)} 
                disabled={isSending} 
                style={{ ...btnLarge, width: '100%', backgroundColor: '#047857', opacity: isSending ? 0.6 : 1 }}
              >
                申請を送る
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h3 style={{ fontSize: '30px', color: '#dc2626' }}>管理者メニュー</h3>
            
            <div style={{ marginBottom: '30px' }}>
              <p style={labelStyle}>勤務表の管理（{targetMonth}）</p>
              <button 
                onClick={() => handleAction("createSheet", "作成", { action: "createSheet", month: targetMonth })} 
                disabled={isSending}
                style={{ ...btnLarge, width: '100%', backgroundColor: '#059669', marginBottom: '20px' }}
              >
                {targetMonth} 勤務表シートを作成
              </button>

              <button 
                onClick={() => handleAction("syncActual", "反映", { action: "syncActual", month: targetMonth })} 
                disabled={isSending}
                style={{ ...btnLarge, width: '100%', backgroundColor: '#1d4ed8' }}
              >
                個人の打刻実績を反映する
              </button>
            </div>

            <div style={{ textAlign: 'left', backgroundColor: '#fee2e2', padding: '20px', borderRadius: '15px', border: '2px solid #f87171' }}>
              <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 10px 0' }}>【事務員さんへ】</p>
              <p style={{ fontSize: '18px' }}>①「作成」で新しい月のシートを作ります。</p>
              <p style={{ fontSize: '18px' }}>② 締め日に「反映」を押すと、個人の打刻ログが自動的に「○」として転記されます。</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
