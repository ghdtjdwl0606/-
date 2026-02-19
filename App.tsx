
import React, { useState, useCallback } from 'react';
import { 
  ClipboardCopy, 
  Trash2, 
  FileSpreadsheet, 
  Plus, 
  UserPlus, 
  CheckCircle2, 
  Copy,
  LayoutTemplate,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { Student, TestType } from './types';
import { TEMPLATES } from './constants';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedTestType, setSelectedTestType] = useState<TestType>('EPT');
  const [excelInput, setExcelInput] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualScore, setManualScore] = useState('');
  const [manualScore2, setManualScore2] = useState('');
  const [manualClass, setManualClass] = useState('');
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [customTemplates, setCustomTemplates] = useState(TEMPLATES);

  // Parse Excel / Paste data
  const handleParseExcel = useCallback(() => {
    if (!excelInput.trim()) return;

    const lines = excelInput.trim().split(/\r?\n/);
    const newStudents: Student[] = lines.map((line) => {
      const parts = line.split(/\t/); // 엑셀은 탭 구분
      if (selectedTestType === 'TOEFL_JR') {
        return {
          id: crypto.randomUUID(),
          name: parts[0]?.trim() || '',
          score: parts[1]?.trim() || '',
          score2: parts[2]?.trim() || '',
          assignedClass: parts[3]?.trim() || '',
          testType: selectedTestType,
        };
      } else {
        return {
          id: crypto.randomUUID(),
          name: parts[0]?.trim() || '',
          score: parts[1]?.trim() || '',
          assignedClass: parts[2]?.trim() || '',
          testType: selectedTestType,
        };
      }
    }).filter(s => s.name);

    setStudents(prev => [...prev, ...newStudents]);
    setExcelInput('');
  }, [excelInput, selectedTestType]);

  const addManual = useCallback(() => {
    if (!manualName) return;
    setStudents(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: manualName,
        score: manualScore,
        score2: manualScore2,
        assignedClass: manualClass,
        testType: selectedTestType,
      }
    ]);
    setManualName('');
    setManualScore('');
    setManualScore2('');
    setManualClass('');
  }, [manualName, manualScore, manualScore2, manualClass, selectedTestType]);

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('모든 데이터를 삭제하시겠습니까?')) {
      setStudents([]);
    }
  };

  const generateMessage = (student: Student) => {
    const tpl = customTemplates[student.testType];
    return tpl
      .replace(/"{name}"/g, `"${student.name}"`)
      .replace(/"{score}"/g, `"${student.score}"`)
      .replace(/"{score2}"/g, `"${student.score2 || ''}"`)
      .replace(/"{assignedClass}"/g, `"${student.assignedClass}"`);
  };

  const copyToClipboard = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <div className="min-h-screen pb-12 bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white py-8 px-4 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <ClipboardCopy className="w-64 h-64 rotate-12" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3 tracking-tight">
              <span className="bg-indigo-500 p-2 rounded-xl shadow-lg shadow-indigo-500/30">
                <ClipboardCopy className="w-8 h-8 text-white" />
              </span>
              평가 결과 자동 안내기
            </h1>
            <p className="text-slate-400 font-medium mt-2">정기평가고사 결과를 간편하게 문구로 완성하세요.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsEditingTemplate(!isEditingTemplate)}
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border border-white/20 backdrop-blur-sm"
            >
              <LayoutTemplate className="w-4 h-4" />
              템플릿 커스텀
            </button>
            <button 
              onClick={clearAll}
              className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border border-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
              초기화
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: Inputs (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Test Type Selector */}
          <section className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex">
            {(['EPT', 'TOEFL_JR', 'TOEFL'] as TestType[]).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedTestType(type)}
                className={`flex-1 py-3 px-2 rounded-xl text-sm font-bold transition-all ${
                  selectedTestType === type 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </section>

          {/* Template Editor (Collapsible) */}
          {isEditingTemplate && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 animate-in fade-in slide-in-from-top-2">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-700">
                <LayoutTemplate className="w-5 h-5" />
                {selectedTestType.replace('_', ' ')} 템플릿 수정
              </h2>
              <textarea
                value={customTemplates[selectedTestType]}
                onChange={(e) => setCustomTemplates(prev => ({ ...prev, [selectedTestType]: e.target.value }))}
                rows={10}
                className="w-full p-4 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono leading-relaxed"
              />
              <button 
                onClick={() => setIsEditingTemplate(false)}
                className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
              >
                저장 및 닫기
              </button>
            </section>
          )}

          {/* Excel Paste Input */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              엑셀 붙여넣기
            </h2>
            <div className="bg-emerald-50 p-4 rounded-xl mb-4">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">복사 순서 가이드</span>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                {selectedTestType === 'TOEFL_JR' 
                  ? '1.이름 → 2.점수(R+L) → 3.점수(S+W) → 4.배정반'
                  : '1.이름 → 2.점수 → 3.배정반'
                }
                <br/>순으로 엑셀 영역을 복사해 붙여넣으세요.
              </p>
            </div>
            <textarea
              value={excelInput}
              onChange={(e) => setExcelInput(e.target.value)}
              placeholder={`여기에 엑셀 데이터를 붙여넣으세요...\n(예: 홍길동\t77\t${selectedTestType === 'TOEFL_JR' ? '80\t' : ''}MEGA 수금)`}
              className="w-full h-32 p-4 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none mb-3 bg-slate-50 transition-all focus:bg-white"
            />
            <button 
              onClick={handleParseExcel}
              disabled={!excelInput.trim()}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-100"
            >
              <Plus className="w-5 h-5" />
              {selectedTestType.replace('_', ' ')} 데이터 추가
            </button>
          </section>

          {/* Manual Input */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
              <UserPlus className="w-5 h-5 text-indigo-600" />
              직접 입력
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">학생 이름</label>
                <input
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="예: 홍길동"
                  className="w-full p-3.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-slate-50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">
                    {selectedTestType === 'TOEFL_JR' ? '점수 (R+L)' : '점수'}
                  </label>
                  <input
                    type="text"
                    value={manualScore}
                    onChange={(e) => setManualScore(e.target.value)}
                    placeholder="예: 77"
                    className="w-full p-3.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-slate-50"
                  />
                </div>
                {selectedTestType === 'TOEFL_JR' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">점수 (S+W)</label>
                    <input
                      type="text"
                      value={manualScore2}
                      onChange={(e) => setManualScore2(e.target.value)}
                      placeholder="예: 80"
                      className="w-full p-3.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-slate-50"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">배정반</label>
                <input
                  type="text"
                  value={manualClass}
                  onChange={(e) => setManualClass(e.target.value)}
                  placeholder="예: MEGA 수금"
                  className="w-full p-3.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-slate-50"
                />
              </div>
              <button 
                onClick={addManual}
                className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
              >
                리스트에 추가
              </button>
            </div>
          </section>

        </div>

        {/* Right Section: Results (8 cols) */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              문구 자동 생성 결과
              <span className="text-sm font-bold bg-slate-200 text-slate-600 px-3 py-1 rounded-full">
                총 {students.length}명
              </span>
            </h2>
          </div>

          {students.length === 0 ? (
            <div className="bg-white border-4 border-dashed border-slate-100 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-slate-300 text-center">
              <div className="bg-slate-50 p-8 rounded-full mb-6">
                <ClipboardCopy className="w-16 h-16 opacity-30" />
              </div>
              <p className="text-xl font-black text-slate-400">아직 입력된 데이터가 없습니다.</p>
              <p className="text-sm font-medium mt-3 text-slate-400">좌측 폼을 사용하여 학생 정보를 추가해주세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {students.map((student) => {
                const finalMessage = generateMessage(student);
                return (
                  <div 
                    key={student.id} 
                    className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden group hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
                  >
                    <div className="bg-slate-50 px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 group-hover:bg-indigo-50 transition-colors gap-4">
                      <div className="flex items-center gap-4">
                        <span className="bg-indigo-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-black shadow-lg shadow-indigo-200">
                          {student.name.charAt(0)}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-800 text-lg">{student.name}</span>
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-600 uppercase">
                              {student.testType.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-slate-400">
                            {student.assignedClass} · {student.score}점 {student.score2 ? `(${student.score2}점)` : ''}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => copyToClipboard(student.id, finalMessage)}
                          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all shadow-md ${
                            copyStatus[student.id] 
                              ? 'bg-emerald-500 text-white shadow-emerald-200' 
                              : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-slate-200'
                          }`}
                        >
                          {copyStatus[student.id] ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              복사 성공!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              문구 복사
                            </>
                          )}
                        </button>
                        <button 
                          onClick={() => deleteStudent(student.id)}
                          className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-white rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-8 bg-white relative">
                      <pre className="text-sm whitespace-pre-wrap text-slate-600 leading-relaxed font-sans selection:bg-indigo-100 outline-none">
                        {finalMessage}
                      </pre>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>

      {/* Mobile float buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 lg:hidden">
        {students.length > 0 && (
          <button 
            onClick={clearAll}
            className="bg-red-500 text-white w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          >
            <Trash2 className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
