import { useState } from 'react';
import { usePatients } from './hooks';
import { Modal, Loading, ErrorDisplay } from './components';

interface Props {
  onRefresh: () => void;
}

export function PatientList({ onRefresh }: Props) {
  const { patients, loading, error, fetchPatients, createPatient, deletePatient } = usePatients();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', age: '', gender: 'male', contact: '', address: '', condition: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdd = async () => {
    setErrorMsg('');
    try {
      await createPatient({
        name: form.name,
        age: parseInt(form.age),
        gender: form.gender as 'male' | 'female' | 'other',
        contact: form.contact || undefined,
        address: form.address || undefined,
        condition: form.condition || undefined,
      });
      setShowAdd(false);
      setForm({ name: '', age: '', gender: 'male', contact: '', address: '', condition: '' });
      onRefresh();
    } catch (e: any) {
      setErrorMsg(e.message || '등록 실패');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('이 환자를 삭제하시겠습니까?')) {
      try {
        await deletePatient(id);
        onRefresh();
      } catch (e: any) {
        setErrorMsg(e.message || '삭제 실패');
      }
    }
  };

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.contact?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">환자 관리</h2>
          <p className="text-sm text-gray-500">환자 등록 및 목록 관리</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition font-medium"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          환자 추가
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="환자 이름 또는 연락처 검색..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />
        <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {loading && <Loading />}
      {error && <ErrorDisplay message={error} onRetry={fetchPatients} />}
      {errorMsg && <ErrorDisplay message={errorMsg} />}

      {!loading && !error && patients.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-500">등록된 환자가 없습니다</p>
          <button onClick={() => setShowAdd(true)} className="mt-3 text-primary text-sm underline">
            첫 환자를 등록해보세요
          </button>
        </div>
      )}

      {!loading && patients.length > 0 && (
        <div className="space-y-2">
          {filtered.map((patient) => (
            <div
              key={patient.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{patient.name}</p>
                  <p className="text-sm text-gray-500">
                    {patient.age}세 / {patient.gender === 'male' ? '남성' : patient.gender === 'female' ? '여성' : '기타'}
                    {patient.condition ? ` / ${patient.condition}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {patient.contact && (
                  <span className="text-sm text-gray-400">{patient.contact}</span>
                )}
                <button
                  onClick={() => handleDelete(patient.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="삭제"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="환자 등록">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="환자 이름"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">나이 *</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="나이"
                min={0}
                max={150}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">성별 *</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
              >
                <option value="male">남성</option>
                <option value="female">여성</option>
                <option value="other">기타</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
            <input
              type="text"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="010-1234-5678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="주소"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">증상/상태</label>
            <input
              type="text"
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="예:감기, 고혈압..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowAdd(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              취소
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium"
            >
              등록하기
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
