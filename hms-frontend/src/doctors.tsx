import { useState } from 'react';
import { useDoctors } from './hooks';
import { Modal, Loading, ErrorDisplay } from './components';

interface Props {
  onRefresh: () => void;
}

export function DoctorList({ onRefresh }: Props) {
  const { doctors, loading, error, fetchDoctors, createDoctor, deleteDoctor } = useDoctors();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', specialization: '', contact: '', schedule: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdd = async () => {
    setErrorMsg('');
    try {
      await createDoctor({
        name: form.name,
        specialization: form.specialization,
        contact: form.contact || undefined,
        schedule: form.schedule || undefined,
      });
      setShowAdd(false);
      setForm({ name: '', specialization: '', contact: '', schedule: '' });
      onRefresh();
    } catch (e: any) {
      setErrorMsg(e.message || '등록 실패');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('이 의사를 삭제하시겠습니까?')) {
      try {
        await deleteDoctor(id);
        onRefresh();
      } catch (e: any) {
        setErrorMsg(e.message || '삭제 실패');
      }
    }
  };

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">의사 관리</h2>
          <p className="text-sm text-gray-500">의사 등록 및 전문 분야 관리</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition font-medium"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          의사 추가
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="의사 이름 또는 전문 분야 검색..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />
        <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {loading && <Loading />}
      {error && <ErrorDisplay message={error} onRetry={fetchDoctors} />}
      {errorMsg && <ErrorDisplay message={errorMsg} />}

      {!loading && !error && doctors.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h-5.051" />
          </svg>
          <p className="text-gray-500">등록된 의사가 없습니다</p>
          <button onClick={() => setShowAdd(true)} className="mt-3 text-primary text-sm underline">
            의사를 등록해보세요
          </button>
        </div>
      )}

      {!loading && doctors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doctor.name}</p>
                    <p className="text-sm text-blue-600">{doctor.specialization}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(doctor.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="삭제"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              {doctor.schedule && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">진료 시간</p>
                  <p className="text-sm text-gray-600 mt-1">{doctor.schedule}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="의사 등록">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="의사 이름"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">전문 분야 *</label>
            <input
              type="text"
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="예: 내과, 외과, 소아과..."
            />
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
            <label className="block text-sm font-medium text-gray-700 mb-1">진료 시간</label>
            <input
              type="text"
              value={form.schedule}
              onChange={(e) => setForm({ ...form, schedule: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="예: 월~금 09:00~18:00"
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
