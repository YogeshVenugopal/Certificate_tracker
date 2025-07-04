import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DocumentTable from '../Components/DocumentTable';
import { motion } from 'framer-motion';
import { IoIosArrowBack, IoIosArrowForward, IoMdAdd } from "react-icons/io";
import { API_CALL } from '../Utils/utils';
import { emailVerification } from '../Utils/utils';

const EditFile = () => {
  const { id, version } = useParams();
  const maxVersion = parseInt(version);
  const [currentVersion, setCurrentVersion] = useState(parseInt(version) || 0);
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const [formData, setFormData] = useState({
    username: "",
    admission_no: "",
    name: "",
    email: "",
    department: "",
    student_no: "",
    parent_no: "",
    parent_name: "",
    quota: "",
    version: 0,
    studies: "",
    locked: false,
    files: [],
    remark: "",
    modifier: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRemarkActive, setIsRemarkActive] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [parentNoError, setParentNoError] = useState('');
  const [studentNoError, setStudentNoError] = useState('');

  // Define department options based on program selection
  const getDepartmentOptions = (programType) => {
    switch (programType) {
      case 'UG':
      case 'LATERAL':
        return [
          { value: 'CSE', label: 'CSE' },
          { value: 'AIDS', label: 'AIDS' },
          { value: 'ECE', label: 'ECE' },
          { value: 'IT', label: 'IT' },
          { value: 'CSBS', label: 'CSBS' },
          { value: 'AIML', label: 'AIML' },
          { value: 'CYS', label: 'CYS' },
          { value: 'Mech', label: 'Mech' },
          { value: 'R&A', label: 'R&A' }
        ];
      case 'PG_MBA':
        return [
          { value: 'PG_MBA', label: 'PG - MBA' }
        ];
      case 'PG_ME':
        return [
          { value: 'ME_CSE', label: 'ME - CSE' },
          { value: 'ME_AE', label: 'ME - AE' }
        ];
      default:
        return [];
    }
  };

  // Handle program change
  const handleProgramChange = (e) => {
    const selectedProgram = e.target.value;
    setFormData((prev) => ({
      ...prev,
      studies: selectedProgram,
      department: selectedProgram === 'PG_MBA' ? 'PG_MBA' : ''
    }));
  };

  // Get current department options
  const departmentOptions = getDepartmentOptions(formData.studies);

  // Handle phone number input validation
  const handlePhoneNumberChange = (e, field) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setFormData({ ...formData, [field]: value });
      if (field === 'parent_no') {
        setParentNoError(value.length !== 10 && value ? 'Phone number must be 10 digits' : '');
      } else if (field === 'student_no') {
        setStudentNoError(value.length !== 10 && value ? 'Phone number must be 10 digits' : '');
      }
    }
  };

  const handleEdit = () => {
    if (currentVersion === maxVersion) {
      setEditMode(!editMode);
      if (editMode) {
        setIsRemarkActive(false);
      } else {
        setIsRemarkActive(!!formData.remark);
      }
    } else {
      setError('You can only edit the latest version of this document');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRemarkClick = () => {
    setIsRemarkActive(true);
  };

  const openConfirmationPopup = () => {
    if (!formData.name || !formData.parent_name || !formData.email || !formData.parent_no || !formData.student_no || !formData.studies || !formData.department || !formData.quota) {
      setError('All fields are required');
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (!emailVerification(formData.email)) {
      setError('Please enter a valid email');
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (formData.parent_no.length !== 10) {
      setError('Parent phone number must be exactly 10 digits');
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (formData.student_no.length !== 10) {
      setError('Student phone number must be exactly 10 digits');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setShowPopup(true);
  };

  const closeConfirmationPopup = () => {
    setShowPopup(false);
  };

  const handleSave = async (lockStatus) => {
    closeConfirmationPopup();
    setSavingLoading(true);

    const dataToSend = {
      ...formData,
      locked: lockStatus,
      modifier: storedUser,
      parent_no: parseInt(formData.parent_no, 10),
      student_no: parseInt(formData.student_no, 10)
    };

    try {
      const response = await fetch(`${API_CALL}/updateStudent/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });
      if (response.ok) {
        setEditMode(false);
        setSuccess('Student data updated successfully');
        setIsRemarkActive(false);
        setTimeout(() => {
          setSuccess('');
          navigate(-1);
        }, 2000);
      } else {
        setError('Failed to save the student changes...!');
        setTimeout(() => setError(''), 5000);
      }
    } catch (error) {
      setError('Failed to save the student changes: ' + error.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setSavingLoading(false);
    }
  };

  const handleVersionChange = (increment) => {
    const newVersion = currentVersion + increment;
    if (newVersion >= 0 && newVersion <= maxVersion) {
      setCurrentVersion(newVersion);
      fetchStudentData(newVersion);
      if (newVersion !== maxVersion) {
        setEditMode(false);
      }
    }
  };

  const fetchStudentData = async (versionToFetch) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_CALL}/getStudent/${id}/${versionToFetch}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const resData = await response.json();
        setFormData(resData);
        setIsRemarkActive(!!resData.remark);
        setSuccess('Fetched student data successfully');
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError('Failed to fetch student data');
        setTimeout(() => setError(''), 5000);
      }
    } catch (error) {
      setError('Error fetching student data: ' + error.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialVersion = parseInt(version) || 0;
    setCurrentVersion(initialVersion);
    fetchStudentData(initialVersion);
  }, [id, version]);

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }

  const updateFileData = (index, field, value) => {
    if (formData.files && formData.files.length > 0) {
      const updatedFiles = [...formData.files];
      if (field === 'fileObject') {
        updatedFiles[index] = value;
      } else {
        updatedFiles[index] = {
          ...updatedFiles[index],
          [field]: value
        };
      }
      setFormData({ ...formData, files: updatedFiles });
    }
  };

  // Confirmation Popup Component
  const ConfirmationPopup = () => {
    const [localLocked, setLocalLocked] = useState(formData.locked || false);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
          <h3 className="mb-4 text-xl font-bold text-gray-800">Confirm Save</h3>
          <p className="mb-6 text-gray-600">Have you finished updating the student details?</p>
          <div className="flex items-center mb-6">
            <input
              type="radio"
              id="lockStatus"
              checked={localLocked}
              onChange={(e) => setLocalLocked(e.target.checked)}
              className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded-full focus:ring-blue-500"
            />
            <label htmlFor="lockStatus" className="text-gray-700">Set as locked</label>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={closeConfirmationPopup}
              disabled={savingLoading}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSave(localLocked)}
              disabled={savingLoading}
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center min-w-[80px]"
            >
              {savingLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="w-12 h-12 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className='font-semibold'>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute px-3 py-3 font-bold text-red-500 border-2 bg-red-100 border-red-500 rounded top-2 right-[45%] text-lg transform -translate-x-1/2"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute px-3 py-3 font-bold text-green-500 bg-green-100 border-2 border-green-500 rounded top-2 right-[45%] text-lg transform -translate-x-1/2"
            >
              {success}
            </motion.div>
          )}
          {currentVersion < maxVersion && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 mb-4 font-bold text-yellow-700 bg-yellow-100 border-l-4 border-yellow-500 rounded"
            >
              You are viewing an older version. You can only edit when viewing the latest version.
            </motion.div>
          )}

          <div className='flex flex-wrap items-center justify-center w-full h-auto gap-10 mt-5'>
            <div>
              <label htmlFor="studentName" className="block mb-1 font-bold text-gray-700">
                Student Name:
              </label>
              {editMode ? (
                <input
                  className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
                  type="text"
                  name="name"
                  id="studentName"
                  placeholder="Enter Student Name"
                  value={formData.name || ""}
                  onChange={handleChange}
                />
              ) : (
                <div className='border-2 border-gray-100 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-400 outline-none mb-4 overflow-hidden'>
                  <p className='mx-2 text-gray-400'>{formData.name || 'N/A'}</p>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="admissionNo" className="block mb-1 font-bold text-gray-700">
                Admission Number:
              </label>
              <div className='border-2 border-gray-100 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-400 outline-none mb-4 overflow-hidden'>
                <p className='mx-2 text-gray-400'>{formData.admission_no || 'N/A'}</p>
              </div>
            </div>
            <div>
              <label htmlFor="parentName" className="block mb-1 font-bold text-gray-700">
                Parent Name:
              </label>
              {editMode ? (
                <input
                  className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
                  type="text"
                  name="parent_name"
                  id="parentName"
                  placeholder="Enter Parent Name"
                  value={formData.parent_name || ""}
                  onChange={handleChange}
                />
              ) : (
                <div className='border-2 border-gray-100 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-400 outline-none mb-4 overflow-hidden'>
                  <p className='mx-2 text-gray-400'>{formData.parent_name || 'N/A'}</p>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="personalEmail" className="block mb-1 font-bold text-gray-700">
                Personal Email:
              </label>
              {editMode ? (
                <input
                  className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
                  type="email"
                  name="email"
                  id="personalEmail"
                  placeholder="Enter Personal Email"
                  value={formData.email || ""}
                  onChange={handleChange}
                />
              ) : (
                <div className='border-2 border-gray-100 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-400 outline-none mb-4 overflow-hidden'>
                  <p className='mx-2 text-gray-400'>{formData.email || 'N/A'}</p>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="parentNo" className="block mb-1 font-bold text-gray-700">
                Parent Mobile Number:
              </label>
              {editMode ? (
                <input
                  className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
                  type="text"
                  name="parent_no"
                  id="parentNo"
                  placeholder="Enter Parent Mobile Number (10 digits)"
                  value={formData.parent_no || ""}
                  onChange={(e) => handlePhoneNumberChange(e, 'parent_no')}
                  maxLength={10}
                />
              ) : (
                <div className='border-2 border-gray-100 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-400 outline-none mb-4 overflow-hidden'>
                  <p className='mx-2 text-gray-400'>{formData.parent_no || 'N/A'}</p>
                </div>
              )}
              {parentNoError && editMode && (
                <p className="text-xs text-red-500">{parentNoError}</p>
              )}
            </div>
            <div>
              <label htmlFor="studentNo" className="block mb-1 font-bold text-gray-700">
                Student Mobile Number:
              </label>
              {editMode ? (
                <input
                  className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
                  type="text"
                  name="student_no"
                  id="studentNo"
                  placeholder="Enter Student Mobile Number (10 digits)"
                  value={formData.student_no || ""}
                  onChange={(e) => handlePhoneNumberChange(e, 'student_no')}
                  maxLength={10}
                />
              ) : (
                <div className='border-2 border-gray-100 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-400 outline-none mb-4 overflow-hidden'>
                  <p className='mx-2 text-gray-400'>{formData.student_no || 'N/A'}</p>
                </div>
              )}
              {studentNoError && editMode && (
                <p className="text-xs text-red-500">{studentNoError}</p>
              )}
            </div>
            <div>
              <label htmlFor="studies" className="block mb-1 font-bold text-gray-700">
                Program:
              </label>
              {editMode ? (
                <select
                  className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
                  name="studies"
                  id="studies"
                  value={formData.studies || ""}
                  onChange={handleProgramChange}
                >
                  <option value="">Select Program</option>
                  <option value="UG">UG - Regular</option>
                  <option value="PG_MBA">PG - MBA</option>
                  <option value="PG_ME">PG - ME</option>
                  <option value="LATERAL">UG - LATERAL</option>
                </select>
              ) : (
                <div className="border-2 border-gray-100 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-400 outline-none mb-4 overflow-hidden">
                  <p className="mx-2 text-gray-400">{formData.studies || 'N/A'}</p>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="dept" className="block mb-1 font-bold text-gray-700">
                Department:
              </label>
              {editMode ? (
                <select
                  className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
                  name="department"
                  id="dept"
                  value={formData.department || ""}
                  onChange={handleChange}
                  disabled={!formData.studies || formData.studies === 'PG_MBA'}
                >
                  <option value="">Select Department</option>
                  {departmentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="border-2 border-gray-100 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-400 outline-none mb-4 overflow-hidden">
                  <p className="mx-2 text-gray-400">{formData.department || 'N/A'}</p>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="quota" className="block mb-1 font-bold text-gray-700">
                Quota:
              </label>
              {editMode ? (
                <select
                  className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
                  name="quota"
                  id="quota"
                  value={formData.quota || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Quota</option>
                  <option value="MQ">Management Quota</option>
                  <option value="GQ">Government Quota</option>
                </select>
              ) : (
                <div className="border-2 border-gray-100 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-400 outline-none mb-4 overflow-hidden">
                  <p className="mx-2 text-gray-400">{formData.quota || 'N/A'}</p>
                </div>
              )}
            </div>
          </div>
          <div className='flex items-center justify-end w-full px-[5%] py-5 gap-5'>
            {!editMode && formData.username && (
              <div className="flex justify-center w-full mb-4">
                <div className="px-4 py-2 text-black bg-blue-100 border border-blue-300 rounded-md">
                  <span className="font-bold">{currentVersion === 0 ? 'Created by:' : 'Modified by:'}</span> {formData.username} on {formatDate(formData.date)}
                </div>
              </div>
            )}
            {maxVersion > 0 && (
              <div className="flex items-center h-[40px]">
                <button
                  className="px-3 py-2.5 font-bold text-white bg-blue-500 h-full rounded-l-md disabled:opacity-50"
                  onClick={() => handleVersionChange(-1)}
                  disabled={currentVersion <= 0}
                >
                  <IoIosArrowBack />
                </button>
                <div className="flex items-center justify-center h-full px-4 py-2 font-bold text-gray-700 bg-blue-200 border-t border-b border-blue-300">
                  Version {currentVersion}
                </div>
                <button
                  className="h-full px-3 py-2.5 font-bold text-white bg-blue-500 rounded-r-md disabled:opacity-50"
                  onClick={() => handleVersionChange(1)}
                  disabled={currentVersion >= maxVersion}
                >
                  <IoIosArrowForward />
                </button>
              </div>
            )}
          </div>

          {formData.files && formData.files.length > 0 && (
            <DocumentTable
              studentData={formData}
              editMode={editMode}
              updateFileData={updateFileData}
            />
          )}

          {/* Remarks Section */}
          <div className="mx-10 my-6">
            {editMode && (!formData.remark && !isRemarkActive) ? (
              <div
                onClick={handleRemarkClick}
                className="flex flex-col items-center justify-center w-full p-6 text-gray-500 border-2 border-gray-400 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
              >
                <div className="flex flex-col items-center justify-center">
                  <IoMdAdd className="w-10 h-10 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Add a remark</p>
                </div>
              </div>
            ) : editMode ? (
              <div className="w-full">
                <label htmlFor="remark" className="block mb-2 font-bold text-gray-700">
                  Remark:
                </label>
                <textarea
                  className="w-full px-4 py-3 text-gray-600 border-2 border-gray-400 rounded-md bg-gray-50 focus:outline-none focus:border-blue-500"
                  name="remark"
                  id="remark"
                  rows={4}
                  placeholder="Enter your remarks about this student..."
                  value={formData.remark || ""}
                  onChange={handleChange}
                ></textarea>
              </div>
            ) : formData.remark ? (
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-md">
                <h3 className="mb-2 text-lg font-bold text-gray-700">Remark:</h3>
                <p className="text-gray-600">{formData.remark}</p>
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-between mx-10 my-5">
            <div className="flex items-center">
              {editMode ? (
                <button
                  className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md flex items-center justify-center min-w-[80px]"
                  onClick={openConfirmationPopup}
                  disabled={savingLoading}
                >
                  {savingLoading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              ) : (
                <button
                  className={`px-4 py-2 font-bold text-white rounded-md flex items-center justify-center min-w-[80px] ${currentVersion === maxVersion ? 'bg-blue-500' : 'bg-gray-400 cursor-not-allowed'}`}
                  onClick={handleEdit}
                  disabled={currentVersion !== maxVersion}
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {showPopup && <ConfirmationPopup />}
        </div>
      )}
    </div>
  );
};

export default EditFile;