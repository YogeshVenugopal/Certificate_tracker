import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import studentData from '../MockData/sampleData.json';
import DocumentTable from '../Components/DocumentTable';
const EditFile = () => {
  const { id } = useParams();
  const student = studentData.studentsdata.find(student => student.id === parseInt(id, 10));

  const [formData, setFormData] = useState({ ...student });
  const [editMode, setEditMode] = useState(false);

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // console.log(student);
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
                value={formData.name}
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
                value={formData.admission_no}
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
                value={formData.parent_name}
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
                value={formData.parent_no}
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
                value={formData.email}
                onChange={handleChange}
              />
            ) : (
              <div className='border-2 border-gray-100 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-400 outline-none mb-4'>
                <p className='mx-2 text-gray-400'>{formData.email}</p>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="studentNo" className="block mb-1 font-bold text-gray-700">
              Student No:
            </label>
            {editMode ? (
              <input
                className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
                type="parentNo"
                name="parentNo"
                id="parentNo"
                placeholder="Enter Your student Number..."
                value={formData.student_no}
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
                value={formData.department}
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

          <div>
            <label htmlFor="quota" className="block mb-1 font-bold text-gray-700">
              Quota:
            </label>
            {editMode ? (
              <select
                className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
                name="quota"
                id="quota"
                value={formData.quota ? "true" : "false"}  // Ensure proper value binding
                onChange={(e) =>
                  setFormData({ ...formData, quota: e.target.value === "true" })  // Convert string to boolean
                }
              >
                <option value="true">Management Quota</option>
                <option value="false">Government Quota</option>
              </select>
            ) : (
              <div className="border-2 border-gray-100 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-400 outline-none mb-4">
                <p className="mx-2 text-gray-400">{formData.quota ? "Management Quota" : "Government Quota"}</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="studies" className="block mb-1 font-bold text-gray-700">
              Studies:
            </label>
            {editMode ? (
              <select
                className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
                name="studies"
                id="studies"
                value={formData.studies}
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
        {/* Edit/Save Button */}
        <DocumentTable studentData={student} editMode={editMode} type={"Edit"}/>
        <div className="flex items-center justify-end mx-10 mt-5">
          {
            editMode ?
              <span className='flex justify-end w-full gap-4'>
                <div className='flex items-center gap-4'>
                  <p>Confirmed the changes</p>
                  <input type="checkbox" name="locked" id="locked" onChange={formData.locked} />
                </div>
                <button
                  className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md"
                  onClick={handleEdit}
                >
                  Save
                </button>
              </span> :
              <button
                className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md"
                onClick={handleEdit}
              >
                Edit
              </button>
          }

        </div>
      </div >
    </div >
  );
};

export default EditFile;
