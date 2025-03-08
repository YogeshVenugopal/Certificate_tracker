import React, { useState } from 'react';
import { emailVerification } from '../Utils/utils';
import { motion } from 'framer-motion';
import sampleImg from '../Assets/sample-removebg-preview.png';
import GetDocument from '../Components/GetDocument';
const NewEntry = () => {
  const [studentName, setStudentName] = useState('');
  const [adminNo, setAdminNo] = useState('');
  const [parentName, setParentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [dept, setDept] = useState('');
  const [quota, setQuota] = useState('');
  const [studies, setStudies] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [parentNo, setParentNo] = useState(0);
  const [studentNo, setStudentNo] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [firstGraduation, setFirstGraduation] = useState(null);
  const [diploma, setDiploma] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);


  const fetchDocuments = async (document) => {
    if (!document) {
        setError('Invalid document category');
        setLoading(false);
        return;
    }
    console.log(document);
    setLoading(true);
    try {
        const response = await fetch(`http://localhost:3000/getDocument/${document}`);
        if (!response.ok) throw new Error('Failed to fetch documents');

        const result = await response.json();
        console.log('API Response:', result);

        // Check if 'data' array exists and contains at least one object
        if (!result.data || !Array.isArray(result.data) || result.data.length === 0) {
            throw new Error('No documents found');
        }

        // Extract documents from 'file' key
        const documentNames = result.data[0].file;

        if (!documentNames || !Array.isArray(documentNames) || documentNames.length === 0) {
            throw new Error('No documents found');
        }

        // Format documents
        const formattedDocs = documentNames.map((docName, index) => ({
            id: index,
            name: docName,
            original: false,
            photocopy: false,
            count: 0
        }));

        setDocuments(formattedDocs);
        setSelectedDocs(formattedDocs);
    } catch (error) {
        console.error('Error fetching documents:', error);
        setError(error.message);
    } finally {
        setLoading(false);
    }
};


  const setTimeOut = () => {
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
  };
  const determineDocCategory = (studies, quota, firstGraduation, diploma) => {
    if (studies === 'UG' && quota === 'GQ' && !firstGraduation) return 'UG+GQ';
    if (studies === 'UG' && quota === 'GQ' && firstGraduation) return 'UG+GQ&FG';
    if (studies === 'UG' && quota === 'MQ') return 'UG+MQ';
    if (studies === 'LATERAL' && quota === 'GQ' && !firstGraduation) return 'LATERAL+GQ';
    if (studies === 'LATERAL' && quota === 'GQ' && firstGraduation) return 'LATERAL+GQ&FG';
    if (studies === 'LATERAL' && quota === 'MQ') return 'LATERAL+MQ';
    if (studies === 'PG_MBA' && quota === 'GQ') return 'PG_MBA+GQ';
    if (studies === 'PG_MBA' && quota === 'MQ') return 'PG_MBA+MQ';
    if (studies === 'PG_ME' && quota === 'GQ' && !diploma) return 'PG_ME+GQ!D';
    if (studies === 'PG_ME' && quota === 'MQ' && !diploma) return 'PG_ME+MQ!D';
    if (studies === 'PG_ME' && quota === 'GQ' && diploma) return 'PG_ME+GQ&D';
    if (studies === 'PG_ME' && quota === 'MQ' && diploma) return 'PG_ME+MQ&D';
    return null;
  };

  const clearData = () => {
    setStudentName('');
    setAdminNo('');
    setParentName('');
    setDept('');
    setQuota('');
    setStudies('');
    setPersonalEmail('');
    setParentNo('');
    setStudentNo('');
    setError('');
    setSuccess('');
    setFirstGraduation('');
    setDiploma('');
    setShowTable(false);
    setDocuments([]);
    setSelectedDocs([]);  
    
  }
  const handleSubmitStudent = async () => {
    const studentData = {
      name: studentName,
      admission_no: adminNo,
      parent_name: parentName,
      email: personalEmail,
      parent_no: parentNo,
      student_no: studentNo,
      department: dept,
      quota: quota,
      studies: studies,
      files: selectedDocs
    };
    if (studies === 'UG' || studies === 'PG') {
      if (quota === 'MQ') {
        studentData.first_graduate = firstGraduation;
      }
    }
    
    if (studies === 'PG_ME') {
      studentData.diploma = diploma; 
    }
    
  
    console.log(studentData);
  
    try {
      const response = await fetch('http://localhost:3000/create-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
      });
  
      if (response.ok) {
        setSuccess('Student created successfully');
        clearData(); // Make sure this clears all relevant form data
      } else {
        const errorMessage = await response.text();
        setError(`Failed to create student: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error submitting student data:", error);
      setError('An unexpected error occurred');
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!studentName || !adminNo || !parentName || !personalEmail || !parentNo || !studentNo) {
      setError('All fields are required');
      setTimeOut();
      return;
    }

    if (!emailVerification(personalEmail)) {
      setError('Please enter a valid email');
      setTimeOut();
      return;
    }
    const docCategory = determineDocCategory(studies, quota, firstGraduation, diploma);
    if (docCategory) {
      fetchDocuments(docCategory);
      setShowTable(true);
      setSuccess('Form submitted successfully');
    } else {
      setError('Failed to fetch documents');
    }
    setTimeOut();
    
    setShowTable(true);
    setSuccess('Form submitted successfully');
    setTimeOut();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='font-semibold'>
        <div className='flex flex-wrap items-center justify-center w-full h-auto gap-10 mt-5'>
          <div>
            <label htmlFor="studentName" className="block mb-1 font-bold text-gray-700">
              Student Name:
            </label>
            <input
              className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
              type="text"
              name="studentName"
              id="studentName"
              placeholder="Enter Student Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="adminNo" className="block mb-1 font-bold text-gray-700">
              Admission Number:
            </label>
            <input
              className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
              type="text"
              name="adminNo"
              id="adminNo"
              placeholder="Enter Admin Number"
              value={adminNo}
              onChange={(e) => setAdminNo(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="parentName" className="block mb-1 font-bold text-gray-700">
              Parent Name:
            </label>
            <input
              className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
              type="text"
              name="parentName"
              id="parentName"
              placeholder="Enter Parent Name"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="personalEmail" className="block mb-1 font-bold text-gray-700">
              Personal Email:
            </label>
            <input
              className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
              type="email"
              name="personalEmail"
              id="personalEmail"
              placeholder="Enter Personal Email"
              value={personalEmail}
              onChange={(e) => setPersonalEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="parentNo" className="block mb-1 font-bold text-gray-700">
              Parent Mobile Number:
            </label>
            <input
              className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
              type="text"
              name="parentNo"
              id="parentNo"
              placeholder="Enter Parent Mobile Number"
              value={parentNo}
              onChange={(e) => setParentNo(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="studentNo" className="block mb-1 font-bold text-gray-700">
              Student Mobile Number:
            </label>
            <input
              className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
              type="text"
              name="studentNo"
              id="studentNo"
              placeholder="Enter Student Mobile Number"
              value={studentNo}
              onChange={(e) => setStudentNo(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="dept" className="block mb-1 font-bold text-gray-700">
              Department:
            </label>
            <select
              className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
              name="dept"
              id="dept"
              value={dept}
              onChange={(e) => setDept(e.target.value)}
            >
              <option value="">Select Department</option>
              <option value="CSE">CSE</option>
              <option value="AIDS">AIDS</option>
              <option value="ECE">ECE</option>
              <option value="IT">IT</option>
              <option value="CSBS">CSBS</option>
              <option value="AIML">AIML</option>
              <option value="CYS">CYS</option>
              <option value="Mech">Mech</option>
            </select>
          </div>
          <div>
            <label htmlFor="quota" className="block mb-1 font-bold text-gray-700">
              Quota:
            </label>
            <select
              className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
              name="quota"
              id="quota"
              value={quota}
              onChange={(e) => setQuota(e.target.value)}
            >
              <option value="">Select Quota</option>
              <option value="MQ">Management Quota</option>
              <option value="GQ">Government Quota</option>
            </select>
          </div>
          <div>
            <label htmlFor="studies" className="block mb-1 font-bold text-gray-700">
              Studies:
            </label>
            <select
              className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
              name="studies"
              id="studies"
              value={studies}
              onChange={(e) => setStudies(e.target.value)}
            >
              <option value="">Select Studies</option>
              <option value="UG">UG</option>
              <option value="PG_MBA">PG - MBA</option>
              <option value="PG_ME">PG - ME</option>
              <option value="Lateral">Lateral</option>
            </select>
          </div>
          {quota === "GQ" && (studies === "UG" || studies === "Lateral") && (<div>
            <label htmlFor="firstGraduation" className="block mb-1 font-bold text-gray-700">
              First Graduation:
            </label>
            <select
              className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
              name="firstGraduation"
              id="firstGraduation"
              value={firstGraduation}
              onChange={(e) => setFirstGraduation(e.target.value)}
            >
              <option value="">Select Option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>)}
          {studies === "PG_ME" && (<div>
            <label htmlFor="firstGraduation" className="block mb-1 font-bold text-gray-700">
              Diploma:
            </label>
            <select
              className="border-2 border-gray-400 w-[250px] bg-gray-200 px-3 py-2 rounded-md text-gray-600 outline-none mb-4"
              name="diploma"
              id="diploma"
              value={diploma}
              onChange={(e) => setDiploma(e.target.value)}
            >
              <option value="">Select Option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>)}
        </div>
        <div className='flex items-center justify-center w-full'>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 w-[20%] mt-[10%] mb-[2%]"
            style={{ display: 'block', marginTop: '20px' }}
          >
            Generate Documents
          </button>
        </div>
      </form>
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
      {loading && (
        <div className="flex items-center justify-center mt-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1.1 }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"
          />
          <p className="ml-2 font-semibold text-blue-500">Fetching Documents...</p>
        </div>
      )}
      {
        showTable ?
          <GetDocument selectedDocs={selectedDocs} setSelectedDocs={setSelectedDocs} handleSubmitStudent={handleSubmitStudent}/>
          :
          <div className='relative flex items-center justify-center w-full h-auto'>
            <motion.div
              initial={{ y: 100 }}
              animate={{
                opacity: 1,
                y: [0, 10, 0], // Bounce animation
              }}
              transition={{
                duration: 1.5,
                delay: 0.5,
                repeat: Infinity, // Keeps the bounce looping
                repeatType: 'loop',
              }}
              className='absolute z-10 flex items-center justify-center w-full text-6xl font-bold text-zinc-500 top-3'
            >
              Ready to Generate Document
            </motion.div>

            <motion.img
              initial={{ y: -100 }}
              animate={{
                opacity: 1,
                y: [0, -10, 0], // Bounce animation
              }}
              transition={{
                duration: 1.5,
                delay: 0.5,
                repeat: Infinity, // Keeps the bounce looping
                repeatType: 'loop',
              }}
              src={sampleImg}
              alt="Img"
              className='grayscale'
            />
          </div>}


    </>
  );
};

export default NewEntry;
