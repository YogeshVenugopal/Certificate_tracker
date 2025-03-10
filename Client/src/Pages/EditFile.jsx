import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DocumentTable from '../Components/DocumentTable';

const EditFile = () => {
  const { id } = useParams();
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

  const handleEdit = () => {
    setEditMode(!editMode);
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
        alert("Student data updated successfully!");
      } else {
        console.error("Failed to update student data");
        alert("Failed to update student data");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating student data: " + error.message);
    }
  };

  useEffect(() => {
    const getStudentDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/getStudent/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
          const resData = await response.json();
          setFormData(resData); // Update state with fetched data
          console.log("Fetched student data:", resData);
        } else {
          console.log("Process failed");
          alert("Failed to fetch student data");
        }
      } catch (error) {
        console.log("Fetch error:", error);
        alert("Error fetching student data: " + error.message);
      }
    };

    getStudentDetails();
  }, [id]);

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

  return (
    <div>
      <div className='font-semibold'>
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

        {/* Save/Edit Button */}
        <div className="flex items-center justify-end mx-10 my-5">
          {editMode ? (
            <span className='flex justify-end w-full gap-4'>
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
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md"
              onClick={handleEdit}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditFile;