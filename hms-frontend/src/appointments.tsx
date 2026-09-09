import { useState } from 'react';
import { useAppointments, usePatients, useDoctors } from './hooks';
import { Modal, Loading, ErrorDisplay, StatusBadge } from './components';

interface Props {
  onRefresh: () => void;
}

export function AppointmentList({ onRefresh }: Props) {
  const { appointments, loading, error, fetchAppointments, createAppointment, updateStatus, deleteAppointment } = useAppointments();
  const { patients } = usePatients();
  const { doctors } = useDoctors();

  const [showAdd, setShowAdd] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [form, setForm] = useState({ patient_id: '', doctor_id: '', appt_date: '', appt_time: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [conflict, setConflict] = useState(false);

  // 검색어에 따른 필터링된 목록
  const filteredPatients = patients.filter(
    (p) => p.name.toLowerCase().includes(patientSearch.toLowerCase())
  );
  const filteredDoctors = doctors.filter(
    (d) => d.name.toLowerCase().includes(doctorSearch.toLowerCase()) || d.specialization.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  const handleAdd = async () => {
    setErrorMsg('');
    setConflict(false);
    try {
      await createAppointment({
        patient_id: form.patient_id,
        doctor_id: form.doctor_id,
        appt_date: form.appt_date,
        appt_time: form.appt_time,
      });
      setShowAdd(false);
      setForm({ patient_id: '', doctor_id: '', appt_date: '', appt_time: '' });
      setPatientSearch('');
      setDoctorSearch('');
      onRefresh();
      // 충돌(false)이면 성공, 충돌(true)이면 이미 번째 createAppointment에서 던져진 에러가 catch됨
    } catch (e: any) {
      if (e.message?.includes('충돌')) {
        setConflict(true);
        setErrorMsg(e.message);
      } else {
        setErrorMsg(e.message || '예약 실패');
      }
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'confirmed' | 'completed') => {
    try {
      await updateStatus(id, status);
      onRefresh();
    } catch (e: any) {
      setErrorMsg(e.message || '상태 변경 실패');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('이 예약을 삭제하시겠습니까?')) {
      try {
        await deleteAppointment(id);
        onRefresh();
      } catch (e: any) {
        setErrorMsg(e.message || '삭제 실패');
      }
    }
  };

  // 날짜/시간순 정렬
  const sorted = [...appointments].sort((a, b) => {
    if (a.appt_date !== b.appt_date) return a.appt_date.localeCompare(b.appt_date);
    return a.appt_time.localeCompare(b.appt_time);
  });

  // 상태별 색상
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-50 border-yellow-200',
    confirmed: 'bg-blue-50 border-blue-200',
    completed: 'bg-green-50 border-green-200',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">예약 관리</h2>
          <p className="text-sm text-gray-500">진료 예약 등록 및 상태 관리</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition font-medium"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          예약 추가
        </button>
      </div>

      {loading && <Loading />}
      {error && <ErrorDisplay message={error} onRetry={fetchAppointments} />}
      {errorMsg && <ErrorDisplay message={errorMsg} />}
      {conflict && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-yellow-800 text-sm">{errorMsg}</p>
        </div>
      )}

      {!loading && appointments.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500">예약 내역이 없습니다</p>
          <button onClick={() => setShowAdd(true)} className="mt-3 text-primary text-sm underline">
            첫 예약을 등록해보세요
          </button>
        </div>
      )}

      {!loading && appointments.length > 0 && (
        <div className="space-y-2">
          {sorted.map((apt) => (
            <div
              key={apt.id}
              className={`bg-white border rounded-lg p-4 hover:shadow-md transition ${statusColors[apt.status]}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <p className="text-sm font-bold text-gray-700">{apt.appt_date}</p>
                    <p className="text-lg font-bold text-primary">{apt.appt_time}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{apt.patient_name}</p>
                    <p className="text-sm text-gray-500">{apt.patient_age}세 / {apt.patient_gender === 'male' ? '남성' : apt.patient_gender === 'female' ? '여성' : '기타'}</p>
                  </div>
                  <div className="w-px h-8 bg-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900">{apt.doctor_name}</p>
                    <p className="text-sm text-blue-600">{apt.specialization}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={apt.status} />
                  {apt.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(apt.id, 'confirmed')}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
                    >
                      확정
                    </button>
                  )}
                  {apt.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusChange(apt.id, 'completed')}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition"
                    >
                      완료
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(apt.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="삭제"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 예약 추가 모달 */}
      <Modal isOpen={showAdd} onClose={() => { setShowAdd(false); setConflict(false); setErrorMsg(''); }} title="예약 등록">
        <div className="space-y-4">
          {/* 환자 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">환자 *</label>
            <div className="relative">
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="환자 이름 검색..."
              />
              {patientSearch && filteredPatients.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
                  {filteredPatients.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, patient_id: p.id });
                        setPatientSearch('');
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b last:border-0 ${form.patient_id === p.id ? 'bg-primary/10 text-primary' : 'text-gray-700'}`}
                    >
                      {p.name} ({p.age}세)
                    </button>
                  ))}
                </div>
              )}
            </div>
            {form.patient_id && (
              <p className="mt-1 text-sm text-primary font-medium">
                선택: {patients.find((p) => p.id === form.patient_id)?.name}
              </p>
            )}
          </div>

          {/* 의사 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">의사 *</label>
            <div className="relative">
              <input
                type="text"
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="의사 이름 또는 전문 분야 검색..."
              />
              {doctorSearch && filteredDoctors.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
                  {filteredDoctors.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, doctor_id: d.id });
                        setDoctorSearch('');
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b last:border-0 ${form.doctor_id === d.id ? 'bg-primary/10 text-primary' : 'text-gray-700'}`}
                    >
                      {d.name} - {d.specialization}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {form.doctor_id && (
              <p className="mt-1 text-sm text-primary font-medium">
                선택: {doctors.find((d) => d.id === form.doctor_id)?.name} ({doctors.find((d) => d.id === form.doctor_id)?.specialization})
              </p>
            )}
          </div>

          {/* 날짜/시간 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">날짜 *</label>
              <input
                type="date"
                value={form.appt_date}
                onChange={(e) => setForm({ ...form, appt_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">시간 *</label>
              <input
                type="time"
                value={form.appt_time}
                onChange={(e) => setForm({ ...form, appt_time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { setShowAdd(false); setConflict(false); setErrorMsg(''); }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              취소
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium"
            >
              예약하기
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
