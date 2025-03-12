import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DocumentTable from '../Components/DocumentTable';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
const EditFile = () => {
  const { id } = useParams();
  const { version } = useParams();
  const maxVersion = parseInt(version);
  const [currentVersion, setCurrentVersion] = useState(parseInt(version) || 0);
  // const navigate = useNavigate();
  console.log(id, version);
  
  const [formData, setFormData] = useState({
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
    files: []
  });
  
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleEdit = () => {
    // Only allow edit if currentVersion equals maxVersion
    if (currentVersion === maxVersion) {
      setEditMode(!editMode);
    } else {
      setError('You can only edit the latest version of this document');
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    console.log("Sending data", formData);
    try {
      const response = await fetch(`http://localhost:3000/updateStudent/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setEditMode(false);
        setSuccess('Student data updated successfully');
        
        setTimeout(() => {
          setSuccess('');
        }, 5000);
      } else {
        console.error("Failed to update student data");
        setError('Failed to save the student changes...!');
        setTimeout(() => {
          setError('');
        }, 5000);
      }
    } catch (error) {
      console.error("Update error:", error);
      setError('Failed to save the student changes...!', error);
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  const handleVersionChange = (increment) => {
    const newVersion = currentVersion + increment;
    
    // Ensure version is within bounds
    if (newVersion >= 0 && newVersion <= maxVersion) {
      setCurrentVersion(newVersion)
      fetchStudentData(newVersion);
      
      // Disable edit mode if not on the latest version
      if (newVersion !== maxVersion) {
        setEditMode(false);
      }
    }


  };

  const fetchStudentData = async (versionToFetch) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/getStudent/${id}/${versionToFetch}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const resData = await response.json();
        setFormData(resData);
        setSuccess('Fetched student data successfully');
        setTimeout(() => {
          setSuccess('');
        }, 5000);
      } else {
        console.log("Process failed");
        setError('Failed to fetch student data');
        setTimeout(() => {
          setError('');
        }, 5000);
      }
    } catch (error) {
      console.log("Fetch error:", error);
      setError('Error fetching student data: ' + error.message);
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Then fetch the student data for the current version
    const initialVersion = parseInt(version) || 0;
    setCurrentVersion(initialVersion);
    fetchStudentData(initialVersion);
  }, [id, version]);

  // Handling file data updates
  const updateFileData = (index, field, value) => {
    if (formData.files && formData.files.length > 0) {
      const updatedFiles = [...formData.files];
      updatedFiles[index] = {
        ...updatedFiles[index],
        [field]: value
      };
      setFormData({
        ...formData,
        files: updatedFiles
      });
    }
  };

  console.log(currentVersion, maxVersion)
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
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute px-3 py-3 font-bold text-red-500 bg-white border-l-2 border-red-500 rounded top-2 right-5"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute px-3 py-3 font-bold text-green-500 bg-white border-l-2 border-green-500 rounded top-2 right-5"
            >
              {success}
            </motion.div>
          )}
          
          {/* Version warning message */}
          {currentVersion < maxVersion && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 mb-4 font-bold text-yellow-700 bg-yellow-100 border-l-4 border-yellow-500 rounded"
            >
              You are viewing an older version. You can only edit when viewing the latest version.
            </motion.div>
          )}
          
          <div className='flex flex-wrap items-center justify-center w-full h-auto gap-10 my-5 mt-5'>
            {/* Student Name */}
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
                <div className='border-2 border-gray-100 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-400 outline-none mb-4'>
                  <p className='mx-2 text-gray-400'>{formData.name}</p>
                </div>
              )}
            </div>

            {/* Admission Number */}
            <div>
              <label htmlFor="admissionNo" className="block mb-1 font-bold text-gray-700">
                Admission No:
              </label>
              {editMode ? (
                <input
                  className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
                  type="text"
                  name="admission_no"
                  id="admissionNo"
                  placeholder="Enter Admission No"
                  value={formData.admission_no || ""}
                  onChange={handleChange}
                />
              ) : (
                <div className='border-2 border-gray-100 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-400 outline-none mb-4'>
                  <p className='mx-2 text-gray-400'>{formData.admission_no}</p>
                </div>
              )}
            </div>

            {/* Parent Name */}
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
                <div className='border-2 border-gray-100 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-400 outline-none mb-4'>
                  <p className='mx-2 text-gray-400'>{formData.parent_name}</p>
                </div>
              )}
            </div>

            {/* Parent No */}
            <div>
              <label htmlFor="parentNo" className="block mb-1 font-bold text-gray-700">
                Parent No:
              </label>
              {editMode ? (
                <input
                  className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
                  type="text"
                  name="parent_no"
                  id="parentNo"
                  placeholder="Enter Parent No"
                  value={formData.parent_no || ""}
                  onChange={handleChange}
                />
              ) : (
                <div className='border-2 border-gray-100 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-400 outline-none mb-4'>
                  <p className='mx-2 text-gray-400'>{formData.parent_no}</p>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-1 font-bold text-gray-700">
                Personal Email:
              </label>
              {editMode ? (
                <input
                  className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter Email"
                  value={formData.email || ""}
                  onChange={handleChange}
                />
              ) : (
                <div className='border-2 border-gray-100 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-400 outline-none mb-4'>
                  <p className='mx-2 text-gray-400'>{formData.email}</p>
                </div>
              )}
            </div>

            {/* Student No */}
            <div>
              <label htmlFor="studentNo" className="block mb-1 font-bold text-gray-700">
                Student No:
              </label>
              {editMode ? (
                <input
                  className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
                  type="text"
                  name="student_no"
                  id="studentNo"
                  placeholder="Enter Your student Number..."
                  value={formData.student_no || ""}
                  onChange={handleChange}
                />
              ) : (
                <div className='border-2 border-gray-100 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-400 outline-none mb-4'>
                  <p className='mx-2 text-gray-400'>{formData.student_no}</p>
                </div>
              )}
            </div>

            {/* Department */}
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
                >
                  <option value="CSE">CSE</option>
                  <option value="AIDS">AIDS</option>
                  <option value="ECE">ECE</option>
                  <option value="IT">IT</option>
                  <option value="CSBS">CSBS</option>
                  <option value="AIML">AIML</option>
                  <option value="CYS">CYS</option>
                  <option value="Mech">Mech</option>
                </select>
              ) : (
                <div className="border-2 border-gray-100 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-400 outline-none mb-4">
                  <p className="mx-2 text-gray-400">{formData.department}</p>
                </div>
              )}
            </div>

            {/* Quota */}
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
                  <option value="MQ">Management Quota</option>
                  <option value="GQ">Government Quota</option>
                </select>
              ) : (
                <div className="border-2 border-gray-100 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-400 outline-none mb-4">
                  <p className="mx-2 text-gray-400">
                    {formData.quota === "MQ" ? "Management Quota" : "Government Quota"}
                  </p>
                </div>
              )}
            </div>

            {/* Studies */}
            <div>
              <label htmlFor="studies" className="block mb-1 font-bold text-gray-700">
                Studies:
              </label>
              {editMode ? (
                <select
                  className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
                  name="studies"
                  id="studies"
                  value={formData.studies || ""}
                  onChange={handleChange}
                >
                  <option value="UG">UG</option>
                  <option value="PG">PG</option>
                  <option value="MBA">MBA</option>
                </select>
              ) : (
                <div className="border-2 border-gray-100 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-400 outline-none mb-4">
                  <p className="mx-2 text-gray-400">{formData.studies}</p>
                </div>
              )}
            </div>
          </div>

          {/* Files Table */}
          {formData.files && formData.files.length > 0 && (
            <DocumentTable
              studentData={formData}
              editMode={editMode}
              type={"Edit"}
              updateFileData={updateFileData}
            />
          )}

          {/* Save/Edit Button and Version Control */}
          <div className="flex items-center justify-between mx-10 my-5">
            {/* Version Control buttons */}
            {maxVersion > 0 && (
              <div className="flex items-center">
                <button
                  className="px-3 py-2 font-bold text-white bg-gray-500 rounded-l-md disabled:opacity-50"
                  onClick={() => handleVersionChange(-1)}
                  disabled={currentVersion <= 0}
                >
                  &lt;
                </button>
                <div className="flex items-center justify-center px-4 py-2 font-bold text-gray-700 bg-gray-200 border-t border-b border-gray-300">
                  Version: {currentVersion}
                </div>
                <button
                  className="px-3 py-2 font-bold text-white bg-gray-500 rounded-r-md disabled:opacity-50"
                  onClick={() => handleVersionChange(1)}
                  disabled={currentVersion >= maxVersion}
                >
                  &gt;
                </button>
              </div>
            )}
            
            {/* Save/Edit buttons */}
            <div className="flex items-center">
              {editMode ? (
                <span className='flex justify-end gap-4'>
                  <div className='flex items-center gap-4'>
                    <p>Confirmed the changes</p>
                    <input
                      type="checkbox"
                      name="locked"
                      id="locked"
                      checked={formData.locked || false}
                      onChange={(e) => setFormData({ ...formData, locked: e.target.checked })}
                    />
                  </div>
                  <button
                    className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </span>
              ) : (
                <button
                  className={`px-4 py-2 font-bold text-white rounded-md ${currentVersion === maxVersion ? 'bg-blue-500' : 'bg-gray-400 cursor-not-allowed'}`}
                  onClick={handleEdit}
                  disabled={currentVersion !== maxVersion}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditFile;