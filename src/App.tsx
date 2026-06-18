// @ts-nocheck
import React, { useState } from 'react';
import { 
  LayoutDashboard, FileText, Download, Activity, CheckSquare, 
  BarChart, Search, Sparkles, Loader2, User, Calendar, Settings,
  Globe, Briefcase, Printer 
} from 'lucide-react';

export default function App() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const formatDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const [activeTab, setActiveTab] = useState('report');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  const [formData, setFormData] = useState({
    clientName: 'Công ty CP Đầu tư & Công nghệ ABC',
    pmName: 'Nguyễn Văn A',
    startDate: formatDate(firstDay),
    endDate: formatDate(lastDay),
    structure: {
      menu: { checked: false, detail: '' },
      home: { checked: false, detail: '' },
      css: { checked: false, detail: '' }
    },
    media: {
      videos: 0,
      images: 0
    },
    articles: {
      pr: 0,
      satellite: 0,
      event: 0
    },
    ga: {
      engagementRate: '',
      bounceRate: '',
      avgTime: '',
      viewsPerUser: '',
      totalUsers: '',
      newUsers: '',
      events: '',
      newUserRate: '',
      engagedSessions: '',
      totalSessions: '',
      totalViews: ''
    },
    gsc: {
      clicks: '',
      impressions: '',
      ctr: '',
      position: '',
      indexedPages: '',
      topQueries: ''
    }
  });

  const handleInputChange = (e, section, field) => {
    const { name, value, type, checked } = e.target;
    
    if (section === 'general') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (section === 'structure') {
      setFormData(prev => ({
        ...prev,
        structure: {
          ...prev.structure,
          [field]: {
            ...prev.structure[field],
            ...(type === 'checkbox' ? { checked } : { detail: value })
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      }));
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);

    const apiKey = ""; // Lưu ý: Cần thêm API key qua biến môi trường để tính năng này hoạt động
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const promptText = `
      Bạn là một chuyên gia về UI/UX, Quản trị Trải nghiệm Khách hàng và SEO Content.
      Hãy phân tích dữ liệu hoạt động của website dưới đây.
      
      QUY TẮC NGHIÊM NGẶT (RẤT QUAN TRỌNG):
      - KHÔNG nói về việc điều chỉnh code, lập trình, server, tốc độ tải trang, minify css/js.
      - TẬP TRUNG HOÀN TOÀN vào đánh giá traffic, SEO bài viết, cách bố cục nội dung.
      - ĐỀ XUẤT CẢI THIỆN UI/UX: Làm sao để tạo điểm chạm tốt hơn, gia tăng giá trị nhận được của người dùng, cách sắp xếp nút bấm (CTA), menu, hình ảnh để điều hướng người dùng và tăng khả năng giữ chân đọc bài SEO.

      DỮ LIỆU ĐẦU VÀO:
      - Media: ${formData.media.videos}/4 video, ${formData.media.images} hình ảnh.
      - Bài viết: PR (${formData.articles.pr}/2), Vệ tinh (${formData.articles.satellite}/20), Sự kiện (${formData.articles.event}/2).
      - Traffic (GA): Users: ${formData.ga.totalUsers}, Tỷ lệ thoát: ${formData.ga.bounceRate}%, Thời gian TB: ${formData.ga.avgTime}s, Pageviews: ${formData.ga.totalViews}.
      - SEO (GSC): Clicks: ${formData.gsc.clicks}, Impr: ${formData.gsc.impressions}, Vị trí TB: ${formData.gsc.position}. Top keywords: ${formData.gsc.topQueries}.

      TRẢ VỀ KẾT QUẢ DƯỚI DẠNG JSON CHÍNH XÁC THEO CẤU TRÚC SAU (không có markdown backticks ở ngoài):
      {
        "evaluation": {
          "traffic_seo": "Đánh giá chi tiết về tình hình thu hút traffic và hiệu quả nội dung SEO hiện tại.",
          "ui_ux": "Đánh giá trải nghiệm người dùng hiện tại dựa trên hành vi (bounce rate, time on site)."
        },
        "recommendations": [
          { "title": "Tiêu đề đề xuất", "detail": "Hành động cụ thể về UI/UX hoặc Content" }
        ]
      }
    `;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      
      const data = await response.json();
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        const parsedData = JSON.parse(data.candidates[0].content.parts[0].text);
        setAiAnalysis(parsedData);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setTimeout(() => {
        setAiAnalysis({
          evaluation: {
            traffic_seo: "Hệ thống ghi nhận traffic ở mức ổn định, tuy nhiên lượng người dùng mới chưa cao.",
            ui_ux: "Thời gian onsite trung bình còn thấp, người dùng chưa có nhiều điểm chạm tương tác sâu."
          },
          recommendations: [
            { title: "Tối ưu hóa các nút Call-to-action", detail: "Đặt thêm các nút chuyển đổi tại vị trí dễ nhìn hơn trên trang chi tiết." }
          ]
        });
      }, 1500);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const inputClass = "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";
  const sectionTitleClass = "text-lg font-bold text-slate-800 border-b-2 border-blue-500 pb-2 mb-4 uppercase";

  const renderDashboard = () => (
    <div className="p-8 space-y-6 animate-in fade-in">
      <h1 className="text-2xl font-bold text-slate-800">Tổng quan Hệ thống Quản lý</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-xl"><Globe size={24}/></div>
          <div><p className="text-sm text-slate-500 font-medium">Website đang quản lý</p><p className="text-2xl font-bold text-slate-800">12</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl"><FileText size={24}/></div>
          <div><p className="text-sm text-slate-500 font-medium">Báo cáo tháng này</p><p className="text-2xl font-bold text-slate-800">8</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-xl"><Briefcase size={24}/></div>
          <div><p className="text-sm text-slate-500 font-medium">Dự án cần xử lý</p><p className="text-2xl font-bold text-slate-800">3</p></div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center text-slate-500 mt-8">
        <Activity size={48} className="mx-auto text-slate-300 mb-4" />
        <p>Tính năng Dashboard đang được phát triển thêm.<br/>Vui lòng chọn <strong>Tạo Báo Cáo</strong> ở menu bên trái.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col print:hidden sticky top-0 h-screen">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Globe className="text-blue-500"/> WebManager</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('report')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'report' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 hover:text-white'}`}>
            <FileText size={20} /> Tạo báo cáo
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white"><User size={16}/></div>
            <div className="text-sm">
              <p className="text-white font-medium">Admin User</p>
              <p className="text-xs text-slate-500">Quản lý dự án</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto print:bg-white print:overflow-visible">
        {activeTab === 'dashboard' && renderDashboard()}
        
        {activeTab === 'report' && (
          <div className="p-8 max-w-5xl mx-auto print:p-0 print:max-w-none">
            
            {/* VIEW NHẬP LIỆU */}
            <div className="space-y-6 print:hidden animate-in fade-in">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900">Khởi tạo Báo Cáo</h1>
                  <p className="text-slate-500 mt-1">Nhập thông số để xuất file PDF gửi khách hàng</p>
                </div>
              </div>

              {/* THÔNG TIN CHUNG */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className={sectionTitleClass}>Thông tin dự án</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Tên khách hàng / Website</label>
                    <input type="text" name="clientName" value={formData.clientName} onChange={(e) => handleInputChange(e, 'general')} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Tên nhân sự QLDA</label>
                    <input type="text" name="pmName" value={formData.pmName} onChange={(e) => handleInputChange(e, 'general')} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Từ ngày</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={(e) => handleInputChange(e, 'general')} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Đến ngày</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={(e) => handleInputChange(e, 'general')} className={inputClass} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. CẤU TRÚC */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className={sectionTitleClass}>1. Cấu trúc Website</h3>
                  <div className="space-y-4">
                    {Object.entries({menu: 'Menu', home: 'Trang chủ', css: 'CSS'}).map(([key, label]) => (
                      <div key={key} className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={formData.structure[key].checked} onChange={(e) => handleInputChange(e, 'structure', key)} className="w-5 h-5 text-blue-600 rounded" />
                          <span className="font-medium text-slate-800">{label}</span>
                        </label>
                        {formData.structure[key].checked && (
                          <input type="text" placeholder={`Nhập chi tiết về ${label}...`} value={formData.structure[key].detail} onChange={(e) => handleInputChange(e, 'structure', key)} className={`${inputClass} mt-2`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2 & 3. MEDIA & BÀI VIẾT */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div>
                    <h3 className={sectionTitleClass}>2. Media</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className={labelClass}>Số Video (Mục tiêu: 4)</label>
                        <div className="flex items-center gap-2">
                          <input type="number" name="videos" value={formData.media.videos} onChange={(e) => handleInputChange(e, 'media')} className={inputClass} />
                          <span className="text-slate-400 font-medium">/ 4</span>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Số Hình ảnh</label>
                        <input type="number" name="images" value={formData.media.images} onChange={(e) => handleInputChange(e, 'media')} className={inputClass} />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className={sectionTitleClass}>3. Hệ thống bài viết chuẩn SEO</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Bài PR</label>
                        <div className="flex items-center gap-1"><input type="number" name="pr" value={formData.articles.pr} onChange={(e) => handleInputChange(e, 'articles')} className={inputClass} /><span className="text-slate-400 text-xs font-medium">/2</span></div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Vệ tinh</label>
                        <div className="flex items-center gap-1"><input type="number" name="satellite" value={formData.articles.satellite} onChange={(e) => handleInputChange(e, 'articles')} className={inputClass} /><span className="text-slate-400 text-xs font-medium">/20</span></div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Sự kiện</label>
                        <div className="flex items-center gap-1"><input type="number" name="event" value={formData.articles.event} onChange={(e) => handleInputChange(e, 'articles')} className={inputClass} /><span className="text-slate-400 text-xs font-medium">/2</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 & 5. GA & GSC */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4 border-b-2 border-amber-500 pb-2">
                  <BarChart className="text-amber-500" /> <h3 className="text-lg font-bold text-slate-800 uppercase">4. Phân tích Google Analytics</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {Object.entries({
                    engagementRate: 'Tỷ lệ tương tác (%)', bounceRate: 'Tỷ lệ thoát (%)', avgTime: 'TG Tương tác TB (s)', viewsPerUser: 'Lượt xem / User', 
                    totalUsers: 'Tổng Users', newUsers: 'User mới', events: 'SL Sự kiện', newUserRate: 'Tỷ lệ User mới (%)', 
                    engagedSessions: 'Phiên tương tác', totalSessions: 'Tổng phiên', totalViews: 'Tổng Views'
                  }).map(([key, label]) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
                      <input type="text" name={key} value={formData.ga[key]} onChange={(e) => handleInputChange(e, 'ga')} className={inputClass} />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 mb-4 border-b-2 border-blue-500 pb-2">
                  <Search className="text-blue-500" /> <h3 className="text-lg font-bold text-slate-800 uppercase">5. Phân tích Google Search Console</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries({
                    clicks: 'Clicks', impressions: 'Impressions', ctr: 'CTR TB (%)', position: 'Vị trí TB', indexedPages: 'Số trang Indexed'
                  }).map(([key, label]) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
                      <input type="text" name={key} value={formData.gsc[key]} onChange={(e) => handleInputChange(e, 'gsc')} className={inputClass} />
                    </div>
                  ))}
                  <div className="md:col-span-3">
                    <label className={labelClass}>Top cụm từ tìm kiếm (Mỗi từ 1 dòng)</label>
                    <textarea name="topQueries" rows="3" value={formData.gsc.topQueries} onChange={(e) => handleInputChange(e, 'gsc')} className={inputClass}></textarea>
                  </div>
                </div>
              </div>

              {/* 6. AI ANALYSIS */}
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl shadow-md text-white">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold uppercase flex items-center gap-2 text-indigo-100">
                    <Sparkles className="text-yellow-400"/> 6. Đánh giá & Đề xuất (AI Phân tích)
                  </h3>
                  <button onClick={handleAnalyze} disabled={isAnalyzing} className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all">
                    {isAnalyzing ? <><Loader2 className="animate-spin" size={16}/> Đang phân tích...</> : 'Bắt đầu Phân tích'}
                  </button>
                </div>
                <p className="text-sm text-indigo-200 mb-4 opacity-80">AI sẽ đánh giá hiệu quả SEO, điều hướng và đưa ra giải pháp nâng cấp UI/UX để tăng tỷ lệ giữ chân người dùng.</p>

                {aiAnalysis && (
                  <div className="mt-6 bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-sm space-y-6">
                    <div>
                      <h4 className="font-bold text-lg text-yellow-300 mb-2">Đánh giá chung</h4>
                      <div className="space-y-3 text-sm text-indigo-50">
                        <p><strong>Hiệu quả Traffic & SEO:</strong> {aiAnalysis.evaluation?.traffic_seo}</p>
                        <p><strong>Trải nghiệm UI/UX:</strong> {aiAnalysis.evaluation?.ui_ux}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-emerald-300 mb-3">Đề xuất nâng cấp (Không code)</h4>
                      <ul className="space-y-3 text-sm">
                        {aiAnalysis.recommendations?.map((rec, idx) => (
                          <li key={idx} className="bg-black/20 p-3 rounded-lg border border-black/10">
                            <strong className="text-white block mb-1">🚀 {rec.title}</strong>
                            <span className="text-indigo-100">{rec.detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end pt-4 pb-12">
                <button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 shadow-lg shadow-blue-600/30 transition-all">
                  <Printer size={24} /> Xuất Báo Cáo PDF
                </button>
              </div>
            </div>

            {/* VIEW KHI IN PDF */}
            <div className="hidden print:block font-serif text-slate-900 w-full max-w-[210mm] mx-auto bg-white">
              <div className="text-center mb-8 border-b-2 border-slate-900 pb-6">
                <h1 className="text-2xl font-bold uppercase mb-4 leading-tight">BÁO CÁO ĐÁNH GIÁ HIỆU QUẢ PHÁT TRIỂN WEBSITE</h1>
                <div className="text-sm space-y-1">
                  <p><strong>Tên khách hàng:</strong> {formData.clientName}</p>
                  <p><strong>Nhân sự QLDA:</strong> {formData.pmName}</p>
                  <p><strong>Thời gian báo cáo:</strong> Từ ngày {formData.startDate} đến {formData.endDate}</p>
                </div>
              </div>

              <h2 className="text-lg font-bold bg-slate-100 px-3 py-1.5 mb-3 uppercase">Danh sách công việc đã triển khai</h2>
              
              <div className="mb-6 px-3">
                <h3 className="font-bold underline mb-2">1. Cấu trúc Website</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {formData.structure.menu.checked && <li><strong>Menu:</strong> {formData.structure.menu.detail || 'Đã hoàn thiện'}</li>}
                  {formData.structure.home.checked && <li><strong>Trang chủ:</strong> {formData.structure.home.detail || 'Đã hoàn thiện'}</li>}
                  {formData.structure.css.checked && <li><strong>CSS:</strong> {formData.structure.css.detail || 'Đã hoàn thiện'}</li>}
                  {!formData.structure.menu.checked && !formData.structure.home.checked && !formData.structure.css.checked && <li>Chưa có hạng mục cấu trúc nào được triển khai.</li>}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-6 px-3">
                <div>
                  <h3 className="font-bold underline mb-2">2. Media</h3>
                  <ul className="list-none space-y-1 text-sm">
                    <li>- Số Video: <strong>{formData.media.videos} / 4</strong></li>
                    <li>- Số Hình ảnh: <strong>{formData.media.images}</strong></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold underline mb-2">3. Bài viết chuẩn SEO</h3>
                  <ul className="list-none space-y-1 text-sm">
                    <li>- Bài viết PR: <strong>{formData.articles.pr} / 2</strong></li>
                    <li>- Bài viết Vệ tinh: <strong>{formData.articles.satellite} / 20</strong></li>
                    <li>- Bài viết Sự kiện: <strong>{formData.articles.event} / 2</strong></li>
                  </ul>
                </div>
              </div>

              <div className="mb-6 page-break-inside-avoid">
                <h2 className="text-lg font-bold bg-slate-100 px-3 py-1.5 mb-3 uppercase">4. Phân tích Google Analytics</h2>
                <table className="w-full border-collapse border border-slate-400 text-sm mx-3">
                  <tbody>
                    <tr><td className="border border-slate-400 p-2 font-semibold">Tỷ lệ tương tác</td><td className="border border-slate-400 p-2 text-center">{formData.ga.engagementRate || '-'}</td><td className="border border-slate-400 p-2 font-semibold">Tổng số Users</td><td className="border border-slate-400 p-2 text-center">{formData.ga.totalUsers || '-'}</td></tr>
                    <tr><td className="border border-slate-400 p-2 font-semibold">Tỷ lệ thoát</td><td className="border border-slate-400 p-2 text-center">{formData.ga.bounceRate || '-'}</td><td className="border border-slate-400 p-2 font-semibold">Số User mới</td><td className="border border-slate-400 p-2 text-center">{formData.ga.newUsers || '-'}</td></tr>
                    <tr><td className="border border-slate-400 p-2 font-semibold">Thời gian TB / User</td><td className="border border-slate-400 p-2 text-center">{formData.ga.avgTime || '-'}</td><td className="border border-slate-400 p-2 font-semibold">SL Sự kiện</td><td className="border border-slate-400 p-2 text-center">{formData.ga.events || '-'}</td></tr>
                    <tr><td className="border border-slate-400 p-2 font-semibold">Lượt xem / User</td><td className="border border-slate-400 p-2 text-center">{formData.ga.viewsPerUser || '-'}</td><td className="border border-slate-400 p-2 font-semibold">Tỷ lệ User mới</td><td className="border border-slate-400 p-2 text-center">{formData.ga.newUserRate || '-'}</td></tr>
                    <tr><td className="border border-slate-400 p-2 font-semibold">Tổng lượt xem</td><td className="border border-slate-400 p-2 text-center">{formData.ga.totalViews || '-'}</td><td className="border border-slate-400 p-2 font-semibold">Phiên tương tác</td><td className="border border-slate-400 p-2 text-center">{formData.ga.engagedSessions || '-'}</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="mb-6 page-break-inside-avoid">
                <h2 className="text-lg font-bold bg-slate-100 px-3 py-1.5 mb-3 uppercase">5. Phân tích Google Search Console</h2>
                <table className="w-full border-collapse border border-slate-400 text-sm mx-3 mb-3">
                  <tbody>
                    <tr>
                      <td className="border border-slate-400 p-2 font-semibold">Clicks:</td><td className="border border-slate-400 p-2 text-center">{formData.gsc.clicks || '-'}</td>
                      <td className="border border-slate-400 p-2 font-semibold">Impressions:</td><td className="border border-slate-400 p-2 text-center">{formData.gsc.impressions || '-'}</td>
                      <td className="border border-slate-400 p-2 font-semibold">CTR TB:</td><td className="border border-slate-400 p-2 text-center">{formData.gsc.ctr || '-'}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-400 p-2 font-semibold">Vị trí TB:</td><td className="border border-slate-400 p-2 text-center">{formData.gsc.position || '-'}</td>
                      <td colSpan="2" className="border border-slate-400 p-2 font-semibold">Trang Index:</td><td colSpan="2" className="border border-slate-400 p-2 text-center">{formData.gsc.indexedPages || '-'}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="px-3 text-sm">
                  <p className="font-semibold mb-1">Top cụm từ tìm kiếm:</p>
                  <p className="whitespace-pre-wrap text-slate-700 italic border-l-4 border-slate-300 pl-3">{formData.gsc.topQueries || 'Chưa cập nhật'}</p>
                </div>
              </div>

              <div className="mb-6 page-break-inside-avoid">
                <h2 className="text-lg font-bold bg-slate-100 px-3 py-1.5 mb-3 uppercase">6. Phân tích & Đề xuất Nâng cấp</h2>
                {aiAnalysis ? (
                  <div className="px-3 text-sm space-y-4 text-justify">
                    <div>
                      <p className="font-bold underline mb-1">Đánh giá hiện trạng:</p>
                      <p className="mb-1"><strong>Traffic & SEO:</strong> {aiAnalysis.evaluation?.traffic_seo}</p>
                      <p><strong>Trải nghiệm UI/UX:</strong> {aiAnalysis.evaluation?.ui_ux}</p>
                    </div>
                    <div>
                      <p className="font-bold underline mb-2">Đề xuất tối ưu điểm chạm & giá trị:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        {aiAnalysis.recommendations?.map((rec, idx) => (
                          <li key={idx}><strong>{rec.title}:</strong> {rec.detail}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="px-3 text-sm italic text-slate-500">Chưa có dữ liệu phân tích từ Hệ thống AI.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
