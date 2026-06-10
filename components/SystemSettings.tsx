
import React, { useState, useEffect } from 'react';
import { db } from '../services/api';
import { 
  CheckCircle2, RefreshCw, FileCode, Copy, 
  Database, AlertCircle, ExternalLink, ShieldCheck,
  ChevronDown, Code, FileSpreadsheet,
  Wifi, Check
} from 'lucide-react';
import { API_CONFIG } from '../config';
import { Language } from '../types';

interface SystemSettingsProps { lang: Language; t: any; }

interface SheetStatus {
  name: string;
  status: 'ok' | 'error' | 'pending';
  missingCols: string[];
  rowCount: number;
  lastCheck?: Date;
  latency?: number;
}

const REQUIRED_SHEETS = [
  { name: 'EMPLOYEES', cols: ['id', 'empNo', 'nameEng', 'nameThai', 'dept', 'pos', 'startWorking'] },
  { name: 'TASKS', cols: ['id', 'title', 'assignee', 'priority', 'status', 'deadline'] },
  { name: 'COMPANY_ACTIVITIES', cols: ['id', 'title', 'date', 'startTime', 'endTime', 'location', 'participants', 'details'] },
  { name: 'COURSES', cols: ['courseId', 'group', 'name', 'instructor'] },
  { name: 'TRAINING_RECORDS', cols: ['id', 'empNo', 'date', 'type', 'courseId', 'place', 'fee', 'progress'] },
  { name: 'ROOM_BOOKINGS', cols: ['id', 'roomId', 'roomName', 'employeeName', 'department', 'date', 'startTime', 'endTime', 'title', 'status'] },
  { name: 'PRS', cols: ['id', 'date', 'department', 'totalAmount', 'status'] },
  { name: 'POS', cols: ['id', 'date', 'vendor', 'totalAmount', 'status'] },
  { name: 'ACTIVITY_LOGS', cols: ['id', 'timestamp', 'user', 'action', 'details'] },
  { name: 'CONFIG', cols: ['id', 'value'] }
];

const SystemSettings: React.FC<SystemSettingsProps> = ({ lang, t }) => {
  const [sheetStatuses, setSheetStatuses] = useState<SheetStatus[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [showFullCode, setShowFullCode] = useState(false);
  const [expandedSheet, setExpandedSheet] = useState<string | null>(null);

  const checkConnectivity = async () => {
    setIsTesting(true);
    const results: SheetStatus[] = [];
    for (const sheetDef of REQUIRED_SHEETS) {
      const startTime = Date.now();
      try {
        const response = await fetch(`${API_CONFIG.GOOGLE_SCRIPT_URL}?action=read&sheet=${sheetDef.name}`);
        const data = await response.json();
        const latency = Date.now() - startTime;
        if (Array.isArray(data)) {
          results.push({ name: sheetDef.name, status: 'ok', missingCols: [], rowCount: data.length, lastCheck: new Date(), latency });
        } else { throw new Error('Invalid format'); }
      } catch (e) {
        results.push({ name: sheetDef.name, status: 'error', missingCols: sheetDef.cols, rowCount: 0, lastCheck: new Date() });
      }
    }
    setSheetStatuses(results);
    setIsTesting(false);
  };

  useEffect(() => { checkConnectivity(); }, []);

  const gasScript = `/* 
   🚀 SMART E-OFFICE MASTER SETUP SCRIPT (V7 - FULL CLOUD AUTOMATION)
   -----------------------------------------
   - Auto-initializes all enterprise sheets & columns
   - Robust CRUD for 'COMPANY_ACTIVITIES' and all other modules
   - Enhanced CORS stability and error handling
   - Auto-formats date & time for spreadsheet visibility
*/

function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ${JSON.stringify(REQUIRED_SHEETS)};
  
  sheets.forEach(function(s) {
    var sheet = ss.getSheetByName(s.name);
    if (!sheet) {
      sheet = ss.insertSheet(s.name);
      sheet.getRange(1, 1, 1, s.cols.length).setValues([s.cols])
           .setFontWeight("bold")
           .setBackground("#343a40")
           .setFontColor("white")
           .setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    } else {
      // Check if headers match and add missing ones if necessary
      var existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      s.cols.forEach(function(col) {
        if (existingHeaders.indexOf(col) === -1) {
          sheet.getRange(1, sheet.getLastColumn() + 1).setValue(col).setFontWeight("bold");
        }
      });
    }
  });

  // Specific Seed for Company Activities
  var actSheet = ss.getSheetByName("COMPANY_ACTIVITIES");
  if (actSheet.getLastRow() === 1) {
    var tz = ss.getSpreadsheetTimeZone();
    var today = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");
    actSheet.appendRow(["ACT-INIT-01", "เปิดตัวระบบ Smart E-Office", today, "08:30", "10:00", "ห้องประชุมใหญ่", "ผู้บริหาร, พนักงานทุกคน", "กิจกรรมฉลองการเริ่มใช้งานระบบใหม่"]);
  }
}

function doGet(e) {
  var action = e.parameter.action;
  var sheetName = e.parameter.sheet;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) return createResponse({error: "Sheet not found: " + sheetName});

  if (action === 'read') {
    var data = sheet.getDataRange().getValues();
    var headers = data.shift();
    var result = data.map(function(row) {
      var obj = {};
      headers.forEach(function(h, i) { 
        var val = row[i];
        if (val instanceof Date) {
          var format = h.toLowerCase().includes("time") ? "HH:mm" : "yyyy-MM-dd";
          if (h.toLowerCase().includes("timestamp")) format = "yyyy-MM-dd HH:mm:ss";
          val = Utilities.formatDate(val, ss.getSpreadsheetTimeZone(), format);
        }
        obj[h] = val; 
      });
      return obj;
    });
    return createResponse(result);
  }
}

function doPost(e) {
  try {
    var params = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(params.sheet);
    
    if (!sheet) return createResponse({success: false, message: "Sheet not found: " + params.sheet});

    var dataRows = sheet.getDataRange().getValues();
    var headers = dataRows[0];

    if (params.action === 'create') {
      var newRow = headers.map(function(h) { 
        var val = params.data[h] || ""; 
        if (params.sheet === 'ACTIVITY_LOGS' && h === 'timestamp' && !val) {
          val = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "yyyy-MM-dd HH:mm:ss");
        }
        return val;
      });
      sheet.appendRow(newRow);
      return createResponse({success: true, id: params.data.id});
    }
    
    if (params.action === 'update') {
      for (var i = 1; i < dataRows.length; i++) {
        if (dataRows[i][0].toString() === params.id.toString()) {
          var rowRange = sheet.getRange(i + 1, 1, 1, headers.length);
          var updatedRow = headers.map(function(h) { 
            return params.data[h] !== undefined ? params.data[h] : dataRows[i][headers.indexOf(h)]; 
          });
          rowRange.setValues([updatedRow]);
          return createResponse({success: true});
        }
      }
      return createResponse({success: false, message: "ID not found: " + params.id});
    }

    if (params.action === 'delete') {
      for (var i = 1; i < dataRows.length; i++) {
        if (dataRows[i][0].toString() === params.id.toString()) {
          sheet.deleteRow(i + 1);
          return createResponse({success: true});
        }
      }
      return createResponse({success: false, message: "ID not found for deletion"});
    }
  } catch (error) {
    return createResponse({success: false, message: error.toString()});
  }
  return createResponse({success: false, message: "Unknown Action"});
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[3rem] border border-sky-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 text-sky-50/50 group-hover:scale-110 transition-transform"><FileSpreadsheet size={140}/></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Cloud Automation</h1>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isTesting ? 'bg-amber-100 text-amber-600 animate-pulse' : 'bg-emerald-100 text-emerald-600'}`}>
              {isTesting ? 'Validating Link...' : 'Database Connected'}
            </div>
          </div>
          <p className="text-slate-400 font-medium uppercase text-[10px] tracking-widest flex items-center gap-2">
            <Wifi size={14} className="text-emerald-500" /> Linked Sheet ID: <span className="text-slate-800 font-bold">{API_CONFIG.GOOGLE_SHEET_ID.substring(0, 10)}...</span>
          </p>
        </div>
        <div className="flex gap-4 relative z-10">
           <button onClick={checkConnectivity} disabled={isTesting} className="bg-white text-sky-500 border-2 border-sky-500 px-8 py-4 rounded-[2rem] font-black shadow-lg hover:bg-sky-50 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50">
             <RefreshCw className={isTesting ? 'animate-spin' : ''} size={20} /> <span>Audit Connectivity</span>
           </button>
           <button onClick={() => window.open(`https://docs.google.com/spreadsheets/d/${API_CONFIG.GOOGLE_SHEET_ID}`)} className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black shadow-lg hover:bg-slate-800 transition-all flex items-center gap-3 active:scale-95">
             <ExternalLink size={20} /> <span>Open SpreadSheet</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
           <div className="bg-white p-10 rounded-[3.5rem] border border-sky-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-wider"><Database className="text-sky-500"/> Enterprise Data Model</h3>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Cloud Status</span>
              </div>

              <div className="space-y-4">
                 {sheetStatuses.map(sheet => (
                   <div key={sheet.name} className={`border rounded-[2.5rem] overflow-hidden transition-all hover:border-sky-200 ${sheet.status === 'ok' ? 'border-slate-100 bg-white' : 'border-rose-100 bg-rose-50/20'}`}>
                      <div onClick={() => setExpandedSheet(expandedSheet === sheet.name ? null : sheet.name)} className="flex items-center justify-between p-6 cursor-pointer">
                         <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${sheet.status === 'ok' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                              {sheet.status === 'ok' ? <CheckCircle2 size={28}/> : <AlertCircle size={28}/>}
                            </div>
                            <div>
                               <div className="flex items-center gap-2">
                                  <p className="font-black text-slate-700 text-lg tracking-tight">{sheet.name}</p>
                                  {sheet.latency && <span className="text-[9px] font-black text-slate-300 uppercase">{sheet.latency}ms</span>}
                               </div>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{sheet.rowCount} Objects • {sheet.status === 'ok' ? 'Cloud Verified' : 'Handshake Failed'}</p>
                            </div>
                         </div>
                         <ChevronDown size={20} className={`text-slate-300 transition-transform ${expandedSheet === sheet.name ? 'rotate-180' : ''}`}/>
                      </div>
                      
                      {expandedSheet === sheet.name && (
                        <div className="p-8 bg-slate-50 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                           <div className="flex items-center justify-between mb-4">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={14}/> Column Mapping Definition</p>
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {REQUIRED_SHEETS.find(s=>s.name===sheet.name)?.cols.map(c => (
                                <span key={c} className="px-4 py-2 rounded-xl text-[11px] font-bold border border-slate-200 bg-white text-slate-600 flex items-center gap-1.5">
                                   <Check size={10} className="text-emerald-500"/> {c}
                                </span>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
           <div className="bg-white p-10 rounded-[3.5rem] border border-sky-100 shadow-sm relative group overflow-hidden">
              <h3 className="text-2xl font-black mb-4 flex items-center gap-3"><Code className="text-sky-500"/> Master Deployment V7</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-10 font-medium">
                คัดลอกสคริปต์ V7 ล่าสุดนี้ไปวางใน <b>Google Apps Script</b> เพื่อเปิดใช้งานระบบจัดเก็บข้อมูล Cloud 100% สำหรับทุกโมดูลรวมถึง "กิจกรรมบริษัท" และการบันทึกประวัติกิจกรรมระบบ
              </p>
              
              <div className="space-y-4">
                 <button 
                   onClick={() => { navigator.clipboard.writeText(gasScript); alert('Master Automation Script V7 copied!'); }}
                   className="w-full py-5 bg-sky-500 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-sky-600 transition-all flex items-center justify-center gap-3 shadow-xl"
                 >
                    <Copy size={20}/> คัดลอกสคริปต์ V7 (Full Cloud Sync)
                 </button>
                 <button onClick={() => setShowFullCode(!showFullCode)} className="w-full py-5 bg-slate-50 text-slate-500 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">
                    {showFullCode ? 'ปิดการแสดงผล' : 'ดูโค้ดสคริปต์ฉบับเต็ม'}
                 </button>
              </div>

              {showFullCode && (
                <div className="mt-8 bg-slate-900 p-6 rounded-[2rem] border border-white/5 max-h-96 overflow-y-auto scrollbar-hide shadow-2xl">
                   <pre className="text-[10px] font-mono text-emerald-400 leading-relaxed overflow-x-auto whitespace-pre">{gasScript}</pre>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
